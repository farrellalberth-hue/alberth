/* AFH Galaxy V29 — native WebGL, zero runtime dependencies.
   GPU spiral arms and volumetric core; drag/touch/keyboard orbit, pause/reset,
   adaptive mobile resolution and offscreen pause. Existing ESA M51 photo is fallback. */
(()=>{'use strict';
const hero=document.querySelector('.hero.afh20-hero');
const holder=document.getElementById('afh29-galaxy'),canvas=document.getElementById('afh29-canvas');
const grip=document.getElementById('afh29-interaction'),toggle=document.getElementById('afh29-autospin'),reset=document.getElementById('afh29-reset');
if(!hero||!holder||!canvas||!grip)return;
const mobile=matchMedia('(max-width:767px)').matches;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power'})
 ||canvas.getContext('experimental-webgl',{alpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false});
function fallback(message){
 holder.classList.add('afh29-failed');hero.classList.add('afh29-fallback');hero.classList.remove('afh29-enabled');
 if(message)console.info('AFH 3D galaxy fallback:',message);
}
if(!gl){fallback('WebGL unavailable');return;}
const vertex=[
'attribute vec3 aPosition;','attribute vec3 aColor;','attribute float aSize;',
'uniform float uYaw;','uniform float uPitch;','uniform float uAspect;','uniform float uDpr;','uniform float uScale;',
'varying vec3 vColor;',
'void main(){',
' float cy=cos(uYaw),sy=sin(uYaw),cx=cos(uPitch),sx=sin(uPitch);',
' vec3 q=vec3(aPosition.x*cy-aPosition.z*sy,aPosition.y,aPosition.x*sy+aPosition.z*cy);',
' vec3 p=vec3(q.x,q.y*cx-q.z*sx,q.y*sx+q.z*cx);',
' float persp=5.15/max(2.0,7.2-p.z);',
' vec2 pt=vec2(p.x/max(.75,uAspect),p.y)*persp*uScale;',
' gl_Position=vec4(pt,clamp(p.z/8.,-.9,.9),1.);',
' gl_PointSize=clamp(aSize*persp*uDpr,1.0,22.0);',
' vColor=aColor;','}'
].join('\n');
const fragment=[
'precision mediump float;','varying vec3 vColor;',
'void main(){',
' vec2 xy=gl_PointCoord*2.0-1.0;',
' float d=dot(xy,xy);',' if(d>1.0)discard;',
' float halo=pow(max(0.0,1.0-d),3.4);',
' float core=pow(max(0.0,1.0-d*2.4),6.0);',
' float alpha=.28*halo+.72*core;',
' gl_FragColor=vec4(vColor*(1.12+.28*core),alpha);','}'
].join('\n');
function compile(type,src){
 const shader=gl.createShader(type);if(!shader)throw Error('shader allocation failure');
 gl.shaderSource(shader,src);gl.compileShader(shader);
 if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const err=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw Error(err||'shader compile failure');}
 return shader;
}
let program,buffer,uniforms,points=0;
try{
 const v=compile(gl.VERTEX_SHADER,vertex),f=compile(gl.FRAGMENT_SHADER,fragment);
 program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);
 gl.deleteShader(v);gl.deleteShader(f);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'shader link failure');
 gl.useProgram(program);
 uniforms={yaw:gl.getUniformLocation(program,'uYaw'),pitch:gl.getUniformLocation(program,'uPitch'),
 aspect:gl.getUniformLocation(program,'uAspect'),dpr:gl.getUniformLocation(program,'uDpr'),scale:gl.getUniformLocation(program,'uScale')};
 const rng=(()=>{let state=19022009;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;}})();
 const random=()=>Math.max(.00001,rng());
 const gaussian=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(Math.PI*2*random());
 const count=mobile?2100:5400;
 const data=new Float32Array(count*7);
 const assign=(i,x,y,z,r,g,b,size)=>{const o=i*7;data[o]=x;data[o+1]=y;data[o+2]=z;data[o+3]=r;data[o+4]=g;data[o+5]=b;data[o+6]=size};
 const disk=Math.floor(count*.74),core=disk+Math.floor(count*.18);
 for(let i=0;i<disk;i++){
   const arm=i%4,radius=Math.pow(random(),.65)*2.82;
   const angle=arm*Math.PI/2+radius*2.48+gaussian()*(.13+radius*.056);
   const rr=radius+gaussian()*.075*(1+radius*.33),z=gaussian()*(.064+.11*(1-radius/3));
   const t=random(),light=random();
   const color=t<.26?[.52+light*.38,.65+light*.26,.97]:t<.59?[1,.48+light*.35,.32+light*.27]:[.95,.78+light*.22,.57+light*.37];
   assign(i,Math.cos(angle)*rr,Math.sin(angle)*rr,z,...color,(random()>.985?4:random()>.82?2.2:1)+random()*1.25);
 }
 for(let i=disk;i<core;i++){
   const radius=Math.pow(random(),1.85)*.88,angle=random()*Math.PI*2,z=gaussian()*.3*(1-radius*.5),k=random();
   assign(i,Math.cos(angle)*radius,Math.sin(angle)*radius,z,1,.64+k*.34,.39+k*.57,2+random()*4.4);
 }
 for(let i=core;i<count;i++){
   const radius=2+random()*1.4,angle=random()*Math.PI*2;
   assign(i,Math.cos(angle)*radius,Math.sin(angle)*radius,gaussian()*.65,.59+random()*.4,.58+random()*.35,.8+random()*.2,.8+random()*1.6);
 }
 buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
 const bind=(name,len,offset)=>{
  const loc=gl.getAttribLocation(program,name);if(loc<0)throw Error('missing attribute '+name);
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,len,gl.FLOAT,false,28,offset);
 };
 bind('aPosition',3,0);bind('aColor',3,12);bind('aSize',1,24);
 points=count;gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);
 gl.clearColor(0,0,0,0);
}catch(e){fallback(e.message);return;}
hero.classList.add('afh29-enabled');hero.classList.remove('afh29-fallback');
holder.dataset.renderer='webgl';holder.dataset.starCount=String(points);
const clamp=(n,l,h)=>Math.min(h,Math.max(l,n));
const initial={yaw:.22,pitch:-.56};
let yaw=initial.yaw,pitch=initial.pitch,goalYaw=yaw,goalPitch=pitch,vx=0,vy=0,auto=!reduce;
let visible=true,dragging=false,pointerId=null,lastX=0,lastY=0,frame=0,lastTime=0;
let width=0,height=0,dpr=1,dirty=true,dead=false;
const interval=1000/(mobile?30:50);
function syncButton(){
 if(toggle){
  toggle.setAttribute('aria-pressed',String(auto));
  toggle.textContent=auto?'Ⅱ PAUSE ORBIT':'▶ AUTO ROTATE';
  toggle.setAttribute('aria-label',auto?'Pause automatic galaxy rotation':'Resume automatic galaxy rotation');
 }
 holder.dataset.mode=auto?'auto':'paused';
}
syncButton();
function resize(){
 if(dead)return;
 const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
 dpr=Math.min(devicePixelRatio||1,mobile?1.4:1.8,Math.sqrt((mobile?1900000:4400000)/(r.width*r.height)));
 const w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
 if(canvas.width!==w||canvas.height!==h){
  canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);width=r.width;height=r.height;dirty=true;
 }
}
function paint(){
 resize();if(!width||!height)return;
 gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
 gl.uniform1f(uniforms.yaw,yaw);gl.uniform1f(uniforms.pitch,pitch);
 gl.uniform1f(uniforms.aspect,width/height);gl.uniform1f(uniforms.dpr,dpr);
 gl.uniform1f(uniforms.scale,mobile?.63:.75);
 gl.drawArrays(gl.POINTS,0,points);dirty=false;
}
function tick(t){
 frame=0;if(dead||!visible||document.hidden)return;
 const delta=lastTime?Math.min(60,t-lastTime):interval;
 if(delta<interval-3){frame=requestAnimationFrame(tick);return;}
 lastTime=t;
 if(auto&&!dragging&&!reduce)goalYaw+=delta*.000115;
 if(!dragging){
  goalYaw+=vx;goalPitch+=vy;vx*=.91;vy*=.90;
  if(Math.abs(vx)<.00002)vx=0;if(Math.abs(vy)<.00002)vy=0;
 }
 goalPitch=clamp(goalPitch,-1.38,1.38);
 yaw+=(goalYaw-yaw)*.19;pitch+=(goalPitch-pitch)*.19;
 const animating=auto||dragging||Math.abs(goalYaw-yaw)>.0002||Math.abs(goalPitch-pitch)>.0002||vx!==0||vy!==0;
 if(dirty||animating)paint();
 if(animating||dirty)frame=requestAnimationFrame(tick);
}
function schedule(){if(!dead&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
grip.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 dragging=true;pointerId=e.pointerId;lastX=e.clientX;lastY=e.clientY;vx=0;vy=0;
 try{grip.setPointerCapture(e.pointerId);}catch(_){}
 schedule();
});
grip.addEventListener('pointermove',e=>{
 if(!dragging||e.pointerId!==pointerId)return;
 const dx=e.clientX-lastX,dy=e.clientY-lastY;
 goalYaw+=dx*(mobile?.0085:.007);goalPitch=clamp(goalPitch-dy*.006,-1.38,1.38);
 vx=clamp(dx*.00036,-.05,.05);vy=clamp(-dy*.00027,-.045,.045);
 lastX=e.clientX;lastY=e.clientY;dirty=true;schedule();
});
function release(e){
 if(!dragging||e.pointerId!==pointerId)return;
 dragging=false;pointerId=null;
 try{if(grip.hasPointerCapture(e.pointerId))grip.releasePointerCapture(e.pointerId);}catch(_){}
 schedule();
}
grip.addEventListener('pointerup',release);
grip.addEventListener('pointercancel',release);
grip.addEventListener('lostpointercapture',()=>{dragging=false;pointerId=null;});
grip.addEventListener('keydown',e=>{
 const amount=e.shiftKey?.4:.15;
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
  e.preventDefault();
  if(e.key==='ArrowLeft')goalYaw-=amount;
  if(e.key==='ArrowRight')goalYaw+=amount;
  if(e.key==='ArrowUp')goalPitch=clamp(goalPitch+amount,-1.38,1.38);
  if(e.key==='ArrowDown')goalPitch=clamp(goalPitch-amount,-1.38,1.38);
  dirty=true;schedule();
 }
});
toggle?.addEventListener('click',()=>{auto=!auto;syncButton();dirty=true;schedule();});
reset?.addEventListener('click',()=>{goalYaw=initial.yaw;goalPitch=initial.pitch;vx=0;vy=0;dirty=true;schedule();});
const intersection=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(entries=>{
 visible=!!entries[0]?.isIntersecting;
 if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}
 if(visible){dirty=true;lastTime=0;schedule();}
},{threshold:.015}):null;
intersection?.observe(hero);
const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{dirty=true;resize();schedule();}):null;
observer?.observe(holder);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}
 if(!document.hidden){lastTime=0;dirty=true;schedule();}
});
let pendingScroll=false;
addEventListener('scroll',()=>{
 if(reduce||pendingScroll||dead)return;pendingScroll=true;
 requestAnimationFrame(()=>{
  pendingScroll=false;if(!visible)return;
  const r=hero.getBoundingClientRect(),progress=clamp(-r.top/Math.max(1,r.height),0,1);
  holder.style.setProperty('--afh29-y',(-progress*14).toFixed(2)+'px');
  dirty=true;schedule();
 });
},{passive:true});
resize();dirty=true;paint();if(!reduce)schedule();
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;fallback('GPU context lost, original hero preserved');},{once:true});
addEventListener('pagehide',()=>{dead=true;intersection?.disconnect();observer?.disconnect();if(frame)cancelAnimationFrame(frame);},{once:true});
})();