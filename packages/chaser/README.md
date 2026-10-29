# @corsair-dev/chaser

Chaser plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/chaser
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `customers.list` | `chaser.api.customers.list` | `read` | List all customers |
| `invoices.list` | `chaser.api.invoices.list` | `read` | List all invoices |
| `invoices.get` | `chaser.api.invoices.get` | `read` | Get an invoice by ID |
| `creditNotes.list` | `chaser.api.creditNotes.list` | `read` | List all credit notes |
| `organization.get` | `chaser.api.organization.get` | `read` | Get organization details |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/chaser

## License

Apache-2.0
