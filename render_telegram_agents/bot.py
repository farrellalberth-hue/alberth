"""Telegram-only Render bot. 1 Render service = 1 specialist / 1 Telegram identity."""
import asyncio, hmac, json, logging, math, os, re
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import Request as URLRequest, urlopen
from fastapi import FastAPI, HTTPException, Request
logging.basicConfig(level=logging.INFO)
log=logging.getLogger("crypto_telegram_specialist")
ROLE=os.getenv("AGENT_ROLE","").upper()
TOKEN=os.getenv("TELEGRAM_BOT_TOKEN","")
SECRET=os.getenv("TELEGRAM_WEBHOOK_SECRET","")
OWNER=os.getenv("TELEGRAM_OWNER_ID","")
BASE=os.getenv("RENDER_EXTERNAL_URL",os.getenv("PUBLIC_WEBHOOK_URL","")).rstrip("/")
MANAGER=os.getenv("BIGMOM_URL","").rstrip("/")
MANAGER_KEY=os.getenv("BIGMOM_INGEST_KEY","")
COINS={"BTC":"bitcoin","ETH":"ethereum","SOL":"solana","BNB":"binancecoin","XRP":"ripple","ADA":"cardano","LINK":"chainlink","AVAX":"avalanche-2","SUI":"sui","DOGE":"dogecoin"}
ROLES=("KATAKURI","FRANKY","JIMBE")
def number(x):
    if x is None or isinstance(x,bool):return None
    try:
        y=float(x)
        return y if math.isfinite(y) else None
    except (TypeError,ValueError):return None
def http_get(url):
    req=URLRequest(url,headers={"User-Agent":"CryptoCouncilTelegram/1.0","Accept":"application/json"})
    with urlopen(req,timeout=9) as response:return json.loads(response.read(150000))
def http_post(url,data,headers=None):
    req=URLRequest(url,method="POST",data=json.dumps(data,ensure_ascii=False).encode(),headers={"Content-Type":"application/json",**(headers or {})})
    with urlopen(req,timeout=10) as response:return json.loads(response.read(80000))
def telegram(method,data):
    if not TOKEN:return {"ok":False}
    try:return http_post("https://api.telegram.org/bot"+TOKEN+"/"+method,data)
    except Exception as exc:
        log.warning("telegram_%s_%s",method,type(exc).__name__)
        return {"ok":False}
def reply(chat_id,message):
    return telegram("sendMessage",{"chat_id":chat_id,"text":str(message)[:3900],"disable_web_page_preview":True})
def market(symbol):
    if symbol not in COINS:raise ValueError("Token tidak didukung: "+", ".join(COINS))
    query=urlencode({"vs_currency":"usd","ids":COINS[symbol],"price_change_percentage":"24h"})
    data=http_get("https://api.coingecko.com/api/v3/coins/markets?"+query)
    if not isinstance(data,list) or len(data)!=1:raise ValueError("Market data tidak tersedia")
    x=data[0]
    return {"symbol":symbol,"price":number(x.get("current_price")),"market_cap":number(x.get("market_cap")),
            "fdv":number(x.get("fully_diluted_valuation")),"volume":number(x.get("total_volume")),
            "change_24h":number(x.get("price_change_percentage_24h")),"as_of":x.get("last_updated"),
            "source":"https://www.coingecko.com/en/coins/"+COINS[symbol]}
def risk(nav,stop_pct,risk_pct,held=0,asset_cap_pct=10):
    values=(nav,stop_pct,risk_pct,held,asset_cap_pct)
    if any(not math.isfinite(x) for x in values):return {"status":"INVALID_INPUT"}
    if nav<=0 or not 0<stop_pct<40 or not 0<risk_pct<=1 or held<0 or not 0<asset_cap_pct<=20:
        return {"status":"VETO","reason":"NAV >0, stop 0-40%, risk maks 1%, bobot maks 20%"}
    budget=nav*risk_pct/100
    room=max(0,nav*asset_cap_pct/100-held)
    size=min(budget/(stop_pct/100),room)
    return {"status":"PRELIMINARY","risk_budget_usd":round(budget,2),"max_new_position_usd":round(size,2),
            "missing":"fee, slippage, wallet, correlation, actual liquidity"}
