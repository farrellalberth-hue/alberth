/* AFH V16: cinematic scroll direction and progressive depth, no scroll locking.
   Enhances V14 WebGL; lightweight, non-blocking, reduced-motion aware. */
(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow=matchMedia('(max-width: 860px)').matches;
const hero=$('.afh3-hero'),heroArt=$('.afh3-orbit-system');
const archive=$('.afh15-atlas'),archiveArt=$('.afh15-orbit-field');
const stars=$('#afh4-starfield'),quote=$('#afh4-quote');
const sections=$$('main section[id]');
const rail=$$('.scene-rail a[data-scene]');
const progress=$('#afh16-scroll-progress');
let scheduled=false,starVisible=true;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const update=()=>{
 scheduled=false;
 const full=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 if(progress)progress.style.transform='scaleX('+(scrollY/full).toFixed(4)+')';
 if(!reduce&&!narrow&&archive&&archiveArt){
  const box=archive.getBoundingClientRect();
  const fraction=clamp((innerHeight-box.top)/(innerHeight+box.height),0,1);
  archiveArt.style.setProperty('--afh16-indexY',((.5-fraction)*70).toFixed(2)+'px');
  archiveArt.style.setProperty('--afh16-indexTurn',((fraction-.5)*10).toFixed(2)+'deg');
 }
 if(!reduce&&heroArt&&hero&&narrow){
  const rect=hero.getBoundingClientRect();
  const t=clamp(-rect.top/Math.max(rect.height,1),0,1);
  heroArt.style.opacity=String(clamp(.55-t*.3,.15,.7));
 }
};
const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(update)};
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
schedule();
if('IntersectionObserver' in window){
 // Keep the section-navigation rail in sync even when new sections are introduced.
 const observer=new IntersectionObserver(entries=>{
  const visible=entries.filter(x=>x.isIntersecting);
  if(!visible.length)return;
  visible.sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  let target=visible[0].target.id;
  if(['selected','yellow-book'].includes(target))target='journey';
  if(target==='afh4-quote')target='contact';
  rail.forEach(a=>{
   if(a.dataset.scene===target)a.setAttribute('aria-current','location');
   else a.removeAttribute('aria-current');
  });
 },{rootMargin:'-20% 0px -45% 0px',threshold:[0,.1,.3,.6]});
 sections.forEach(x=>observer.observe(x));
 // New PDF concept cards ease in with staggered depth.
 const cards=$$('.afh16-knowledge-index a');
 if(!reduce&&cards.length){
  const reveal=new IntersectionObserver(entries=>{
   entries.forEach(({target,isIntersecting})=>{
    if(isIntersecting){target.classList.add('afh16-on');reveal.unobserve(target)}
   });
  },{threshold:.05,rootMargin:'0px 0px -35px 0px'});
  cards.forEach((el,i)=>{el.style.setProperty('--afh16-delay',Math.min(6,i%4)*60+'ms');reveal.observe(el)});
 }
}
// Native CSS orbit and WebGL fallback remain visible even if any motion enhancement fails.
document.documentElement.classList.add('afh16-ready');
if(heroArt&&!reduce&&matchMedia('(pointer:fine)').matches){
 let x=0,y=0,mx=0,my=0,frame=0;
 const tick=()=>{
  frame=0;
  mx+=(x-mx)*.09;my+=(y-my)*.09;
  heroArt.style.setProperty('--afh16-pitch',(my*2.4).toFixed(2)+'deg');
  heroArt.style.setProperty('--afh16-yaw',(mx*2.8).toFixed(2)+'deg');
  if(Math.abs(x-mx)>.03||Math.abs(y-my)>.03)frame=requestAnimationFrame(tick);
 };
 hero.addEventListener('pointermove',e=>{
  const r=hero.getBoundingClientRect();
  x=(e.clientX-r.left-r.width/2)/r.width*2;
  y=(e.clientY-r.top-r.height/2)/r.height*2;
  if(!frame)frame=requestAnimationFrame(tick);
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{x=y=0;if(!frame)frame=requestAnimationFrame(tick)},{passive:true});
}
})();