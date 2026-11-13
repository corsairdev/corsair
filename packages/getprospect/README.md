# @corsair-dev/getprospect

GetProspect API v2 integration for Corsair.

## Install

```bash
pnpm add @corsair-dev/getprospect
```

## Authentication

Use a GetProspect API key. The plugin sends it only in the documented `x-api-key` header; it never places the credential in a URL or logs it.

```ts
import { createCorsair } from 'corsair';
import { getprospect } from '@corsair-dev/getprospect';

const corsair = createCorsair({
	multiTenancy: true,
	plugins: [getprospect({ key: process.env.GETPROSPECT_API_KEY })],
});

const tenant = corsair.withTenant('acme');
const account = await tenant.getprospect.api.account.meGet({});
```

If the key is not passed in plugin options, configure the tenant API key through Corsair authentication. This API has no public/keyless operations.

## Endpoints

All 71 in-scope OpenAPI v2 REST operations are listed below. Request and response schemas are derived from the official specification; list and search pagination parameters are passed through as documented.

| Operation | Method | Route | Risk | Credit behavior |
| --- | --- | --- | --- | --- |
| `people.get` | GET | `/v2/people/{id}` | read | none |
| `people.editsUpdate` | PATCH | `/v2/people/{id}/edits` | write | none |
| `people.bulkEnrich` | POST | `/v2/people/bulk-enrich` | destructive | email_search,phone_search: newly revealed email; phone number found; enrich_email (on by default) / enrich_phone, per item |
| `people.calculateCredits` | POST | `/v2/people/calculate-credits` | read | none |
| `people.count` | POST | `/v2/people/count` | read | none |
| `people.enrich` | POST | `/v2/people/enrich` | destructive | email_search,phone_search: newly revealed email; phone number found; enrich_email (on by default) / enrich_phone |
| `people.enrichSearch` | POST | `/v2/people/enrich-search` | destructive | phone_search: phone number found; always, until the balance runs out |
| `people.save` | POST | `/v2/people/save` | destructive | email_search: person whose valid email is handed over and was not already owned; always; a re-save of a person already paid for is free. A person answered `searching` costs nothing until the refreshed search finds an email and the balance allows it |
| `people.saveSearch` | POST | `/v2/people/save-search` | destructive | email_search: person whose stored valid email is handed over and was not already owned; always, in search order, until the balance runs out |
| `people.search` | POST | `/v2/people/search` | destructive | email_search,phone_search: newly revealed email; phone number found; only with enrich_email / enrich_phone |
| `companies.get` | GET | `/v2/companies/{id}` | read | none |
| `companies.editsUpdate` | PATCH | `/v2/companies/{id}/edits` | write | none |
| `companies.bulkEnrich` | POST | `/v2/companies/bulk-enrich` | read | none |
| `companies.enrich` | POST | `/v2/companies/enrich` | read | none |
| `companies.save` | POST | `/v2/companies/save` | write | none |
| `companies.search` | POST | `/v2/companies/search` | read | none |
| `email.findGet` | GET | `/v2/email-finder` | destructive | email_search: served_address; a valid address is served that the workspace does not already own (the email of a revealed or saved person, and an address charged before, are free) |
| `email.verificationsList` | GET | `/v2/email-verifications` | read | none |
| `email.verificationsCreate` | POST | `/v2/email-verifications` | destructive | email_verification: billable_row; when a `data.emails` job starts on its own after counting, for `counts.billable`; `unknown` rows and rows never verified are refunded when the job ends (a `file_key` job charges at `email_verifications_start`) |
| `email.verificationsGet` | GET | `/v2/email-verifications/{id}` | read | none |
| `email.verificationsCancel` | POST | `/v2/email-verifications/{id}/cancel` | destructive | none |
| `email.verificationsResults` | GET | `/v2/email-verifications/{id}/results` | read | none |
| `email.verificationsStart` | POST | `/v2/email-verifications/{id}/start` | destructive | email_verification: billable_row; at start, for `counts.billable`; `unknown` rows and rows never verified are refunded when the job ends |
| `email.verificationsHistoryList` | GET | `/v2/email-verifications/history` | read | none |
| `email.verificationsInspect` | POST | `/v2/email-verifications/inspect` | read | none |
| `email.verifyGet` | GET | `/v2/email-verifier` | destructive | email_verification: address; a valid, invalid or accept_all verdict, once per address per workspace |
| `email.find` | POST | `/v2/email/find` | destructive | email_search: served_address; a valid address is served that the workspace does not already own (the email of a revealed or saved person, and an address charged before, are free) |
| `email.verify` | POST | `/v2/email/verify` | destructive | email_verification: address; a valid, invalid or accept_all verdict, once per address per workspace |
| `search.matchingTitles` | POST | `/v2/search/matching-titles` | read | none |
| `search.smartJobTitles` | POST | `/v2/search/smart-job-titles` | read | none |
| `search.suggest` | POST | `/v2/search/suggest` | read | none |
| `enums.list` | GET | `/v2/enums` | read | none |
| `enums.get` | GET | `/v2/enums/{name}` | read | none |
| `developer.apiLogsList` | GET | `/v2/api-logs` | read | none |
| `developer.rateLimitsGet` | GET | `/v2/rate-limits` | read | none |
| `lists.companiesListsRemove` | POST | `/v2/companies/lists/remove` | write | none |
| `lists.companiesListsSet` | POST | `/v2/companies/lists/set` | destructive | none |
| `lists.list` | GET | `/v2/lists` | read | none |
| `lists.create` | POST | `/v2/lists` | write | none |
| `lists.get` | GET | `/v2/lists/{id}` | read | none |
| `lists.delete` | DELETE | `/v2/lists/{id}` | destructive | none |
| `lists.update` | PATCH | `/v2/lists/{id}` | write | none |
| `lists.peopleListsAdd` | POST | `/v2/people/lists/add` | write | none |
| `lists.peopleListsRemove` | POST | `/v2/people/lists/remove` | write | none |
| `lists.peopleListsSet` | POST | `/v2/people/lists/set` | destructive | none |
| `exports.companiesExport` | POST | `/v2/companies/export` | write | none |
| `exports.get` | GET | `/v2/exports/{id}` | read | none |
| `exports.peopleExport` | POST | `/v2/people/export` | destructive | email_search: revealed profile not already owned; per chunk during the run, against the balance read at that chunk; emails past it are withheld |
| `jobs.get` | GET | `/v2/jobs/{id}` | read | none |
| `enrichments.companiesEnrichmentsCreate` | POST | `/v2/companies/enrichments` | write | none |
| `enrichments.list` | GET | `/v2/enrichments` | read | none |
| `enrichments.get` | GET | `/v2/enrichments/{id}` | read | none |
| `enrichments.cancel` | POST | `/v2/enrichments/{id}/cancel` | destructive | none |
| `enrichments.results` | GET | `/v2/enrichments/{id}/results` | read | none |
| `enrichments.peopleEnrichmentsCreate` | POST | `/v2/people/enrichments` | destructive | email_search,phone_search: revealed profile not already owned / address found / mobile number found; during the job |
| `trash.list` | GET | `/v2/trash` | read | none |
| `trash.companiesAdd` | POST | `/v2/trash/companies` | destructive | none |
| `trash.peopleAdd` | POST | `/v2/trash/people` | destructive | none |
| `trash.restore` | POST | `/v2/trash/restore` | write | none |
| `account.meGet` | GET | `/v2/me` | read | none |
| `billing.subscriptionGet` | GET | `/v2/billing/subscription` | read | none |
| `billing.creditsGet` | GET | `/v2/credits` | read | none |
| `billing.usageSummaryGet` | GET | `/v2/usage/summary` | read | none |
| `blocklist.companiesList` | GET | `/v2/blocklist/companies` | read | none |
| `blocklist.companiesDelete` | DELETE | `/v2/blocklist/companies/{id}` | destructive | none |
| `blocklist.companiesAdd` | POST | `/v2/blocklist/companies/add` | write | none |
| `blocklist.peopleList` | GET | `/v2/blocklist/people` | read | none |
| `blocklist.peopleDelete` | DELETE | `/v2/blocklist/people/{id}` | destructive | none |
| `blocklist.peopleAdd` | POST | `/v2/blocklist/people/add` | write | none |
| `notifications.list` | GET | `/v2/notifications` | read | none |
| `notifications.markRead` | POST | `/v2/notifications/mark-read` | write | none |

