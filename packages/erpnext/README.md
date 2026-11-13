# @corsair-dev/erpnext

Erpnext plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/erpnext
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `desk.addComment` | `erpnext.api.desk.addComment` | `write` | Add a comment to any document; the caller supplies the reference, content, and commenter identity |
| `desk.addTag` | `erpnext.api.desk.addTag` | `write` | Add a tag to a document, optionally with a color, for organization and filtering |
| `desk.searchGlobal` | `erpnext.api.desk.searchGlobal` | `read` | Search a DocType by text across its searchable fields, with optional custom search method, filters, and result limit |
| `doctypes.getMeta` | `erpnext.api.doctypes.getMeta` | `read` | Read the complete metadata of a DocType: field definitions, types, permissions, and configuration |
| `doctypes.list` | `erpnext.api.doctypes.list` | `read` | List the DocTypes available on the instance with optional filtering and pagination |
| `documents.cancel` | `erpnext.api.documents.cancel` | `write` | Cancel a submitted document by doctype and name through the frappe.client RPC |
| `documents.create` | `erpnext.api.documents.create` | `write` | Create a document of any DocType from its field values; the response carries the created document |
| `documents.delete` | `erpnext.api.documents.delete` | `destructive` | Delete a document of a DocType by its name |
| `documents.get` | `erpnext.api.documents.get` | `read` | Read one document of a DocType by its name |
| `documents.getClient` | `erpnext.api.documents.getClient` | `read` | Read a single document through the frappe.client RPC by doctype and name |
| `documents.getCount` | `erpnext.api.documents.getCount` | `read` | Count the documents of a DocType matching optional filters |
| `documents.getList` | `erpnext.api.documents.getList` | `read` | Query documents through the frappe.client RPC with filtering, field selection, and pagination |
| `documents.getValue` | `erpnext.api.documents.getValue` | `read` | Read specific field values from documents matching filters without loading the whole document |
| `documents.getWithMeta` | `erpnext.api.documents.getWithMeta` | `read` | Read a document with its desk metadata: attachments, comments, activity logs, and related information |
| `documents.insert` | `erpnext.api.documents.insert` | `write` | Insert a document through the frappe.client RPC, passing the full document object including its doctype field |
| `documents.insertMany` | `erpnext.api.documents.insertMany` | `write` | Insert multiple documents in one call for efficiency; each item carries its doctype and field values |
| `documents.list` | `erpnext.api.documents.list` | `read` | List documents of a DocType with field selection, filters, ordering, and pagination |
| `documents.renameDoc` | `erpnext.api.documents.renameDoc` | `write` | Rename a document by changing its primary identifier, optionally merging into an existing name |
| `documents.saveDocs` | `erpnext.api.documents.saveDocs` | `write` | Save, submit, cancel, or update a document by sending its docstatus and fields through the frappe.client RPC |
| `documents.saveDocument` | `erpnext.api.documents.saveDocument` | `write` | Save an existing document through the frappe.client RPC, passing the complete document object with its changes |
| `documents.searchLink` | `erpnext.api.documents.searchLink` | `read` | Search documents of a DocType for Link-field autocomplete suggestions by name or text |
| `documents.setValue` | `erpnext.api.documents.setValue` | `write` | Set one field value on a document without loading or rewriting the whole document |
| `documents.submit` | `erpnext.api.documents.submit` | `write` | Submit a submittable document, moving it from draft to submitted through the frappe.client RPC |
| `documents.update` | `erpnext.api.documents.update` | `write` | Update a document by name; the body carries the fields to change |
| `erp.getExchangeRate` | `erpnext.api.erp.getExchangeRate` | `read` | Get the exchange rate between two currencies on an optional date; Frappe requires the date when the currencies differ |
| `erp.getItemDetails` | `erpnext.api.erp.getItemDetails` | `read` | Get the pricing, tax, and stock details ERPNext computes for an item in a selling or buying context |
| `erp.getPartyDetails` | `erpnext.api.erp.getPartyDetails` | `read` | Get the address, contact, currency, and payment-term details ERPNext attaches to a customer or supplier |
| `erp.getPaymentEntry` | `erpnext.api.erp.getPaymentEntry` | `read` | Get a prefilled payment entry draft for an outstanding sales invoice, purchase invoice, or order |
| `erp.getStockBalance` | `erpnext.api.erp.getStockBalance` | `read` | Get the available stock balance of an item in a warehouse as of an optional posting date |
| `erp.makeDeliveryNote` | `erpnext.api.erp.makeDeliveryNote` | `write` | Map a sales order into a draft delivery note, preserving the linked item rows |
| `erp.makePurchaseOrder` | `erpnext.api.erp.makePurchaseOrder` | `write` | Map a sales order or material request into draft purchase orders grouped by supplier |
| `erp.makeSalesInvoice` | `erpnext.api.erp.makeSalesInvoice` | `write` | Map a sales order into a draft sales invoice, preserving the linked item rows |
| `erp.makeStockEntry` | `erpnext.api.erp.makeStockEntry` | `write` | Create a stock entry for material transfers, receipts, or issues between warehouses |
| `files.downloadFile` | `erpnext.api.files.downloadFile` | `read` | Download a stored file by its URL path; the plugin returns the bytes base64-encoded |
| `files.downloadPdf` | `erpnext.api.files.downloadPdf` | `read` | Download a document as PDF through a print format; the plugin returns the bytes base64-encoded |
| `people.listEmployees` | `erpnext.api.people.listEmployees` | `read` | List the employees recorded on the instance |
| `people.listProjects` | `erpnext.api.people.listProjects` | `read` | List the projects recorded on the instance |
| `system.getAllLanguages` | `erpnext.api.system.getAllLanguages` | `read` | List the languages available on the instance for translation and localization; pass limit_page_length 0 for all |
| `system.getAllRoles` | `erpnext.api.system.getAllRoles` | `read` | List the roles defined on the instance |
| `system.getFiscalYear` | `erpnext.api.system.getFiscalYear` | `read` | List the fiscal years configured on the instance for accounting periods |
| `system.getFrameworkVersion` | `erpnext.api.system.getFrameworkVersion` | `read` | Get the Frappe framework version and all installed app versions; requires a desk user |
| `system.getLoggedUser` | `erpnext.api.system.getLoggedUser` | `read` | Get the user account the token authenticates as |
| `system.getTimezones` | `erpnext.api.system.getTimezones` | `read` | List all timezone identifiers available for user configuration and scheduling |
| `system.getUserRoles` | `erpnext.api.system.getUserRoles` | `read` | List role assignments (the Has Role child records) with optional user and role filters |
| `system.ping` | `erpnext.api.system.ping` | `read` | Check that the site answers authenticated API requests |
| `timesheets.create` | `erpnext.api.timesheets.create` | `write` | Create a timesheet with time log entries for an employee or project |
| `timesheets.list` | `erpnext.api.timesheets.list` | `read` | List the timesheets recorded on the instance |
| `webhooks.create` | `erpnext.api.webhooks.create` | `write` | Create a webhook subscription that fires on a DocType event such as create, update, or submit |
| `webhooks.list` | `erpnext.api.webhooks.list` | `read` | List the configured webhook subscriptions on the instance |
| `workflow.apply` | `erpnext.api.workflow.apply` | `write` | Apply a workflow action to a document, transitioning it through its configured workflow states |
| `workflow.getTransitions` | `erpnext.api.workflow.getTransitions` | `read` | List the workflow transitions available for a document, optionally scoped to a role |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/erpnext

## License

Apache-2.0
