# @corsair-dev/endorsal

Endorsal REST API plugin for Corsair. It exposes 25 operations for testimonials, contacts, tags, widgets, the Wall of Love, and AutoRequest campaigns.

## Setup

Create a property-specific key at [Endorsal API settings](https://app.endorsal.io/account/api), then configure the plugin with `authType: 'api_key'`. Every request sends `Authorization: Bearer <key>`, never a query-string key. Endorsal's reference marks GET keys as optional, but the API answers 401 to every route without one, so a missing key raises `AuthMissingError` before any call.

```ts
import { endorsal } from '@corsair-dev/endorsal';

const plugin = endorsal();
```

## Operations

| Corsair operation | Method and path |
| --- | --- |
| `testimonials.get` | `GET /v1/testimonials` |
| `testimonials.byId.get` | `GET /v1/testimonials/{id}` |
| `testimonials.post` | `POST /v1/testimonials` |
| `testimonials.byId.patch` | `PATCH /v1/testimonials/{id}` |
| `testimonials.byId.delete` | `DELETE /v1/testimonials/{id}` |
| `testimonials.byId.tag.post` | `POST /v1/testimonials/{id}/tag` |
| `testimonials.search.post` | `POST /v1/testimonials/search` |
| `contacts.get` | `GET /v1/contacts` |
| `contacts.post` | `POST /v1/contacts` |
| `contacts.byId.get` | `GET /v1/contacts/{id}` |
| `contacts.byId.patch` | `PATCH /v1/contacts/{id}` |
| `contacts.byId.delete` | `DELETE /v1/contacts/{id}` |
| `contacts.search.post` | `POST /v1/contacts/search` |
| `contacts.testimonials.get` | `GET /v1/contacts/{id}/testimonials` |
| `tags.get` | `GET /v1/tags` |
| `tags.post` | `POST /v1/tags` |
| `tags.byId.get` | `GET /v1/tags/{id}` |
| `tags.byId.patch` | `PATCH /v1/tags/{id}` |
| `tags.byId.delete` | `DELETE /v1/tags/{id}` |
| `tags.testimonials.get` | `GET /v1/tags/{id}/testimonials` |
| `widgets.get` | `GET /v1/widgets` |
| `widgets.byId.get` | `GET /v1/widgets/{id}` |
| `wallOfLove.get` | `GET /v1/wall-of-love` |
| `autorequests.campaigns.get` | `GET /v1/autorequests/campaigns` |
| `autorequests.campaigns.byId.get` | `GET /v1/autorequests/campaigns/{id}` |

## Behavior and limits

- List and search operations validate Endorsal's response envelopes and resource fields with Zod. Endorsal documents complete arrays, not page/cursor parameters, so list results are returned without local pagination.
- Search comparison objects are AND-combined. Supported operators are `=`, `>`, `>=`, `<`, `<=`, `!=`, `contains`, and `in`; the `in` operator requires an array value.
- `contacts.post` takes `{ contact, campaignID? }`; `campaignID` is sent as the documented query parameter, and at least one of contact email or phone is required.
- `widgets.byId.get` and `wallOfLove.get` accept `render: true` for Endorsal's rendered HTML response. The default is the JSON resource response.
- The published API reference does not specify rate limits or pagination. The plugin preserves `Retry-After` for 429 responses and retries only safe GETs; write requests are not retried. Personal data is not included in event logs or propagated HTTP error bodies.
- Webhooks are not in scope. `POST /superlinks` is excluded because it is not present in the current [published OpenAPI document](https://developers.endorsal.io/api/v1/projects/endorsal/endorsal/nodes/Public%20API/Endorsal.v1.json); no current request or response contract could be verified for it.

## References

- [Endorsal Public REST API](https://developers.endorsal.io/docs/endorsal/YXBpOjE2OTAxMDk-public-rest-api)
- [Published OpenAPI document](https://developers.endorsal.io/api/v1/projects/endorsal/endorsal/nodes/Public%20API/Endorsal.v1.json)
