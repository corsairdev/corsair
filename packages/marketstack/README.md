# @corsair-dev/marketstack

Marketstack stock market data plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/marketstack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `currencies.list` | `marketstack.api.currencies.list` | `read` | List all currencies supported by the Marketstack API |
| `dividends.get` | `marketstack.api.dividends.get` | `read` | Retrieve historical dividend amounts and payment dates for one or more tickers |
| `eod.get` | `marketstack.api.eod.get` | `read` | Retrieve end-of-day (EOD) OHLCV data for one or more ticker symbols |
| `exchanges.get` | `marketstack.api.exchanges.get` | `read` | Retrieve exchange details by MIC, including location, status, and operational fields |
| `exchanges.list` | `marketstack.api.exchanges.list` | `read` | List or search the stock exchanges supported by Marketstack |
| `splits.get` | `marketstack.api.splits.get` | `read` | Retrieve historical stock split data for one or more ticker symbols |
| `tickers.get` | `marketstack.api.tickers.get` | `read` | Retrieve detailed ticker information including exchange, sector, and industry |
| `tickers.getEod` | `marketstack.api.tickers.getEod` | `read` | Retrieve historical end-of-day (EOD) price data for a specific ticker symbol |
| `tickers.getEodLatest` | `marketstack.api.tickers.getEodLatest` | `read` | Retrieve the most recent end-of-day (EOD) data available for a specific ticker symbol |
| `tickers.list` | `marketstack.api.tickers.list` | `read` | List or search the stock tickers supported by Marketstack |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/marketstack

## License

Apache-2.0
