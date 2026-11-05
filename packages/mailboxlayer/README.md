# @corsair-dev/mailboxlayer

mailboxlayer email validation plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mailboxlayer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `email.check` | `mailboxlayer.api.email.check` | `read` | Validate whether an email address is correctly formatted, has valid MX records, and is deliverable via SMTP |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mailboxlayer

## License

Apache-2.0
