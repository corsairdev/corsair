# @corsair-dev/lodgify

Lodgify plugin for Corsair.

Manage vacation rental properties, room types, reservations, guest communications, quotes, and availability calendars via the Lodgify API.

## Install

```bash
pnpm add @corsair-dev/lodgify
```

## Endpoints

| Operation | Operation ID | Risk | Method | Path | Description |
|-----------|--------------|------|--------|------|-------------|
| `properties.list` | `lodgify.properties.list` | `read` | GET | `/v2/properties` | List vacation rental properties |
| `properties.get` | `lodgify.properties.get` | `read` | GET | `/v2/properties/{id}` | Get property details by ID |
| `properties.getRooms` | `lodgify.properties.getRooms` | `read` | GET | `/v2/properties/{id}/rooms` | Get room types for a property |
| `reservations.list` | `lodgify.reservations.list` | `read` | GET | `/v2/reservations/bookings` | List reservations and bookings |
| `reservations.get` | `lodgify.reservations.get` | `read` | GET | `/v2/reservations/bookings/{id}` | Get reservation or booking details by ID |
| `reservations.create` | `lodgify.reservations.create` | `write` | POST | `/v2/reservations/bookings` | Create a new reservation or booking |
| `availability.get` | `lodgify.availability.get` | `read` | GET | `/v2/availability/{propertyId}` | Get availability calendar periods for a property |
| `quotes.calculate` | `lodgify.quotes.calculate` | `read` | POST | `/v2/quote` | Calculate quote and pricing for a stay |
| `messages.list` | `lodgify.messages.list` | `read` | GET | `/v2/messages` | List guest messaging threads or messages |
| `messages.send` | `lodgify.messages.send` | `write` | POST | `/v2/messages` | Send a message to a guest or thread |

## Auth

All requests are authenticated using your Lodgify account API key passed in the `X-ApiKey` header:

```http
X-ApiKey: <YOUR_LODGIFY_API_KEY>
```

API access is available on Lodgify Pro and Enterprise plans under **Settings > Public API**. Corsair prompts your tenant for credentials on first use or allows setting an explicit key via `lodgify({ key: '...' })`.

## Webhooks

Webhooks are not handled by this plugin.

## Rate Limits & Retries

The Lodgify plugin delegates 429 rate limit retries to Corsair's rate limit handler while extracting `Retry-After` headers. Transient 429 errors will back off and retry according to server headers.

## Reference

- [Lodgify Developer Portal](https://developer.lodgify.com)
- Full docs, types, and examples: https://docs.corsair.dev/plugins/lodgify

## License

Apache-2.0
