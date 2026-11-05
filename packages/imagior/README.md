# @corsair-dev/imagior

Imagior plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/imagior
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `imagior.api.account.get` | `read` | Retrieve the authenticated Imagior account details and remaining credits |
| `templates.list` | `imagior.api.templates.list` | `read` | List all design templates owned by the authenticated Imagior account |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/imagior

## License

Apache-2.0
