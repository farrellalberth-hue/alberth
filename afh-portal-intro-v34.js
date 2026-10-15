/* AFH PORTAL V34 — depth-field renderer for original 3D cinematic intro.
   Canvas 2D projected 3D + CSS transform 3D, no external scripts/assets.
   4.65s lifetime, mobile frame cap, reduced-motion and Skip, no audio permission gate. */
(()=>{'use strict';
 const root=document.getElementById('afh-intro-2026');
 if(!root||!root.classList.contains('afh34-opening'))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const key='afh-portal-v34-seen';
 let seen=false;
 try{seen=sessionStorage.getItem(key)==='1'}catch(_){}
 if(reduced||seen){root.remove();return;}
 const canvas=root.querySelector('#afh34-canvas'),ctx=canvas?.getContext('2d',{alpha:true});
 const mobile=matchMedia('(max-width:767px)').matches;
 const save=()=>{try{sessionStorage.setItem(key,'1')}catch(_){}};
 let closed=false,frame=0,last=0,started=performance.now(),killTimer=0,removeTimer=0;
 const duration=4650,TAU=Math.PI*2;
 document.body.classList.add('afc-lock');
 const finish=()=>{
  if(closed)return;
  closed=true;save();document.body.classList.remove('afc-lock');
  if(frame)cancelAnimationFrame(frame);
  if(killTimer)clearTimeout(killTimer);
  root.classList.add('is-exiting');
  document.body.classList.add('afh34-landed');
  removeTimer=setTimeout(()=>{root.remove();document.body.classList.remove('afh34-landed')},720);
 };
 killTimer=setTimeout(finish,duration);
 root.querySelector('#afh34-skip')?.addEventListener('click',finish);
 const onKey=(e)=>{if(e.key==='Escape'||e.key==='Enter'&&e.target===root)finish()};
 addEventListener('keydown',onKey);
 addEventListener('pagehide',finish,{once:true});
 if(!ctx){return}
 let seed=34062026;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const count=mobile?126:255;
 const stars=Array.from({length:count},(_,i)=>{
  const a=random()*TAU,r=Math.sqrt(random())*(mobile?2.6:3.6);
  return{x:Math.cos(a)*r,y:Math.sin(a)*r,z:random()*26+1,sz:.2+random()*1.9,tint:i%9,phase:random()};
 });
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const ease=(x)=>x*x*(3-2*x);
 let w=0,h=0,ratio=1;
 const resize=()=>{
  const rect=canvas.getBoundingClientRect();
  if(rect.width<10||rect.height<10)return false;
  w=rect.width;h=rect.height;
  ratio=Math.min(devicePixelRatio||1,mobile?1.22:1.55,Math.sqrt(1800000/(w*h)));
  const pw=Math.round(w*ratio),ph=Math.round(h*ratio);
  if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph}
  ctx.setTransform(ratio,0,0,ratio,0,0);
  return true;
 };
 const perspective=(x,y,z,offset=0)=>{
  const dz=Math.max(.27,z+2.6),f=Math.min(w,h)*1.07/dz;
  return[w*.5+x*f,h*.485+y*f+offset,f];
 };
 const path=(points,color,width,blur=0,alpha=1)=>{
  if(!points.length)return;
  ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';
  if(blur){ctx.shadowBlur=blur;ctx.shadowColor=color}
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
 };
 const draw=(ms)=>{
  if(!resize())return;
  const t=ms/1000,p=clamp(ms/duration,0,1),warp=ease(clamp((p-.59)/.38,0,1));
  ctx.clearRect(0,0,w,h);
  const cx=w*.5,cy=h*.485,dim=Math.min(w,h);
  // Continuous centre bloom gives the 3D scene depth without any downloaded media.
  let glow=ctx.createRadialGradient(cx,cy,0,cx,cy,dim*.66);
  glow.addColorStop(0,'rgba(255,211,182,.15)');
  glow.addColorStop(.18,'rgba(190,139,201,.07)');
  glow.addColorStop(.64,'rgba(68,85,172,.025)');
  glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  // Fly-through particles with depth-sensitive speed and slight chromatic differences.
  const velocity=ms*.0018+warp*16;
  for(let i=0;i<stars.length;i++){
   const s=stars[i],z=(((s.z-velocity)%28)+28)%28+.2;
   const point=perspective(s.x,s.y,z);
   if(!Number.isFinite(point[0])||point[0]<-12||point[0]>w+12||point[1]<-12||point[1]>h+12)continue;
   const near=clamp(1-z/28,0,1),r=clamp(s.sz*(.6+near*2.6)*point[2]/60,.45,mobile?2.1:3.1);
   const color=s.tint<3?'#f6d7be':s.tint<5?'#c4b8ff':s.tint===6?'#f0ecdf':'#d0d3f2';
   ctx.save();ctx.globalAlpha=clamp(.19+near*.76,0,.93);ctx.fillStyle=color;
   if(r>1.2){ctx.shadowBlur=8;ctx.shadowColor=color}
   ctx.beginPath();ctx.arc(point[0],point[1],r,0,TAU);ctx.fill();
   if(warp>.05){
    const lastPoint=perspective(s.x,s.y,z+clamp(warp*4,.1,3.5));
    ctx.strokeStyle=color;ctx.lineWidth=clamp(r*.6,.45,1.8);
    ctx.beginPath();ctx.moveTo(point[0],point[1]);ctx.lineTo(lastPoint[0],lastPoint[1]);ctx.stroke();
   }
   ctx.restore();
  }
  // Rotating dimensional tunnel composed of real projected rings in 3D space.
  const spin=t*.39;
  for(let i=0;i<9;i++){
   const z=1.1+i*2.5-((velocity*.66)%2.5),rad=3.75+i*.12;
   const circle=[];
   for(let j=0;j<=90;j++){
    const a=j/90*TAU;
    const q=a+spin+i*.15,cs=Math.cos(q),sn=Math.sin(q);
    const y=rad*sn*.80,x=rad*cs;
    circle.push(perspective(x,y,z));
   }
   const alpha=clamp(.22-i*.017,0,.35)*(1-warp*.52);
   path(circle,i%3===0?'#efbfa3':i%3===1?'#afa8ec':'#c2a9c8',i<2?1.4:.6,i<2?10:0,alpha);
   if(i%2===0){
    const a=spin+i*.95,pt=perspective(rad*Math.cos(a),rad*Math.sin(a)*.8,z);
    ctx.fillStyle='#f9e6d2';ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(pt[0],pt[1],1.8,0,TAU);ctx.fill();ctx.globalAlpha=1;
   }
  }
  // Fine orbit lines behind 3D emblem; parallax is geometrically projected rather than CSS scaling.
  const lineCount=mobile?3:5;
  for(let i=0;i<lineCount;i++){
   const ring=[],rad=1.55+i*.23,z=3.2+i*.2,tilt=.22+i*.12;
   const yaw=spin*(i%2?-.67:1.05)+i*.63;
   for(let n=0;n<=120;n++){
    const a=n/120*TAU,rx=rad*Math.cos(a),rz=rad*Math.sin(a),
      x=rx*Math.cos(yaw)-rz*Math.sin(yaw),
      zed=z+rx*Math.sin(yaw)+rz*Math.cos(yaw),
      y=rad*Math.sin(a*1.002)*tilt;
    ring.push(perspective(x,y,zed));
   }
   path(ring,i%2?'#f1caac':'#bfb1ee',.65,0,clamp(.22-warp*.15,0,1));
  }
  if(p>.77){
   const k=ease(clamp((p-.77)/.23,0,1));
   const burst=ctx.createRadialGradient(cx,cy,0,cx,cy,dim*(.08+k*.63));
   burst.addColorStop(0,'rgba(255,244,225,'+(k*.47).toFixed(3)+')');
   burst.addColorStop(.28,'rgba(248,183,167,'+(k*.20).toFixed(3)+')');
   burst.addColorStop(1,'rgba(255,255,255,0)');
   ctx.fillStyle=burst;ctx.fillRect(0,0,w,h);
  }
 };
 const tick=(now)=>{
  frame=0;if(closed||document.hidden)return;
  const gap=mobile?36:21;
  if(last&&now-last<gap-3){frame=requestAnimationFrame(tick);return}
  last=now;
  draw(Math.min(duration,Math.max(0,now-started)));
  if(!closed&&now-started<duration)frame=requestAnimationFrame(tick);
 };
 resize();draw(0);
 frame=requestAnimationFrame(tick);
 addEventListener('resize',()=>{if(!closed){resize();draw(clamp(performance.now()-started,0,duration))}},{passive:true});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){if(frame){cancelAnimationFrame(frame);frame=0}}
  else if(!closed){frame=requestAnimationFrame(tick)}
 });
})();