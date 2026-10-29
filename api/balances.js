'use strict';
const S=require('./_lib/security');
module.exports=async(req,res)=>{
 S.headers(res);if(!S.method(req,['GET'],res))return;if(!S.authRequired(req,res))return;
 const ccxt=require('ccxt'),all=S.accounts(req),id=String(req.query?.id||''),targets=id?all.filter(a=>a.id===id):all;
 if(!targets.length)return res.status(200).json({ok:true,results:[]});
 const results=await Promise.all(targets.map(async a=>{
  const out={id:a.id,label:a.label,exchange:a.exchange,ok:false,balances:[],positions:[],time:new Date().toISOString()};
  const C=ccxt[a.exchange];if(!C){out.error='Exchange not supported in installed CCXT version';return out}
  const x=new C({apiKey:a.apiKey,secret:a.secret,password:a.passphrase||undefined,uid:a.uid||undefined,enableRateLimit:true,timeout:14000});
  try{
   if(!x.has.fetchBalance)throw Error('NOT_SUPPORTED');
   const b=await x.fetchBalance();
   out.balances=Object.entries(b.total||{}).filter(([symbol,amount])=>symbol&&Number.isFinite(Number(amount))&&Math.abs(Number(amount))>1e-12).slice(0,40).map(([asset,total])=>({asset,total:Number(total),free:Number(b.free?.[asset]||0),used:Number(b.used?.[asset]||0)}));
   out.ok=true;
   if(x.has.fetchPositions){try{
      const p=await x.fetchPositions();
      out.positions=Array.isArray(p)?p.filter(z=>Math.abs(Number(z.contracts||0))>0).slice(0,15).map(z=>({symbol:z.symbol,side:z.side,contracts:Number(z.contracts||0),notional:Number.isFinite(Number(z.notional))?Number(z.notional):null,unrealizedPnl:Number.isFinite(Number(z.unrealizedPnl))?Number(z.unrealizedPnl):null})):[];
    }catch{out.positionsNote='Position retrieval unsupported or requires additional account permissions.'}}
  }catch(e){const kind=e?.constructor?.name;out.error=kind==='Error'&&e.message==='NOT_SUPPORTED'?'This exchange does not support unified balance fetching.':['AuthenticationError','PermissionDenied','RateLimitExceeded','ExchangeNotAvailable','NetworkError','RequestTimeout','NotSupported','InvalidNonce','ExchangeError'].includes(kind)?'Exchange connection failed ('+kind+'). Check read-only permissions and restrictions.':'Balance unavailable: check exchange permissions or account type.'}
  finally{try{await x.close?.()}catch{}}
  return out;
 }));
 return res.status(200).json({ok:true,results,notice:'Read-only: quantities are not USD valuations. Exchange support varies.'});
};