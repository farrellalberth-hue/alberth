/* alberth Learning Index v25 — no dependencies; sourced catalogue, accurate counts. */
(()=>{'use strict';
const root=document.getElementById('lk-index');if(!root)return;
const $=(s,r=root)=>r.querySelector(s);
const grid=$('#lk-sector-grid'),panel=$('#lk-panel'),search=$('#lk-search'),stageFilter=$('#lk-filter-status'),note=$('#lk-count-note');
const stats={sectors:$('#lk-stat-sectors'),chapters:$('#lk-stat-chapters'),topics:$('#lk-stat-topics'),children:$('#lk-stat-subtopics')};
const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let data=null,selected='economics',stage='all',query='',searchTimer=null;
const format=n=>new Intl.NumberFormat('en-US').format(n);
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\u2013\u2014]/g,'-').trim();
const node=(tag,cl,txt)=>{const el=document.createElement(tag);if(cl)el.className=cl;if(txt!==undefined)el.textContent=txt;return el};
const sum=s=>s.chapters.reduce((n,c)=>n+c.topics.length,0);
const subs=s=>s.chapters.reduce((n,c)=>n+c.topics.reduce((m,t)=>m+t.subtopics.length,0),0);
const labels={'indexed':'Indexed','review':'Review','roadmap':'Study next','deep-dive':'Deep dive','source':'PDF source note'};
function updateStats(x){
 for(const k of ['sectors','chapters','topics','subtopics']){
  const dest=k==='subtopics'?stats.children:stats[k];if(dest)dest.textContent=format(x.stats[k]||0);
 }
 if(note){const m=x.stats;note.textContent='All '+format(m.yellowBookEntries||0)+' PDF source entries are now included in the topic index: '+format(m.yellowBookExisting||0)+' linked to existing topics and '+format(m.sourceOnly||0)+' added as distinct source-only concepts. Source entries are not proof of personal mastery.'}
}
function sectorGrid(){grid.replaceChildren();data.sectors.forEach((s,i)=>{const button=node('button','lk-sector');button.type='button';button.setAttribute('aria-pressed',String(s.slug===selected));button.dataset.sector=s.slug;const header=node('div','lk-sector-top');header.append(node('span','',String(i+1).padStart(2,'0')+' / '+String(data.sectors.length).padStart(2,'0')),node('span','',format(sum(s))+' TOPICS'));const title=node('strong','',s.name);const bottom=node('div','lk-sector-foot');bottom.append(node('span','',s.chapters.length+' CHAPTERS · '+subs(s)+' SUBTOPICS'),node('i','','↗'));button.append(header,title,bottom);button.addEventListener('click',()=>{selected=s.slug;renderSectors();renderPanel();if(!reduce)panel.scrollIntoView({behavior:'smooth',block:'start'});else panel.scrollIntoView()});grid.append(button)})}
function renderSectors(){grid.querySelectorAll('button[data-sector]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sector===selected)))}
function matches(t,s,c){
 if(stage!=='all'&&t.stage!==stage)return false;
 if(!query)return true;
 const source=t.yellowBook;
 const hay=[t.name,s.name,c.name,...(t.subtopics||[]),t.summary||'',...(source?.definitions||[]).map(x=>x.text||''),...(source?.examples||[]).map(x=>x.title||''),...(source?.reviews||[]).map(x=>x.question||'')].join(' ');
 return norm(hay).includes(norm(query));
}
function buildTopic(t){
 const children=t.subtopics||[],source=t.yellowBook;
 const hasDetail=!!(children.length||t.summary||source);
 let element,head;
 if(hasDetail){element=node('details','lk-topic');head=node('summary');}
 else{element=node('div','lk-topic-plain');head=element;}
 const part=node('span','lk-topic-marker');
 part.append(node('span','lk-topic-name',t.name));
 if(t.stage!=='indexed')part.append(node('span','lk-status lk-status--'+t.stage,labels[t.stage]||t.stage));
 const right=node('span','lk-topic-end');
 if(hasDetail){
  if(children.length)right.append(node('span','lk-tiny',children.length+' subtopic'+(children.length===1?'':'s')));
  if(source)right.append(node('span','lk-tiny','PDF '+source.refs.length));
  right.append(node('span','lk-tiny','＋'));
 }
 head.append(part,right);
 if(!hasDetail)return element;
 element.append(head);
 if(t.summary)element.append(node('p','lk-summary',t.summary));
 if(children.length){
  const list=node('div','lk-subtopics');
  children.forEach(x=>list.append(node('span','',x)));
  element.append(list);
 }
 if(source){
  const box=node('div','lk-source-note');
  box.append(node('span','lk-source-label','INTEGRATED SOURCE NOTES · ORIGINAL PDF V3'));
  (source.definitions||[]).forEach(item=>{
   const itemBox=node('div','lk-source-record');
   itemBox.append(node('span','lk-source-reference',item.category+' · PAGE '+item.pages+' · '+item.ref));
   if(item.text&&item.text!==t.summary)itemBox.append(node('p','lk-source-text',item.text));
   box.append(itemBox);
  });
  (source.examples||[]).forEach(item=>{
   const detail=node('details','lk-source-lesson');
   detail.append(node('summary','', 'NUMERICAL EXAMPLE · '+item.title));
   detail.append(node('p','',item.calculation));
   if(item.meaning)detail.append(node('p','lk-source-meaning',item.meaning));
   box.append(detail);
  });
  (source.reviews||[]).forEach(item=>{
   const detail=node('details','lk-source-lesson');
   detail.append(node('summary','', 'REVIEW · '+item.question));
   detail.append(node('p','',item.answer));
   box.append(detail);
  });
  element.append(box);
 }
 return element;
}
function buildChapter(c,si){const details=node('details','lk-chapter');details.open=si===0;const summary=node('summary');const count=c.topics.length;summary.append(node('span','lk-chapter-id',String(si+1).padStart(2,'0')),node('span','lk-chapter-name',c.name),node('span','lk-chapter-count',format(count)+' TOPICS'),node('span','lk-chapter-arrow','＋'));details.append(summary);const list=node('div','lk-topic-list');const fragment=document.createDocumentFragment();c.topics.forEach(t=>fragment.append(buildTopic(t)));list.append(fragment);details.append(list);return details}
function renderPanel(){if(!data)return;const current=data.sectors.find(s=>s.slug===selected)||data.sectors[0];panel.replaceChildren();const title=node('div','lk-panel-title');const left=node('div');left.append(node('span','lk-eyebrow','SECTOR / '+String(data.sectors.indexOf(current)+1).padStart(2,'0')));left.append(node('h4','',current.name));left.append(node('p','',current.description));title.append(left,node('span','lk-panel-meta',format(sum(current))+' TOPICS · '+format(subs(current))+' SUBTOPICS'));panel.append(title);
if(current.legacy&&current.legacy.startsWith('/library/')){const link=node('a','lk-legacy','EXPLORE EARLIER STUDY NOTES ↗');link.href=current.legacy;panel.append(link)}
const queryMode=!!query;const chapters=current.chapters.map(c=>({name:c.name,topics:c.topics.filter(t=>matches(t,current,c))})).filter(c=>c.topics.length);
let count=chapters.reduce((n,c)=>n+c.topics.length,0);panel.append(node('div','lk-results-label',format(count)+' MATCHING TOPICS'+(queryMode?' / SEARCH RESULTS':stage!=='all'?' / '+labels[stage].toUpperCase():'')));
if(!count){panel.append(node('div','lk-empty','No matching topics in this sector. Try another sector, search term, or study status.'));return}
const holder=node('div','lk-chapters');chapters.forEach((c,i)=>{const d=buildChapter(c,i);if(queryMode)d.open=true;holder.append(d)});panel.append(holder);
}
function changeSearch(){query=search.value.trim();if(!query){renderPanel();return}const hits=data.sectors.map(s=>({s,n:s.chapters.reduce((a,c)=>a+c.topics.filter(t=>matches(t,s,c)).length,0)})).filter(x=>x.n).sort((a,b)=>b.n-a.n);if(hits.length&&!hits.some(x=>x.s.slug===selected)){selected=hits[0].s.slug;renderSectors()}renderPanel();if(hits.length>1){const extra=node('div','lk-secondary');extra.append(node('span','','Also found in '));hits.filter(x=>x.s.slug!==selected).slice(0,7).forEach((x,i)=>{const a=node('a','',x.s.name+' ('+x.n+')');a.href='#lk-index';a.addEventListener('click',e=>{e.preventDefault();selected=x.s.slug;renderSectors();renderPanel()});extra.append(a);if(i<Math.min(6,hits.length-2))extra.append(node('span','',' · '))});panel.append(extra)}}
root.querySelectorAll('[data-lk-target]').forEach(button=>button.addEventListener('click',()=>{
  if(!data)return;
  const sector=button.getAttribute('data-lk-target'),chapter=button.getAttribute('data-lk-chapter');
  if(!data.sectors.some(s=>s.slug===sector))return;
  selected=sector;query='';stage='all';if(search)search.value='';if(stageFilter)stageFilter.value='all';
  renderSectors();renderPanel();
  const found=[...panel.querySelectorAll('.lk-chapter')].find(el=>el.querySelector('.lk-chapter-name')?.textContent===chapter);
  if(found){panel.querySelectorAll('.lk-chapter').forEach(x=>x.open=false);found.open=true;}
  panel.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}));

search?.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(changeSearch,120)});
stageFilter?.addEventListener('change',()=>{stage=stageFilter.value;if(query)changeSearch();else renderPanel()});
fetch('/learning-index-v25.json?v=27',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('The catalogue could not be loaded: HTTP '+r.status);return r.json()}).then(result=>{if(!Array.isArray(result.sectors)||!result.stats||result.stats.topics<500)throw Error('Invalid catalogue');data=result;updateStats(data);sectorGrid();const hash=new URLSearchParams(location.hash.replace(/^#/,'?'));const sectorFromUrl=new URLSearchParams(location.search).get('sector')||hash.get('sector');if(sectorFromUrl&&data.sectors.some(s=>s.slug===sectorFromUrl))selected=sectorFromUrl;renderSectors();renderPanel()}).catch(err=>{panel.replaceChildren();const error=node('div','lk-empty','The expanded catalogue is temporarily unavailable. Please use the original study notes above, or reload the page.');panel.append(error);console.error('Learning index:',err.message)});
})();