def portfolio(nav,held,cash,limit=10):
    if any(not math.isfinite(x) for x in (nav,held,cash,limit)) or nav<=0 or held<0 or cash<0 or not 0<limit<=20:
        return {"status":"INVALID_INPUT"}
    weight=100*held/nav
    return {"status":"OVERWEIGHT" if weight>limit else "REVIEW","current_weight_pct":round(weight,2),
            "allocation_headroom_usd":round(max(0,nav*limit/100-held),2),"cash_usd":cash}
def fundamentals(m):
    mc,fdv=m["market_cap"],m["fdv"]
    ratio=mc/fdv if mc is not None and fdv is not None and fdv>0 else None
    flags=[]
    if ratio is None:flags.append("FDV unavailable")
    elif ratio<0.45:flags.append("High dilution risk")
    flags.extend(["Audit unverified","Protocol revenue unverified","Unlock schedule unverified"])
    return {"mc_fdv_ratio":round(ratio,4) if ratio is not None else None,
            "status":"NEEDS_FUNDAMENTAL_EVIDENCE","warnings":flags}
def send_to_bigmom(data):
    if not MANAGER or not MANAGER_KEY:return {"accepted":False,"reason":"BIGMOM bridge pending"}
    try:
        r=http_post(MANAGER+"/bigmom/api/report",data,{"Authorization":"Bearer "+MANAGER_KEY})
        return {"accepted":bool(r.get("accepted")),"report_id":r.get("report_id")}
    except Exception as exc:
        log.warning("bigmom_connection_%s",type(exc).__name__)
        return {"accepted":False,"reason":"BIGMOM unavailable"}
def help_text():
    text=ROLE+" | Telegram specialist\n/start /help /id /status\n/analyze BTC (CoinGecko snapshot)\n"
    if ROLE=="KATAKURI":text+="/risk BTC 10000 5 0.5 (NAV USD, stop %, risiko %)\n"
    if ROLE=="JIMBE":text+="/portfolio BTC 10000 500 2000 (NAV, holding, cash USD)\n"
    return text+"\nAlur: specialist → BIGMOM → VIEL → owner. Tidak ada transaksi."
def analyze(symbol):
    m=market(symbol)
    if m["price"] is None or m["market_cap"] is None:raise ValueError("Harga atau market cap kosong")
    out=[ROLE+" — "+symbol,"Harga (CoinGecko): USD "+format(m["price"],",.6g"),
         "Market cap: USD "+format(m["market_cap"],",.0f")]
    if m["change_24h"] is not None:out.append("Perubahan 24 jam: "+format(m["change_24h"],"+.2f")+"%")
    if m["volume"] is not None:out.append("Volume 24 jam: USD "+format(m["volume"],",.0f"))
    report={"agent":ROLE,"symbol":symbol,"stance":"neutral","confidence":0.2,
            "as_of":datetime.now(timezone.utc).isoformat(),"evidence":[m["source"]],"veto":False,
            "source_status":"SUBMITTED_NOT_INDEPENDENTLY_VERIFIED"}
    if ROLE=="FRANKY":
        f=fundamentals(m)
        out.append("MC/FDV: "+(format(f["mc_fdv_ratio"],".1%") if f["mc_fdv_ratio"] is not None else "N/A"))
        out.append("Catatan: "+", ".join(f["warnings"]))
        report.update(warnings=f["warnings"],fundamentals=f)
    elif ROLE=="KATAKURI":
        out.append("Perubahan harian bukan volatilitas 30 hari. Belum ada NAV/stop/posisi terverifikasi.")
        out.append("Gunakan /risk untuk menghitung batas ukuran posisi.")
        report.update(warnings=["Full risk profile unavailable"],risk_score=None)
    elif ROLE=="JIMBE":
        out.append("Bobot portofolio belum diketahui. Gunakan /portfolio untuk simulasi.")
        report.update(target_weight_pct=None,warnings=["Verified portfolio data missing"])
    out.append("Sumber: "+m["source"])
    out.append("Timestamp sumber: "+str(m["as_of"]))
    receipt=send_to_bigmom(report)
    out.append("Laporan BIGMOM: "+("diterima, belum diverifikasi" if receipt["accepted"] else receipt["reason"]))
    return "\n".join(out)
