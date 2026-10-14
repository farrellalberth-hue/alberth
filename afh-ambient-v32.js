/* AFH V32 — lightweight projected 3D visual language for portfolio sections.
   Works on all browsers with 2D Canvas; perspective, yaw/pitch animation, scene-based
   geometry, offscreen throttling, reduced-motion support; no libraries or network. */
(()=>{'use strict';
const canvases=[...document.querySelectorAll('canvas.afh32-motion')];
if(!canvases.length)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const mobile=matchMedia('(max-width:700px)').matches;
const PI=Math.PI,TAU=PI*2;
let seed=7132026;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const scenes=canvases.map((canvas,i)=>{
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return null;
 return {canvas,ctx,type:canvas.dataset.motion||'quote',i,visible:true,w:0,h:0,dpr:1,
 points:Array.from({length:35},()=>[random()*2-1,random()*2-1,random()*2-1]),last:0};
}).filter(Boolean);
const clamp=(x,l,h)=>Math.min(h,Math.max(l,x));
function paint(s,t){
 const el=s.canvas,c=s.ctx,rect=el.getBoundingClientRect();
 if(rect.width<10||rect.height<10)return;
 const w=rect.width,h=rect.height,ratio=Math.min(devicePixelRatio||1,mobile?1.15:1.4,Math.sqrt(1250000/(w*h)));
 const bw=Math.max(1,Math.round(w*ratio)),bh=Math.max(1,Math.round(h*ratio));
 if(el.width!==bw||el.height!==bh){el.width=bw;el.height=bh}
 c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,w,h);
 const isLight=s.type==='atlas';
 const warm=isLight?'rgba(132,69,81,':'rgba(229,190,166,';
 const cool=isLight?'rgba(80,85,134,':'rgba(168,174,225,';
 const theta=t*.16+s.i*.41,cy=Math.cos(theta),sy=Math.sin(theta),pitch=(s.type==='journey'?.56:s.type==='atlas'?.47:.27)+Math.sin(t*.29)*.12,cp=Math.cos(pitch),sp=Math.sin(pitch);
 let cx=w*(s.type==='quote'?.51:.5),yy=h*.51;
 let scale=Math.min(w,h)*(mobile?.32:.38);
 const zoom=s.type==='videos'?.69:s.type==='quote'?.91:1;
 function proj(x,y,z){
  const xx=x*cy-z*sy,zz=x*sy+z*cy;
  const y1=y*cp-zz*sp,z1=y*sp+zz*cp;
  const perspective=3.7/(3.7-z1*.38);
  return [cx+xx*scale*perspective*zoom,yy-y1*scale*perspective*zoom,z1];
 }
 function path(v,color,thick=1,blur=0,alpha=1,closed=false){
  c.save();c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=thick;c.lineCap='round';c.lineJoin='round';
  if(blur){c.shadowColor=color;c.shadowBlur=blur}
  c.beginPath();v.forEach((p,i)=>{const q=proj(...p);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});
  if(closed)c.closePath();c.stroke();c.restore();
 }
 function dot(p,r,color,blur=0){
  const q=proj(...p);c.save();c.fillStyle=color;c.shadowColor=color;c.shadowBlur=blur;c.beginPath();c.arc(q[0],q[1],r,0,TAU);c.fill();c.restore();
 }
 function ring(rad, y, slope, color,alpha=.45,thick=1){
  const v=[];for(let k=0;k<=105;k++){const a=k/105*TAU;v.push([rad*Math.cos(a),y+rad*Math.sin(a)*slope,rad*Math.sin(a)])}
  path(v,color,thick,thick>1?8:0,alpha);
 }
 function stars(){
  for(const p of s.points){
   const q=proj(p[0]*2,p[1]*1.6,p[2]);
   c.fillStyle=cool+(0.10+Math.abs(p[2])*.22).toFixed(2)+')';
   c.fillRect(q[0],q[1],Math.abs(p[2])>.7?1.8:1,Math.abs(p[2])>.7?1.8:1);
  }
 }
 const background=c.createRadialGradient(cx,yy,0,cx,yy,Math.min(w,h)*.51);
 background.addColorStop(0,isLight?'rgba(191,135,148,.065)':'rgba(140,107,164,.15)');
 background.addColorStop(.7,isLight?'rgba(191,135,148,.026)':'rgba(92,84,135,.03)');
 background.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=background;c.fillRect(0,0,w,h);
 stars();
 if(s.type==='journey'||s.type==='atlas'){
  for(let a=-10;a<=10;a++){
   const v=[];for(let k=-20;k<=20;k++){const x=k*.065,z=a*.14;v.push([x,.22*Math.sin(x*2.1+z)+.13*x*z,z])}
   path(v,cool+'0.5)',a%5===0?1.4:.7,0,a%5===0?.58:.28);
  }
  for(let a=-10;a<=10;a++){
   const v=[];for(let k=-20;k<=20;k++){const x=a*.13,z=k*.07;v.push([x,.22*Math.sin(x*2.1+z)+.13*x*z,z])}
   path(v,warm+'0.65)',a%5===0?1.2:.6,0,a%5===0?.5:.25);
  }
  ring(1.5,0,.20,warm+'0.86)',.49,1.9);ring(1.9,.04,-.20,cool+'0.7)',.37,.8);
  for(let n=0;n<9;n++){const a=n/9*TAU+t*.3;dot([1.5*Math.cos(a),.25*Math.sin(a),1.5*Math.sin(a)],n%3===0?3:1.6,warm+'0.88)',9)}
 }else if(s.type==='quote'){
  for(let j=0;j<5;j++){
   const rad=.66+j*.29;
   const v=[];for(let k=0;k<=160;k++){const a=k/160*TAU;v.push([rad*Math.cos(a),Math.sin(a*2.1+j*.8)*.14+(j-2)*.18,rad*Math.sin(a)])}
   path(v,j%2===0?cool+'0.8)':warm+'0.8)',j===2?1.9:.9,j===2?13:0,.28+j*.045);
  }
  for(let n=0;n<3;n++){
   const pathPts=[];for(let k=0;k<=140;k++){
    const a=k/140*TAU*2.4+t*(n%2?-0.18:0.18)+n*2.1;
    pathPts.push([Math.cos(a)*(1.2+n*.22),-1.55+k/140*3.1,Math.sin(a)*(1.2+n*.22)]);
   }
   path(pathPts,n===1?warm+'0.96)':cool+'0.93)',n===1?2.3:1.05,n===1?15:6,n===1?.73:.49);
  }
  for(let n=0;n<14;n++){
   const a=n*2.399+t*.07,r=.4+n*.10;dot([Math.cos(a)*r,Math.sin(a*1.5)*.85,Math.sin(a)*r],n%5===0?3:1.3,warm+'0.91)',11);
  }
 }else if(s.type==='videos'){
  // floating media frames projected in 3D space around the visible feature cards
  for(let i=0;i<7;i++){
   const a=i/7*TAU+t*.12,rad=1.0+(i%3)*.17;
   const x=rad*Math.cos(a),z=rad*Math.sin(a),y=Math.sin(a*1.5)*.25;
   const corners=[[x-.25,y-.14,z],[x+.25,y-.14,z],[x+.25,y+.14,z],[x-.25,y+.14,z]];
   path(corners,i%2?warm+'0.78)':cool+'0.8)',1.25,9,.47,true);
   dot([x,y,z],1.4,'rgba(247,218,202,.7)',5);
  }
  ring(1.8,0,.35,warm+'0.6)',.24,.8);
 }else if(s.type==='research'||s.type==='obsidian'){
  const n=s.type==='research'?8:13,nodes=[];
  for(let i=0;i<n;i++){
   const a=i/n*TAU+t*(s.type==='research'?.09:.05),rad=s.type==='research'?.96:1.35;
   nodes.push([rad*Math.cos(a),Math.sin(a*(s.type==='research'?2:3))*.51,rad*Math.sin(a)]);
  }
  const core=[0,0,0];
  for(let i=0;i<n;i++){
   path([nodes[i],nodes[(i+1)%n]],cool+'0.74)',.8,0,.41);
   if(i%2===0)path([nodes[i],nodes[(i+3)%n]],warm+'0.68)',.8,0,.32);
   if(s.type==='research')path([nodes[i],core],cool+'0.64)',1,0,.4);
   dot(nodes[i],i%4===0?4.4:2.8,i%3===0?warm+'0.9)':cool+'0.92)',10);
  }
  if(s.type==='research'){ring(.37,0,.15,warm+'0.96)',.8,2.3);dot(core,6,warm+'0.9)',17)}
  else{
   for(let i=0;i<4;i++){
    const p=nodes[i*3];const q=nodes[(i*3+6)%n];
    path([p,q],cool+'0.92)',1.4,8,.51);
   }
   dot([0,0,0],5,warm+'0.89)',14);
  }
 }
}
let frame=0,last=0;
const observer=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(es=>{
 for(const entry of es){const s=scenes.find(x=>x.canvas===entry.target);if(s)s.visible=entry.isIntersecting}
 if(es.some(e=>e.isIntersecting))wake();
},{rootMargin:'120px 0px',threshold:.01}):null;
for(const s of scenes){s.visible=!observer;observer?.observe(s.canvas)}
const resize=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>wake()):null;
scenes.forEach(s=>resize?.observe(s.canvas));
function tick(t){
 frame=0;if(document.hidden)return;
 const delay=1000/(mobile?22:29);
 if(t-last<delay-3){wake();return}
 last=t;let awake=false;
 for(const s of scenes){if(s.visible){paint(s,t/1000);awake=true}}
 if(awake&&!reduce)wake();
}
function wake(){
 if(!frame&&!document.hidden&&scenes.some(s=>s.visible)&&!reduce)frame=requestAnimationFrame(tick);
}
if(reduce){scenes.forEach(s=>paint(s,0))}
else{requestAnimationFrame(()=>{scenes.forEach(s=>{if(s.visible)paint(s,0)});wake()})}
document.addEventListener('visibilitychange',wake);
addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame);observer?.disconnect();resize?.disconnect()},{once:true});
})();