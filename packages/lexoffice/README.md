# @corsair-dev/lexoffice

Lexoffice plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/lexoffice
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.list` | `lexoffice.api.contacts.list` | `read` | List and filter Lexoffice contacts with pagination |
| `contacts.get` | `lexoffice.api.contacts.get` | `read` | Retrieve a Lexoffice contact by ID |
| `contacts.create` | `lexoffice.api.contacts.create` | `write` | Create a new customer or vendor contact in Lexoffice |
| `contacts.update` | `lexoffice.api.contacts.update` | `write` | Update an existing contact in Lexoffice |
| `invoices.list` | `lexoffice.api.invoices.list` | `read` | List outgoing invoices with pagination |
| `invoices.get` | `lexoffice.api.invoices.get` | `read` | Retrieve invoice details by ID |
| `invoices.create` | `lexoffice.api.invoices.create` | `write` | Create an invoice in draft or finalized state |
| `invoices.render` | `lexoffice.api.invoices.render` | `read` | Render an invoice PDF and retrieve its document file ID |
| `vouchers.list` | `lexoffice.api.vouchers.list` | `read` | List bookkeeping vouchers with optional voucher number filter |
| `vouchers.get` | `lexoffice.api.vouchers.get` | `read` | Retrieve voucher details by ID |
| `vouchers.create` | `lexoffice.api.vouchers.create` | `write` | Create a new bookkeeping voucher |
| `profile.get` | `lexoffice.api.profile.get` | `read` | Retrieve organization and account profile details |
| `creditNotes.list` | `lexoffice.api.creditNotes.list` | `read` | List credit notes with pagination |
| `creditNotes.get` | `lexoffice.api.creditNotes.get` | `read` | Retrieve credit note details by ID |

## Auth

Auth: API key (`Authorization: Bearer <API_KEY>`). Generate an API key in your Lexoffice dashboard under `Settings > Public API`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lexoffice
Official API Documentation: https://developers.lexware.io/docs/

## License

Apache-2.0
