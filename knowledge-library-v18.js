/* AFH V18 / CINEMATIC KNOWLEDGE LIBRARY
   Five existing library subjects + exact source-linked Yellow Book PDF V3.
   The 309 catalog records remain in their 15 original PDF groups.
   Existing site subject counts are legacy library snapshot, not PDF-derived counts. */
(()=>{'use strict';
const root=document.querySelector('#journey.afh18-library');
const C=window.YB_CATALOG, N=window.YB_NOTES;
if(!root)return;
const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const config=[
 {id:'economics',title:'Economics',count:161,overview:'From incentives and market failures to growth theory, policy transmission and strategic interaction.',page:'/library/economics/',symbol:'∑',ids:['1-11','2-5','1-10','9-2','2-10','2-11']},
 {id:'finance',title:'Finance & Asset Pricing',count:28,overview:'Capital allocation, pricing models, valuations, risk-adjusted performance and portfolio construction.',page:'/library/finance/',symbol:'β',ids:['14-10','6-4','14-9','14-4','15-5','13-7']},
 {id:'ai',title:'AI & Automation',count:25,overview:'Agent architecture, workflow orchestration and automation projects from the existing AI library. The PDF supplies related business concepts, not a dedicated AI curriculum.',page:'/library/ai/',symbol:'✳',ids:['11-3','11-8','11-11'],scope:'RELATED YELLOW BOOK BUSINESS CONCEPTS — NOT AI TECHNICAL TOPICS'},
 {id:'crypto',title:'Crypto & Markets',count:26,overview:'Digital asset research alongside the market mechanics of arbitrage, hedging, leverage and liquidity.',page:'/library/crypto/',symbol:'◎',ids:['5-3','5-12','5-13','5-14','5-28','5-29'],scope:'RELATED YELLOW BOOK MARKET CONCEPTS — NOT A TOKEN RESEARCH CATALOG'},
 {id:'math',title:'Mathematics & Methods',count:16,overview:'The quantitative language of risk, dependence, return, diversification and model validation.',page:'/library/math/',symbol:'σ',ids:['13-3','13-4','13-5','13-6','13-7','14-4']}
];
const rows=$$('.afh18-row');const focus=$('.afh18-focus');const $title=$('#afh18-focus-title'),$desc=$('#afh18-focus-description'),$scope=$('#afh18-focus-scope'),$pills=$('#afh18-focus-pills'),$icon=$('#afh18-focus-icon'),$number=$('#afh18-focus-number'),$section=$('#afh18-open-section');
const $archive=$('#afh18-archive'),$toggle=$('#afh18-browse-toggle'),$search=$('#afh18-search'),$select=$('#afh18-filter'),$results=$('#afh18-results'),$meta=$('#afh18-result-meta'),$more=$('#afh18-more'),$modal=$('#afh18-detail'),$modalTitle=$('#afh18-detail-title'),$modalDesc=$('#afh18-detail-desc'),$modalSource=$('#afh18-detail-source'),$modalLink=$('#afh18-detail-link');
const records=(C?.categories||[]).flatMap(g=>g.topics.map((title,i)=>({id:g.id+'-'+(i+1),title,group:g,note:N?.definitions?.[g.id+'-'+(i+1)]||''})));
// Move the modal outside the section stacking context so it cannot be clipped by 3D layers or the sticky header.
if($modal)document.body.appendChild($modal);
const byId=new Map(records.map(r=>[r.id,r]));
let selected=config[0].id, visible=15, filtered=[],lastFocused=null;
const setFocus=(id)=>{
 const d=config.find(x=>x.id===id);if(!d)return;
 selected=d.id;
 rows.forEach(row=>{
  const on=row.dataset.field===id;row.setAttribute('aria-pressed',String(on));
  if(on)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');
 });
 $number.textContent='0'+(config.indexOf(d)+1)+' / FIELD NOTES';
 $title.textContent=d.title;
 $desc.textContent=d.overview;
 $scope.textContent=d.scope||'RELATED CONCEPTS FROM THE SOURCE PDF';
 $icon.textContent=d.symbol;
 $section.href=d.page;
 $pills.replaceChildren();
 d.ids.forEach(id=>{
  const topic=byId.get(id);if(!topic)return;
  const a=document.createElement('a');a.href='/yellow-book/?topic='+encodeURIComponent(id);
  a.textContent=topic.title+' ↗';a.title='Yellow Book V3: '+topic.group.name;
  $pills.appendChild(a);
 });
 focus.dataset.field=id;
};
rows.forEach(row=>{
 row.addEventListener('click',()=>setFocus(row.dataset.field));
 if(!reduce)row.addEventListener('pointermove',e=>{const b=row.getBoundingClientRect();row.style.setProperty('--afh18-mx',((e.clientX-b.left)/b.width*100).toFixed(1)+'%')},{passive:true});
});
if(C?.categories?.length){
 C.categories.forEach(g=>{
  const op=document.createElement('option');op.value=String(g.id);
  op.textContent=String(g.id).padStart(2,'0')+' / '+g.name;
  $select.appendChild(op);
 });
}
const normalized=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
function render(){
 const q=normalized($search?.value.trim());const group=$select?.value||'all';
 filtered=records.filter(item=>(group==='all'||String(item.group.id)===group)&&(!q||normalized([item.title,item.note,item.group.name].join(' ')).includes(q)));
 const frag=document.createDocumentFragment();
 filtered.slice(0,visible).forEach(r=>{
  const btn=document.createElement('button');btn.type='button';btn.className='afh18-result';
  btn.innerHTML='<b>YB / '+esc(String(r.group.id).padStart(2,'0'))+'.'+esc(String(Number(r.id.split('-')[1])).padStart(2,'0'))+'</b><strong>'+esc(r.title)+'</strong><span>'+esc(r.group.name)+' ↗</span>';
  btn.addEventListener('click',()=>openDetail(r));frag.appendChild(btn);
 });
 $results.replaceChildren(frag);$meta.textContent=filtered.length+' OF '+records.length+' PDF ENTRIES · 15 ORIGINAL SOURCE GROUPS';
 $more.hidden=visible>=filtered.length;
 if(!filtered.length){const empty=document.createElement('p');empty.textContent='No matching PDF entries. Try another keyword or category.';$results.appendChild(empty)}
}
function openDetail(r){
 lastFocused=document.activeElement;
 $modalTitle.textContent=r.title;
 $modalDesc.textContent=r.note||'No editorial description available in the source index.';
 $modalSource.textContent='YELLOW BOOK MASTER TOPIK TERINDEKS V3 · GROUP '+String(r.group.id).padStart(2,'0')+' — '+r.group.name+' · PDF PP. '+r.group.pages+'. Documented source entry; this is not a mastery certification.';
 $modalLink.href='/yellow-book/?topic='+encodeURIComponent(r.id);
 $modal.hidden=false;
 document.body.classList.add('afh18-modal-open');
 const close=$('#afh18-close');close?.focus();
}
function closeDetail(){
 if($modal.hidden)return;
 $modal.hidden=true;document.body.classList.remove('afh18-modal-open');
 lastFocused?.focus?.();
}
$('#afh18-close')?.addEventListener('click',closeDetail);
$modal?.addEventListener('click',e=>{if(e.target.closest('[data-afh18-dismiss]'))closeDetail()});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape')closeDetail();
 if(e.key==='Tab'&&!$modal.hidden){
  const focusable=Array.from($modal.querySelectorAll('a[href],button:not([disabled])'));
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
$toggle?.addEventListener('click',()=>{
 const open=$archive.hidden;
 $archive.hidden=!open;
 $toggle.setAttribute('aria-expanded',String(open));
 $toggle.textContent=open?'CLOSE THE PDF INDEX −':'BROWSE ALL 309 TOPICS ↗';
 if(open){render();setTimeout(()=>$search.focus(),120)}
});
$search?.addEventListener('input',()=>{visible=15;render()});
$select?.addEventListener('change',()=>{visible=15;render()});
$more?.addEventListener('click',()=>{visible+=15;render()});
if(!reduce&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{
  if(!entries[0]?.isIntersecting)return;
  focus.classList.add('afh18-inview');observer.disconnect();
 },{threshold:.15});
 observer.observe(focus);
 let raf=0;
 addEventListener('scroll',()=>{
  if(raf)return;
  raf=requestAnimationFrame(()=>{
   raf=0;const rect=focus.getBoundingClientRect();
   if(rect.bottom>0&&rect.top<innerHeight){
    const p=Math.min(1,Math.max(0,(innerHeight-rect.top)/(innerHeight+rect.height)));
    focus.style.setProperty('--afh18-parallax',(p*38-19).toFixed(1)+'px');
   }
  });
 },{passive:true});
}
setFocus('economics');
})();