# @corsair-dev/quickbooks

QuickBooks Online Accounting API operations for Corsair.

## Verified implementation coverage

This is a deliberately partial integration, **not full QuickBooks API coverage**.
The official Intuit route catalog currently contains 74 Accounting resources and
237 resource-operation entries (154 distinct operation-route definition
strings). This package implements 5 of those entries; 232 catalogued entries
are verified but pending implementation. The catalogued entries have official
route definitions; the source inventory has 0 route entries classified as
unverifiable. The official catalog does not count webhooks, GraphQL, or the
separate QuickBooks Payments API, which are excluded here.

| Corsair operation | Provider request | Required input | Response envelope | Official contract |
| --- | --- | --- | --- | --- |
| `accounts.create` | `POST /v3/company/{realmId}/account` | `realmId`, `name`, and either `accountType` or `accountSubType`; optional `acctNum`, `taxCodeRef` | `{ Account, time }` | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account) |
| `accounts.get` | `GET /v3/company/{realmId}/account/{accountId}` | `realmId`, `accountId` | `{ Account, time }` | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account) |
| `accounts.list` | `GET /v3/company/{realmId}/query?query=...` | `realmId`; optional `startPosition`, `maxResults` | `{ QueryResponse: { Account?, startPosition?, maxResults?, totalCount? }, time }` | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account), [query syntax and pagination](https://static.developer.intuit.com/output_html/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries.html) |
| `company.get` | `GET /v3/company/{realmId}/companyinfo/{realmId}` | `realmId` | `{ CompanyInfo, time }` | [CompanyInfo](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo) |
| `company.list` | `GET /v3/company/{realmId}/query?query=SELECT * FROM CompanyInfo` | `realmId` | `{ QueryResponse: { CompanyInfo?, startPosition?, maxResults?, totalCount? }, time }` | [CompanyInfo](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo), [query syntax](https://static.developer.intuit.com/output_html/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries.html) |

The operation schemas reject undocumented input properties and validate
provider responses. `accounts.list` builds only `SELECT * FROM Account`; it does
not expose an arbitrary query-language input. The account create schema follows
Intuit's v75 XSD enum for `AccountType` and excludes `Non-Posting`, which the
XSD says QBO does not support.

### Verified but pending operation inventory

The following inventory is from Intuit's first-party
[Accounting entity route catalog](https://static.developer.intuit.com/JSONObjects/EntityJsonObject_v1.json).
Each linked entity reference gives its operation-specific paths, required body
models, examples, and response details. Common route forms and their envelopes
are summarized below; special operations may have multiple variants documented
on the entity page.

| Resource | Catalogued operations | Implemented | Source |
| --- | --- | --- | --- |
| Account | CREATE, QUERY, READ, UPDATE | CREATE, QUERY, READ | [Account](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account) |
| AccountListDetail | QUERY | — | [AccountListDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/accountlistdetail) |
| APAgingDetail | QUERY | — | [APAgingDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/apagingdetail) |
| APAgingSummary | QUERY | — | [APAgingSummary](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/apagingsummary) |
| ARAgingDetail | QUERY | — | [ARAgingDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/aragingdetail) |
| ARAgingSummary | QUERY | — | [ARAgingSummary](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/aragingsummary) |
| Attachable | CREATE, DELETE, DOWNLOAD, QUERY, READ, UPDATE, UPLOAD | — | [Attachable](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/attachable) |
| BalanceSheet | QUERY | — | [BalanceSheet](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/balancesheet) |
| Batch | DEFAULT | — | [Batch](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/batch) |
| Bill | CREATE, DELETE, QUERY, READ, UPDATE | — | [Bill](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill) |
| BillPayment | CREATE, DELETE, QUERY, READ, UPDATE | — | [BillPayment](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/billpayment) |
| Budget | CREATE, DELETE, QUERY, READ, UPDATE | — | [Budget](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/budget) |
| CashFlow | QUERY | — | [CashFlow](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/cashflow) |
| ChangeDataCapture | DEFAULT | — | [ChangeDataCapture](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changedatacapture) |
| ChangeOrder | CREATE, DELETE, READ, UPDATE | — | [ChangeOrder](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/changeorder) |
| Class | CREATE, QUERY, READ, UPDATE | — | [Class](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/class) |
| CompanyCurrency | CREATE, QUERY, READ, UPDATE | — | [CompanyCurrency](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companycurrency) |
| CompanyInfo | QUERY, READ, UPDATE | QUERY, READ | [CompanyInfo](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/companyinfo) |
| CreditCardPayment | CREATE, DELETE, QUERY, READ, UPDATE | — | [CreditCardPayment](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditcardpayment) |
| CreditMemo | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [CreditMemo](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/creditmemo) |
| Customer | CREATE, QUERY, READ, UPDATE | — | [Customer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customer) |
| CustomerBalance | QUERY | — | [CustomerBalance](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customerbalance) |
| CustomerBalanceDetail | QUERY | — | [CustomerBalanceDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customerbalancedetail) |
| CustomerIncome | QUERY | — | [CustomerIncome](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customerincome) |
| CustomerType | QUERY, READ | — | [CustomerType](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/customertype) |
| Department | CREATE, QUERY, READ, UPDATE | — | [Department](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/department) |
| Deposit | CREATE, DELETE, QUERY, READ, UPDATE | — | [Deposit](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/deposit) |
| Employee | CREATE, QUERY, READ, UPDATE | — | [Employee](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/employee) |
| Entitlements | READ | — | [Entitlements](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/entitlements) |
| Estimate | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [Estimate](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/estimate) |
| Exchangerate | QUERY, UPDATE | — | [Exchangerate](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/exchangerate) |
| GeneralLedger | QUERY | — | [GeneralLedger](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/generalledger) |
| InventoryAdjustment | CREATE, DELETE, READ, UPDATE | — | [InventoryAdjustment](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/inventoryadjustment) |
| InventoryValuationDetail | QUERY | — | [InventoryValuationDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/inventoryvaluationdetail) |
| InventoryValuationSummary | QUERY | — | [InventoryValuationSummary](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/inventoryvaluationsummary) |
| Invoice | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [Invoice](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice) |
| Item | CREATE, QUERY, READ, UPDATE | — | [Item](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/item) |
| JournalEntry | CREATE, DELETE, QUERY, READ, UPDATE | — | [JournalEntry](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalentry) |
| JournalReport | QUERY | — | [JournalReport](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/journalreport) |
| Payment | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [Payment](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/payment) |
| PaymentMethod | CREATE, QUERY, READ, UPDATE | — | [PaymentMethod](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/paymentmethod) |
| Preferences | QUERY, READ, UPDATE | — | [Preferences](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/preferences) |
| ProfitAndLoss | QUERY | — | [ProfitAndLoss](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/profitandloss) |
| ProfitAndLossDetail | QUERY | — | [ProfitAndLossDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/profitandlossdetail) |
| Purchase | CREATE, DELETE, QUERY, READ, UPDATE | — | [Purchase](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase) |
| PurchaseOrder | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [PurchaseOrder](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder) |
| RecurringTransaction | CREATE, DELETE, QUERY, READ | — | [RecurringTransaction](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/recurringtransaction) |
| RefundReceipt | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [RefundReceipt](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/refundreceipt) |
| ReimburseCharge | QUERY, READ | — | [ReimburseCharge](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/reimbursecharge) |
| SalesByClassSummary | QUERY | — | [SalesByClassSummary](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbyclasssummary) |
| SalesByCustomer | QUERY | — | [SalesByCustomer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbycustomer) |
| SalesByDepartment | QUERY | — | [SalesByDepartment](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbydepartment) |
| SalesByProduct | QUERY | — | [SalesByProduct](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesbyproduct) |
| SalesReceipt | CREATE, DELETE, PDF, QUERY, READ, SEND, UPDATE | — | [SalesReceipt](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt) |
| TaxAgency | CREATE, QUERY, READ | — | [TaxAgency](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxagency) |
| TaxClassification | READ | — | [TaxClassification](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxclassification) |
| TaxCode | QUERY, READ | — | [TaxCode](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxcode) |
| TaxPayment | QUERY, READ | — | [TaxPayment](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxpayment) |
| TaxRate | QUERY, READ | — | [TaxRate](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxrate) |
| TaxService | CREATE | — | [TaxService](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxservice) |
| TaxSummary | QUERY | — | [TaxSummary](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/taxsummary) |
| Term | CREATE, QUERY, READ, UPDATE | — | [Term](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/term) |
| TimeActivity | CREATE, DELETE, QUERY, READ, UPDATE | — | [TimeActivity](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/timeactivity) |
| TransactionList | QUERY | — | [TransactionList](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlist) |
| TransactionListByCustomer | QUERY | — | [TransactionListByCustomer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlistbycustomer) |
| TransactionListByVendor | QUERY | — | [TransactionListByVendor](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlistbyvendor) |
| TransactionListWithSplits | QUERY | — | [TransactionListWithSplits](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transactionlistwithsplits) |
| Transfer | CREATE, DELETE, QUERY, READ, UPDATE | — | [Transfer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/transfer) |
| TrialBalance | QUERY | — | [TrialBalance](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/trialbalance) |
| Vendor | CREATE, QUERY, READ, UPDATE | — | [Vendor](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendor) |
| VendorBalance | QUERY | — | [VendorBalance](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorbalance) |
| VendorBalanceDetail | QUERY | — | [VendorBalanceDetail](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorbalancedetail) |
| VendorCredit | CREATE, DELETE, QUERY, READ, UPDATE | — | [VendorCredit](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorcredit) |
| VendorExpenses | QUERY | — | [VendorExpenses](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendorexpenses) |

All 232 unimplemented operation entries above are **verified but pending**, not
unsupported. The matrix lists each resource's catalogued operation kinds; an
entity page gives exact variants where an operation kind has multiple paths or
request models. In particular, Account UPDATE is documented as a full update:
omitted writable fields are set to null, so it is intentionally pending until a
complete safe update contract is implemented. No unverified route is exposed.

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

Some resources have special forms instead of the generic routes: reports use
`GET /v3/company/{realmId}/reports/{reportName}`; Account updates, deletes,
invoice send/PDF, attachment upload/download, batch, and CDC have their own
documented variants. See the linked resource reference for each exact method,
path, required request model, and response. These variants remain pending unless
listed in the implemented table.

## Realm ID input

Each operation requires `realmId`, the company ID returned as a query parameter
on Intuit's OAuth redirect. Corsair's generic OAuth callback does not persist
that provider query parameter as a plugin account field, so callers must pass
the realm ID from their verified callback to each operation. The plugin does
not guess a company or derive the realm ID from the token.

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

- 232 documented Accounting operation entries are verified but not implemented;
  no full API coverage is claimed.
- Account full update is pending because Intuit says omitted writable fields
  become null; unsafe partial update semantics are not exposed.
- Webhooks remain `{}`. Signature verification and event handling are outside
  this slice.
- QuickBooks Payments, GraphQL, reports, attachments/binary operations, send/PDF,
  batch, CDC, and all other non-listed operations are not exposed.

## Local test evidence

`pnpm --dir packages/quickbooks test` runs the mocked/local package suite. It
does not call a live QuickBooks company and is not a live API demo. The optional
read-only live smoke test requires `QUICKBOOKS_ACCESS_TOKEN` and
`QUICKBOOKS_REALM_ID` and can be run with `pnpm --dir packages/quickbooks
test:live`.
