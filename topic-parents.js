/* Viel Knowledge Atlas — canonical parent topic metadata.
 * Parent labels are explanatory UI metadata, NEVER a mutation of stored topic
 * identities, dates, REVIEW flags, category, or unique/chronological counts.
 * Most specific subject rules take priority; ambiguous source fragments receive
 * a conservative discipline parent rather than an invented technical hierarchy.
 */
(function(g){"use strict";
 const db=g.KENTZO_NOTES;if(!db||!Array.isArray(db.topics))return;
 const rules={
 economics:[
 ["Consumer Theory",/\b(?:indifference|budget constraint|budget line|consumer (?:choice|preferences?|surplus|equilibrium|behavior)|utility|marginal rate of substitution|MRS\b|income effect|substitution effect|giffen|inferior goods?|normal goods?|ordinal|cardinal|revealed preference|engels? curve|engel.s law|income elasticity|price elasticity of demand|diminishing marginal utility|marginal utility|law of diminishing marginal utility|intertemporal elasticity|intertemporal choice|consumption|elasticity of substitution|consumer optimum)\b/i],
 ["Producer Theory",/\b(?:production function|cobb.douglas|isoquant|isocost|marginal product|average product|total product|factor[s]? of production|return[s]? to scale|diseconomies of scale|economies of scale|economies of scope|economies of density|marginal rate of technical|MRTS|MPK\b|MPL\b|labor productivity|production possibility|short run|long run|fixed cost|variable cost|marginal cost|average fixed cost|average variable cost|average total cost|ATC\b|AFC\b|AVC\b|total cost|economic profit|accounting cost|economic cost|implicit cost|explicit cost|cost minimization|profit maximization|output maximization|diminishing marginal product|law of diminishing returns|sunk cost|shut.?down point|break.even point|cost curves?)\b/i],
 ["Game Theory",/\b(?:game theory|game theoretic|Nash\b|dominant strateg|dominated strateg|mixed strateg|pure strateg|best response|battle of the sexes|prisoner.s dilemma|coordination game|credible threat|credible commitment|backward induction|grim trigger|folk theorem|repeated game|sequential game|simultaneous game|Bayesian game|signaling game|subgame perfect|subgame|extensive form|payoff|strategic game|mechanism design|zero.sum|non.zero.sum|non.cooperative|cooperative game|trigger strategy|perfect Bayesian|auction theory|cheap talk|equilibrium refinement|Markov perfect|trembling hand|tit.for.tat)\b/i],
 ["Industrial Organization",/\b(?:industrial organi|Cournot|Bertrand|Stackelberg|dominant firm|price leadership|limit pricing|predatory pricing|entry deterrence|horizontal integration|vertical integration|capacity commitment|antitrust|Herfindahl|HHI\b|concentration ratio|two.sided market|platform economics|winner.takes.all|kinked demand|collusion|cartel|barriers? to entry|market conduct|market performance|market power|network effects?|switching costs?|customer lock.in|contestable markets?|price discrimination|oligopol|monopson|monopol|market structure|price maker|markup|Lerner index|price taker|monopolistic competition|economic moat|merger control|Bertrand paradox|prisoners? dilemma in oligopoly)\b/i],
 ["Behavioral Economics",/\b(?:prospect theory|loss aversion|endowment effect|anchoring|framing effect|framing bias|reference points?|present bias|bounded rationality|status quo bias|availability heuristic|hindsight bias|confirmation bias|gambler.s fallacy|herding|herd behavior|mental accounting|hyperbolic discount|nudge|cognitive bias|behavioral economic|decision under uncertainty|rank.dependent utility|regret theory|probability weighting|expected utility theory|time preference|sunk.cost fallacy)\b/i],
 ["Market Failure & Welfare Economics",/\b(?:market failure|externalit|Pigouvian|Coase theorem|private cost|social cost|private benefit|social benefit|public goods?|club goods?|common.pool|free.rider|tradable permit|cap.and.trade|deadweight loss|welfare economic|Pareto (?:optimal|improvement|efficien)|producer surplus|consumer surplus|total surplus|efficiency loss|negative external|positive external|market inefficiency|government failure|merit goods|demerit goods|Tragedy of (?:The )?Commons|Asymmetric Information|information asymmetry|adverse selection|moral hazard|public economics)\b/i],
 ["Monetary Economics",/\b(?:money supply|money multiplier|money demand|M0\b|M1\b|M2\b|M3\b|interest rate|interest rates|policy rate|central bank|bank indonesia|federal reserve|fed funds|quantitative easing|quantitative tightening|monetary policy|monetarist|inflation target|reserve requirement|Taylor rule|McCallum rule|Fisher effect|Fisher equation|liquidity preference|liquidity trap|liquidity trap|yield curve control|repo rate|reverse repo|discount window|money creation|money neutrality|phillips curve|New Keynesian Phillips|inflation|deflation|deflasi|inflasi|stagflation|wage.price spiral)\b/i],
 ["International Economics",/\b(?:balance of payments|trade balance|BoP\b|current account|capital account|foreign exchange|exchange rate|currency appreciation|currency depreciation|currency peg|parity|PPP\b|purchasing power parity|currency value|exchange rate regime|Bretton Woods|plaza accord|Mundell.Fleming|IS.LM.BP|IS.LM.BP|Fleming model|triffin|international trade|comparative advantage|absolute advantage|Heckscher.Ohlin|stolper.samuelson|leontief paradox|international Fisher|tariff|free trade|trade agreement|NAFTA\b|USMCA\b|deglobalization|deglobalis|capital mobility|optimal currency area|international parity|trade restriction|exchange market|foreign currency|FEER\b|BEER\b|Balassa.Samuelson|interest rate parity|carry trade|bilateral exchange|exchange balance|foreign direct investment|FDI\b)\b/i],
 ["Macroeconomic Growth Theory",/\b(?:Solow|Harrod.Domar|Ramsey.Cass|Romer|endogenous growth|neoclassical growth|golden rule of capital|overlapping generations|OLG\b|growth theory|economic growth|human capital|AK model|capital accumulation|technology progress|growth accounting|steady.state growth|economic complexity|stagnation|secular stagnation|trickle.down)\b/i],
 ["Macroeconomic Models",/\b(?:IS.LM|AD.AS|AS.AD|aggregate supply|aggregate demand|DSGE|dynamic stochastic general|New Keynesian IS|Keynesian cross|real business cycle|RBC\b|business cycle|output gap|economic cycle|Lucas critique|Lucas paradox|fiscal multiplier|government spending multiplier|fiscal policy|fiskal|crowding out|tax multiplier|twin deficit|Ricardian equivalence|GDP\b|GNI\b|GNP\b|GDP deflator|CPI\b|consumer price index|national income|expenditure approach|income approach|output approach|unemployment|non.accelerating|NAIRU|non.farm payroll|NFP\b|Sahm rule|Okun|poverty|income distribution|Lorenz curve|Gini coefficient|aggregate expenditure|fiscal deficit|fiscal surplus|tax incidence|say.s law|supply.side economic|demand.side economic)\b/i],
 ["Economic Thought",/\b(?:Adam Smith|Karl Marx|Keynesian|Post.Keynesian|Neo.Classical|classical economic|economic thought|political economy|Laissez.Faire|Wealth of Nations|economic liberalization|institutional theor|Joseph Schumpeter|economic history|capitalism|socialism|mercantilism|Austrian school)\b/i],
 ["Microeconomics",/\b(?:demand curve|supply curve|law of demand|law of supply|demand\b|supply\b|market equilibrium|market clearing|price floor|price ceiling|shortage|surplus|minimum wage|elasticit|subsidies|economic incidence|price controls?|ceteris paribus|opportunity cost|scarcity|economic choice|goods|services|market mechanism|marginal analysis|rational choice)\b/i]
 ],
 finance:[
 ["Accounting",/\b(?:ledger|general journal|journal entries|journal entry|chart of accounts|double.entry|trial balance|balance sheet|income statement|cash flow statement|statement of cash flow|statement of changes in equity|financial statement|adjusting entr|closing entr|accounting cycle|accounting equation|accounting principle|accrual|cash accounting|bookkeeping|financial reporting|account payable|accounts? payable|account receiv|accounts? receiv|accounting policy|accounting standard|revenue recognition|expense recognition|revenue\b|expense\b|cost of goods sold|COGS\b|gross profit|net income|earnings|operating income|asset revaluation|asset turnover|asset impairment|liabilit|share capital|share premium|treasury stock|retained earnings|inventory|FIFO\b|LIFO\b|weighted average cost|deprecia|amortiz|impairment|goodwill|consolidat|business combination|purchase price allocation|equity method|matching principle|IFRS\b|IAS\b|PSAK\b|GAAP\b|audit|auditability|other comprehensive income|OCI\b|amortized cost|fair value accounting|deferred tax|tax assets?|tax liabilit|lease accounting|earnings management|big bath|earnings quality|asset revaluation|PPE\b|property plant|capital expendit|capitalization|research expenditure|development cost|impairment loss|net book value|revaluation reserve|financial ratios|profit margin|accounts ledger|statement of equity|post.closing|adjusted trial|unadjusted trial|inventor[yies] turnover)\b/i],
 ["Statistics",/\b(?:statistics?|descriptive statist|inferential statist|variance\b|covariance\b|varians|covarians|standard deviation|standard deviasi|standard error|probabilit|probability distribution|normal distribution|Gaussian|binomial distribution|poisson|uniform distribution|sampling|sample size|skewness|kurtosis|fat tails|p.value|p-value|hypothesis test|confidence interval|confidence level|statistical inference|t.statistic|f.statistic|quantile|percentile|moment[s]?|correlation\b|correlation coefficient|expected value|random variable|geometric distribution|chi.square|Bayesian statistics|conditional probability)\b/i],
 ["Econometrics",/\b(?:econometric|regression|OLS\b|ordinary least squares|least squares|heteroskedastic|homoskedastic|autocorrelat|endogeneity|instrumental variables?|IV regression|time series|AR\b|ARMA\b|ARIMA\b|ARCH\b|GARCH\b|EGARCH\b|EWMA\b|autoregress|autoregressive|moving average model|stationarity|unit.root|co.integration|cointegration|Johansen|Granger causal|Kalman filter|forecast model|predictive regression|variance ratio|residual|white noise|Brownian|Wiener|stochastic process|Monte Carlo|Markov|HMM\b|hidden markov|lagged variable|heteroscedastic|econometric model)\b/i],
 ["Mathematics",/\b(?:mathematics?|Lagrange|Lagrangian|optimization|calculus|differential equation|linear algebra|matrix|eigenvalue|eigenvector|irreducibilit|recurrence|Bessel|derivative math|mathematical|nonlinear|stochastic calculus|derivative of|integration|integral|convexity of function|concavity of function|linear programming|discrete mathematics)\b/i],
 ["Banking",/\b(?:bank|banking|commercial bank|investment bank|central bank|credit card|Visa Credit|Mastercard|American Express|card network|deposit insurance|FDIC\b|deposit[s]?\b|loan|mortgage|credit default|credit rating|credit spread|credit risk|capital adequacy|CET1\b|AT1\b|tier 1|tier 2|Basel\b|risk.weighted asset|RWA\b|LCR\b|NSFR\b|non.performing|NPL\b|expected credit loss|ECL\b|reserve requirements?|fractional reserve|bank run|bank failure|CAR1|CAR\b|CASA\b|prudential|liquidity coverage|capital conservation buffer|subordinated loan|RTGS\b|real.time gross|SWIFT\b|capital requirement|countercyclical buffer|interbank|sukuk ritel|ORI\b|SBR\b|SR\b|ST\b)\b/i],
 ["Taxation",/\b(?:tax\b|taxation|tax treaty|tax haven|tax residence|transfer pricing|withholding|indonesian taxation|united states taxation|tax avoidance|tax evasion|profit shifting|tax credit|tax deduction|tax planning|Pillar One|Pillar Two|minimum global tax|thin capitaliz|base erosion|OECD pillar|controlled foreign corporation|permanent establishment|customs duty|stamp duty|VAT\b|Value Added Tax|corporate tax|income tax|tax exemptions?|double taxation|arm.s length)\b/i],
 ["Risk Management",/\b(?:risk management|VaR\b|value at risk|expected shortfall|conditional value at risk|CVaR\b|tail risk|downside deviation|stress test|scenario analysis|risk aversion|risk.attitude|risk seeking|risk neutral|risk premium|risk.adjusted|risk parity|Risk.on|risk.off|R.A.R.O.C.|RAROC\b|volatility decay|volatility clustering|risk metric|risk exposure|risk assessment|maximum drawdown|Sharpe|Sortino|Treynor|Jensen.s alpha|alpha coefficient|beta coefficient|Calmar ratio|MAR\b|managed account ratio|portfolio risk|volatility index|VIX\b|market risk|liquidity risk|downgrade risk|counterparty risk|credit risk|expected credit loss|exposure at default|probability of default|PD\b)\b/i],
 ["Derivatives",/\b(?:options?|option pricing|greeks?|Delta\b|Gamma\b|Theta\b|Vega\b|Rho Greek|derivatives?|futures?\b|forward[s]?\b|swap[s]?\b|swaption|put\b|call\b|straddle|strangle|iron condor|butterfly spread|binomial option|Black.Scholes|Heston|SABR\b|implied volatility|volatility skew|vol of vol|variance swap|cash.secured|covered call|hedging|dynamic hedg|delta hedg|gamma hedg|exotic option|lookback|Bermudan|American option|European option|perpetual contracts?|contract for difference|CFD\b|options strategy|option strategy|synthetic option|strike price|time decay|expiry|exercise price)\b/i],
 ["Bond Valuation",/\b(?:bond[s]?\b|obligasi|coupon|duration|modified duration|macaulay|convexity\b|yield curve|bond yield|forward rate|spot rate|fixed income|floating rate note|zero.coupon|perpetual bond|perpetual debt|term structure|credit default swap|CDS\b|CDO\b|CLO\b|MBS\b|collateralized debt|mortgage.backed|asset.backed|securitization|structured credit|interest rate model|Vasicek|Cox.Ingersoll|Nelson.Siegel|shadow rate|Wu.Xia|yield to maturity|yield to call)\b/i],
 ["Portfolio Theory",/\b(?:portfolio|Markowitz|efficient frontier|mean.variance|asset allocation|diversification|Black.Litterman|capital market line|CML\b|security market line|SML\b|minimum variance|risk budget|rebalanc|factor portfolio|liability.driven investing|liability driven invest|portfolio construction|target return|tactical asset allocation|strategic asset allocation|capital asset pricing|CAPM\b|APT\b|arbitrage pricing theory|stochastic discount factor|SDF\b|Carhart|Fama.French|factor models?|5.factor|three.factor|three factor|four.factor)\b/i],
 ["Equity Valuation",/\b(?:equity valuation|share valuation|stock valuation|stock price|stock \(.*\)|DCF\b|discounted cash flow|free cash flow|FCFE\b|FCFF\b|dividend discount|DDM\b|Gordon Growth|GGM\b|residual income|P\/E\b|P\/BV\b|P\/S\b|P\/B\b|EV\/EBITDA|EV.to.EBITDA|price.to.earnings|price.to.book|price.to.sales|enterprise value|terminal value|WACC\b|cost of capital|return on equity|return on assets|ROE\b|ROA\b|ROIC\b|ROCE\b|ROI\b|financial valuation|intrinsic value|earnings per share|EPS\b|shareholder value|dividend growth|stock valuation|valuation ratio|valuation multiple|comparable company|multiples valuation|fair value of equity|DCF model|free cash flow valuation|FCF\b|capital asset pricing model)\b/i],
 ["Corporate Finance",/\b(?:capital structure|capital budgeting|NPV\b|IRR\b|present value|net present value|payback|discounted payback|internal rate|capital expendit|working capital|Modigliani.Miller|MM theory|pecking order|trade.off theory|mergers?|acquisitions?|takeover|M&A\b|corporate restructuring|debt restructuring|management buyout|MBO\b|leveraged buyout|LBO\b|cost of equity|cost of debt|debt to equity|debt.to.equity|payout ratio|dividend policy|dividend distribution|corporate leverage|treasury management|funding cost|equity issuance|preferred stock|share buyback|capital raising|funding model|startup funding|valuation allowance|cost of financing|capital expenditure)\b/i],
 ["Investment Strategy",/\b(?:invest(?:ment|or|ing)|trading strateg|market neutral|hedge fund|private equity|venture capital|VC\b|REIT\b|REITs\b|ETF\b|mutual funds?|index funds?|DCA\b|dollar.cost averaging|lump.sum|momentum|factor investing|fund management|prop trading|proprietary trading|short selling|carry trade|liquidity provider|order book|market maker|price discovery|market microstructure|volatility trading|technical analysis|ICT strateg|high.frequency trading|HFT\b|dark pool|RFQ\b|high.water mark|hurdle rate|performance fee|redemption fee|managed account|foreign direct investment|FDI\b|funding rate|capital market|wealth management|asset management|real estate invest|yield farming)\b/i],
 ["Financial Markets",/\b(?:capital market|money market|market cap|stock market|bond market|finance\b|financial markets?|equity market|interest rate|currency market|liquidity|brokerage|arbitrage|sukuk|federal reserve|market structure|international swap|foreign exchange|forex|asset pricing|commodities market)\b/i]
 ],
 crypto:[
 ["Bitcoin",/\b(?:Bitcoin|BTC\b|UTXO|BIP[s]?\b|taproot|script.hash|pubkey.hash|pay.to.script|pay.to.pubkey|OP_[A-Z0-9_]+|Schnorr|nonce block|coinbase|halving|bitcoin core|proof.of.work|sha.256|block reward|bitcoin script|P2PKH|P2SH|P2TR|lighting network|lightning network|mempool bitcoin)\b/i],
 ["Ethereum",/\b(?:Ethereum|ETH\b|EVM\b|Geth|beacon chain|blob transaction|prysm|lighthouse|smart contract ethereum|gas fees ETH|EIP\b|ERC.20|ERC.721|sharding ethereum|crosslinks|validator committee|Eigenlayer|liquid restak|rollup ethereum)\b/i],
 ["Solana",/\b(?:Solana|Sealevel|Gulf Stream|Turbine|Archivers|Pipeline in context of solana)\b/i],
 ["Avalanche",/\b(?:Avalanche|AVAX\b|Subnet AVAX)\b/i],
 ["Polkadot",/\b(?:Polkadot|DOT protocol|BABE\b|collators|nominators|Polkadot bridge)\b/i],
 ["NEAR Protocol",/\b(?:NEAR\b|Nightshade|chunk only producer|adaptive finality|Wasm.Based)\b/i],
 ["Sui",/\b(?:Sui\b|single.writer|Tusk Sui)\b/i],
 ["Aptos",/\b(?:Aptos|Block.STM)\b/i],
 ["Internet Computer (ICP)",/\b(?:ICP\b|Motoko|Canister|Internet Identity|Chain Key|Distributed Key Generation)\b/i],
 ["Chainlink",/\b(?:Chainlink|LINK Oracle|Watchdog.s Chainlink|Oracle Data Validation|Super.linear Staking)\b/i],
 ["Arbitrum",/\b(?:Arbitrum|ARB\b|AnyTrust|Arbitrum Nova)\b/i],
 ["Hedera",/\b(?:Hedera|HBAR\b|Hashgraph)\b/i],
 ["Stellar",/\b(?:Stellar|XLM\b|Stellar Consensus|Velo)\b/i],
 ["XRP Ledger",/\b(?:Ripple|XRP\b|RCA\b)\b/i],
 ["TRON",/\b(?:TRON\b|TRX\b)\b/i],
 ["Litecoin",/\b(?:Litecoin|LTC\b)\b/i],
 ["Cosmos",/\b(?:Cosmos\b|Tendermint)\b/i],
 ["Decentralized Finance (DeFi)",/\b(?:DeFi\b|DEX\b|AMM\b|yield farming|liquidity pool|liquidity pools|decentralized order book|staking|liquid staking|liquidity mining|perpetual|tokenized yield|Pendle|lending protocol|uniswap|aave|arbitrage crypto|cryptocurrency arbitrage|funding rates?|on.chain trading|token swap)\b/i],
 ["Blockchain Security",/\b(?:sybil|51%|51.percent|denial of service|DDoS|DoS\b|attack|private key|public key|cryptograph|Merkle|hash rate|hashrate|hash tree|hash.based|digital signature|consensus security|proof of work|proof of stake|key derivation|seed phrase|wallet address|password.based|malicious|blockchain security|secret sharding|ECDSA|secp256k1|cryptographic)\b/i],
 ["Blockchain Architecture",/\b(?:blockchain|block.?DAG|DAG\b|modular|layer 0|layer 1|layer 2|rollup|mainnet|testnet|tesnet|block producer|validator|sharding|consensus|node[s]?\b|gas fees?|gas fee|transaction fee|transaction lifecycle|interoperability|cross.chain|bridge|faucet|genesis block|transaction malleability|smart contract|solidity|Move Programming|Rust Programming|blockchain programming|oracle|decentraliz|proof.of.authority|block finality|immutab|chunking|sequencer|cryptocurrency|whitelist|permissionless|governance|dao\b)\b/i],
 ["Crypto Markets",/\b(?:tokenomics|token unlock|token supply|circulating supply|onchain metrics|on.chain metrics|crypto market|market crypto|tokenization|fully diluted value|futures? crypto|spot crypto|exchange crypto|venture capital crypto|ICO\b|IDO\b|IEO\b|airdrops?|NFT[s]?\b|token presale|altcoin|cryptocurrency markets?)\b/i]
 ],
 others:[
 ["Business Model Canvas",/\b(?:customer segments?|customer relationships?|value propositions?|key activities|key partnerships?|key resources?|business model canvas|channels\b|cost structures?|revenue streams?)\b/i],
 ["Corporate Governance",/\b(?:board of commissioners|board committees|governance committee|nomination committee|remuneration|compensation committee|sustainability committee|ESG committee|risk committee|corporate governance|stakeholder theory|corporate board|governance)\b/i],
 ["Human Resource Management",/\b(?:human resource|HRM\b|HR analytics|talent management|motivation|two.factor theory|theory X\b|theory Y\b|hierarchy of needs|expectancy theory|equity theory|goal.setting|incentives?|recruitment|employee|labor relations|human relations|organizational behavior|Maturity.Immaturity)\b/i],
 ["Artificial Intelligence",/\b(?:artificial intelligence|AI\b|AGI\b|deep learning|machine learning|neural network|BERT\b|GPT\b|generative pre.trained|neurosymbolic|symbolic AI|back propagation|backpropagation|transformers?|language model|pre.processing|training model|model training|data collection|model evaluation|deepseek|Sahara AI|robot|humanoid|LLM\b|large language model|natural language|supervised learning|unsupervised learning)\b/i],
 ["Marketing",/\b(?:marketing|sales\b|consumer behavior|marketing research|quantum marketing|digital marketing|marketing management|advertising|brand|customer acquisition|communications|marketing communications|market research)\b/i],
 ["Strategic Management",/\b(?:strategic management|SWOT\b|PESTEL\b|porter|business planning|business idea|innovation|change management|agile management|competitive advantage|corporate strategy|lean management|business model|business research|entrepreneurship|organizational restructuring|MSME\b|micro.small.medium)\b/i],
 ["Operations Management",/\b(?:operations management|supply chain|logistics|quality management|total quality|operations research|production management)\b/i],
 ["Management Theory",/\b(?:management fundamental|management science|administrative management|bureaucratic management|scientific management|classical management|behavioral management|contingency theory|contigency|systems theory|evidence.based management|learning organization|knowledge management|leadership|transactional leadership|transformational leadership|decision model|management theory|contemporary management|project management|social innovation management)\b/i],
 ["Business Law",/\b(?:law of|law\b|contract|perdata|tort|agraria|humaniter|perseroan terbatas|legal regulation|cooperative|coorperative|corporate law|corporation law|law of contract)\b/i],
 ["Environmental Studies",/\b(?:hydrogen|hidrogen|steam methane|LNG\b|green energy|El Niño|La Niña|climate|environmental|sustainab|ecology)\b/i],
 ["Political Science",/\b(?:totalitarian|feudal|feodalisme|government|political system|politics|political theory)\b/i],
 ["Digital Technology",/\b(?:firewall|information system|digital business|internet|IoT\b|hardware|software|cyber|network security|app marketplace|IT\b)\b/i]
 ]
 };
 const roots=new Set([
 "consumer theory","producer theory","game theory","industrial organization","behavioral economics","microeconomics","macroeconomics","economics","finance","accounting","statistics","econometrics","mathematics","banking","taxation","risk management","derivatives","bond valuation","portfolio theory","equity valuation","corporate finance","investment strategy","financial markets",
 "bitcoin","ethereum","solana","avalanche","polkadot","near protocol","sui","aptos","hedera","tron","litecoin","cosmos","blockchain","crypto","cryptocurrency","defi","decentralized finance (defi)","blockchain security","blockchain architecture","crypto markets",
 "artificial intelligence","ai","agi","business model canvas (bmc)","corporate governance","human resources management","human resource management","marketing","management","management fundamentals","operations management","strategic management","business law","environmental studies","political science","digital technology"
 ]);
 const canon=s=>String(s||"").trim().replace(/\s+/g," ").toLowerCase();
 const specific={
 "ledger":"Accounting","general ledger":"Accounting",
 "indifference curve":"Consumer Theory",
 "general journal":"Accounting","double entry":"Accounting",
 "accountant":"Accounting","income statement":"Accounting",
 "balance sheet":"Accounting","account receivable":"Accounting",
 "account receiveable":"Accounting","weighted average":"Accounting",
 "cash flow statement":"Accounting","trial balance":"Accounting",
 "chart of accounts":"Accounting","nash equilibrium":"Game Theory",
 "mixed strategy":"Game Theory","pure strategy":"Game Theory",
 "ceteris paribus":"Microeconomics","opportunity cost":"Microeconomics",
 "money supply":"Monetary Economics",
 "irr":"Corporate Finance","npv":"Corporate Finance",
 "variance":"Statistics","covariance":"Statistics",
 "standard deviation":"Statistics","p-value":"Statistics",
 "bertrand model":"Industrial Organization","cournot model":"Industrial Organization",
 "stackelberg model":"Industrial Organization",
 "efficient frontier":"Portfolio Theory",
 "CAPM":"Portfolio Theory","economic incidence":"Public Economics",
 "financial accounting":"Accounting",
 "consumer theory":"", "producer theory":"", "game theory":"", "accounting":"",
 "key partnerships":"Business Model Canvas",
 "customer relationships":"Business Model Canvas",
 "customer segments":"Business Model Canvas",
 "value propositions":"Business Model Canvas",
 "operating expenses":"Accounting",
 "market cap":"Financial Markets",
 "indifference curves":"Consumer Theory",
 "capital asset pricing model (capm)":"Portfolio Theory",
 "capital asset pricing models (capm)":"Portfolio Theory",
 "introduction to capital asset pricing model":"Portfolio Theory",
 "price-to-earnings ratio":"Equity Valuation",
 "price-to-book value ratio":"Equity Valuation",
 "variance swaps":"Derivatives",
 "efficient market hypothesis":"Market Efficiency",
 "random walk hypothesis":"Market Efficiency",
 "hypothesis twin deficits":"Macroeconomic Models",
 "government failure":"Market Failure & Welfare Economics",
 "market failure":"Market Failure & Welfare Economics",
 "adverse selection":"Market Failure & Welfare Economics",
 "sequential games":"Game Theory",
 "simultaneous games":"Game Theory",
 "repeated games":"Game Theory",
 "dominant strategy":"Game Theory",
 "dominated strategy":"Game Theory",
 "best response":"Game Theory",
 "pure strategy":"Game Theory",
 "mixed strategy":"Game Theory",
 "stackelberg model":"Industrial Organization",
 "futures":"Derivatives",
 "free cash flow to firm":"Equity Valuation",
 "public economics":"Market Failure & Welfare Economics",
 "cpi":"Macroeconomic Models",
 "monte carlo simulation":"Econometrics",
 "game theory basics":"Game Theory",
 "profit maximization":"Producer Theory",
 "expected utility theory":"Consumer Theory",
 "gross domestic product":"Macroeconomic Models",
 "gross national product":"Macroeconomic Models",
 "sui":"", "solana":"", "bitcoin":"", "ethereum":""
 };
 const fallback={economics:"Economics",finance:"Finance",crypto:"Blockchain & Cryptocurrency",others:"Interdisciplinary Studies"};
 // Contextual overrides catch terse source titles and protect technical
 // concepts from broad words like "assets", "options" or "interest".
 const precision={
 economics:[
 ["Game Theory",/\b(?:sequential games?|simultaneous games?|repeated games?|pure strategies?|mixed strategies?|non.cooperative games?|dominated strategies?|dominant strategies?|best responses?|coordination games?|battle of sexes|prisoner|credible|subgame|trigger strateg|folk theorem|backward induction|Bayesian games?|payoff matrices?|zero.sum games?|non.zero.sum games?|grim trigger|discount factor in game|strategic games?|mechanism design)\b/i],
 ["Consumer Theory",/\b(?:Slutsky|Engel\b|marginal propensity to consume|MPC\b|permanent income hypothesis|life.cycle hypothesis|intertemporal elasticity|IES\b|marginal rate of substitution|MRS\b|consumer preference|preference\b|ordinal utility|utility maximization|compensated demand|Hicksian demand|Marshallian demand|Edgeworth Box|contract curve)\b/i],
 ["Producer Theory",/\b(?:MC\b|AC\b|AFC\b|AVC\b|MPL\b|MPK\b|Cobb.Douglas|short.run|long.run|return to scale|profit maximation|output maximation|rate of technical substitution|isocost|isoquant|capital accumulation rule|production possibility|CES\b|marginal efficiency of capital)\b/i],
 ["Industrial Organization",/\b(?:monopoly\b|oligopoly\b|perfect competition|monopsony|cartel\b|Collusive|Bertrand|Cournot|Stackelberg|market stucture|market structure|double marginalization|Lerner|markup|monopolistic competition|price maker|price taker)\b/i],
 ["Market Failure & Welfare Economics",/\b(?:welfare theorems?|first fundamental theorem|second fundamental theorem|Rawls|utilitarian|social welfare|welfare function|Pareto|Parreto|Pigou|Coase|externalit|deadweight loss|public economics|information asymmetry|adverse.selection|adverse gselection|signaling theory|incentive contract|hidden action|hidden information|moral hazard|principal.agent|agency theory|Arrow.Debreu|general equilibrium|equilibrium theory|theorem of welfare|public goods|club goods)\b/i],
 ["International Economics",/\b(?:currency|rupiah|kuwait|peg[s]?\b|revaluation currency|devaluation|trade agreement|trade flows|import\b|export\b|ekspor|impor|cross.elasticity in trade|j curve|Marshall.Lerner|dornbusch|exchange|international payment|interest rate parity|currency war|CIPS\b|currency trilemma|trilemma|law of one price|Gresham|gesham|FDI\b|real wages|NAFTA|USMCA|triffin|original sin|money balance external|primary income|secondary income|service balance|unilateral transfer|trade balance|income balance|FEER|BEER|foreign exchange)\b/i],
 ["Monetary Economics",/\b(?:monetary|money|M0\b|M1\b|M2\b|M3\b|monetaris|MMT\b|quantity theory|liquidity preference|fisher index|Fisher effect|fisher equation|central bank|seigniorage|repo\b|QT\b|QE\b|flight to safety|interest rate|inflation|deflation|Taylor rule|Laubach.Williams|phillips curve|curve of phillips|modern monetary theory)\b/i],
 ["Macroeconomic Models",/\b(?:recession|depression|counter.cyclical|stabilizers?|business cycle|GDP\b|GNI\b|GNP\b|CPI\b|consumer price index|producer price index|fiscal|tax shield|policy fiskal|tax policy|gross domestic product|gross national product|Harrod|IS.LM|DSGE|dynamic.general|static.general|AK model|economics complexity|Hodrick.Prescott|Ramsey.rule|ICOR|growth model|income approach|output approach|fiscal contraction)\b/i],
 ["Macroeconomic Growth Theory",/\b(?:economic growth|growth neoklasik|growth accounting|growth endogen|neoclassical growth|solow|romer|ramsey.cass|capital accumulation|theory of growth|model AK\b|AK model\b)\b/i],
 ["Economic Thought",/\b(?:paradox|invisible hand|Adam Smith|David Ricardo|Karl Marx|John Maynard Keynes|Communist Manifesto|the Wealth of Nations|Theory of Moral Sentiments|natural liberty|labour theory of value|labour embodied|Austrian economic|Monetarism|mercantilism|classical economic|Marxian|capitalism|post.keynesian|neoclassical econom|new classical|Laissez.Faire|Cantillon|hegemoni)\b/i],
 ["Microeconomics",/\b(?:elasticit|price floor|price ceiling|fixed\b|variable\b|consumer price|producer price|supply\b|demand\b|shortage|surplus|tarif|tariff|price\b|income\b|cross\b|goods\b|scarcity|opportunity cost|market equilibrium|market equilibrium|point elasticity)\b/i]
 ],
 finance:[
 ["Derivatives",/\b(?:variance swap|implied volatility|initial volatility|local volatility|smile|skew|vol of vol|fixed strike|floating strike|Opsi\b|options?\b|option pricing|swaps?\b|futures?\b|forwards?\b|call option|put option|Greeks\b|theta\b|vega\b|rho\b|gamma\b|delta\b|Black.Scholes|Merton Model|Cox.Ross.Rubinstein|CRR\b|binomial tree|barrier\b|asian\b|compound\b|digital\b|Heston|SABR|XVA\b|CVA\b|DVA\b|FVA\b|FBA\b|FCA\b|KVA\b|volatility modelling|volatility modeling|volatility model|volatility skew|volatility smile)\b/i],
 ["Accounting",/\b(?:first.in.first.out|last.in.first.out|straight.line|declining balance|double declining|trial balance|adjusting entries|closing entries|current liabilities|non.current liabilities|cash\b|cash equivalents|AOCI\b|APIC\b|FVOCI\b|FVTPL\b|IFRS|IAS\b|PPE\b|payables?|receivables?|intangible assets?|liabilities|franchise rights|licenses|trademarks|patents|consolidation|financial statements|revenue recognition|cost accounting|management accounting|cost structures?|inventory|expense\b|expenditure\b|CapEx\b|Opex\b|capital expenditure|operational expenditure|liability\b|balance sheet|earnings management|purchase price allocation|accounting principles|profitability index)\b/i],
 ["Econometrics",/\b(?:GARCH|ARIMA|ARMA|ARCH\b|autoregression|autoregressive|ordinary least square|OLS\b|Homoskedastic|Heteroskedastic|hypothesis testing|statistical model|random walk|autocorrelation|moving average|mean reversion|forecast\b|time.series|econometric)\b/i],
 ["Statistics",/\b(?:geometric mean index|covariance|variance\b|statistical inference|statistics|standard deviation|skew\b|distribution|standard error|fat tails|right.skewed)\b/i],
 ["Corporate Finance",/\b(?:equity restructuring|financial restructuring|stock dilution|dilution|dividend\b|dividend capture|preferred|saham preferen|lock.up|clawback|capital\b|NPV\b|IRR\b|cost of capital|leverage|profitability index|dividend buyback|cash conversion cycle|working capital|capital budget|debt overhang|SAFE\b|simple agreement for future equity|fully diluted|management fee|hurdle|stock options employee)\b/i],
 ["Bond Valuation",/\b(?:yield\b|curve|duration|convexity|interest rate structure|perpetual|Mortages.backed|overcollateralization|MBS\b|BBGA|Global Agg|SOFR\b|secured repo|repo\b|security yield|shadow rate|Wu.Xia|Vasicek|CIR\b|Laubach.Williams|CDO\b|CLO\b|fixed income|forward rate)\b/i],
 ["Risk Management",/\b(?:credit spreads|default probability|EAD\b|PD\b|LGD\b|expected loss|default risk|volatility\b|risk\b|tail\b|stress testing|downside|tracking error|information ratio|bid.ask analysis|time.to.liquidate|market depth|excess spread|reserve account)\b/i],
 ["Equity Valuation",/\b(?:market cap|market capitalization|valuation\b|asset pricing|earnings\b|EPS\b|EBITDA|WACC\b|ROIC\b|ROA\b|ROE\b|P\/E|PBV\b|P\/B|intrinsic|comparable analysis|income approach|Gordon Growth|stock to flow|S2F|cash flow valuation|free cash flow|DFC\b|DCF\b|value investing|return on (?:equity|asset))\b/i],
 ["Banking",/\b(?:banks?\b|banking|deposit[s]?\b|cadangan wajib|giro\b|credit|loan|mortgage|Basel|Tier 2|CoCos|collateral|discount window|subordinat|NPL\b|capital adequacy|GWM\b|countercyclical capital|liquidity savings)\b/i],
 ["Taxation",/\b(?:bea cukai|tax\b|taxation|perpajakan|exemption method|residence|source principle|treaty shopping|amount A|pillars?|thin capitallization|tax avoidance|withholding)\b/i],
 ["Portfolio Theory",/\b(?:Capital Allocation Line|beta\b|alpha\b|APT\b|CAPM\b|Arbitrage Pricing|Fama|French \d|Carhart|Markowitz|efficient frontier|factor investing|risk aversion|risk.seeking|Portfolio|VaR\b|risk premium|asset allocation)\b/i],
 ["Investment Strategy",/\b(?:ETF\b|ETN\b|ETP\b|Hedge Funds?|trading\b|ICT\b|order book|OTC\b|market micro|market depth|market conduct|stock \(|Stock\b|IHSG\b|MSCI\b|price discovery|investment\b|DCA\b|index fund|investor|A.Book|B.Book|cryptomarket|managed account|proprietary trading|copy trade|FX market)\b/i],
 ["Financial Markets",/\b(?:Capital Market|Financial Market|Cash Equivalents|liquidity\b|Financial management|Financial Instruments?|Banking Economics|yield\b|broker|market maker|marketable securities)\b/i]
 ],
 crypto:[
 ["Blockchain Consensus",/\b(?:DPoS\b|PoSA\b|PoS\b|PoW\b|proof.of.staked|proof.of.stake|proof.of.work|PBFT\b|practical byzantine|consensus\b|block producer|block reward|finality|Gossip protocol|difficulty target|mining pool|block reward|staking mechanism|validator selection|validator)\b/i],
 ["Blockchain Security",/\b(?:RIPEMD|SHA512|SHA.256|HMAC\b|wallet|seed\b|digital signature|tanda tangan digital|private key|public key|merke root|Merkle tree|Merkle proofs?|UTXO|malleability|SPV\b|Escrow multi sig|Tree\b|sybil|denial of service|cryptograph|MPC.AA|key derivation)\b/i],
 ["Crypto Market Analysis",/\b(?:Terra|token unlock|market crypto|hyperliquid 4M|crypto loses?|Trump effect|cryptowave|losses news|token supply|market capitalization|whitelist|faucet|CEX\b|trading crypto|technical crypto)\b/i],
 ["Crypto Protocols",/\b(?:LayerZero|Polygon|0G\b|2Z\b|DoubleZero|Plasma\b|Ondo|Origin trail|TokenFi|Fetch.Ai|Render\b|Doge\b|Dogecoin|ICP\b|Hyperliquid|Hyperliquid|Sahara AI|BitGo|Fireblocks)\b/i]
 ],
 others:[
 ["Artificial Intelligence",/\b(?:evaluation|monitoring|language model|data collection|model training|pre.processing|backpropagation|training model|generative|BERT|GPT|AGI|robot|AI\b)\b/i],
 ["Business Law",/\b(?:pembentukan kontrak|kontrak|tort|Law of|Perdata|perseroan|humaniter|agraria|regulation|Tilang)\b/i],
 ["Management",/\b(?:business research|business idea|introduction to management|Introduction to business|busniness|hybrid\b|formulation|management)\b/i]
 ]
 };
 const parentOf=(t)=>{
  const title=String(t.t||"").trim(),low=canon(title),field=t.f;
  if(!title||roots.has(low))return null;
  if(Object.prototype.hasOwnProperty.call(specific,low)){
   const p=specific[low];return p&&canon(p)!==low?p:null;
  }
  const precisionRules=precision[field]||[];
  for(const [parent,pattern] of precisionRules){
   if(pattern.test(title)&&canon(parent)!==low)return parent;
  }
  const cat=rules[field]||[];
  for(const [parent,regex]of cat){
   if(regex.test(title)&&canon(parent)!==low)return parent;
  }
  return fallback[field]||"Interdisciplinary Studies";
 };
 let withParent=0,rootCount=0;
 for(const row of db.topics){
  row.parentTopic=parentOf(row);
  if(row.parentTopic)withParent++;else rootCount++;
 }
 for(const item of db.uniqueTopics){
  item.parentTopic=parentOf(item);
 }
 db.parentTaxonomyVersion="2026-10-15/v1";
 db.parentTaxonomyCoverage={datedEntriesWithParent:withParent,rootEntries:rootCount,distinctTopicsWithParent:db.uniqueTopics.filter(t=>t.parentTopic).length,distinctRootTopics:db.uniqueTopics.filter(t=>!t.parentTopic).length};
 db.displayTitle=function(t){return t.parentTopic?t.parentTopic+" ("+t.t+")":t.t};
 })(window);
