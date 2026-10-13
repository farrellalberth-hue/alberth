/* Kentzo Knowledge Atlas • Atomic Index v1
 * Split combined source headings into standalone subject cards, preserving review
 * provenance and date. Counts distinguish unique subjects from study records.
 */
(function(global){"use strict";
const db=global.KENTZO_NOTES;if(!db||!Array.isArray(db.topics))return;
const norm=v=>String(v||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[\u2010-\u2015]/g,"-").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
const split={
"dollar cost averaging vs lump sum investing":[["Dollar-Cost Averaging","finance"],["Lump-Sum Investing","finance"]],
"why yield sewa with yield beli rumah sangatlah jauh":[["Rental Yield","finance"],["Owner-Occupied Housing Yield","finance"]],
"kelemahan order book desentralisasi with liquidity pool":[["Decentralized Order Books","crypto"],["Liquidity Pools","crypto"]],
"rendah with inflation":[["Inflation","economics"]],
"differences in yield with staking":[["Yield","finance"],["Staking","crypto"]],
"differences in jensen s alpha ratio with treynor ratio":[["Jensen's Alpha","finance"],["Treynor Ratio","finance"]],
"relationship aptos with near protocol":[["Aptos","crypto"],["NEAR Protocol","crypto"]],
"relationship ethereum with geth":[["Ethereum","crypto"],["Geth Client","crypto"]],
"concept of value currency with upah":[["Currency Value","economics"],["Wages","economics"]],
"btc with opsi kontrak hanya 25 000":[["Bitcoin","crypto"],["Bitcoin Options Contracts","finance"]],
"principles of political economy and taxation":[["Political Economy","economics"],["Taxation","finance"]],
"isocost and":[["Isocost Lines","economics"]],
"mergers and acquisitions":[["Mergers","finance"],["Acquisitions","finance"]],
"international swaps and derivatives association isda":[["ISDA (Financial Derivatives Industry Association)","finance"]],
"cash and cash equivalents":[["Cash","finance"],["Cash Equivalents","finance"]],
"research and development dikapitalisasi":[["Research Expenditure Recognition","finance"],["Development Cost Capitalization","finance"]],
"research and development capitalization":[["Research Expenditure Recognition","finance"],["Development Cost Capitalization","finance"]],
"m and a fundamentals":[["Mergers","finance"],["Acquisitions","finance"]],
"statement of changes in equity and":[["Statement of Changes in Equity","finance"]],
"fundamental equilibrium exchange rate feer behavioral equilibrium exchange rate beer":[["Fundamental Equilibrium Exchange Rate (FEER)","economics"],["Behavioral Equilibrium Exchange Rate (BEER)","economics"]],
"aggregate supply aggregate demand":[["Aggregate Supply","economics"],["Aggregate Demand","economics"]],
"cash secured call put":[["Covered Call","finance"],["Cash-Secured Put","finance"]],
"secured call put":[["Covered Call","finance"],["Cash-Secured Put","finance"]],
"ad as curve":[["AD–AS Model","economics"]],
"is lm curve":[["IS–LM Model","economics"]],
"bretton woods impact":[["Bretton Woods System","economics"]],
"proses from awal selesai blockchain":[["Blockchain Transaction Lifecycle","crypto"]],
"with bert":[["BERT","others"]],
"detail":[],
"alamat":[["Blockchain Wallet Addresses","crypto"]],
"first":[["First-Degree Price Discrimination","economics"]],
"second":[["Second-Degree Price Discrimination","economics"]],
"3 stage":[["Three-Stage Dividend Discount Model","finance"]],
"active":[["Active Investing","finance"]],
"parametric":[["Parametric Value at Risk","finance"]],
"historical":[["Historical Value at Risk","finance"]],
"increasing":[["Increasing Returns to Scale","economics"]],
"decresing":[["Decreasing Returns to Scale","economics"]],
"ar":[["Autoregressive Model (AR)","finance"]],
"ma":[["Moving Average Model (MA)","finance"]],
"sr":[["Retail Sukuk (SR)","finance"]],
"st":[["Savings Sukuk (ST)","finance"]],
"covered":[["Covered Options Strategies","finance"]],
"research and development":[["Research","finance"],["Development","finance"]]
};
const aliases={
"varians":"Variance","covarians":"Covariance","standard deviasi":"Standard Deviation",
"return on assets":"Return on Assets (ROA)","roa":"Return on Assets (ROA)",
"return on equity":"Return on Equity (ROE)","roe":"Return on Equity (ROE)",
"return on investment":"Return on Investment (ROI)","roi":"Return on Investment (ROI)",
"p e":"Price-to-Earnings Ratio","pe ratio":"Price-to-Earnings Ratio",
"p bv":"Price-to-Book Value Ratio","pbv ratio":"Price-to-Book Value Ratio",
"ev ebitda":"EV-to-EBITDA Ratio",
"capm":"Capital Asset Pricing Model (CAPM)","apt":"Arbitrage Pricing Theory (APT)",
"arima":"Autoregressive Integrated Moving Average (ARIMA)",
"ols":"Ordinary Least Squares (OLS)","ordinary least squares":"Ordinary Least Squares (OLS)",
"monte carlo":"Monte Carlo Simulation","monte carlo simulation":"Monte Carlo Simulation",
"game theory":"Game Theory","standard deviation":"Standard Deviation"
};
const events=[],daily=new Map(),ambiguous=[];
let additionalSubtopics=0,fragmentLabelsExcluded=0,mergedSameDate=0,retitled=0;
function push(row,title,category){
 const t=aliases[norm(title)]||title;
 if(!t||t.length<2)return;
 const k=row.d+"|"+norm(t);
 if(daily.has(k)){
   const prior=daily.get(k);
   prior.review=prior.review||row.review===true;
   prior.sources=prior.sources||[prior.s];
   if(!prior.sources.includes(row.s))prior.sources.push(row.s);
   mergedSameDate++;return;
 }
 const next={...row,t,review:row.review===true,f:category||row.f};
 if(t!==row.t){next.sourceTitle=row.t;retitled++}
 events.push(next);daily.set(k,next);
}
for(const row of db.topics){
 const normalized=norm(row.t);
 let pieces=split[normalized];
 if(pieces===undefined){
   if(/\s(?:vs\.?|versus)\s/i.test(row.t))pieces=row.t.split(/\s+(?:vs\.?|versus)\s+/i).map(t=>[t.trim(),row.f]);
   else {
     if(/\s(?:and|with)\s/i.test(row.t)||/[;,]/.test(row.t)||/\([^)]*[,;&][^)]*\)/.test(row.t))ambiguous.push(row.t);
     pieces=[[row.t,row.f]];
   }
 }
 if(!pieces.length){fragmentLabelsExcluded++;continue}
 if(pieces.length>1)additionalSubtopics+=pieces.length-1;
 for(const [text,field] of pieces)push(row,text,field);
 // Original archived review: "Multi Stage Dividend Discount Model ( 2 & 3 Stage )".
 if(normalized==="3 stage" && row.review===true)push(row,"Two-Stage Dividend Discount Model","finance");
}
events.sort((a,b)=>a.d.localeCompare(b.d)||a.t.localeCompare(b.t));
const unique=new Map();
for(const entry of events){
 const k=norm(entry.t);
 let u=unique.get(k);
 if(!u){u={f:entry.f,t:entry.t,firstDate:entry.d,lastDate:entry.d,occurrences:0,reviewSessions:0,review:false,s:entry.s,votes:{}};unique.set(k,u)}
 u.votes[entry.f]=(u.votes[entry.f]||0)+1;
 u.occurrences++;
 if(entry.review){u.review=true;u.reviewSessions++}
 if(entry.d<u.firstDate)u.firstDate=entry.d;
 if(entry.d>u.lastDate)u.lastDate=entry.d;
}
const priority=["finance","economics","crypto","others"];
for(const u of unique.values()){
 u.f=Object.entries(u.votes).sort((a,b)=>b[1]-a[1]||priority.indexOf(a[0])-priority.indexOf(b[0]))[0][0];
 delete u.votes;
}
for(const event of events)event.f=unique.get(norm(event.t)).f;
db.topics=events;
db.uniqueTopics=[...unique.values()].sort((a,b)=>a.firstDate.localeCompare(b.firstDate)||a.t.localeCompare(b.t));
db.uniqueCount=unique.size;
db.total=events.length;
db.reviewCount=events.filter(t=>t.review).length;
db.atomizationAudit={originalIndexedRecords:3153,atomicStudyRecords:events.length,uniqueSubjects:unique.size,
additionalSubtopics,nonSubjectFragmentsExcluded:fragmentLabelsExcluded,sameDateDuplicatesMerged:mergedSameDate,
renamedTitles:retitled,unresolvedCombinedTitles:[...new Set(ambiguous)]};
db.sourceNote="Unique topics are individually normalized subject names, counted once across dates; chronological study records and dated REVIEW occurrences are counted separately.";
})(window);
