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
const portfolioPatches=[
["finance",/^(?:Statement.Of.Changes?.In.Equity(?:.and.…)?.?|Equity.Restructuring|Index.Investing|Passive.Investing|Factor.Investing|Liability.Driven.Investing|AutoRegressive(?:.\(AR\))?|Statistical.Model|Auto.Re?gressive(?:.\(AR\))?)$/i],
["others",/^(?:Equity.Theory|Risk.Committee|Board.Of.Commissioners|Corporate.Governance)$/i]
];
const misfiledFixes=[
["finance",/^(?:Managed.Account.Ratio|Thin.Capitallization|Thin.Capitalization|Cost.Structure|Risk.Attitude|Risk.Seeking|Account.Receiveable|Marketable.Securities|Trademarks|Research.and.Development.Capitalization|Amortized.Cost|Shutdown.?Dismantling.Cost|Portfolio.Management|Maximize.Return.Subject.To.Target.Risk|M.and.A.Fundamentals|Advance.Risk.Tools|Tail.Risk|Excise.Tax|Indirect.Tax|Sales.Tax|Digital.Services.Tax|Global.Minimum.Tax|Leverage.Ratios|DeR|Modigliani.Miller.Theorem)$/i],
["economics",/^(?:Fisher.Equation|Ideal.Tax|Sunk.Cost|Switching.Costs|Behavioral.Economics|Price.Setting|Network.Externalities)$/i],
["crypto",/^(?:Mekanisme.Funding.Rate)$/i]
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
 for(const [group,re] of portfolioPatches)if(re.test(t))return group;
 for(const [group,re] of misfiledFixes)if(re.test(t))return group;
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
db.reclassifiedCount=changed;db.classifierVersion="v2.6";
db.fields=db.fields.map(f=>f.id==="finance"?({...f,desc:"Investing, banking, mathematics, statistics, econometrics and accounting."}):f.id==="others"?({...f,desc:"AI, business management, marketing and other disciplines."}):f);
db.categoryCounts=Object.fromEntries(["economics","finance","crypto","others"].map(f=>[f,db.topics.filter(t=>t.f===f).length]));
db.previousCategoryCounts=before;
})(window);
/* Taxonomy v3 correction pass: mathematical, statistical, econometric and
   accounting topics remain Finance even when they are REVIEW sessions.
   Explicit subject terms supersede fallback "Others"; preserves title/date/review. */
