/* VIEL — five-discipline cinematic passage, click-to-route without external libs.
   Capture listener supersedes the homepage legacy flat wipe for library routes. */
(()=>{"use strict";
const KEY="viel-atlas-pass-v1",DURATION=820;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
const scenes={
 all:["00","ALL TOPICS","THE KNOWLEDGE UNIVERSE"],
 economics:["01","ECONOMICS","EQUILIBRIUM IN MOTION"],
 finance:["02","FINANCE","CAPITAL IN MOTION"],
 crypto:["03","CRYPTO","DISTRIBUTED INTELLIGENCE"],
 others:["04","OTHERS","THE LEARNING HELIX"],
 home:["VL","VIEL PERSONAL WEBSITE","THE ART OF UNDERSTANDING"]
};
let portal=null,busy=false;
function classify(url){
 const parts=url.pathname.replace(/\/index\.html$/,"/").split("/").filter(Boolean);
 let id=null;
 if(parts.length===0)id="home";
 else if(parts[0]==="library"&&parts.length<=2)id=parts[1]||"all";
 return id&&scenes[id]?{id,parts:scenes[id]}:null;
}
function getPortal(){
 if(portal)return portal;
 const p=document.createElement("div");
 p.className="atlas-passage";p.setAttribute("aria-hidden","true");
 p.innerHTML=[
 '<div class="atlas-passage-shade"></div>',
 '<div class="atlas-passage-grid"></div>',
 '<div class="atlas-passage-depth">',
 '<span class="atlas-passage-ring ring-outer"></span>',
 '<span class="atlas-passage-ring ring-middle"></span>',
 '<span class="atlas-passage-ring ring-inner"></span>',
 '<span class="atlas-passage-streak streak-one"></span>',
 '<span class="atlas-passage-streak streak-two"></span>',
 '</div><div class="atlas-passage-crosshair"></div>',
 '<div class="atlas-passage-label">',
 '<span class="atlas-passage-kicker">VIEL PERSONAL WEBSITE <i></i> KNOWLEDGE ATLAS</span>',
 '<span class="atlas-passage-index"></span>',
 '<strong class="atlas-passage-name"></strong>',
 '<span class="atlas-passage-caption"></span>',
 '<span class="atlas-passage-progress"></span>',
 '</div><span class="atlas-passage-serial">ARCHIVE / CONTINUITY OF IDEAS</span>'
 ].join("");
 document.body.appendChild(p);portal=p;return p;
}
function show(data){
 const p=getPortal(),[num,name,caption]=data.parts;
 p.querySelector(".atlas-passage-index").textContent=num==="VL"?"VIEL / ATLAS":num+" / 04";
 p.querySelector(".atlas-passage-name").textContent=name;
 p.querySelector(".atlas-passage-caption").textContent=caption;
 p.dataset.scene=data.id;return p;
}
document.addEventListener("click",ev=>{
 const a=ev.target.closest?.("a[href]");
 if(!a||busy||ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey||a.hasAttribute("download")||(a.target&&a.target!=="_self"))return;
 let url;try{url=new URL(a.href,location.href)}catch(e){return}
 if(url.origin!==location.origin)return;
 const dest=classify(url),current=classify(new URL(location.href));
 if(!dest||!current||dest.id===current.id&&url.pathname===location.pathname&&url.search===location.search)return;
 if(dest.id==="home"&&current.id==="home")return;
 ev.preventDefault();ev.stopImmediatePropagation();
 busy=true;const p=show(dest);
 const x=ev.clientX>0?ev.clientX:innerWidth/2,y=ev.clientY>0?ev.clientY:innerHeight/2;
 p.style.setProperty("--passage-x",x+"px");p.style.setProperty("--passage-y",y+"px");
 a.classList.add("atlas-link-departing");
 document.documentElement.classList.add("atlas-passage-lock");
 requestAnimationFrame(()=>p.classList.add("atlas-passage--leaving"));
 try{sessionStorage.setItem(KEY,JSON.stringify({id:dest.id,at:Date.now()}))}catch(e){}
 setTimeout(()=>location.assign(url.href),DURATION);
},true);
let previous=null;
try{previous=JSON.parse(sessionStorage.getItem(KEY)||"null");sessionStorage.removeItem(KEY)}catch(e){}
if(previous&&scenes[previous.id]&&Date.now()-previous.at<15000){
 const p=show({id:previous.id,parts:scenes[previous.id]});
 p.classList.add("atlas-passage--arriving");
 document.documentElement.classList.add("atlas-passage-lock");
 setTimeout(()=>{p.remove();portal=null;document.documentElement.classList.remove("atlas-passage-lock")},930);
}
addEventListener("pageshow",event=>{
 if(!event.persisted)return;
 busy=false;document.documentElement.classList.remove("atlas-passage-lock");
 document.body.classList.remove("transition-out");
 if(portal){portal.remove();portal=null}
 document.querySelectorAll(".atlas-link-departing").forEach(el=>el.classList.remove("atlas-link-departing"));
});
})();