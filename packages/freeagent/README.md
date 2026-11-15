# @corsair-dev/freeagent

FreeAgent's company API integration for Corsair. The API uses OAuth 2.0 bearer access tokens and JSON requests/responses at `https://api.freeagent.com/v2`. The sandbox host is `https://api.sandbox.freeagent.com`.

## Current operations

| Corsair operation | HTTP route | Official reference |
| --- | --- | --- |
| `company.get` | `GET /v2/company` | [Company](https://dev.freeagent.com/docs/company) |
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
| `invoices.create` | `POST /v2/invoices` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.update` | `PUT /v2/invoices/:id` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.delete` | `DELETE /v2/invoices/:id` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.markSent` | `PUT /v2/invoices/:id/transitions/mark_as_sent` | [Invoices](https://dev.freeagent.com/docs/invoices) |
| `invoices.sendEmail` | `POST /v2/invoices/:id/send_email` | [Invoices](https://dev.freeagent.com/docs/invoices) |

Invoice creation makes a Draft invoice. Sending the email and marking the invoice sent are explicit actions. `invoices.sendEmail` allows either the documented template flag or message fields; do not assume sending an email changes invoice status.

## Pagination, limits, and errors

Collection calls accept `page` and `per_page` (1–100). FreeAgent documents 25 items per page by default, `Link` pagination relations, and `X-Total-Count`. The company API limits are 120 requests per user per minute, 3,600 per hour, and 15 token refreshes per minute; HTTP 429 responses include `Retry-After`. Corsair's shared transport owns rate-limit retries.

All documented routes use HTTPS and JSON is supported alongside XML. OAuth access tokens are sent as `Authorization: Bearer …`. A User-Agent header is sent as required by the API overview. This implementation does not invent a global provider error envelope because the official docs do not specify one; HTTP status and `Retry-After` are preserved by the shared transport.

## Exclusions and known coverage gaps

The official API index also lists accounting reports, bank feeds/transactions, bills, expenses, estimates, tax returns, payroll, users, and other company resources. They are **not implemented in this initial version**; this is a known coverage gap, not an assertion that they are incompatible. PDF endpoints return base64 content inside JSON and are compatible in principle, but are also not implemented here. Attachment records expose expiring signed URLs; fetching those URLs is not part of this package.

The separate [Accountancy Practice API](https://dev.freeagent.com/docs/accountancy_practice_api) is excluded: it requires a practice-enabled OAuth app, practice endpoints, and `X-Subdomain` client scoping, outside this company-account plugin contract. FreeAgent documents JSON and XML support, so no XML-only routes were identified in the official index; no XML parser is needed for the implemented JSON calls. Webhook delivery/receivers are not implemented because no webhook contract was requested.

## Sources

- [Introduction (pagination, rate limits, formats)](https://dev.freeagent.com/docs/introduction)
- [OAuth 2.0](https://dev.freeagent.com/docs/oauth)
- [Versioning](https://dev.freeagent.com/docs/versioning)
