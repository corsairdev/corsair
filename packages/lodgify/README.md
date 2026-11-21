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
| `properties.getDeleted` | `lodgify.properties.getDeleted` | `read` | GET | `/v2/deletedproperties` | List deleted property IDs since a date |
| `properties.getAddons` | `lodgify.properties.getAddons` | `read` | GET | `/v1/properties/{id}/rates/addons` | List available property add-ons |
| `properties.getPayments` | `lodgify.properties.getPayments` | `read` | GET | `/v1/properties/{id}/payments` | List available payment methods |
| `reservations.list` | `lodgify.reservations.list` | `read` | GET | `/v2/reservations/bookings` | List reservations and bookings |
| `reservations.listInbox` | `lodgify.reservations.listInbox` | `read` | GET | `/v1/reservation` | Paginate and filter bookings and enquiries |
| `reservations.get` | `lodgify.reservations.get` | `read` | GET | `/v2/reservations/bookings/{id}` | Get reservation or booking details by ID |
| `reservations.getEnquiry` | `lodgify.reservations.getEnquiry` | `read` | GET | `/v1/reservation/enquiry/{id}` | Get an enquiry including guest details |
| `reservations.create` | `lodgify.reservations.create` | `destructive` | POST | `/v1/reservation/booking` | Create a booking; may upgrade an enquiry with `from` |
| `reservations.createEnquiry` | `lodgify.reservations.createEnquiry` | `write` | POST | `/v1/reservation/enquiry` | Create an enquiry with guest and party details |
| `reservations.unreadCount` | `lodgify.reservations.unreadCount` | `read` | GET | `/v1/reservation/not_read` | Count unread bookings and enquiries |
| `availability.get` | `lodgify.availability.get` | `read` | GET | `/v2/availability/{propertyId}` | Get all room-type calendars for one property |
| `availability.getAll` | `lodgify.availability.getAll` | `read` | GET | `/v2/availability` | Get calendars for all properties |
| `availability.getRoomType` | `lodgify.availability.getRoomType` | `read` | GET | `/v2/availability/{propertyId}/{roomTypeId}` | Get one room-type calendar |
| `availability.set` | `lodgify.availability.set` | `destructive` | POST | `/v1/availability/{propertyId}/{roomTypeId}/set` | Set available units for a date range |
| `rates.calendar` | `lodgify.rates.calendar` | `read` | GET | `/v2/rates/calendar` | Read nightly rates and rate settings |
| `rates.calendarSimple` | `lodgify.rates.calendarSimple` | `read` | GET | `/v1/rates/calendar` | Read simplified nightly rates |
| `rates.settings` | `lodgify.rates.settings` | `read` | GET | `/v2/rates/settings` | Read booking and rate settings |
| `rates.update` | `lodgify.rates.update` | `destructive` | POST | `/v1/rates/savewithoutavailability` | Update default or date-specific rates |
| `quotes.calculate` | `lodgify.quotes.calculate` | `read` | GET | `/v2/quote/{propertyId}` | Calculate stay quote options |
| `messages.list` | `lodgify.messages.list` | `read` | GET | `/v2/messaging/{threadGuid}` | Read a documented message thread |
| `messages.send` | `lodgify.messages.send` | `destructive` | POST | `/v1/reservation/{booking\|enquiry}/{id}/messages` | Send one guest message to a booking or enquiry |

## Auth

All requests are authenticated using your Lodgify account API key passed in the `X-ApiKey` header:

```http
X-ApiKey: <YOUR_LODGIFY_API_KEY>
```

API access is available on Lodgify Pro and Enterprise plans under **Settings > Public API**. Without a configured key, calls throw `AuthMissingError` with a connect link for the caller to display. An explicit key can be set with `lodgify({ key: '...' })`.

Guest details are embedded in booking/enquiry responses and creation bodies; the official reference does not define a standalone guest collection endpoint. Listing operations forward Lodgify's documented pagination parameters (`page`/`size` for v2 bookings, `offset`/`limit` for the v1 inbox). Rate and availability updates change live property data and are classified as destructive.

## Webhooks

Webhooks are not handled by this plugin.

## Rate Limits & Retries

The Lodgify plugin delegates 429 rate limit retries to Corsair's rate limit handler while extracting `Retry-After` headers. Transient 429 errors will back off and retry according to server headers.

## Reference

- [Lodgify API reference](https://docs.lodgify.com/reference)
- [Lodgify API authentication](https://docs.lodgify.com/reference/authorization)
- [Properties list](https://docs.lodgify.com/reference/getallpropertiesasync)
- [Property details](https://docs.lodgify.com/reference/getpropertybyidv2)
- [Room types](https://docs.lodgify.com/reference/propertiesapi_v_getallrooms_get)
- [Deleted properties](https://docs.lodgify.com/reference/getalldeletedasync)
- [Available add-ons](https://docs.lodgify.com/reference/propertiesapi_getaddons_get)
- [Available payment methods](https://docs.lodgify.com/reference/propertiesapi_listpaymentsettings_get)
- [Nightly rates](https://docs.lodgify.com/reference/ratescalendar-v2)
- [Simplified nightly rates](https://docs.lodgify.com/reference/ratescalendar)
- [Rate settings](https://docs.lodgify.com/reference/ratesettings-v2)
- [Update rates](https://docs.lodgify.com/reference/savetiny)
- [Lodgify availability reference](https://docs.lodgify.com/reference/availability)
- [Lodgify reservation reference](https://docs.lodgify.com/reference/reservations-2)
- [Lodgify v2 reservation reference](https://docs.lodgify.com/reference/reservations)
- [Quote calculation](https://docs.lodgify.com/reference/get_v2-quote-propertyid)
- [Messaging thread](https://docs.lodgify.com/reference/get_v2-messaging-threadguid)
- [Send booking messages](https://docs.lodgify.com/reference/post_v1-reservation-booking-id-messages)
- [Send enquiry messages](https://docs.lodgify.com/reference/post_v1-reservation-enquiry-id-messages)
- Full docs, types, and examples: https://docs.corsair.dev/plugins/lodgify

## License

Apache-2.0
