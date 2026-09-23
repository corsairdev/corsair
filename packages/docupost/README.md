# @corsair-dev/docupost

Docupost plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/docupost
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `docupost.api.account.balance` | `read` | Fetch the remaining DocuPost account balance |
| `send.letter` | `docupost.api.send.letter` | `write` | Send a physical letter through DocuPost |
| `send.postcard` | `docupost.api.send.postcard` | `write` | Send a physical postcard through DocuPost |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docupost

## License

Apache-2.0
