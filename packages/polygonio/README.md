# @corsair-dev/polygonio

US stock market data API for aggregates, snapshots, tickers and market status, exposed by Corsair.

## Install

```bash
pnpm add @corsair-dev/polygonio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `aggregates.bars` | `polygonio.api.aggregates.bars` | `read` | Read historical OHLC and volume bars for a ticker over a custom range and window size, with `next_url` paging |
| `aggregates.dailySummary` | `polygonio.api.aggregates.dailySummary` | `read` | Read one ticker's open and close for a date, with any pre-market and after-hours prices |
| `aggregates.marketSummary` | `polygonio.api.aggregates.marketSummary` | `read` | Read every US stock's OHLC and volume for one trading date, in a single page |
| `aggregates.previousDay` | `polygonio.api.aggregates.previousDay` | `read` | Read the previous trading day's open, high, low, close and volume |
| `market.exchanges` | `polygonio.api.market.exchanges` | `read` | List the known exchanges with their MICs, names and asset classes |
| `market.holidays` | `polygonio.api.market.holidays` | `read` | Read upcoming market holidays with their closed or early-close hours |
| `market.status` | `polygonio.api.market.status` | `read` | Read the current trading status of the US exchanges, currency markets and index groups |
| `snapshots.movers` | `polygonio.api.snapshots.movers` | `read` | Read the top 20 gainers or losers in the US stock market |
| `snapshots.snapshot` | `polygonio.api.snapshots.snapshot` | `read` | Read a ticker's latest snapshot: last day and minute bars, previous day, and the change so far today |
| `tickers.list` | `polygonio.api.tickers.list` | `read` | List ticker symbols filtered by type, market, exchange, CUSIP, CIK or name, with `next_url` paging |
| `tickers.overview` | `polygonio.api.tickers.overview` | `read` | Read one ticker with its company details, optionally as it was on a given date |
| `tickers.types` | `polygonio.api.tickers.types` | `read` | List the ticker type codes, which `tickers.list` filters on |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/polygonio

## License

Apache-2.0
