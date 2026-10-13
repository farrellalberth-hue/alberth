/* AFH COSMOS V14 — original high-DPI star canvas, procedural WebGL planet,
   scroll-based 3D transforms, reduced-motion and context loss fallbacks. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=window.matchMedia('(pointer:fine)').matches;
const hero=$('.afh3-hero'),orb=$('.afh3-orbit-system');
const starCanvas=$('#afh4-starfield');
const planetCanvas=$('#afh4-planet');
const life=$('.lifetime-section');
const steps=$$('.lifetime-step');
const quote=$('#afh4-quote');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const randSeed=(seed)=>()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const random=randSeed(782614);
let pageScroll=0,mx=0,my=0,mouseX=0,mouseY=0,scrollQueued=false;
if(hero&&orb&&!reduce){
 const queue=()=>{
   if(scrollQueued)return;scrollQueued=true;
   requestAnimationFrame(()=>{
     scrollQueued=false;
     const bounds=hero.getBoundingClientRect();
     const progress=clamp(-bounds.top/Math.max(bounds.height,1),0,1);
     orb.style.setProperty('--scroll-shift',(progress*310).toFixed(1)+'px');
     orb.style.setProperty('--scroll-scale',(1+progress*.46).toFixed(3));
     orb.style.setProperty('--scroll-rotate',(progress*19).toFixed(1)+'deg');
     hero.style.setProperty('--text-scroll',(progress*190).toFixed(1)+'px');
     if(life&&innerWidth>900){
       const r=life.getBoundingClientRect();
       life.style.setProperty('--afh-life-sway',(clamp(-r.top/Math.max(r.height,1),0,1)*8-4).toFixed(2));
       steps.forEach((el,i)=>{
         const box=el.getBoundingClientRect();
         const dist=(box.top+box.height*.5-innerHeight*.48)/(innerHeight*.9);
         const t=clamp(dist,-1.5,1.5);
         el.style.setProperty('--afh-step-y',(Math.abs(t)*10).toFixed(1)+'px');
         el.style.setProperty('--afh-step-z',(-Math.abs(t)*110+16).toFixed(1)+'px');
         el.style.setProperty('--afh-step-x',(t*-8).toFixed(2)+'deg');
         el.style.setProperty('--afh-step-ry',(t*(i%2===0?5:-5)).toFixed(2)+'deg');
       });
     }
     const features=$('.afh3-feature');
     features.forEach((el,i)=>{
       const box=el.getBoundingClientRect();
       const d=clamp((box.top+box.height*.5-innerHeight*.5)/innerHeight,-1.2,1.2);
       el.style.setProperty('--afh-feature-y',(d*22).toFixed(1)+'px');
       el.style.setProperty('--afh-feature-z',(-Math.abs(d)*70).toFixed(1)+'px');
       el.style.setProperty('--afh-feature-rot',(d*(i%2===0?5:-5)).toFixed(1)+'deg');
     });
     if(quote){
       const q=quote.getBoundingClientRect();
       const d=clamp((q.top-innerHeight)/Math.max(q.height,1),-1.2,1.2);
       quote.style.setProperty('--afh-quote-shift',(d*-55).toFixed(1)+'px');
     }
     pageScroll=window.scrollY||0;
   });
 };
 addEventListener('scroll',queue,{passive:true});
 addEventListener('resize',queue,{passive:true});
 queue();
}
if(hero&&fine&&!reduce){
 hero.addEventListener('pointermove',e=>{
   const r=hero.getBoundingClientRect();
   mouseX=((e.clientX-r.left)/r.width-.5)*2;
   mouseY=((e.clientY-r.top)/r.height-.5)*2;
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{mouseX=mouseY=0},{passive:true});
}
// Stars: two depths, glow and cross-shaped flare animations.
if(starCanvas){
 const ctx=starCanvas.getContext('2d',{alpha:true});
 if(ctx){
   let W=0,H=0,dpr=1,stars=[],raf=0,last=0,visible=true;
   const resize=()=>{
     const r=starCanvas.getBoundingClientRect();
     W=Math.max(1,r.width);H=Math.max(1,r.height);
     dpr=Math.max(1,Math.min(devicePixelRatio||1,2.5,Math.sqrt(8294400/(W*H))));
     starCanvas.width=Math.round(W*dpr);starCanvas.height=Math.round(H*dpr);
     ctx.setTransform(dpr,0,0,dpr,0,0);
     const count=innerWidth<600?95:Math.min(460,Math.max(175,Math.round(W*H/8500)));
     stars=Array.from({length:count},(_,i)=>({
       x:random()*W,y:random()*H,r:.45+random()*1.65,
       speed:.0006+random()*.0013,offset:random()*Math.PI*2,
       gold:random()>.38,flare:random()>.89,depth:.13+random()*.87
     }));
   };
   const draw=(t)=>{
     if(!visible)return;
     if(t-last<34&&!reduce){raf=requestAnimationFrame(draw);return}
     last=t;ctx.clearRect(0,0,W,H);
     mx+=(mouseX-mx)*.025;my+=(mouseY-my)*.025;
     for(const s of stars){
       const a=reduce?.53:(.24+.76*Math.pow(.5+.5*Math.sin(t*s.speed+s.offset),2));
       const x=s.x+mx*s.depth*15,y=s.y+my*s.depth*12-(pageScroll*.015*s.depth%H);
       const yy=((y%H)+H)%H;
       const glow=s.r*(s.flare?8:5);
       const grad=ctx.createRadialGradient(x,yy,0,x,yy,glow);
       grad.addColorStop(0,s.gold?'rgba(255,238,203,'+a+')':'rgba(235,236,255,'+a+')');
       grad.addColorStop(.18,s.gold?'rgba(255,188,124,'+(a*.6)+')':'rgba(211,214,255,'+(a*.35)+')');
       grad.addColorStop(1,'rgba(255,200,160,0)');
       ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,yy,glow,0,Math.PI*2);ctx.fill();
       if(s.flare&&a>.42){
         const line=glow*(.8+a);
         ctx.strokeStyle=s.gold?'rgba(255,224,178,'+(a*.8)+')':'rgba(231,237,255,'+(a*.7)+')';
         ctx.lineWidth=.75;ctx.beginPath();
         ctx.moveTo(x-line,yy);ctx.lineTo(x+line,yy);
         ctx.moveTo(x,yy-line);ctx.lineTo(x,yy+line);ctx.stroke();
       }
     }
     if(!reduce)raf=requestAnimationFrame(draw);
   };
   resize();raf=requestAnimationFrame(draw);
   addEventListener('resize',resize,{passive:true});
   document.addEventListener('visibilitychange',()=>{
     visible=!document.hidden;
     if(visible)raf=requestAnimationFrame(draw);
     else cancelAnimationFrame(raf);
   });
 }
}
// A fragment-shaded sphere with changing geological cloud patterns: no external WebGL assets.
if(planetCanvas){
 let gl=null;
 try{gl=planetCanvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:false,depth:false});}catch(_){}
 if(gl){
   try{
     const vertex='attribute vec2 aPos; varying vec2 vUv; void main(){vUv=(aPos+1.0)*0.5;gl_Position=vec4(aPos,0.0,1.0);}';
     const fragment=String.raw`precision highp float;
varying vec2 vUv;
uniform float uTime;
float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise(vec3 p){
 vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(hash(i),hash(i+vec3(1.,0.,0.)),f.x),mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),
 mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
float fbm(vec3 p){
 float f=0.,amp=.5;
 for(int i=0;i<6;i++){f+=noise(p)*amp;p=p*2.03+vec3(7.1,2.7,9.3);amp*=.49;}
 return f;
}
void main(){
 vec2 p=vUv*2.-1.;
 float rr=dot(p,p);
 if(rr>=.998){discard;}
 float z=sqrt(1.-rr);
 vec3 norm=normalize(vec3(p,z));
 float t=uTime*.026;
 float az=atan(norm.x,norm.z)+t;
 float el=asin(norm.y);
 vec3 q=vec3(cos(az)*cos(el),sin(el),sin(az)*cos(el));
 float f=fbm(q*4.15+vec3(1.));
 float f2=fbm(q*13.0+vec3(-2.,4.,3.));
 float fine=fbm(q*38.0+vec3(9.0,3.0,-4.0));
 float terrain=smoothstep(.38,.72,f*.84+f2*.16);
 float band=.5+.5*sin(el*28.+f*19.+f2*2.5+fine*2.0);
 vec3 ochre=vec3(.79,.31,.24);
 vec3 blush=vec3(.96,.52,.31);
 vec3 cream=vec3(1.,.77,.54);
 vec3 shadow=vec3(.065,.041,.112);
 vec3 surface=mix(ochre,blush,clamp(terrain*.86+band*.12,0.,1.));
 surface=mix(surface,cream,smoothstep(.64,.87,f2)*.38);
 surface*=.62+f*.75;
 surface*=.84+.32*fine;
 float rugged=pow(abs(fine-.5),1.4);
 surface=mix(surface,vec3(.23,.105,.14),smoothstep(.12,.30,rugged)*.30);
 float cloud=smoothstep(.52,.73,fbm(q*8.6+vec3(2.4,-.5,1.6)));
 surface=mix(surface,vec3(1.,.78,.63),cloud*.46);
 vec3 light=normalize(vec3(-.59,.72,1.05));
 float diffuse=max(dot(norm,light),0.);
 float illumination=.10+.93*pow(diffuse,.88);
 float night=1.0-smoothstep(-.15,.26,dot(norm,light));
 vec3 color=mix(surface*illumination,shadow,night*.79);
 float glowingLava=pow(smoothstep(.61,.85,f2),3.0)*night*.55;
 float veins=(1.0-smoothstep(.02,.08,abs(sin((f*6.0+fine*.6)*16.0))))*night*.24;
 color+=vec3(1.0,.27,.085)*veins;
 color+=vec3(1.,.29,.09)*glowingLava;
 float rim=pow(1.-z,3.5);
 color+=vec3(1.,.42,.22)*rim*.96;
 color+=vec3(1.,.82,.59)*pow(max(dot(reflect(-light,norm),vec3(0.,0.,1.)),0.),24.)*.18;
 gl_FragColor=vec4(color,1.);
}`;
     const compile=(type,source)=>{
       const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);
       if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh)||'shader compile');
       return sh;
     };
     const prog=gl.createProgram();
     gl.attachShader(prog,compile(gl.VERTEX_SHADER,vertex));
     gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,fragment));
     gl.linkProgram(prog);
     if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error('WebGL link');
     gl.useProgram(prog);
     const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
     gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
     const attr=gl.getAttribLocation(prog,'aPos');gl.enableVertexAttribArray(attr);
     gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
     const time=gl.getUniformLocation(prog,'uTime');
     let lost=false,frame=0,last=0,running=true;
     const resize=()=>{
       const rect=planetCanvas.getBoundingClientRect();
       const scale=Math.min(window.devicePixelRatio||1,2.75);
       const maxDim=Math.min(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)||4096,innerWidth<700?1024:innerWidth<1200?2048:4096);
       const desired=Math.max(512,Math.round(Math.max(rect.width,rect.height)*scale));
       const size=Math.min(maxDim,desired);
       planetCanvas.width=size;planetCanvas.height=size;
       gl.viewport(0,0,size,size);
     };
     const draw=(stamp)=>{
       if(!running||lost)return;
       if(stamp-last<(innerWidth<700?83:50)&&!reduce){frame=requestAnimationFrame(draw);return}
       last=stamp;gl.uniform1f(time,reduce?0:stamp*.001);
       gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
       if(!reduce)frame=requestAnimationFrame(draw);
     };
     planetCanvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(frame)});
     planetCanvas.addEventListener('webglcontextrestored',()=>{lost=false;running=false;planetCanvas.style.display='none'});
     resize();frame=requestAnimationFrame(draw);
     addEventListener('resize',resize,{passive:true});
     document.addEventListener('visibilitychange',()=>{
       if(document.hidden){cancelAnimationFrame(frame)}
       else if(running&&!lost)frame=requestAnimationFrame(draw);
     });
   }catch(e){planetCanvas.style.display='none'}
 }
}
// Stable decorative glints, with no motion when reduced motion is selected.
$$('.afh4-sparkle,.afh4-quote-glint').forEach((el,i)=>{
 el.style.setProperty('--delay',(-((i*2.71)%5)).toFixed(2)+'s');
 el.style.setProperty('--dur',(2.2+((i*7)%13)/7).toFixed(2)+'s');
});
})();