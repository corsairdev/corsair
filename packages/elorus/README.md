# Elorus for Corsair

Elorus's accounting API integration for Corsair. The plugin implements every
documented REST operation in both officially supported API versions: 333 v1.2
operations and 124 v1.1 maintenance-version operations (457 total).

| Version | JSON | Multipart upload | Binary download | Empty response | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| v1.2 | 244 | 11 | 20 | 58 | 333 |
| v1.1 | 100 | 0 | 7 | 17 | 124 |

Endpoints are grouped by version and retain Elorus's OpenAPI `operationId`, for
example `v12.invoices_list` and `v11.bills_read`. Each operation validates its
documented path, query, body/form fields and response with Zod. List methods
forward `page` and `page_size` (Elorus documents a maximum page size of 250);
pagination is caller-controlled. Documented tracking-category list filters accept
dynamic query keys such as `tc_12345`; unrelated unknown query keys are rejected.

## Authentication and organization

Elorus requires an API token in `Authorization: Token <the_token>` and the
organization ID in `X-Elorus-Organization`. Corsair stores the token as the
API-key secret and the organization ID separately as the account field
`organization_id`. For direct configuration, provide both `key` and
`organizationId`:

```ts
elorus({ key: process.env.ELORUS_API_KEY, organizationId: process.env.ELORUS_ORGANIZATION_ID });
```

Set `demo: true` to send Elorus's optional `X-Elorus-Demo: 1` header. It limits
requests to demo organizations and is intended for development.

## Responses, side effects, and retries

PDF and attachment-file operations return
`{ kind: 'binary', contentType, base64, sizeBytes }`. Binary bodies are limited
to 25 MiB. Elorus's documented list responses use page-number pagination; this
plugin does not automatically request later pages.

Deletes, document voiding and email sending (`*_email_create`,
`*_email_from_template`) are marked destructive. Other mutations and
billing-state changes are writes. The official references do not
specify a general rate limit or idempotency key. A 429 preserves `Retry-After`,
but requests are not automatically retried, avoiding accidental replay of
accounting side effects.

## API versions and scope

- **v1.2 (current):** all 333 method/path operations in the official
  [v1.2 OpenAPI document](https://developer.elorus.com/json/elorus_api_US_v1.2.52e51ba03d952000d7e231818ad4bfefaa968da4f3a7521dda374ada71335536.json).
- **v1.1 (maintenance):** all 124 method/path operations in the official
  [v1.1 OpenAPI document](https://developer.elorus.com/json/elorus_api_US_v1.1.5dcedc3b431389504fb8c2458b7d3a7e6bda3936c5292e568fd7178b4f1d4e7d.json).
  Elorus states that v1.1 remains in maintenance until **December 31, 2026**
  on its [v1.1 developer documentation](https://developer.elorus.com/v1.1/).

All documented REST methods are included, including attachment upload/download,
PDF, email, void, and delete operations. Webhooks are not implemented because
they were outside the requested scope. The plugin does not add undocumented
routes or implement automatic pagination/retries. v1.0 is not included: the
official developer portal currently lists v1.2 and v1.1 maintenance only.
