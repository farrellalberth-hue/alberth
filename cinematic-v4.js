(()=>{"use strict";
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const body=document.body, intro=document.getElementById("intro-v4"),wipe=document.getElementById("page-wipe");
const introMs=2700;
if(intro){
 const skip=intro.querySelector(".skip"),timer=intro.querySelector(".intro-timer"),start=performance.now();
 let raf=0,closed=false;
 const close=()=>{if(closed)return;closed=true;cancelAnimationFrame(raf);body.classList.remove("lock-scroll");intro.classList.add("done");try{sessionStorage.setItem("af-intro-v4","seen")}catch(e){}setTimeout(()=>intro.remove(),420)};
 let seen=false;try{seen=sessionStorage.getItem("af-intro-v4")==="seen"}catch(e){}
 if(reduced||seen){intro.remove();body.classList.remove("lock-scroll")}
 else{body.classList.add("lock-scroll");if(skip)skip.addEventListener("click",close);
 const tick=now=>{if(closed)return;const elapsed=Math.min(introMs,now-start),remaining=Math.ceil((introMs-elapsed)/1000);if(timer)timer.textContent=String(remaining).padStart(2,"0")+" SEC";if(elapsed>=introMs)close();else raf=requestAnimationFrame(tick)};
 raf=requestAnimationFrame(tick);
 }
}
try{if(!reduced&&sessionStorage.getItem("af-transition-v4")==="1"){body.classList.add("transition-in");sessionStorage.removeItem("af-transition-v4");setTimeout(()=>body.classList.remove("transition-in"),970)}}catch(e){}
const menu=document.querySelector(".menu-trigger"),links=document.querySelector(".top-links");
if(menu&&links){menu.addEventListener("click",()=>{const isOpen=links.classList.toggle("open");menu.setAttribute("aria-expanded",String(isOpen));menu.textContent=isOpen?"×":"☰"});links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.textContent="☰"}))}
document.querySelectorAll("a[href]").forEach(a=>a.addEventListener("click",ev=>{
 if(reduced||!wipe||ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey||a.hasAttribute("download")||a.getAttribute("target")==="_blank")return;
 let url;try{url=new URL(a.href,location.href)}catch(e){return}
 if(url.origin!==location.origin)return;
 if(url.pathname===location.pathname&&url.search===location.search)return;
 ev.preventDefault();if(body.classList.contains("transition-out"))return;
 body.classList.add("transition-out");try{sessionStorage.setItem("af-transition-v4","1")}catch(e){}
 setTimeout(()=>location.assign(url.href),380);
}));
if(body.classList.contains("archive-v4")){document.querySelectorAll(".section-group").forEach((el,i)=>el.setAttribute("data-reveal",i%2?"right":"left"));}
const revealEls=Array.from(document.querySelectorAll("[data-reveal]"));
if(reduced||!("IntersectionObserver" in window)){revealEls.forEach(el=>el.classList.add("in-view"))}else{
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");io.unobserve(e.target)}}),{threshold:0.08,rootMargin:"0px 0px -7% 0px"});
 revealEls.forEach((el,i)=>{if(el.hasAttribute("data-stagger"))el.style.setProperty("--reveal-delay",(i%6)*72+"ms");io.observe(el)});
}
document.querySelectorAll('[data-reveal="words"]').forEach(el=>{
 if(el.dataset.split==="yes"||el.children.length)return;
 const words=el.textContent.trim().split(/\s+/);el.replaceChildren();
 words.forEach((word,i)=>{const outer=document.createElement("span"),inner=document.createElement("span");outer.className="word";inner.textContent=word;inner.style.setProperty("--wi",String(i));outer.appendChild(inner);el.appendChild(outer);el.appendChild(document.createTextNode(" "))});el.dataset.split="yes";
});
const meter=document.getElementById("reading-line"),hero=document.querySelector(".hero-v4"),quote=document.querySelector(".quote-panel");
let running=false;const update=()=>{running=false;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),p=Math.min(1,Math.max(0,scrollY/max));if(meter)meter.style.width=(p*100).toFixed(2)+"%";if(hero){let h=hero.getBoundingClientRect();hero.style.setProperty("--scroll",String(Math.min(3,Math.max(0,-h.top/Math.max(1,h.height)))))}
if(quote){let rect=quote.getBoundingClientRect(),mid=(innerHeight/2)-(rect.top+rect.height/2);quote.style.setProperty("--quote-shift",(mid*.05).toFixed(1)+"px")}};
addEventListener("scroll",()=>{if(running)return;running=true;requestAnimationFrame(update)},{passive:true});addEventListener("resize",()=>requestAnimationFrame(update));update();
})();
