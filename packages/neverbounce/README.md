# @corsair-dev/neverbounce

NeverBounce plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/neverbounce
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `single.check` | `neverbounce.api.single.check` | `read` | Verify one email address as it comes in, such as a form signup (valid, invalid, disposable, catchall or unknown); uses one verification credit. NeverBounce may lock the account if this is looped over an existing list; lists belong in its bulk jobs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/neverbounce

## License

Apache-2.0
