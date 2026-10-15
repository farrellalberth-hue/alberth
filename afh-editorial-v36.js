/* AFH V36 — deliberate editorial motion without extra WebGL contexts.
 * Pointer-tilt uses one delegated listener and a single scheduled animation frame.
 * IntersectionObserver stops reveal work after first entry.
 * Browsers with reduced-motion preference keep everything static and legible.
 */
(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const selectors='.afh36-fade,#method.afh36-method .learning-step,#milestones.afh36-theses .timeline-item';
const reveal=[...document.querySelectorAll(selectors)];
const seen=new WeakSet();
const show=(el)=>{if(seen.has(el))return;seen.add(el);el.classList.add('afh36-inview')};
if(!reduce&&'IntersectionObserver'in window){
 const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){show(entry.target);io.unobserve(entry.target)}})
 },{threshold:.04,rootMargin:'0px 0px -6% 0px'});
 reveal.forEach(el=>io.observe(el));
 addEventListener('pagehide',()=>io.disconnect(),{once:true});
}else reveal.forEach(show);
const grid=document.querySelector('#lk-sector-grid');
if(grid&&fine&&!reduce){
 let active=null,frame=0,x=0,y=0;
 const reset=()=>{
  if(!active)return;
  active.style.removeProperty('--v36rx');
  active.style.removeProperty('--v36ry');
  active=null;
 };
 grid.addEventListener('pointermove',e=>{
  const el=e.target.closest?.('.lk-sector');
  if(!el){reset();return}
  if(active!==el){reset();active=el}
  const box=el.getBoundingClientRect();
  x=Math.max(-1,Math.min(1,((e.clientX-box.left)/box.width-.5)*2));
  y=Math.max(-1,Math.min(1,((e.clientY-box.top)/box.height-.5)*2));
  if(!frame)frame=requestAnimationFrame(()=>{
   frame=0;
   if(active){active.style.setProperty('--v36rx',(-y*4.8).toFixed(2)+'deg');active.style.setProperty('--v36ry',(x*5.5).toFixed(2)+'deg')}
  });
 },{passive:true});
 grid.addEventListener('pointerleave',reset,{passive:true});
 grid.addEventListener('focusout',()=>{if(!grid.contains(document.activeElement))reset()});
 addEventListener('pagehide',()=>{reset();if(frame)cancelAnimationFrame(frame)},{once:true});
}
// Set semantic fallback: the source cards are links; orbit visuals are always decorative.
})();
