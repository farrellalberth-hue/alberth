'use strict';
const S=require('./_lib/security');
module.exports=async(req,res)=>{
 S.headers(res);if(!S.method(req,['GET','POST','DELETE'],res))return;
 if(!S.ready())return S.err(res,503,'Configure APP_PASSWORD and COOKIE_SECRET in Vercel environment variables.');
 if(req.method==='GET')return res.status(200).json({ok:true,authenticated:S.session(req)});
 if(!S.sameOrigin(req))return S.err(res,403,'Origin validation failed');
 if(req.method==='DELETE'){S.setCookies(res,[S.cookie(S.SESSION,'',0),S.cookie(S.ACCOUNTS,'',0)]);return res.status(200).json({ok:true})}
 if(!S.equalPassword(req.body?.password))return S.err(res,401,'Incorrect password');
 S.setCookies(res,[S.cookie(S.SESSION,S.seal({kind:'session',exp:Date.now()+S.MAX_AGE*1000}))]);
 return res.status(200).json({ok:true});
};