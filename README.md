# BERT Market Intelligence — self-hosted template

This is a **sanitized template**, on a separate Git branch of the public GitHub repository. It does **not** contain the AFH personal wealth dashboard, personal account data, private API keys, or portfolio history.

## One-click install

Use the [Deploy with Vercel button](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffarrellalberth-hue%2Falberth%2Ftree%2Fbert-market-template&project-name=bert-market-intelligence&repository-name=bert-market-intelligence&env=APP_PASSWORD%2CCOOKIE_SECRET).

During deployment choose your OWN `APP_PASSWORD` (at least 12 chars) and a separate random `COOKIE_SECRET` (at least 32 unpredictable characters). Never reuse an exchange password as APP_PASSWORD.

1. Click Deploy with Vercel and connect **your own** GitHub and Vercel.
2. Enter your own `APP_PASSWORD` and `COOKIE_SECRET` in Vercel's secure Environment Variables form.
3. Deploy and open your personal `.vercel.app` domain.
4. Log in, choose an exchange, and enter your own **read-only** API key, secret, and passphrase (when required).
5. Click "Check balances". Never grant withdrawal or trading permissions.

## Exchanges

CCXT powers private connections (Binance, Bybit, OKX, Bitget, Kraken, Coinbase, KuCoin, Gate, MEXC, Hyperliquid and other CCXT-compatible exchanges). Individual exchanges may lack `fetchBalance` or `fetchPositions`, require IP whitelisting, or block Vercel regions. One deployment holds up to four exchange profiles in an encrypted, HttpOnly cookie on the owner’s browser. The keys are not stored in localStorage, public source, or Vercel runtime logs.

**Security limitations:** Cookie encryption protects keys at rest in browser cookies but this is a lightweight single-owner deployment, not a hardened multi-user credential vault. Set long random secrets; treat your deployed URL as private; enable Vercel Authentication/WAF if needed. Browser cookies can be cleared to discard stored connections. The deployment operator (your own Vercel account) controls the server secret. Password attempts are **not** rate-limited at application level. Financial data is read-only; no orders, deposits, withdrawals, or transaction-signing endpoints exist. Multi-exchange balances are quantities, not USD valuation.

## Market research data

- Coin Ramai: GeckoTerminal public pool data.
- Akumulasi: DEX buy/sell **transaction counts** for sampled pools, not evidence of institutional accumulation.
- Market Narrative: Sharpe Terminal public API.
- Market Scatter: Open Interest from user-selected exchange where CCXT bulk OI is available, with Bybit public OI as default; 7d/30d return estimates use CoinGecko market metadata if available and uniquely matched.
- Coin images: CoinGecko image links (unique symbol matching only).

This project has no affiliation with the exchanges or data providers. Public rate limits apply; free data can be stale or unavailable.

## Deploy via CLI (optional)

```bash
npm install
npx vercel
```

Do not put credentials in Git, URL query strings, screenshots, or client-side source.
