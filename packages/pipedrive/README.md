# @corsair-dev/pipedrive

Pipedrive API v2 deals and persons plugin for Corsair. The implemented API surface is deliberately partial.

## Install

```bash
pnpm add @corsair-dev/pipedrive
```

## Authentication

Configure an API token or OAuth 2.0 access token. Pipedrive accepts API tokens in the `x-api-token` header and OAuth access tokens as Bearer authorization. OAuth reads need the `deals:read` or `deals:full` scope; writes need `deals:full`.

## Implemented operations

| Operation | Method and path | Risk / token cost | OAuth scopes | Official reference |
| --- | --- | --- | --- | --- |
| `deals.list` | `GET /api/v2/deals` | Read · 10 tokens | `deals:read` or `deals:full` | [Get all deals](https://developers.pipedrive.com/docs/api/v1/Deals#getDeals) |
| `deals.get` | `GET /api/v2/deals/{id}` | Read · 1 token | `deals:read` or `deals:full` | [Get deal](https://developers.pipedrive.com/docs/api/v1/Deals#getDeal) |
| `deals.create` | `POST /api/v2/deals` | Write · 5 tokens | `deals:full` | [Add deal](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal) |
| `deals.update` | `PATCH /api/v2/deals/{id}` | Write · 5 tokens | `deals:full` | [Update deal](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal) |
| `deals.delete` | `DELETE /api/v2/deals/{id}` | Destructive · 3 tokens | `deals:full` | [Delete deal](https://developers.pipedrive.com/docs/api/v1/Deals#deleteDeal) |
| `persons.list` | `GET /api/v2/persons` | Read · 10 tokens | `contacts:read` or `contacts:full` | [Get all persons](https://developers.pipedrive.com/docs/api/v1/Persons#getPersons) |
| `persons.get` | `GET /api/v2/persons/{id}` | Read · 1 token | `contacts:read` or `contacts:full` | [Get person](https://developers.pipedrive.com/docs/api/v1/Persons#getPerson) |
| `persons.create` | `POST /api/v2/persons` | Write · 5 tokens | `contacts:full` | [Add person](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson) |
| `persons.update` | `PATCH /api/v2/persons/{id}` | Write · 5 tokens | `contacts:full` | [Update person](https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson) |
| `persons.delete` | `DELETE /api/v2/persons/{id}` | Destructive · 3 tokens | `contacts:full` | [Delete person](https://developers.pipedrive.com/docs/api/v1/Persons#deletePerson) |

The deal and person list endpoints support their documented filters, comma-separated array parameters, a maximum page size of 500, and opaque cursor pagination through `additional_data.next_cursor`. Person `emails`, `phones`, and `custom_fields` values are sent only to Pipedrive; event logs include no contact values. Person `im`, `postal_address`, `notes`, `birthday`, and `job_title` fields require contact sync to be enabled by the Pipedrive company, or Pipedrive may return 403. The `marketing_status` field depends on the company's Campaigns product and has documented transition restrictions.

Pipedrive also applies daily token budgets and per-token burst limits. The client captures `x-ratelimit-reset`; only a 429 with that documented burst reset is retried once. A 429 without a reset is not retried because daily token-budget exhaustion remains blocked until reset. See [Pipedrive rate limiting](https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting).

## Scope and limitations

This contribution is an initial slice, not complete API coverage. The official references publish 213 v1 operations and 158 v2 operations. Only the ten deals/persons operations above are currently implemented. Three webhook routes are intentionally excluded. The three v1 OAuth authorization/token exchange/refresh routes are handled by Corsair's OAuth lifecycle rather than exposed as business endpoints. The other 355 documented operations remain unimplemented, including other resources and multipart/form-encoded routes; those routes are pending, not excluded as unsupported.

Official references: [Pipedrive API v1](https://developers.pipedrive.com/docs/api/v1/openapi.yaml), [Pipedrive API v2](https://developers.pipedrive.com/docs/api/v1/openapi-v2.yaml).

## License

Apache-2.0
