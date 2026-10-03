# @corsair-dev/starton

Starton plugin for Corsair — blockchain wallets, smart contract deployment/calls and transaction status.

## Install

```bash
pnpm add @corsair-dev/starton
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `smartContract.call` | `starton.api.smartContract.call` | `write` | Execute a state-changing function on a deployed smart contract |
| `smartContract.deployFromTemplate` | `starton.api.smartContract.deployFromTemplate` | `write` | Deploy a smart contract from a Starton-audited template (e.g. ERC20, ERC721) |
| `smartContract.read` | `starton.api.smartContract.read` | `read` | Call a read-only function on a deployed smart contract without broadcasting a transaction |
| `transaction.get` | `starton.api.transaction.get` | `read` | Retrieve a blockchain transaction by its Starton id |
| `wallet.create` | `starton.api.wallet.create` | `write` | Create a new KMS-managed blockchain wallet for the project |
| `wallet.list` | `starton.api.wallet.list` | `read` | List the KMS-managed wallets for the project (paginated) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/starton

## License

Apache-2.0
