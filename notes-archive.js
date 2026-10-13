(function(){
"use strict";
const db=window.KENTZO_NOTES,root=document.getElementById("atlas");
if(!db||!root){return;}
const $=id=>document.getElementById(id);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const url=new URL(location.href),params=url.searchParams;
const field=db.fields.some(x=>x.id===root.dataset.field)?root.dataset.field:"economics";
const spec=db.fields.find(x=>x.id===field);
const fieldTopics=db.topics.filter(x=>x.f===field);
const availableYearCount=y=>fieldTopics.filter(t=>Number(t.d.slice(0,4))===y).length;
let year=Number(params.get("year"));if(!db.years.includes(year))year=2026;
let month=Number(params.get("month"));if(!(month>=1&&month<=12))month=0;
let query=params.get("q")||"",displayLimit=36;
const countYear=y=>fieldTopics.filter(t=>Number(t.d.slice(0,4))===y).length;
const countMonth=m=>fieldTopics.filter(t=>+t.d.slice(0,4)===year&&(!m||+t.d.slice(5,7)===m)).length;
const textDate=d=>{const p=d.split("-");return p[2]+" "+db.months[Number(p[1])-1]+" "+p[0];};
function updateURL(){const p=new URLSearchParams();p.set("year",String(year));if(month)p.set("month",String(month).padStart(2,"0"));if(query)p.set("q",query);history.replaceState(null,"",location.pathname+"?"+p.toString());}
function renderNav(){
 $("discipline-nav").innerHTML=db.fields.map(f=>{const n=db.topics.filter(t=>t.f===f.id).length;return '<a href="/library/'+f.id+'/?year='+year+'" class="'+(field===f.id?"active":"")+'" '+(field===f.id?'aria-current="page"':"")+'><span>'+esc(f.name)+'</span><span class="sidebar-count">'+n.toLocaleString("en-US")+'</span></a>';}).join("");
 $("field-label").textContent=spec.name;
 $("hero-field").textContent=spec.name;
 $("hero-desc").textContent=spec.desc;
 $("all-topics").textContent=fieldTopics.length.toLocaleString("en-US");
 $("active-years").textContent=db.years.filter(y=>availableYearCount(y)>0).length;
 $("area-name").textContent=spec.name;
 document.title=spec.name+" — Learning Notes | Kentzo Honggo Limkajaya";
}
function renderYears(){
 $("year-filters").innerHTML=db.years.map(y=>'<button type="button" class="year-button '+(y===year?"active":"")+'" aria-pressed="'+(y===year)+'" data-year="'+y+'"><strong>'+y+'</strong><span>'+countYear(y)+' notes</span></button>').join("");
 $("year-filters").querySelectorAll("button").forEach(el=>el.addEventListener("click",()=>{year=+el.dataset.year;month=0;displayLimit=36;updateURL();render();}));
}
function renderMonths(){
 let months=[{m:0,name:"All months"},...db.months.map((name,i)=>({m:i+1,name}))];
 $("month-filters").innerHTML=months.map(({m,name})=>{
 const n=countMonth(m),label=m?name.slice(0,3).toUpperCase():"ALL";
 return '<button type="button" class="month-button '+(m===month?"active":"")+'" data-month="'+m+'" aria-pressed="'+(m===month)+'" aria-label="'+esc(name)+': '+n+' study topics" '+(!n&&m!==0?"disabled":"")+'><span>'+label+'</span><small>'+n+'</small></button>';
 }).join("");
 $("month-filters").querySelectorAll("button").forEach(el=>el.addEventListener("click",()=>{month=+el.dataset.month;displayLimit=36;updateURL();render();}));
}
function filtered(){
 let q=query.trim().toLowerCase();
 return fieldTopics.filter(t=>+t.d.slice(0,4)===year&&(!month||+t.d.slice(5,7)===month)&&(!q||t.t.toLowerCase().includes(q)||t.d.includes(q))).sort((a,b)=>b.d.localeCompare(a.d)||a.t.localeCompare(b.t));
}
function renderList(){
 const items=filtered();
 $("result-count").textContent=items.length.toLocaleString("en-US")+" MATCHING TOPICS";
 $("current-period").textContent=month?db.months[month-1]+" "+year:String(year);
 $("current-total").textContent=items.length.toLocaleString("en-US");
 if(!items.length){
 $("topic-list").innerHTML='<div class="empty-state"><strong>No topics for this selection.</strong><p>Try a different year or month, or clear the search. Only learning topics documented in the nine source notes are listed.</p></div>';
 $("topic-list").style.display="block";$("load-more").hidden=true;return;
 }
 $("topic-list").style.display="";
 $("topic-list").innerHTML=items.slice(0,displayLimit).map(t=>
 '<article class="topic-card"><h3>'+esc(t.t)+'</h3><div class="topic-meta"><span>'+esc(textDate(t.d))+'</span><span>NOTE '+esc(t.s)+'</span></div></article>'
 ).join("");
 const more=items.length>displayLimit;$("load-more").hidden=!more;
 $("load-more").textContent=more?"LOAD MORE TOPICS ("+(items.length-displayLimit)+" REMAINING) ↓":"";
}
function render(){renderYears();renderMonths();renderList();}
$("topic-search").value=query;$("topic-search").addEventListener("input",e=>{query=e.target.value;displayLimit=36;updateURL();renderList();});
$("load-more").addEventListener("click",()=>{displayLimit+=36;renderList();});
const meter=$("reading-line");let ticking=false;
window.addEventListener("scroll",()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const h=Math.max(1,document.documentElement.scrollHeight-innerHeight);meter.style.width=(Math.max(0,Math.min(1,scrollY/h))*100).toFixed(2)+"%";ticking=false})},{passive:true});
renderNav();render();updateURL();
})();