(function(global){"use strict";
const db=global.KENTZO_NOTES;if(!db||!db.topics)return;
const forced=[
["economics",/^(?:Arrow Debreu model|BoP|Cantillon Effect|Ceteris Paribus|Cobb-Douglas Function|Crowding Out|Crowding out|Dynamic Stochashtic General Equilibrium|Expenditure Approach|Gross Domestic Product|Gross National Product|Goods|Hodrick-Prescott Filter|IMF|Keynesian|MPL|MPK|MRTS|Marginal Analysis|Marginal Rate Of Substitution.*|Marginal Rate Of Technical Substitution.*|Neo-Keynesian Theory|New Classical Theory|New Keynesian IS Curve|Overlapping Generations Theory.*|Output Approach|Payoff|Post-Keynesian|Production Possibility Frontier.*|Return To Scale|Primary Income|Secondary Income|Triffin Dilemma|Twin Deficit Hypothesis|Monetarist Theory|Taylor Rule|Labor Embodied|Labour Embodied|National Income Accounting|Law of One Price|Fisher Equation|Parreto efficiency|Profit Maximization|Cobb–Douglas Production Function)$/i],
["crypto",/^(?:Konsensus Proof of Staked Authority|Konsensus tendermint|Difficulty target|Merke root|RIPEMD-160|SHA512|SPV|Nonce block|Rogue key attack|Schnorr signatures|Transaksi coinbase|Tanda tangan digital|Digital signatures|Password-Based-Key Derivation Function 2.*|Practical Byzantine Fault Tolerance.*|Move Programming Language|Rust Programming Language|Public key|Private key|Escrow multi sig|Public Key|Mempelajari Near|Transactions malleability)$/i],
["finance",/^(?:Cash and Cash Equivalents|Current Assets|Non-Current Assets|Non-Current Liabilities|Current Liabilities|Operating Expenses|Operational Expenditure|Cost Structure|Cox Ross Rubinstein.*|Cox-Ingerssol-Ross.*|Butterfly Spread|Contract For Difference|Conglomerate Merger|Consolidation|Other Comprehensive Income|First-In First-Out|Last-In First-Out|Depreciation|Depreciation Change|Declining Balance|Double Declining Balance|Account Receiveable|Liabilities|Profit Shifting|Profitability Index|Liability-Driven Investing|Purchase Price Allocation|Receivables Turnover|Quick Ratio|Residual Income model.*|Return on Investment|Arbitrage Pricing Theory|Abritrage Pricing Theory|Laubach–Williams model|model Laubach-Williams|Nelson-Siegel Svensson model|Financial Statements|Financial Statements Basic Structure|Controlled Foreign Corporation|Permanent Establishment|Pillar One|Pillar Two|Stamp Duty|Treaty Shopping|Thin Capitallization|Thin Capitalization|Bea Cukai|Exemption Method|Amount A|Arm's Length Principle|Currency Accounting|DeR|Cash-Secured Call\/Put|Secured Call\/Put|Secured repo|Harmonic|ICT Strategy|IHSG|INDON|MSCI Index|ORI|SBR|OTC order block|Nilai waran|Saham preferen|Obligasi perpetual|P\/E|P\/S|P\/BV|PPE|VAT|ROCE|ROI|RTGS|Real Time Gross Settlement|Giro antarbank|Accountant|Loan Loss Reserves|NPL Gross|Dividend Discount Model|Opsi bermudan|Opsi lookback|Long Call Put|Internal Rate Of Return|Discounted Payback|Fama|Cox Ross Rubinstein|Mean Reversion|Risk Committee|Risk Management|Advance Risk Tools|Risk Attitude|Risk Seeking|Maximize Return Subject To Target Risk|Bank Capital|Stress Testing|Scenario Analysis Finance|Secured Overnight Financing Rate.*|Current Ratio|Floating Rate Note.*|Fixed strike|Floating strike|Contingent Convertible Bonds|Research and Development dikapitalisasi|Operating Income)$/i],
["finance",/\b(?:heteroskedasticity|homoskedasticity|econometrics?|statistic[sal]*|regression|varianc[eis]|covarians?|Brownian|Wiener|Kalman|autoregress|ARIMA|ARMA|GARCH|standard deviasi|standard deviation|standard error|Lagrang|hypothesis test|probability|distribution|correlation|correlat|random walk|parametric VaR|Monte Carlo|matrix|OLS\b|P-value|p-value|time series|moving average|quantile|quantitative|optimization|geometric brownian|Bessel|autoregress|f.statistic|t.statistic|irreducib|recurrence)\b/i],
["finance",/\b(?:accounting|financial statement|income statement|balance sheet|cash flow|expense|revenue|ledger|journal|IFRS|PSAK|goodwill|assets?\b|liabilities\b|depreciat|impairment|bookkeeping|cash and cash|taxation|tax treaty|withholding|tax credit|credit rating|credit spreads?|invest(?:ment|ing)|portfolio|risk premium|bond|risk tools|risk management|m and a|merger|acquisition|pricing model|option|swap|spread|forward|futures)\b/i],
["economics",/\b(?:Cobb.Douglas|Keynesian|New Classical|Classical Economics|economics|economic|game theory|consumer theory|producer theory|microeconomic|macroeconomic|GDP|GNP|IS.LM|AD.AS|industrial organization|market failure|monetary|fiscal|marginal propensity|Arrow.Debreu|welfare|Leontief|Ricardian|Triffin|equilibrium|profit maximization|money supply|price elasticity|comparative advantage|absolute advantage|unemployment|marginal rate of substitution|marginal rate of technical substitution|rate of technical substitution|crowding out|production possibility|monetarist|interest rate parity|regulatory economics|market concentration|business cycle|endogenous growth)\b/i]
];
const preserveOthers=/^(?:Artificial Intelligence|AI|AGI|BERT|GPT|Deep learning AI|Neural Network AI|Kecerdasan AI|Generative Pre-trained Transformer|Generative pre-trained transformers|Training model|Model training|Data collection|Business Information System|Management|Organizational Behavior|Consumer Behavior|Corporate Governance|Digital Marketing|Marketing|Sales|Risk Committee|Business Model Canvas.*|Stakeholder Theory|Human Resources Management|Human Resources Economics|Human Relations Theory)$/i;
const economicsException=/^(?:National Income Accounting|Growth Accounting|Dynamic Stochashtic General Equilibrium|DSGE|Dynamic Stochastic General Equilibrium|Economic Cost|Accounting Cost)$/i;
let moved=0;
for(const topic of db.topics){
 const title=String(topic.t||"").trim();
 if(preserveOthers.test(title)){if(topic.f!=="others"){topic.f="others";moved++}continue}
 if(economicsException.test(title)){if(topic.f!=="economics"){topic.f="economics";moved++}continue}
 for(const [newField,re]of forced){if(re.test(title)){if(topic.f!==newField){topic.f=newField;moved++}break}}
}
db.taxonomyRevision="v3.0";
db.taxonomyMovedByReviewAwarePass=moved;
db.categoryCounts=Object.fromEntries(["economics","finance","crypto","others"].map(f=>[f,db.topics.filter(t=>t.f===f).length]));
db.fields=db.fields.map(f=>f.id==="finance"?{...f,desc:"Investments, banking, mathematics, statistics, econometrics and accounting."}:f.id==="others"?{...f,desc:"Artificial intelligence, management, marketing and other disciplines."}:f);
})(window);

/* Final review-aware corrections for short, abbreviated and mixed-language
   source entries whose subject was not reliably recognized by earlier passes. */
(function(g){"use strict";
const d=g.KENTZO_NOTES;if(!d||!d.topics)return;
const corrections=[
["crypto",/^(?:Mekanisme order book|Mekanisme funding rate|Konsensus tendermint|Tree)$/i],
["economics",/^(?:B-S Effect|Debt Trap Diplomacy|Deglobalisasi|Real Wages|Purchasing Power Parity \(PPP\)|Services|Tarif|Tariff|Non farm payroll \(NFP\)|Surat berharga country|function production cobb-douglass|Human Resources Economics|Specialization|Hodrick-Prescott Filter|Paradox|Triffin Dilemma)$/i],
["finance",/^(?:ARA|B-S Effect \d|Base Erosion|Amount A|Appraisal Company|Arm's Length Principle|CASA|Cadangan Kerugian decrease Nilai \(CKPN\)|Comparable Analysis|Corporate Restructuring|Covered|Customs Duty|Debt overhang|Debt Restructuring|Declining Balance|Difference Form|Gap Form|Right-Skewed|Discounted Payback|Efficiency|Franchise Rights|Long Term Receiveable|Guarantee|High-Frequency Trading|Historical|Hostile Takeover|ICT|ICT strategy|Income Approach|Internal Rate Of Return|Iron Condor|Iron Condor Strategy|Lagrange|Lagrange Function|Lagrange Multiplier|Lagrangian|Licenses|Management Buyout \(MBO\)|management fees|Mergers and Acquisitions|Mekanisme short selling|Operational Expenditure|Operation Reserach|Other Comprehensive Income|Parametric|Patents|Payback|Pembayaran RTGS|performance fees|Perpajakan|Propiertary trading firm|Residence|Rho Greek Letter|Salvage|Scale|scale|Scientific Management\s+Finance|Source Principle|SR|ST|straddle strategy|Straight-line|Terminal Value|Theta Greek Letter|Tie-Breaker Rule|time decay opsi|Varians|Vega Greek Letter|Vol of Vol|Weighted Average|Wu-Xia Shadow Rate|ΔNWC|Return on Equity|Research and Development Capitalization|Value at Risk|National Income Accounting\s+Finance)$/i],
["finance",/\b(?:statistic|econometric|regress|varians|variance|covarian|heteroskedastic|homoskedastic|wiener|brownian|lagrange|lagrangian|monte carlo|optimization|autocorrelat|treynor|sharpe|capm|accounting|journal|financial statement|capital asset pricing)\b/i]
];
let reassigned=0;
for(const t of d.topics){if(t.f!=="others")continue;
 for(const [group,pattern]of corrections){if(pattern.test(t.t)){t.f=group;reassigned++;break}}
}
d.categoryCounts=Object.fromEntries(["economics","finance","crypto","others"].map(x=>[x,d.topics.filter(t=>t.f===x).length]));
d.finalTaxonomyCorrection=reassigned;
})(window);
