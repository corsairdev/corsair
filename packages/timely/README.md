# @corsair-dev/timely

Timely plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/timely
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `example.get` | `timely.api.example.get` | `read` | Get an example resource by ID |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/timely

## License

Apache-2.0