## Credits, limits, retries, and asynchronous work

GetProspect is credit- and wallet-based. A newly revealed email costs 1 email credit; a mobile number found costs $0.12 from the wallet; and an email verifier verdict of `valid`, `invalid`, or `accept_all` costs $0.0008 from the wallet. No-match lookups and `searching` email responses are not charged. Bulk operations may reserve daily rate-limit units when they start. Search uses one unit per 25 results (so `per_page` 25/50/100 uses 1/2/4 units), enrich uses one unit per record, and Email Find uses one unit per request. Job starts use a separate bucket capped at 2 requests/second, 30/minute and 1,000/day; polling is capped at 10 requests/second. Search, enrich and email bucket limits vary by plan; check `developer.rateLimitsGet` before running costly or high-volume workloads. `billing.creditsGet` returns current balances and wallet details.

Paginated operations expose provider page/per-page or cursor/limit fields and return the provider pagination metadata. Pass the next page or cursor yourself; the plugin does not fetch additional pages automatically.

Asynchronous export, enrichment, save, and trash jobs can be started by their create operation and checked with `jobs.get`, `exports.get`, or the enrichment status/results operations. Poll using the provider status and retry information; the plugin does not poll automatically.

The transport extracts `Retry-After` and does not retry internally. The endpoint error handler owns short 429 retries (up to two retries when `Retry-After` is at most 60 seconds); job/daily quota refusals and longer waits are returned without retry. A 429 is a provider refusal before execution, so it is safe to retry; 402, 5xx, and network failures are not automatically replayed. The handler preserves safe status, retry delay, and allow-listed quota reset fields while removing provider messages, request payloads, query strings, and PII from thrown API errors.

People Enrich and Email Find can take up to 95 seconds; Email Verify can take up to 80 seconds. These use the documented operation timeouts. Operation logs contain only the operation identifier, never prospect data or credentials.

## Scope and limitations

Webhook management is excluded as requested; Corsair webhook registration and inbound callback handling are outside this plugin scope. The `/v2/events` server-sent event stream is also excluded because persistent event streams are outside this plugin’s request/response transport scope. No callback or webhook fields are accepted.

The legacy `api_key` query parameters on the GET email finder/verifier routes are intentionally not exposed; all routes authenticate with `x-api-key` headers.

No GetProspect data is persisted in the Corsair database.

## Official references

- [GetProspect API documentation](https://getprospect.com/api-docs)
- [Official OpenAPI specification](https://getprospect.com/api-docs/openapi.json)
- [Credits and rate limits](https://getprospect.com/api-docs/credits-and-limits)
- [Errors](https://getprospect.com/api-docs/errors)

## License

Apache-2.0
