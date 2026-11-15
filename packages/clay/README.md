# @corsair-dev/clay

Clay plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/clay
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.credits` | `clay.api.account.credits` | `read` | Get the workspace data credit and action balances |
| `account.me` | `clay.api.account.me` | `read` | Get the Clay user and workspace for the API key |
| `routines.getResults` | `clay.api.routines.getResults` | `read` | Get progress, or the paginated per-item results, of a routine run |
| `routines.run` | `clay.api.routines.run` | `write` | Run a Clay-managed or custom function routine on 1-100 items; spends credits and returns a routine_run_id |
| `search.create` | `clay.api.search.create` | `write` | Create a people or company search over Clay's GTM database from a Clay search query |
| `search.reference` | `clay.api.search.reference` | `read` | Get the Clay search query language reference used by search.create |
| `search.run` | `clay.api.search.run` | `write` | Get the next page of a search's results; each row draws from the workspace search quota |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/clay

## License

Apache-2.0
