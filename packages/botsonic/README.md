# @corsair-dev/botsonic

Botsonic plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/botsonic
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `generateResponse.post` | `botsonic.api.generateResponse.post` | `write` | Generate a response from a Botsonic chatbot |
| `getAllFaqs.get` | `botsonic.api.getAllFaqs.get` | `read` | Retrieve all FAQs for a Botsonic bot |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/botsonic

## License

Apache-2.0
