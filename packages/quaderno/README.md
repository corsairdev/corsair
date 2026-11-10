# @corsair-dev/quaderno

Quaderno plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/quaderno
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `authorization` | `quaderno.api.authorization` | `read` | Which account this key belongs to: `identity.href` is that account’s base URL, so this is how a caller finds the subdomain to pass as `account`. Also returns the default API version. |
| `contacts.create` | `quaderno.api.contacts.create` | `write` | Adds a customer. Quaderno rejects a duplicate email with 422, so this is safe to call from a retry. |
| `contacts.delete` | `quaderno.api.contacts.delete` | `destructive` | Removes a customer. Quaderno refuses with 422 while the contact still has documents attached, so invoices must be voided first. Answers 204 with no body. |
| `contacts.get` | `quaderno.api.contacts.get` | `read` | One customer by id. An unknown id answers **401**, not 404, with “Unauthorized access or contact does not exist”; the plugin reports it as `not_found_or_denied`. |
| `contacts.list` | `quaderno.api.contacts.list` | `read` | Customers, newest first, answered as a bare array. Search with `q` and page with `created_before`; `next_created_before` carries the next cursor. |
| `contacts.update` | `quaderno.api.contacts.update` | `write` | Changes a customer. Fields left out are left unchanged by the API, not cleared. |
| `credits.create` | `quaderno.api.credits.create` | `write` | Issues a credit note. It consumes a document number and cannot be deleted, only voided. |
| `credits.deliver` | `quaderno.api.credits.deliver` | `write` | Emails the credit note. A GET that mutates, so it is a write and is never replayed. |
| `credits.get` | `quaderno.api.credits.get` | `read` | One credit note by id, with its lines, payments and the document it credits. |
| `credits.list` | `quaderno.api.credits.list` | `read` | Credit notes, newest first, as a bare array. A voided invoice leaves one of these beside it. |
| `credits.update` | `quaderno.api.credits.update` | `write` | Changes a credit note. Like an invoice, only while it is still editable. |
| `credits.void` | `quaderno.api.credits.void` | `destructive` | Voids a credit note. `void_reason` is required, exactly as for an invoice. |
| `invoices.create` | `quaderno.api.invoices.create` | `write` | Issues an invoice and **allocates a document number**, which is not recoverable: invoices cannot be deleted, only voided. Passing `payment_method` records a full payment immediately and marks it paid. Needs a `contact` id and at least one line item. |
| `invoices.deliver` | `quaderno.api.invoices.deliver` | `write` | Sends the invoice to the customer by email using the account template. A **GET that mutates**, so it is a write here and never replayed: delivering twice emails twice. Records delivery history and needs a contact with a valid email. |
| `invoices.get` | `quaderno.api.invoices.get` | `read` | One invoice with its lines, taxes and payments. An unknown id answers 401 rather than 404. |
| `invoices.list` | `quaderno.api.invoices.list` | `read` | Invoices, newest first, as a bare array. Filter by date, state, contact or processor id, search with `q`, and page with `created_before`. |
| `invoices.markUncollectible` | `quaderno.api.invoices.markUncollectible` | `write` | Marks an unpaid invoice as bad debt. Reversible by recording a payment later, unlike a void. |
| `invoices.recordPayment` | `quaderno.api.invoices.recordPayment` | `write` | Records a payment against an invoice; reaching the total marks it paid. This creates a real financial record, not a note. |
| `invoices.update` | `quaderno.api.invoices.update` | `write` | Changes an invoice. Quaderno only allows this while the invoice is still editable; a paid or voided one is refused. |
| `invoices.void` | `quaderno.api.invoices.void` | `destructive` | Reverses an invoice the way tax law requires. It cannot be deleted: voiding records an `offset` payment for the full amount and issues a credit note beside it. `void_reason` is required and the API answers 422 without it. |
| `jurisdictions.get` | `quaderno.api.jurisdictions.get` | `read` | One tax jurisdiction by id, naming the country and any region whose tax rules apply. |
| `jurisdictions.list` | `quaderno.api.jurisdictions.list` | `read` | Every tax jurisdiction Quaderno knows, about 290 rows, as a bare array. Verified live: this route ignores `limit` and always returns the full list. |
| `ping` | `quaderno.api.ping` | `read` | Checks that the key and account name are valid. The docs say it does not consume an API call. Answers `{"status":"OK"}`. |
| `products.create` | `quaderno.api.products.create` | `write` | Adds a product. `name`, `code` and `unit_cost` are required, and `kind` is `one_off` or `subscription`, not the value the spec’s example suggests. |
| `products.delete` | `quaderno.api.products.delete` | `destructive` | Removes a product. Existing documents keep the line they were issued with, so past invoices are unaffected. |
| `products.get` | `quaderno.api.products.get` | `read` | One product by id, with its price, tax class and the currency it is sold in. |
| `products.list` | `quaderno.api.products.list` | `read` | Your product catalogue, newest first, from the `/items` route. A bare array; page with `created_before`. |
| `products.update` | `quaderno.api.products.update` | `write` | Changes a product. Existing documents keep the line they were issued with, so past invoices are unaffected. |
| `proformas.accept` | `quaderno.api.proformas.accept` | `write` | Marks a proforma accepted. A state change the customer would normally trigger; reversible with `proformas.revert`. |
| `proformas.convert` | `quaderno.api.proformas.convert` | `write` | Converts a proforma into a real invoice, which **consumes an invoice number and cannot be undone**. Returns the proforma, not the new invoice, so find the invoice by its `related_document`. |
| `proformas.create` | `quaderno.api.proformas.create` | `write` | Creates a proforma. Unlike an invoice this is not a tax document, so it does not consume an invoice number. |
| `proformas.decline` | `quaderno.api.proformas.decline` | `write` | Marks a proforma declined. Reversible with `proformas.revert`. |
| `proformas.deliver` | `quaderno.api.proformas.deliver` | `write` | Emails the proforma. A GET that mutates, so it is a write and is never replayed. |
| `proformas.get` | `quaderno.api.proformas.get` | `read` | One proforma by id, with its lines and the state it was accepted or declined in. |
| `proformas.list` | `quaderno.api.proformas.list` | `read` | Proforma invoices, newest first, as a bare array. A proforma is not a tax document, so it carries no invoice number. |
| `proformas.revert` | `quaderno.api.proformas.revert` | `write` | Puts an accepted or declined proforma back to its open state. |
| `proformas.update` | `quaderno.api.proformas.update` | `write` | Changes a proforma. It stays a proforma until `proformas.convert` issues a real invoice. |
| `receipts.create` | `quaderno.api.receipts.create` | `write` | Issues a receipt. Like an invoice, it consumes a document number and cannot be deleted. |
| `receipts.deliver` | `quaderno.api.receipts.deliver` | `write` | Emails the receipt to the customer. A GET that mutates, so it is a write and is never replayed. |
| `receipts.get` | `quaderno.api.receipts.get` | `read` | One receipt by id, with its lines, payments and the invoice it settles. |
| `receipts.list` | `quaderno.api.receipts.list` | `read` | Receipts, newest first, as a bare array with the same filters as invoices: date, state and contact. |
| `receipts.void` | `quaderno.api.receipts.void` | `destructive` | Voids a receipt. `void_reason` is required, as for an invoice. |
| `taxCodes.get` | `quaderno.api.taxCodes.get` | `read` | One tax code by its identifier, such as `standard`. |
| `taxCodes.list` | `quaderno.api.taxCodes.list` | `read` | The tax codes available on the account, as a bare array. This route honours `limit`, unlike `jurisdictions.list`. |
| `taxIds.validate` | `quaderno.api.taxIds.validate` | `read` | Checks a VAT or tax number against the country’s registry and returns the registered company name when it is valid. |
| `taxRates.calculate` | `quaderno.api.taxRates.calculate` | `read` | The tax rate Quaderno would charge for a customer country and tax code, with the resulting total. `tax_code` and `amount` are required from API version 20210316, which this plugin targets. |
| `transactions.create` | `quaderno.api.transactions.create` | `write` | Records a sale in one call: it creates the document and its payment together, which is what distinguishes it from `invoices.create`. A real financial record. |
| `webhooks.list` | `quaderno.api.webhooks.list` | `read` | The webhook subscriptions on the account, as a bare array. Read only here: Quaderno sends unsigned deliveries, so this plugin registers no inbound handler. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/quaderno

## License

Apache-2.0
