/* AFH cinematic V12: automatic sequence, best-effort original WebAudio soundtrack.
   Browsers decide whether unmuted autoplay is permitted; no permission dialog or enter gate. */
(()=>{'use strict';
const root=document.getElementById('afh-intro-2026');
if(!root)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const storageKey='afh-intro-2026';
let seen=false;
try{seen=sessionStorage.getItem(storageKey)==='seen'}catch(_){}
if(reduced||seen){root.remove();return}
const body=document.body;
const skip=root.querySelector('.afc-skip');
const sound=root.querySelector('.afc-sound');
const Audio=window.AudioContext||window.webkitAudioContext;
const durationMs=3800;
const notes=[
 [146.83,0,1.45,.13,'sine'],[220,0,1.75,.09,'sine'],
 [293.66,0,1.65,.08,'sine'],[369.99,.06,1.3,.075,'sine'],
 [440,.55,.48,.12,'triangle'],[587.33,.82,.48,.11,'triangle'],
 [659.26,1.16,.55,.12,'triangle'],[739.99,1.5,.65,.11,'triangle'],
 [587.33,1.82,.54,.12,'triangle'],[880,2.14,.58,.10,'triangle'],
 [739.99,2.5,.78,.11,'triangle'],[1174.66,2.8,.78,.085,'triangle']
];
let closed=false,startedAt=0,finishTimer=0;
let audio=null,master=null,scheduled=false,wantsSound=true;
const elapsed=()=>Math.min(durationMs/1000,Math.max(0,(performance.now()-startedAt)/1000));
const updateSound=()=>{
 if(!sound)return;
 const active=!closed&&wantsSound&&audio?.state==='running';
 sound.textContent=active?'SOUND ON ↗':(wantsSound?'SOUND ↗':'SOUND OFF ↗');
 sound.setAttribute('aria-pressed',String(active));
};
const tone=(freq,when,length,volume,wave)=>{
 if(!audio||!master||length<.035)return;
 const osc=audio.createOscillator(),amp=audio.createGain();
 osc.type=wave;osc.frequency.setValueAtTime(freq,when);
 amp.gain.setValueAtTime(.0001,when);
 amp.gain.linearRampToValueAtTime(volume,when+.024);
 amp.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.25),when+length*.72);
 amp.gain.exponentialRampToValueAtTime(.0001,when+length);
 osc.connect(amp).connect(master);
 osc.start(when);osc.stop(when+length+.025);
};
const scheduleSound=()=>{
 if(scheduled||closed||!wantsSound||!audio||audio.state!=='running')return;
 scheduled=true;
 const p=elapsed(),now=audio.currentTime+.035;
 master.gain.setTargetAtTime(.28,now,.10);
 for(const [frequency,at,length,gain,wave] of notes){
   if(at+length<=p+.03)continue;
   const shift=Math.max(0,p-at);
   tone(frequency,now+Math.max(0,at-p),length-shift,gain,wave);
 }
 if(p<3.4)tone(73.42,now,3.4-p,.08,'sine');
 updateSound();
};
const attemptAudio=()=>{
 if(closed||!wantsSound||!Audio||!startedAt)return;
 try{
  if(!audio){
    audio=new Audio();
    master=audio.createGain();
    master.gain.value=.0001;
    master.connect(audio.destination);
  }
  if(audio.state==='running'){scheduleSound();return}
  const result=audio.resume();
  if(result?.then)result.then(()=>{if(!closed)scheduleSound()}).catch(()=>updateSound());
  updateSound();
 }catch(_){updateSound()}
};
const stopAudio=()=>{
 if(!audio)return;
 try{
  if(master){const t=audio.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(.0001,t,.06)}
  const context=audio;setTimeout(()=>{try{context.close()}catch(_){}},310);
 }catch(_){}
};
const finish=()=>{
 if(closed)return;closed=true;
 clearTimeout(finishTimer);
 try{sessionStorage.setItem(storageKey,'seen')}catch(_){}
 body.classList.remove('afc-lock');
 stopAudio();root.classList.add('is-exiting');
 setTimeout(()=>root.remove(),750);
};
skip?.addEventListener('click',finish);
sound?.addEventListener('click',()=>{
 if(closed)return;
 if(!wantsSound){
   wantsSound=true;
   if(master&&audio)master.gain.setTargetAtTime(.28,audio.currentTime,.07);
   attemptAudio();
 }else if(audio?.state==='running'){
   wantsSound=false;
   if(master)master.gain.setTargetAtTime(.0001,audio.currentTime,.07);
 }else{
   // The click itself is a user gesture: retry audio without a permission dialog.
   attemptAudio();
 }
 updateSound();
});
const unlock=()=>{if(!closed&&wantsSound)attemptAudio()};
document.addEventListener('pointerdown',unlock,{passive:true});
document.addEventListener('keydown',unlock);
document.addEventListener('touchstart',unlock,{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!closed)finish()});
window.addEventListener('pagehide',()=>{if(!closed){stopAudio();body.classList.remove('afc-lock')}},{once:true});
body.classList.add('afc-lock');
requestAnimationFrame(()=>{
 if(closed)return;
 startedAt=performance.now();
 root.classList.add('is-playing');
 finishTimer=setTimeout(finish,durationMs);
 attemptAudio();
 updateSound();
});
})();