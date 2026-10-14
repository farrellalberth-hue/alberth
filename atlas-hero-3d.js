/* Kentzo Atlas 3D gallery — five custom interactive projected-geometry scenes.
   Canvas 2D uses an actual 3D camera, depth perspective and volumetric wire geometry;
   self-hosted, no external libraries or assets. Respect reduced-motion and visibility.
*/
(function(){"use strict";
const root=document.getElementById("atlas"),hero=document.querySelector(".atlas-hero");
const canvas=document.getElementById("atlas-hero-canvas");
if(!root||!hero||!canvas||!canvas.getContext)return;
const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return;
const scene=["all","economics","finance","crypto","others"].includes(root.dataset.field)?root.dataset.field:"all";
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
const TAU=Math.PI*2;
let w=0,h=0,dpr=1,unit=200,centerX=0,centerY=0;
let pointerX=0,pointerY=0,targetX=0,targetY=0,angle=0,raf=0,last=0,visible=true;
const clamp=(x,min,max)=>Math.min(max,Math.max(min,x));
const data={
 finance:[.24,.4,.13,.5,.68,.48,.75,.61,.89,.66,.95,.81,1.05,.83,1.16,1.03,1.35,1.13,1.41,1.59],
 econColor:[218,232,255],cryptoColor:[179,215,255],financeColor:[216,226,246],othersColor:[225,215,255],allColor:[214,223,255]
};
let rgb=data[scene+"Color"]||data.allColor;
const c=(alpha)=>"rgba("+rgb.join(",")+","+alpha+")";
const rand=i=>{const x=Math.sin(i*73.93+19.117)*43758.545;return x-Math.floor(x)};
const stars=Array.from({length:85},(_,i)=>({x:rand(i*3)*1.0,y:rand(i*3+1),a:.08+rand(i*3+2)*.55,r:.55+rand(i*4)*1.6}));
function resize(){
 const r=hero.getBoundingClientRect();
 w=Math.max(320,r.width);h=Math.max(360,r.height);dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 canvas.style.width=w+"px";canvas.style.height=h+"px";
 ctx.setTransform(dpr,0,0,dpr,0,0);
 centerX=w*(w<760?.71:.78);centerY=h*(w<760?.47:.49);
 unit=Math.min(h*.315,w*(w<760?.27:.165),254);
 draw(0);
}
const rotate=(p,yaw,pitch)=>{
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const x=p[0]*cy+p[2]*sy,z=p[2]*cy-p[0]*sy;
 return [x,p[1]*cp-z*sp,p[1]*sp+z*cp]
};
function proj(p,yaw=angle*.12+pointerX*.32,pitch=-.21+pointerY*.21){
 const a=rotate(p,yaw,pitch),f=4.6/(4.6-a[2]*.38);
 return {x:centerX+a[0]*unit*f,y:centerY+a[1]*unit*f,z:a[2],f};
}
const path=(points,color=c(.35),width=1,blur=0)=>{
 if(points.length<2)return;
 ctx.beginPath();for(let i=0;i<points.length;i++){const p=points[i];if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}
 ctx.lineWidth=width;ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=blur;ctx.stroke();ctx.shadowBlur=0;
};
function orb(p,r=4,power=.8){
 const v=p&&p.x!==undefined?p:proj(p);
 const radius=Math.max(1,r*v.f);
 const rad=ctx.createRadialGradient(v.x-radius*.15,v.y-radius*.22,0,v.x,v.y,radius*2.35);
 rad.addColorStop(0,"rgba(255,255,255,"+power+")");
 rad.addColorStop(.2,c(power*.72));rad.addColorStop(.5,c(power*.22));rad.addColorStop(1,c(0));
 ctx.fillStyle=rad;ctx.beginPath();ctx.arc(v.x,v.y,radius*2.35,0,TAU);ctx.fill();
 ctx.beginPath();ctx.arc(v.x,v.y,Math.max(.8,radius*.39),0,TAU);ctx.fillStyle="rgba(245,250,255,"+Math.min(1,power)+")";ctx.fill();
}
function polygon(points,fill,stroke,linewidth=.7){
 ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
 if(fill){ctx.fillStyle=fill;ctx.fill()}
 if(stroke){ctx.lineWidth=linewidth;ctx.strokeStyle=stroke;ctx.stroke()}
}
function halo(x=centerX,y=centerY,r=unit*2.1){
 const g=ctx.createRadialGradient(x,y,5,x,y,r);
 g.addColorStop(0,c(.21));g.addColorStop(.32,c(.105));g.addColorStop(.78,c(.016));g.addColorStop(1,c(0));
 ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
}
function line3(a,b,col=c(.3),width=1,blur=0){path([proj(a),proj(b)],col,width,blur)}
function ring(pointFn,segments=98,col=c(.35),width=1,blur=0){
 const pts=[];for(let j=0;j<=segments;j++)pts.push(proj(pointFn(j/segments*TAU)));
 path(pts,col,width,blur);
}
function drawBackdrop(t){
 halo();ctx.save();
 for(const s of stars){
  const x=centerX+(s.x-.5)*unit*5.5,y=centerY+(s.y-.5)*unit*4.3;
  ctx.globalAlpha=s.a*(.65+.35*Math.sin(t*.6+s.x*12));
  ctx.fillStyle="#e1edff";ctx.fillRect(x,y,s.r,s.r);
 }
 ctx.restore();
 const fog=ctx.createLinearGradient(w*.48,0,w,0);
 fog.addColorStop(0,"rgba(6,6,8,0)");fog.addColorStop(1,c(.05));
 ctx.fillStyle=fog;ctx.fillRect(w*.48,0,w*.52,h);
}
function sceneAll(t){
 const spin=t*.13;
 for(let l=-3;l<=3;l++){
  ring(a=>[Math.cos(a)*Math.sqrt(Math.max(0,1.4*1.4-(l*.25)**2)),l*.25,Math.sin(a)*Math.sqrt(Math.max(0,1.4*1.4-(l*.25)**2))],76,c(.09),.7);
 }
 for(let i=0;i<5;i++){
  const ax=i*.5+spin,inc=.25+i*.31;
  ring(a=>rotate([1.52*Math.cos(a),1.52*Math.sin(a),0],ax,inc),100,c(i===2?.8:.25+i*.07),i===2?2:1,i===2?8:0);
 }
 for(let i=0;i<16;i++){
  const ph=t*.21+i*TAU/16,ang=i*2.399;
  const p=[1.25*Math.cos(ph)*Math.cos(ang),1.4*Math.sin(ph),1.25*Math.cos(ph)*Math.sin(ang)];
  orb(proj(p),i%4===0?3.3:1.9,i%4===0?.9:.55);
 }
 const gl=ctx.createRadialGradient(centerX-unit*.4,centerY-unit*.48,2,centerX,centerY,unit*.57);
 gl.addColorStop(0,"rgba(244,248,255,.82)");gl.addColorStop(.15,c(.5));gl.addColorStop(.6,"rgba(28,35,52,.78)");gl.addColorStop(.86,"rgba(4,7,13,.96)");gl.addColorStop(1,c(.05));
 ctx.fillStyle=gl;ctx.beginPath();ctx.arc(centerX,centerY,unit*.58,0,TAU);ctx.fill();
 ring(a=>[Math.cos(a)*.58,Math.sin(a)*.58,0],90,c(.42),1.4,11);
 orb({x:centerX-unit*.25,y:centerY-unit*.25,f:1},10,.5);
}
function sceneEconomics(t){
 // A layered equilibrium landscape: two demand/supply surfaces in XYZ space.
 for(let i=-6;i<=6;i++){
  const n=i*.26;
  line3([-1.85,.96,n], [1.85,.96,n],c(.12),.8);
  line3([n,.96,-1.55],[n,.96,1.55],c(.12),.8);
 }
 const surfaces=[
  {fn:(x,z)=> .55*x+.12*Math.sin(z*2+t*.65)+.08*Math.sin(x*2.2),col:c(.77)},
  {fn:(x,z)=>-.56*x+.12*Math.cos(z*2-t*.52)-.07*Math.sin(x*2.4),col:"rgba(250,251,255,.79)"}
 ];
 for(let s=0;s<surfaces.length;s++){
  for(let iz=0;iz<=11;iz++){
    const z=-1.35+iz*2.7/11,pts=[];
    for(let i=0;i<=54;i++){
      const x=-1.6+i*3.2/54;pts.push(proj([x,surfaces[s].fn(x,z),z]));
    }
    path(pts,s===0?c(.18+iz/11*.2):"rgba(230,240,255,"+(.17+iz/11*.3)+")",iz%3===0?1.3:.6,iz===6?8:0);
  }
  for(let ix=0;ix<=10;ix++){
    const x=-1.6+ix*3.2/10,pts=[];
    for(let j=0;j<=45;j++){
      const z=-1.35+j*2.7/45;pts.push(proj([x,surfaces[s].fn(x,z),z]));
    }
    path(pts,c(ix%3===0?.29:.14),.7);
  }
  const bold=[];
  for(let i=0;i<=110;i++){
   const x=-1.65+i*3.3/110;bold.push(proj([x,surfaces[s].fn(x,0),0]));
  }
  path(bold,s===0?c(.95):"rgba(251,253,255,.96)",2.8,17);
 }
 const y=.07*Math.sin(t*.7);
 orb(proj([0,y,0]),11,1);
 for(let ax=0;ax<3;ax++)line3([0,0,0],ax===0?[2.03,0,0]:ax===1?[0,-1.4,0]:[0,0,1.7],c(.4),1.1,3);
}
function sceneFinance(t){
 // Candlestick skyline made of perspective-projected translucent 3D prisms.
 for(let iz=0;iz<7;iz++){
  const z=-1.25+iz*.42;
  line3([-2.15,1.02,z],[2.18,1.02,z],c(.12),.6)
 }
 for(let ix=0;ix<11;ix++){
  const x=-2.02+ix*.42;
  line3([x,1.02,-1.25],[x,1.02,1.25],c(.13),.6)
 }
 const values=data.finance;
 for(let i=0;i<values.length;i++){
  const x=-1.97+i*.204,z=(i%5-2)*.12,y=.92-values[i]*1.13,base=.85,th=.105;
  const tailTop=y-.19-(i%4)*.055,tailBottom=base+.08;
  line3([x,tailTop,z],[x,tailBottom,z],c(.57),.7);
  const f1=[x-th,base,z-th],f2=[x+th,base,z-th],f3=[x+th,y,z-th],f4=[x-th,y,z-th];
  const b1=[x-th,base,z+th],b2=[x+th,base,z+th],b3=[x+th,y,z+th],b4=[x-th,y,z+th];
  polygon([proj(f1),proj(f2),proj(f3),proj(f4)],c(.12+(i%3)*.09),c(.32),.75);
  polygon([proj(f2),proj(b2),proj(b3),proj(f3)],c(.19+(i%3)*.06),c(.48),.85);
  polygon([proj(f4),proj(f3),proj(b3),proj(b4)],c(.38),c(.72),.95);
  if(i%4===2)orb(proj([x,y,z]),2.9,.78);
 }
 const line=[];for(let i=0;i<values.length;i++)line.push(proj([-1.97+i*.204,.72-values[i]*1.18,-.29]));
 path(line,c(.89),2.5,17);
 const tip=values.length-1;
 orb(proj([-1.97+tip*.204,.72-values[tip]*1.18,-.29]),7,.95);
 ring(a=>[1.02+Math.cos(a)*.62,-.62+Math.sin(a)*.62, .65],95,c(.25),1);
}
function cube(x,y,z,r,bright=.55){
 const V=[
 [x-r,y-r,z-r],[x+r,y-r,z-r],[x+r,y+r,z-r],[x-r,y+r,z-r],
 [x-r,y-r,z+r],[x+r,y-r,z+r],[x+r,y+r,z+r],[x-r,y+r,z+r]
 ].map(p=>proj(p));
 polygon([V[0],V[1],V[2],V[3]],c(.04+bright*.13),c(.37),.7);
 polygon([V[1],V[5],V[6],V[2]],c(.06+bright*.17),c(.48),.9);
 polygon([V[0],V[4],V[5],V[1]],c(.05+bright*.24),c(.65),.9);
 const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
 for(let i=0;i<edges.length;i++){const [a,b]=edges[i];path([V[a],V[b]],c(i%4===0?.77:.27),i%3===0?1.35:.85,i===0?7:0)}
 orb(proj([x,y,z]),r*.95,.62);
}
function sceneCrypto(t){
 const nodes=[[-1.45,.24,-.15],[-.64,-.30,.25],[.24,.17,-.25],[1.15,-.23,.3],[.52,-.93,.22],[-.86,.89,-.16],[1.65,.7,-.24]];
 for(let i=0;i<nodes.length-1;i++){
  const a=nodes[i],b=nodes[i+1];line3(a,b,c(.53),1.4,9);
  if(i+2<nodes.length)line3(a,nodes[i+2],c(.17),.9);
 }
 for(let i=0;i<nodes.length;i++){
  const n=nodes[i],osc=.055*Math.sin(t*1.3+i*1.8);
  cube(n[0],n[1]+osc,n[2],i===2?.38:.20,i===2?1:.55);
 }
 const spin=t*.37;
 ring(a=>[.05+1.65*Math.cos(a),-.02,.4+1.08*Math.sin(a)],110,c(.25),1.3);
 ring(a=>rotate([1.32*Math.cos(a),1.32*Math.sin(a),.1],spin*.15,spin*.15),110,c(.29),1.1,3);
 for(let i=0;i<5;i++){
  const s=(t*.21+i/5)%1,a=nodes[i%nodes.length],b=nodes[(i+1)%nodes.length];
  orb(proj([a[0]+(b[0]-a[0])*s,a[1]+(b[1]-a[1])*s,a[2]+(b[2]-a[2])*s]),3,.84);
 }
}
function sceneOthers(t){
 // Interlaced helical pathways and synaptic links: knowledge/neural systems.
 const a=[],b=[];
 for(let i=0;i<=80;i++){
  const y=-1.9+i*3.8/80,ph=y*3.65+t*.32;
  a.push([.83*Math.cos(ph),y,.78*Math.sin(ph)]);
  b.push([.83*Math.cos(ph+Math.PI),y,.78*Math.sin(ph+Math.PI)]);
 }
 path(a.map(p=>proj(p)),c(.88),2.5,14);
 path(b.map(p=>proj(p)),"rgba(246,241,255,.72)",2.2,14);
 for(let i=0;i<=22;i++){
  const y=-1.9+i*3.8/22,k=i*80/22|0;
  line3(a[k],b[k],c(i%3===0?.55:.23),i%3===0?1.2:.7);
  if(i%2===0){orb(proj(a[k]),i%4===0?4:2.5,.84);orb(proj(b[k]),i%4===0?3:2,.7)}
 }
 for(let k=0;k<16;k++){
  const ang=k*2.39996+t*.11,rad=1.48+.15*Math.sin(k*3);
  const p=[rad*Math.cos(ang),1.35*Math.sin(ang*.85),rad*Math.sin(ang)];
  const near=k%2===0?a[k*5]:b[k*5];
  line3(p,near,c(.12),.75);
  if(k%2===0)orb(proj(p),2.9,.6);
 }
 ring(a=>[1.36*Math.cos(a),.03,1.36*Math.sin(a)],110,c(.28),.85);
}
function draw(t){
 if(!w||!h)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 ctx.save();drawBackdrop(t);
 if(scene==="all")sceneAll(t);
 else if(scene==="economics")sceneEconomics(t);
 else if(scene==="finance")sceneFinance(t);
 else if(scene==="crypto")sceneCrypto(t);
 else sceneOthers(t);
 ctx.restore();
}
function loop(now){
 raf=0;if(!visible||document.hidden)return;
 let dt=last?Math.min(45,now-last):16;last=now;
 const smooth=Math.min(1,dt*.006);
 pointerX+=(targetX-pointerX)*smooth;pointerY+=(targetY-pointerY)*smooth;
 if(!reduce.matches)angle+=dt*.001;
 draw(angle);
 if(!reduce.matches)raf=requestAnimationFrame(loop);
}
function start(){
 if(raf||!visible||document.hidden)return;
 last=0;if(reduce.matches){draw(0);return}raf=requestAnimationFrame(loop);
}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
hero.addEventListener("pointermove",e=>{
 if(reduce.matches)return;
 const r=hero.getBoundingClientRect();
 targetX=clamp((e.clientX-r.left)/r.width*2-1,-1,1);
 targetY=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
},{passive:true});
hero.addEventListener("pointerleave",()=>{targetX=0;targetY=0});
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;if(visible)start();else stop();
 },{rootMargin:"150px"});
 observer.observe(hero);
}
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();else start()});
if(reduce.addEventListener)reduce.addEventListener("change",()=>{stop();start()});
window.addEventListener("resize",()=>{resize();start()},{passive:true});
resize();start();
})();
