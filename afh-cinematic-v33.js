/* AFH V33 Kinetic Sculptures — nine real-time projected 3D scenes.
   Zero third-party runtime dependencies, responsive, low-DPR mobile,
   accessible non-interfering decoration, reduced-motion and viewport throttling. */
(()=>{'use strict';
const list=[...document.querySelectorAll('canvas.afh33-stage')];
if(!list.length)return;
const PI=Math.PI,TAU=2*PI,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,mobile=matchMedia('(max-width:767px)').matches;
const colors={
 economics:['#aedaff','#f7d6a8'],finance:['#f1cfaf','#aabfe9'],
 ai:['#a9e5c9','#c5f1f0'],blockchain:['#cab9ff','#edbbff'],
 quant:['#e9c18a','#fdf0c9'],accounting:['#d8c8ff','#f4dfe8'],
 featured:['#f3caa6','#ede2d3'],manifesto:['#f5ccab','#bfc9e6'],contact:['#f6d8af','#c9b7ef']
};
const scene=list.map((el,index)=>({el,index,type:el.dataset.v33,c:el.getContext('2d',{alpha:true}),visible:false,w:0,h:0,dpr:1,angle:0,stars:Array.from({length:50},(_,i)=>{const n=i+1;return[Math.sin(n*127.1+index*31)*.48+Math.cos(n*91.7)*.15,Math.sin(n*59.1)*.56,Math.cos(n*28.3)*.46]})})).filter(x=>x.c);
function draw(s,time){
 const box=s.el.getBoundingClientRect();
 if(box.width<5||box.height<5)return;
 const w=box.width,h=box.height,c=s.c,mobileNow=w<530;
 const dpr=Math.min(devicePixelRatio||1,mobileNow?1.17:1.5,Math.sqrt(1800000/(w*h)));
 const bw=Math.max(1,Math.round(w*dpr)),bh=Math.max(1,Math.round(h*dpr));
 if(s.el.width!==bw||s.el.height!==bh){s.el.width=bw;s.el.height=bh}
 c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 const k=colors[s.type]||colors.economics,large=['featured','manifesto','contact'].includes(s.type);
 const cx=w*(large?.57:.64),cy=h*(large?.51:.42),unit=Math.min(w,h)*(large?.34:.23);
 const yaw=time*(s.type==='contact'?.19:s.type==='ai'?.25:.13)+s.index*.31;
 const pitch=.30+Math.sin(time*.18+s.index)*.17;
 const cs=Math.cos(yaw),sn=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const project=(x,y,z)=>{
  const ax=x*cs-z*sn,az=x*sn+z*cs,ay=y*cp-az*sp,dz=y*sp+az*cp;
  const perspective=4.8/(4.8-dz*.32);
  return[cx+ax*unit*perspective,cy-ay*unit*perspective,perspective];
 };
 const stroke=(pts,col=k[0],line=1,glow=0,alpha=.7,close=false)=>{
  if(!pts.length)return;c.save();c.globalAlpha=alpha;c.strokeStyle=col;c.lineWidth=line;
  c.lineJoin='round';c.lineCap='round';if(glow){c.shadowBlur=glow;c.shadowColor=col}
  c.beginPath();pts.forEach((p,i)=>{const a=project(...p);i?c.lineTo(a[0],a[1]):c.moveTo(a[0],a[1])});
  if(close)c.closePath();c.stroke();c.restore();
 };
 const dot=(p,r=2,col=k[0],glow=0)=>{
  const a=project(...p);c.save();c.fillStyle=col;if(glow){c.shadowBlur=glow;c.shadowColor=col}
  c.beginPath();c.arc(a[0],a[1],r,0,TAU);c.fill();c.restore();
 };
 const orbit=(radius,tilt=0,axis=0,col=k[0],alpha=.65,line=1.2)=>{
  const pts=[];for(let i=0;i<=160;i++){const a=i/160*TAU;pts.push([Math.cos(a)*radius,Math.sin(a)*radius*tilt+axis,Math.sin(a)*radius])}
  stroke(pts,col,line,line>1.5?15:0,alpha);
 };
 const fillPoly=(points,color,outline='#d6c7ec70')=>{
  const pr=points.map(p=>project(...p));c.beginPath();pr.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();
  c.fillStyle=color;c.fill();c.strokeStyle=outline;c.lineWidth=.8;c.stroke();
 };
 const glow=c.createRadialGradient(cx,cy,0,cx,cy,unit*(large?3.2:2.3));
 glow.addColorStop(0,large?'#ebc9a02f':'#dfb8cf15');glow.addColorStop(.43,'#afa5ed0b');glow.addColorStop(1,'#00000000');
 c.fillStyle=glow;c.fillRect(0,0,w,h);
 for(let i=0;i<s.stars.length;i++){
  const p=s.stars[i],x=cx+p[0]*w*.92,y=cy+p[1]*h*.92;
  c.fillStyle=i%4===0?'#fde0bd6c':'#b9c4e74d';
  c.fillRect(x,y,i%9===0?1.6:.8,i%9===0?1.6:.8);
 }
 const type=s.type;
 if(type==='economics'||type==='quant'){
  if(type==='economics'){
   for(let i=-8;i<=8;i++){
    const pts=[];for(let j=-12;j<=12;j++){const x=j*.14,z=i*.18;pts.push([x,.22*Math.sin(x*1.1+z*1.8),z])}
    stroke(pts,k[0],.77,0,.37);
   }
   for(let i=-8;i<=8;i++){
    const pts=[];for(let j=-12;j<=12;j++){const x=i*.19,z=j*.13;pts.push([x,.22*Math.sin(x*1.1+z*1.8),z])}
    stroke(pts,k[1],.73,0,.33);
   }
   const a=[],b=[];for(let i=0;i<=90;i++){const x=-1.6+i/90*3.2;a.push([x,x*.58,.15]);b.push([x,-x*.58,.15])}
   stroke(a,k[1],2.6,14,.96);stroke(b,k[0],2.35,12,.83);dot([0,0,.15],4.5,'#ffefd8',15);
  }else{
   for(let i=0;i<4;i++)orbit(.72+i*.37,(i%2?.75:-.43),Math.sin(time*.25+i)*.15,i%2?k[1]:k[0],.7,1.2);
   for(let i=0;i<5;i++){const a=time*(i%2?-.31:.32)+i*1.3;dot([1.35*Math.cos(a),.37*Math.sin(a*2),1.35*Math.sin(a)],i%2?4:2.5,i%2?k[1]:k[0],14)}
  }
 }else if(type==='finance'||type==='accounting'){
  if(type==='finance'){
   const levels=[.48,.91,.63,1.38,.98,1.64,1.20,1.89,.95,1.57];
   const line=[];
   for(let i=0;i<levels.length;i++){
    const x=(i-(levels.length-1)/2)*.38,y0=-1.22,t=levels[i]-1.03;
    const a=x-.125,b=x+.125,z0=-.20,z1=.20;
    fillPoly([[a,y0,z1],[b,y0,z1],[b,t,z1],[a,t,z1]],'#c5b9f626','#cfc3e85d');
    fillPoly([[b,y0,z1],[b,y0,z0],[b,t,z0],[b,t,z1]],'#e1a78735','#e4b6a783');
    fillPoly([[a,t,z1],[b,t,z1],[b,t,z0],[a,t,z0]],'#fde1c557','#ffe8d6b3');
    line.push([x,t+.28,.38]);
   }
   stroke(line,k[1],2.25,14,.88);line.forEach((p,i)=>{if(i%2===0)dot(p,2.1,k[0],6)});
  }else{
   for(let i=0;i<4;i++){
    const y=-1+i*.62,ex=1.25- i*.12,z=.95-i*.03;
    fillPoly([[-ex,y,-z],[ex,y,-z],[ex,y,z],[-ex,y,z]],i%2?'#d3bdee20':'#f3d6ea28','#c3afd78b');
    fillPoly([[ex,y,-z],[ex,y,z],[ex,y+.2,z],[ex,y+.2,-z]],'#c8b0e73d','#c3aee68f');
    fillPoly([[-ex,y,z],[ex,y,z],[ex,y+.2,z],[-ex,y+.2,z]],'#e7ceef24','#e9c8f07a');
    stroke([[-ex,y+.2,-z],[ex,y+.2,-z],[ex,y+.2,z],[-ex,y+.2,z],[-ex,y+.2,-z]],k[0],1.2,6,.77);
   }
  }
 }else if(type==='ai'||type==='contact'){
  const a=[],b=[],turns=type==='contact'?3.8:2.4;
  for(let i=0;i<=260;i++){
   const p=i/260,ang=p*TAU*turns+time*(type==='contact'?.24:.37),y=(p-.5)*(type==='contact'?3.7:2.8);
   const radius=type==='contact'?.9+Math.sin(p*PI)*.55:.9;
   a.push([Math.cos(ang)*radius,y,Math.sin(ang)*radius]);
   b.push([Math.cos(ang+PI)*radius,y,Math.sin(ang+PI)*radius]);
  }
  for(let i=0;i<a.length;i+=9)stroke([a[i],b[i]],k[0],.63,0,.25);
  stroke(a,k[0],type==='contact'?2.15:2.7,16,.89);
  stroke(b,k[1],type==='contact'?2:2.2,14,.76);
  for(let i=0;i<a.length;i+=23){dot(a[i],type==='contact'?3.1:2.6,k[1],11)}
  if(type==='contact'){for(let i=0;i<3;i++)orbit(.5+i*.32,.16*i,(i-1)*.5,k[i%2],.28,1)}
 }else if(type==='blockchain'){
  function cube(x,y,z,r){
   const v=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>[x+p[0]*r,y+p[1]*r,z+p[2]*r]);
   fillPoly([v[0],v[1],v[2],v[3]],'#b8a5ef20','#c4a9ff62');
   fillPoly([v[4],v[5],v[6],v[7]],'#b2b4ff1e','#e9cdff89');
   for(const [a,b] of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])stroke([v[a],v[b]],k[0],.95,7,.6);
  }
  cube(0,0,0,.74);cube(-1.15,-.85,.3,.34);cube(1.16,.75,-.22,.41);cube(.76,-1.13,.5,.26);
  orbit(1.95,.34,0,k[1],.31,1);
 }else if(type==='featured'||type==='manifesto'){
  const size=type==='featured'?1.04:1.3;
  const center=project(0,0,0);
  const halo=c.createRadialGradient(center[0]-unit*.26,center[1]-unit*.32,2,center[0],center[1],unit*size*1.03);
  halo.addColorStop(0,'#fff6dfa3');halo.addColorStop(.26,'#dbb59b86');halo.addColorStop(.75,'#a28aa43f');halo.addColorStop(1,'#55406c00');
  c.fillStyle=halo;c.beginPath();c.arc(center[0],center[1],unit*size,0,TAU);c.fill();
  for(let i=0;i<6;i++){
   const rad=1+i*.23,tilt=[.28,-.25,.42,-.1,.56,-.32][i];
   const v=[];for(let j=0;j<=210;j++){const ang=j/210*TAU+time*.02;v.push([Math.cos(ang)*rad,Math.sin(ang)*rad*tilt,Math.sin(ang)*rad])}
   stroke(v,i%2?k[1]:k[0],i%3===0?2.3:.95,i%3===0?19:4,i%3===0?.8:.45);
  }
  for(let i=0;i<13;i++){
   const a=time*.28+i*2.39,rad=1+i*.11;
   dot([Math.cos(a)*rad,Math.sin(a*1.3)*.42,Math.sin(a)*rad],i%4===0?4:1.4,i%2?k[1]:k[0],12);
  }
 }
}
let request=0,last=0;
const io=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
 for(const e of entries){const s=scene.find(x=>x.el===e.target);if(s)s.visible=e.isIntersecting}
 if(entries.some(e=>e.isIntersecting))schedule();
},{threshold:.02,rootMargin:'120px 0px'});
for(const s of scene){s.visible=!io;io?.observe(s.el)}
const ro=typeof ResizeObserver==='undefined'?null:new ResizeObserver(()=>{scene.forEach(s=>{s.el.width=0});schedule()});
scene.forEach(s=>ro?.observe(s.el));
function tick(t){
 request=0;if(document.hidden)return;
 const delta=1000/(mobile?22:28);
 if(last&&t-last<delta-3){schedule();return}
 last=t;
 const secs=t/1000,live=scene.filter(s=>s.visible);
 for(const s of live)draw(s,reduce?0:secs);
 if(live.length&&!reduce)schedule();
}
function schedule(){if(!request&&!document.hidden&&scene.some(s=>s.visible)&&!reduce)request=requestAnimationFrame(tick)}
scene.forEach(s=>{if(reduce)requestAnimationFrame(()=>draw(s,0))});
if(!reduce)schedule();
document.addEventListener('visibilitychange',schedule);
addEventListener('pagehide',()=>{io?.disconnect();ro?.disconnect();if(request)cancelAnimationFrame(request)},{once:true});
})();