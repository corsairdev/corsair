# @corsair-dev/uniswapapi

Uniswap Trading API plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/uniswapapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `approval.check` | `uniswapapi.api.approval.check` | `read` | Check if a wallet has the required token approval for a swap |
| `delegation.check` | `uniswapapi.api.delegation.check` | `read` | Check wallet delegation status for smart contract wallets across chains |
| `order.getStatus` | `uniswapapi.api.order.getStatus` | `read` | Get the status and details of a gasless UniswapX order |
| `quote.get` | `uniswapapi.api.quote.get` | `read` | Get a swap/bridge/wrap quote with route and estimated gas |
| `swap.create` | `uniswapapi.api.swap.create` | `write` | Create swap calldata (unsigned transaction) for broadcast |
| `swap.getStatus` | `uniswapapi.api.swap.getStatus` | `read` | Get swap status (PENDING, SUCCESS, NOT_FOUND, FAILED, EXPIRED) by tx or userOp hash |
| `swappableTokens.get` | `uniswapapi.api.swappableTokens.get` | `read` | List tokens and chains a source token can be swapped or bridged to |
| `transaction.encode7702` | `uniswapapi.api.transaction.encode7702` | `write` | Batch transactions into one for EIP-7702 smart contract wallet execution |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/uniswapapi

## License

Apache-2.0
