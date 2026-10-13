/* YELLOW BOOK AFH — searchable source-grounded learning atlas (2026). */
(()=>{'use strict';
const catalog=window.YB_CATALOG,source=window.YB_NOTES;
const $=(selector,root=document)=>root.querySelector(selector);
if(!catalog||!source){const label=$('#yb-result-text');if(label)label.textContent='Archive data unavailable. Refresh the page.';return}
const groupNames=['MICRO & MARKETS','MACRO & GROWTH','MONEY & BANKING','GLOBAL TRADE','MARKETS & ASSETS','CORPORATE FINANCE','ACCOUNTING','BUSINESS OPERATIONS','GAME THEORY','TAX & METHODS','ZERO TO ONE','MONETARY HISTORY','RETURN & RISK','MPT & CAPM','VALUATION'];
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const norm=s=>String(s??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const topics=catalog.categories.flatMap(g=>g.topics.map((title,i)=>({kind:'topic',id:g.id+'-'+(i+1),index:i+1,title,group:g,summary:source.definitions[g.id+'-'+(i+1)]||''})));
const examples=source.examples.map((v,i)=>({...v,index:i+1,kind:'example'}));
const reviews=source.reviews.map((v,i)=>({...v,index:i+1,kind:'review',title:v.question,summary:v.answer}));
const number=n=>String(n).padStart(2,'0');
const $grid=$('#yb-grid'),$search=$('#yb-search'),$category=$('#yb-category'),$result=$('#yb-result-text'),$groups=$('#yb-group-navigation'),$more=$('#yb-more'),$empty=$('#yb-empty'),$modal=$('#yb-modal'),$modalBody=$('#yb-modal-body'),$modalTitle=$('#yb-modal-title');
const formulas={
'1-14':'Y = A × K^α × L^β  (A: productivity; K: capital; L: labour)',
'6-4':'WACC = (E/V) × Ke + (D/V) × Kd × (1 − T)',
'6-5':'NPV = −I₀ + Σ [CFₜ / (1+r)ᵗ]',
'6-6':'IRR = r that makes NPV = 0',
'6-15':'ROE = Net Income / Average Equity',
'6-14':'ROA = Net Income / Average Assets',
'7-5':'FCF = Operating Cash Flow − Capital Expenditure',
'7-9':'Revenue Growth = (Revenueₜ / Revenueₜ₋₁ − 1) × 100%',
'7-11':'Gross Margin = (Revenue − COGS) / Revenue',
'7-12':'Operating Margin = Operating Income / Revenue',
'7-13':'Net Margin = Net Income / Revenue',
'7-16':'CCC = DSO + DIO − DPO',
'7-25':'BEP (units) = Fixed Cost / (Price − Variable Cost per unit)',
'7-26':'Simple CLV ≈ Monthly Contribution / Monthly Churn Rate (ignoring discounting)',
'14-3':'E(Rp) = Σ wi × E(Ri)',
'14-4':'σp² = wA²σA² + wB²σB² + 2wAwBσAσBρAB',
'14-9':'Sharpe = [E(Rp) − Rf] / σp',
'14-10':'E(Ri) = Rf + βi × [E(Rm) − Rf]',
'14-11':'βi = Cov(Ri,Rm) / Var(Rm)',
'15-3':'PV = FV / (1+r)ⁿ',
'15-4':'FV = PV × (1+r)ⁿ',
'15-5':'NPV = −I₀ + Σ [CFₜ / (1+r)ᵗ]',
'13-1':'R = (P₁ − P₀ + D) / P₀',
'13-2':'R̄ = (R₁ + ... + Rₙ) / n',
'13-3':'s² = Σ(Ri − R̄)² / (n − 1)',
'13-4':'s = √(s²)',
'13-6':'Cov(A,B) = Σ[(Ai−Ā)(Bi−B̄)] / (n−1)',
'13-7':'ρAB = Cov(A,B) / (σA × σB)'
};
const state={tab:'topics',category:'all',query:'',shown:36,filtered:[],lastFocus:null};
function showTab(name){
 state.tab=name;state.shown=36;
 document.querySelectorAll('.yb-tabs button').forEach(btn=>{
  const active=btn.dataset.tab===name;btn.classList.toggle('is-active',active);btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1;
 });
 $groups.hidden=name!=='topics';$category.disabled=name!=='topics';
 if(name!=='topics'){$category.value='all';state.category='all'}
 render();
}
function buildCategories(){
 catalog.categories.forEach(g=>{
  const opt=document.createElement('option');opt.value=String(g.id);opt.textContent=number(g.id)+' / '+g.name.toUpperCase();$category.appendChild(opt);
 });
 const all=document.createElement('button');all.type='button';all.dataset.category='all';all.textContent='ALL TOPICS · 309';$groups.appendChild(all);
 catalog.categories.forEach((g,i)=>{
  const btn=document.createElement('button');btn.type='button';btn.dataset.category=String(g.id);
  const name=document.createTextNode(number(g.id)+' / '+(groupNames[i]||g.name)+' ');
  const count=document.createElement('small');count.textContent=String(g.topics.length);
  btn.append(name,count);$groups.appendChild(btn);
 });
 $groups.addEventListener('click',e=>{
  const btn=e.target.closest('button[data-category]');if(!btn)return;
  state.category=btn.dataset.category;$category.value=state.category;state.shown=36;render();
 });
}
function matches(item){
 if(state.tab==='topics'&&state.category!=='all'&&String(item.group.id)!==state.category)return false;
 if(!state.query)return true;
 return norm([item.title,item.summary,item.group?.name,item.calculation,item.meaning,item.answer].filter(Boolean).join(' ')).includes(norm(state.query));
}
function render(){
 const all=state.tab==='topics'?topics:state.tab==='examples'?examples:reviews;
 state.filtered=all.filter(matches);
 const frag=document.createDocumentFragment();
 state.filtered.slice(0,state.shown).forEach(item=>{
  const btn=document.createElement('button');btn.type='button';btn.className='yb-topic-card';btn.dataset.id=item.id;btn.dataset.kind=item.kind;
  const category=item.kind==='topic'?item.group.name:item.kind==='example'?'Worked example':'Review & answer';
  const num=item.kind==='topic'?number(item.group.id)+'.'+number(item.index):number(item.index);
  const description=item.kind==='topic'?item.summary:item.kind==='example'?(item.calculation||''):item.summary;
  const foot=item.kind==='topic'?('PDF pp. '+item.group.pages):item.kind==='example'?item.source:'Yellow Book V3';
  btn.innerHTML='<div class="yb-card-top"><span class="yb-number">'+esc(num)+' / '+esc(item.kind==='topic'?'THEORY':item.kind==='example'?'NUMERICAL':'REVIEW')+'</span><span class="yb-card-arrow" aria-hidden="true">↗</span></div>'+
  '<h3>'+esc(item.title)+'</h3><p>'+esc(description)+'</p><div class="yb-card-bottom"><span>'+esc(category)+'</span><span>'+esc(foot)+'</span></div>';
  btn.addEventListener('click',()=>openDetail(item));frag.appendChild(btn);
 });
 $grid.replaceChildren(frag);
 $empty.hidden=state.filtered.length>0;
 $more.hidden=state.shown>=state.filtered.length;
 $result.textContent=state.filtered.length+' / '+all.length+' '+(state.tab==='topics'?'documented topics':state.tab==='examples'?'worked examples':'review questions')+' — '+(state.tab==='topics'?'SOURCE INDEX':state.tab==='examples'?'NUMERICAL LAB':'REVIEW LAB');
 $groups.querySelectorAll('button[data-category]').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===state.category));
}
function openDetail(item){
 state.lastFocus=document.activeElement;
 const category=item.kind==='topic'?item.group.name:item.kind==='example'?'NUMERICAL LAB':'REVIEW LAB';
 $('#yb-modal-eyebrow').textContent='THE YELLOW BOOK / '+category.toUpperCase();
 let body='<span class="yb-modal-status">DOCUMENTED IN THE PDF · NOT A MASTERY CERTIFICATION</span>'+
 '<h2 class="yb-modal-title" id="yb-modal-title">'+esc(item.title)+'</h2>';
 if(item.kind==='topic'){
  const formula=formulas[item.id]||'';
  body+='<div class="yb-modal-label">DEFINITION / CONTEXT</div><p class="yb-modal-explain">'+esc(item.summary)+'</p>';
  if(formula)body+='<div class="yb-modal-rule"><strong>FORMULA / MODEL</strong><span class="yb-formula">'+esc(formula)+'</span><p>Check the original assumptions and units before applying this relationship.</p></div>';
  const related=topics.filter(o=>o.group.id===item.group.id&&o.id!==item.id).slice(0,4);
  body+='<div class="yb-modal-rule"><strong>RELATED TOPICS</strong><p>'+related.map(x=>esc(x.title)).join(' · ')+'</p></div>';
  body+='<div class="yb-modal-source"><strong>SOURCE RECORD</strong>YELLOW BOOK MASTER TOPIK TERINDEKS V3 · GROUP '+number(item.group.id)+' / '+esc(item.group.name)+'<br>PDF PAGES '+esc(item.group.pages)+' · '+esc(item.group.origin)+'<br>This description is normalized editorial material transcribed from the supplied PDF.</div>';
 }else if(item.kind==='example'){
  body+='<div class="yb-modal-label">STEP-BY-STEP NUMERICAL ILLUSTRATION</div><p class="yb-modal-explain">'+esc(item.calculation)+'</p>';
  body+='<div class="yb-modal-rule"><strong>ECONOMIC INTERPRETATION</strong><p>'+esc(item.meaning||'Worked example in the source PDF.')+'</p></div>';
  body+='<div class="yb-modal-source"><strong>SOURCE RECORD</strong>YELLOW BOOK V3 · '+esc(item.source)+' · EXAMPLE '+number(item.index)+'<br>All figures are illustrative assumptions, not investment or policy recommendations.</div>';
 }else{
  body+='<div class="yb-modal-label">RECALL THE CONCEPT BEFORE OPENING THE ANSWER</div><div class="yb-answer"><button type="button" id="yb-reveal-answer" aria-expanded="false">REVEAL THE ANSWER ↓</button><div class="yb-answer-text" id="yb-answer-text" hidden>'+esc(item.answer)+'</div></div>';
  body+='<div class="yb-modal-source"><strong>SOURCE RECORD</strong>YELLOW BOOK V3 · '+(item.id.startsWith('R1-')?'REVIEW V1':'REVIEW V2')+'<br>Source answers preserved from the attached document.</div>';
 }
 $modalBody.innerHTML=body;
 $modal.hidden=false;document.body.style.overflow='hidden';
 $('.yb-modal-panel').focus();
 const btn=$('#yb-reveal-answer');if(btn)btn.addEventListener('click',()=>{
  const answer=$('#yb-answer-text');answer.hidden=!answer.hidden;btn.setAttribute('aria-expanded',String(!answer.hidden));btn.textContent=answer.hidden?'REVEAL THE ANSWER ↓':'HIDE THE ANSWER ↑';
 });
}
function closeDetail(){if($modal.hidden)return;$modal.hidden=true;document.body.style.overflow='';state.lastFocus?.focus?.()}
$('#yb-modal-close').addEventListener('click',closeDetail);
$modal.addEventListener('click',e=>{if(e.target.dataset.close==='true')closeDetail()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$modal.hidden)closeDetail()});
$('#yb-reset').addEventListener('click',()=>{$search.value='';$category.value='all';state.query='';state.category='all';state.shown=36;render()});
$category.addEventListener('change',()=>{state.category=$category.value;state.shown=36;render()});
$search.addEventListener('input',()=>{state.query=$search.value.trim();state.shown=36;render()});
$more.addEventListener('click',()=>{state.shown+=36;render()});
document.querySelectorAll('.yb-tabs button').forEach(btn=>btn.addEventListener('click',()=>showTab(btn.dataset.tab)));
document.querySelector('.yb-tabs')?.addEventListener('keydown',e=>{
 if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
 const tabs=[...document.querySelectorAll('.yb-tabs button')];
 const i=tabs.findIndex(btn=>btn.dataset.tab===state.tab);
 const next=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
 next.focus();showTab(next.dataset.tab);
});
const menu=$('#yb-menu');
menu?.addEventListener('click',()=>{const open=$('.yb-nav').classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open))});
$('.yb-nav')?.addEventListener('click',e=>{if(e.target.closest('a')){$('.yb-nav').classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}});
let ticking=false;
const progress=()=>{ticking=false;const h=document.documentElement;const denominator=Math.max(1,h.scrollHeight-innerHeight);$('#yb-progress-line').style.width=(Math.min(1,scrollY/denominator)*100).toFixed(2)+'%'};
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(progress)}},{passive:true});
buildCategories();showTab('topics');progress();
const params=new URLSearchParams(location.search);
const topic=params.get('topic');
if(topic){const selected=topics.find(v=>v.id===topic);if(selected)openDetail(selected)}
})();