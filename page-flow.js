/* Fallback only: single dark exit fade where cross-document transitions
 * are unsupported. Modern Chromium uses one shared native crossfade instead. */
(()=>{"use strict";
 if("startViewTransition" in document||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 let departing=false;
 document.addEventListener("click",ev=>{
  const link=ev.target.closest?.("a[href]");
  if(!link||departing||ev.defaultPrevented||ev.button!==0||ev.metaKey||ev.ctrlKey||ev.altKey||ev.shiftKey||link.hasAttribute("download")||(link.target&&link.target!=="_self"))return;
  let target;try{target=new URL(link.href,location.href)}catch(e){return}
  if(target.origin!==location.origin||target.pathname===location.pathname&&target.search===location.search)return;
  ev.preventDefault();departing=true;
  document.documentElement.classList.add("page-flow-fallback-out");
  setTimeout(()=>location.assign(target.href),370);
 },true);
 addEventListener("pageshow",ev=>{
  if(ev.persisted){departing=false;document.documentElement.classList.remove("page-flow-fallback-out")}
 });
})();