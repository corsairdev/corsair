# @corsair-dev/vestaboard

Vestaboard plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/vestaboard
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `subscriptions.list` | `vestaboard.api.subscriptions.list` | `read` | List Vestaboard subscriptions accessible with the current API key and secret |
| `subscriptions.postMessage` | `vestaboard.api.subscriptions.postMessage` | `write` | Send text or a 6x22 character grid to a Vestaboard subscription |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vestaboard

## License

Apache-2.0
