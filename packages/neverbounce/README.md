# @corsair-dev/neverbounce

NeverBounce plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/neverbounce
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `single.check` | `neverbounce.api.single.check` | `read` | Verify an email address (valid, invalid, disposable, catchall or unknown); uses one verification credit |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/neverbounce

## License

Apache-2.0
