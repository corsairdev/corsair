# @corsair-dev/coinmarketcap

CoinMarketCap plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/coinmarketcap
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cryptocurrency.info` | `coinmarketcap.api.cryptocurrency.info` | `read` | Static metadata for a cryptocurrency, such as its description, logo, website and social links, by CMC ID, slug, ticker or contract address |
| `cryptocurrency.listings` | `coinmarketcap.api.cryptocurrency.listings` | `read` | Rank every active cryptocurrency by market cap, price, volume or a percent change, with price, market cap and volume filters, paging and up to 120 quote currencies |
| `cryptocurrency.map` | `coinmarketcap.api.cryptocurrency.map` | `read` | Resolve tickers, or a page of the full asset list, to the stable CoinMarketCap IDs, names and slugs that every other call takes; it has no slug filter |
| `cryptocurrency.quotes` | `coinmarketcap.api.cryptocurrency.quotes` | `read` | Latest price, market cap, volume and percent changes for specific assets, by CMC ID, slug or ticker, in one or more quote currencies |
| `exchange.info` | `coinmarketcap.api.exchange.info` | `read` | Metadata for a centralised exchange, such as its description, logo, launch date and links, by CMC exchange ID or slug |
| `globalMetrics.quotes` | `coinmarketcap.api.globalMetrics.quotes` | `read` | Market-wide totals: total market cap and 24 hour volume, BTC and ETH dominance, and the count of tracked assets, pairs and exchanges |
| `key.info` | `coinmarketcap.api.key.info` | `read` | Plan and usage for the configured API key: the minute request limit, the monthly credit limit, and what is left today and this month |
| `tools.priceConversion` | `coinmarketcap.api.tools.priceConversion` | `read` | Convert an amount of one currency into another, optionally at a past timestamp; a ticker shared by several assets returns one result per asset |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/coinmarketcap

## License

Apache-2.0
