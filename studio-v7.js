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
 Crypto:'<circle cx="365" cy="157" r="105"/><circle cx="365" cy="157" r="76"/><circle cx="365" cy="157" r="42"/><path d="M185 205 Q270 58 432 104 Q500 128 522 191"/><path d="M234 227 286 184 331 204 369 117 412 157 466 102"/><path d="M218 236h270M365 25v272"/>',
 AI:'<circle cx="358" cy="158" r="110"/><circle cx="358" cy="158" r="68"/><path d="M159 92 253 54 358 158 471 86 530 177 417 249 358 158 243 251 159 92 358 158 532 177"/><circle cx="159" cy="92" r="9"/><circle cx="253" cy="54" r="7"/><circle cx="471" cy="86" r="8"/><circle cx="530" cy="177" r="9"/><circle cx="417" cy="249" r="8"/><circle cx="243" cy="251" r="8"/>',
 Economics:'<path d="M165 267v-190M165 267h357"/><path d="M180 239C245 193 309 161 512 83"/><path d="M178 82C273 113 398 205 507 251"/><circle cx="343" cy="171" r="12"/><circle cx="343" cy="171" r="46" stroke-dasharray="3 12"/><path d="M343 267V171H165" stroke-dasharray="3 8"/>',
 Finance:'<path d="M152 271h394M184 42v232M165 220 244 195 290 213 360 118 420 151 501 67"/><path d="M212 188v-91m-11 31h22v44h-22zm60-10v-86m-11 17h22v43h-22zm60 42v-123m-11 41h22v52h-22zm60-89v-73m-11 22h22v31h-22z"/><circle cx="501" cy="67" r="10"/>',
 Business:'<circle cx="369" cy="171" r="122"/><circle cx="369" cy="171" r="83"/><circle cx="369" cy="171" r="44"/><path d="M182 252 253 209 289 227 366 113 421 145 504 59"/><path d="m469 59 35 0v36"/><path d="M110 265 276 265"/>',
 Education:'<path d="M142 111q108-52 221 0 117-52 226 0v138q-109-45-226 0-118-45-221 0z"/><path d="M363 109v141"/><path d="M172 148q84-28 160 0M172 189q84-27 160 0M393 148q84-28 160 0M393 189q84-27 160 0"/><circle cx="363" cy="69" r="23"/>',
 Technology:'<rect x="205" y="74" width="302" height="203" rx="14"/><rect x="256" y="111" width="199" height="129" rx="9"/><circle cx="356" cy="177" r="43"/><path d="M149 126h56m-56 60h56m-56 60h56m302-120h52m-52 60h52m-52 60h52m-289-227v55m81-55v55m81-55v55m-162 203v43m81-43v43m81-43v43"/>',
 Other:'<circle cx="361" cy="170" r="111"/><circle cx="361" cy="170" r="72"/><path d="M150 166h424M361 25v293M195 75 530 269M195 269 530 75"/><circle cx="361" cy="170" r="23"/>'
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
 link.dataset.variant=String((index+(v.id.charCodeAt(0)||0))%4);
 link.href='https://www.youtube.com/watch?v='+encodeURIComponent(v.id);
 link.target='_blank';link.rel='noopener noreferrer';
 link.setAttribute('aria-label','Watch '+tidy(v.title)+' on YouTube (new tab)');
 const poster=document.createElement('div');poster.className='video-thumb afh21-video-poster';
 poster.appendChild(art(v));
 const orbit=document.createElement('span');orbit.className='afh21-poster-orbit';orbit.setAttribute('aria-hidden','true');poster.appendChild(orbit);
 const category=document.createElement('span');category.className='afh21-video-category';category.textContent=clean(v.sector).toUpperCase()+' / '+v.date.slice(0,4);
 const monogram=document.createElement('span');monogram.className='afh21-video-monogram';monogram.textContent=letters[v.sector]||letters.Other;monogram.setAttribute('aria-hidden','true');
 const title=document.createElement('h3');title.className='afh21-poster-title';title.textContent=tidy(v.title);
 const play=document.createElement('span');play.className='afh21-play';play.textContent='↗';play.setAttribute('aria-hidden','true');
 poster.append(category,monogram,title,play);
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
fetch('./youtube-library.json?v=21',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).then(x=>{
 videos=(x.videos||[]).filter(v=>/^[A-Za-z0-9_-]{11}$/.test(v.id)&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&v.date>='2025-01-01'&&!/google\s*adwor|ditonton pukul|produk:\s*&emsp;youtube|detail:\s*&emsp;/i.test(v.title||''));
 if(total)total.textContent=nfmt(videos.length);
 render();
}).catch(()=>{counter.textContent='Archive unavailable';empty.hidden=false;empty.textContent='The verified video archive could not be loaded right now.';more.hidden=true;if(visibleNote)visibleNote.textContent='Dataset unavailable'});
})();
