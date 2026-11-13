# ForceManager for Corsair

ForceManager integration for Sage Sales Management v4. The plugin exposes 294
documented JSON operations across accounts, contacts, activities, campaigns,
opportunities, orders, products, users, value lists, and reference data. Each
operation validates its request and response with Zod.

## Authentication

The saved `api_key` is a ForceManager **session key**. Requests send it in the
`X-Session-Key` header. Obtain a session key first with the provider's `POST
/login` operation using your public and private API credentials; the plugin
does not store those credentials or perform login for you.

The default production API base is `https://api.forcemanager.com/api/v4`.
Select the documented sandbox base with
`forcemanager({ environment: 'sandbox' })`; it is
`https://sandbox-api.forcemanager.com/api/v4`.

## Coverage and behavior

- Operations use the official [ForceManager v4 OpenAPI contract](https://developer.forcemanager.com/openapi.yaml).
- List operations accept the documented `page` query parameter where supported;
  operations that support a total-count header expose it through `headers.count`.
- Requests use the shared Corsair HTTP transport. Automatic retries are disabled
  because the provider publishes no retry policy; HTTP 429 `Retry-After` is
  surfaced to the caller.
- Destructive operations are marked as such and should only be called after
  confirming the target identifier.
- Webhook management is not exposed.

The following documented operations are intentionally out of scope: the five
`/hooks` management operations (webhooks were not requested), `POST /login`
(authentication is provisioned separately), the hard-coded-ID deletes
`DELETE /productFamilies/232` and `DELETE /userTypes/7`, and the three upload
initiation operations (`POST /documents`, `POST /{resource}/{resourceId}/documents`,
and `POST /products/{productId}/documents`). Those upload operations return a
locator that requires a separate binary `PUT`; this plugin does not implement
that binary transfer flow.
