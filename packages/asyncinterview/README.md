# @corsair-dev/asyncinterview

AsyncInterview plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/asyncinterview
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `jobs.delete` | `asyncinterview.api.jobs.delete` | `destructive` | Deletes an interview job permanently. |
| `jobs.list` | `asyncinterview.api.jobs.list` | `read` | Retrieves a list of all interview jobs. |
| `jobs.listResponses` | `asyncinterview.api.jobs.listResponses` | `read` | Retrieves all interview responses with candidate details. |
| `jobs.update` | `asyncinterview.api.jobs.update` | `write` | Updates an existing interview job's details after creation. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/asyncinterview

## License

Apache-2.0
