/* AFH 3D Galaxy V29 — software canvas fallback for browsers with WebGL disabled.
 * True 3-axis 3D projections using a CPU matrix, not a flat image rotation.
 * No external libraries; accessible drag/keyboard and mobile swipe; offscreen pause.
 */
(()=>{'use strict';
const hero=document.querySelector('.hero.afh20-hero');
const holder=document.getElementById('afh29-galaxy'),canvas=document.getElementById('afh29-canvas');
const grip=document.getElementById('afh29-interaction'),toggle=document.getElementById('afh29-autospin'),reset=document.getElementById('afh29-reset');
if(!hero||!holder||!canvas||!grip||holder.dataset.renderer==='webgl')return;
const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
if(!ctx)return; // the original ESA galaxy photograph remains the final fallback
const mobile=matchMedia('(max-width:767px)').matches;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(n,l,h)=>Math.min(h,Math.max(l,n));
const random=(()=>{let state=28022009;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.max(.00001,state/4294967296)}})();
const gaussian=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());
const n=mobile?1600:3400;
const stars=[];
for(let i=0;i<n;i++){
 let x,y,z,size,color;
 const bright=random();
 if(i<n*.73){
  const arm=i%4,r=Math.pow(random(),.66)*2.8;
  const a=arm*Math.PI/2+r*2.52+gaussian()*(.14+r*.054);
  const rr=r+gaussian()*.06*(1+r*.38);
  x=Math.cos(a)*rr;y=Math.sin(a)*rr;z=gaussian()*(.07+.085*(1-r/3));
  color=bright<.26?'151,198,255':bright<.58?'255,145,114':'255,227,190';
  size=random()>.972?2.35:.7+random()*1.3;
 }else if(i<n*.91){
  const r=Math.pow(random(),1.9)*.8,a=random()*Math.PI*2;
  x=Math.cos(a)*r;y=Math.sin(a)*r;z=gaussian()*.23;
  color=bright>.45?'255,242,212':'255,184,135';size=1.4+random()*2.35;
 }else{
  const r=2.1+random()*1.25,a=random()*Math.PI*2;
  x=Math.cos(a)*r;y=Math.sin(a)*r;z=gaussian()*.42;
  color=bright>.6?'182,207,255':'255,193,160';size=.5+random()*.85;
 }
 stars.push({x,y,z,size,color,alpha:.48+random()*.5});
}
holder.classList.remove('afh29-failed');
hero.classList.remove('afh29-fallback');
hero.classList.add('afh29-enabled');
holder.dataset.renderer='canvas2d';
holder.dataset.starCount=String(n);
let yaw=.22,pitch=-.56,goalYaw=yaw,goalPitch=pitch,vx=0,vy=0,auto=!reduced;
let dragging=false,pointerId=null,lastX=0,lastY=0,visible=true,dead=false,frame=0,lastT=0;
let w=0,h=0,dpr=1,dirty=true;
const interval=1000/(mobile?27:38);
const button=()=>{
 toggle?.setAttribute('aria-pressed',String(auto));
 if(toggle)toggle.textContent=auto?'Ⅱ PAUSE ORBIT':'▶ AUTO ROTATE';
 holder.dataset.mode=auto?'auto':'paused';
};
button();
function resize(){
 const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
 const cap=mobile?1.25:1.5;dpr=Math.min(devicePixelRatio||1,cap,Math.sqrt(2000000/(r.width*r.height)));
 const ww=Math.round(r.width*dpr),hh=Math.round(r.height*dpr);
 if(canvas.width!==ww||canvas.height!==hh){
  canvas.width=ww;canvas.height=hh;w=r.width;h=r.height;dirty=true;
 }
}
function project(x,y,z,cy,sy,cp,sp){
 const rx=x*cy-z*sy,rz=x*sy+z*cy;
 const ry=y*cp-rz*sp,dz=y*sp+rz*cp;
 const dist=5.15/Math.max(2,7.2-dz),scale=(mobile?.63:.75)*dist;
 return [w*.5+(rx/Math.max(.75,w/h))*scale*w*.5,h*.5-ry*scale*h*.5,dist,dz];
}
function paint(){
 resize();if(!w||!h)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const cx=w*.5,cy=h*.5;
 ctx.globalCompositeOperation='lighter';
 let glow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.32);
 glow.addColorStop(0,'rgba(255,231,181,.68)');
 glow.addColorStop(.18,'rgba(251,173,138,.30)');
 glow.addColorStop(.47,'rgba(143,116,173,.13)');
 glow.addColorStop(1,'rgba(21,14,31,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 const ca=Math.cos(yaw),sa=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 for(let i=0;i<2;i++){
  const r=i===0?2.65:1.85;
  ctx.beginPath();
  for(let j=0;j<=180;j++){
   const a=j/180*Math.PI*2;
   const p=project(Math.cos(a)*r,Math.sin(a)*r,i===0?0:.14,ca,sa,cp,sp);
   if(j===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);
  }
  ctx.strokeStyle=i===0?'rgba(255,191,155,.20)':'rgba(184,180,239,.16)';
  ctx.lineWidth=.75;ctx.stroke();
 }

 // Four luminous arms in projected 3D: subtle emission beneath crisp particle field.
 for(let arm=0;arm<4;arm++){
  ctx.beginPath();
  for(let step=0;step<=85;step++){
    const r=.14+step/85*2.54,angle=arm*Math.PI/2+r*2.52;
    const p=project(Math.cos(angle)*r,Math.sin(angle)*r,Math.sin(r*1.8+arm)*.04,ca,sa,cp,sp);
    if(step===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);
  }
  const warm=arm%2===0;
  ctx.lineCap='round';
  ctx.lineWidth=mobile?8:14;
  ctx.strokeStyle=warm?'rgba(254,137,102,.13)':'rgba(120,175,248,.13)';
  ctx.shadowColor=warm?'#f9ad8d':'#789deb';
  ctx.shadowBlur=mobile?17:25;
  ctx.stroke();
  ctx.shadowBlur=0;
  ctx.lineWidth=mobile?1.5:2.3;
  ctx.strokeStyle=warm?'rgba(255,198,147,.14)':'rgba(173,200,250,.13)';
  ctx.stroke();
 }
 
 for(let i=0;i<stars.length;i++){
  const star=stars[i];
  const [x,y,depth]=project(star.x,star.y,star.z,ca,sa,cp,sp);
  if(x<1||x>w-1||y<1||y>h-1)continue;
  const rad=Math.max(.5,Math.min(4.3,star.size*depth*1.12));
  ctx.fillStyle='rgba('+star.color+','+(star.alpha*.9).toFixed(3)+')';
  ctx.fillRect(x-rad*.5,y-rad*.5,rad,rad);
  if(rad>1.3&&i%4===0){
   ctx.fillStyle='rgba('+star.color+',.16)';
   ctx.beginPath();ctx.arc(x,y,rad*2.45,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.globalCompositeOperation='source-over';dirty=false;
}
function tick(t){
 frame=0;if(dead||!visible||document.hidden)return;
 const dt=lastT?Math.min(65,t-lastT):interval;
 if(dt<interval-3){frame=requestAnimationFrame(tick);return}
 lastT=t;
 if(auto&&!dragging&&!reduced)goalYaw+=dt*.000105;
 if(!dragging){
  goalYaw+=vx;goalPitch+=vy;vx*=.91;vy*=.9;
  if(Math.abs(vx)<.00002)vx=0;if(Math.abs(vy)<.00002)vy=0;
 }
 goalPitch=clamp(goalPitch,-1.38,1.38);
 yaw+=(goalYaw-yaw)*.2;pitch+=(goalPitch-pitch)*.2;
 const active=auto||dragging||Math.abs(goalYaw-yaw)>.0002||Math.abs(goalPitch-pitch)>.0002||vx||vy;
 if(active||dirty)paint();
 if(active||dirty)frame=requestAnimationFrame(tick);
}
function schedule(){if(!dead&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(tick)}
grip.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 dragging=true;pointerId=e.pointerId;lastX=e.clientX;lastY=e.clientY;vx=0;vy=0;
 try{grip.setPointerCapture(e.pointerId)}catch(_){}
 schedule();
});
grip.addEventListener('pointermove',e=>{
 if(!dragging||e.pointerId!==pointerId)return;
 const dx=e.clientX-lastX,dy=e.clientY-lastY;
 goalYaw+=dx*(mobile?.0085:.007);
 goalPitch=clamp(goalPitch-dy*.006,-1.38,1.38);
 vx=clamp(dx*.00036,-.05,.05);vy=clamp(-dy*.00027,-.045,.045);
 lastX=e.clientX;lastY=e.clientY;dirty=true;schedule();
});
const release=e=>{
 if(!dragging||e.pointerId!==pointerId)return;
 dragging=false;pointerId=null;
 try{if(grip.hasPointerCapture(e.pointerId))grip.releasePointerCapture(e.pointerId)}catch(_){}
 schedule();
};
grip.addEventListener('pointerup',release);
grip.addEventListener('pointercancel',release);
grip.addEventListener('lostpointercapture',()=>{dragging=false;pointerId=null});
grip.addEventListener('keydown',e=>{
 const a=e.shiftKey?.4:.15;
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
  e.preventDefault();
  if(e.key==='ArrowLeft')goalYaw-=a;
  if(e.key==='ArrowRight')goalYaw+=a;
  if(e.key==='ArrowUp')goalPitch=clamp(goalPitch+a,-1.38,1.38);
  if(e.key==='ArrowDown')goalPitch=clamp(goalPitch-a,-1.38,1.38);
  dirty=true;schedule();
 }
});
toggle?.addEventListener('click',()=>{auto=!auto;button();dirty=true;schedule()});
reset?.addEventListener('click',()=>{goalYaw=.22;goalPitch=-.56;vx=0;vy=0;dirty=true;schedule()});
const ob=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(es=>{
 visible=!!es[0]?.isIntersecting;
 if(!visible&&frame){cancelAnimationFrame(frame);frame=0}
 if(visible){lastT=0;dirty=true;schedule()}
},{threshold:.015}):null;
ob?.observe(hero);
const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{dirty=true;resize();schedule()}):null;
ro?.observe(holder);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}
 if(!document.hidden){lastT=0;dirty=true;schedule()}
});
let pending=false;addEventListener('scroll',()=>{
 if(reduced||pending||dead)return;pending=true;
 requestAnimationFrame(()=>{
  pending=false;if(!visible)return;
  const r=hero.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,r.height),0,1);
  holder.style.setProperty('--afh29-y',(-p*14).toFixed(2)+'px');
  dirty=true;schedule()
 });
},{passive:true});
resize();paint();if(!reduced)schedule();
addEventListener('pagehide',()=>{dead=true;ob?.disconnect();ro?.disconnect();if(frame)cancelAnimationFrame(frame)},{once:true});
})();