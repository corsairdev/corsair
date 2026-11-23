# @corsair-dev/quickbooks

QuickBooks Online Accounting API operations for Corsair.

## Verified implementation coverage

Intuit's first-party Accounting entity route catalog contains **74 resources, 237 resource-operation entries, and 154 distinct route-definition strings**. This package registers **236 of 237 entries**, plus `item.deleteCategory`, which the catalog lacks but QuickBooks requires to remove a category. Every registered operation has its own Zod request/response contract (see [Validation](#validation)) and a mocked request test. Route variants with distinct paths, query/body semantics, or response types have distinct operation IDs. Every resource family was run against a QuickBooks sandbox company on 2026-11-23 (see [Sandbox run](#sandbox-run)).

The one unregistered entry is `Entitlements.READ`; its source-verified blocker is recorded under [Explicit exclusions](#explicit-exclusions). Webhooks, QuickBooks Payments, and GraphQL are not part of these 237 Accounting REST entries.

### Representative operation contracts

These original account/company examples are followed by the complete per-resource operation inventory.

| Corsair operation | Provider request | Required input | Response envelope | Official contract |
| --- | --- | --- | --- | --- |
| `accounts.create` | `POST /v3/company/{realmId}/account` | `realmId`, `name`, and either `accountType` or `accountSubType` | `{ Account, time }` | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account) |
| `accounts.get` | `GET /v3/company/{realmId}/account/{accountId}` | `realmId`, `accountId` | `{ Account, time }` | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account) |
| `accounts.list` | `GET /v3/company/{realmId}/query?query=...` | `realmId`; optional pagination | `{ QueryResponse: { Account? }, time }` | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account), [query syntax](https://static.developer.intuit.com/output_html/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries.html) |
| `company.get` | `GET /v3/company/{realmId}/companyinfo/{realmId}` | `realmId` | `{ CompanyInfo, time }` | [CompanyInfo](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo) |
| `company.list` | `GET /v3/company/{realmId}/query?query=SELECT * FROM CompanyInfo` | `realmId` | `{ QueryResponse: { CompanyInfo? }, time }` | [CompanyInfo](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo) |

The account create contract follows Intuit's v75 XSD `AccountType` enum and excludes unsupported `Non-Posting`. Account list builds only the documented `SELECT * FROM Account` query with provider pagination; it does not accept arbitrary SQL.

### Per-resource catalog reconciliation

Catalog counts include each operation variant separately (including distinct full/sparse updates, delete/void, and item/tax-classification variants). Operation IDs are the exported Corsair operations.

| Resource | Catalog entries | Registered Corsair operation IDs | Status | Official source |
| --- | ---: | --- | --- | --- |
| APAgingDetail | 1 | `apAgingDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/apagingdetail) |
| APAgingSummary | 1 | `apAgingSummary.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/apagingsummary) |
| ARAgingDetail | 1 | `arAgingDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/aragingdetail) |
| ARAgingSummary | 1 | `arAgingSummary.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/aragingsummary) |
| Account | 4 | `accounts.create`, `accounts.get`, `accounts.list`, `accounts.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account) |
| AccountListDetail | 1 | `accountListDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/accountlistdetail) |
| Attachable | 7 | `attachable.create`, `attachable.delete`, `attachable.download`, `attachable.get`, `attachable.list`, `attachable.update`, `attachable.upload` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/attachable) |
| BalanceSheet | 1 | `balanceSheet.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/balancesheet) |
| Batch | 1 | `batch.execute` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/batch) |
| Bill | 5 | `bill.create`, `bill.delete`, `bill.get`, `bill.list`, `bill.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill) |
| BillPayment | 6 | `billPayment.create`, `billPayment.delete`, `billPayment.get`, `billPayment.list`, `billPayment.update`, `billPayment.void` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/billpayment) |
| Budget | 5 | `budget.create`, `budget.delete`, `budget.get`, `budget.list`, `budget.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/budget) |
| CashFlow | 1 | `cashFlow.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/cashflow) |
| ChangeDataCapture | 1 | `changeDataCapture.changes` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changedatacapture) |
| ChangeOrder | 4 | `changeOrder.create`, `changeOrder.delete`, `changeOrder.get`, `changeOrder.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changeorder) |
| Class | 4 | `class.create`, `class.get`, `class.list`, `class.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/class) |
| CompanyCurrency | 4 | `companyCurrency.create`, `companyCurrency.get`, `companyCurrency.list`, `companyCurrency.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companycurrency) |
| CompanyInfo | 4 | `company.get`, `company.list`, `company.sparseUpdate`, `company.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo) |
| CreditCardPayment | 6 | `creditCardPayment.create`, `creditCardPayment.delete`, `creditCardPayment.get`, `creditCardPayment.list`, `creditCardPayment.sparseUpdate`, `creditCardPayment.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditcardpayment) |
| CreditMemo | 7 | `creditMemo.create`, `creditMemo.delete`, `creditMemo.get`, `creditMemo.getPdf`, `creditMemo.list`, `creditMemo.send`, `creditMemo.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditmemo) |
| Customer | 5 | `customer.create`, `customer.get`, `customer.list`, `customer.sparseUpdate`, `customer.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer) |
| CustomerBalance | 1 | `customerBalance.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customerbalance) |
| CustomerBalanceDetail | 1 | `customerBalanceDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customerbalancedetail) |
| CustomerIncome | 1 | `customerIncome.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customerincome) |
| CustomerType | 2 | `customerType.get`, `customerType.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customertype) |
| Department | 4 | `department.create`, `department.get`, `department.list`, `department.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/department) |
| Deposit | 6 | `deposit.create`, `deposit.delete`, `deposit.get`, `deposit.list`, `deposit.sparseUpdate`, `deposit.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/deposit) |
| Employee | 4 | `employee.create`, `employee.get`, `employee.list`, `employee.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/employee) |
| Entitlements | 1 | — | Blocked | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/entitlements) |
| Estimate | 8 | `estimate.create`, `estimate.delete`, `estimate.get`, `estimate.getPdf`, `estimate.list`, `estimate.send`, `estimate.sparseUpdate`, `estimate.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/estimate) |
| Exchangerate | 3 | `exchangerate.get`, `exchangerate.list`, `exchangerate.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/exchangerate) |
| GeneralLedger | 1 | `generalLedger.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/generalledger) |
| InventoryAdjustment | 4 | `inventoryAdjustment.create`, `inventoryAdjustment.delete`, `inventoryAdjustment.get`, `inventoryAdjustment.sparseUpdate` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/inventoryadjustment) |
| InventoryValuationDetail | 1 | `inventoryValuationDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/inventoryvaluationdetail) |
| InventoryValuationSummary | 1 | `inventoryValuationSummary.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/inventoryvaluationsummary) |
| Invoice | 9 | `invoice.create`, `invoice.delete`, `invoice.get`, `invoice.getPdf`, `invoice.list`, `invoice.send`, `invoice.sparseUpdate`, `invoice.update`, `invoice.void` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice) |
| Item | 10 | `item.create`, `item.createCategory`, `item.getBundle`, `item.getCategory`, `item.getItem`, `item.listBundles`, `item.listCategories`, `item.listItems`, `item.update`, `item.updateCategory` (plus `item.deleteCategory`, outside the catalog) | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item) |
| JournalEntry | 6 | `journalEntry.create`, `journalEntry.delete`, `journalEntry.get`, `journalEntry.list`, `journalEntry.sparseUpdate`, `journalEntry.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalentry) |
| JournalReport | 1 | `journalReport.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalreport) |
| Payment | 8 | `payment.create`, `payment.delete`, `payment.get`, `payment.getPdf`, `payment.list`, `payment.send`, `payment.update`, `payment.void` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment) |
| PaymentMethod | 4 | `paymentMethod.create`, `paymentMethod.get`, `paymentMethod.list`, `paymentMethod.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/paymentmethod) |
| Preferences | 3 | `preferences.get`, `preferences.list`, `preferences.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/preferences) |
| ProfitAndLoss | 1 | `profitAndLoss.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/profitandloss) |
| ProfitAndLossDetail | 1 | `profitAndLossDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/profitandlossdetail) |
| Purchase | 5 | `purchase.create`, `purchase.delete`, `purchase.get`, `purchase.list`, `purchase.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase) |
| PurchaseOrder | 7 | `purchaseOrder.create`, `purchaseOrder.delete`, `purchaseOrder.get`, `purchaseOrder.getPdf`, `purchaseOrder.list`, `purchaseOrder.send`, `purchaseOrder.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder) |
| RecurringTransaction | 4 | `recurringTransaction.create`, `recurringTransaction.delete`, `recurringTransaction.get`, `recurringTransaction.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/recurringtransaction) |
| RefundReceipt | 8 | `refundReceipt.create`, `refundReceipt.delete`, `refundReceipt.get`, `refundReceipt.getPdf`, `refundReceipt.list`, `refundReceipt.send`, `refundReceipt.sparseUpdate`, `refundReceipt.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/refundreceipt) |
| ReimburseCharge | 2 | `reimburseCharge.get`, `reimburseCharge.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/reimbursecharge) |
| SalesByClassSummary | 1 | `salesByClassSummary.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbyclasssummary) |
| SalesByCustomer | 1 | `salesByCustomer.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbycustomer) |
| SalesByDepartment | 1 | `salesByDepartment.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbydepartment) |
| SalesByProduct | 1 | `salesByProduct.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbyproduct) |
| SalesReceipt | 9 | `salesReceipt.create`, `salesReceipt.delete`, `salesReceipt.get`, `salesReceipt.getPdf`, `salesReceipt.list`, `salesReceipt.send`, `salesReceipt.sparseUpdate`, `salesReceipt.update`, `salesReceipt.void` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt) |
| TaxAgency | 3 | `taxAgency.create`, `taxAgency.get`, `taxAgency.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxagency) |
| TaxClassification | 4 | `taxClassification.get`, `taxClassification.list`, `taxClassification.listByLevel`, `taxClassification.listChildren` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxclassification) |
| TaxCode | 2 | `taxCode.get`, `taxCode.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxcode) |
| TaxPayment | 2 | `taxPayment.get`, `taxPayment.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxpayment) |
| TaxRate | 2 | `taxRate.get`, `taxRate.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxrate) |
| TaxService | 1 | `taxService.create` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxservice) |
| TaxSummary | 1 | `taxSummary.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxsummary) |
| Term | 4 | `term.create`, `term.get`, `term.list`, `term.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/term) |
| TimeActivity | 5 | `timeActivity.create`, `timeActivity.delete`, `timeActivity.get`, `timeActivity.list`, `timeActivity.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/timeactivity) |
| TransactionList | 1 | `transactionList.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlist) |
| TransactionListByCustomer | 1 | `transactionListByCustomer.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlistbycustomer) |
| TransactionListByVendor | 1 | `transactionListByVendor.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlistbyvendor) |
| TransactionListWithSplits | 1 | `transactionListWithSplits.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlistwithsplits) |
| Transfer | 6 | `transfer.create`, `transfer.delete`, `transfer.get`, `transfer.list`, `transfer.sparseUpdate`, `transfer.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transfer) |
| TrialBalance | 1 | `trialBalance.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/trialbalance) |
| Vendor | 4 | `vendor.create`, `vendor.get`, `vendor.list`, `vendor.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendor) |
| VendorBalance | 1 | `vendorBalance.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorbalance) |
| VendorBalanceDetail | 1 | `vendorBalanceDetail.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorbalancedetail) |
| VendorCredit | 5 | `vendorCredit.create`, `vendorCredit.delete`, `vendorCredit.get`, `vendorCredit.list`, `vendorCredit.update` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorcredit) |
| VendorExpenses | 1 | `vendorExpenses.list` | Implemented | [Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorexpenses) |

