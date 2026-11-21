# @corsair-dev/lexoffice

Lexoffice accounting integration for Corsair, using the current Lexware API gateway.

## Install and authenticate

```bash
pnpm add @corsair-dev/lexoffice
```

Generate a private API key in the Lexware dashboard under **Settings → Public API**. Corsair sends it as `Authorization: Bearer <API_KEY>`. The plugin does not persist Lexware entities locally.

## Operations

The plugin implements 27 operations across the surfaces requested in issue #2611. All inputs are strict Zod schemas, and provider responses are validated before returning.

| Operation | Method and route | Risk |
| --- | --- | --- |
| `contacts.list` | `GET /contacts` | read |
| `contacts.get` | `GET /contacts/{id}` | read |
| `contacts.create` | `POST /contacts` | write |
| `contacts.update` | `PUT /contacts/{id}` | write |
| `voucherlist.list` | `GET /voucherlist` | read |
| `invoices.list` | `GET /voucherlist?voucherType=invoice&voucherStatus=…` | read |
| `invoices.get` | `GET /invoices/{id}` | read |
| `invoices.create` | `POST /invoices` | destructive |
| `invoices.render` | `GET /invoices/{id}/document` (deprecated by Lexware) | read |
| `invoices.download` | `GET /invoices/{id}/file` | read |
| `vouchers.list` | `GET /voucherlist?voucherType=…&voucherStatus=any&voucherNumber=…` | read |
| `vouchers.get` | `GET /vouchers/{id}` | read |
| `vouchers.create` | `POST /vouchers` | destructive |
| `vouchers.update` | `PUT /vouchers/{id}` | destructive |
| `vouchers.attachFile` | `POST /vouchers/{id}/files` | destructive |
| `profile.get` | `GET /profile` | read |
| `creditNotes.list` | `GET /voucherlist?voucherType=creditnote&voucherStatus=…` | read |
| `creditNotes.get` | `GET /credit-notes/{id}` | read |
| `creditNotes.create` | `POST /credit-notes` | destructive |
| `creditNotes.render` | `GET /credit-notes/{id}/document` (deprecated by Lexware) | read |
| `creditNotes.download` | `GET /credit-notes/{id}/file` | read |
| `downPaymentInvoices.get` | `GET /down-payment-invoices/{id}` | read |
| `downPaymentInvoices.download` | `GET /down-payment-invoices/{id}/file` | read |
| `payments.get` | `GET /payments/{voucherId}` | read |
| `postingCategories.list` | `GET /posting-categories` | read |
| `files.upload` | `POST /files` | destructive |
| `files.download` | `GET /files/{id}` | read |

Invoice and credit-note lists use the required `voucherType` and `voucherStatus` filters on the documented `/voucherlist` route; `voucherlist.list` exposes all documented filters, including 0-based `page`, `size` (maximum 250), and sorting. `vouchers.list` applies its voucher-number filter through the current voucher-list route. Lexware's older `GET /vouchers?voucherNumber=…` filter is deprecated and is not used. List endpoints do not automatically fetch further pages.

Invoice and credit-note creation accept `finalize` and `precedingSalesVoucherId` as query options. A finalized credit note pursued from an invoice is immediately paid off and reduces that invoice's open amount.

`vouchers.update` requires the current `version` and an explicit `files` array. Pass the file IDs returned by `vouchers.get` to keep attachments; leaving IDs out deletes those attachments permanently. The only status change supported by Lexware is from `unchecked` to `open`.

`invoices.render` and `creditNotes.render` remain available for the documented legacy document-ID response. Lexware deprecates those routes; prefer the corresponding `*.download` operation, which returns `{ kind: 'binary', contentType, base64, sizeBytes }` and supports the documented `Accept` formats.

File upload inputs use a base64 `file`, `fileName`, and `contentType`. Lexware documents PDF, JPG, PNG, and XML voucher files up to 5 MB. `files.upload` creates a bookkeeping voucher and completes asynchronously; use `vouchers.attachFile` to add a file to an existing voucher. Neither operation logs file content. `files.download` is for bookkeeping voucher files; use the sales-document download operations for invoices, credit notes, and down-payment invoices.

## Errors and limits

Lexware documents a global resource limit of 2 requests per second. HTTP 429 responses preserve `Retry-After` for Corsair's rate-limit handler. Other errors retain safe status and retry metadata but redact provider text and request/response payloads that could contain customer data or API keys.

Webhook subscriptions are not included because the integration request did not ask for webhook support. Lexware deeplink helpers are also excluded: they build application URLs rather than expose REST operations. Other documented API groups outside issue #2611 are not included in this plugin scope.

Lexware's file-attachment description links to a `files/{id}/status` endpoint, but the current official reference has no corresponding section, route contract, or response schema; it is excluded as undocumented.

## Documentation

- [Official Lexware API documentation](https://developers.lexware.io/docs/)
- [Corsair Lexoffice plugin guide](https://docs.corsair.dev/plugins/lexoffice)

## License

Apache-2.0