def command(user_id,text):
    tokens=text.strip().split()
    if not tokens:return help_text()
    cmd=tokens[0].split("@",1)[0].lower()
    if cmd in ("/help","/start"):return help_text()
    if cmd=="/id":return "Telegram user ID: "+str(user_id)
    if cmd=="/status":
        return (ROLE+" active | mode Telegram-only\nOwner: "+("configured" if OWNER else "missing")+
                "\nBIGMOM: "+("configured" if MANAGER and MANAGER_KEY else "pending")+"\nTrading disabled.")
    if cmd=="/analyze":
        symbol=tokens[1].upper() if len(tokens)>1 else "BTC"
        try:return analyze(symbol)
        except ValueError as exc:return str(exc)+" — WAIT, tanpa rekomendasi trading."
        except Exception as exc:
            log.warning("market_fetch_%s",type(exc).__name__)
            return "Gagal verifikasi sumber harga. WAIT, jangan buat keputusan."
    if cmd=="/risk" and ROLE=="KATAKURI":
        if len(tokens)!=5 or tokens[1].upper() not in COINS:return "Gunakan /risk BTC 10000 5 0.5"
        args=[number(v) for v in tokens[2:]]
        if any(x is None for x in args):return "Angka tidak valid."
        r=risk(*args)
        return "KATAKURI (simulasi data owner)\n"+json.dumps(r,ensure_ascii=False,indent=2)+"\nBelum disubmit sebagai bukti trading."
    if cmd=="/portfolio" and ROLE=="JIMBE":
        if len(tokens)!=5 or tokens[1].upper() not in COINS:return "Gunakan /portfolio BTC 10000 500 2000"
        args=[number(v) for v in tokens[2:]]
        if any(x is None for x in args):return "Angka tidak valid."
        return "JIMBE (simulasi data owner)\n"+json.dumps(portfolio(*args),ensure_ascii=False,indent=2)+"\nRebalancing perlu BIGMOM + VIEL."
    return help_text()
@asynccontextmanager
async def lifespan(app):
    if TOKEN and SECRET and BASE and ROLE in ROLES:
        result=await asyncio.to_thread(telegram,"setWebhook",{
          "url":BASE+"/telegram/webhook","secret_token":SECRET,
          "allowed_updates":["message"],"drop_pending_updates":False})
        log.info("webhook role=%s success=%s",ROLE,result.get("ok"))
    else:log.warning("inactive role=%s token=%s secret=%s base=%s",ROLE,bool(TOKEN),bool(SECRET),bool(BASE))
    yield
app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None,lifespan=lifespan)
@app.get("/health")
def health():
    return {"ok":ROLE in ROLES,"role":ROLE,"mode":"telegram_only",
            "token_configured":bool(TOKEN),"owner_configured":bool(OWNER),
            "bigmom_connected":bool(MANAGER and MANAGER_KEY),"trading_enabled":False}
@app.post("/telegram/webhook")
async def hook(req:Request):
    if not TOKEN or not SECRET:raise HTTPException(503,"Not configured")
    if not hmac.compare_digest(SECRET,req.headers.get("x-telegram-bot-api-secret-token","")):
        raise HTTPException(403,"Forbidden")
    raw=await req.body()
    if len(raw)>32768:raise HTTPException(413,"Too large")
    try:packet=json.loads(raw)
    except Exception:raise HTTPException(400,"Bad JSON")
    if not isinstance(packet,dict):raise HTTPException(400,"Bad JSON")
    message=packet.get("message") or {}
    if not isinstance(message,dict):return {"ok":True}
    user=message.get("from") or {};chat=message.get("chat") or {}
    uid=user.get("id");cid=chat.get("id");text=message.get("text")
    if not isinstance(uid,int) or not isinstance(cid,int) or not isinstance(text,str) or chat.get("type")!="private":
        return {"ok":True}
    first=text.split(maxsplit=1)
    if first and first[0].lower().split("@",1)[0]=="/id":
        await asyncio.to_thread(reply,cid,"Telegram user ID: "+str(uid))
        return {"ok":True}
    if not OWNER or str(uid)!=OWNER:return {"ok":True}
    try:result=await asyncio.to_thread(command,uid,text)
    except Exception as exc:
        log.error("command_failed_%s",type(exc).__name__)
        result="Agent error. No trade executed."
    await asyncio.to_thread(reply,cid,result)
    return {"ok":True}
