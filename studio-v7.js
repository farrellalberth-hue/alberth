/* AFH VIDEO ATLAS V21 — editorial 4K vector posters.
   Self-contained, no missing/gray YouTube thumbnails. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const body=document.body;
const intro=$('#intro-afh');let introTimer=0;
const close=()=>{if(!intro||intro.classList.contains('is-done'))return;clearTimeout(introTimer);intro.classList.add('is-done');body.classList.remove('no-scroll');try{sessionStorage.setItem('afh-intro-v6','seen')}catch(e){}setTimeout(()=>intro.remove(),420)};
if(intro){let seen=false;try{seen=sessionStorage.getItem('afh-intro-v6')==='seen'}catch(e){}if(seen||reduce)intro.remove();else{body.classList.add('no-scroll');introTimer=setTimeout(close,2150);$('.skip-intro',intro)?.addEventListener('click',close)}}
const menu=$('.menu-button'),nav=$('.site-nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰'});
$$('.site-nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='☰'}));
try{if(!reduce&&sessionStorage.getItem('afh-route-v6')==='yes'){body.classList.add('route-in');sessionStorage.removeItem('afh-route-v6');setTimeout(()=>body.classList.remove('route-in'),580)}}catch(e){}
$$('a[href]').forEach(a=>a.addEventListener('click',e=>{
 if(reduce||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download')||body.classList.contains('route-out'))return;
 let u;try{u=new URL(a.href,location.href)}catch(err){return}
 if(u.origin!==location.origin||(u.pathname===location.pathname&&u.search===location.search))return;
 e.preventDefault();body.classList.add('route-out');
 try{sessionStorage.setItem('afh-route-v6','yes')}catch(err){}
 setTimeout(()=>location.assign(u.href),410)
}));
const reveal=$$('[data-appear]');
if(reduce||!('IntersectionObserver'in window))reveal.forEach(x=>x.classList.add('visible'));
else{const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -35px 0px'});reveal.forEach((el,i)=>{el.style.setProperty('--d',(i%4*70)+'ms');obs.observe(el)})}
let pending=false;
function scroll(){pending=false;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);document.documentElement.style.setProperty('--progress',(window.scrollY/max*100).toFixed(2)+'%');const orb=$('.hero-floating'),hero=$('.hero');if(orb&&hero)orb.style.setProperty('--parallax',Math.min(400,Math.max(0,-hero.getBoundingClientRect().top))+'px')}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(scroll)}},{passive:true});addEventListener('resize',scroll);scroll();
if(!reduce&&matchMedia('(pointer:fine)').matches)addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mx',e.clientX+'px');document.documentElement.style.setProperty('--my',e.clientY+'px')},{passive:true});

const grid=$('#youtube-grid');if(!grid)return;
let videos=[],sector='All',query='',year='All',sorting='latest',visible=0,filtered=[];
const buttons=$$('.filter-button[data-sector]'),search=$('#youtube-search'),counter=$('#youtube-count'),empty=$('#youtube-empty'),sel=$('#youtube-year'),sortSel=$('#youtube-sort'),more=$('#youtube-more'),total=$('#youtube-total'),sortNote=$('#youtube-sort-note'),visibleNote=$('#youtube-visible');
const clean=(s)=>String(s||'').trim();
const tidy=(s)=>clean(s).replace(/\s+/g,' ');
const nfmt=(n)=>Number(n).toLocaleString('en-US');
const palette={Crypto:'crypto',AI:'ai',Economics:'economics',Finance:'finance',Business:'business',Education:'education',Technology:'technology',Other:'other'};
const letters={Crypto:'◈',AI:'AI',Economics:'∑',Finance:'↗',Business:'B',Education:'✳',Technology:'⌘',Other:'✦'};
const scenePaths={
 // Blockchain: linked validated blocks, distributed ledger nodes, and cryptographic mesh.
 Crypto:'<g stroke-width="2.2"><path d="m233 93 61-32 61 32v69l-61 34-61-34z m61-32v69m-61-37 61 37 61-37"/><path d="m365 149 61-32 61 32v69l-61 34-61-34z m61-32v69m-61-37 61 37 61-37"/><path d="m152 194 49-25 49 25v58l-49 27-49-27z m49-25v55m-49-30 49 30 49-30"/><path d="m355 126 40 20m-148 20 27-18m-24 72 117-5" stroke-dasharray="5 8"/><path d="m282 140 20 0m111 45 20 0m-221 39 19 0" stroke-width="4"/><circle cx="318" cy="44" r="7"/><circle cx="511" cy="101" r="7"/><circle cx="124" cy="173" r="7"/><circle cx="520" cy="243" r="7"/><path d="m318 51-24 10m193 88 24-41M152 194l-28-21m363 45 33 25" stroke-dasharray="3 6"/></g><g fill="currentColor" stroke="none" opacity=".58"><circle cx="294" cy="130" r="6"/><circle cx="426" cy="184" r="6"/><circle cx="201" cy="224" r="5"/></g>',
 // Microeconomics: labelled intersecting supply/demand with market-clearing point.
 Economics:'<g stroke-width="2.6"><path d="M159 59v213h392"/><path d="m150 73 9-14 9 14m369 190 14 9-14 9"/><path d="M184 239C261 196 388 126 510 67"/><path d="M187 88C278 134 390 188 514 238"/><circle cx="351" cy="162" r="10"/><path d="M351 162v110M159 162h192" stroke-dasharray="4 8"/><path d="M351 116v92" stroke-dasharray="2 7" opacity=".4"/></g><g fill="currentColor" stroke="none" font-family="Arial,sans-serif" font-weight="700" font-size="22"><text x="513" y="74">S</text><text x="519" y="242">D</text><text x="337" y="296">Q*</text><text x="121" y="169">P*</text></g>',
 // Neural inference/agent orchestration mesh rather than generic circles.
 AI:'<g stroke-width="1.9"><path d="M168 98 254 62 358 146 459 61 530 108 493 219 379 260 256 235 168 98 358 146 530 108 379 260 254 62 256 235 459 61 493 219 358 146"/><path d="M168 98 256 235M254 62 493 219M459 61 379 260" stroke-dasharray="3 8"/><circle cx="358" cy="146" r="35"/><circle cx="358" cy="146" r="16"/><circle cx="168" cy="98" r="13"/><circle cx="254" cy="62" r="10"/><circle cx="459" cy="61" r="12"/><circle cx="530" cy="108" r="11"/><circle cx="493" cy="219" r="13"/><circle cx="379" cy="260" r="12"/><circle cx="256" cy="235" r="11"/></g>',
 // Portfolio allocation, mark-to-market candlesticks, price trajectory.
 Finance:'<g stroke-width="2"><path d="M153 274h400M176 53v221"/><path d="M203 211 252 193 301 222 357 153 405 165 458 99 515 62" stroke-width="3"/><path d="m490 62 25 0 0 25"/><path d="M223 196V116m-11 23h22v37h-22zm62 15V87m-11 16h22v34h-22zm62 45V88m-11 27h22v51h-22zm62-39V49m-11 18h22v42h-22zm62 20V51m-11 16h22v51h-22z" opacity=".7"/><circle cx="357" cy="153" r="5"/><circle cx="515" cy="62" r="6"/></g>',
 // Business: unit economics / compounding growth dashboard.
 Business:'<g stroke-width="2"><path d="M168 263V74m0 189h378"/><rect x="205" y="185" width="52" height="78" rx="3"/><rect x="292" y="153" width="52" height="110" rx="3"/><rect x="379" y="118" width="52" height="145" rx="3"/><rect x="466" y="61" width="52" height="202" rx="3"/><path d="M203 135 273 163 331 106 400 121 507 46"/><path d="m474 46h33v33"/></g>',
 // Education: open research volume and branching concepts.
 Education:'<g stroke-width="2"><path d="M146 105q111-52 217 0 105-52 217 0v146q-113-45-217 0-109-45-217 0z"/><path d="M363 105v146"/><path d="M172 144q77-28 165-1M172 183q81-27 165 0M388 145q82-29 165-1M388 183q79-27 165 0"/><circle cx="363" cy="59" r="24"/><path d="m363 22v13m0 49v13m-37-38h13m48 0h13"/></g>',
 // Technology: IC core and interconnect traces.
 Technology:'<g stroke-width="2"><rect x="226" y="69" width="276" height="210" rx="15"/><rect x="279" y="112" width="168" height="127" rx="8"/><path d="M172 108h54m-54 55h54m-54 55h54m276-110h54m-54 55h54m-54 55h54M280 19v50m80-50v50m80-50v50M280 279v44m80-44v44m80-44v44"/><path d="m321 161 39-25 42 25v44l-42 25-39-25z m39-25v49m-39-24 39 24 42-24"/></g>',
 Other:'<g stroke-width="2"><circle cx="361" cy="170" r="111"/><circle cx="361" cy="170" r="72"/><path d="M150 166h424M361 25v293M195 75l335 194M195 269 530 75"/><circle cx="361" cy="170" r="23"/></g>'
};
function art(v){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 680 340');
 svg.setAttribute('class','afh21-poster-symbol');
 svg.setAttribute('aria-hidden','true');
 svg.innerHTML='<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">'+(scenePaths[v.sector]||scenePaths.Other)+'</g>';
 return svg;
}
function makeVideo(v,index){
 const link=document.createElement('a');
 link.className='video-card interactive-card afh21-video-card';
 link.dataset.theme=palette[v.sector]||'other';
 link.dataset.thumbnail='loading';
 link.dataset.variant=String((index+(v.id.charCodeAt(0)||0))%4);
 link.href='https://www.youtube.com/watch?v='+encodeURIComponent(v.id);
 link.target='_blank';link.rel='noopener noreferrer';
 link.setAttribute('aria-label','Watch '+tidy(v.title)+' on YouTube (new tab)');
 const poster=document.createElement('div');poster.className='video-thumb afh21-video-poster';
 poster.appendChild(art(v));
 const orbit=document.createElement('span');orbit.className='afh21-poster-orbit';orbit.setAttribute('aria-hidden','true');poster.appendChild(orbit);
 // The thumbnails are per-video (never per-topic). YouTube provides 1080p/720p versions.
 const img=document.createElement('img');
 img.className='afh22-real-thumbnail';img.alt='';
 img.loading=index<6?'eager':'lazy';img.decoding='async';
 img.referrerPolicy='no-referrer';
 img.width=1920;img.height=1080;
 const id=encodeURIComponent(v.id);
 const sources=[
  'https://i.ytimg.com/vi_webp/'+id+'/maxresdefault.webp',
  'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg',
  'https://i.ytimg.com/vi_webp/'+id+'/sddefault.webp',
  'https://i.ytimg.com/vi/'+id+'/sddefault.jpg',
  'https://i.ytimg.com/vi_webp/'+id+'/hqdefault.webp',
  'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'
 ];
 let source=0;
 const setFallback=()=>{
  source++;
  if(source<sources.length){img.src=sources[source];}
  else{link.dataset.thumbnail='unavailable';link.classList.add('afh22-thumbnail-unavailable')}
 };
 img.addEventListener('error',setFallback);
 img.addEventListener('load',()=>{
  if(img.naturalWidth<480&&source<sources.length-1){setFallback();return}
  link.dataset.thumbnail='ready';
  link.classList.remove('afh22-thumbnail-unavailable');
 });
 img.src=sources[0];
 poster.appendChild(img);
 const category=document.createElement('span');category.className='afh21-video-category';category.textContent=clean(v.sector).toUpperCase()+' / '+v.date.slice(0,4);
 const monogram=document.createElement('span');monogram.className='afh21-video-monogram';monogram.textContent=letters[v.sector]||letters.Other;monogram.setAttribute('aria-hidden','true');
 const title=document.createElement('h3');title.className='afh21-poster-title';title.textContent=tidy(v.title);
 const play=document.createElement('span');play.className='afh21-play';play.textContent='↗';play.setAttribute('aria-hidden','true');
 const unavailable=document.createElement('span');unavailable.className='afh22-preview-note';unavailable.textContent='Preview unavailable · Open on YouTube';
 poster.append(category,monogram,title,play,unavailable);
 const foot=document.createElement('div');foot.className='afh21-video-footer';
 const left=document.createElement('div');left.className='afh21-video-credit';
 const creator=document.createElement('strong');creator.textContent=tidy(v.channel)||'Channel not recorded';
 const details=document.createElement('span');details.textContent=v.date+'  /  '+tidy(v.topic||v.sector);
 left.append(creator,details);
 const view=document.createElement('span');view.className='afh21-video-view';view.textContent='WATCH  ↗';
 foot.append(left,view);link.append(poster,foot);return link;
}
function append(){
 const part=filtered.slice(visible,visible+24),fragment=document.createDocumentFragment();
 part.forEach((v,i)=>fragment.appendChild(makeVideo(v,visible+i)));
 grid.append(fragment);visible+=part.length;more.hidden=visible>=filtered.length;
 if(visibleNote)visibleNote.textContent=nfmt(visible)+' / '+nfmt(filtered.length)+' entries displayed';
}
function sortedVideos(list){
 const sorted=[...list];
 if(sorting==='oldest')sorted.sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));
 else if(sorting==='title')sorted.sort((a,b)=>a.title.localeCompare(b.title));
 else if(sorting==='creator')sorted.sort((a,b)=>clean(a.channel).localeCompare(clean(b.channel))||b.date.localeCompare(a.date));
 else sorted.sort((a,b)=>b.date.localeCompare(a.date)||a.title.localeCompare(b.title));
 return sorted;
}
function render(){
 filtered=sortedVideos(videos.filter(v=>(sector==='All'||v.sector===sector)&&(year==='All'||v.date.startsWith(year))&&(!query||[v.title,v.channel,v.sector,v.topic,v.date].join(' ').toLowerCase().includes(query))));
 counter.textContent=nfmt(filtered.length)+' archived videos';
 if(sortNote)sortNote.textContent=sorting==='latest'?'NEWEST FIRST':sorting==='oldest'?'OLDEST FIRST':sorting==='title'?'SORTED BY TITLE':'SORTED BY CREATOR';
 grid.replaceChildren();visible=0;empty.hidden=filtered.length>0;more.hidden=filtered.length===0;if(visibleNote)visibleNote.textContent='0 / '+nfmt(filtered.length);
 if(filtered.length)append();
}
buttons.forEach(b=>b.addEventListener('click',()=>{sector=b.dataset.sector;buttons.forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render()}));
search?.addEventListener('input',()=>{query=search.value.trim().toLowerCase();render()});
sel?.addEventListener('change',()=>{year=sel.value;render()});
sortSel?.addEventListener('change',()=>{sorting=sortSel.value;render()});
more?.addEventListener('click',append);
addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')){e.preventDefault();search?.focus()}});
fetch('./youtube-library.json?v=22',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).then(x=>{
 videos=(x.videos||[]).filter(v=>/^[A-Za-z0-9_-]{11}$/.test(v.id)&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&v.date>='2025-01-01'&&!/google\s*adwor|ditonton pukul|produk:\s*&emsp;youtube|detail:\s*&emsp;/i.test(v.title||''));
 if(total)total.textContent=nfmt(videos.length);
 render();
}).catch(()=>{counter.textContent='Archive unavailable';empty.hidden=false;empty.textContent='The verified video archive could not be loaded right now.';more.hidden=true;if(visibleNote)visibleNote.textContent='Dataset unavailable'});
})();
