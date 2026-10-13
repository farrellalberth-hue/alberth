/* AFH COSMOS V20 — crisp retina sky without continuous canvas redraw.
   Pixel budget under 8.4 MP per layer, deterministic stars and subtle mouse parallax.
   Primary 8K photograph loads via responsive srcset in HTML; canvas only adds glints. */
(()=>{'use strict';
const hero=document.querySelector('.afh20-hero');
const cosmos=document.querySelector('.afh20-cosmos');
if(!hero||!cosmos)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
const drawings=[
 {element:document.querySelector('#afh20-atmosphere'),density:0.00011,glints:12,opacity:.66},
 {element:document.querySelector('#afh20-starfield'),density:0.00016,glints:21,opacity:.97}
];
const seedRandom=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const rnd=seedRandom(20262008);
const cap=(n,a,b)=>Math.min(b,Math.max(a,n));
function star(ctx,x,y,r,alpha,hue,bright=false){
 ctx.save();ctx.globalAlpha=alpha;
 if(bright){
   const glow=ctx.createRadialGradient(x,y,0,x,y,r*9);
   glow.addColorStop(0,'rgba(255,245,219,.55)');
   glow.addColorStop(.22,'rgba(250,209,171,.14)');
   glow.addColorStop(1,'rgba(245,195,131,0)');
   ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,r*9,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='rgba(255,234,204,.82)';ctx.lineWidth=.7;
   ctx.beginPath();ctx.moveTo(x-r*8,y);ctx.lineTo(x+r*8,y);ctx.moveTo(x,y-r*9);ctx.lineTo(x,y+r*9);ctx.stroke();
 }
 ctx.fillStyle=hue<.72?'#ffdfb5':hue<.9?'#edf3ff':'#fff9ed';
 ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function paintCanvas(data,i){
 const cv=data.element;if(!cv)return;
 const r=cv.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
 const dpr=Math.max(1,Math.min(devicePixelRatio||1,2.5,Math.sqrt(8370000/(w*h))));
 cv.width=Math.max(1,Math.round(w*dpr));cv.height=Math.max(1,Math.round(h*dpr));
 const ctx=cv.getContext('2d',{alpha:true,desynchronized:true});if(!ctx)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const count=Math.min(520,Math.round(w*h*data.density));
 for(let j=0;j<count;j++){
   const x=rnd()*w,y=rnd()*h;
   if(i===0&&x<w*.36&&rnd()<.6)continue;
   const r0=.25+rnd()*(rnd()>.93?1.45:.8),alpha=.12+rnd()*.65;
   star(ctx,x,y,r0,alpha,rnd());
 }
 for(let k=0;k<data.glints;k++){
   const x=w*(.08+rnd()*.83),y=h*(.05+rnd()*.9),size=.65+rnd()*1.6;
   if(i===0&&x<w*.32)continue;
   star(ctx,x,y,size,.42+rnd()*.55,rnd(),true);
 }
}
let resizeFrame=0;
const draw=()=>{resizeFrame=0;drawings.forEach(paintCanvas)};
const queueDraw=()=>{if(!resizeFrame)resizeFrame=requestAnimationFrame(draw)};
queueDraw();
if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(queueDraw);ro.observe(hero);ro.observe(cosmos)}
addEventListener('resize',queueDraw,{passive:true});
let mx=0,my=0,x=0,y=0,raf=0,scrollShift=0;
function ease(){
 raf=0;
 x+=(mx-x)*.045;y+=(my-y)*.045;
 cosmos.style.setProperty('--cosmos-x',x.toFixed(2)+'px');
 cosmos.style.setProperty('--cosmos-y',(y+scrollShift).toFixed(2)+'px');
 if(Math.abs(x-mx)>.12||Math.abs(y-my)>.12)raf=requestAnimationFrame(ease);
}
function schedule(){if(!raf)raf=requestAnimationFrame(ease)}
if(fine&&!reduced){
 hero.addEventListener('pointermove',e=>{
  const b=hero.getBoundingClientRect();
  mx=cap((e.clientX-b.left)/Math.max(1,b.width)-.5,-.5,.5)*22;
  my=cap((e.clientY-b.top)/Math.max(1,b.height)-.5,-.5,.5)*16;
  schedule();
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{mx=0;my=0;schedule()},{passive:true});
}
let scheduledScroll=false;
addEventListener('scroll',()=>{
 if(reduced||scheduledScroll)return;
 scheduledScroll=true;
 requestAnimationFrame(()=>{
  scheduledScroll=false;
  const rect=hero.getBoundingClientRect();
  const t=cap(-rect.top/Math.max(1,rect.height),0,1);
  scrollShift=-t*36;
  schedule();
 });
},{passive:true});
// Visible network/image failure fallback — generated SVG-like glow and rings remain intact.
const photo=cosmos.querySelector('.afh20-galaxy img');
photo?.addEventListener('error',()=>{
 cosmos.classList.add('afh20-no-photo');
 photo.style.opacity='0';
 console.warn('AFH galaxy high-resolution image unavailable. CSS celestial fallback active.');
});
})();