Coverage: **236 catalog entries registered plus `item.deleteCategory` (237 operations), 1 source-verified blocker**. Static TypeScript/Zod schemas were generated from Intuit's first-party route and model metadata; no generator or source catalog is shipped in this package.

## Shared Accounting API contract

| Concern | Contract |
| --- | --- |
| Hosts | Production `https://quickbooks.api.intuit.com`; sandbox `https://sandbox-quickbooks.api.intuit.com` ([create a request](https://developer.intuit.com/app/developer/qbo/docs/get-started/create-a-request)) |
| API prefix | `/v3/company/{realmId}`; the company `realmId` is returned in Intuit's OAuth callback ([OAuth setup](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0)) |
| Authentication | OAuth 2.0 bearer token in required `Authorization`; scope `com.intuit.quickbooks.accounting` ([REST headers](https://developer.intuit.com/app/developer/qbo/docs/learn/rest-api-features), [scopes](https://developer.intuit.com/app/developer/qbo/docs/learn/scopes)) |
| Token refresh | Intuit discovery's token endpoint with HTTP Basic client authentication; Corsair core performs refresh and one retry after 401 ([production discovery](https://developer.api.intuit.com/.well-known/openid_configuration), [sandbox discovery](https://developer.api.intuit.com/.well-known/openid_sandbox_configuration), [OAuth setup](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0)) |
| JSON | `Accept: application/json`; POST requests use `Content-Type: application/json` ([REST formats and headers](https://developer.intuit.com/app/developer/qbo/docs/learn/rest-api-features)) |
| Minor version | No `minorversion` is sent: the current default is 75; versions 1–74 were discontinued in August 2025 ([minor versions](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/minor-versions)) |
| Generic create/update | `POST /v3/company/{realmId}/{resourceName}` with a resource body; response envelope is `{ Resource, time }` ([REST formats](https://developer.intuit.com/app/developer/qbo/docs/learn/rest-api-features)) |
| Generic single read | `GET /v3/company/{realmId}/{resourceName}/{entityId}`; response envelope is `{ Resource, time }` ([REST formats](https://developer.intuit.com/app/developer/qbo/docs/learn/rest-api-features)) |
| Generic query | `GET /v3/company/{realmId}/query?query={selectStatement}`; envelope is `{ QueryResponse: { Resource: [...] }, time }`. Query pagination uses `STARTPOSITION` and `MAXRESULTS`; response maximum is 1,000 (default 100) ([query syntax](https://static.developer.intuit.com/output_html/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries.html)) |
| Rate limits | 500 requests/minute per realm and 10 requests/second per realm+app; HTTP 429 means wait 60 seconds ([limits and throttles](https://static.developer.intuit.com/output_html/qbo/docs/learn/limits-and-throttles.html)). The shared Corsair transport honors `Retry-After`, otherwise waits 60 seconds for one retry; endpoint handlers add no second retry layer. |

Special forms are represented explicitly in the registered operations: reports use report-specific paths and query schemas; PDFs use binary responses; attachment upload is multipart and attachment download returns the documented temporary URL; Batch is capped at 30 items; CDC uses the provider-supported entity list and its heterogeneous response envelope.

Operations named `.update` use the corresponding provider update model; for full-update routes, omitted writable fields become null. Operations documented as sparse updates are separately named `.sparseUpdate` and require `sparse: true`, `Id`, and the current `SyncToken`. `.void` operations are distinct from `.delete` and use the provider's documented void route/body.

## Realm ID input

Each operation requires `realmId`, the QuickBooks company ID. Intuit sends it
only as the `realmId` query parameter on the OAuth redirect; there is no API
call that returns it for a token. Corsair does not store that parameter as an
account field, so the caller passes it to each operation:

- With your own OAuth app (BYO), read `realmId` from the redirect your app
  handles and keep it with the connection.
- With a Hub-connected account, Hub does not forward the redirect's query
  parameters today, so the realm ID is not saved. The company admin can read it
  in QuickBooks under Settings > Account and settings > Billing & subscription
  (Company ID); for a sandbox company it is listed on the Intuit developer
  dashboard under Sandbox.

The plugin does not guess a company or derive the realm ID from the token.

## Setup

Register an Intuit app with the QuickBooks Online Accounting scope, configure
its client ID, client secret, and redirect URI in Corsair's OAuth integration
credentials, then connect a QuickBooks company. Use `environment: 'sandbox'`
when testing with a sandbox company; production is the default.

```ts
import { quickbooks } from '@corsair-dev/quickbooks';

const plugin = quickbooks({ environment: 'sandbox' });
```

Install with `pnpm add @corsair-dev/quickbooks`.

## Official contract sources

- [QuickBooks Accounting REST formats, routes, and headers](https://developer.intuit.com/app/developer/qbo/docs/learn/rest-api-features)
- [Production and sandbox hosts / create a request](https://developer.intuit.com/app/developer/qbo/docs/get-started/create-a-request)
- [First-party entity route catalog (74 QBO resources)](https://static.developer.intuit.com/JSONObjects/EntityJsonObject_v1.json)
- [First-party request/response model catalog](https://static.developer.intuit.com/JSONObjects/CodesModelsJsonObjects_v2.json)
- [Minor-version 75 XSD archive](https://static.developer.intuit.com/resources/v3-minor-version-75.zip)
- [OAuth 2.0 setup, refresh, and redirect realmId](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0)
- [Production OAuth discovery](https://developer.api.intuit.com/.well-known/openid_configuration)
- [Sandbox OAuth discovery](https://developer.api.intuit.com/.well-known/openid_sandbox_configuration)
- [Accounting API OAuth scopes](https://developer.intuit.com/app/developer/qbo/docs/learn/scopes)
- [Minor version lifecycle](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/minor-versions)
- [Account reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account)
- [CompanyInfo reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo)

## Explicit exclusions

- `Entitlements.READ` is the only one of the 237 catalog entries not exposed. The [first-party catalog](https://static.developer.intuit.com/JSONObjects/EntityJsonObject_v1.json) documents its separate `/manage/entitlements/v3/{realmID}` route and explicitly says it does not accept `Accept: application/json`; it requires XML. The catalog model also conflicts about the `Entitlement` shape (a collection with documented id/name/term fields and a TelephoneNumber reference). This package has no verified XML response contract/parser, so exposing it would bypass output validation or invent a shape.
- Webhooks are not among the 237 REST operations and remain `{}`; no callback contract is registered.
- QuickBooks Payments is a separate API, and GraphQL is outside the Accounting REST route catalog.

## Local test evidence

`pnpm --dir packages/quickbooks test` runs the mocked/local package suite,
including `samples.test.ts`, which sends Intuit's documented request bodies and
parses its documented responses from the model catalog, and
`sandbox-responses.test.ts`, which parses responses captured from a sandbox
company. Neither calls QuickBooks. The optional read-only live smoke test requires
`QUICKBOOKS_ACCESS_TOKEN` and `QUICKBOOKS_REALM_ID` and can be run with
`pnpm --dir packages/quickbooks test:live`.

## Sandbox run

On 2026-11-23 the operations ran against an Intuit sandbox company (US, with
Intuit's sample data) through `quickbooks({ environment: 'sandbox' })`: every
list and get, the reports, PDFs, CDC, batch, attachment upload and download,
and create, read, update, sparse update, send, void and delete round trips for
each transaction type. Sends went only to a test inbox. What the sandbox could
not serve:

- `companyCurrency.*` and `exchangerate.update` need multicurrency, which
  can't be turned off again once on, so they were not run.
- `taxPayment.*` (fault 5030, not available for US companies) and
  `taxSummary.list` (fault 5020, permission denied for this company).
- `changeOrder.*` needs a project, and projects are created through Intuit's
  Projects API, not this one.
- `item.getBundle`: the sample company has no bundles, and bundles can't be
  created through the API.
- `customerType.get`: the sample company has no customer types.
- `taxService.create` and `taxAgency.create` ran, but their records can't be
  deleted afterwards.

## Validation

The request and response models come from Intuit's model catalog, which lists
only some of each entity's fields. Request bodies are checked for the fields it
documents and may carry the entity's other documented fields; line and address
`Id`s are optional because QuickBooks assigns them, and update bodies need only
`Id` and `SyncToken`. Responses are parsed leniently: unknown fields are kept,
reads still require their envelope (`Invoice`, `QueryResponse`), and a write
never fails on the response shape after QuickBooks has applied it. Schemas are
built the first time an operation runs.
