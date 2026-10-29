'use strict';
const crypto=require('node:crypto');
const MAX_AGE=60*60*24*7;
const SESSION='__Host-bert_session', ACCOUNTS='__Host-bert_accounts';
function ready(){return typeof process.env.APP_PASSWORD==='string'&&process.env.APP_PASSWORD.length>=12&&typeof process.env.COOKIE_SECRET==='string'&&process.env.COOKIE_SECRET.length>=32}
function key(){if(!ready())throw Error('SETUP_REQUIRED');return crypto.createHash('sha256').update('bert-template-v1:'+process.env.COOKIE_SECRET).digest()}
function seal(value){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key(),iv),data=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64url')}
function unseal(token){try{if(!token||token.length>5000)return null;const raw=Buffer.from(token,'base64url');if(raw.length<29)return null;const d=crypto.createDecipheriv('aes-256-gcm',key(),raw.subarray(0,12));d.setAuthTag(raw.subarray(12,28));return JSON.parse(Buffer.concat([d.update(raw.subarray(28)),d.final()]).toString('utf8'))}catch{return null}}
function cookies(req){return Object.fromEntries(String(req.headers.cookie||'').split(';').map(x=>{const i=x.indexOf('=');return i<0?['','']:[x.slice(0,i).trim(),x.slice(i+1).trim()]}))}
function session(req){const data=unseal(cookies(req)[SESSION]);return Boolean(data?.kind==='session'&&Number.isFinite(data.exp)&&data.exp>Date.now())}
function accounts(req){if(!session(req))return [];const obj=unseal(cookies(req)[ACCOUNTS]);return Array.isArray(obj?.list)?obj.list:[]}
function cookie(name,value,age=MAX_AGE){return name+'='+value+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+age}
function setCookies(res,list){res.setHeader('Set-Cookie',list)}
function headers(res){res.setHeader('Cache-Control','no-store, max-age=0');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer')}
function method(req,methods,res){if(methods.includes(req.method))return true;res.setHeader('Allow',methods.join(', '));res.status(405).json({ok:false,error:'Method not allowed'});return false}
function sameOrigin(req){const origin=req.headers.origin;if(!origin)return false;try{const url=new URL(origin);return url.protocol==='https:'&&url.host===req.headers.host}catch{return false}}
function equalPassword(v){if(typeof v!=='string'||v.length>256||!ready())return false;const a=crypto.createHash('sha256').update(v).digest(),b=crypto.createHash('sha256').update(process.env.APP_PASSWORD).digest();return crypto.timingSafeEqual(a,b)}
function err(res,status,message){return res.status(status).json({ok:false,error:message})}
function authRequired(req,res){if(!ready()){err(res,503,'Set APP_PASSWORD (12+ chars) and COOKIE_SECRET (32+ chars) in Vercel first.');return false}if(!session(req)){err(res,401,'Login required');return false}return true}
module.exports={ready,seal,unseal,cookies,session,accounts,cookie,setCookies,headers,method,sameOrigin,equalPassword,err,authRequired,SESSION,ACCOUNTS,MAX_AGE};
