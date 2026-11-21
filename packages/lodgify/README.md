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
| `countries.list` | `lodgify.countries.list` | `read` | [GET](https://docs.lodgify.com/reference/countriesapi_list_get) | `/v1/countries` | List supported countries |
| `countries.get` | `lodgify.countries.get` | `read` | [GET](https://docs.lodgify.com/reference/countriesapi_getbycode_get) | `/v1/countries/{code}` | Get a country by code |
| `currencies.list` | `lodgify.currencies.list` | `read` | [GET](https://docs.lodgify.com/reference/currenciesapi_list_get) | `/v1/currencies` | List supported currencies |
| `currencies.get` | `lodgify.currencies.get` | `read` | [GET](https://docs.lodgify.com/reference/currenciesapi_getbycode_get) | `/v1/currencies/{code}` | Get a currency by code |
| `channels.inventory` | `lodgify.channels.inventory` | `read` | [GET](https://docs.lodgify.com/reference/otachannelapi_getindexxml_get) | `/v1/channel/xml` | Get channel property and room ID mappings (JSON representation) |
| `properties.listV1` | `lodgify.properties.listV1` | `read` | [GET](https://docs.lodgify.com/reference/listproperties) | `/v1/properties` | List completed properties |
| `properties.getV1` | `lodgify.properties.getV1` | `read` | [GET](https://docs.lodgify.com/reference/getpropertybyid) | `/v1/properties/{id}` | Get legacy property details |
| `properties.getRoomV1` | `lodgify.properties.getRoomV1` | `read` | [GET](https://docs.lodgify.com/reference/propertiesapi_get_get) | `/v1/properties/{id}/rooms/{rid}` | Get legacy room details |
| `properties.list` | `lodgify.properties.list` | `read` | [GET](https://docs.lodgify.com/reference/getallpropertiesasync) | `/v2/properties` | Paginate properties |
| `properties.get` | `lodgify.properties.get` | `read` | [GET](https://docs.lodgify.com/reference/getpropertybyidv2) | `/v2/properties/{id}` | Get property details by ID |
| `properties.getRooms` | `lodgify.properties.getRooms` | `read` | [GET](https://docs.lodgify.com/reference/propertiesapi_v_getallrooms_get) | `/v2/properties/{id}/rooms` | Get room types for a property |
| `properties.getDeleted` | `lodgify.properties.getDeleted` | `read` | [GET](https://docs.lodgify.com/reference/getalldeletedasync) | `/v2/deletedproperties` | List deleted property IDs since a date |
| `properties.getAddons` | `lodgify.properties.getAddons` | `read` | [GET](https://docs.lodgify.com/reference/propertiesapi_getaddons_get) | `/v1/properties/{id}/rates/addons` | List available property add-ons |
| `properties.getPayments` | `lodgify.properties.getPayments` | `read` | [GET](https://docs.lodgify.com/reference/propertiesapi_listpaymentsettings_get) | `/v1/properties/{id}/payments` | List available payment methods |
| `reservations.listInbox` | `lodgify.reservations.listInbox` | `read` | [GET](https://docs.lodgify.com/reference/bookingslist-1) | `/v1/reservation` | Paginate and filter inbox bookings and enquiries |
| `reservations.unreadCount` | `lodgify.reservations.unreadCount` | `read` | [GET](https://docs.lodgify.com/reference/get_v1-reservation-not-read-1) | `/v1/reservation/not_read` | Count unread bookings and enquiries |
| `reservations.getBookingV1` | `lodgify.reservations.getBookingV1` | `read` | [GET](https://docs.lodgify.com/reference/getbookingbyid-1) | `/v1/reservation/booking/{id}` | Get full legacy booking details |
| `reservations.getEnquiry` | `lodgify.reservations.getEnquiry` | `read` | [GET](https://docs.lodgify.com/reference/getenquirybyid-1) | `/v1/reservation/enquiry/{id}` | Get an enquiry including guest details |
| `reservations.create` | `lodgify.reservations.create` | `destructive` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-booking-1) | `/v1/reservation/booking` | Create a booking; `from` upgrades an enquiry |
| `reservations.createEnquiry` | `lodgify.reservations.createEnquiry` | `destructive` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-enquiry-1) | `/v1/reservation/enquiry` | Create an enquiry |
| `reservations.createCallMeBack` | `lodgify.reservations.createCallMeBack` | `destructive` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-callmeback-1) | `/v1/reservation/callmeback` | Create a call-back enquiry and notify the owner |
| `reservations.updateBooking` | `lodgify.reservations.updateBooking` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-1) | `/v1/reservation/booking/{id}` | Update documented booking details |
| `reservations.deleteBooking` | `lodgify.reservations.deleteBooking` | `destructive` | [DELETE](https://docs.lodgify.com/reference/delete_v1-reservation-booking-id-1) | `/v1/reservation/booking/{id}` | Move a booking to the trash |
| `reservations.deleteEnquiry` | `lodgify.reservations.deleteEnquiry` | `destructive` | [DELETE](https://docs.lodgify.com/reference/delete_v1-reservation-enquiry-id-1) | `/v1/reservation/enquiry/{id}` | Move an enquiry to the trash |
| `reservations.createQuote` | `lodgify.reservations.createQuote` | `destructive` | [POST](https://docs.lodgify.com/reference/createquoteforbooking-1) | `/v1/reservation/booking/{id}/quote` | Create a booking quote without opaque Money fields |
| `reservations.getQuote` | `lodgify.reservations.getQuote` | `read` | [GET](https://docs.lodgify.com/reference/getquotebybookingid-1) | `/v1/reservation/booking/{id}/quote` | Get a booking quote |
| `reservations.getPaymentLinkV1` | `lodgify.reservations.getPaymentLinkV1` | `read` | [GET](https://docs.lodgify.com/reference/getpaymentlink-1) | `/v1/reservation/booking/{id}/quote/paymentLink` | Retrieve the current quote payment URL |
| `reservations.recoverBooking` | `lodgify.reservations.recoverBooking` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-recover-1) | `/v1/reservation/booking/{id}/recover` | Restore a booking from the trash |
| `reservations.recoverEnquiry` | `lodgify.reservations.recoverEnquiry` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-enquiry-id-recover-1) | `/v1/reservation/enquiry/{id}/recover` | Restore an enquiry from the trash |
| `reservations.reopenBooking` | `lodgify.reservations.reopenBooking` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-reopen-1) | `/v1/reservation/booking/{id}/reopen` | Reopen a booking and release availability |
| `reservations.declineBooking` | `lodgify.reservations.declineBooking` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-decline-1) | `/v1/reservation/booking/{id}/decline` | Decline a booking |
| `reservations.tentativeBooking` | `lodgify.reservations.tentativeBooking` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-tentative-1) | `/v1/reservation/booking/{id}/tentative` | Set a booking to tentative |
| `reservations.bookBooking` | `lodgify.reservations.bookBooking` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-book-1) | `/v1/reservation/booking/{id}/book` | Confirm a booking and update availability |
| `reservations.declineEnquiry` | `lodgify.reservations.declineEnquiry` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-enquiry-id-decline-1) | `/v1/reservation/enquiry/{id}/decline` | Decline an enquiry |
| `reservations.reopenEnquiry` | `lodgify.reservations.reopenEnquiry` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-enquiry-id-reopen-1) | `/v1/reservation/enquiry/{id}/reopen` | Reopen an enquiry |
| `reservations.deleteMany` | `lodgify.reservations.deleteMany` | `destructive` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-delete-1) | `/v1/reservation/delete` | Move a batch of bookings and enquiries to trash |
| `reservations.requestPayment` | `lodgify.reservations.requestPayment` | `destructive` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-request-payment-1) | `/v1/reservation/booking/{id}/request_payment` | Email a payment request to a guest |
| `reservations.checkInV1` | `lodgify.reservations.checkInV1` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-checkin) | `/v1/reservation/booking/{id}/checkin` | Set legacy booking check-in time |
| `reservations.checkOutV1` | `lodgify.reservations.checkOutV1` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-checkout) | `/v1/reservation/booking/{id}/checkout` | Set legacy booking check-out time |
| `reservations.markManyReplied` | `lodgify.reservations.markManyReplied` | `write` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-replied) | `/v1/reservation/replied` | Mark a batch as replied |
| `reservations.markManyNotReplied` | `lodgify.reservations.markManyNotReplied` | `write` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-not-replied) | `/v1/reservation/not_replied` | Mark a batch as not replied |
| `reservations.markBookingReplied` | `lodgify.reservations.markBookingReplied` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-replied) | `/v1/reservation/booking/{id}/replied` | Mark a booking as replied |
| `reservations.markEnquiryReplied` | `lodgify.reservations.markEnquiryReplied` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-enquiry-id-replied) | `/v1/reservation/enquiry/{id}/replied` | Mark an enquiry as replied |
| `reservations.markBookingNotReplied` | `lodgify.reservations.markBookingNotReplied` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-booking-id-not-replied) | `/v1/reservation/booking/{id}/not_replied` | Mark a booking as not replied |
| `reservations.markEnquiryNotReplied` | `lodgify.reservations.markEnquiryNotReplied` | `write` | [PUT](https://docs.lodgify.com/reference/put_v1-reservation-enquiry-id-not-replied) | `/v1/reservation/enquiry/{id}/not_replied` | Mark an enquiry as not replied |
| `reservations.list` | `lodgify.reservations.list` | `read` | [GET](https://docs.lodgify.com/reference/getallasync) | `/v2/reservations/bookings` | Paginate bookings and apply filters |
| `reservations.get` | `lodgify.reservations.get` | `read` | [GET](https://docs.lodgify.com/reference/getasync) | `/v2/reservations/bookings/{id}` | Get v2 booking details |
| `reservations.getExternalBookings` | `lodgify.reservations.getExternalBookings` | `read` | [GET](https://docs.lodgify.com/reference/getexternalbookingsasync) | `/v2/reservations/bookings/{id}/externalBookings` | List associated external bookings |
| `reservations.updateKeyCodes` | `lodgify.reservations.updateKeyCodes` | `destructive` | [PUT](https://docs.lodgify.com/reference/updatekeycodes) | `/v2/reservations/bookings/{id}/keyCodes` | Update room access key codes |
| `reservations.getPaymentLink` | `lodgify.reservations.getPaymentLink` | `read` | [GET](https://docs.lodgify.com/reference/getpaymentlinkasync) | `/v2/reservations/bookings/{id}/quote/paymentLink` | Get the next booking payment URL |
| `reservations.checkIn` | `lodgify.reservations.checkIn` | `write` | [PUT](https://docs.lodgify.com/reference/put_v2-reservations-bookings-id-checkin) | `/v2/reservations/bookings/{id}/checkin` | Set booking check-in time |
| `reservations.checkOut` | `lodgify.reservations.checkOut` | `write` | [PUT](https://docs.lodgify.com/reference/put_v2-reservations-bookings-id-checkout) | `/v2/reservations/bookings/{id}/checkout` | Set booking check-out time |
| `availability.getLegacyAll` | `lodgify.availability.getLegacyAll` | `read` | [GET](https://docs.lodgify.com/reference/get_v1-availability) | `/v1/availability` | Read legacy availability for all properties |
| `availability.getLegacyProperty` | `lodgify.availability.getLegacyProperty` | `read` | [GET](https://docs.lodgify.com/reference/get_v1-availability-propertyid) | `/v1/availability/{propertyId}` | Read legacy property availability |
| `availability.getLegacyRoomType` | `lodgify.availability.getLegacyRoomType` | `read` | [GET](https://docs.lodgify.com/reference/get_v1-availability-propertyid-roomtypeid) | `/v1/availability/{propertyId}/{roomTypeId}` | Read legacy room-type availability |
| `availability.get` | `lodgify.availability.get` | `read` | [GET](https://docs.lodgify.com/reference/getcalendarbyproperty) | `/v2/availability/{propertyId}` | Read all room-type calendars for a property |
| `availability.getAll` | `lodgify.availability.getAll` | `read` | [GET](https://docs.lodgify.com/reference/getcalendarbyuser) | `/v2/availability` | Read all property calendars |
| `availability.getRoomType` | `lodgify.availability.getRoomType` | `read` | [GET](https://docs.lodgify.com/reference/getcalendarbyroomtype) | `/v2/availability/{propertyId}/{roomTypeId}` | Read one room-type calendar |
| `availability.set` | `lodgify.availability.set` | `destructive` | [POST](https://docs.lodgify.com/reference/post_v1-availability-propertyid-roomtypeid-set) | `/v1/availability/{propertyId}/{roomTypeId}/set` | Set available units for a date range |
| `rates.calendarSimple` | `lodgify.rates.calendarSimple` | `read` | [GET](https://docs.lodgify.com/reference/ratescalendar) | `/v1/rates/calendar` | Read simplified nightly rates |
| `rates.calendar` | `lodgify.rates.calendar` | `read` | [GET](https://docs.lodgify.com/reference/ratescalendar-v2) | `/v2/rates/calendar` | Read nightly rates and rate settings |
| `rates.settings` | `lodgify.rates.settings` | `read` | [GET](https://docs.lodgify.com/reference/ratesettings-v2) | `/v2/rates/settings` | Read booking and rate settings |
| `rates.update` | `lodgify.rates.update` | `destructive` | [POST](https://docs.lodgify.com/reference/savetiny) | `/v1/rates/savewithoutavailability` | Update default or date-specific rates |
| `quotes.calculateV1` | `lodgify.quotes.calculateV1` | `read` | [GET](https://docs.lodgify.com/reference/get_v1-quote-propertyid-1) | `/v1/quote/{propertyId}` | Calculate legacy quote options |
| `quotes.calculate` | `lodgify.quotes.calculate` | `read` | [GET](https://docs.lodgify.com/reference/get_v2-quote-propertyid) | `/v2/quote/{propertyId}` | Calculate v2 quote options |
| `messages.list` | `lodgify.messages.list` | `read` | [GET](https://docs.lodgify.com/reference/get_v2-messaging-threadguid) | `/v2/messaging/{threadGuid}` | Read a documented message thread |
| `messages.send` | `lodgify.messages.send` | `destructive` | [POST](https://docs.lodgify.com/reference/post_v1-reservation-booking-id-messages) / [enquiry](https://docs.lodgify.com/reference/post_v1-reservation-enquiry-id-messages) | `/v1/reservation/{booking\|enquiry}/{id}/messages` | Send messages to a booking or enquiry |

## Auth

All requests are authenticated using your Lodgify account API key passed in the `X-ApiKey` header:

```http
X-ApiKey: <YOUR_LODGIFY_API_KEY>
```

API access is available on Lodgify Pro and Enterprise plans under **Settings > Public API**. Without a configured key, calls throw `AuthMissingError` with a connect link for the caller to display. An explicit key can be set with `lodgify({ key: '...' })`.

The plugin exposes 67 Corsair operations covering 68 documented method/path routes (the message-send operation selects either of its two documented resource routes). Guest details are embedded in booking/enquiry responses and creation bodies; Lodgify does not document a standalone guest collection. Listing operations forward provider pagination (`page`/`size` for v2 bookings; `offset`/`limit` for the v1 inbox). Availability/rate changes, booking lifecycle changes, payment requests, message sends, and access-code changes use elevated risk metadata.

## Scope notes

- The three `/webhooks/v1/*` management routes are omitted because webhook support is unchecked in issue #2613. The provider also documents event payloads, but no callback/webhook API is exposed by this plugin.
- Lodgify publishes no standalone guest collection route; guest data is embedded in booking and enquiry operations.
- `POST /v1/reservation/booking/{id}/quote/paymentLink` and `POST /v2/reservations/bookings/{id}/quote/paymentLink` are omitted: both request bodies reference `Money1`, which has no properties in the official OpenAPI schema.
- `reservations.createQuote` omits the optional `custom_fee_amount` field because Lodgify's OpenAPI defines its Money1 schema with no properties.
- Rate-calendar and rate-settings responses contain Lodgify `Money` values whose OpenAPI schema is an empty closed object. The plugin validates that documented shape rather than guessing amount/currency fields.

## Webhooks

Webhooks are not handled by this plugin.

## Rate Limits & Retries

The Lodgify plugin delegates 429 rate limit retries to Corsair's rate limit handler while extracting `Retry-After` headers. Transient 429 errors will back off and retry according to server headers.

## Reference

- [Lodgify API reference](https://docs.lodgify.com/reference)
- [Lodgify API authentication](https://docs.lodgify.com/reference/authorization)
- [Countries](https://docs.lodgify.com/reference/countriesapi_list_get)
- [Currencies](https://docs.lodgify.com/reference/currenciesapi_list_get)
- [Channel inventory mapping](https://docs.lodgify.com/reference/otachannelapi_getindexxml_get)
- [Legacy properties](https://docs.lodgify.com/reference/listproperties)
- [Legacy room details](https://docs.lodgify.com/reference/propertiesapi_get_get)
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
- [Lodgify v1 quote calculation](https://docs.lodgify.com/reference/get_v1-quote-propertyid-1)
- [Payment link read](https://docs.lodgify.com/reference/getpaymentlinkasync)
- [Quote calculation](https://docs.lodgify.com/reference/get_v2-quote-propertyid)
- [Messaging thread](https://docs.lodgify.com/reference/get_v2-messaging-threadguid)
- [Send booking messages](https://docs.lodgify.com/reference/post_v1-reservation-booking-id-messages)
- [Send enquiry messages](https://docs.lodgify.com/reference/post_v1-reservation-enquiry-id-messages)
- Full docs, types, and examples: https://docs.corsair.dev/plugins/lodgify

## License

Apache-2.0
