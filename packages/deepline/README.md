# @corsair-dev/deepline

Deepline GTM tools, Plays, run results and billing for Corsair.

## Install

```bash
pnpm add @corsair-dev/deepline
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `billing.balance` | `deepline.api.billing.balance` | `read` | Get workspace credit balance |
| `billing.entitlements` | `deepline.api.billing.entitlements` | `read` | Read current workspace provider benefits |
| `billing.ledger` | `deepline.api.billing.ledger` | `read` | List or export the credit ledger |
| `billing.usage` | `deepline.api.billing.usage` | `read` | Get usage and recent charges |
| `datasets.history` | `deepline.api.datasets.history` | `read` | Read immutable run row history with coverage and continuation cursor |
| `datasets.rows` | `deepline.api.datasets.rows` | `read` | Read a page of saved dataset rows, optionally scoped to a run |
| `executions.getByKey` | `deepline.api.executions.getByKey` | `read` | Recover a tool execution by its idempotency key |
| `health.get` | `deepline.api.health.get` | `read` | Check Runtime API availability |
| `plays.activity` | `deepline.api.plays.activity` | `read` | Count Play runs and delivered Monitor findings by day |
| `plays.get` | `deepline.api.plays.get` | `read` | Describe one callable Play |
| `plays.list` | `deepline.api.plays.list` | `read` | List and search callable Plays |
| `plays.run` | `deepline.api.plays.run` | `destructive` | Start a saved or prebuilt Play run (may spend credits or perform external actions) |
| `runs.children` | `deepline.api.runs.children` | `read` | List one page of async child Runs |
| `runs.get` | `deepline.api.runs.get` | `read` | Get one Play run status |
| `runs.history` | `deepline.api.runs.history` | `read` | Search and page workspace run history |
| `runs.logs` | `deepline.api.runs.logs` | `read` | Read retained run logs; continue with lastSeq as afterSeq |
| `search.query` | `deepline.api.search.query` | `read` | Search tools, monitor types, plays, and docs |
| `tools.execute` | `deepline.api.tools.execute` | `destructive` | Execute one provider-backed tool (may spend credits or perform external actions) |
| `tools.get` | `deepline.api.tools.get` | `read` | Describe one provider-backed tool |
| `tools.list` | `deepline.api.tools.list` | `read` | List callable provider tools |
| `tools.search` | `deepline.api.tools.search` | `read` | Search callable provider tools |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/deepline

## License

Apache-2.0
