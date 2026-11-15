# @corsair-dev/freeagent

FreeAgent's company API integration for Corsair. The API uses OAuth 2.0 bearer access tokens and JSON requests/responses at `https://api.freeagent.com/v2`. The sandbox host is `https://api.sandbox.freeagent.com`.

## Implemented operations

| Corsair operation | HTTP route | Official reference |
| --- | --- | --- |
| `company.get` | `GET /v2/company` | [Company](https://dev.freeagent.com/docs/company) |
| `company.businessCategories` | `GET /v2/company/business_categories` | [Company](https://dev.freeagent.com/docs/company) |
| `company.taxTimeline` | `GET /v2/company/tax_timeline` | [Company](https://dev.freeagent.com/docs/company) |
| `contacts.list` | `GET /v2/contacts` | [Contacts](https://dev.freeagent.com/docs/contacts) |
| `contacts.get` | `GET /v2/contacts/:id` | [Contacts](https://dev.freeagent.com/docs/contacts) |
| `contacts.create` | `POST /v2/contacts` | [Contacts](https://dev.freeagent.com/docs/contacts) |
| `contacts.update` | `PUT /v2/contacts/:id` | [Contacts](https://dev.freeagent.com/docs/contacts) |
| `contacts.delete` | `DELETE /v2/contacts/:id` | [Contacts](https://dev.freeagent.com/docs/contacts) |
| `projects.list` | `GET /v2/projects` | [Projects](https://dev.freeagent.com/docs/projects) |
| `projects.get` | `GET /v2/projects/:id` | [Projects](https://dev.freeagent.com/docs/projects) |
| `projects.create` | `POST /v2/projects` | [Projects](https://dev.freeagent.com/docs/projects) |
| `projects.update` | `PUT /v2/projects/:id` | [Projects](https://dev.freeagent.com/docs/projects) |
| `projects.delete` | `DELETE /v2/projects/:id` | [Projects](https://dev.freeagent.com/docs/projects) |
| `invoices.list` | `GET /v2/invoices` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.get` | `GET /v2/invoices/:id` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.pdf` | `GET /v2/invoices/:id/pdf` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.create` | `POST /v2/invoices` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.duplicate` | `POST /v2/invoices/:id/duplicate` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.update` | `PUT /v2/invoices/:id` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.delete` | `DELETE /v2/invoices/:id` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.sendEmail` | `POST /v2/invoices/:id/send_email` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.markSent` | `PUT /v2/invoices/:id/transitions/mark_as_sent` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.markScheduled` | `PUT /v2/invoices/:id/transitions/mark_as_scheduled` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.markDraft` | `PUT /v2/invoices/:id/transitions/mark_as_draft` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.markCancelled` | `PUT /v2/invoices/:id/transitions/mark_as_cancelled` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.directDebit` | `POST /v2/invoices/:id/direct_debit` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.timeline` | `GET /v2/invoices/timeline` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.getDefaultAdditionalText` | `GET /v2/invoices/default_additional_text` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.updateDefaultAdditionalText` | `PUT /v2/invoices/default_additional_text` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.deleteDefaultAdditionalText` | `DELETE /v2/invoices/default_additional_text` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.convertToCreditNote` | `PUT /v2/invoices/:id/transitions/convert_to_credit_note` | [Invoices](https://dev.freeagent.com/docs/invoices) |

Invoice creation and duplication produce Draft invoices. Emailing, payment, and invoice state transitions are separate destructive operations. Direct debit is only available for sent invoices with a GoCardless pre-authorised mandate and no previous payment. PDF content is returned by FreeAgent as base64 inside JSON. `invoices.sendEmail` supports the documented template flag, message fields, and base64 attachment records (maximum 5 MiB per attachment).

## Pagination, limits, and errors

Collection calls accept `page` and `per_page` (1–100). FreeAgent documents 25 items per page by default and returns pagination in the `Link` header plus a total in `X-Total-Count`. The three implemented collection operations return these values under `pagination.link` and `pagination.total_count` (the total remains the header's decimal string). A missing header is `null`. The company API limits are 120 requests per user per minute, 3,600 per hour, and 15 token refreshes per minute; HTTP 429 responses include `Retry-After`. The paginated GET client retries 429 responses up to three times, honoring `Retry-After`, with bounded exponential fallback when that header is absent. Other calls use Corsair's shared transport.

All documented routes use HTTPS; JSON and XML are supported. OAuth access tokens are sent as `Authorization: Bearer …`; a `User-Agent` is sent as required by the API overview. This implementation uses JSON only and does not invent a global provider error envelope because the official docs do not specify one.

## Official company API route inventory and coverage

This inventory was checked against the official [API index](https://dev.freeagent.com/docs) and each linked resource page. **Implemented** routes are in the table above. Every route marked **not implemented** is a known coverage gap, not an assertion that it is incompatible. Resource pages with no REST operation are identified as documentation-only. Paths below are the routes shown in the official documentation; additional query/body fields and response shapes are specified on those pages and must be researched before implementation.

| Official resource page | Documented company API routes not yet implemented |
| --- | --- |
| [Attachments](https://dev.freeagent.com/docs/attachments) | `GET /v2/attachments/:id`; `DELETE /v2/attachments/:id` |
| [Balance Sheet](https://dev.freeagent.com/docs/balance_sheet) | `GET /v2/accounting/balance_sheet`; `GET /v2/accounting/balance_sheet/opening_balances` |
| [Bank Accounts](https://dev.freeagent.com/docs/bank_accounts) | `GET /v2/bank_accounts`; `GET /v2/bank_accounts/:id`; `POST /v2/bank_accounts`; `PUT /v2/bank_accounts/:id`; `DELETE /v2/bank_accounts/:id` |
| [Bank Feeds](https://dev.freeagent.com/docs/bank_feeds) | `GET /v2/bank_feeds`; `GET /v2/bank_feeds/:id` |
| [Bank Transaction Explanations](https://dev.freeagent.com/docs/bank_transaction_explanations) | `GET /v2/bank_transaction_explanations`; `GET /v2/bank_transaction_explanations/:id`; `POST /v2/bank_transaction_explanations`; `PUT /v2/bank_transaction_explanations/:id`; `DELETE /v2/bank_transaction_explanations/:id` |
| [Bank Transactions](https://dev.freeagent.com/docs/bank_transactions) | `GET /v2/bank_transactions`; `GET /v2/bank_transactions/:id`; `DELETE /v2/bank_transaction/:id` (singular path as documented); `POST /v2/bank_transactions/statement` |
| [Bills](https://dev.freeagent.com/docs/bills) | `GET /v2/bills`; `GET /v2/bills/:id`; `POST /v2/bills`; `PUT /v2/bills/:id`; `DELETE /v2/bills/:id` |
| [Capital Asset Types](https://dev.freeagent.com/docs/capital_asset_types) | `GET /v2/capital_asset_types`; `GET /v2/capital_asset_types/:id`; `POST /v2/capital_asset_types`; `PUT /v2/capital_asset_types/:id`; `DELETE /v2/capital_asset_types/:id` |
| [Capital Assets](https://dev.freeagent.com/docs/capital_assets) | `GET /v2/capital_assets`; `GET /v2/capital_assets/:id` |
| [Cashflow](https://dev.freeagent.com/docs/cashflow) | `GET /v2/cashflow` |
| [Categories](https://dev.freeagent.com/docs/categories) | `GET /v2/categories`; `GET /v2/categories/:nominal_code`; `POST /v2/categories`; `PUT /v2/categories/:nominal_code`; `DELETE /v2/categories/:nominal_code` |
| [CIS Bands](https://dev.freeagent.com/docs/cis_bands) | `GET /v2/cis_bands` |
| [CIS Settings](https://dev.freeagent.com/docs/cis_settings) | `GET /v2/cis_settings`; `PUT /v2/cis_settings` |
| [Company](https://dev.freeagent.com/docs/company) | Implemented: all three documented GET routes (`/v2/company`, `/v2/company/business_categories`, `/v2/company/tax_timeline`). |
| [Contacts](https://dev.freeagent.com/docs/contacts) | Implemented: list/get/create/update/delete. |
| [Corporation Tax Returns](https://dev.freeagent.com/docs/corporation_tax_returns) | `GET /v2/corporation_tax_returns`; `GET /v2/corporation_tax_returns/:period_ends_on`; `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_filed`; `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_unfiled`; `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_paid`; `PUT /v2/corporation_tax_returns/:period_ends_on/mark_as_unpaid` |
| [Credit Note Reconciliations](https://dev.freeagent.com/docs/credit_note_reconciliations) | `GET /v2/credit_note_reconciliations`; `GET /v2/credit_note_reconciliations/:id`; `POST /v2/credit_note_reconciliations`; `PUT /v2/credit_note_reconciliations/:id`; `DELETE /v2/credit_note_reconciliations/:id` |
| [Credit Notes](https://dev.freeagent.com/docs/credit_notes) | `GET /v2/credit_notes`; `GET /v2/credit_notes/:id`; `GET /v2/credit_notes/:id/pdf`; `POST /v2/credit_notes`; `POST /v2/credit_notes/:id/send_email`; `PUT /v2/credit_notes/:id`; `PUT /v2/credit_notes/:id/transitions/mark_as_sent`; `PUT /v2/credit_notes/:id/transitions/mark_as_draft`; `DELETE /v2/credit_notes/:id` |
| [Email Addresses](https://dev.freeagent.com/docs/email_addresses) | `GET /v2/email_addresses` |
| [Estimates](https://dev.freeagent.com/docs/estimates) | `GET /v2/estimates`; `GET /v2/estimates/:id`; `GET /v2/estimates/:id/pdf`; `POST /v2/estimates`; `PUT /v2/estimates/:id`; `POST /v2/estimate_items`; `PUT /v2/estimate_items/:id`; `POST /v2/estimates/:id/duplicate`; `DELETE /v2/estimate_items/:id`; `DELETE /v2/estimates/:id`; `POST /v2/estimates/:id/send_email`; `PUT /v2/estimates/:id/transitions/mark_as_sent`; `PUT /v2/estimates/:id/transitions/mark_as_draft`; `PUT /v2/estimates/:id/transitions/mark_as_approved`; `PUT /v2/estimates/:id/transitions/mark_as_rejected`; `PUT /v2/estimates/:id/transitions/convert_to_invoice`; `GET|PUT|DELETE /v2/estimates/default_additional_text` |
| [Expenses](https://dev.freeagent.com/docs/expenses) | `GET /v2/expenses`; `GET /v2/expenses/:id`; `POST /v2/expenses` (including documented batch-create mode); `PUT /v2/expenses/:id`; `DELETE /v2/expenses/:id`; `GET /v2/expenses/mileage_settings` |
| [Final Accounts Reports](https://dev.freeagent.com/docs/final_accounts_reports) | `GET /v2/final_accounts_reports`; `GET /v2/final_accounts_reports/:period_ends_on`; `PUT /v2/final_accounts_reports/:period_ends_on/mark_as_filed`; `PUT /v2/final_accounts_reports/:period_ends_on/mark_as_unfiled` |
| [Hire Purchases](https://dev.freeagent.com/docs/hire_purchases) | `GET /v2/hire_purchases`; `GET /v2/hire_purchases/:id` |
| [Income Tax Returns](https://dev.freeagent.com/docs/income_tax_returns), also indexed as [Self Assessment Returns](https://dev.freeagent.com/docs/self_assessment_returns) | `GET /v2/users/:user_id/self_assessment_returns`; `GET /v2/users/:user_id/self_assessment_returns/:period_ends_on`; `PUT /v2/users/:user_id/self_assessment_returns/:period_ends_on/mark_as_filed`; `PUT /v2/users/:user_id/self_assessment_returns/:period_ends_on/mark_as_unfiled`; `PUT /v2/users/:user_id/self_assessment_returns/:period_ends_on/payments/:payment_date/mark_as_paid`; `PUT /v2/users/:user_id/self_assessment_returns/:period_ends_on/payments/:payment_date/mark_as_unpaid` |
| [Invoices](https://dev.freeagent.com/docs/invoices) | All documented invoice routes are implemented above. |
| [Journal Sets](https://dev.freeagent.com/docs/journal_sets) | `GET /v2/journal_sets`; `GET /v2/journal_sets/:id`; `GET /v2/journal_sets/opening_balances`; `POST /v2/journal_sets`; `PUT /v2/journal_sets/:id`; `DELETE /v2/journal_sets/:id` |
| [Notes](https://dev.freeagent.com/docs/notes) | `GET /v2/notes` (contact/project filters); `GET /v2/notes/:id`; `POST /v2/notes` (contact/project filters); `PUT /v2/notes/:id`; `DELETE /v2/notes/:id` |
| [Payroll](https://dev.freeagent.com/docs/payroll) | `GET /v2/payroll/:year`; `GET /v2/payroll/:year/:period`; `PUT /v2/payroll/:year/payments/:payment_date/mark_as_paid`; `GET /v2/payroll/:year/payments/:payment_date/mark_as_unpaid` (method as published in the official docs) |
| [Payroll Profiles](https://dev.freeagent.com/docs/payroll_profiles) | `GET /v2/payroll_profiles/:year` (optional user filter) |
| [Price List Items](https://dev.freeagent.com/docs/price_list_items) | `GET /v2/price_list_items`; `GET /v2/price_list_items/:id`; `POST /v2/price_list_items`; `PUT /v2/price_list_items/:id`; `DELETE /v2/price_list_item/:id` (singular path as documented) |
| [Profit & Loss](https://dev.freeagent.com/docs/profit_and_loss) | `GET /v2/accounting/profit_and_loss/summary` |
| [Projects](https://dev.freeagent.com/docs/projects) | Implemented: list/get/create/update/delete. |
| [Properties](https://dev.freeagent.com/docs/properties) | `GET /v2/properties`; `GET /v2/properties/:id`; `POST /v2/properties`; `PUT /v2/properties/:id`; `DELETE /v2/properties/:id` |
| [Recurring Invoices](https://dev.freeagent.com/docs/recurring_invoices) | `GET /v2/recurring_invoices`; `GET /v2/recurring_invoices/:id` |
| [Sales Tax Periods](https://dev.freeagent.com/docs/sales_tax_periods) | `GET /v2/sales_tax_periods`; `GET /v2/sales_tax_periods/:id`; `POST /v2/sales_tax_periods`; `PUT /v2/sales_tax_periods/:id`; `DELETE /v2/sales_tax_periods/:id` |
| [Stock Items](https://dev.freeagent.com/docs/stock_items) | `GET /v2/stock_items`; `GET /v2/stock_items/:id` |
| [Tasks](https://dev.freeagent.com/docs/tasks) | `GET /v2/tasks`; `GET /v2/tasks/:id`; `POST /v2/tasks?project=:project`; `PUT /v2/tasks/:id`; delete example is documented as `DELETE /v2/users/:id` and remains unimplemented pending evidence about the apparent route discrepancy. |
| [Timeslips](https://dev.freeagent.com/docs/timeslips) | `GET /v2/timeslips`; `GET /v2/timeslips/:id`; `POST /v2/timeslips`; `PUT /v2/timeslips/:id`; `DELETE /v2/timeslips/:id`; `POST /v2/timeslips/:id/timer`; `DELETE /v2/timeslips/:id/timer` |
| [Tracking Groups](https://dev.freeagent.com/docs/tracking_groups) | `GET /v2/tracking_groups`; `GET /v2/tracking_groups/:id` |
| [Transactions](https://dev.freeagent.com/docs/transactions) | `GET /v2/accounting/transactions`; `GET /v2/accounting/transactions/:id` |
| [Trial Balance](https://dev.freeagent.com/docs/trial_balance) | `GET /v2/accounting/trial_balance/summary`; `GET /v2/accounting/trial_balance/summary/opening_balances` |
| [Users](https://dev.freeagent.com/docs/users) | `GET /v2/users`; `GET /v2/users/:id`; `GET /v2/users/me`; `POST /v2/users`; `PUT /v2/users/:id`; `PUT /v2/users/me`; `DELETE /v2/users/:id` |
| [VAT Returns](https://dev.freeagent.com/docs/vat_returns) | `GET /v2/vat_returns`; `GET /v2/vat_returns/:period_ends_on`; `PUT /v2/vat_returns/:period_ends_on/mark_as_filed`; `PUT /v2/vat_returns/:period_ends_on/mark_as_unfiled`; `PUT /v2/vat_returns/:period_ends_on/payments/:payment_date/mark_as_paid`; `PUT /v2/vat_returns/:period_ends_on/payments/:payment_date/mark_as_unpaid` |
| [Sales Tax](https://dev.freeagent.com/docs/sales_tax) | `GET /v2/ec_moss/sales_tax_rates` |
| [Currencies](https://dev.freeagent.com/docs/currencies) | Documentation-only supported-currency list; no REST route shown. |
| [Depreciation Profiles](https://dev.freeagent.com/docs/depreciation_profiles) | Documentation-only embedded request/response fields; no REST route shown. |

### Explicit exclusions

- The separate [Accountancy Practice API](https://dev.freeagent.com/docs/accountancy_practice_api) has these practice-specific routes, all excluded from this company-account plugin: `GET /v2/clients`, `GET /v2/account_managers`, `GET /v2/account_managers/:id`, `GET /v2/account_managers/me`, and `GET /v2/practice`. Its official page requires a practice-enabled OAuth application and `X-Subdomain` for client-scoped calls; its routes and auth lifecycle are distinct from the company API. The page also documents the `minimal_data`, client status/date filters, and per-client rate limits.
- The official API overview documents both JSON and XML response formats; XML is an alternate encoding, not an XML-only route. The company-resource index pages examined did not identify XML-only routes. The plugin currently uses JSON only.
- The docs index provides resource documentation but no webhook delivery/receiver contract. Webhooks remain excluded and `webhooks` is empty.
- The API versioning page says `X-Api-Version` is optional and omitting it selects the current behavior. No date-version header is sent, so the plugin uses FreeAgent's documented current default.

## Sources and evidence

- [Official API index](https://dev.freeagent.com/docs)
- [Introduction (formats, pagination, rate limits)](https://dev.freeagent.com/docs/introduction)
- [OAuth 2.0](https://dev.freeagent.com/docs/oauth)
- [Versioning](https://dev.freeagent.com/docs/versioning)
- Each company resource page is linked in the route inventory above.
