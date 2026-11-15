# ForceManager for Corsair

ForceManager integration for Sage Sales Management v4. The plugin exposes 294
documented JSON operations across accounts, contacts, activities, campaigns,
opportunities, orders, products, users, value lists, and reference data. Each
operation validates its request and response with Zod.

## Authentication

ForceManager issues a **public** and a **private** API key (ForceAdmin, API
settings). Store the private key as the connection's `api_key` and the public
key in its `public_key` field. The plugin logs in with the pair (`POST /login`),
sends the returned session token in the `X-Session-Key` header, reuses it for
up to 30 minutes and logs in again when ForceManager answers 401 (the provider
does not document how long a session lasts).

Passing `key` in code works too: either the pair joined by a newline
(`packForceManagerCredentials({ publicKey, privateKey })`) or a session token
you obtained yourself, which the plugin sends unchanged and cannot renew.

The default production API base is `https://api.forcemanager.com/api/v4`.
Select the documented sandbox base with
`forcemanager({ environment: 'sandbox' })`; it is
`https://sandbox-api.forcemanager.com/api/v4`.

## Coverage and behavior

- Operations use the official [ForceManager v4 OpenAPI contract](https://developer.forcemanager.com/openapi.yaml).
- List operations accept the documented `page` query parameter where supported;
  operations that support a total-count header expose it through `headers.count`.
- Requests use the shared Corsair HTTP transport. HTTP 429 responses are
  retried up to three times, waiting for `Retry-After` when ForceManager sends it.
- Responses are checked against the documented shapes, but known fields may be
  missing or `null` and scalar types are not enforced: the OpenAPI examples
  the schemas come from show strings where real records often hold `null`.
- Deletes are `destructive`, and so are the writes that can email people or
  add a charge: calendar create/update (`sendNotification` emails invitations
  to contacts), user create/update (an active user can take a paid seat; the
  response's `billable` field reports it) and the generic bulk create/update
  routes, which accept any resource name.
- Webhook management is not exposed.

The following documented operations are intentionally out of scope: the five
`/hooks` management operations (webhooks were not requested), `POST /login`
(the plugin calls it itself with the stored key pair), the hard-coded-ID deletes
`DELETE /productFamilies/232` and `DELETE /userTypes/7`, and the three upload
initiation operations (`POST /documents`, `POST /{resource}/{resourceId}/documents`,
and `POST /products/{productId}/documents`). Those upload operations return a
locator that requires a separate binary `PUT`; this plugin does not implement
that binary transfer flow.
