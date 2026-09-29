# @corsair-dev/coinbase

Coinbase plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/coinbase
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.get` | `coinbase.api.accounts.get` | `read` | Get a Coinbase account by id or currency code |
| `accounts.list` | `coinbase.api.accounts.list` | `read` | List Coinbase accounts and balances |
| `data.getExchangeRates` | `coinbase.api.data.getExchangeRates` | `read` | Get exchange rates for a base currency |
| `data.getTime` | `coinbase.api.data.getTime` | `read` | Get Coinbase API server time |
| `data.listCurrencies` | `coinbase.api.data.listCurrencies` | `read` | List currencies supported by Coinbase |
| `paymentMethods.list` | `coinbase.api.paymentMethods.list` | `read` | List payment methods on the authenticated Coinbase account |
| `prices.getBuy` | `coinbase.api.prices.getBuy` | `read` | Get the Coinbase buy price for a currency pair |
| `prices.getSell` | `coinbase.api.prices.getSell` | `read` | Get the Coinbase sell price for a currency pair |
| `prices.getSpot` | `coinbase.api.prices.getSpot` | `read` | Get the current or historic spot price for a currency pair |
| `transactions.get` | `coinbase.api.transactions.get` | `read` | Get a transaction on a Coinbase account |
| `transactions.list` | `coinbase.api.transactions.list` | `read` | List transactions for a Coinbase account |
| `user.get` | `coinbase.api.user.get` | `read` | Get the authenticated Coinbase user profile |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/coinbase

## License

Apache-2.0
