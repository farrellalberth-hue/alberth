/* AFH V17 / LOBBY SESSIONS
   Original procedural ambient piano & jazz lounge harmony.
   No audio download, network request, copyrighted samples, permission modal or autoplay bypass.
   Web Audio unmuted autoplay is only attempted; if the browser blocks it,
   the first natural pointer/key interaction resumes playback. */
(()=>{'use strict';
const root=document.querySelector('#afh17-audio');
if(!root)return;
const play=root.querySelector('#afh17-audio-toggle');
const slider=root.querySelector('#afh17-volume');
const label=root.querySelector('#afh17-audio-state');
const AC=window.AudioContext||window.webkitAudioContext;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const current=()=>performance.now();
const chords=[
 {name:'Dm9',bass:73.42,notes:[146.83,174.61,220.00,261.63,329.63],lead:[349.23,329.63,293.66,261.63]},
 {name:'G13',bass:98.00,notes:[146.83,196.00,246.94,293.66,329.63],lead:[293.66,329.63,392.00,349.23]},
 {name:'Cmaj9',bass:65.41,notes:[130.81,164.81,196.00,246.94,293.66],lead:[329.63,293.66,261.63,246.94]},
 {name:'Am9',bass:55.00,notes:[130.81,164.81,196.00,246.94,329.63],lead:[261.63,246.94,220.00,196.00]},
 {name:'Fmaj9',bass:87.31,notes:[130.81,174.61,220.00,261.63,329.63],lead:[349.23,392.00,329.63,261.63]},
 {name:'Em7',bass:82.41,notes:[123.47,164.81,196.00,246.94,293.66],lead:[329.63,293.66,246.94,220.00]}
];
const progression=[0,1,2,3,4,5,0,1];
let audio=null,master=null,dry=null,reverb=null,wet=null,lowpass=null,interval=null;
let enabled=true,unlocked=false,playing=false,secondsPerBeat=60/76;
let nextBar=0,barIndex=0,selectedVolume=Number(slider?.value??30)/100;
const setStatus=s=>{if(label)label.textContent=s;root.dataset.playing=String(playing);play?.setAttribute('aria-pressed',String(playing));root.title=s};
const gainAt=(node,from,to,start,duration)=>{
 node.gain.setValueAtTime(Math.max(.0001,from),start);
 node.gain.exponentialRampToValueAtTime(Math.max(.0001,to),start+duration);
};
const noiseImpulse=(ctx,seconds=1.55)=>{
 const len=Math.floor(ctx.sampleRate*seconds);
 const buffer=ctx.createBuffer(2,len,ctx.sampleRate);
 let seed=217041;
 for(let ch=0;ch<2;ch++){
  const data=buffer.getChannelData(ch);
  for(let i=0;i<len;i++){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   const n=(seed/2147483648-1);
   data[i]=n*Math.pow(1-i/len,2.4)*.32;
  }
 }
 return buffer;
};
const ensure=()=>{
 if(audio||!AC)return!!audio;
 try{
  audio=new AC({latencyHint:'playback'});
  master=audio.createGain();master.gain.value=.0001;
  const compressor=audio.createDynamicsCompressor();
  compressor.threshold.value=-22;compressor.knee.value=18;compressor.ratio.value=3;
  compressor.attack.value=.01;compressor.release.value=.3;
  lowpass=audio.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=5800;
  dry=audio.createGain();dry.gain.value=.83;
  wet=audio.createGain();wet.gain.value=.21;
  const convolver=audio.createConvolver();convolver.buffer=noiseImpulse(audio);
  lowpass.connect(dry);lowpass.connect(convolver);
  dry.connect(compressor);convolver.connect(wet);wet.connect(compressor);
  compressor.connect(master);master.connect(audio.destination);
  reverb=convolver;
  return true;
 }catch(_){audio=null;setStatus('SOUND UNAVAILABLE');return false}
};
const scheduleVoice=(freq,at,len,level,type='triangle',detune=0)=>{
 if(!audio||!lowpass)return;
 const osc=audio.createOscillator(),vol=audio.createGain();
 osc.type=type;osc.frequency.setValueAtTime(freq,at);
 if(detune)osc.detune.setValueAtTime(detune,at);
 vol.gain.setValueAtTime(.0001,at);
 vol.gain.linearRampToValueAtTime(level,at+.025);
 vol.gain.exponentialRampToValueAtTime(Math.max(.0001,level*.4),at+Math.min(.8,len*.45));
 vol.gain.exponentialRampToValueAtTime(.0001,at+len);
 osc.connect(vol);vol.connect(lowpass);osc.start(at);osc.stop(at+len+.01);
};
const key=(freq,at,strength=.14,len=1.7)=>{
 if(!audio)return;
 const osc=audio.createOscillator(),shine=audio.createOscillator();
 const filter=audio.createBiquadFilter(),env=audio.createGain();
 filter.type='lowpass';filter.frequency.setValueAtTime(2100,at);
 filter.frequency.exponentialRampToValueAtTime(680,at+.7);
 osc.type='triangle';shine.type='sine';
 osc.frequency.setValueAtTime(freq,at);shine.frequency.setValueAtTime(freq*2.005,at);
 const overtone=audio.createGain();overtone.gain.value=.07;
 env.gain.setValueAtTime(.0001,at);env.gain.linearRampToValueAtTime(strength,at+.013);
 env.gain.exponentialRampToValueAtTime(strength*.27,at+.18);
 env.gain.exponentialRampToValueAtTime(.0001,at+len);
 osc.connect(filter);shine.connect(overtone);overtone.connect(filter);
 filter.connect(env);env.connect(lowpass);
 osc.start(at);shine.start(at);osc.stop(at+len+.02);shine.stop(at+len+.02);
};
const scheduleBar=(chord,when,index)=>{
 const bar=secondsPerBeat*4;
 chord.notes.forEach((freq,i)=>scheduleVoice(freq,when+.015,bar*1.02,(i===0?.016:.010),'sine',i%2?-2:3));
 scheduleVoice(chord.bass,when,bar*.71,.058,'sine');
 key(chord.notes[0],when+.04,.079,1.6);
 key(chord.notes[2],when+secondsPerBeat*1.35,.07,1.4);
 key(chord.lead[(index+1)%4],when+secondsPerBeat*2.1,.065,1.55);
 if(index%2===0)key(chord.lead[(index+2)%4],when+secondsPerBeat*3.2,.054,1.2);
};
const stopScheduling=()=>{
 if(interval!==null){clearInterval(interval);interval=null}
};
const startScheduling=()=>{
 if(!audio||audio.state!=='running'||interval!==null)return;
 playing=true;unlocked=true;
 master.gain.setTargetAtTime(selectedVolume*.34,audio.currentTime,.18);
 if(!nextBar||nextBar<audio.currentTime-.1)nextBar=audio.currentTime+.08;
 const fill=()=>{
  if(!audio||audio.state!=='running'||!enabled)return;
  let guard=0;
  while(nextBar<audio.currentTime+.38&&guard++<4){
   scheduleBar(chords[progression[barIndex%progression.length]],nextBar,barIndex);
   nextBar+=secondsPerBeat*4;barIndex++;
  }
 };
 fill();interval=setInterval(fill,160);setStatus('LOUNGE  •  ON');
};
const pause=()=>{
 enabled=false;playing=false;
 stopScheduling();if(audio&&audio.state!=='closed'){
  const t=audio.currentTime;master.gain.cancelScheduledValues(t);
  master.gain.setTargetAtTime(.0001,t,.09);
 }
 setStatus('LOUNGE  •  OFF');
};
const tryStart=()=>{
 if(!enabled)return;
 if(!ensure()){setStatus('SOUND UNAVAILABLE');return}
 const complete=()=>{if(!enabled||!audio)return;if(audio.state==='running')startScheduling();else setStatus('TAP FOR SOUND')};
 try{
  const p=audio.resume();
  if(p?.then)p.then(complete).catch(()=>setStatus('TAP FOR SOUND'));
  else complete();
 }catch(_){setStatus('TAP FOR SOUND')}
};
play?.addEventListener('click',()=>{
 if(playing){pause();return}
 enabled=true;
 if(audio&&master)master.gain.setTargetAtTime(.0001,audio.currentTime,.025);
 tryStart();
 if(audio&&audio.state==='running')setStatus('LOUNGE  •  ON');
});
slider?.addEventListener('input',()=>{
 selectedVolume=Math.min(1,Math.max(0,Number(slider.value)/100));
 if(master&&audio&&audio.state==='running')master.gain.setTargetAtTime(enabled?selectedVolume*.34:.0001,audio.currentTime,.1);
 slider.setAttribute('aria-valuetext',Math.round(selectedVolume*100)+' percent');
});
// Autoplay is a single best-effort browser request, not a bypass; no entry screen.
setTimeout(()=>{if(enabled)tryStart()},1450);
const unlock=()=>{if(enabled&&!playing)tryStart()};
document.addEventListener('pointerdown',unlock,{passive:true});
document.addEventListener('keydown',unlock);
document.addEventListener('touchstart',unlock,{passive:true});
document.addEventListener('visibilitychange',()=>{
 if(!audio||audio.state!=='running')return;
 if(document.hidden&&playing){stopScheduling();playing=false;master.gain.setTargetAtTime(.0001,audio.currentTime,.1)}
 else if(!document.hidden&&enabled){nextBar=audio.currentTime+.12;tryStart()}
});
addEventListener('pagehide',()=>{
 stopScheduling();
 if(audio){try{audio.close()}catch(_){}}
},{once:true});
setStatus('LOUNGE  •  AUTO');
})();