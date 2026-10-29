'use strict';
const S=require('./_lib/security');
module.exports=async(req,res)=>{
 S.headers(res);if(!S.method(req,['GET','POST','DELETE'],res))return;
 if(!S.authRequired(req,res))return;
 if(req.method!=='GET'&&!S.sameOrigin(req))return S.err(res,403,'Origin validation failed');
 // Lazy-load CCXT: exchange identifiers are validated against its maintained catalog.
 const ccxt=require('ccxt');
 const list=S.accounts(req);
 if(req.method==='GET')return res.status(200).json({ok:true,accounts:list.map(({id,exchange,label})=>({id,exchange,label})),supported:ccxt.exchanges.slice().sort()});
 if(req.method==='DELETE'){
  const id=String(req.body?.id||'');const next=id==='all'?[]:list.filter(x=>x.id!==id);
  const value=S.seal({list:next});S.setCookies(res,[S.cookie(S.ACCOUNTS,value)]);
  return res.status(200).json({ok:true,accounts:next.map(({id,exchange,label})=>({id,exchange,label}))});
 }
 const b=req.body||{};if(JSON.stringify(b).length>3600)return S.err(res,413,'Credential payload too large');
 const exchange=String(b.exchange||'').trim().toLowerCase();
 if(!ccxt.exchanges.includes(exchange))return S.err(res,400,'Unknown exchange ID. Select a CCXT-supported exchange.');
 const apiKey=String(b.apiKey||'').trim(),secret=String(b.secret||'').trim(),passphrase=String(b.passphrase||'').trim(),uid=String(b.uid||'').trim();
 if(!apiKey||!secret||apiKey.length>512||secret.length>512||passphrase.length>512||uid.length>100)return S.err(res,400,'API key and secret are required.');
 if(list.length>=4)return S.err(res,400,'Maximum four exchanges per browser. Remove one to connect another.');
 const label=String(b.label||exchange).replace(/[^a-zA-Z0-9 ._-]/g,'').slice(0,32)||exchange;
 const id=require('node:crypto').randomUUID().slice(0,12),next=[...list,{id,exchange,label,apiKey,secret,passphrase,uid}];
 const token=S.seal({list:next});if(token.length>3600)return S.err(res,400,'Too many credentials for encrypted browser cookie.');
 S.setCookies(res,[S.cookie(S.ACCOUNTS,token)]);
 return res.status(201).json({ok:true,accounts:next.map(({id,exchange,label})=>({id,exchange,label})),message:'Encrypted on this browser. Test balance to confirm exchange API permissions.'});
};