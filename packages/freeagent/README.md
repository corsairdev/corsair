# @corsair-dev/freeagent

FreeAgent's company API integration for Corsair. The API uses OAuth 2.0 bearer access tokens and JSON requests/responses at `https://api.freeagent.com/v2`. The sandbox host is `https://api.sandbox.freeagent.com`; `freeagent({ sandbox: true })` sends OAuth and API calls there. Access tokens last one hour and the plugin refreshes them with the stored refresh token (HTTP Basic client auth at `/v2/token_endpoint`).

## Coverage summary

The plugin has **205 registered Corsair operation handlers**: the verified route operations in the matrix below plus a distinct batch-create mode for expenses on `POST /v2/expenses`. The official inventory contains **205 resource/method/version rows**: **204 implemented and mocked-wire-tested**, plus one unresolved Tasks delete entry. The Tasks page publishes `DELETE /v2/users/:id`, the same path as Users delete; this PR does not guess that it deletes a task. The plugin does implement `users.delete` for that documented Users operation. Coverage remains partial; the README does not claim complete FreeAgent API coverage.

Every registered operation has strict input validation, a response schema, risk metadata, and a wire test that checks method, host, path, query/body placement, auth headers, and output parsing. Collection operations that expose pagination return `pagination.link` and the decimal-string `pagination.total_count` from the provider headers. The five test files cover schema rejection before network access, 429/`Retry-After`, OAuth refresh behavior, and error propagation.

Invoice creation and duplication return Draft invoices. Payment, email, state changes, and conversion are separate actions. `payment_methods` uses the five keys currently documented by FreeAgent (`paypal`, `gocardless_preauth`, `gocardless_instant_bank_pay`, `stripe`, `tyl`); the hash may omit methods invalid for a particular invoice. FreeAgent documents `stripe` and `gocardless_preauth` as mutually exclusive. Invoice and estimate PDFs are returned as base64 in `pdf.content`. Email attachments are base64, limited to 5 MiB each.

Bank Transaction Explanation attachment operations use `X-Api-Version: 2026-09-01`, as required by the versioned official documentation. Other calls omit the optional version header and use FreeAgent's current default. Bank statement import supports the documented JSON transaction-array request; multipart file-upload mode is excluded.

FreeAgent's first-party [batch-expense discussion](https://api-discuss.freeagent.com/t/batch-create-expenses-and-estimate-status-inconsistencies/6753) reports a `201` response with one result per item in submission order and one observed `422` validation failure that created neither item. It does not establish whether a batch committed when the response is lost or times out. Before retrying an ambiguous batch failure, check whether the submitted expenses already exist. That evidence is reflected by `expenses.batchCreate`. The Timeslips page documents a JSON batch request but gives neither a batch response example nor a status/envelope contract; the official Changes page and API forum search did not provide a correction, so batch timeslip mode remains unresolved rather than guessed. The same first-party discussion documents estimate creation status anomalies: callers should create as `Draft` and use transitions, and should move a non-Draft estimate back to Draft before deleting it.

## Pagination, limits, and errors

FreeAgent documents 25 items per page by default and a maximum `per_page` of 100. Where a collection route offers pagination, the plugin forwards `page`/`per_page` and returns the `Link` header as `pagination.link` and `X-Total-Count` as the original decimal string in `pagination.total_count`. The company API limits are 120 requests per user per minute, 3,600 per hour, and 15 token refreshes per minute; HTTP 429 responses include `Retry-After`. The paginated GET client retries 429 responses up to three times, honoring `Retry-After`, with bounded exponential fallback when that header is absent. Other calls use Corsair's shared transport.

All implemented requests use JSON over HTTPS, OAuth 2.0 bearer tokens, and the required `User-Agent`. FreeAgent supports XML as an alternate encoding of the same routes; this plugin uses JSON only. No global provider error envelope is invented because the official docs do not specify one.

Failed POST/PUT/DELETE errors are rebuilt as `ApiError` instances with request and response payloads, query, and endpoint details omitted, because provider errors can echo customer data. The sanitized error preserves the HTTP status, status text, `Retry-After`, and rate-limit fields used by error handling. Read-only GET errors still pass through unchanged. The plugin does not log request/response bodies or customer records.

<!-- ROUTE_MATRIX_START -->

## Official company API route inventory

