# @corsair-dev/removebg

remove.bg plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/removebg
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `removebg.api.account.get` | `read` | Get account credit balance and API usage limits |
| `improvement.submit` | `removebg.api.improvement.submit` | `write` | Submit an image to the remove.bg Improvement program for AI training |
| `removeBackground.remove` | `removebg.api.removeBackground.remove` | `write` | Remove the background from an image, returning a base64-encoded cutout |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/removebg

## License

Apache-2.0
