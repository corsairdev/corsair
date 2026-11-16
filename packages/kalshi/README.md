# @corsair-dev/kalshi

Kalshi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/kalshi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.get` | `kalshi.api.events.get` | `read` | Get an event by ticker |
| `events.list` | `kalshi.api.events.list` | `read` | List events with filters and cursor pagination |
| `exchange.schedule` | `kalshi.api.exchange.schedule` | `read` | Get the exchange trading schedule and maintenance windows |
| `exchange.status` | `kalshi.api.exchange.status` | `read` | Get whether the exchange and trading are currently active |
| `markets.candlesticks` | `kalshi.api.markets.candlesticks` | `read` | Get OHLC candlesticks for a market over a time range, by minute, hour or day |
| `markets.get` | `kalshi.api.markets.get` | `read` | Get a market by ticker, including its price ranges |
| `markets.list` | `kalshi.api.markets.list` | `read` | List markets with filters and cursor pagination |
| `markets.orderbook` | `kalshi.api.markets.orderbook` | `read` | Get the order book for a market |
| `markets.trades` | `kalshi.api.markets.trades` | `read` | List recent trades, optionally for one market |
| `orders.amend` | `kalshi.api.orders.amend` | `destructive` | Change an existing order's price or size; a new price can fill at once and spend real money in production |
| `orders.batchCreate` | `kalshi.api.orders.batchCreate` | `destructive` | Place several orders in one request. Spends real money when the environment is production |
| `orders.cancel` | `kalshi.api.orders.cancel` | `destructive` | Cancel a resting order's remaining contracts; a cancelled order can't be restored |
| `orders.create` | `kalshi.api.orders.create` | `destructive` | Place an order. Spends real money when the environment is production |
| `orders.get` | `kalshi.api.orders.get` | `read` | Get a single order by ID |
| `orders.list` | `kalshi.api.orders.list` | `read` | List orders, optionally filtered by status or market |
| `portfolio.balance` | `kalshi.api.portfolio.balance` | `read` | Get the account balance and portfolio value |
| `portfolio.fills` | `kalshi.api.portfolio.fills` | `read` | List order fills for the account |
| `portfolio.positions` | `kalshi.api.portfolio.positions` | `read` | List market and event positions. Includes closed markets awaiting settlement and fully exited positions, so not every row is open exposure |
| `portfolio.settlements` | `kalshi.api.portfolio.settlements` | `read` | List settled positions for the account |
| `series.get` | `kalshi.api.series.get` | `read` | Get a series by ticker |
| `series.list` | `kalshi.api.series.list` | `read` | List event series, optionally by category or tags |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

Kalshi needs two credentials: an API key ID and the matching PEM private key (RSA or Ed25519). `kalshi()` defaults to the production environment, where orders spend real money; pass `kalshi({ environment: 'demo' })` with demo credentials to try it safely.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kalshi

## License

Apache-2.0
