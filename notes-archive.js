/* Kentzo Learning Atlas: unique concepts and dated study history.
   Unique topics are deduplicated by canonical subject title; source review dates
   remain visible in Study Timeline. UI transitions respect reduced motion. */
(function(){"use strict";
const db=window.KENTZO_NOTES,root=document.getElementById("atlas");if(!db||!root)return;
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const q=new URL(location.href).searchParams;
const field=db.fields.some(d=>d.id===root.dataset.field)?root.dataset.field:"all";
const spec=db.fields.find(d=>d.id===field);
const records=field==="all"?db.topics:db.topics.filter(t=>t.f===field);
const uniq=field==="all"?db.uniqueTopics:db.uniqueTopics.filter(t=>t.f===field);
const normalize=s=>String(s).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[\u2010-\u2015]/g,"-").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
const master=new Map(db.uniqueTopics.map(t=>[normalize(t.t),t]));
let year=+q.get("year");if(!db.years.includes(year))year=0;
let month=+q.get("month");if(!(month>=1&&month<=12))month=0;
let search=q.get("q")||"",reviewOnly=q.get("review")==="1",view=q.get("mode")==="unique"?"unique":"timeline",sortOrder=q.get("sort")==="oldest"?"oldest":"newest",limit=100;
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
let transition=null;
const formatDate=s=>{const [y,m,d]=s.split("-");return d+" "+db.months[+m-1]+" "+y};
const yearNumber=s=>+s.slice(0,4),monthNumber=s=>+s.slice(5,7);
function updateURL(){
 const p=new URLSearchParams();
 if(year)p.set("year",year);
 if(month)p.set("month",String(month).padStart(2,"0"));
 if(search)p.set("q",search);
 if(reviewOnly)p.set("review","1");
 if(view==="unique")p.set("mode","unique");if(sortOrder==="oldest")p.set("sort","oldest");
 history.replaceState(null,"",location.pathname+(p.size?"?"+p.toString():""));
}
function animateChange(commit){
 if(reduced.matches){commit();return;}
 if(transition&&typeof transition.skipTransition==="function")transition.skipTransition();
 if(document.startViewTransition){
  const a=document.startViewTransition(commit);transition=a;
  a.finished.catch(()=>{}).finally(()=>{if(transition===a)transition=null;});
 }else{
  commit();
  const n=$("topic-list");
  if(n&&n.animate)n.animate([{opacity:.22,transform:"translateY(12px)",filter:"blur(4px)"},{opacity:1,transform:"none",filter:"none"}],{duration:410,easing:"cubic-bezier(.2,1,.3,1)"});
 }
}
function newMode(m){if(m===view)return;animateChange(()=>{view=m;limit=100;updateURL();render()})}
function selectPeriod(changes){animateChange(()=>{changes();limit=100;updateURL();render()})}
function grouped(list){
 const map=new Map();
 for(const r of list){
  const key=normalize(r.t),reference=master.get(key);
  let item=map.get(key);
  if(!item){
   item={...reference,t:reference?.t||r.t,f:reference?.f||r.f,
      firstDate:r.d,lastDate:r.d,occurrences:0,reviewSessions:0,review:false,s:r.s};
   map.set(key,item);
  }
  item.occurrences++;
  if(r.review){item.reviewSessions++;item.review=true}
  if(r.d<item.firstDate)item.firstDate=r.d;
  if(r.d>item.lastDate)item.lastDate=r.d;
 }
 return [...map.values()];
}
function scope({y=year,m=month,searchTerm=search,review=reviewOnly}={}){
 const s=searchTerm.toLowerCase().trim();
 return records.filter(t=>(!y||yearNumber(t.d)===y)&&(!m||monthNumber(t.d)===m)&&(!review||t.review)&&(!s||t.t.toLowerCase().includes(s)||t.d.includes(s)));
}
function setOfRecords(options){const rows=scope(options);return view==="unique"?grouped(rows):rows;}
function countYear(y){return setOfRecords({y,m:0,searchTerm:"",review:false}).length}
function countMonth(m){return setOfRecords({y:year,m,searchTerm:"",review:false}).length}
function sorted(){
 return setOfRecords().sort((a,b)=>{
  const dateA=view==="unique"?(sortOrder==="newest"?a.lastDate:a.firstDate):a.d;
  const dateB=view==="unique"?(sortOrder==="newest"?b.lastDate:b.firstDate):b.d;
  return (sortOrder==="newest"?dateB.localeCompare(dateA):dateA.localeCompare(dateB))||a.t.localeCompare(b.t);
 });
}
function renderNav(){
 $("discipline-nav").innerHTML=db.fields.map(f=>{
 const n=view==="timeline"?(f.id==="all"?db.topics.length:db.topics.filter(t=>t.f===f.id).length):(f.id==="all"?db.uniqueCount:db.uniqueTopics.filter(t=>t.f===f.id).length);
 const qs=new URLSearchParams();if(year)qs.set("year",String(year));if(view==="unique")qs.set("mode","unique");if(sortOrder==="oldest")qs.set("sort","oldest");
 return '<a href="/library/'+f.id+'/'+(qs.size?'?'+qs.toString():'')+'" class="'+(field===f.id?"active":"")+'" '+(field===f.id?'aria-current="page"':'')+'><span>'+escapeHTML(f.name)+'</span><span class="sidebar-count">'+n.toLocaleString("en-US")+'</span></a>';
 }).join("");
 $("field-label").textContent=spec.name;
 $("hero-field").textContent=spec.name;
 $("hero-desc").textContent=spec.desc;
 $("all-topics").textContent=records.length.toLocaleString("en-US");
 if($("all-sessions"))$("all-sessions").textContent=uniq.length.toLocaleString("en-US");
 $("active-years").textContent=db.years.filter(y=>records.some(t=>yearNumber(t.d)===y)).length;
 $("area-name").textContent=spec.name;
 document.title=spec.name+" — Study Timeline | Kentzo Honggo Limkajaya";
}
function renderMode(){
 for(const m of ["unique","timeline"]){
  const b=$("mode-"+m);if(!b)continue;
  b.classList.toggle("active",view===m);
  b.setAttribute("aria-pressed",String(view===m));
 }
 if($("mode-explainer"))$("mode-explainer").textContent=view==="unique"
  ?"One card per unique subject; repeated learning and reviews do not inflate the topic count."
  :"Each dated learning or REVIEW record is shown separately, including repeated study sessions.";
}
function renderYear(){
 $("year-filters").innerHTML=[0,...db.years].map(y=>
 '<button type="button" class="year-button '+(y===year?"active":"")+'" aria-pressed="'+(y===year)+'" data-year="'+y+'"><strong>'+(y||"ALL YEARS")+'</strong><span>'+countYear(y).toLocaleString("en-US")+(view==="unique"?" unique":" records")+'</span></button>'
 ).join("");
 $("year-filters").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
 const n=+b.dataset.year;if(n!==year)selectPeriod(()=>{year=n;month=0})
 }));
}
function renderMonth(){
 const months=[{m:0,name:"All months"},...db.months.map((name,i)=>({m:i+1,name}))];
 $("month-filters").innerHTML=months.map(({m,name})=>{
  const count=countMonth(m);
  return '<button type="button" class="month-button '+(m===month?"active":"")+'" data-month="'+m+'" aria-pressed="'+(m===month)+'" aria-label="'+escapeHTML(name)+': '+count+' '+(view==="unique"?"unique topics":"study records")+'" '+(!count&&m!==0?"disabled":"")+'><span>'+(m?name.slice(0,3).toUpperCase():"ALL")+'</span><small>'+count.toLocaleString("en-US")+'</small></button>';
 }).join("");
 $("month-filters").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
 const n=+b.dataset.month;if(n!==month)selectPeriod(()=>{month=n})
 }));
}
function renderCards(){
 const items=sorted();
 $("result-count").textContent=items.length.toLocaleString("en-US")+(view==="unique"?" UNIQUE TOPICS":" STUDY RECORDS");
 $("current-total").textContent=items.length.toLocaleString("en-US");
 $("current-period").textContent=month?db.months[month-1]+" "+(year||"2024–2026"):(year?String(year):"2024–2026");
 if($("sort-label"))$("sort-label").textContent=view==="unique"?"Order by study date · unique subjects":"Order by study date · timeline";
 if(!items.length){
  $("topic-list").style.display="block";
  $("topic-list").innerHTML='<div class="empty-state"><strong>No matching subjects.</strong><p>Choose another year or month, change the study view, or clear the keyword filter.</p></div>';
  $("load-more").hidden=true;
  if($("show-all"))$("show-all").hidden=true;
  return;
 }
 $("topic-list").style.display="";
 $("topic-list").innerHTML=items.slice(0,limit).map((t,i)=>{
  const meta=view==="unique"
    ?'<span>FIRST: '+escapeHTML(formatDate(t.firstDate))+'</span><span>'+t.occurrences+' '+(t.occurrences===1?"RECORD":"RECORDS")+(t.reviewSessions?' · '+t.reviewSessions+' REVIEW':'')+'</span>'
    :'<span>'+escapeHTML(formatDate(t.d))+'</span><span>'+escapeHTML(db.fields.find(f=>f.id===t.f)?.name||"Others")+' · NOTE '+escapeHTML(t.s)+'</span>';
  return '<article class="topic-card" style="--topic-order:'+Math.min(i,10)+'"><div class="topic-card-heading"><h3>'+escapeHTML(t.t)+'</h3>'+(t.review?'<span class="review-badge">REVIEW'+(view==="unique"&&t.reviewSessions>1?" × "+t.reviewSessions:"")+'</span>':'')+'</div><div class="topic-meta">'+meta+'</div></article>';
 }).join("");
 const hasMore=items.length>limit;
 $("load-more").hidden=!hasMore;
 $("load-more").textContent=hasMore?"LOAD 100 MORE · "+(items.length-limit).toLocaleString("en-US")+" REMAINING ↓":"";
 if($("show-all"))$("show-all").hidden=field!=="all"||!hasMore;
}
function render(){
 renderNav();renderMode();renderYear();renderMonth();renderCards();if($("topic-sort"))$("topic-sort").value=sortOrder;
 const b=$("review-filter");if(b){
  b.classList.toggle("active",reviewOnly);b.setAttribute("aria-pressed",String(reviewOnly));
  b.textContent=reviewOnly?"✓ REVIEWS ONLY":"◈ REVIEWS ONLY";
 }
}
$("topic-search").value=search;
$("topic-search").addEventListener("input",e=>{search=e.target.value;limit=100;updateURL();renderCards()});
$("load-more").addEventListener("click",()=>{limit+=100;renderCards()});
const showAll=$("show-all");if(showAll)showAll.addEventListener("click",()=>{limit=Infinity;renderCards()});
const sortControl=$("topic-sort");
if(sortControl)sortControl.addEventListener("change",e=>{
 const next=e.target.value==="oldest"?"oldest":"newest";
 if(next===sortOrder)return;
 animateChange(()=>{sortOrder=next;limit=100;updateURL();renderCards()});
});
const reviewButton=$("review-filter");if(reviewButton)reviewButton.addEventListener("click",()=>selectPeriod(()=>{reviewOnly=!reviewOnly}));
["unique","timeline"].forEach(m=>{const b=$("mode-"+m);if(b)b.addEventListener("click",()=>newMode(m))});
const line=$("reading-line");let ticking=false;
window.addEventListener("scroll",()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{
 const h=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 line.style.width=(Math.max(0,Math.min(1,scrollY/h))*100).toFixed(2)+"%";ticking=false
 })},{passive:true});
render();updateURL();
})();
