/* AFH 31 — four mathematically projected 3D research scenes.
   Real X/Y/Z rotation, animated geometry, no remote packages or image substitutions.
   Canvas fallback is the existing original SVG in each card. Cards remain normal links. */
(()=>{'use strict';
const cards=[...document.querySelectorAll('.afh31-section .afh31-card')];
if(!cards.length)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const mobile=matchMedia('(max-width:700px)').matches;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const PI=Math.PI,TAU=PI*2;
const palette={
  economics:['#d7c8e9','#d0b2e8','#f5d7b7'],
  finance:['#aec4eb','#cbdcfa','#f3ded0'],
  ai:['#b9bdeb','#ddc1f1','#fff3d6'],
  crypto:['#e6bdd5','#c5cee7','#f2d2ac']
};
let state=16491;
const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
function create(card,i){
 const canvas=card.querySelector('.afh31-canvas');
 if(!canvas)return null;
 const ctx=canvas.getContext('2d',{alpha:true});
 if(!ctx)return null;
 const type=card.dataset.scene;
 const points=Array.from({length:50},()=>[rand(),rand(),rand()]);
 const o={card,canvas,ctx,type,i,visible:false,hoverX:0,hoverY:0,w:0,h:0,dpr:1,frameTime:0,theta:i*.35,points};
 card.classList.add('afh31-ready');
 card.addEventListener('pointermove',e=>{
   if(e.pointerType==='touch')return;
   const r=card.getBoundingClientRect();
   o.hoverX=clamp((e.clientX-r.left)/r.width-.5,-.5,.5);
   o.hoverY=clamp((e.clientY-r.top)/r.height-.5,-.5,.5);
 },{passive:true});
 card.addEventListener('pointerleave',()=>{o.hoverX=0;o.hoverY=0},{passive:true});
 return o;
}
const items=cards.map(create).filter(Boolean);
if(!items.length)return;
function resize(o){
 const r=o.canvas.getBoundingClientRect();
 if(r.width<2||r.height<2)return false;
 o.w=r.width;o.h=r.height;
 o.dpr=Math.min(devicePixelRatio||1,mobile?1.3:1.6,Math.sqrt(1700000/(r.width*r.height)));
 const w=Math.max(1,Math.round(o.w*o.dpr)),h=Math.max(1,Math.round(o.h*o.dpr));
 if(o.canvas.width!==w||o.canvas.height!==h){
  o.canvas.width=w;o.canvas.height=h;
 }
 o.ctx.setTransform(o.dpr,0,0,o.dpr,0,0);
 return true;
}
function draw(o,seconds){
 if(!resize(o))return;
 const {ctx:c,w,h,type,points}=o;
 c.clearRect(0,0,w,h);
 const centerX=w*.51,centerY=h*(mobile?.49:.50);
 const unit=Math.min(w/5.3,h/3.65);
 const colors=palette[type]||palette.economics;
 const t=seconds;
 const yaw=(type==='ai'?t*.24:type==='crypto'?t*.20:t*.10)+o.i*.12+o.hoverX*.90;
 const pitch=(type==='economics'?.72:type==='finance'?.17:type==='ai'?.08:-.18)+Math.sin(t*.35+o.i)*.12-o.hoverY*.62;
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 function pr(x,y,z){
   const xx=x*cy-z*sy,zz=x*sy+z*cy;
   const yy=y*cp-zz*sp,z2=y*sp+zz*cp;
   const perspective=4.8/(4.8-z2*.35);
   return [centerX+xx*unit*perspective,centerY-yy*unit*perspective,z2];
 }
 function path3(coords,color,width=1,blur=0,opacity=1){
   if(coords.length<2)return;
   c.save();c.beginPath();for(let j=0;j<coords.length;j++){
     const a=pr(...coords[j]);if(j===0)c.moveTo(a[0],a[1]);else c.lineTo(a[0],a[1]);
   }
   c.lineWidth=width;c.strokeStyle=color;c.globalAlpha=opacity;
   if(blur){c.shadowColor=color;c.shadowBlur=blur}
   c.lineCap='round';c.lineJoin='round';c.stroke();c.restore();
 }
 function dot3(x,y,z,r,color,blur=0){
   const p=pr(x,y,z);c.save();c.fillStyle=color;c.beginPath();c.arc(p[0],p[1],r,0,TAU);
   if(blur){c.shadowBlur=blur;c.shadowColor=color}c.fill();c.restore();
 }
 function backdrop(){
   const glow=c.createRadialGradient(centerX,centerY,6,centerX,centerY,Math.max(w,h)*.45);
   glow.addColorStop(0,'rgba(132,129,175,.12)');glow.addColorStop(.5,'rgba(109,112,155,.04)');glow.addColorStop(1,'rgba(8,9,19,0)');
   c.fillStyle=glow;c.fillRect(0,0,w,h);
   for(let j=0;j<points.length;j++){
     const [x,y,b]=points[j];c.globalAlpha=.09+.27*b;c.fillStyle=b>.8?'#f8e7e7':'#b5c4e9';
     c.fillRect(x*w,y*h,b>.88?1.7:.9,b>.88?1.7:.9);
   }
   c.globalAlpha=1;
 }
 backdrop();
 if(type==='economics'){
   const surface=(x,z)=>.23*(x*x-z*z)+.09*Math.sin(x*1.5+z*.6);
   const lineA=colors[0],lineB=colors[1];
   for(let i=-10;i<=10;i++){
     const x=i*.20,coord=[];
     for(let j=-14;j<=14;j++){const z=j*.115;coord.push([x,surface(x,z),z]);}
     path3(coord,lineA,.75,0,.23+Math.abs(i)/40);
   }
   for(let i=-10;i<=10;i++){
     const z=i*.145,coord=[];
     for(let j=-14;j<=14;j++){const x=j*.14;coord.push([x,surface(x,z),z]);}
     path3(coord,lineB,.8,0,.21+Math.abs(i)/47);
   }
   const curveA=[],curveB=[];
   for(let k=0;k<=80;k++){
     const x=-1.85+3.7*k/80;
     curveA.push([x,-.20+x*.38, .10]);
     curveB.push([x,-.20-x*.38,-.07]);
   }
   path3(curveA,colors[2],3.1,15,.97);path3(curveB,colors[0],2.8,14,.94);
   const at=pr(0,-.2,0);
   c.save();const halo=c.createRadialGradient(at[0],at[1],0,at[0],at[1],22);
   halo.addColorStop(0,'rgba(255,245,221,.78)');halo.addColorStop(.35,'rgba(222,204,255,.31)');halo.addColorStop(1,'rgba(221,184,232,0)');
   c.fillStyle=halo;c.beginPath();c.arc(at[0],at[1],22,0,TAU);c.fill();c.restore();
   dot3(0,-.2,0,4,'#fff4e4',15);
 }else if(type==='finance'){
   // Perspective floor grid, translucent extruded bars, and a rising market curve.
   for(let j=0;j<=11;j++){
    const x=-2.3+j*.46;path3([[x,-1.22,-.65],[x,-1.22,.78]],colors[0],.7,0,.22);
   }
   for(let j=0;j<=6;j++){
    const z=-.65+j*.24;path3([[-2.3,-1.22,z],[2.3,-1.22,z]],colors[0],.7,0,.18);
   }
   const levels=[-.65,-.29,-.40,.12,-.16,.31,.14,.70,.46,1.02,.83,1.39];
   const boxes=[];
   for(let k=0;k<levels.length;k++){
     const x=-2.15+k*.38,top=levels[k],front=.30,back=-.09,d=.24;
     const P=(xx,yy,zz)=>pr(xx,yy,zz);
     const l=x-d/2,r=x+d/2,y0=-1.2;
     const quad=(xyz,fill,stroke)=>{
       c.save();c.beginPath();xyz.forEach((p,i)=>{const v=P(...p);i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1])});c.closePath();
       c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();c.restore();
     };
     boxes.push({x,top});
     quad([[l,y0,back],[r,y0,back],[r,top,back],[l,top,back]],'rgba(164,182,225,.04)','rgba(196,211,243,.13)');
     quad([[r,y0,back],[r,y0,front],[r,top,front],[r,top,back]],'rgba(196,202,242,.13)','rgba(214,221,255,.3)');
     quad([[l,y0,front],[r,y0,front],[r,top,front],[l,top,front]],'rgba(156,167,215,.105)','rgba(219,229,255,.32)');
     quad([[l,top,front],[r,top,front],[r,top,back],[l,top,back]],'rgba(225,228,255,.20)','rgba(225,230,255,.56)');
     path3([[x,top,front],[x,top+.08,front]],colors[2],1,7,.85);
   }
   const trend=boxes.map((b,k)=>[b.x,b.top+.34,.40]);
   path3(trend,colors[2],2.3,13,.97);
   trend.forEach((p,k)=>{if(k%2===0||k===trend.length-1)dot3(...p,2.2,'#fff6e9',9)});
 }else if(type==='ai'){
   const n=210,a=[],b=[];
   for(let i=0;i<=n;i++){
     const y=-1.43+i/n*2.86,angle=i/n*PI*6.3+t*.27;
     a.push([.82*Math.cos(angle),y,.82*Math.sin(angle)]);
     b.push([.82*Math.cos(angle+PI),y,.82*Math.sin(angle+PI)]);
   }
   for(let k=0;k<4;k++){
     const orbit=[];
     for(let j=0;j<=100;j++){
       const a=j/100*TAU;
       orbit.push([1.2*Math.cos(a),-.96+k*.65,1.0*Math.sin(a)]);
     }
     path3(orbit,colors[0],.75,0,.25);
   }
   for(let i=0;i<n;i+=7){
     path3([a[i],b[i]],colors[0],.88,0,.43);
   }
   path3(a,colors[1],2.5,15,.95);
   path3(b,colors[2],2.3,16,.92);
   for(let i=0;i<=n;i+=15){
     dot3(...a[i],2.8,colors[2],9);
     dot3(...b[i],2.3,colors[0],8);
   }
 }else if(type==='crypto'){
   // True sphere latitude & longitude lines and 3D elliptical orbital paths.
   const radius=1.06;
   for(let lat=-3;lat<=3;lat++){
     const phi=lat*.32,ring=[];
     for(let i=0;i<=100;i++){
       const a=i/100*TAU,v=Math.cos(phi)*radius;
       ring.push([v*Math.cos(a),radius*Math.sin(phi),v*Math.sin(a)]);
     }
     path3(ring,colors[0],.82,0,.22+Math.abs(lat)*.03);
   }
   for(let mer=0;mer<12;mer++){
     const a=mer/12*TAU,line=[];
     for(let k=0;k<=70;k++){
       const f=-PI/2+k/70*PI;
       line.push([radius*Math.cos(f)*Math.cos(a),radius*Math.sin(f),radius*Math.cos(f)*Math.sin(a)]);
     }
     path3(line,colors[1],.65,0,.20);
   }
   const c0=pr(0,0,0),rr=unit*.73;
   c.save();
   const g=c.createRadialGradient(c0[0]-rr*.25,c0[1]-rr*.32,2,c0[0],c0[1],rr);
   g.addColorStop(0,'rgba(248,231,241,.49)');g.addColorStop(.22,'rgba(183,180,227,.32)');
   g.addColorStop(.65,'rgba(94,101,164,.15)');g.addColorStop(1,'rgba(102,82,135,0)');
   c.fillStyle=g;c.beginPath();c.arc(c0[0],c0[1],rr,0,TAU);c.fill();c.restore();
   const planes=[[1.85,.18,.58],[1.72,-.62,-.22],[1.98,.8,-.35]];
   planes.forEach((plane,k)=>{
     const coords=[];
     for(let i=0;i<=130;i++){
       const a=i/130*TAU+t*.08*(k%2?-1:1);
       const x=Math.cos(a)*plane[0],z=Math.sin(a)*plane[0];
       const y=Math.cos(a)*plane[1]+z*plane[2];
       coords.push([x,y,z]);
     }
     path3(coords,colors[k%3],k===1?1.9:1.35,k===1?11:5,k===1?.88:.65);
     const theta=t*(.55+k*.2)+k*2.3,x=Math.cos(theta)*plane[0],z=Math.sin(theta)*plane[0],y=Math.cos(theta)*plane[1]+z*plane[2];
     dot3(x,y,z,k===1?5:3.5,colors[k%3],16);
   });
   const star=[];
   for(let i=0;i<65;i++){
     const ang=i*2.399963,rad=radius*Math.sqrt((i+.5)/65),z=Math.sqrt(Math.max(0,radius*radius-rad*rad));
     star.push([rad*Math.cos(ang),rad*Math.sin(ang),z]);
   }
   for(let i=0;i<star.length;i++)dot3(...star[i],.7,'rgba(230,219,248,.55)',0);
 }
}
let f=0,last=0,visibleCount=0;
const states=new Map(items.map(o=>[o.card,o]));
const io=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
 for(const entry of entries){
  const o=states.get(entry.target);if(o)o.visible=entry.isIntersecting;
 }
 visibleCount=items.filter(x=>x.visible).length;
 if(visibleCount)request();
},{threshold:.025,rootMargin:'100px 0px'});
items.forEach(o=>{
 if(io)io.observe(o.card);
 else {o.visible=true;visibleCount++}
});
const ro=typeof ResizeObserver==='undefined'?null:new ResizeObserver(()=>request());
items.forEach(o=>ro?.observe(o.canvas));
function request(){
 if(document.hidden||!visibleCount||f||reduced)return;
 f=requestAnimationFrame(tick);
}
function tick(t){
 f=0;if(document.hidden||!visibleCount)return;
 const step=1000/(mobile?25:32);
 if(t-last<step-3){request();return}
 last=t;
 for(const o of items){if(o.visible)draw(o,t/1000)}
 request();
}
document.addEventListener('visibilitychange',request);
if(reduced){
 items.forEach(o=>draw(o,0));
}else{
 setTimeout(()=>{if(!io)items.forEach(o=>{o.visible=true});visibleCount=items.filter(o=>o.visible).length;request()},120);
}
})();