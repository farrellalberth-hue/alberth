/* AFH V35 Orbital Monolith — actual vertex/normal 3D WebGL rendering.
   Chrome sphere, lit torus geometry, independent rotations, depth, CSS fallback. */
(()=>{'use strict';
const root=document.getElementById('afh-intro-2026');
if(!root||!root.classList.contains('afh35-opening'))return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,KEY='afh-orbital-v35-seen';
let seen=false;try{seen=sessionStorage.getItem(KEY)==='1'}catch(_){}
const replay=new URLSearchParams(location.search).has('intro');
if(reduced||(seen&&!replay)){root.remove();return}
const canvas=root.querySelector('#afh35-webgl'),mobile=matchMedia('(max-width:767px)').matches;
const duration=4850;let dead=false,started=performance.now(),raf=0,finishTimer=0,gl=null;
document.body.classList.add('afc-lock');
const finish=()=>{
 if(dead)return;dead=true;document.body.classList.remove('afc-lock');
 try{sessionStorage.setItem(KEY,'1')}catch(_){}
 if(raf)cancelAnimationFrame(raf);if(finishTimer)clearTimeout(finishTimer);
 root.classList.add('is-exiting');document.body.classList.add('afh35-landed');
 setTimeout(()=>{
  root.remove();document.body.classList.remove('afh35-landed');
  if(gl){const lose=gl.getExtension('WEBGL_lose_context');try{lose?.loseContext()}catch(_){}}
 },650);
};
root.querySelector('#afh35-skip')?.addEventListener('click',finish);
addEventListener('keydown',e=>{if(e.key==='Escape')finish()});
addEventListener('pagehide',finish,{once:true});
finishTimer=setTimeout(finish,duration);
if(!canvas)return;
try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false,powerPreference:'low-power'})
||canvas.getContext('experimental-webgl',{alpha:true,antialias:true,depth:true,premultipliedAlpha:false,powerPreference:'low-power'})}catch(_){}
if(!gl)return; // CSS sphere remains visible.
const vert="\nattribute vec3 aPos;attribute vec3 aNor;\nuniform vec3 uAng;uniform float uAspect;uniform float uSize;uniform vec2 uOffset;\nvarying vec3 vNormal;varying vec3 vWorld;varying vec3 vLocal;\nvec3 rot(vec3 p,vec3 a){\n float cy=cos(a.y),sy=sin(a.y);p=vec3(cy*p.x+sy*p.z,p.y,-sy*p.x+cy*p.z);\n float cx=cos(a.x),sx=sin(a.x);p=vec3(p.x,cx*p.y-sx*p.z,sx*p.y+cx*p.z);\n float cz=cos(a.z),sz=sin(a.z);return vec3(cz*p.x-sz*p.y,sz*p.x+cz*p.y,p.z);\n}\nvoid main(){\n vec3 p=rot(aPos*uSize,uAng);vec3 n=normalize(rot(aNor,uAng));\n float d=max(2.8,5.7-p.z);\n vec2 projected=vec2((p.x*2.1/uAspect)/d,(p.y*2.1)/d)+uOffset;\n gl_Position=vec4(projected*d,-p.z,d);\n vNormal=n;vWorld=p;vLocal=aPos;\n}";
const frag="\nprecision mediump float;\nuniform vec3 uColor;uniform float uMaterial;uniform float uTime;\nvarying vec3 vNormal;varying vec3 vWorld;varying vec3 vLocal;\nvoid main(){\n vec3 n=normalize(vNormal),view=vec3(0.,0.,1.);\n vec3 l1=normalize(vec3(-.47,.79,.8)),l2=normalize(vec3(.73,-.31,.58));\n float d1=max(dot(n,l1),0.),d2=max(dot(n,l2),0.);\n float spec=pow(max(dot(reflect(-l1,n),view),0.),64.)*.96+pow(max(dot(reflect(-l2,n),view),0.),110.)*.55;\n float fres=pow(1.-abs(dot(n,view)),3.);\n vec3 col;\n if(uMaterial<.5){\n  float drift=sin(vLocal.y*9.2+sin(vLocal.x*10.8)*1.3+uTime*.32);\n  float strata=sin(vLocal.x*11.7+vLocal.z*13.9+uTime*.22);\n  vec3 night=vec3(.052,.074,.126),steel=vec3(.30,.39,.51);\n  vec3 pearl=vec3(.72,.73,.78),champ=vec3(.93,.67,.51);\n  col=mix(night,steel,.21+min(d1*.45,.48));\n  col+=pearl*pow(max(d1,0.),2.1)*.24;\n  col+=champ*pow(max(d2,0.),4.)*.23;\n  col+=vec3(.16,.12,.2)*(drift*.5+.5)*.33;\n  col+=vec3(.14,.16,.21)*(strata*.5+.5)*.11;\n  col+=spec*vec3(1.,.83,.68)*.91;\n  col+=fres*vec3(.57,.48,.67)*.5;\n }else{\n  col=uColor*(.18+d1*.70+d2*.30);\n  col+=vec3(1.,.96,.9)*spec*.92;\n  col+=fres*mix(uColor,vec3(.95,.91,1.),.4)*.57;\n }\n gl_FragColor=vec4(pow(clamp(col,0.,1.),vec3(.85)),1.);\n}";
function shader(type,source){
 const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);
 if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh)||'shader');
 return sh;
}
let program;
try{
 program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('shader link');
}catch(err){console.info('AFH WebGL unavailable; CSS fallback retained',String(err).slice(0,140));return}
gl.useProgram(program);
const attrPos=gl.getAttribLocation(program,'aPos'),attrNor=gl.getAttribLocation(program,'aNor');
const uni={
 ang:gl.getUniformLocation(program,'uAng'),aspect:gl.getUniformLocation(program,'uAspect'),
 size:gl.getUniformLocation(program,'uSize'),offset:gl.getUniformLocation(program,'uOffset'),
 color:gl.getUniformLocation(program,'uColor'),material:gl.getUniformLocation(program,'uMaterial'),
 time:gl.getUniformLocation(program,'uTime')
};
const makeMesh=(positions,normals,indices)=>{
 const vv=new Float32Array(positions.length*2);
 for(let i=0;i<positions.length/3;i++){
  for(let j=0;j<3;j++){vv[i*6+j]=positions[i*3+j];vv[i*6+3+j]=normals[i*3+j]}
 }
 const v=gl.createBuffer(),idx=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,v);gl.bufferData(gl.ARRAY_BUFFER,vv,gl.STATIC_DRAW);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idx);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
 return{v,idx,count:indices.length};
};
function sphere(stacks=32,slices=64){
 const p=[],n=[],ids=[];
 for(let i=0;i<=stacks;i++){
  const a=i/stacks*Math.PI;
  for(let j=0;j<=slices;j++){
   const b=j/slices*2*Math.PI,x=Math.sin(a)*Math.cos(b),y=Math.cos(a),z=Math.sin(a)*Math.sin(b);
   p.push(x,y,z);n.push(x,y,z);
  }
 }
 for(let i=0;i<stacks;i++)for(let j=0;j<slices;j++){
  const k=i*(slices+1)+j,q=k+slices+1;
  ids.push(k,q,k+1,k+1,q,q+1);
 }
 return makeMesh(p,n,ids);
}
function torus(R=1.44,r=.078,sections=96,sides=14){
 const p=[],n=[],ids=[];
 for(let i=0;i<=sections;i++){
  const a=i/sections*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
  for(let j=0;j<=sides;j++){
   const v=j/sides*Math.PI*2,cv=Math.cos(v),sv=Math.sin(v);
   p.push((R+r*cv)*ca,r*sv,(R+r*cv)*sa);
   n.push(cv*ca,sv,cv*sa);
  }
 }
 for(let i=0;i<sections;i++)for(let j=0;j<sides;j++){
  const k=i*(sides+1)+j,q=k+sides+1;
  ids.push(k,k+1,q,k+1,q+1,q);
 }
 return makeMesh(p,n,ids);
}
const ball=sphere(mobile?28:36,mobile?52:72);
const rings=[
 {m:torus(1.52,.049,mobile?66:110,mobile?10:15),ang:[.85,.2,-.46],col:[.94,.72,.55]},
 {m:torus(1.68,.037,mobile?70:112,mobile?9:13),ang:[-.38,1.24,.92],col:[.60,.71,.92]},
 {m:torus(1.88,.018,mobile?72:120,mobile?8:12),ang:[1.24,-.55,-.13],col:[.75,.59,.80]}
];
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
gl.enableVertexAttribArray(attrPos);gl.enableVertexAttribArray(attrNor);
gl.clearColor(0,0,0,0);
let w=1,h=1,ready=false;
function resize(){
 const r=canvas.getBoundingClientRect();if(r.width<10||r.height<10)return false;
 w=r.width;h=r.height;
 const d=Math.max(.6,Math.min(devicePixelRatio||1,mobile?1.25:1.6,Math.sqrt(1700000/(w*h))));
 const dw=Math.round(w*d),dh=Math.round(h*d);
 if(canvas.width!==dw||canvas.height!==dh){canvas.width=dw;canvas.height=dh}
 gl.viewport(0,0,dw,dh);return true;
}
function drawMesh(o,angle,color,material,time,scale){
 gl.bindBuffer(gl.ARRAY_BUFFER,o.v);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.idx);
 gl.vertexAttribPointer(attrPos,3,gl.FLOAT,false,24,0);
 gl.vertexAttribPointer(attrNor,3,gl.FLOAT,false,24,12);
 gl.uniform3fv(uni.ang,angle);gl.uniform1f(uni.size,scale);
 gl.uniform3fv(uni.color,color);gl.uniform1f(uni.material,material);
 gl.uniform1f(uni.time,time);gl.drawElements(gl.TRIANGLES,o.count,gl.UNSIGNED_SHORT,0);
}
function paint(ms){
 if(!resize())return;
 const t=ms/1000,p=Math.min(1,ms/duration);
 const ease=x=>x*x*(3-2*x);
 const enter=ease(Math.min(1,p/.22));
 const exit=ease(Math.max(0,Math.min(1,(p-.80)/.20)));
 // A restrained final dolly makes the handoff to the homepage feel continuous.
 const size=mobile?.78:.72;
 const scale=(.48+enter*(size-.48))*(1+exit*.075);
 const aspect=Math.max(.38,w/h);
 const targetY=mobile?(h<680?.42:.33):.09;
 gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.uniform1f(uni.aspect,aspect);gl.uniform2f(uni.offset,mobile?0:.52,targetY);
 drawMesh(ball,[.16+Math.sin(t*.27)*.14,t*.4,.03],[.6,.64,.75],0,t,scale);
 rings.forEach((o,i)=>{
  const a=o.ang,turn=t*(i===1?-.47:.35);
  drawMesh(o.m,[a[0]+Math.sin(t*.46+i)*.16,a[1]+turn,a[2]+turn*.29],o.col,1,t,scale);
 });
 if(!ready){ready=true;root.classList.add('afh35-webgl-ready')}
}
let lastTime=0;
function frame(now){
 raf=0;if(dead||document.hidden)return;
 if(lastTime&&now-lastTime<(mobile?33:23)){raf=requestAnimationFrame(frame);return}
 lastTime=now;
 paint(Math.max(0,Math.min(duration,now-started)));
 if(!dead)raf=requestAnimationFrame(frame);
}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();root.classList.remove('afh35-webgl-ready');if(raf)cancelAnimationFrame(raf);raf=0;},{once:true});
try{paint(0);raf=requestAnimationFrame(frame)}catch(e){root.classList.remove('afh35-webgl-ready');console.info('AFH fallback',String(e).slice(0,100))}
addEventListener('resize',()=>{if(!dead){try{paint(performance.now()-started)}catch(_){}}},{passive:true});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0}
 else if(!document.hidden&&!dead&&!raf)raf=requestAnimationFrame(frame)
});
})();