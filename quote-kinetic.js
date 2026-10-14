/* Kentzo kinetic mathematics — a continuously animated Möbius fabric.
   No logo, buttons, cursor tracking or external libraries. The geometry is a
   true 3D parametric single-sided surface, projected to a quiet dark canvas.
   Reduced-motion preferences and offscreen visibility are respected.
*/
(function(){"use strict";
const section=document.querySelector(".quote-panel.quote-mobius");
const canvas=document.getElementById("quote-kinetic-canvas");
if(!section||!canvas||!canvas.getContext)return;
const ctx=canvas.getContext("2d",{alpha:true});
if(!ctx)return;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
const PI=Math.PI,TWO_PI=PI*2;
let width=0,height=0,dpr=1,radius=230,centerX=0,centerY=0;
let frame=0,last=0,clock=0,visible=true,disposed=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(v,b));
const random=n=>{let v=Math.sin(n*127.74+15.713)*43758.5453;return v-Math.floor(v)};
const fragments=Array.from({length:106},(_,i)=>({
 x:random(i*4),y:random(i*4+1),
 r:random(i*4+2)*1.1+.25,
 phase:random(i*4+3)*TWO_PI,
 alpha:.09+random(i*8)*.28
}));
function fit(){
 const box=section.getBoundingClientRect();
 width=Math.max(310,box.width);
 height=Math.max(400,box.height);
 dpr=Math.min(1.6,window.devicePixelRatio||1);
 canvas.width=Math.round(width*dpr);
 canvas.height=Math.round(height*dpr);
 canvas.style.width=width+"px";canvas.style.height=height+"px";
 ctx.setTransform(dpr,0,0,dpr,0,0);
 centerX=width*(width<700?.57:.53);
 centerY=height*.49;
 radius=Math.min(width*(width<700?.45:.28),height*.48,385);
 draw(clock);
}
function twist(p,time){
 const x=p[0],y=p[1],z=p[2];
 const a=.66+.10*Math.sin(time*.37),b=time*.18+.46;
 const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b);
 const y1=y*ca-z*sa,z1=y*sa+z*ca;
 const x2=x*cb+z1*sb,z2=-x*sb+z1*cb;
 const c=.16*Math.sin(time*.24),cc=Math.cos(c),sc=Math.sin(c);
 return [x2*cc-y1*sc,x2*sc+y1*cc,z2];
}
function mobius(u,v,t){
 const r=1.24,depth=.53;
 // Single-sided topology: halfway around the loop swaps both fabric edges.
 const q=(r+depth*v*Math.cos(u/2));
 const p=[q*Math.cos(u),q*Math.sin(u),depth*v*Math.sin(u/2)];
 return twist(p,t);
}
function project(p){
 const perspective=4.1/(4.1-p[2]*.24);
 return {x:centerX+p[0]*radius*perspective,y:centerY+p[1]*radius*perspective,z:p[2],f:perspective};
}
function stroke(points,color,width=1,glow=0){
 if(points.length<2)return;
 ctx.beginPath();
 for(let i=0;i<points.length;i++){
  const p=points[i];if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);
 }
 ctx.lineWidth=width;ctx.strokeStyle=color;
 if(glow){ctx.shadowColor=color;ctx.shadowBlur=glow}
 ctx.stroke();ctx.shadowBlur=0;
}
function light(){
 const haze=ctx.createRadialGradient(centerX,centerY,radius*.12,centerX,centerY,radius*2.18);
 haze.addColorStop(0,"rgba(151,174,211,.16)");
 haze.addColorStop(.38,"rgba(118,143,184,.09)");
 haze.addColorStop(1,"rgba(95,121,172,0)");
 ctx.fillStyle=haze;
 ctx.fillRect(0,0,width,height);
 for(let i=0;i<fragments.length;i++){
  const f=fragments[i],a=f.alpha*(.57+.43*Math.sin(clock*.52+f.phase));
  const x=f.x*width,y=f.y*height;
  ctx.fillStyle="rgba(218,229,246,"+a.toFixed(3)+")";
  ctx.fillRect(x,y,f.r,f.r);
 }
}
function surface(t){
 const coarse=width<700;
 const steps=coarse?76:108;
 const across=coarse?10:15;
 const lattice=Array.from({length:steps+1},(_,i)=>
  Array.from({length:across+1},(_,j)=>mobius(i*TWO_PI/steps,-1+2*j/across,t)));
 const quads=[];
 const L=[-.38,-.52,1.05];
 for(let i=0;i<steps;i++){
  for(let j=0;j<across;j++){
   const a=lattice[i][j],b=lattice[i+1][j],d=lattice[i][j+1],e=lattice[i+1][j+1];
   const vx=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
   const vy=[d[0]-a[0],d[1]-a[1],d[2]-a[2]];
   const n=[vx[1]*vy[2]-vx[2]*vy[1],vx[2]*vy[0]-vx[0]*vy[2],vx[0]*vy[1]-vx[1]*vy[0]];
   const nl=Math.max(.0001,Math.hypot(...n));
   const facing=Math.abs((n[0]*L[0]+n[1]*L[1]+n[2]*L[2])/nl);
   const highlight=Math.pow(facing,.73);
   const shimmer=.5+.5*Math.sin(i*.09-j*.23+t*.9);
   const intensity=clamp(.11+highlight*.57+shimmer*.13,0,.9);
   quads.push({pts:[project(a),project(b),project(e),project(d)],
     depth:(a[2]+b[2]+d[2]+e[2])*.25,
     intensity,front:n[2]>0});
  }
 }
 // Painter-sort translucent metallic tiles; no fake central sphere or branding.
 quads.sort((a,b)=>a.depth-b.depth);
 for(let k=0;k<quads.length;k++){
  const tile=quads[k],p=tile.pts;
  ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);
  for(let m=1;m<4;m++)ctx.lineTo(p[m].x,p[m].y);ctx.closePath();
  const c=tile.intensity;
  const r=Math.round(99+c*112),g=Math.round(113+c*110),b=Math.round(139+c*105);
  ctx.fillStyle="rgba("+r+","+g+","+b+","+(tile.front?.68:.52)+")";ctx.fill();
 }
 // Fine longitudinal isoparametric filaments reveal topology of the fabric.
 for(let j=0;j<=across;j++){
  const pts=lattice.map(row=>project(row[j]));
  const edge=(j===0||j===across);
  stroke(pts,edge?"rgba(237,245,255,.76)":"rgba(204,220,244,.28)",edge?1.35:.55,edge?8:0);
 }
 for(let i=0;i<=steps;i+=coarse?7:8){
  const pts=lattice[i].map(p=>project(p));
  stroke(pts,"rgba(212,229,254,.29)",.7);
 }
 // Slow migrating highlights, mathematically constrained to the same surface.
 for(let k=0;k<5;k++){
  const u=(t*.21+k*TWO_PI/5)%TWO_PI,v=.70*Math.cos(k*2.13+t*.29);
  const p=project(mobius(u,v,t));
  const r=k===0?3.4:2.25;
  const haze=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*6);
  haze.addColorStop(0,"rgba(255,255,255,.94)");
  haze.addColorStop(.12,"rgba(212,229,255,.65)");
  haze.addColorStop(.48,"rgba(186,211,255,.12)");
  haze.addColorStop(1,"rgba(170,197,250,0)");
  ctx.fillStyle=haze;ctx.beginPath();ctx.arc(p.x,p.y,r*6,0,TWO_PI);ctx.fill();
 }
}
function backgroundLines(t){
 // A restrained deep-space coordinate field that never reacts to a cursor.
 const horizon=centerY+radius*.97;
 for(let k=0;k<8;k++){
  const y=horizon+k*38,opa=.11*(1-k/9);
  stroke([{x:0,y},{x:width,y}],"rgba(178,202,236,"+opa+")",.5);
 }
 const scan=(.5+.5*Math.sin(t*.29))*width;
 ctx.fillStyle="rgba(180,201,239,.035)";
 ctx.fillRect(scan-1,0,2,height);
}
function draw(t){
 if(!width||!height)return;
 clock=t;
 ctx.clearRect(0,0,width,height);
 light();
 backgroundLines(t);
 surface(t);
}
function tick(now){
 frame=0;if(!visible||document.hidden)return;
 const dt=last?Math.min(60,now-last):33;last=now;
 clock+=dt*.001;
 draw(clock);
 if(!reduce.matches)frame=requestAnimationFrame(tick);
}
function start(){
 if(frame||!visible||document.hidden)return;
 if(reduce.matches){draw(clock);return}
 last=0;frame=requestAnimationFrame(tick);
}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0}
if("IntersectionObserver" in window){
 const watch=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible)start();else stop();
 },{rootMargin:"120px"});
 watch.observe(section);
}
document.addEventListener("visibilitychange",()=>{document.hidden?stop():start()});
window.addEventListener("resize",()=>{fit();start()},{passive:true});
if(reduce.addEventListener)reduce.addEventListener("change",()=>{stop();start()});
fit();start();
})();