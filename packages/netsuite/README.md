# @corsair-dev/netsuite

NetSuite plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/netsuite
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asyncGetJobStatus` | `netsuite.api.asyncGetJobStatus` | `read` | Retrieve the status of an asynchronous NetSuite REST job |
| `asyncGetJobTask` | `netsuite.api.asyncGetJobTask` | `read` | Retrieve the task reference and status for an asynchronous job |
| `asyncGetJobTaskResult` | `netsuite.api.asyncGetJobTaskResult` | `read` | Retrieve the result of an asynchronous job task |
| `createCustomer` | `netsuite.api.createCustomer` | `write` | Create a NetSuite customer record |
| `createCustomerPayment` | `netsuite.api.createCustomerPayment` | `write` | Create a NetSuite customer payment record |
| `createEmployee` | `netsuite.api.createEmployee` | `write` | Create a NetSuite employee record |
| `createInvoice` | `netsuite.api.createInvoice` | `write` | Create a NetSuite invoice record |
| `createItem` | `netsuite.api.createItem` | `write` | Create a NetSuite item record |
| `createJournalEntry` | `netsuite.api.createJournalEntry` | `write` | Create a NetSuite journal entry record |
| `createJwtClientAssertion` | `netsuite.api.createJwtClientAssertion` | `read` | Create a signed JWT client assertion for OAuth 2.0 client credentials |
| `createPurchaseOrder` | `netsuite.api.createPurchaseOrder` | `write` | Create a NetSuite purchase order |
| `createRecord` | `netsuite.api.createRecord` | `write` | Create a record of any exposed NetSuite type |
| `createSalesOrder` | `netsuite.api.createSalesOrder` | `write` | Create a NetSuite sales order |
| `createVendor` | `netsuite.api.createVendor` | `write` | Create a NetSuite vendor record |
| `createVendorBill` | `netsuite.api.createVendorBill` | `write` | Create a NetSuite vendor bill record |
| `deleteCustomer` | `netsuite.api.deleteCustomer` | `destructive` | Delete a NetSuite customer record |
| `deleteCustomerPayment` | `netsuite.api.deleteCustomerPayment` | `destructive` | Delete a NetSuite customer payment record |
| `deleteEmployee` | `netsuite.api.deleteEmployee` | `destructive` | Delete a NetSuite employee record |
| `deleteInvoice` | `netsuite.api.deleteInvoice` | `destructive` | Delete a NetSuite invoice record |
| `deleteItem` | `netsuite.api.deleteItem` | `destructive` | Delete a NetSuite item record |
| `deleteItemFulfillment` | `netsuite.api.deleteItemFulfillment` | `destructive` | Delete a NetSuite item fulfillment record |
| `deleteItemReceipt` | `netsuite.api.deleteItemReceipt` | `destructive` | Delete a NetSuite item receipt record |
| `deleteJournalEntry` | `netsuite.api.deleteJournalEntry` | `destructive` | Delete a NetSuite journal entry record |
| `deletePurchaseOrder` | `netsuite.api.deletePurchaseOrder` | `destructive` | Delete a NetSuite purchase order record |
| `deleteSalesOrder` | `netsuite.api.deleteSalesOrder` | `destructive` | Delete a NetSuite sales order record |
| `deleteVendorPayment` | `netsuite.api.deleteVendorPayment` | `destructive` | Delete a NetSuite vendor payment record |
| `executeDataset` | `netsuite.api.executeDataset` | `read` | Execute a SuiteAnalytics Workbook dataset |
| `getCustomer` | `netsuite.api.getCustomer` | `read` | Get a NetSuite customer record by internal ID |
| `getCustomerPayment` | `netsuite.api.getCustomerPayment` | `read` | Get a NetSuite customer payment record by ID |
| `getDatacenterUrls` | `netsuite.api.getDatacenterUrls` | `read` | Discover account-specific NetSuite service domains |
| `getEmployee` | `netsuite.api.getEmployee` | `read` | Get a NetSuite employee record by internal ID |
| `getGovernanceLimits` | `netsuite.api.getGovernanceLimits` | `read` | Retrieve NetSuite account and integration concurrency limits |
| `getInvoice` | `netsuite.api.getInvoice` | `read` | Get a NetSuite invoice record by internal ID |
| `getItem` | `netsuite.api.getItem` | `read` | Get a NetSuite item record by internal ID |
| `getItemFulfillment` | `netsuite.api.getItemFulfillment` | `read` | Get a NetSuite item fulfillment record by ID |
| `getItemReceipt` | `netsuite.api.getItemReceipt` | `read` | Get a NetSuite item receipt record by internal ID |
| `getJournalEntry` | `netsuite.api.getJournalEntry` | `read` | Get a NetSuite journal entry record by internal ID |
| `getPurchaseOrder` | `netsuite.api.getPurchaseOrder` | `read` | Get a NetSuite purchase order by internal ID |
| `getRecordMetadata` | `netsuite.api.getRecordMetadata` | `read` | Retrieve the metadata schema for a NetSuite record type |
| `getReferenceSelectField` | `netsuite.api.getReferenceSelectField` | `read` | Retrieve the record referenced by a select-type field |
| `getSalesOrder` | `netsuite.api.getSalesOrder` | `read` | Get a NetSuite sales order record by internal ID |
| `getServerTime` | `netsuite.api.getServerTime` | `read` | Retrieve the current NetSuite server time in UTC |
| `getSublistCollection` | `netsuite.api.getSublistCollection` | `read` | Retrieve a sublist collection from a NetSuite record |
| `getSublistLine` | `netsuite.api.getSublistLine` | `read` | Retrieve a specific line from a NetSuite sublist |
| `getSubrecord` | `netsuite.api.getSubrecord` | `read` | Retrieve a subrecord from a NetSuite parent record |
| `getVendor` | `netsuite.api.getVendor` | `read` | Get a single NetSuite vendor record by internal ID |
| `getVendorBill` | `netsuite.api.getVendorBill` | `read` | Retrieve a NetSuite vendor bill by internal ID |
| `getVendorPayment` | `netsuite.api.getVendorPayment` | `read` | Retrieve a NetSuite vendor payment by internal ID |
| `listCustomerPayments` | `netsuite.api.listCustomerPayments` | `read` | List NetSuite customer payment records |
| `listDatasets` | `netsuite.api.listDatasets` | `read` | List SuiteAnalytics Workbook datasets |
| `listEmployees` | `netsuite.api.listEmployees` | `read` | List NetSuite employee records |
| `listIntegrations` | `netsuite.api.listIntegrations` | `read` | List NetSuite integration applications and their client IDs |
| `listInvoices` | `netsuite.api.listInvoices` | `read` | List NetSuite invoice records |
| `listItemFulfillments` | `netsuite.api.listItemFulfillments` | `read` | List NetSuite item fulfillment records |
| `listItemReceipts` | `netsuite.api.listItemReceipts` | `read` | List NetSuite item receipt records |
| `listJournalEntries` | `netsuite.api.listJournalEntries` | `read` | List NetSuite journal entry records |
| `listMetadataCatalog` | `netsuite.api.listMetadataCatalog` | `read` | List metadata for all exposed NetSuite record types |
| `listPurchaseOrders` | `netsuite.api.listPurchaseOrders` | `read` | List NetSuite purchase order records |
| `listRecords` | `netsuite.api.listRecords` | `read` | List records of any exposed NetSuite type |
| `listSalesOrders` | `netsuite.api.listSalesOrders` | `read` | List NetSuite sales order records |
| `listVendorPayments` | `netsuite.api.listVendorPayments` | `read` | List NetSuite vendor payment records |
| `oauth2AuthorizeAccountDomain` | `netsuite.api.oauth2AuthorizeAccountDomain` | `read` | Build an OAuth 2.0 authorization URL on the account domain |
| `oauth2AuthorizeSystemDomain` | `netsuite.api.oauth2AuthorizeSystemDomain` | `read` | Build an OAuth 2.0 authorization URL on the system domain |
| `oauth2GetJwksKeys` | `netsuite.api.oauth2GetJwksKeys` | `read` | Retrieve NetSuite OAuth 2.0 JWKS public keys |
| `oauth2Logout` | `netsuite.api.oauth2Logout` | `write` | Log out an OAuth 2.0 session using an ID token hint |
| `oauth2RevokeRefreshToken` | `netsuite.api.oauth2RevokeRefreshToken` | `write` | Revoke a NetSuite OAuth 2.0 refresh token |
| `oauth2TokenAuthorizationCode` | `netsuite.api.oauth2TokenAuthorizationCode` | `write` | Exchange an OAuth 2.0 authorization code for tokens |
| `oauth2TokenClientCredentials` | `netsuite.api.oauth2TokenClientCredentials` | `write` | Exchange a JWT client assertion for an OAuth 2.0 access token |
| `oauth2TokenRefresh` | `netsuite.api.oauth2TokenRefresh` | `write` | Refresh a NetSuite OAuth 2.0 access token |
| `runSuiteqlQuery` | `netsuite.api.runSuiteqlQuery` | `read` | Run a SuiteQL query against NetSuite data |
| `transformRecord` | `netsuite.api.transformRecord` | `write` | Transform a NetSuite record into another record type |
| `updateCustomer` | `netsuite.api.updateCustomer` | `write` | Update a NetSuite customer record |
| `updateCustomerPayment` | `netsuite.api.updateCustomerPayment` | `write` | Update a NetSuite customer payment record |
| `updateEmployee` | `netsuite.api.updateEmployee` | `write` | Update a NetSuite employee record |
| `updateInvoice` | `netsuite.api.updateInvoice` | `write` | Update a NetSuite invoice record |
| `updateItem` | `netsuite.api.updateItem` | `write` | Update a NetSuite item record |
| `updateItemFulfillment` | `netsuite.api.updateItemFulfillment` | `write` | Update a NetSuite item fulfillment record |
| `updateItemReceipt` | `netsuite.api.updateItemReceipt` | `write` | Update a NetSuite item receipt record |
| `updateJournalEntry` | `netsuite.api.updateJournalEntry` | `write` | Update a NetSuite journal entry record |
| `updatePurchaseOrder` | `netsuite.api.updatePurchaseOrder` | `write` | Update a NetSuite purchase order record |
| `updateSalesOrder` | `netsuite.api.updateSalesOrder` | `write` | Update a NetSuite sales order record |
| `updateVendor` | `netsuite.api.updateVendor` | `write` | Update a NetSuite vendor record |
| `updateVendorBill` | `netsuite.api.updateVendorBill` | `write` | Update a NetSuite vendor bill record |
| `updateVendorPayment` | `netsuite.api.updateVendorPayment` | `write` | Update a NetSuite vendor payment record |
| `upsertRecordByExternalId` | `netsuite.api.upsertRecordByExternalId` | `write` | Upsert a NetSuite record by external ID |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/netsuite

## License

Apache-2.0

### Notes

- Loose types (`.passthrough()`) are explained with rationale comments in `packages/netsuite/endpoints/types.ts`.
- `createJwtClientAssertion` example includes all required args (`scope`, `client_id`).
