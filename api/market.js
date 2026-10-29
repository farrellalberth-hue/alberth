'use strict';
// Public, exchange-independent market research. No private credentials on this route.
const send=(res,body,cache=60)=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage='+cache+', stale-while-revalidate=120');return res.status(200).json(body)};
const valid=(v)=>Number.isFinite(Number(v))?Number(v):null;
async function get(url){const c=new AbortController(),timer=setTimeout(()=>c.abort(),11000);try{const r=await fetch(url,{headers:{Accept:'application/json'},signal:c.signal});if(!r.ok)throw Error('Provider status '+r.status);return await r.json()}finally{clearTimeout(timer)}}
module.exports=async(req,res)=>{
 if(req.method!=='GET')return res.status(405).json({ok:false,error:'GET only'});
 const type=String(req.query.type||'trending').slice(0,30);
 try{
 if(type==='narratives'){
  const d=await get('https://www.sharpe.ai/api/narratives/data'),rows=Array.isArray(d)?d:(Array.isArray(d?.narratives)?d.narratives:Array.isArray(d?.data)?d.data:[]);
  return send(res,{ok:true,source:'Sharpe Terminal public API',updatedAt:new Date().toISOString(),rows:rows.map(r=>({id:r.id||r.slug,name:r.name,change24h:valid(r.change24h),change7d:valid(r.change7d),change30d:valid(r.change30d),volume24h:valid(r.volume24h),marketCap:valid(r.marketCap),openInterest:valid(r.openInterest),mindsharePct:valid(r.mindsharePct),topCoin:r.topCoin&&{symbol:r.topCoin.symbol,image:r.topCoin.image}}))},900);
 }
 if(type==='logos'){
  const d=await get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=7d%2C30d');
  if(!Array.isArray(d))throw Error('Logo feed invalid');
  return send(res,{ok:true,source:'CoinGecko public API',updatedAt:new Date().toISOString(),rows:d.map(r=>({id:r.id,symbol:r.symbol,name:r.name,image:r.image,rank:r.market_cap_rank,change24h:valid(r.price_change_percentage_24h),change7d:valid(r.price_change_percentage_7d_in_currency),change30d:valid(r.price_change_percentage_30d_in_currency)}))},900);
 }
 if(type==='trending'){
  const page=Math.max(1,Math.min(3,Number(req.query.page)||1)),url='https://api.geckoterminal.com/api/v2/networks/trending_pools?page='+page;
  const d=await get(url+'&include=base_token');const pools=d?.data||[],tokens=new Map((d?.included||[]).map(r=>[r.id,r]));
  const rows=pools.map(p=>{const a=p.attributes||{},t=tokens.get(p.relationships?.base_token?.data?.id)||{},name=t.attributes?.symbol||a.name?.split(' / ')[0]||'Unknown',tx=a.transactions?.h1||{},network=p.relationships?.network?.data?.id||String(p.id||'').split('_')[0];return {symbol:name,network,baseName:t.attributes?.name||name,volume1h:valid(a.volume_usd?.h1),volume24h:valid(a.volume_usd?.h24),liquidity:valid(a.reserve_in_usd),buys:valid(tx.buys),sells:valid(tx.sells),change1h:valid(a.price_change_percentage?.h1),pool:network&&a.address?'https://www.geckoterminal.com/'+network+'/pools/'+a.address:null}}).filter(x=>x.symbol&&x.liquidity!==null);
  return send(res,{ok:true,source:'GeckoTerminal public API',updatedAt:new Date().toISOString(),rows},120);
 }
 if(type==='scatter'){
  const exchange=String(req.query.exchange||'bybit').toLowerCase(),limit=50;
  let rows=[];
  if(exchange==='bybit'){
   const d=await get('https://api.bybit.com/v5/market/tickers?category=linear');
   if(d.retCode!==0||!Array.isArray(d.result?.list))throw Error('Bybit market feed unavailable');
   rows=d.result.list.filter(r=>/USDT$/.test(r.symbol)&&valid(r.openInterestValue)>0).map(r=>({symbol:r.symbol.slice(0,-4),market:r.symbol,oi:valid(r.openInterestValue),change24h:valid(r.price24hPcnt)!==null?Number(r.price24hPcnt)*100:null,volume:valid(r.turnover24h)}));
  }else{
   const ccxt=require('ccxt');
   if(!ccxt.exchanges.includes(exchange))return res.status(400).json({ok:false,error:'Unknown CCXT exchange ID'});
   const X=new ccxt[exchange]({enableRateLimit:true,timeout:10000});
   try{
    if(!X.has.fetchOpenInterests)return res.status(422).json({ok:false,error:'This exchange does not offer CCXT bulk open interest. Select another OI provider.'});
    const o=await X.fetchOpenInterests();const list=Array.isArray(o)?o:Object.values(o||{});
    rows=list.map(r=>({symbol:String(r.symbol||'').split('/')[0],market:r.symbol,oi:valid(r.openInterestValue),change24h:null,volume:null})).filter(r=>r.oi>0).slice(0,100);
    if(X.has.fetchTickers){try{const tickers=await X.fetchTickers(rows.slice(0,60).map(r=>r.market));for(const r of rows){const t=tickers?.[r.market];r.change24h=valid(t?.percentage);r.volume=valid(t?.quoteVolume)}}catch{}}
   }finally{try{await X.close?.()}catch{}}
  }
  rows=rows.filter(r=>r.symbol&&r.oi>0).sort((a,b)=>b.oi-a.oi).slice(0,limit);
  return send(res,{ok:true,source:exchange,updatedAt:new Date().toISOString(),rows,note:'OI is contract positioning, not proof of spot buying. Coverage depends on exchange.'},180);
 }
 return res.status(400).json({ok:false,error:'Unknown market type'});
 }catch(e){res.setHeader('Cache-Control','no-store');return res.status(502).json({ok:false,error:'Market data provider unavailable. Try again later or select a different source.'})}
};