# Surf

Crypto and US equity market data from the [Surf Data API](https://docs.asksurf.ai/data-api/overview).

Base URL: `https://api.asksurf.ai`. Auth: `Authorization: Bearer sk-...`. Create a key in the AskSurf dashboard. Anonymous calls can spend 30 free credits per IP per day, but this plugin always sends the stored key.

The plugin covers the public OpenAPI routes under `/gateway/v1`, except deprecated `GET /gateway/v1/project/pulse`. There are no Surf webhooks.

| Group | Examples |
| --- | --- |
| `market` | price, fear and greed, rankings, liquidations |
| `exchange` | ticker, klines, depth, funding |
| `equity` | candles, filings, financial statements |
| `token` / `wallet` / `onchain` | holders, transfers, SQL |
| `search` | projects, tokens, news, wallets |
| `predictionMarket` | Polymarket and Kalshi reads |

List routes accept `limit` and `offset`. `limit` bounds come from each route. `from` and `to` must be sent together. Credits come back on `meta.credits_used`. A repeat of the same call within 3 minutes is free.

`400`, `401`, `402`, `404`, and `422` do not retry. `402` codes are `FREE_QUOTA_EXHAUSTED`, `PAID_BALANCE_ZERO`, and legacy `INSUFFICIENT_CREDIT`. `429` (`RATE_LIMITED`) retries up to 3 attempts and caps `Retry-After` at 60 seconds. `502`, `503`, and `504` retry once on GET only. POST and DELETE do not retry those, because a SQL query can bill.

Not implemented: hosted MCP OAuth, admin `X-Admin-Token`, and internal `X-Internal-Key`. No database entity: responses are live reads, and SQL job ids are returned to the caller to poll.

Live smoke, from the worktree root:

```bash
SURF_API_KEY='sk-...' pnpm --filter @corsair-dev/surf test
```

The live test reads fear and greed. That call spends credits.
