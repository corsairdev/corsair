# @corsair-dev/zohoinventory

Zoho Inventory plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zohoinventory
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bills.create` | `zohoinventory.api.bills.create` | `write` | Create a bill |
| `bills.list` | `zohoinventory.api.bills.list` | `read` | List bills |
| `compositeItems.delete` | `zohoinventory.api.compositeItems.delete` | `destructive` | Delete a composite item [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.create` | `zohoinventory.api.contacts.create` | `write` | Create a contact |
| `contacts.createPerson` | `zohoinventory.api.contacts.createPerson` | `write` | Create a contact person |
| `contacts.deactivate` | `zohoinventory.api.contacts.deactivate` | `write` | Mark a contact inactive |
| `contacts.delete` | `zohoinventory.api.contacts.delete` | `destructive` | Delete a contact [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.deletePerson` | `zohoinventory.api.contacts.deletePerson` | `destructive` | Delete a contact person [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.email` | `zohoinventory.api.contacts.email` | `write` | Email a contact |
| `contacts.emailStatement` | `zohoinventory.api.contacts.emailStatement` | `write` | Email a contact statement |
| `contacts.get` | `zohoinventory.api.contacts.get` | `read` | Get a contact |
| `contacts.getAddress` | `zohoinventory.api.contacts.getAddress` | `read` | Get a contact address |
| `contacts.list` | `zohoinventory.api.contacts.list` | `read` | List contacts |
| `creditNotes.addComment` | `zohoinventory.api.creditNotes.addComment` | `write` | Add a credit note comment |
| `creditNotes.applyCredits` | `zohoinventory.api.creditNotes.applyCredits` | `write` | Apply credit note credits to invoices |
| `creditNotes.create` | `zohoinventory.api.creditNotes.create` | `write` | Create a credit note |
| `creditNotes.email` | `zohoinventory.api.creditNotes.email` | `write` | Email a credit note |
| `creditNotes.get` | `zohoinventory.api.creditNotes.get` | `read` | Get a credit note |
| `creditNotes.getEmailContent` | `zohoinventory.api.creditNotes.getEmailContent` | `read` | Get credit note email content |
| `creditNotes.list` | `zohoinventory.api.creditNotes.list` | `read` | List credit notes |
| `currencies.list` | `zohoinventory.api.currencies.list` | `read` | List currencies |
| `customerPayments.create` | `zohoinventory.api.customerPayments.create` | `write` | Create a customer payment |
| `invoices.addAttachment` | `zohoinventory.api.invoices.addAttachment` | `write` | Upload an invoice attachment |
| `invoices.addComment` | `zohoinventory.api.invoices.addComment` | `write` | Add an invoice comment |
| `invoices.bulkEmail` | `zohoinventory.api.invoices.bulkEmail` | `write` | Bulk email invoices |
| `invoices.bulkExport` | `zohoinventory.api.invoices.bulkExport` | `read` | Bulk export invoices as PDF |
| `invoices.bulkPrint` | `zohoinventory.api.invoices.bulkPrint` | `read` | Bulk print invoices as PDF |
| `invoices.cancelWriteOff` | `zohoinventory.api.invoices.cancelWriteOff` | `write` | Cancel an invoice write-off |
| `invoices.create` | `zohoinventory.api.invoices.create` | `write` | Create an invoice |
| `invoices.delete` | `zohoinventory.api.invoices.delete` | `destructive` | Delete an invoice [DESTRUCTIVE · IRREVERSIBLE] |
| `invoices.deleteAttachment` | `zohoinventory.api.invoices.deleteAttachment` | `destructive` | Delete an invoice attachment [DESTRUCTIVE · IRREVERSIBLE] |
| `invoices.deleteComment` | `zohoinventory.api.invoices.deleteComment` | `destructive` | Delete an invoice comment [DESTRUCTIVE · IRREVERSIBLE] |
| `invoices.disablePaymentReminder` | `zohoinventory.api.invoices.disablePaymentReminder` | `write` | Disable invoice payment reminders |
| `invoices.email` | `zohoinventory.api.invoices.email` | `write` | Email an invoice |
| `invoices.enablePaymentReminder` | `zohoinventory.api.invoices.enablePaymentReminder` | `write` | Enable invoice payment reminders |
| `invoices.list` | `zohoinventory.api.invoices.list` | `read` | List invoices |
| `invoices.listPayments` | `zohoinventory.api.invoices.listPayments` | `read` | List payments on an invoice |
| `itemGroups.create` | `zohoinventory.api.itemGroups.create` | `write` | Create an item group |
| `itemGroups.deactivate` | `zohoinventory.api.itemGroups.deactivate` | `write` | Mark an item group inactive |
| `itemGroups.delete` | `zohoinventory.api.itemGroups.delete` | `destructive` | Delete an item group [DESTRUCTIVE · IRREVERSIBLE] |
| `itemGroups.list` | `zohoinventory.api.itemGroups.list` | `read` | List item groups |
| `items.create` | `zohoinventory.api.items.create` | `write` | Create an inventory item |
| `items.deactivate` | `zohoinventory.api.items.deactivate` | `write` | Mark an item inactive |
| `items.delete` | `zohoinventory.api.items.delete` | `destructive` | Delete an item [DESTRUCTIVE · IRREVERSIBLE] |
| `items.deleteImage` | `zohoinventory.api.items.deleteImage` | `destructive` | Delete an item image [DESTRUCTIVE · IRREVERSIBLE] |
| `items.list` | `zohoinventory.api.items.list` | `read` | List inventory items |
| `organizations.list` | `zohoinventory.api.organizations.list` | `read` | List organizations the user can access |
| `packages.bulkPrint` | `zohoinventory.api.packages.bulkPrint` | `read` | Bulk print package slips as PDF |
| `packages.create` | `zohoinventory.api.packages.create` | `write` | Create a package for a sales order |
| `packages.delete` | `zohoinventory.api.packages.delete` | `destructive` | Delete a package [DESTRUCTIVE · IRREVERSIBLE] |
| `purchaseOrders.create` | `zohoinventory.api.purchaseOrders.create` | `write` | Create a purchase order |
| `purchaseOrders.list` | `zohoinventory.api.purchaseOrders.list` | `read` | List purchase orders |
| `salesOrders.bulkDelete` | `zohoinventory.api.salesOrders.bulkDelete` | `destructive` | Bulk delete sales orders [DESTRUCTIVE · IRREVERSIBLE] |
| `salesOrders.create` | `zohoinventory.api.salesOrders.create` | `write` | Create a sales order |
| `salesOrders.delete` | `zohoinventory.api.salesOrders.delete` | `destructive` | Delete a sales order [DESTRUCTIVE · IRREVERSIBLE] |
| `salesOrders.get` | `zohoinventory.api.salesOrders.get` | `read` | Get a sales order |
| `salesOrders.list` | `zohoinventory.api.salesOrders.list` | `read` | List sales orders |
| `users.getCurrent` | `zohoinventory.api.users.getCurrent` | `read` | Get the current authenticated user |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zohoinventory

## License

Apache-2.0
