/* Kentzo Study Taxonomy v2: post-REVIEW classification for every topic occurrence.
    School allocation:
    Finance = finance + investing + banking + accounting + mathematics + statistics + econometrics.
    Economics = micro, macro, market structure, game theory, economic policy.
    Crypto = blockchain protocols and digital assets.
    Others = AI, management, marketing, law and remaining non-financial subjects.
    Review is an activity marker, never a category.
*/
(function (global) {
"use strict";
const db=global.KENTZO_NOTES;
if(!db||!Array.isArray(db.topics))return;
const rx=(s)=>new RegExp("(?:^|\\W)(?:"+s+")(?!\\w)","i");
const sets=[
{f:"crypto", terms:[
 "crypto(?:currency|currencies)?","bitcoin","BTC","ether(?:eum)?","ETH","solana","\\bSOL\\b","blockchain","smart.contract","token(?:omics|ization)?","tokenfi","ondo","origin.?trail","defi","dapp","web3","NFT","altcoin","wallet","mempool","UTXO","mining","hashrate","proof.of.(?:work|stake|authority|history)","POW","POS","DPOS","sybil.attack","gas.fee","staking","validator","merkle","on.chain","off.chain","rollups?","zk.?EVM","zkp","zk.snark","zk.stark","EVM","solidity","ERC.?20","cross.chain","chainlink","polkadot","avalanche","cardano","uniswap","aave","aptos","sui","arbitrum","layer.?zero","layer.?2","hedera","hashgraph","TRON","XRP","ripple","monero","bitcoin.core","multisig","digital.signatures?","private.key","public.key","cryptograph","DAG","halving","fireblocks","bitgo","liquidity.pool","impermanent.loss","yield.farming","decentralized.exchange","consensus","node(s)?\\b","transactions?.malleability","block.producers?","hash.based.message","hash.function","hashing","SHA.?256","delegated.proof","BNB","IPFS","HMAC","ECDSA","bitcoin.improvement","gossip.protocol","IOTA","staking.reward","Fetch.?AI","chain.?agnostic"
 ]},
{f:"economics",terms:[
 "economic(?:s|al)?","economy","macro(?:economics)?","micro(?:economics)?","introduction.to.macro","introduction.to.micro",
 "GDP","GNI","GNP","CPI","deflat(?:ion|or)","inflat(?:ion|ionary|si)","monetar(?:y|ism)","fiscal","fiskal","Phillips",
 "unemploy(?:ment|ed)","poverty","income.inequality","market.failure","market.structure","industrial.organization","market.equilibrium",
 "oligopol(?:y|istic)","monopol(?:y|istic)","monopson(?:y|istic)","perfect.competition","monopolistic.competition",
 "cournot","bertrand","stackelberg","collusion","cartel","kinked.demand","prisoner.?s.dilemma","game.theory","Nash",
 "payoff.matrix","strategic.interdependence","dominant.strategy","dominated.strategy","mixed.strateg","pure.strateg","backward.induction","credible.threat","credible.commitment","repeated.game","limit.pricing","predatory.pricing",
 "consumer.theory","producer.theory","consumer.surplus","producer.surplus","deadweight.loss","welfare","Pareto","Edgeworth",
 "public.good","private.good","externalit","pigouvian","Coase","tragedy.of.(?:the.)?commons","free.rider",
 "utility","indifference.curve","marginal.utility","income.effect","substitution.effect","Engel.?s.law","Giffen","Veblen","Marshallian","Hicksian","Slutsky",
 "demand","supply","law.of.price","law.of.demand","law.of.supply","price.ceiling","price.floor","price.discrimination",
 "market.power","market.share","market.performance","concentration.ratio","entry.barrier","barriers?.to.entry",
 "elasticit","isoquant","isocost","returns.to.scale","cost.minimiz","output.maximiz","production.function","total.product","average.product","marginal.product",
 "marginal.cost","average.variable.cost","average.total.cost","average.fixed.cost","variable.cost","fixed.cost","total.cost","economic.cost","accounting.cost","explicit.cost","implicit.cost","opportunity.cost","business.costs?","profit.maximiz","economies.of.scale","economies.of.scope","diseconomies","diminishing",
 "Keynes","Ricard(?:o|ian)","Leontief","Lucas","Solow","Romer","Ramsey.?Cass","Mundell.?Fleming","Stolper.?Samuelson","Balassa.?Samuelson",
 "IS.?LM","AD.?AS","Phillips.curve","aggregate.demand","aggregate.supply","business.cycle","secular.stagnation","growth.theory","endogenous.growth","neoclassical.growth","growth.model","optimal.taxation",
 "deglobali","hekscher","heckscher","comparative.advantage","absolute.advantage","international.trade","trade.balance","trade.agreement","bilateral.trade",
 "capital.accumulation","natural.rate","recession","depression","say.?s.law","paradox.of.thrift","paradox.lucas","paradox.Leontief","Fisher.effect",
 "central.bank","money.supply","quantitative.easing","quantitative.tightening","open.market.operation","reserve.requirement","repo.rate","reverse.repo","interest.rate.parity","balance.of.payments","current.account","goods.market","labor.market","labour.market","marginal.propensity","ICOR",
 "adverse.selection","asymmetric.information","information.economics","signaling","screening","principal.?agent","moral.hazard","hidden.action","hidden.information","incentive.contract","agency.cost","network.effect","switching.cost","customer.lock.?in","two.sided.market","regulatory.economics","competition.policy",
 "behavioral.economics","prospect.theory","loss.aversion","bounded.rationality","cognitive.bias","confirmation.bias","framing.effect","anchoring","present.bias","status.quo.bias","mental.accounting","herd.behavior","overconfidence","availability.bias","reference.point","market.mechanism","contract.curve","double.marginalization","horizontal.integration","vertical.integration","merger.analysis","corporate.conduct","monetary.transmission","economic.incentive"
]},
{f:"finance",terms:[
 "account(?:ing|ant|s?.receivable|s?.payable)","accrual","defer(?:red|ral)","journal","ledger","trial.balance","balance.sheet","income.statement","financial.statement","financial.report","cash.flow","free.cash.flow","FCFF","FCFE","working.capital","net.working","cash.conversion","double.entry","chart.of.accounts","deprecia","amortiz","goodwill","impairment","equity.method","consolidat","revenue","expense","earnings","gross.profit","net.income","operating.income","operating.profit","EBIT","EBITDA","COGS","cost.of.goods.sold","income.tax","taxation","tax.treaty","withholding.tax","foreign.tax","transfer.pricing","tax.residence","tax.accounting","tax.liabilit","tax.asset","tax.credit","tax.exemption","income.tax","bookkeeping","inventory","asset.turnover","inventory.turnover","turnover.ratio","financial.ratio","ratio.analysis","DuPont","current.ratio","liquidity.ratio","leverage.ratio","efficiency.ratio","profitability.ratio","operating.margin",
 "asset(?:s)?","liabilit","share.capital","retained.earning","treasury.stock","AOCI","APIC","revaluation.reserve","matching.principle","revenue.recognition","contract.identification","lease.principle","IFRS","GAAP","IAS","ISAK","PSAK","SAK.Indonesia","audit","audit.committee","historical.cost","fair.value","earnings.quality","deferred.principle","adjusting.entries","closing.entries","acquisition.method","business.combination","operating.expenditure","capital.expenditure","OPEX","CAPEX","ROA","ROE","ROIC",
 "financ(?:e|es|ial|ing)","bank(?:ing|s)?","mortgage","bond","debenture","credit","deposit","investment","investor","portfoli","asset.pricing","asset.allocation","capital.budgeting","capital.allocation.line","security.market.line","capital.market.line","treasury.bill","risk.management","risk.aversion","risk.neutral","risk.premium","risk.parity","risk.adjusted","Sharpe","Sortino","Treynor","fama","French","Carhart","Markowitz","Black.?Litterman","volatility","value.at.risk","VAR","CVAR","expected.shortfall","downside","hedg(?:e|ing|ed)","arbitrage.pricing","alpha.coefficient","beta.coefficient","CAPM","APT","WACC","sdf","stochastic.discount","credit.risk","credit.default","CDS","CDO","CLO","MBS","ABS","structured.product","derivative","swap(?:s|tion)?","future(?:s)?","forward(?:s)?","option(?:s)?","strike.price","option.greek","delta.greek","gamma.greek","risk.free","loan","lending","lender","borrowing","interest.rate","yield.curve","yield.to.maturity","fixed.income","discount","dividend","valuation","enterprise.value","net.present.value","NPV","IRR","cost.of.capital","cost.of.debt","cost.of.equity","risk.weighted","RWA","CET1","AT1","CAR","CAR1","Basel","LCR","NSFR","tier.[012]","CoCo","contingent.convertible","subordinated","perpetual.bond","capital.adequacy","high.water.mark","hurdle.rate","performance.fee","hedge.fund","private.equity","venture.capital","mutual.fund","index.fund","ETF","ETN","ETP","stock","share","buyback","insuran","B.Book","A.Book","capital.reserves?","FVA","KVA","XVA","LIBOR","SOFR","term.structure","interest.rate.model","Vasicek","Cox.Ingersoll","Heston","Black.Scholes","binomial.tree","lending","financial.instrument","capital.market","money.market","liquidity.coverage","fundamental.analysis","technical.analysis",
 "math(?:ematic|s)?","statistic","econometric","regression","OLS","standard.error","robust.standard","variance","covariance","mean","median","mode","distribution","Gaussian","normality","probabilit","stochastic","Brownian","Wiener","Kalman","Markov","HMM","ARIMA","ARMA","autoregress","auto.regress","moving.average","GARCH","ARCH","heteroskedastic","homoskedastic","endogeneity","multicollinear","cointegration","stationarit","statistic","sampling","hypothesis.test","hypothesis.testing","null.hypothesis","F.statistic","t.statistic","p.value","correlation","quantile","quantitative","skewness","kurtosis","fat.tails","Monte.Carlo","optimization","Lagrang","calculus","differentiat","integration","integral","matrix","linear.algebra","Bessel","confidence.interval","time.series","Bayes","Bayesian","probabilistic","forecast.model","factor.model","standard.deviation","expected.value","probability.density","predictive.model","method.of.moments","Dynamic.Stochas","DSGE","Autocorrelation","geometric.brownian","irreducib","recurrence","model.training" 
]},
{f:"others",terms:[
 "AI","AGI","artificial.intelligence","machine.learning","deep.learning","neural","back.propagation","backpropag","BERT","GPT","language.model","generative","transformer","robot","humanoid","software","programming","information.technology","IoT","computer.vision","AI.agent",
 "management","marketing","sales","customer.relationship","customer.segment","customer.service","business.model","business.plan","business.strategy","business.research","entrepreneur","corporate.governance","governance.committee","board.of.commissioners","board.committee","organizational","bureaucratic","administrative.management","agile","lean.management","stakeholder","change.management","human.resource","HR.analytics","HRM","talent","innovation","product.development","branding","commercial","cooperative","evidence.based.management","leadership","marketing.communication","digital.business","digital.service","operations",
 "law","legal","regulat","criminal","penalty","politi","totalitarian","customs","customs.duty","hydrogen","methane","LNG","tindakan","El.Niño","trade.tariff","climate.change","climate","environmental","photovoltaic","research.methodology"
 ]}
];
for(const rule of sets)rule.pattern=rx(rule.terms.join("|"));
const exact=[
["economics",/^(?:game.theory|Nash.equilibrium|industrial.organization|profit|maximiz(?:ation)?|business.costs?|behavioral.economics|network.effects?|Pareto|utility|market.failure|economic.cost|accounting.cost|fixed.cost|variable.cost|marginal.cost|average.total.cost|average.fixed.cost|average.variable.cost|law.of.one.price|paradox.of.thrift|Leontief.paradox)$/i],
["finance",/^(?:accounting|financial.accounting|income.statement|balance.sheet|cash.flow.statement|revenue|expense|dividends|Fama|ROIC|ROE|ROA|ROA|PBV.ratio|PE.ratio|CET1|AT1|CAR1|ledger|net.income|goodwill|investment.policy.statement|variance|covariance|mean|regression|standard.deviation|mathematics|statistics|econometrics|Detail.of.accounting)$/i],
["crypto",/^(?:BTC|ETH|EVM|Ondo|Origin.trail|TokenFi|Sybil.attack|halving|HMAC|hash.based.message.*|Cryptocurrency.Arbitrage|Fetch.Ai|Fireblocks|BitGo)$/i],
["others",/^(?:AI|AGI|BERT|GPT|deep.learning.AI|neural.network.AI|digital.marketing|marketing|sales|business.model.canvas|management.fundamentals|corporate.governance|project.management|legal.regulation|digital.business)$/i]
];
const additionalOverrides=[
["economics",/^(?:theory.of.neoclassical|theory.of.siklus.bisnis|law.of.gesham|keunggulan.komparatif|keunggulan.mutlak|theory.of.elastisitas.subtitusi.antarwaktu|concept.of.endogenous.time.preference|Backfire.effect|Parreto.efficiency)$/i],
["finance",/^(?:concept.of.efficient.frontier|ESG|ESG.Policy|Green.Bond|Corporate.Taxation|Data.Analysis|Time.Series.Model)$/i],
["crypto",/^(?:tanda.tangan.digital|Cara.pembuatan.private.key|public.key|escrow.multi.sig)$/i]
];
const refinements=[
["finance",/^(?:Modigliani.?Miller.Theorem|DeR|Risk.Aversion|Absolute.Risk.Aversion|Relative.Risk.Aversion|Constant.Relative.Risk.Aversion|Irreducibility|Recurrence|Law.of.Large.Numbers|Accounting.Principles|Capital.Management|Equity|Perpetual.Bonds?|Subordinated.Loans?|Standard.Deviation|Standard.deviasi|Financial.Econometrics|Econometrics|Mathematics|Statistics|Probability|Algebra|Income.Statement|Treasury.Stock|Net.Working.Capital|Tax.Residence|Interest.Rate.Parity|International.Taxation|International.Financial.Management|Deposit.Insurance|Tier.1|Tier.2.CAR|IFRS.15|Deffered.Principle|Accounting.Fundamentals|Corporate.Finance|Insurance|Insurance.Company|Financial.Risk|Asset.Pricing|Interest.Rate.Swaps?|Strategi.Straddle|Strategi.Harmonic.Trading|Giro.Wajib.Minimum|CoCos|Foreign.Currency.Accounting)$/i],
["economics",/^(?:Law.of.Okun|Okun.?s.Law|Law.of.Gresham|Law.of.Engel|Engel.?s.Law|Parreto.Efficiency|Pareto.Efficiency|Efek.Fisher|Fisher.Effect|Teorema.Stolper.Samuelson|Stolper.Samuelson|Teorema.Aarow.Debreu|Arrow.?Debreu|Static.General.Equilibrium|Dynamic.General.Equilibrium|General.Equilibrium|DSGE|Hypothesis.Twin.Deficits|Hypothesis.of.Twin.Deficits|Policy.Fiskal.Counter.Cyclical|Model.Curve.of.AS.AD|Curve.of.AD.AS|Trickle.Down.Theory|Neoclassical.Theory|Theoretical.Neoclassical|Game.Theory|Profit.Maximization|Law.of.One.Piece.\(LOP\)|Law.of.One.Price|Comparative.Advantage|Absolute.Advantage|Mirrlees.Model|Leontief.Paradox|Regulatory.Economics|Network.Effects?|Double.Marginalization|Two.Part.Tariff|Market.Failure)$/i],
["crypto",/^(?:Digital.Signatures?|Transactions.Malleability|Halving|Hash.Based.Message.Auntentication.Code|Escrow.Multi.Sig|Hash.Based.Message.Authentication.Code|Distributed.Denial.of.Services|DoS|DAO|Decentralized.Autonomous.Organization)$/i],
["others",/^(?:Kecerdasan.AI|Language.Model.Formation|Training.Model|Model.Training|Data.Collection|Pre.Processing|Bidirectional.Encoder.Representatione.from.Transformers|Generative.Pre.Trained.Transformers|Rust.Programming.Language|Move.Programming.Language|Tensorflow|PyTorch)$/i]
];
const fixes=[
["economics",/^(?:Efek.fisher|efek.ricardo.barro|paradox.lucas|paradox.leontief|teorema.stolper.samuelson|stolper.samuelson|arrow.debreu|teorema.coase|trickle.down.theory|model.c.?urve.of.(?:AS.AD|AD.AS|IS.LM)|curve.of.(?:AS.AD|AD.AS|IS.LM)|model.ricardian|model.Romer|Say.s.law|New.Keynesian.Economics|Neoclassical.Theory|Fiscal.Policy|Inflasi|Deflasi|policy.fiskal.counter.cyclical|Tragedy.of.commons|Opportunity.Cost)$/i],
["finance",/^(?:Standard.deviasi|loan.*subordinasi|loans.subordinasi|Cadangan.revaluasi|Foreign.tax.credit|Giro.antarbank|Giro.wajib.minimum|Dana.asuransi.in.perpetual|Mortages.backed.securities|CoCos|Growth.Accounting|Accounting.Expert|Financial.Management|CAR1|CAR.total|Hurdle.rate|High.water.mark|value.at.risk|Strangle|straddle|Opsi|Future|Fee|GJR.GARCH|Fama|Detail.of.Accounting)$/i],
["crypto",/^(?:Halving|Cara.pembuatan.private.key|Hash.based.message.Auntentication.Code|escrow.multi.sig|Digital.signatures|Transaction.malleability|Distributed.denial.of.services|DoS)$/i],
["finance",/^(?:chart.of.accounts|closing.entries|current.liabilities|non.current.liabilities|contract.identification|acquisition.method|efficiency.ratios|profitability.ratios|lease.principle|matching.principle|fair.value|big.bath|cookie.jar|days.payables.outstanding|dso|eps|fvtpl|fvoci|irr|earnings.quality|asset.turnover|account.receivable|contigent.liabilities)$/i],
["economics",/^(?:agency.costs|information.economics|adverse.gSelection|moral.hazard|signaling|screening|bounded.rationality|behavioral.economics|reference.points|overconfidence|incentive.contracts|network.effects|double.marginalization|pricing.power|information.asymmetry)$/i]
];
function detect(title,fallback){
 const t=String(title).trim();
 if(!t)return fallback;
 // Drop category defaults; the term REVIEW is a session attribute rather than a discipline.
 if(t==="Detail"||t==="alamat")return fallback;
 for(const [group,re] of exact)if(re.test(t))return group;
 for(const [group,re] of additionalOverrides)if(re.test(t))return group;
 for(const [group,re] of refinements)if(re.test(t))return group;
 for(const [group,re] of fixes)if(re.test(t))return group;
 // Exception for shared labels where the context, not the generic words, defines economics.
 for(const rule of sets)if(rule.pattern.test(t))return rule.f;
 return fallback;
}
let changed=0;
const before=Object.fromEntries(["economics","finance","crypto","others"].map(f=>[f,db.topics.filter(t=>t.f===f).length]));
for(const t of db.topics){const f=detect(t.t,t.f);if(f!==t.f){t.f=f;changed++}}
db.reclassifiedCount=changed;db.classifierVersion="v2.4";
db.fields=db.fields.map(f=>f.id==="finance"?({...f,desc:"Investing, banking, mathematics, statistics, econometrics and accounting."}):f.id==="others"?({...f,desc:"AI, business management, marketing and other disciplines."}):f);
db.categoryCounts=Object.fromEntries(["economics","finance","crypto","others"].map(f=>[f,db.topics.filter(t=>t.f===f).length]));
db.previousCategoryCounts=before;
})(window);