# @corsair-dev/humanitix

Humanitix plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/humanitix
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.get` | `humanitix.api.events.get` | `read` | Retrieve detailed information about a specific Humanitix event by eventId. |
| `events.list` | `humanitix.api.events.list` | `read` | Retrieve a paginated list of Humanitix events (page, pageSize, inFutureOnly, since, overrideLocation). |
| `tags.list` | `humanitix.api.tags.list` | `read` | Retrieve a paginated list of Humanitix tags (page, pageSize). |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/humanitix

## License

Apache-2.0
