/* AFH cinematic intro V11. Audio is original browser-synthesized instrumental; no copyrighted sample. */
(()=>{'use strict';
const root=document.getElementById('afh-intro-2026');if(!root)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let viewed=false;try{viewed=sessionStorage.getItem('afh-intro-2026')==='seen'}catch(_){}
const key='afh-intro-2026',body=document.body;
if(reduce||viewed){root.remove();return}
body.classList.add('afc-lock');
const enter=root.querySelector('.afc-enter'),silent=root.querySelector('.afc-silent'),skip=root.querySelector('.afc-skip'),sound=root.querySelector('.afc-sound');
let closed=false,started=false,audio=null,master=null,clock=0,finishTimer=0;
const totalMs=3800,Audio=window.AudioContext||window.webkitAudioContext;
const tone=(freq,time,length,volume,wave='sine')=>{
 if(!audio||!master)return;
 const osc=audio.createOscillator(),amp=audio.createGain();
 osc.type=wave;osc.frequency.setValueAtTime(freq,time);
 amp.gain.setValueAtTime(0,time);amp.gain.linearRampToValueAtTime(volume,time+.035);
 amp.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.24),time+length*.72);
 amp.gain.exponentialRampToValueAtTime(.0001,time+length);
 osc.connect(amp).connect(master);osc.start(time);osc.stop(time+length+.015);
};
const soundscape=()=>{
 if(!Audio||audio)return;
 try{
  audio=new Audio();audio.resume?.();
  master=audio.createGain();master.gain.value=.0001;master.connect(audio.destination);
  const t=audio.currentTime+.04;clock=t;
  master.gain.setTargetAtTime(.32,t,.13);
  [[146.83,0,1.45,.13],[220,0,1.75,.09],[293.66,0,1.65,.08],[369.99,.06,1.3,.075],
   [440,.55,.48,.12],[587.33,.82,.48,.11],[659.26,1.16,.55,.12],[739.99,1.5,.65,.11],
   [587.33,1.82,.54,.12],[880,2.14,.58,.10],[739.99,2.5,.78,.11],[1174.66,2.8,.78,.085]
  ].forEach(([n,d,l,v],i)=>tone(n,t+d,l,v,i<4?'sine':'triangle'));
  tone(73.42,t,3.4,.08,'sine');
 }catch(_){audio=null;master=null}
};
const stopAudio=()=>{
 if(!audio||!master)return;
 try{const t=audio.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(.0001,t,.08);const a=audio;setTimeout(()=>{try{a.close()}catch(_){}},450)}catch(_){}
};
const finish=()=>{
 if(closed)return;closed=true;
 clearTimeout(finishTimer);
 try{sessionStorage.setItem(key,'seen')}catch(_){}
 stopAudio();body.classList.remove('afc-lock');
 root.classList.add('is-exiting');
 setTimeout(()=>root.remove(),750);
};
const start=(withAudio)=>{
 if(started||closed)return;started=true;
 root.classList.add('is-playing');
 sound.textContent=withAudio?'SOUND ON ↗':'SOUND OFF ↗';
 sound.setAttribute('aria-pressed',String(withAudio));
 if(withAudio)soundscape();
 finishTimer=setTimeout(finish,totalMs);
};
enter?.addEventListener('click',()=>start(true));
silent?.addEventListener('click',()=>start(false));
skip?.addEventListener('click',finish);
sound?.addEventListener('click',()=>{
 if(!started)return;
 const audible=sound.getAttribute('aria-pressed')!=='true';
 if(audible&&!audio)soundscape();
 if(master&&audio)try{master.gain.setTargetAtTime(audible?.27:.0001,audio.currentTime,.08)}catch(_){}
 sound.textContent=audible?'SOUND ON ↗':'SOUND OFF ↗';
 sound.setAttribute('aria-pressed',String(audible));
});
document.addEventListener('keydown',e=>{if(!closed&&e.key==='Escape')finish()});
window.addEventListener('pagehide',()=>{if(!closed){stopAudio();body.classList.remove('afc-lock')}},{once:true});
})();