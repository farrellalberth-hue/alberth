/* Chronological REVIEW annotations, transcribed from original study archives. */
(function(global){"use strict";
const db=global.KENTZO_NOTES,rows=global.KENTZO_REVIEW_SOURCE;
if(!db||!Array.isArray(rows))return;
const phrases=[
["Hukum harga tunggal","Law of One Price"],
["Pinjaman di indonesia","Bank Loans in Indonesia"],
["Perpajakan indonesia","Indonesian Taxation"],
["Arbitrase crypto currency","Cryptocurrency Arbitrage"],
["Suku bunga minus","Negative Interest Rates"],
["Suku bunga","Interest Rates"],
["Perbedaan hedge fund","Hedge Funds"],
["Perbedaan triple intervention market","Triple Intervention Market"],
["triple intervention spot market","Triple Intervention Spot Market"],
["Teori pertumbuhan endogen","Endogenous Growth Theory"],
["Teori Modigliani-Miller","Modigliani–Miller Theorem"],
["teori new keynesian","New Keynesian Economics"],
["Kebijakan fiskal diskresioner","Discretionary Fiscal Policy"],
["Kebijakan moneter","Monetary Policy"],
["Teori slutzky","Slutsky Equation"],
["Kurva isoquant","Isoquant Curves"],
["Pasar monopsoni","Monopsony Market"],
["Opsi vanilla","Vanilla Options"],
["Opsi asian","Asian Options"],
["Teorema welfare","Welfare Theorems"],
["Konsep bounded rationality","Bounded Rationality"],
["Model Gordon Growth","Gordon Growth Model"],
["keuangan perilaku","Behavioral Finance"],
["Hukum okun","Okun's Law"],
["Hukum engel","Engel's Law"],
["Efek balassa-samuelson","Balassa–Samuelson Effect"],
["Teori produksi Cobb-Douglas","Cobb–Douglas Production Function"],
["Teori neo klasik","Neoclassical Theory"],
["Pemilihan validator","Validator Selection"]
];
const words=[
["ekonomi","economics"],["keuangan","financial"],["perbankan","banking"],
["pengangguran","unemployment"],["pertumbuhan","growth"],["permintaan","demand"],
["penawaran","supply"],["investasi","investment"],["perusahaan","companies"],
["perdagangan","trade"],["bunga","interest"],["peningkatan","increase"],
["penurunan","decrease"],["menghitung","calculating"],["teori","theory of"],
["kebijakan","policy"],["hukum","law of"],["konsep","concept of"],["kurva","curve of"],
["pasar","market"],["pajak","tax"],["uang","money"],["pinjaman","loans"],
["tingkat","rate"],["model","model"],["metode","method"],["fungsi","function"],
["jangka","term"],["makro","macro"],["mikro","micro"],["aset","assets"],
["likuiditas","liquidity"],["pemerintah","government"],["konsumsi","consumption"],
["produksi","production"],["terhadap","for"],["dengan","with"],["antara","between"],
["dalam","in"],["sebagai","as"],["untuk","for"],["dan","and"],
["neoklasik","neoclassical"],["paradoks","paradox"],["perbedaan","difference in"],
["risiko","risk"],["negara","country"],["indonesia","Indonesia"]
];
function normalizeEnglish(raw){
 let t=raw.replace(/\(\s*review\s*\)/gi,"").replace(/\breview\s*$/i,"").replace(/\s+/g," ").trim();
 for(const [needle,replacement] of phrases){
  if(t.toLowerCase().includes(needle.toLowerCase()))t=t.replace(new RegExp(needle,"gi"),replacement);
 }
 for(const [needle,replacement] of words){
  const re=new RegExp("\\b"+needle+"\\b","gi");t=t.replace(re,replacement);
 }
 t=t.replace(/\bDeffered\b/gi,"Deferred").replace(/\bAccural\b/gi,"Accrual").replace(/\bSubtitution\b/gi,"Substitution");
 return t;
}
const protect=["International Swaps And Derivatives Association","Cash And Cash Equivalents","Research and Development","Mergers and Acquisitions","Principles of Political Economy and Taxation"];
function explode(raw){
 let t=normalizeEnglish(raw);const captures=[];
 for(const phrase of protect){
  if(t.toLowerCase().includes(phrase.toLowerCase())){
   const i=captures.length;captures.push(phrase.replace(/ And /g," and "));
   t=t.replace(phrase,"§"+i+"§");
  }
 }
 t=t.replace(/\(\s*([A-Z][A-Z0-9-]{1,8})\s*\)/g,(_,v)=>"〔"+v+"〕");
 const chunks=t.replace(/\s+(?:&|and)\s+/gi," ||| ").replace(/\s*[,;]\s*/g," ||| ").replace(/\s+\/\s+/g," ||| ").replace(/[()]/g," ||| ").split("|||");
 return chunks.map(t=>t.replace(/〔([^〕]+)〕/g,"($1)").replace(/§(\d+)§/g,(_,n)=>captures[+n])
 .replace(/&/g," and ").replace(/\s+/g," ").replace(/^[\s:.,;-]+|[\s:.,;-]+$/g,"").trim())
 .filter(t=>t.length>=2&&!/^(?:a|i|ii|iii|iv|as|of|by|at|in|for|and|the|review|etc)$/i.test(t));
}
const base=db.topics, key=t=>String(t).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g,"");
const byFull=new Map(),byTitle=new Map();
for(const t of base){byFull.set(t.d+"|"+t.s+"|"+key(t.t),t);const token=key(t.t);if(!byTitle.has(token))byTitle.set(token,t.f);}
const classify=(title,date,s)=>{
 const k=key(title);if(byTitle.has(k))return byTitle.get(k);
 if(/\b(?:btc|bitcoin|crypto|blockchain|ethereum|eth|solana|sol|uniswap|dex|staking|validator|rollup|token|smart contract|layer 2|gas fee|utxo|nft|consensus|chainlink|polkadot|defi)\b/i.test(title))return "crypto";
 if(/\b(?:option|yield|swap|valuation|dividend|portfolio|bond|sharpe|asset pricing|risk premium|equity|loan|bank|interest rate|capital|beta|alpha|wacc|capm|apt|financial|derivative|volatility|hedge|hedging|liquidity|treynor|stock|futures|credit)\b/i.test(title))return "finance";
 if(/\b(?:variance|covariance|distribution|standard deviation|regression|statistic|markov|kalman|wiener|stochastic|AI\b|AGI\b|neural|accounting|journal|goodwill|optimization|matrix|p.value|heteroskedastic|marketing|taxation|management|audit|ledger)\b/i.test(title))return "others";
 if(/\b(?:economic|GDP|CPI|monetar|fiscal|Keynes|growth|money|Phillips|demand|supply|utility|welfare|inflation|deflation|market|tax|monopoly|monopsony|Slutsky|trade|Solow|interest|price|consumer|producer|aggregate|currency)\b/i.test(title))return "economics";
 const peers=base.find(t=>t.d===date&&t.s===s&&key(t.t).includes(k)&&k.length>5);
 return peers?peers.f:"others";
};
const seen=new Set();let marked=0,added=0;
for(const [s,d,raw] of rows){
 for(let t of explode(raw)){
  if(/^(?:Video|Youtube|Podcast|Channel|Review|Baca berita|Akademi Crypto|Timothy Ronald)\b/i.test(t))continue;
  const id=d+"|"+s+"|"+key(t);
  if(seen.has(id))continue;seen.add(id);
  const old=byFull.get(id);
  if(old){old.review=true;marked++;continue;}
  const entry={f:classify(t,d,s),d,t,s,review:true};
  base.push(entry);byFull.set(id,entry);added++;
 }
}
base.sort((a,b)=>a.d.localeCompare(b.d)||a.t.localeCompare(b.t));
db.total=base.length;db.reviewCount=base.filter(t=>t.review).length;
db.sourceNote="Dated learning topics from nine notes. REVIEW badges preserve review sessions specifically recorded in the original files.";
})(window);
