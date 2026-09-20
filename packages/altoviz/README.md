# @corsair-dev/altoviz

Altoviz plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/altoviz
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getClassifications` | `altoviz.api.account.getClassifications` | `read` | List accounting classifications, optionally filtered by type (Sale \| Expense \| Other) |
| `account.getCurrentUser` | `altoviz.api.account.getCurrentUser` | `read` | Get the authenticated user |
| `account.getSettings` | `altoviz.api.account.getSettings` | `read` | Get accounting, company, emailing, sales, social and VAT settings |
| `account.getUnits` | `altoviz.api.account.getUnits` | `read` | List measurement units - reference data, mirrored |
| `account.getVats` | `altoviz.api.account.getVats` | `read` | List VAT rates - reference data, mirrored |
| `account.testApiKey` | `altoviz.api.account.testApiKey` | `read` | Verify the API key and get the account identity - takes no parameters |
| `colleagues.delete` | `altoviz.api.colleagues.delete` | `destructive` | Delete a colleague [DESTRUCTIVE] |
| `colleagues.get` | `altoviz.api.colleagues.get` | `read` | Get a colleague by id |
| `colleagues.list` | `altoviz.api.colleagues.list` | `read` | List colleagues, paged |
| `colleagues.update` | `altoviz.api.colleagues.update` | `write` | Update a colleague. Read-modify-write internally - a partial body is a 500 on this route, not just a clearing PUT. |
| `contacts.create` | `altoviz.api.contacts.create` | `write` | Create a standalone contact. There is no customerId field on this route - it cannot be attached to a customer here. |
| `contacts.find` | `altoviz.api.contacts.find` | `read` | Find contacts by email or internalId - returns an array, possibly empty |
| `contacts.get` | `altoviz.api.contacts.get` | `read` | Get a contact by id |
| `contacts.list` | `altoviz.api.contacts.list` | `read` | List contacts, paged. Includes shadow contacts auto-created by customer/supplier/colleague writes. |
| `customerFamilies.create` | `altoviz.api.customerFamilies.create` | `write` | Create a customer family (segment) |
| `customerFamilies.delete` | `altoviz.api.customerFamilies.delete` | `destructive` | Delete a customer family [DESTRUCTIVE]. Refused with a conflict if it still has members - it does not cascade. |
| `customerFamilies.get` | `altoviz.api.customerFamilies.get` | `read` | Get a customer family by id |
| `customerFamilies.list` | `altoviz.api.customerFamilies.list` | `read` | List customer families, paged |
| `customers.create` | `altoviz.api.customers.create` | `write` | Create a customer. type is Business \| Consumer \| Government - NOT the Company/Individual the catalog description documents. |
| `customers.delete` | `altoviz.api.customers.delete` | `destructive` | Delete a customer [DESTRUCTIVE]. Evicts the auto-created contact from the mirror if one is cached. |
| `customers.find` | `altoviz.api.customers.find` | `read` | Find customers by email, internalId or number - returns an array, possibly empty |
| `customers.get` | `altoviz.api.customers.get` | `read` | Get a customer by id |
| `customers.getByInternalId` | `altoviz.api.customers.getByInternalId` | `read` | Get a customer by the caller-supplied internalId |
| `customers.getContacts` | `altoviz.api.customers.getContacts` | `read` | List a customer's contacts, including the one auto-created when the customer was created |
| `customers.list` | `altoviz.api.customers.list` | `read` | List customers, paged (PageIndex is 1-based) |
| `customers.update` | `altoviz.api.customers.update` | `write` | Update a customer. Read-modify-write internally, because Altoviz PUT clears any field the caller omits. |
| `productFamilies.create` | `altoviz.api.productFamilies.create` | `write` | Create a product family |
| `productFamilies.delete` | `altoviz.api.productFamilies.delete` | `destructive` | Delete a product family [DESTRUCTIVE]. Refused with a conflict if it still has members. |
| `productFamilies.get` | `altoviz.api.productFamilies.get` | `read` | Get a product family by id |
| `productFamilies.list` | `altoviz.api.productFamilies.list` | `read` | List product families, paged |
| `products.create` | `altoviz.api.products.create` | `write` | Create a product. unit/vat/family are resolved from an id to their value form before the request is sent. |
| `products.delete` | `altoviz.api.products.delete` | `destructive` | Delete a product [DESTRUCTIVE] |
| `products.find` | `altoviz.api.products.find` | `read` | Find a product by number - returns an array |
| `products.findByNumberOrId` | `altoviz.api.products.findByNumberOrId` | `read` | Find a product by number or internalId - same route as products.find, superset of parameters |
| `products.get` | `altoviz.api.products.get` | `read` | Get a product by id |
| `purchaseInvoices.download` | `altoviz.api.purchaseInvoices.download` | `read` | Download a purchase invoice as PDF |
| `purchaseInvoices.upload` | `altoviz.api.purchaseInvoices.upload` | `write` | Upload a purchase invoice file (PDF or image). There is no delete for this anywhere in the API - only the Altoviz UI can remove it. |
| `receipts.create` | `altoviz.api.receipts.create` | `write` | Create a receipt. links to a draft document are refused - the document must be finalized first, which is outside this plugin. |
| `receipts.delete` | `altoviz.api.receipts.delete` | `destructive` | Delete a receipt [DESTRUCTIVE] |
| `receipts.find` | `altoviz.api.receipts.find` | `read` | Find receipts by the receipt's own internalId - returns an array |
| `receipts.get` | `altoviz.api.receipts.get` | `read` | Get a receipt by id |
| `receipts.list` | `altoviz.api.receipts.list` | `read` | List receipts, paged |
| `receipts.update` | `altoviz.api.receipts.update` | `write` | Update a receipt. Read-modify-write internally; a customer reference is required even on update. |
| `saleCredits.create` | `altoviz.api.saleCredits.create` | `write` | Create a draft credit note (avoir) |
| `saleCredits.delete` | `altoviz.api.saleCredits.delete` | `destructive` | Delete a draft sale credit [DESTRUCTIVE]. Drafts only. |
| `saleCredits.download` | `altoviz.api.saleCredits.download` | `read` | Download a sale credit as PDF. May not be byte-exact - see the core text-decoding note. |
| `saleCredits.find` | `altoviz.api.saleCredits.find` | `read` | Find sale credits by internalId - returns an array |
| `saleCredits.get` | `altoviz.api.saleCredits.get` | `read` | Get a sale credit by id |
| `saleCredits.list` | `altoviz.api.saleCredits.list` | `read` | List sale credits, paged, filterable by date range and customer |
| `saleCredits.update` | `altoviz.api.saleCredits.update` | `write` | Update a draft credit note. Drafts only; lines must be resent in full or the credit is emptied. |
| `saleInvoices.create` | `altoviz.api.saleInvoices.create` | `write` | Create a draft sale invoice. Lines use taxExcludedPrice, never unitPrice - unitPrice is silently ignored and prices the line at zero. |
| `saleInvoices.delete` | `altoviz.api.saleInvoices.delete` | `destructive` | Delete a draft sale invoice [DESTRUCTIVE]. Drafts only. |
| `saleInvoices.download` | `altoviz.api.saleInvoices.download` | `read` | Download a sale invoice as PDF. May not be byte-exact - see the core text-decoding note. |
| `saleInvoices.find` | `altoviz.api.saleInvoices.find` | `read` | Find sale invoices by internalId - returns an array |
| `saleInvoices.get` | `altoviz.api.saleInvoices.get` | `read` | Get a sale invoice by id |
| `saleInvoices.list` | `altoviz.api.saleInvoices.list` | `read` | List sale invoices, paged, filterable by date range, customer and status |
| `saleQuotes.delete` | `altoviz.api.saleQuotes.delete` | `destructive` | Delete a sale quote [DESTRUCTIVE]. Deleting a quote that does not exist also returns 200. |
| `saleQuotes.find` | `altoviz.api.saleQuotes.find` | `read` | Find sale quotes by internalId - returns an array |
| `saleQuotes.list` | `altoviz.api.saleQuotes.list` | `read` | List sale quotes, paged, filterable by date range and customer. No working status filter - the spec one is a generator artefact. |
| `suppliers.delete` | `altoviz.api.suppliers.delete` | `destructive` | Delete a supplier [DESTRUCTIVE]. Evicts the auto-created contact from the mirror if one is cached. |
| `suppliers.get` | `altoviz.api.suppliers.get` | `read` | Get a supplier by id |
| `suppliers.getContacts` | `altoviz.api.suppliers.getContacts` | `read` | List a supplier's contacts |
| `suppliers.list` | `altoviz.api.suppliers.list` | `read` | List suppliers, paged |
| `suppliers.update` | `altoviz.api.suppliers.update` | `write` | Update a supplier. Read-modify-write internally, same clearing-PUT behaviour as customers. |
| `webhookSubscriptions.list` | `altoviz.api.webhookSubscriptions.list` | `read` | List registered webhook subscriptions |
| `webhookSubscriptions.register` | `altoviz.api.webhookSubscriptions.register` | `write` | Register a webhook subscription. The response id is 0 - list immediately after to get the real id. |
| `webhookSubscriptions.unregister` | `altoviz.api.webhookSubscriptions.unregister` | `destructive` | Unregister a webhook subscription by id or url [DESTRUCTIVE]. Exactly one of the two is required. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/altoviz

## License

Apache-2.0
