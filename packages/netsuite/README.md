# @corsair-dev/netsuite

NetSuite plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/netsuite
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asyncJobs.asyncGetJobStatus` | `netsuite.api.asyncJobs.asyncGetJobStatus` | `read` | Retrieve the status of an asynchronous NetSuite REST job |
| `asyncJobs.asyncGetJobTask` | `netsuite.api.asyncJobs.asyncGetJobTask` | `read` | Retrieve the task reference and status for an asynchronous job |
| `asyncJobs.asyncGetJobTaskResult` | `netsuite.api.asyncJobs.asyncGetJobTaskResult` | `read` | Retrieve the result of an asynchronous job task |
| `customerPayments.createCustomerPayment` | `netsuite.api.customerPayments.createCustomerPayment` | `write` | Create a NetSuite customer payment record |
| `customerPayments.deleteCustomerPayment` | `netsuite.api.customerPayments.deleteCustomerPayment` | `destructive` | Delete a NetSuite customer payment record |
| `customerPayments.getCustomerPayment` | `netsuite.api.customerPayments.getCustomerPayment` | `read` | Get a NetSuite customer payment record by ID |
| `customerPayments.listCustomerPayments` | `netsuite.api.customerPayments.listCustomerPayments` | `read` | List NetSuite customer payment records |
| `customerPayments.updateCustomerPayment` | `netsuite.api.customerPayments.updateCustomerPayment` | `write` | Update a NetSuite customer payment record |
| `customers.createCustomer` | `netsuite.api.customers.createCustomer` | `write` | Create a NetSuite customer record |
| `customers.deleteCustomer` | `netsuite.api.customers.deleteCustomer` | `destructive` | Delete a NetSuite customer record |
| `customers.getCustomer` | `netsuite.api.customers.getCustomer` | `read` | Get a NetSuite customer record by internal ID |
| `customers.updateCustomer` | `netsuite.api.customers.updateCustomer` | `write` | Update a NetSuite customer record |
| `employees.createEmployee` | `netsuite.api.employees.createEmployee` | `write` | Create a NetSuite employee record |
| `employees.deleteEmployee` | `netsuite.api.employees.deleteEmployee` | `destructive` | Delete a NetSuite employee record |
| `employees.getEmployee` | `netsuite.api.employees.getEmployee` | `read` | Get a NetSuite employee record by internal ID |
| `employees.listEmployees` | `netsuite.api.employees.listEmployees` | `read` | List NetSuite employee records |
| `employees.updateEmployee` | `netsuite.api.employees.updateEmployee` | `write` | Update a NetSuite employee record |
| `invoices.createInvoice` | `netsuite.api.invoices.createInvoice` | `write` | Create a NetSuite invoice record |
| `invoices.deleteInvoice` | `netsuite.api.invoices.deleteInvoice` | `destructive` | Delete a NetSuite invoice record |
| `invoices.getInvoice` | `netsuite.api.invoices.getInvoice` | `read` | Get a NetSuite invoice record by internal ID |
| `invoices.listInvoices` | `netsuite.api.invoices.listInvoices` | `read` | List NetSuite invoice records |
| `invoices.updateInvoice` | `netsuite.api.invoices.updateInvoice` | `write` | Update a NetSuite invoice record |
| `itemFulfillments.deleteItemFulfillment` | `netsuite.api.itemFulfillments.deleteItemFulfillment` | `destructive` | Delete a NetSuite item fulfillment record |
| `itemFulfillments.getItemFulfillment` | `netsuite.api.itemFulfillments.getItemFulfillment` | `read` | Get a NetSuite item fulfillment record by ID |
| `itemFulfillments.listItemFulfillments` | `netsuite.api.itemFulfillments.listItemFulfillments` | `read` | List NetSuite item fulfillment records |
| `itemFulfillments.updateItemFulfillment` | `netsuite.api.itemFulfillments.updateItemFulfillment` | `write` | Update a NetSuite item fulfillment record |
| `itemReceipts.deleteItemReceipt` | `netsuite.api.itemReceipts.deleteItemReceipt` | `destructive` | Delete a NetSuite item receipt record |
| `itemReceipts.getItemReceipt` | `netsuite.api.itemReceipts.getItemReceipt` | `read` | Get a NetSuite item receipt record by internal ID |
| `itemReceipts.listItemReceipts` | `netsuite.api.itemReceipts.listItemReceipts` | `read` | List NetSuite item receipt records |
| `itemReceipts.updateItemReceipt` | `netsuite.api.itemReceipts.updateItemReceipt` | `write` | Update a NetSuite item receipt record |
| `items.createItem` | `netsuite.api.items.createItem` | `write` | Create a NetSuite item record |
| `items.deleteItem` | `netsuite.api.items.deleteItem` | `destructive` | Delete a NetSuite item record |
| `items.getItem` | `netsuite.api.items.getItem` | `read` | Get a NetSuite item record by internal ID |
| `items.updateItem` | `netsuite.api.items.updateItem` | `write` | Update a NetSuite item record |
| `journalEntries.createJournalEntry` | `netsuite.api.journalEntries.createJournalEntry` | `write` | Create a NetSuite journal entry record |
| `journalEntries.deleteJournalEntry` | `netsuite.api.journalEntries.deleteJournalEntry` | `destructive` | Delete a NetSuite journal entry record |
| `journalEntries.getJournalEntry` | `netsuite.api.journalEntries.getJournalEntry` | `read` | Get a NetSuite journal entry record by internal ID |
| `journalEntries.listJournalEntries` | `netsuite.api.journalEntries.listJournalEntries` | `read` | List NetSuite journal entry records |
| `journalEntries.updateJournalEntry` | `netsuite.api.journalEntries.updateJournalEntry` | `write` | Update a NetSuite journal entry record |
| `metadata.getRecordMetadata` | `netsuite.api.metadata.getRecordMetadata` | `read` | Retrieve the metadata schema for a NetSuite record type |
| `metadata.listMetadataCatalog` | `netsuite.api.metadata.listMetadataCatalog` | `read` | List metadata for all exposed NetSuite record types |
| `oauth.createJwtClientAssertion` | `netsuite.api.oauth.createJwtClientAssertion` | `write` | Create a signed JWT client assertion for OAuth 2.0 client credentials |
| `oauth.oauth2AuthorizeAccountDomain` | `netsuite.api.oauth.oauth2AuthorizeAccountDomain` | `read` | Build an OAuth 2.0 authorization URL on the account domain |
| `oauth.oauth2AuthorizeSystemDomain` | `netsuite.api.oauth.oauth2AuthorizeSystemDomain` | `read` | Build an OAuth 2.0 authorization URL on the system domain |
| `oauth.oauth2GetJwksKeys` | `netsuite.api.oauth.oauth2GetJwksKeys` | `read` | Retrieve NetSuite OAuth 2.0 JWKS public keys |
| `oauth.oauth2Logout` | `netsuite.api.oauth.oauth2Logout` | `write` | Log out an OAuth 2.0 session using an ID token hint |
| `oauth.oauth2RevokeRefreshToken` | `netsuite.api.oauth.oauth2RevokeRefreshToken` | `destructive` | Revoke a NetSuite OAuth 2.0 refresh token |
| `oauth.oauth2TokenAuthorizationCode` | `netsuite.api.oauth.oauth2TokenAuthorizationCode` | `write` | Exchange an OAuth 2.0 authorization code for tokens |
| `oauth.oauth2TokenClientCredentials` | `netsuite.api.oauth.oauth2TokenClientCredentials` | `write` | Exchange a JWT client assertion for an OAuth 2.0 access token |
| `oauth.oauth2TokenRefresh` | `netsuite.api.oauth.oauth2TokenRefresh` | `write` | Refresh a NetSuite OAuth 2.0 access token |
| `purchaseOrders.createPurchaseOrder` | `netsuite.api.purchaseOrders.createPurchaseOrder` | `write` | Create a NetSuite purchase order |
| `purchaseOrders.deletePurchaseOrder` | `netsuite.api.purchaseOrders.deletePurchaseOrder` | `destructive` | Delete a NetSuite purchase order record |
| `purchaseOrders.getPurchaseOrder` | `netsuite.api.purchaseOrders.getPurchaseOrder` | `read` | Get a NetSuite purchase order by internal ID |
| `purchaseOrders.listPurchaseOrders` | `netsuite.api.purchaseOrders.listPurchaseOrders` | `read` | List NetSuite purchase order records |
| `purchaseOrders.updatePurchaseOrder` | `netsuite.api.purchaseOrders.updatePurchaseOrder` | `write` | Update a NetSuite purchase order record |
| `query.executeDataset` | `netsuite.api.query.executeDataset` | `read` | Execute a SuiteAnalytics Workbook dataset |
| `query.listDatasets` | `netsuite.api.query.listDatasets` | `read` | List SuiteAnalytics Workbook datasets |
| `query.runSuiteqlQuery` | `netsuite.api.query.runSuiteqlQuery` | `read` | Run a SuiteQL query against NetSuite data |
| `records.createRecord` | `netsuite.api.records.createRecord` | `write` | Create a record of any exposed NetSuite type |
| `records.getReferenceSelectField` | `netsuite.api.records.getReferenceSelectField` | `read` | Retrieve the record referenced by a select-type field |
| `records.getSublistCollection` | `netsuite.api.records.getSublistCollection` | `read` | Retrieve a sublist collection from a NetSuite record |
| `records.getSublistLine` | `netsuite.api.records.getSublistLine` | `read` | Retrieve a specific line from a NetSuite sublist |
| `records.getSubrecord` | `netsuite.api.records.getSubrecord` | `read` | Retrieve a subrecord from a NetSuite parent record |
| `records.listRecords` | `netsuite.api.records.listRecords` | `read` | List records of any exposed NetSuite type |
| `records.transformRecord` | `netsuite.api.records.transformRecord` | `destructive` | Transform a NetSuite record into another record type |
| `records.upsertRecordByExternalId` | `netsuite.api.records.upsertRecordByExternalId` | `write` | Upsert a NetSuite record by external ID |
| `salesOrders.createSalesOrder` | `netsuite.api.salesOrders.createSalesOrder` | `write` | Create a NetSuite sales order |
| `salesOrders.deleteSalesOrder` | `netsuite.api.salesOrders.deleteSalesOrder` | `destructive` | Delete a NetSuite sales order record |
| `salesOrders.getSalesOrder` | `netsuite.api.salesOrders.getSalesOrder` | `read` | Get a NetSuite sales order record by internal ID |
| `salesOrders.listSalesOrders` | `netsuite.api.salesOrders.listSalesOrders` | `read` | List NetSuite sales order records |
| `salesOrders.updateSalesOrder` | `netsuite.api.salesOrders.updateSalesOrder` | `write` | Update a NetSuite sales order record |
| `system.getDatacenterUrls` | `netsuite.api.system.getDatacenterUrls` | `read` | Discover account-specific NetSuite service domains |
| `system.getGovernanceLimits` | `netsuite.api.system.getGovernanceLimits` | `read` | Retrieve NetSuite account and integration concurrency limits |
| `system.getServerTime` | `netsuite.api.system.getServerTime` | `read` | Retrieve the current NetSuite server time in UTC |
| `vendorBills.createVendorBill` | `netsuite.api.vendorBills.createVendorBill` | `write` | Create a NetSuite vendor bill record |
| `vendorBills.getVendorBill` | `netsuite.api.vendorBills.getVendorBill` | `read` | Retrieve a NetSuite vendor bill by internal ID |
| `vendorBills.updateVendorBill` | `netsuite.api.vendorBills.updateVendorBill` | `write` | Update a NetSuite vendor bill record |
| `vendorPayments.deleteVendorPayment` | `netsuite.api.vendorPayments.deleteVendorPayment` | `destructive` | Delete a NetSuite vendor payment record |
| `vendorPayments.getVendorPayment` | `netsuite.api.vendorPayments.getVendorPayment` | `read` | Retrieve a NetSuite vendor payment by internal ID |
| `vendorPayments.listVendorPayments` | `netsuite.api.vendorPayments.listVendorPayments` | `read` | List NetSuite vendor payment records |
| `vendorPayments.updateVendorPayment` | `netsuite.api.vendorPayments.updateVendorPayment` | `write` | Update a NetSuite vendor payment record |
| `vendors.createVendor` | `netsuite.api.vendors.createVendor` | `write` | Create a NetSuite vendor record |
| `vendors.getVendor` | `netsuite.api.vendors.getVendor` | `read` | Get a single NetSuite vendor record by internal ID |
| `vendors.updateVendor` | `netsuite.api.vendors.updateVendor` | `write` | Update a NetSuite vendor record |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/netsuite

## License

Apache-2.0