The inventory below reconciles each method/path/version shown by the official resource pages and the versioned Bank Transaction Explanation Attachments page. *Implemented* means a typed operation with a mocked wire-contract test. The Tasks page published delete example remains unresolved and is not guessed. Rows with the same method/path but different resource or version retain separate documentation provenance.

| Resource page | Method | Path | API version | Coverage | Official source |
| --- | --- | --- | --- | --- | --- |
| `account_locks` | GET | `/v2/account_locks` | default | Implemented | [official docs](https://dev.freeagent.com/docs/account_locks) |
| `account_locks` | PUT | `/v2/account_locks` | default | Implemented | [official docs](https://dev.freeagent.com/docs/account_locks) |
| `account_locks` | DELETE | `/v2/account_locks` | default | Implemented | [official docs](https://dev.freeagent.com/docs/account_locks) |
| `attachments` | DELETE | `/v2/attachments/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/attachments) |
| `attachments` | GET | `/v2/attachments/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/attachments) |
| `balance_sheet` | GET | `/v2/accounting/balance_sheet` | default | Implemented | [official docs](https://dev.freeagent.com/docs/balance_sheet) |
| `balance_sheet` | GET | `/v2/accounting/balance_sheet/opening_balances` | default | Implemented | [official docs](https://dev.freeagent.com/docs/balance_sheet) |
| `bank_accounts` | GET | `/v2/bank_accounts` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_accounts) |
| `bank_accounts` | POST | `/v2/bank_accounts` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_accounts) |
| `bank_accounts` | DELETE | `/v2/bank_accounts/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_accounts) |
| `bank_accounts` | GET | `/v2/bank_accounts/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_accounts) |
| `bank_accounts` | PUT | `/v2/bank_accounts/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_accounts) |
| `bank_feeds` | GET | `/v2/bank_feeds` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_feeds) |
| `bank_feeds` | GET | `/v2/bank_feeds/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_feeds) |
| `bank_transaction_explanation_attachments` | DELETE | `/v2/bank_transaction_explanations/:id/attachments` | 2026-09-01 | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanation_attachments?version=2026-09-01) |
| `bank_transaction_explanation_attachments` | GET | `/v2/bank_transaction_explanations/:id/attachments` | 2026-09-01 | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanation_attachments?version=2026-09-01) |
| `bank_transaction_explanation_attachments` | POST | `/v2/bank_transaction_explanations/:id/attachments` | 2026-09-01 | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanation_attachments?version=2026-09-01) |
| `bank_transaction_explanation_attachments` | PUT | `/v2/bank_transaction_explanations/:id/attachments` | 2026-09-01 | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanation_attachments?version=2026-09-01) |
| `bank_transaction_explanations` | GET | `/v2/bank_transaction_explanations` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanations) |
| `bank_transaction_explanations` | POST | `/v2/bank_transaction_explanations` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanations) |
| `bank_transaction_explanations` | DELETE | `/v2/bank_transaction_explanations/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanations) |
| `bank_transaction_explanations` | GET | `/v2/bank_transaction_explanations/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanations) |
| `bank_transaction_explanations` | PUT | `/v2/bank_transaction_explanations/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transaction_explanations) |
| `bank_transactions` | DELETE | `/v2/bank_transaction/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transactions) |
| `bank_transactions` | GET | `/v2/bank_transactions` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transactions) |
| `bank_transactions` | GET | `/v2/bank_transactions/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transactions) |
| `bank_transactions` | POST | `/v2/bank_transactions/statement` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bank_transactions) |
| `bills` | GET | `/v2/bills` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bills) |
| `bills` | POST | `/v2/bills` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bills) |
| `bills` | DELETE | `/v2/bills/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bills) |
| `bills` | GET | `/v2/bills/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bills) |
| `bills` | PUT | `/v2/bills/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/bills) |
| `capital_asset_types` | GET | `/v2/capital_asset_types` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_asset_types) |
| `capital_asset_types` | POST | `/v2/capital_asset_types` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_asset_types) |
| `capital_asset_types` | DELETE | `/v2/capital_asset_types/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_asset_types) |
| `capital_asset_types` | GET | `/v2/capital_asset_types/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_asset_types) |
| `capital_asset_types` | PUT | `/v2/capital_asset_types/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_asset_types) |
| `capital_assets` | GET | `/v2/capital_assets` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_assets) |
| `capital_assets` | GET | `/v2/capital_assets/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/capital_assets) |
| `cashflow` | GET | `/v2/cashflow` | default | Implemented | [official docs](https://dev.freeagent.com/docs/cashflow) |
| `categories` | GET | `/v2/categories` | default | Implemented | [official docs](https://dev.freeagent.com/docs/categories) |
| `categories` | POST | `/v2/categories` | default | Implemented | [official docs](https://dev.freeagent.com/docs/categories) |
| `categories` | DELETE | `/v2/categories/:nominal_code` | default | Implemented | [official docs](https://dev.freeagent.com/docs/categories) |
| `categories` | GET | `/v2/categories/:nominal_code` | default | Implemented | [official docs](https://dev.freeagent.com/docs/categories) |
| `categories` | PUT | `/v2/categories/:nominal_code` | default | Implemented | [official docs](https://dev.freeagent.com/docs/categories) |
| `cis_bands` | GET | `/v2/cis_bands` | default | Implemented | [official docs](https://dev.freeagent.com/docs/cis_bands) |
| `cis_settings` | GET | `/v2/cis_settings` | default | Implemented | [official docs](https://dev.freeagent.com/docs/cis_settings) |
| `cis_settings` | PUT | `/v2/cis_settings` | default | Implemented | [official docs](https://dev.freeagent.com/docs/cis_settings) |
| `company` | GET | `/v2/company` | default | Implemented | [official docs](https://dev.freeagent.com/docs/company) |
| `company` | GET | `/v2/company/business_categories` | default | Implemented | [official docs](https://dev.freeagent.com/docs/company) |
| `company` | GET | `/v2/company/tax_timeline` | default | Implemented | [official docs](https://dev.freeagent.com/docs/company) |
| `contacts` | GET | `/v2/contacts` | default | Implemented | [official docs](https://dev.freeagent.com/docs/contacts) |
| `contacts` | POST | `/v2/contacts` | default | Implemented | [official docs](https://dev.freeagent.com/docs/contacts) |
| `contacts` | DELETE | `/v2/contacts/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/contacts) |
| `contacts` | GET | `/v2/contacts/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/contacts) |
| `contacts` | PUT | `/v2/contacts/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/contacts) |
| `corporation_tax_returns` | GET | `/v2/corporation_tax_returns` | default | Implemented | [official docs](https://dev.freeagent.com/docs/corporation_tax_returns) |
| `corporation_tax_returns` | GET | `/v2/corporation_tax_returns/:period_ends_on` | default | Implemented | [official docs](https://dev.freeagent.com/docs/corporation_tax_returns) |
| `corporation_tax_returns` | PUT | `/v2/corporation_tax_returns/:period_ends_on/mark_as_filed` | default | Implemented | [official docs](https://dev.freeagent.com/docs/corporation_tax_returns) |
| `corporation_tax_returns` | PUT | `/v2/corporation_tax_returns/:period_ends_on/mark_as_paid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/corporation_tax_returns) |
| `corporation_tax_returns` | PUT | `/v2/corporation_tax_returns/:period_ends_on/mark_as_unfiled` | default | Implemented | [official docs](https://dev.freeagent.com/docs/corporation_tax_returns) |
| `corporation_tax_returns` | PUT | `/v2/corporation_tax_returns/:period_ends_on/mark_as_unpaid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/corporation_tax_returns) |
| `credit_note_reconciliations` | GET | `/v2/credit_note_reconciliations` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_note_reconciliations) |
| `credit_note_reconciliations` | POST | `/v2/credit_note_reconciliations` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_note_reconciliations) |
| `credit_note_reconciliations` | DELETE | `/v2/credit_note_reconciliations/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_note_reconciliations) |
| `credit_note_reconciliations` | GET | `/v2/credit_note_reconciliations/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_note_reconciliations) |
| `credit_note_reconciliations` | PUT | `/v2/credit_note_reconciliations/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_note_reconciliations) |
| `credit_notes` | GET | `/v2/credit_notes` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | POST | `/v2/credit_notes` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | DELETE | `/v2/credit_notes/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | GET | `/v2/credit_notes/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | PUT | `/v2/credit_notes/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | GET | `/v2/credit_notes/:id/pdf` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | POST | `/v2/credit_notes/:id/send_email` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | PUT | `/v2/credit_notes/:id/transitions/mark_as_draft` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `credit_notes` | PUT | `/v2/credit_notes/:id/transitions/mark_as_sent` | default | Implemented | [official docs](https://dev.freeagent.com/docs/credit_notes) |
| `email_addresses` | GET | `/v2/email_addresses` | default | Implemented | [official docs](https://dev.freeagent.com/docs/email_addresses) |
| `estimates` | POST | `/v2/estimate_items` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | DELETE | `/v2/estimate_items/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimate_items/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | GET | `/v2/estimates` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | POST | `/v2/estimates` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | DELETE | `/v2/estimates/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | GET | `/v2/estimates/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | POST | `/v2/estimates/:id/duplicate` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | GET | `/v2/estimates/:id/pdf` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | POST | `/v2/estimates/:id/send_email` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/:id/transitions/convert_to_invoice` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/:id/transitions/mark_as_approved` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/:id/transitions/mark_as_draft` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/:id/transitions/mark_as_rejected` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/:id/transitions/mark_as_sent` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | DELETE | `/v2/estimates/default_additional_text` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | GET | `/v2/estimates/default_additional_text` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `estimates` | PUT | `/v2/estimates/default_additional_text` | default | Implemented | [official docs](https://dev.freeagent.com/docs/estimates) |
| `expenses` | GET | `/v2/expenses` | default | Implemented | [official docs](https://dev.freeagent.com/docs/expenses) |
| `expenses` | POST | `/v2/expenses` | default | Implemented | [official docs](https://dev.freeagent.com/docs/expenses) |
| `expenses` | DELETE | `/v2/expenses/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/expenses) |
| `expenses` | GET | `/v2/expenses/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/expenses) |
| `expenses` | PUT | `/v2/expenses/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/expenses) |
| `expenses` | GET | `/v2/expenses/mileage_settings` | default | Implemented | [official docs](https://dev.freeagent.com/docs/expenses) |
| `final_accounts_reports` | GET | `/v2/final_accounts_reports` | default | Implemented | [official docs](https://dev.freeagent.com/docs/final_accounts_reports) |
| `final_accounts_reports` | GET | `/v2/final_accounts_reports/:period_ends_on` | default | Implemented | [official docs](https://dev.freeagent.com/docs/final_accounts_reports) |
| `final_accounts_reports` | PUT | `/v2/final_accounts_reports/:period_ends_on/mark_as_filed` | default | Implemented | [official docs](https://dev.freeagent.com/docs/final_accounts_reports) |
| `final_accounts_reports` | PUT | `/v2/final_accounts_reports/:period_ends_on/mark_as_unfiled` | default | Implemented | [official docs](https://dev.freeagent.com/docs/final_accounts_reports) |
| `hire_purchases` | GET | `/v2/hire_purchases` | default | Implemented | [official docs](https://dev.freeagent.com/docs/hire_purchases) |
| `hire_purchases` | GET | `/v2/hire_purchases/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/hire_purchases) |
| `income_tax_returns` | GET | `/v2/users/:user_id/self_assessment_returns` | default | Implemented | [official docs](https://dev.freeagent.com/docs/income_tax_returns) |
| `income_tax_returns` | GET | `/v2/users/:user_id/self_assessment_returns/:period_ends_on` | default | Implemented | [official docs](https://dev.freeagent.com/docs/income_tax_returns) |
| `income_tax_returns` | PUT | `/v2/users/:user_id/self_assessment_returns/:period_ends_on/mark_as_filed` | default | Implemented | [official docs](https://dev.freeagent.com/docs/income_tax_returns) |
| `income_tax_returns` | PUT | `/v2/users/:user_id/self_assessment_returns/:period_ends_on/mark_as_unfiled` | default | Implemented | [official docs](https://dev.freeagent.com/docs/income_tax_returns) |
| `income_tax_returns` | PUT | `/v2/users/:user_id/self_assessment_returns/:period_ends_on/payments/:payment_date/mark_as_paid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/income_tax_returns) |
| `income_tax_returns` | PUT | `/v2/users/:user_id/self_assessment_returns/:period_ends_on/payments/:payment_date/mark_as_unpaid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/income_tax_returns) |
| `invoices` | GET | `/v2/invoices` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | POST | `/v2/invoices` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | DELETE | `/v2/invoices/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | GET | `/v2/invoices/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | POST | `/v2/invoices/:id/direct_debit` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | POST | `/v2/invoices/:id/duplicate` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | GET | `/v2/invoices/:id/pdf` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | POST | `/v2/invoices/:id/send_email` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/:id/transitions/convert_to_credit_note` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/:id/transitions/mark_as_cancelled` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/:id/transitions/mark_as_draft` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/:id/transitions/mark_as_scheduled` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/:id/transitions/mark_as_sent` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | DELETE | `/v2/invoices/default_additional_text` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | GET | `/v2/invoices/default_additional_text` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | PUT | `/v2/invoices/default_additional_text` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `invoices` | GET | `/v2/invoices/timeline` | default | Implemented | [official docs](https://dev.freeagent.com/docs/invoices) |
| `journal_sets` | GET | `/v2/journal_sets` | default | Implemented | [official docs](https://dev.freeagent.com/docs/journal_sets) |
| `journal_sets` | POST | `/v2/journal_sets` | default | Implemented | [official docs](https://dev.freeagent.com/docs/journal_sets) |
| `journal_sets` | DELETE | `/v2/journal_sets/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/journal_sets) |
| `journal_sets` | GET | `/v2/journal_sets/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/journal_sets) |
| `journal_sets` | PUT | `/v2/journal_sets/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/journal_sets) |
| `journal_sets` | GET | `/v2/journal_sets/opening_balances` | default | Implemented | [official docs](https://dev.freeagent.com/docs/journal_sets) |
| `notes` | GET | `/v2/notes` | default | Implemented | [official docs](https://dev.freeagent.com/docs/notes) |
| `notes` | POST | `/v2/notes` | default | Implemented | [official docs](https://dev.freeagent.com/docs/notes) |
| `notes` | DELETE | `/v2/notes/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/notes) |
| `notes` | GET | `/v2/notes/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/notes) |
| `notes` | PUT | `/v2/notes/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/notes) |
| `payroll` | GET | `/v2/payroll/:year` | default | Implemented | [official docs](https://dev.freeagent.com/docs/payroll) |
| `payroll` | GET | `/v2/payroll/:year/:period` | default | Implemented | [official docs](https://dev.freeagent.com/docs/payroll) |
| `payroll` | PUT | `/v2/payroll/:year/payments/:payment_date/mark_as_paid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/payroll) |
| `payroll` | GET | `/v2/payroll/:year/payments/:payment_date/mark_as_unpaid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/payroll) |
| `payroll_profiles` | GET | `/v2/payroll_profiles/:year` | default | Implemented | [official docs](https://dev.freeagent.com/docs/payroll_profiles) |
| `price_list_items` | DELETE | `/v2/price_list_item/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/price_list_items) |
| `price_list_items` | GET | `/v2/price_list_items` | default | Implemented | [official docs](https://dev.freeagent.com/docs/price_list_items) |
| `price_list_items` | POST | `/v2/price_list_items` | default | Implemented | [official docs](https://dev.freeagent.com/docs/price_list_items) |
| `price_list_items` | GET | `/v2/price_list_items/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/price_list_items) |
| `price_list_items` | PUT | `/v2/price_list_items/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/price_list_items) |
| `profit_and_loss` | GET | `/v2/accounting/profit_and_loss/summary` | default | Implemented | [official docs](https://dev.freeagent.com/docs/profit_and_loss) |
| `projects` | GET | `/v2/projects` | default | Implemented | [official docs](https://dev.freeagent.com/docs/projects) |
| `projects` | POST | `/v2/projects` | default | Implemented | [official docs](https://dev.freeagent.com/docs/projects) |
| `projects` | DELETE | `/v2/projects/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/projects) |
| `projects` | GET | `/v2/projects/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/projects) |
| `projects` | PUT | `/v2/projects/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/projects) |
| `properties` | GET | `/v2/properties` | default | Implemented | [official docs](https://dev.freeagent.com/docs/properties) |
| `properties` | POST | `/v2/properties` | default | Implemented | [official docs](https://dev.freeagent.com/docs/properties) |
| `properties` | DELETE | `/v2/properties/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/properties) |
| `properties` | GET | `/v2/properties/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/properties) |
| `properties` | PUT | `/v2/properties/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/properties) |
| `recurring_invoices` | GET | `/v2/recurring_invoices` | default | Implemented | [official docs](https://dev.freeagent.com/docs/recurring_invoices) |
| `recurring_invoices` | GET | `/v2/recurring_invoices/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/recurring_invoices) |
| `sales_tax` | GET | `/v2/ec_moss/sales_tax_rates` | default | Implemented | [official docs](https://dev.freeagent.com/docs/sales_tax) |
| `sales_tax_periods` | GET | `/v2/sales_tax_periods` | default | Implemented | [official docs](https://dev.freeagent.com/docs/sales_tax_periods) |
| `sales_tax_periods` | POST | `/v2/sales_tax_periods` | default | Implemented | [official docs](https://dev.freeagent.com/docs/sales_tax_periods) |
| `sales_tax_periods` | DELETE | `/v2/sales_tax_periods/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/sales_tax_periods) |
| `sales_tax_periods` | GET | `/v2/sales_tax_periods/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/sales_tax_periods) |
| `sales_tax_periods` | PUT | `/v2/sales_tax_periods/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/sales_tax_periods) |
| `stock_items` | GET | `/v2/stock_items` | default | Implemented | [official docs](https://dev.freeagent.com/docs/stock_items) |
| `stock_items` | GET | `/v2/stock_items/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/stock_items) |
| `tasks` | GET | `/v2/tasks` | default | Implemented | [official docs](https://dev.freeagent.com/docs/tasks) |
| `tasks` | POST | `/v2/tasks` | default | Implemented | [official docs](https://dev.freeagent.com/docs/tasks) |
| `tasks` | GET | `/v2/tasks/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/tasks) |
| `tasks` | PUT | `/v2/tasks/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/tasks) |
| `tasks` | DELETE | `/v2/users/:id` | default | Unresolved - Tasks page publishes DELETE /v2/users/:id; not guessed as a task deletion | [official docs](https://dev.freeagent.com/docs/tasks) |
| `timeslips` | GET | `/v2/timeslips` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `timeslips` | POST | `/v2/timeslips` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `timeslips` | DELETE | `/v2/timeslips/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `timeslips` | GET | `/v2/timeslips/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `timeslips` | PUT | `/v2/timeslips/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `timeslips` | DELETE | `/v2/timeslips/:id/timer` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `timeslips` | POST | `/v2/timeslips/:id/timer` | default | Implemented | [official docs](https://dev.freeagent.com/docs/timeslips) |
| `tracking_groups` | GET | `/v2/tracking_groups` | default | Implemented | [official docs](https://dev.freeagent.com/docs/tracking_groups) |
| `tracking_groups` | GET | `/v2/tracking_groups/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/tracking_groups) |
| `transactions` | GET | `/v2/accounting/transactions` | default | Implemented | [official docs](https://dev.freeagent.com/docs/transactions) |
| `transactions` | GET | `/v2/accounting/transactions/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/transactions) |
| `trial_balance` | GET | `/v2/accounting/trial_balance/summary` | default | Implemented | [official docs](https://dev.freeagent.com/docs/trial_balance) |
| `trial_balance` | GET | `/v2/accounting/trial_balance/summary/opening_balances` | default | Implemented | [official docs](https://dev.freeagent.com/docs/trial_balance) |
| `users` | GET | `/v2/users` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `users` | POST | `/v2/users` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `users` | DELETE | `/v2/users/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `users` | GET | `/v2/users/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `users` | PUT | `/v2/users/:id` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `users` | GET | `/v2/users/me` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `users` | PUT | `/v2/users/me` | default | Implemented | [official docs](https://dev.freeagent.com/docs/users) |
| `vat_returns` | GET | `/v2/vat_returns` | default | Implemented | [official docs](https://dev.freeagent.com/docs/vat_returns) |
| `vat_returns` | GET | `/v2/vat_returns/:period_ends_on` | default | Implemented | [official docs](https://dev.freeagent.com/docs/vat_returns) |
| `vat_returns` | PUT | `/v2/vat_returns/:period_ends_on/mark_as_filed` | default | Implemented | [official docs](https://dev.freeagent.com/docs/vat_returns) |
| `vat_returns` | PUT | `/v2/vat_returns/:period_ends_on/mark_as_unfiled` | default | Implemented | [official docs](https://dev.freeagent.com/docs/vat_returns) |
| `vat_returns` | PUT | `/v2/vat_returns/:period_ends_on/payments/:payment_date/mark_as_paid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/vat_returns) |
| `vat_returns` | PUT | `/v2/vat_returns/:period_ends_on/payments/:payment_date/mark_as_unpaid` | default | Implemented | [official docs](https://dev.freeagent.com/docs/vat_returns) |

**Counts:** 205 official route/resource entries are indexed here (201 from the documentation index, plus four operations at API version `2026-09-01`). 204 entries are implemented and tested; one Tasks-resource delete operation is unresolved. The Users resource independently documents the same `DELETE /v2/users/:id` path, which is implemented only as `users.delete`.

<!-- ROUTE_MATRIX_END -->

## Explicit exclusions and unresolved contract details

- **Tasks delete:** unresolved. The official [Tasks page](https://dev.freeagent.com/docs/tasks) shows `DELETE /v2/users/:id`, and the [Users page](https://dev.freeagent.com/docs/users) documents that exact same method and path as deleting a user. The current [Changes page](https://dev.freeagent.com/docs/changes) and [Versioning page](https://dev.freeagent.com/docs/versioning) provide no corrected Tasks route or Tasks-specific version contract; no first-party OpenAPI contract or forum correction was found. Because the target resource is ambiguous, no `tasks.delete` operation is guessed. The documented Users delete operation is implemented as `users.delete`.
- **Account Locks:** implemented as `accountLocks.list`, `accountLocks.update`, and `accountLocks.delete`. The official page requires Full Access; only the user account lock can be set or deleted, while other listed locks are read-only. `earliest_lock_date` can be absent, in which case a user lock cannot be set.
- **Expenses batch-create mode:** implemented as `expenses.batchCreate`. The first-party API discussion reports a `201` result per submitted item in order and one observed `422` validation rejection that created no records. That does not prove whether a request committed if its response is lost or times out; callers should check for already-created expenses before retrying an ambiguous failure.
- **Timeslips batch-create mode:** unresolved. The official [Timeslips page](https://dev.freeagent.com/docs/timeslips) documents an array request under `timeslips` but stops without a batch response example, status code, or response envelope. The single-record `timeslip` response does not establish the batch contract; single-timeslip create is implemented, and batch mode is withheld.
- **Bill/expense recurrence:** the input schemas enforce the values published on the respective [Bills](https://dev.freeagent.com/docs/bills) and [Expenses](https://dev.freeagent.com/docs/expenses) pages: Weekly, Two Weekly, Four Weekly, Two Monthly, Quarterly, Biannually, Annually, and 2-Yearly. No Monthly support is claimed for Bills or Expenses because their current docs do not list it. The separate [Recurring Invoices](https://dev.freeagent.com/docs/recurring_invoices) page lists Monthly for a different resource and field.
- **Accountancy Practice API:** excluded. Its official contract requires a practice-enabled OAuth app and client `X-Subdomain` scoping, distinct from company-account OAuth.
- **XML:** excluded as an alternate representation, not a separate route; all company REST routes are JSON-capable.
- **Webhooks:** excluded because the official documentation does not define a verifiable delivery/receiver contract; `webhooks` is empty.
- **Multipart statement uploads:** excluded; JSON statement-array upload is implemented.
- **Documentation-only resources:** Currencies and Depreciation Profiles describe currency lists or embedded fields but show no REST route.
- **Estimate status:** the create schema accepts the observed `Draft`, `Approved`, and `Rejected` values. FreeAgent recommends creating as `Draft` and using transitions; its first-party report says `Sent` is rewritten to `Open`, while `Open` and `Invoiced` are rejected at create time. A non-Draft estimate must be returned to Draft before deletion.

All endpoint tests use mocked transport. **No live FreeAgent API call is claimed by this follow-up.**
## Sources and evidence

- [Official API index](https://dev.freeagent.com/docs)
- [Account Locks](https://dev.freeagent.com/docs/account_locks)
- [Introduction (formats, pagination, rate limits)](https://dev.freeagent.com/docs/introduction)
- [Email Addresses](https://dev.freeagent.com/docs/email_addresses)
- [Recurring Invoices](https://dev.freeagent.com/docs/recurring_invoices)
- [Tracking Groups](https://dev.freeagent.com/docs/tracking_groups)
- [OAuth 2.0](https://dev.freeagent.com/docs/oauth)
- [Versioning](https://dev.freeagent.com/docs/versioning)
- [Bank Transaction Explanation Attachments (API version 2026-09-01)](https://dev.freeagent.com/docs/bank_transaction_explanation_attachments?version=2026-09-01)
- [Invoice payment-method rules](https://dev.freeagent.com/docs/invoices#payment-methods-notes)
- [Online payment methods discussion](https://api-discuss.freeagent.com/t/online-payment-methods/782)
- [Batch expenses and estimate-status behavior](https://api-discuss.freeagent.com/t/batch-create-expenses-and-estimate-status-inconsistencies/6753)
- Each company resource page is linked in the route inventory above.
