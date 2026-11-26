# @corsair-dev/moneybird

Accounting with Moneybird: contacts, sales invoices (send, payments, reminders, PDFs and UBL), estimates, subscriptions and recurring invoices, documents (purchase invoices, receipts, journal entries), bank mutations and statements, ledger accounts, products, projects, time entries, task lists, reports, webhooks and the rest of the API (298 operations).

## Install

```bash
pnpm add @corsair-dev/moneybird
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `administrations.list` | `moneybird.api.administrations.list` | `read` | List the administrations the token can access, with id, name, currency and access level |
| `assets.create` | `moneybird.api.assets.create` | `write` | Create a new asset (scope: documents) |
| `assets.delete` | `moneybird.api.assets.delete` | `destructive` | Delete an asset (scope: documents) |
| `assets.disposals.create` | `moneybird.api.assets.disposals.create` | `write` | Create a disposal (scope: documents) |
| `assets.get` | `moneybird.api.assets.get` | `read` | Get an asset by ID (scope: documents) |
| `assets.list` | `moneybird.api.assets.list` | `read` | List all assets, one page at a time (scope: documents) |
| `assets.reinvestmentReservePurchase.create` | `moneybird.api.assets.reinvestmentReservePurchase.create` | `write` | Create a reinvestment reserve purchase: records that part of the asset's purchase value is funded from the reinvestment reserve ("herinvesteringsreserve") (scope: documents) |
| `assets.reinvestmentReservePurchase.delete` | `moneybird.api.assets.reinvestmentReservePurchase.delete` | `destructive` | Delete a reinvestment reserve purchase: removes the reinvestment reserve purchase from the asset (scope: documents) |
| `assets.reinvestmentReserveSale.create` | `moneybird.api.assets.reinvestmentReserveSale.create` | `write` | Create a reinvestment reserve sale: books the book result of the asset's disposal to the reinvestment reserve ("herinvesteringsreserve") (scope: documents) |
| `assets.reinvestmentReserveSale.delete` | `moneybird.api.assets.reinvestmentReserveSale.delete` | `destructive` | Delete a reinvestment reserve sale: removes the reinvestment reserve sale from the asset's disposal (scope: documents) |
| `assets.sources.create` | `moneybird.api.assets.sources.create` | `write` | Add a source to an asset: adds a detail or general journal document entry as a source to an asset (scope: documents) |
| `assets.sources.delete` | `moneybird.api.assets.sources.delete` | `destructive` | Delete a source (scope: documents) |
| `assets.update` | `moneybird.api.assets.update` | `write` | Update an asset (scope: documents) |
| `assets.valueChanges.createArbitrary` | `moneybird.api.assets.valueChanges.createArbitrary` | `write` | Create an arbitrary value change (scope: documents) |
| `assets.valueChanges.createDivestment` | `moneybird.api.assets.valueChanges.createDivestment` | `write` | Create a divestment value change (scope: documents) |
| `assets.valueChanges.createFullDepreciation` | `moneybird.api.assets.valueChanges.createFullDepreciation` | `write` | Create a full depreciation value change (scope: documents) |
| `assets.valueChanges.createManual` | `moneybird.api.assets.valueChanges.createManual` | `write` | Create a manual value change (scope: documents) |
| `assets.valueChanges.createRetroactiveLinear` | `moneybird.api.assets.valueChanges.createRetroactiveLinear` | `write` | Create linear value changes retroactively (scope: documents) |
| `contacts.additionalCharges.create` | `moneybird.api.contacts.additionalCharges.create` | `write` | Create an additional charge to be invoiced at start of next period: at the end of the current period, the additional charges for a contact are merged where possible and an invoice will be created for them (scope: sales_invoices) |
| `contacts.additionalCharges.list` | `moneybird.api.contacts.additionalCharges.list` | `read` | Get additional charges: get the additional charges of the given contact (scope: sales_invoices) |
| `contacts.archive` | `moneybird.api.contacts.archive` | `write` | Archive a contact: archives a contact (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.contactPeople.create` | `moneybird.api.contacts.contactPeople.create` | `write` | Create a new contact person: creating a new contact person in the administration requires at least a `contact_person` hash including `firstname` and `lastname` (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.contactPeople.delete` | `moneybird.api.contacts.contactPeople.delete` | `destructive` | Delete a contact person (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.contactPeople.get` | `moneybird.api.contacts.contactPeople.get` | `read` | Get contact person (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.contactPeople.update` | `moneybird.api.contacts.contactPeople.update` | `write` | Update a contact person: when updating a contact, you only need to provide the information you want to change (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.create` | `moneybird.api.contacts.create` | `write` | Create a new contact: creating a new contact in the administration requires at least a `company_name` or a `firstname` and `lastname` (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.delete` | `moneybird.api.contacts.delete` | `destructive` | Delete a contact (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.fetchByIds` | `moneybird.api.contacts.fetchByIds` | `read` | Fetch contacts with given ids: given a list of contact ids, returns the contact information belonging to the contacts (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.filter` | `moneybird.api.contacts.filter` | `read` | Filter contacts, one page at a time (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.get` | `moneybird.api.contacts.get` | `read` | Get contact (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.getByCustomerId` | `moneybird.api.contacts.getByCustomerId` | `read` | Get contact by customer id (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.list` | `moneybird.api.contacts.list` | `read` | List all contacts, one page at a time (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.listDuplicates` | `moneybird.api.contacts.listDuplicates` | `read` | List possible duplicate contacts, one page at a time (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.listVersions` | `moneybird.api.contacts.listVersions` | `read` | List all ids and versions (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.notes.create` | `moneybird.api.contacts.notes.create` | `write` | Adds note to entity: adds a note to the contact (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.notes.delete` | `moneybird.api.contacts.notes.delete` | `destructive` | Destroys note from entity (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.paymentsMandate.createUrl` | `moneybird.api.contacts.paymentsMandate.createUrl` | `write` | Request an URL for setting up a Moneybird Payments mandate: obtains an URL for setting up a Moneybird Payments mandate (scopes: sales_invoices and settings) |
| `contacts.paymentsMandate.delete` | `moneybird.api.contacts.paymentsMandate.delete` | `destructive` | Delete a stored Moneybird Payments mandate (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.paymentsMandate.get` | `moneybird.api.contacts.paymentsMandate.get` | `read` | Get Moneybird Payments mandate (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `contacts.paymentsMandate.request` | `moneybird.api.contacts.paymentsMandate.request` | `destructive` | Email the contact a request to set up a Moneybird Payments direct debit mandate (they pay 15 cents to confirm) (scopes: sales_invoices and settings) |
| `contacts.update` | `moneybird.api.contacts.update` | `write` | Update a contact: when updating a contact, you only need to provide the information you want to change (scopes: any of estimates, sales_invoices, documents, bank or settings) |
| `customerContactPortal.get` | `moneybird.api.customerContactPortal.get` | `read` | Get a temporary link to the customer contact portal: generate a temporary link to the customer contact portal (scopes: any of sales_invoices or estimates) |
| `customerContactPortal.getSubscription` | `moneybird.api.customerContactPortal.getSubscription` | `read` | Get a temporary link to the subscriptions in the customer contact portal: generate a temporary link to the subscriptions in the customer contact portal (scopes: any of sales_invoices or estimates) |
| `customerContactPortal.listInvoices` | `moneybird.api.customerContactPortal.listInvoices` | `read` | Get a temporary link to the invoices in the customer contact portal: generate a temporary link to the invoices in the customer contact portal (scopes: any of sales_invoices or estimates) |
| `customFields.list` | `moneybird.api.customFields.list` | `read` | List all custom fields: custom fields are used to add extra information to entities in the administration (scopes: any of settings, sales_invoices, documents, estimates or bank) |
| `documents.generalDocuments.attachments.create` | `moneybird.api.documents.generalDocuments.attachments.create` | `write` | Add attachment to general document: add an attachment to a general document (scope: documents) |
| `documents.generalDocuments.attachments.delete` | `moneybird.api.documents.generalDocuments.attachments.delete` | `destructive` | Delete an attachment (scope: documents) |
| `documents.generalDocuments.attachments.download` | `moneybird.api.documents.generalDocuments.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: documents) |
| `documents.generalDocuments.create` | `moneybird.api.documents.generalDocuments.create` | `write` | Create a new general document (scope: documents) |
| `documents.generalDocuments.delete` | `moneybird.api.documents.generalDocuments.delete` | `destructive` | Delete a general document (scope: documents) |
| `documents.generalDocuments.fetchByIds` | `moneybird.api.documents.generalDocuments.fetchByIds` | `read` | Fetch general documents with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents) |
| `documents.generalDocuments.get` | `moneybird.api.documents.generalDocuments.get` | `read` | Get general document (scope: documents) |
| `documents.generalDocuments.list` | `moneybird.api.documents.generalDocuments.list` | `read` | Get general documents, one page at a time (scope: documents) |
| `documents.generalDocuments.listVersions` | `moneybird.api.documents.generalDocuments.listVersions` | `read` | List ids and versions of general documents (scope: documents) |
| `documents.generalDocuments.notes.create` | `moneybird.api.documents.generalDocuments.notes.create` | `write` | Adds note to entity: adds a note to the general document (scope: documents) |
| `documents.generalDocuments.notes.delete` | `moneybird.api.documents.generalDocuments.notes.delete` | `destructive` | Destroys note from entity (scope: documents) |
| `documents.generalDocuments.update` | `moneybird.api.documents.generalDocuments.update` | `write` | Update a general document (scope: documents) |
| `documents.generalJournalDocuments.attachments.create` | `moneybird.api.documents.generalJournalDocuments.attachments.create` | `write` | Add attachment to general journal document: add an attachment to a general journal document (scope: documents) |
| `documents.generalJournalDocuments.attachments.delete` | `moneybird.api.documents.generalJournalDocuments.attachments.delete` | `destructive` | Delete an attachment (scope: documents) |
| `documents.generalJournalDocuments.attachments.download` | `moneybird.api.documents.generalJournalDocuments.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: documents) |
| `documents.generalJournalDocuments.create` | `moneybird.api.documents.generalJournalDocuments.create` | `write` | Create a new general journal document (scope: documents) |
| `documents.generalJournalDocuments.delete` | `moneybird.api.documents.generalJournalDocuments.delete` | `destructive` | Delete a general journal document (scope: documents) |
| `documents.generalJournalDocuments.fetchByIds` | `moneybird.api.documents.generalJournalDocuments.fetchByIds` | `read` | Fetch general journal documents with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents) |
| `documents.generalJournalDocuments.get` | `moneybird.api.documents.generalJournalDocuments.get` | `read` | Get general journal document (scope: documents) |
| `documents.generalJournalDocuments.list` | `moneybird.api.documents.generalJournalDocuments.list` | `read` | Get general journal documents, one page at a time (scope: documents) |
| `documents.generalJournalDocuments.listVersions` | `moneybird.api.documents.generalJournalDocuments.listVersions` | `read` | List ids and versions of general journal documents (scope: documents) |
| `documents.generalJournalDocuments.notes.create` | `moneybird.api.documents.generalJournalDocuments.notes.create` | `write` | Adds note to entity: adds a note to the general journal document (scope: documents) |
| `documents.generalJournalDocuments.notes.delete` | `moneybird.api.documents.generalJournalDocuments.notes.delete` | `destructive` | Destroys note from entity (scope: documents) |
| `documents.generalJournalDocuments.update` | `moneybird.api.documents.generalJournalDocuments.update` | `write` | Update a general journal document (scope: documents) |
| `documents.purchaseInvoices.attachments.create` | `moneybird.api.documents.purchaseInvoices.attachments.create` | `write` | Add attachment to purchase invoice: add an attachment to a purchase invoice (scope: documents) |
| `documents.purchaseInvoices.attachments.delete` | `moneybird.api.documents.purchaseInvoices.attachments.delete` | `destructive` | Delete an attachment (scope: documents) |
| `documents.purchaseInvoices.attachments.download` | `moneybird.api.documents.purchaseInvoices.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: documents) |
| `documents.purchaseInvoices.create` | `moneybird.api.documents.purchaseInvoices.create` | `write` | Create a new purchase invoice (scope: documents) |
| `documents.purchaseInvoices.delete` | `moneybird.api.documents.purchaseInvoices.delete` | `destructive` | Delete a purchase invoices (scope: documents) |
| `documents.purchaseInvoices.fetchByIds` | `moneybird.api.documents.purchaseInvoices.fetchByIds` | `read` | Fetch purchase invoices with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents) |
| `documents.purchaseInvoices.get` | `moneybird.api.documents.purchaseInvoices.get` | `read` | Get purchase invoice (scope: documents) |
| `documents.purchaseInvoices.list` | `moneybird.api.documents.purchaseInvoices.list` | `read` | Get purchase invoices, one page at a time (scope: documents) |
| `documents.purchaseInvoices.listVersions` | `moneybird.api.documents.purchaseInvoices.listVersions` | `read` | List ids and versions of purchase invoices (scope: documents) |
| `documents.purchaseInvoices.notes.create` | `moneybird.api.documents.purchaseInvoices.notes.create` | `write` | Adds note to entity: adds a note to the purchase invoice (scope: documents) |
| `documents.purchaseInvoices.notes.delete` | `moneybird.api.documents.purchaseInvoices.notes.delete` | `destructive` | Destroys note from entity (scope: documents) |
| `documents.purchaseInvoices.payments.create` | `moneybird.api.documents.purchaseInvoices.payments.create` | `write` | Create a payment: registers a payment for a purchase invoice (scope: documents) |
| `documents.purchaseInvoices.payments.delete` | `moneybird.api.documents.purchaseInvoices.payments.delete` | `destructive` | Delete a payment (scope: documents) |
| `documents.purchaseInvoices.update` | `moneybird.api.documents.purchaseInvoices.update` | `write` | Update purchase invoice (scope: documents) |
| `documents.receipts.attachments.create` | `moneybird.api.documents.receipts.attachments.create` | `write` | Add attachment to receipt: add an attachment to a receipt (scope: documents) |
| `documents.receipts.attachments.delete` | `moneybird.api.documents.receipts.attachments.delete` | `destructive` | Delete an attachment (scope: documents) |
| `documents.receipts.attachments.download` | `moneybird.api.documents.receipts.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: documents) |
| `documents.receipts.create` | `moneybird.api.documents.receipts.create` | `write` | Create a new receipt (scope: documents) |
| `documents.receipts.delete` | `moneybird.api.documents.receipts.delete` | `destructive` | Delete a receipts (scope: documents) |
| `documents.receipts.fetchByIds` | `moneybird.api.documents.receipts.fetchByIds` | `read` | Fetch receipts with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents) |
| `documents.receipts.get` | `moneybird.api.documents.receipts.get` | `read` | Get a receipt (scope: documents) |
| `documents.receipts.list` | `moneybird.api.documents.receipts.list` | `read` | List receipts, one page at a time (scope: documents) |
| `documents.receipts.listVersions` | `moneybird.api.documents.receipts.listVersions` | `read` | List ids and versions of receipts (scope: documents) |
| `documents.receipts.notes.create` | `moneybird.api.documents.receipts.notes.create` | `write` | Adds note to entity: adds a note to the receipt (scope: documents) |
| `documents.receipts.notes.delete` | `moneybird.api.documents.receipts.notes.delete` | `destructive` | Destroys note from entity (scope: documents) |
| `documents.receipts.payments.create` | `moneybird.api.documents.receipts.payments.create` | `write` | Create a payment: registers a payment for a receipt (scope: documents) |
| `documents.receipts.payments.delete` | `moneybird.api.documents.receipts.payments.delete` | `destructive` | Delete a payment (scope: documents) |
| `documents.receipts.update` | `moneybird.api.documents.receipts.update` | `write` | Update a receipt (scope: documents) |
| `documents.typelessDocuments.attachments.create` | `moneybird.api.documents.typelessDocuments.attachments.create` | `write` | Add attachment to typeless document: add an attachment to a typeless document (scope: documents) |
| `documents.typelessDocuments.attachments.delete` | `moneybird.api.documents.typelessDocuments.attachments.delete` | `destructive` | Delete an attachment (scope: documents) |
| `documents.typelessDocuments.attachments.download` | `moneybird.api.documents.typelessDocuments.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: documents) |
| `documents.typelessDocuments.create` | `moneybird.api.documents.typelessDocuments.create` | `write` | Create a new typeless document (scope: documents) |
| `documents.typelessDocuments.delete` | `moneybird.api.documents.typelessDocuments.delete` | `destructive` | Delete a typeless document (scope: documents) |
| `documents.typelessDocuments.fetchByIds` | `moneybird.api.documents.typelessDocuments.fetchByIds` | `read` | Fetch typeless documents with given ids: given a list of document ids, returns the document information belonging to the documents (scope: documents) |
| `documents.typelessDocuments.get` | `moneybird.api.documents.typelessDocuments.get` | `read` | Get a typeless document (scope: documents) |
| `documents.typelessDocuments.list` | `moneybird.api.documents.typelessDocuments.list` | `read` | Get typeless documents, one page at a time (scope: documents) |
| `documents.typelessDocuments.listVersions` | `moneybird.api.documents.typelessDocuments.listVersions` | `read` | List ids and versions of typeless documents (scope: documents) |
| `documentStyles.list` | `moneybird.api.documentStyles.list` | `read` | List all document styles (scopes: any of settings, sales_invoices or estimates) |
| `downloads.download` | `moneybird.api.downloads.download` | `read` | Download a file (returned as a file) |
| `downloads.list` | `moneybird.api.downloads.list` | `read` | List all downloads, one page at a time |
| `estimates.attachments.create` | `moneybird.api.estimates.attachments.create` | `write` | Add attachment to estimate: add an attachment to an estimate (scope: estimates) |
| `estimates.attachments.delete` | `moneybird.api.estimates.attachments.delete` | `destructive` | Delete an attachment (scope: estimates) |
| `estimates.attachments.download` | `moneybird.api.estimates.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: estimates) |
| `estimates.bill` | `moneybird.api.estimates.bill` | `write` | Bills an estimate: an invoice is created based on the accepted estimate (scopes: estimates and sales_invoices) |
| `estimates.changeState` | `moneybird.api.estimates.changeState` | `write` | Changes the state of an estimate: not every state change is allowed (scope: estimates) |
| `estimates.create` | `moneybird.api.estimates.create` | `write` | Creates a new estimate (scope: estimates) |
| `estimates.delete` | `moneybird.api.estimates.delete` | `destructive` | Deletes an estimate (scope: estimates) |
| `estimates.downloadPdf` | `moneybird.api.estimates.downloadPdf` | `read` | Download estimate PDF by id: redirects to the download URL of the estimate as PDF (returned as a file) (scope: estimates) |
| `estimates.downloadSignedPdf` | `moneybird.api.estimates.downloadSignedPdf` | `read` | Download signed estimate PDF by id: redirects to the download URL of the estimate PDF that the contact signed online (returned as a file) (scope: estimates) |
| `estimates.fetchByIds` | `moneybird.api.estimates.fetchByIds` | `read` | Fetch estimates with given ids: given a list of estimate ids, returns the estimate information belonging to the estimates (scope: estimates) |
| `estimates.get` | `moneybird.api.estimates.get` | `read` | Get an estimate by id (scope: estimates) |
| `estimates.getByEstimateId` | `moneybird.api.estimates.getByEstimateId` | `read` | Get an estimate by estimate_id (scope: estimates) |
| `estimates.list` | `moneybird.api.estimates.list` | `read` | List all estimates, one page at a time (scope: estimates) |
| `estimates.listVersions` | `moneybird.api.estimates.listVersions` | `read` | List all ids and versions (scope: estimates) |
| `estimates.notes.create` | `moneybird.api.estimates.notes.create` | `write` | Adds note to entity: adds a note to the estimate (scope: estimates) |
| `estimates.notes.delete` | `moneybird.api.estimates.notes.delete` | `destructive` | Destroys note from entity (scope: estimates) |
| `estimates.send` | `moneybird.api.estimates.send` | `destructive` | Send an estimate to the contact (sends real email) or schedule it (scope: estimates) |
| `estimates.update` | `moneybird.api.estimates.update` | `write` | Updates an estimate: when updating an estimate, provide only the attributes you want to update (scope: estimates) |
| `events.list` | `moneybird.api.events.list` | `read` | List events |
| `externalSalesInvoices.attachments.create` | `moneybird.api.externalSalesInvoices.attachments.create` | `write` | Add attachment to external sales invoice: add an attachment to an external sales invoice (scope: sales_invoices) |
| `externalSalesInvoices.attachments.delete` | `moneybird.api.externalSalesInvoices.attachments.delete` | `destructive` | Delete an attachment (scope: sales_invoices) |
| `externalSalesInvoices.attachments.download` | `moneybird.api.externalSalesInvoices.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: sales_invoices) |
| `externalSalesInvoices.create` | `moneybird.api.externalSalesInvoices.create` | `write` | Create an external sales invoice (scope: sales_invoices) |
| `externalSalesInvoices.createFromAttachment` | `moneybird.api.externalSalesInvoices.createFromAttachment` | `write` | Create external sales invoice from attachment (scope: sales_invoices) |
| `externalSalesInvoices.delete` | `moneybird.api.externalSalesInvoices.delete` | `destructive` | Delete an external sales invoice (scope: sales_invoices) |
| `externalSalesInvoices.fetchByIds` | `moneybird.api.externalSalesInvoices.fetchByIds` | `read` | Fetch external sales invoices with given ids: given a list of external sales invoice ids, returns the external sales invoice information belonging to the external sales invoice (scope: sales_invoices) |
| `externalSalesInvoices.get` | `moneybird.api.externalSalesInvoices.get` | `read` | Get an external sales invoice by id (scope: sales_invoices) |
| `externalSalesInvoices.list` | `moneybird.api.externalSalesInvoices.list` | `read` | List all external invoices, one page at a time (scope: sales_invoices) |
| `externalSalesInvoices.listVersions` | `moneybird.api.externalSalesInvoices.listVersions` | `read` | List all ids and versions (scope: sales_invoices) |
| `externalSalesInvoices.markAsDubious` | `moneybird.api.externalSalesInvoices.markAsDubious` | `write` | Mark as dubious: this endpoint marks an external sales invoice as dubious (scope: sales_invoices) |
| `externalSalesInvoices.markAsUncollectible` | `moneybird.api.externalSalesInvoices.markAsUncollectible` | `write` | Mark as uncollectible: this endpoint marks an external sales invoice as uncollectible (scope: sales_invoices) |
| `externalSalesInvoices.notes.create` | `moneybird.api.externalSalesInvoices.notes.create` | `write` | Adds note to entity: adds a note to the external sales invoice (scope: sales_invoices) |
| `externalSalesInvoices.notes.delete` | `moneybird.api.externalSalesInvoices.notes.delete` | `destructive` | Destroys note from entity (scope: sales_invoices) |
| `externalSalesInvoices.payments.create` | `moneybird.api.externalSalesInvoices.payments.create` | `write` | Create a payment: registers a payment for an external sales invoice (scope: sales_invoices) |
| `externalSalesInvoices.payments.delete` | `moneybird.api.externalSalesInvoices.payments.delete` | `destructive` | Delete a payment (scope: sales_invoices) |
| `externalSalesInvoices.update` | `moneybird.api.externalSalesInvoices.update` | `write` | Update an external sales invoice: when updating an external sales invoice, provide only the attributes you want to update (scope: sales_invoices) |
| `financialAccounts.list` | `moneybird.api.financialAccounts.list` | `read` | Retrieve all available financial accounts for the administration: retrieve the financial accounts for the administration (scope: settings) |
| `financialMutations.fetchByIds` | `moneybird.api.financialMutations.fetchByIds` | `read` | Fetch financial mutations with given ids: given a list of financial mutation ids, returns the financial mutation information belonging to the financial mutation (scope: bank) |
| `financialMutations.get` | `moneybird.api.financialMutations.get` | `read` | Get a financial mutation by id (scope: bank) |
| `financialMutations.linkBooking` | `moneybird.api.financialMutations.linkBooking` | `write` | Links a financial mutation to a booking: linking a booking to a financial mutation allows you to process financial mutations (scope: bank) |
| `financialMutations.list` | `moneybird.api.financialMutations.list` | `read` | List all financial mutations (scope: bank) |
| `financialMutations.listVersions` | `moneybird.api.financialMutations.listVersions` | `read` | List all ids and versions (scope: bank) |
| `financialMutations.unlinkBooking` | `moneybird.api.financialMutations.unlinkBooking` | `destructive` | Unlinks a booking from a financial mutation (scope: bank) |
| `financialStatements.create` | `moneybird.api.financialStatements.create` | `write` | Create a new financial statement (scope: bank) |
| `financialStatements.delete` | `moneybird.api.financialStatements.delete` | `destructive` | Delete a financial statement (scope: bank) |
| `financialStatements.update` | `moneybird.api.financialStatements.update` | `write` | Update a financial statement: when updating a financial statement, you only need to provide the information you want to change (scope: bank) |
| `identities.create` | `moneybird.api.identities.create` | `write` | Creates an identity: most fields for an identity are required (scope: settings) |
| `identities.delete` | `moneybird.api.identities.delete` | `destructive` | Deletes an identity (scope: settings) |
| `identities.get` | `moneybird.api.identities.get` | `read` | Retrieve identity by given id (scope: settings) |
| `identities.getDefault` | `moneybird.api.identities.getDefault` | `read` | Retrieve the default identity (scope: settings) |
| `identities.list` | `moneybird.api.identities.list` | `read` | Retrieve identities: an administration can have multiple identities, for example to cover multiple tradenames or offices (scope: settings) |
| `identities.update` | `moneybird.api.identities.update` | `write` | Updates an identity (scope: settings) |
| `identities.updateDefault` | `moneybird.api.identities.updateDefault` | `write` | Updates the default identity (scope: settings) |
| `ledgerAccounts.create` | `moneybird.api.ledgerAccounts.create` | `write` | Creates a new ledger account (scope: settings) |
| `ledgerAccounts.delete` | `moneybird.api.ledgerAccounts.delete` | `destructive` | Deletes a ledger account (scope: settings) |
| `ledgerAccounts.get` | `moneybird.api.ledgerAccounts.get` | `read` | Returns information about a ledger account (scopes: any of settings, sales_invoices, documents or estimates) |
| `ledgerAccounts.list` | `moneybird.api.ledgerAccounts.list` | `read` | List all ledger accounts of an administration (scopes: any of settings, sales_invoices, documents or estimates) |
| `ledgerAccounts.update` | `moneybird.api.ledgerAccounts.update` | `write` | Updates a ledger account (scope: settings) |
| `payments.get` | `moneybird.api.payments.get` | `read` | Returns information about a payment |
| `products.create` | `moneybird.api.products.create` | `write` | Creates a new product (scope: settings) |
| `products.createSalesLink` | `moneybird.api.products.createSalesLink` | `write` | Create online sales link: this call generates an online sales link, and allows pre-setting the contact for a checkout page (scope: settings) |
| `products.delete` | `moneybird.api.products.delete` | `destructive` | Deletes a product (scope: settings) |
| `products.get` | `moneybird.api.products.get` | `read` | Returns information about a product (scope: settings) |
| `products.getByIdentifier` | `moneybird.api.products.getByIdentifier` | `read` | Returns information about a product based on the identifier: finds the product by the identifier field of the product (scope: settings) |
| `products.list` | `moneybird.api.products.list` | `read` | List all products of an administration, one page at a time (scope: settings) |
| `products.update` | `moneybird.api.products.update` | `write` | Updates a product (scope: settings) |
| `projects.create` | `moneybird.api.projects.create` | `write` | Create a project; the name must be unique within the administration (scope: settings) |
| `projects.delete` | `moneybird.api.projects.delete` | `destructive` | Deletes a project (scope: settings) |
| `projects.get` | `moneybird.api.projects.get` | `read` | Returns information about a project (scope: settings) |
| `projects.list` | `moneybird.api.projects.list` | `read` | List all projects of an administration, one page at a time (scope: settings) |
| `projects.update` | `moneybird.api.projects.update` | `write` | Updates a project (scope: settings) |
| `purchaseTransactionBatches.createFromSepaFile` | `moneybird.api.purchaseTransactionBatches.createFromSepaFile` | `destructive` | Upload a SEPA credit transfer file to create purchase transaction batches: upload a SEPA credit transfer file (pain.001.001.09/Version 2019) to create purchase transaction batches (scope: bank) |
| `purchaseTransactionBatches.download` | `moneybird.api.purchaseTransactionBatches.download` | `read` | Download a purchase transaction batch as SEPA credit transfer file: download the purchase transaction batch as a SEPA credit transfer file (pain.001) (returned as a file) (scope: bank) |
| `purchaseTransactionBatches.get` | `moneybird.api.purchaseTransactionBatches.get` | `read` | Get a purchase transaction batch by id (scope: bank) |
| `purchaseTransactions.delete` | `moneybird.api.purchaseTransactions.delete` | `destructive` | Delete a purchase transaction (scope: bank) |
| `purchaseTransactions.get` | `moneybird.api.purchaseTransactions.get` | `read` | Get a purchase transaction by id (scope: bank) |
| `purchaseTransactions.list` | `moneybird.api.purchaseTransactions.list` | `read` | List all purchase transactions, one page at a time (scope: bank) |
| `recurringSalesInvoices.create` | `moneybird.api.recurringSalesInvoices.create` | `destructive` | Creates a new recurring sales invoice: a recurring sales invoice will create new sales invoices on set intervals (scope: sales_invoices) |
| `recurringSalesInvoices.deactivate` | `moneybird.api.recurringSalesInvoices.deactivate` | `write` | Deactivate a recurring sales invoice: stops a recurring sales invoice from creating new sales invoices (scope: sales_invoices) |
| `recurringSalesInvoices.delete` | `moneybird.api.recurringSalesInvoices.delete` | `destructive` | Destroy or deactivate a recurring sales invoice: a recurring sales invoice will be destroyed if it has not created any sales invoices (scope: sales_invoices) |
| `recurringSalesInvoices.fetchByIds` | `moneybird.api.recurringSalesInvoices.fetchByIds` | `read` | Fetch recurring sales invoices with given IDs: given a list of recurring sales invoice IDs, returns the details of the recurring invoices (scope: sales_invoices) |
| `recurringSalesInvoices.get` | `moneybird.api.recurringSalesInvoices.get` | `read` | Get a recurring sales invoice by id (scope: sales_invoices) |
| `recurringSalesInvoices.list` | `moneybird.api.recurringSalesInvoices.list` | `read` | List all recurring sales invoices, one page at a time (scope: sales_invoices) |
| `recurringSalesInvoices.listVersions` | `moneybird.api.recurringSalesInvoices.listVersions` | `read` | List all IDs and versions (scope: sales_invoices) |
| `recurringSalesInvoices.notes.create` | `moneybird.api.recurringSalesInvoices.notes.create` | `write` | Adds note to entity: adds a note to the recurring sales invoice (scope: sales_invoices) |
| `recurringSalesInvoices.notes.delete` | `moneybird.api.recurringSalesInvoices.notes.delete` | `destructive` | Destroys note from entity (scope: sales_invoices) |
| `recurringSalesInvoices.update` | `moneybird.api.recurringSalesInvoices.update` | `write` | Updates a recurring sales invoice (scope: sales_invoices) |
| `reports.assets` | `moneybird.api.reports.assets` | `read` | Assets report: get the assets report for the administration (scope: documents) |
| `reports.balanceSheet` | `moneybird.api.reports.balanceSheet` | `read` | Balance sheet report: get the balance sheet report for the administration showing the financial position at the end of the specified period (scope: bank) |
| `reports.bankBalance` | `moneybird.api.reports.bankBalance` | `read` | Bank balance report: get the booked balance of each financial account at the end of the specified period (scope: bank) |
| `reports.cashFlow` | `moneybird.api.reports.cashFlow` | `read` | Cash flow report: get the cash flow report for the administration showing cash received and cash paid during the specified period (scope: bank) |
| `reports.creditors` | `moneybird.api.reports.creditors` | `read` | Creditors report (scope: documents) |
| `reports.creditorsAging` | `moneybird.api.reports.creditorsAging` | `read` | Creditors aging report (scope: documents) |
| `reports.debtors` | `moneybird.api.reports.debtors` | `read` | Debtors report (scope: sales_invoices) |
| `reports.debtorsAging` | `moneybird.api.reports.debtorsAging` | `read` | Debtors aging report (scope: sales_invoices) |
| `reports.expensesByContact` | `moneybird.api.reports.expensesByContact` | `read` | Expenses by contact report (scope: documents) |
| `reports.expensesByProject` | `moneybird.api.reports.expensesByProject` | `read` | Expenses by project report (scope: documents) |
| `reports.exportAuditfile` | `moneybird.api.reports.exportAuditfile` | `write` | Export auditfile: queue the export of an auditfile (XAF XML format) for the specified year (scopes: bank, documents, estimates, sales_invoices and settings) |
| `reports.exportBrugstaat` | `moneybird.api.reports.exportBrugstaat` | `write` | Export brugstaat: queue the export of a brugstaat XML file for the specified year (scopes: bank, documents and sales_invoices) |
| `reports.exportLedgerAccounts` | `moneybird.api.reports.exportLedgerAccounts` | `write` | Export ledger accounts: queue the export of ledger accounts (grootboekkaarten) to an Excel file for the specified year (scopes: documents and sales_invoices) |
| `reports.generalLedger` | `moneybird.api.reports.generalLedger` | `read` | General ledger report: get the general ledger report for the administration showing all ledger accounts with their balances and movements during the specified period (scope: bank) |
| `reports.journalEntries` | `moneybird.api.reports.journalEntries` | `read` | Journal entries report: get the journal entries report showing all bookings within the specified period, one page at a time (scopes: documents and sales_invoices) |
| `reports.profitLoss` | `moneybird.api.reports.profitLoss` | `read` | Profit loss report: get the profit loss report for the administration (scopes: documents and sales_invoices) |
| `reports.revenueByContact` | `moneybird.api.reports.revenueByContact` | `read` | Revenue by contact report (scope: sales_invoices) |
| `reports.revenueByProject` | `moneybird.api.reports.revenueByProject` | `read` | Revenue by project report (scope: sales_invoices) |
| `reports.subscriptions` | `moneybird.api.reports.subscriptions` | `read` | Subscriptions report: get the subscriptions report for the administration (scope: sales_invoices) |
| `reports.tax` | `moneybird.api.reports.tax` | `read` | Tax report: get the tax report for the administration (scopes: documents and sales_invoices) |
| `reports.workingCapital` | `moneybird.api.reports.workingCapital` | `read` | Working capital report: get the working capital of the administration at the end of the specified period, with the same figures as the balance card on the reports page (scope: bank) |
| `salesInvoices.attachments.create` | `moneybird.api.salesInvoices.attachments.create` | `write` | Add attachment to sales invoice: add an attachment to a sales invoice (scope: sales_invoices) |
| `salesInvoices.attachments.delete` | `moneybird.api.salesInvoices.attachments.delete` | `destructive` | Delete an attachment (scope: sales_invoices) |
| `salesInvoices.attachments.download` | `moneybird.api.salesInvoices.attachments.download` | `read` | Download attachment: download the attachment (returned as a file) (scope: sales_invoices) |
| `salesInvoices.create` | `moneybird.api.salesInvoices.create` | `write` | Create a sales invoice: create a sales invoice with the parameters defined in the request body (scope: sales_invoices) |
| `salesInvoices.delete` | `moneybird.api.salesInvoices.delete` | `destructive` | Delete a sales invoice (scope: sales_invoices) |
| `salesInvoices.downloadPackingSlipPdf` | `moneybird.api.salesInvoices.downloadPackingSlipPdf` | `read` | Download sales invoice packing slip PDF by id: redirects to the download URL of the sales invoice as packing slip PDF (returned as a file) (scope: sales_invoices) |
| `salesInvoices.downloadPdf` | `moneybird.api.salesInvoices.downloadPdf` | `read` | Download sales invoice PDF by id: redirects to the download URL of the sales invoice as PDF (returned as a file) (scope: sales_invoices) |
| `salesInvoices.downloadUbl` | `moneybird.api.salesInvoices.downloadUbl` | `read` | Download sales invoice UBL by id: download the sales invoice as UBL (returned as a file) (scope: sales_invoices) |
| `salesInvoices.duplicateAsCreditInvoice` | `moneybird.api.salesInvoices.duplicateAsCreditInvoice` | `write` | Duplicate to credit invoice: duplicate a sales invoice to a new credit invoice (scope: sales_invoices) |
| `salesInvoices.fetchByIds` | `moneybird.api.salesInvoices.fetchByIds` | `read` | Fetch sales invoices with given ids: given a list of sales invoice ids, returns the sales invoice information belonging to the invoices (scope: sales_invoices) |
| `salesInvoices.get` | `moneybird.api.salesInvoices.get` | `read` | Get an invoice by id (scope: sales_invoices) |
| `salesInvoices.getByInvoiceId` | `moneybird.api.salesInvoices.getByInvoiceId` | `read` | Get an invoice by invoice_id: get a sales invoice by the invoice_id field of the sales invoice (scope: sales_invoices) |
| `salesInvoices.getByReference` | `moneybird.api.salesInvoices.getByReference` | `read` | Get an invoice by reference: get a sales invoice by the reference field of the sales invoice (scope: sales_invoices) |
| `salesInvoices.list` | `moneybird.api.salesInvoices.list` | `read` | List sales invoices with a filter string such as 'state:open\|paid' or 'period:this_year', one page at a time (scope: sales_invoices) |
| `salesInvoices.listVersions` | `moneybird.api.salesInvoices.listVersions` | `read` | List all ids and versions (scope: sales_invoices) |
| `salesInvoices.markAsDubious` | `moneybird.api.salesInvoices.markAsDubious` | `write` | Mark as dubious: this endpoint marks a sales invoice as dubious (scope: sales_invoices) |
| `salesInvoices.markAsUncollectible` | `moneybird.api.salesInvoices.markAsUncollectible` | `write` | Mark as uncollectible: this endpoint marks a sales invoice as uncollectible (scope: sales_invoices) |
| `salesInvoices.notes.create` | `moneybird.api.salesInvoices.notes.create` | `write` | Adds note to entity: adds a note to the sales invoice (scope: sales_invoices) |
| `salesInvoices.notes.delete` | `moneybird.api.salesInvoices.notes.delete` | `destructive` | Destroys note from entity (scope: sales_invoices) |
| `salesInvoices.pause` | `moneybird.api.salesInvoices.pause` | `write` | Pause sales invoice: this endpoint pauses a sales invoice (scope: sales_invoices) |
| `salesInvoices.payments.create` | `moneybird.api.salesInvoices.payments.create` | `write` | Create a payment: registers a payment for a sales invoice (scope: sales_invoices) |
| `salesInvoices.payments.delete` | `moneybird.api.salesInvoices.payments.delete` | `destructive` | Delete a payment: delete a payment from a sales invoice (scope: sales_invoices) |
| `salesInvoices.registerCreditInvoicePayment` | `moneybird.api.salesInvoices.registerCreditInvoicePayment` | `write` | Register a payment for a creditinvoice: settles a credit invoice against the sales invoice it credits (scope: sales_invoices) |
| `salesInvoices.resume` | `moneybird.api.salesInvoices.resume` | `write` | Resume sales invoice: this endpoint resumes the sales invoice (scope: sales_invoices) |
| `salesInvoices.send` | `moneybird.api.salesInvoices.send` | `destructive` | Send the invoice to the customer now (email, Peppol, post or manual) or schedule it for a date; defaults come from the contact and workflow (scope: sales_invoices) |
| `salesInvoices.sendReminders` | `moneybird.api.salesInvoices.sendReminders` | `destructive` | Send payment reminders for overdue sales invoices to their contacts (sends real email) (scope: sales_invoices) |
| `salesInvoices.update` | `moneybird.api.salesInvoices.update` | `write` | Update a sales invoice: when updating a sales invoice, provide only the attributes you want to update (scope: sales_invoices) |
| `subscriptions.additionalCharges.create` | `moneybird.api.subscriptions.additionalCharges.create` | `write` | Create an additional charge to be invoiced together with the subscription: at the end of the current subscription period, the additional charges are merged where possible and an invoice will be created for them (scope: sales_invoices) |
| `subscriptions.additionalCharges.list` | `moneybird.api.subscriptions.additionalCharges.list` | `read` | Get additional charges: get the additional charges of the given subscription (scope: sales_invoices) |
| `subscriptions.create` | `moneybird.api.subscriptions.create` | `destructive` | Create a new subscription: starts a new subscription for the given contact (scope: sales_invoices) |
| `subscriptions.createAndScheduleOneOffSalesInvoice` | `moneybird.api.subscriptions.createAndScheduleOneOffSalesInvoice` | `destructive` | Create and schedule an invoice to be sent together with the subscription: besides the recurring sales invoice for the subscription, you sometimes need to bill separate costs like usage based charges (scope: sales_invoices) |
| `subscriptions.delete` | `moneybird.api.subscriptions.delete` | `destructive` | Cancel a subscription: cancels the subscription (scope: sales_invoices) |
| `subscriptions.get` | `moneybird.api.subscriptions.get` | `read` | Get subscription: get a subscription (scope: sales_invoices) |
| `subscriptions.list` | `moneybird.api.subscriptions.list` | `read` | List subscriptions of a contact: lists the subscriptions of a single contact (scope: sales_invoices) |
| `subscriptions.update` | `moneybird.api.subscriptions.update` | `write` | Update a subscription (scope: sales_invoices) |
| `subscriptionTemplates.createSalesLink` | `moneybird.api.subscriptionTemplates.createSalesLink` | `write` | Create online sales link: this call generates an online sales link, and allows pre-setting the contact and start date for a subscription (scope: settings) |
| `subscriptionTemplates.list` | `moneybird.api.subscriptionTemplates.list` | `read` | List all subscription templates: this call retrieves a paginated list of all subscription templates available in the administration, one page at a time (scope: settings) |
| `taskListGroups.delete` | `moneybird.api.taskListGroups.delete` | `destructive` | Deletes a task list group: permanently deletes a task list group and all its tasks (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListGroups.get` | `moneybird.api.taskListGroups.get` | `read` | Returns information about a task list group (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListGroups.tasks.create` | `moneybird.api.taskListGroups.tasks.create` | `write` | Creates a new task in a group (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListGroups.update` | `moneybird.api.taskListGroups.update` | `write` | Updates a task list group (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskLists.create` | `moneybird.api.taskLists.create` | `write` | Creates a new task list (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskLists.delete` | `moneybird.api.taskLists.delete` | `destructive` | Deletes a task list: permanently deletes a task list and all its groups and tasks (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskLists.get` | `moneybird.api.taskLists.get` | `read` | Returns information about a task list (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskLists.groups.create` | `moneybird.api.taskLists.groups.create` | `write` | Creates a new group in a task list (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskLists.list` | `moneybird.api.taskLists.list` | `read` | List all task lists of an administration, one page at a time (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskLists.update` | `moneybird.api.taskLists.update` | `write` | Updates a task list (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.assign` | `moneybird.api.taskListTasks.assign` | `write` | Assigns a user to a task: assigns a user to the specified task (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.complete` | `moneybird.api.taskListTasks.complete` | `write` | Completes a task: marks a task and all its subtasks as completed (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.delete` | `moneybird.api.taskListTasks.delete` | `destructive` | Deletes a task: permanently deletes a task and all its subtasks (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.get` | `moneybird.api.taskListTasks.get` | `read` | Returns information about a task (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.notes.create` | `moneybird.api.taskListTasks.notes.create` | `write` | Creates a note on a task (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.reopen` | `moneybird.api.taskListTasks.reopen` | `destructive` | Reopens a task: reopens a completed task and possible parent tasks (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.unassign` | `moneybird.api.taskListTasks.unassign` | `destructive` | Unassigns the user from a task: removes the current assignment from the specified task (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTasks.update` | `moneybird.api.taskListTasks.update` | `write` | Updates a task (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.create` | `moneybird.api.taskListTemplates.create` | `write` | Creates a new task list template (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.createTaskList` | `moneybird.api.taskListTemplates.createTaskList` | `write` | Creates a task list from a template (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.delete` | `moneybird.api.taskListTemplates.delete` | `destructive` | Deletes a task list template: permanently deletes a task list template and all its groups and tasks (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.get` | `moneybird.api.taskListTemplates.get` | `read` | Returns information about a task list template (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.groups.create` | `moneybird.api.taskListTemplates.groups.create` | `write` | Creates a new group in a task list template (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.list` | `moneybird.api.taskListTemplates.list` | `read` | List all task list templates of an administration (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taskListTemplates.update` | `moneybird.api.taskListTemplates.update` | `write` | Updates a task list template (scopes: bank, documents, estimates, sales_invoices, settings and time_entries) |
| `taxRates.list` | `moneybird.api.taxRates.list` | `read` | List all available tax rates for the administration, one page at a time (scopes: any of settings, sales_invoices, documents or estimates) |
| `timeEntries.create` | `moneybird.api.timeEntries.create` | `write` | Create a time entry from started_at to ended_at; Moneybird rounds to full minutes (scope: time_entries) |
| `timeEntries.delete` | `moneybird.api.timeEntries.delete` | `destructive` | Delete a time entry: delete a time entry by id (scope: time_entries) |
| `timeEntries.get` | `moneybird.api.timeEntries.get` | `read` | Get a time entry by id (scope: time_entries) |
| `timeEntries.list` | `moneybird.api.timeEntries.list` | `read` | List all time entries, one page at a time (scope: time_entries) |
| `timeEntries.notes.create` | `moneybird.api.timeEntries.notes.create` | `write` | Adds note to entity: adds a note to the time entry (scope: time_entries) |
| `timeEntries.notes.delete` | `moneybird.api.timeEntries.notes.delete` | `destructive` | Destroys note from entity (scope: time_entries) |
| `timeEntries.resume` | `moneybird.api.timeEntries.resume` | `write` | Resume a stopped timer: resumes a stopped time entry (scope: time_entries) |
| `timeEntries.stop` | `moneybird.api.timeEntries.stop` | `write` | Stops an active time entry (scope: time_entries) |
| `timeEntries.update` | `moneybird.api.timeEntries.update` | `write` | Update a time entry: when updating a time entry, provide only the attributes you want to update (scope: time_entries) |
| `users.list` | `moneybird.api.users.list` | `read` | List all users (scope: settings) |
| `verifications.list` | `moneybird.api.verifications.list` | `read` | Retrieve verifications: retrieve all the verifications within an administration (scope: settings) |
| `webhooks.activate` | `moneybird.api.webhooks.activate` | `write` | Activate a webhook: activates a previously deactivated webhook (scope: settings) |
| `webhooks.create` | `moneybird.api.webhooks.create` | `write` | Create a webhook (scope: settings) |
| `webhooks.deactivate` | `moneybird.api.webhooks.deactivate` | `write` | Deactivate a webhook: deactivates a webhook (scope: settings) |
| `webhooks.delete` | `moneybird.api.webhooks.delete` | `destructive` | Delete a webhook: remove a registered webhook (scope: settings) |
| `webhooks.list` | `moneybird.api.webhooks.list` | `read` | List all webhooks: list all registered webhooks for the administration (scope: settings) |
| `workflows.get` | `moneybird.api.workflows.get` | `read` | Get a workflow by id (scopes: any of settings, sales_invoices, documents, estimates or bank) |
| `workflows.list` | `moneybird.api.workflows.list` | `read` | Retrieve available workflows (scopes: any of settings, sales_invoices, documents, estimates or bank) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moneybird

## License

Apache-2.0
