/* AFH ATLAS 2026 — lightweight motion and 1.7s brand reveal.
   Original WebAudio tones; automatic sound is best-effort due to browser policies. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro=$('#afh-intro-2026');
const body=document.body;
if(intro){
 const key='afh-atlas-2026-intro';
 let seen=false;
 try{seen=sessionStorage.getItem(key)==='seen'}catch(_){}
 if(seen||reduced){intro.remove();}
 else{
  body.classList.add('afc-lock');
  let ended=false,audio=null,gain=null,scored=false,soundOn=true;
  const finish=()=>{
   if(ended)return;ended=true;body.classList.remove('afc-lock');
   try{sessionStorage.setItem(key,'seen')}catch(_){}
   if(audio&&gain)try{
     gain.gain.setTargetAtTime(.0001,audio.currentTime,.065);
     const context=audio;setTimeout(()=>context.close().catch(()=>{}),300);
   }catch(_){}
   intro.classList.add('is-exiting');setTimeout(()=>intro.remove(),680);
  };
  const unlockSound=()=>{
   if(ended)return;
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)return;
   try{
    if(!audio){audio=new AC();gain=audio.createGain();gain.gain.value=.0001;gain.connect(audio.destination);}
    const start=()=>{
     if(ended||scored||audio.state!=='running')return;
     scored=true;
     const t=audio.currentTime+.01;
     gain.gain.setTargetAtTime(.17,t,.07);
     [[174.61,0,.9,.12],[261.63,.08,.65,.11],[349.23,.17,.55,.085],[523.25,.36,.55,.07],[698.46,.56,.58,.075],[1046.5,.9,.7,.06]].forEach(([freq,dur,len,vol],i)=>{
       const o=audio.createOscillator(),v=audio.createGain();
       o.type=i<3?'sine':'triangle';o.frequency.setValueAtTime(freq,t+dur);
       v.gain.setValueAtTime(.0001,t+dur);
       v.gain.linearRampToValueAtTime(vol,t+dur+.02);
       v.gain.exponentialRampToValueAtTime(.0001,t+dur+len);
       o.connect(v).connect(gain);o.start(t+dur);o.stop(t+dur+len+.03);
     });
     const button=$('#afh3-intro-sound');
     if(button)button.textContent='SOUND ON ↗';
    };
    const started=audio.resume();
    if(started?.then)started.then(start).catch(()=>{});
    else start();
   }catch(_){audio=null;gain=null}
  };
  $('#afh3-intro-skip')?.addEventListener('click',finish);
  $('#afh3-intro-sound')?.addEventListener('click',()=>{
   if(!audio){unlockSound();return;}
   if(!gain)return;
   soundOn=!soundOn;
   gain.gain.setTargetAtTime(soundOn?.16:.0001,audio.currentTime,.06);
   const button=$('#afh3-intro-sound');
   if(button)button.textContent=soundOn?'SOUND ON ↗':'SOUND OFF ↗';
  });
  const unlock=()=>{if(!ended&&!scored)unlockSound()};
  document.addEventListener('pointerdown',unlock,{once:true,passive:true});
  document.addEventListener('keydown',unlock,{once:true});
  document.addEventListener('touchstart',unlock,{once:true,passive:true});
  unlockSound(); // Browsers may reject sound without gesture. Intro still runs without interruption.
  setTimeout(finish,1710);
  addEventListener('pagehide',finish,{once:true});
 }
}
const hero=$('.afh3-hero');
const orbital=$('.afh3-orbit-system');
if(hero&&orbital&&!reduced&&matchMedia('(pointer:fine)').matches){
 let px=0,py=0,x=0,y=0,raf=0;
 const tick=()=>{
  raf=0;x+=(px-x)*.08;y+=(py-y)*.08;
  orbital.style.setProperty('--afh-tx',(x*17).toFixed(2)+'px');
  orbital.style.setProperty('--afh-ty',(y*17).toFixed(2)+'px');
  if(Math.abs(px-x)>.002||Math.abs(py-y)>.002)raf=requestAnimationFrame(tick);
 };
 hero.addEventListener('pointermove',e=>{
  const r=hero.getBoundingClientRect();
  px=(e.clientX-r.left)/r.width-.5;
  py=(e.clientY-r.top)/r.height-.5;
  if(!raf)raf=requestAnimationFrame(tick);
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{
  px=0;py=0;if(!raf)raf=requestAnimationFrame(tick);
 });
}
const reveal=$$('.afh3-reveal');
if(reduced||!('IntersectionObserver'in window)){reveal.forEach(x=>x.classList.add('afh3-visible'));}
else{
 const io=new IntersectionObserver(entries=>{
   entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('afh3-visible');io.unobserve(e.target)}})
 },{threshold:.07,rootMargin:'0px 0px -10% 0px'});
 reveal.forEach(node=>io.observe(node));
}
const heroLink=$('.afh3-hero .afh3-scroll');
heroLink?.addEventListener('click',()=>{try{sessionStorage.setItem('afh-atlas-2026-intro','seen')}catch(_){}});
})();