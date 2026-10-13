/* AFH ATELIER V19 — restrained editorial motion; no space canvases or physics.
   No libraries, no network, no scroll-jacking. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const hero=$('.afh19-hero'),folio=$('.afh19-folio'),progress=$('#afh16-scroll-progress');
const life=$$('.lifetime-step'),cards=$$('.afh3-feature');
let ticking=false,px=0,py=0,fx=0,fy=0,raf=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const update=()=>{
 ticking=false;
 const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 if(progress)progress.style.transform='scaleX('+clamp(scrollY/max,0,1).toFixed(4)+')';
 if(!reduced){
  if(hero&&folio){
   const rect=hero.getBoundingClientRect();
   const amount=clamp(-rect.top/Math.max(1,rect.height),0,1);
   hero.style.setProperty('--at-hero-shift',(amount*-43).toFixed(1)+'px');
  }
  if(innerWidth>860){
   life.forEach(el=>{
    const b=el.getBoundingClientRect();
    const p=clamp((b.top+b.height/2-innerHeight/2)/innerHeight,-1.25,1.25);
    el.style.setProperty('--at-life-y',(-p*8).toFixed(1)+'px');
   });
   cards.forEach(el=>{
    const b=el.getBoundingClientRect();
    const p=clamp((b.top+b.height/2-innerHeight/2)/innerHeight,-1,1);
    el.style.setProperty('--at-card-y',(p*9).toFixed(1)+'px');
   });
  }
 }
};
const requestUpdate=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate,{passive:true});
requestUpdate();
if(folio&&fine&&!reduced){
 const animate=()=>{
  raf=0;fx+=(px-fx)*.12;fy+=(py-fy)*.12;
  folio.style.setProperty('--at-tilt-x',(fx*7).toFixed(2)+'deg');
  folio.style.setProperty('--at-tilt-y',(fy*-5).toFixed(2)+'deg');
  if(Math.abs(px-fx)>.003||Math.abs(py-fy)>.003)raf=requestAnimationFrame(animate);
 };
 hero.addEventListener('pointermove',e=>{
  const r=hero.getBoundingClientRect();
  px=clamp((e.clientX-r.left)/r.width*2-1,-1,1);
  py=clamp((e.clientY-r.top)/r.height*2-1,-1,1);
  if(!raf)raf=requestAnimationFrame(animate);
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{px=py=0;if(!raf)raf=requestAnimationFrame(animate)},{passive:true});
}
})();