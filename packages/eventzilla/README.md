# @corsair-dev/eventzilla

Eventzilla plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/eventzilla
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attendees.checkin` | `eventzilla.api.attendees.checkin` | `write` | Check an attendee in, or revert their check-in, by ticket barcode. Passing `eventcheckin: true` twice is harmless. |
| `attendees.get` | `eventzilla.api.attendees.get` | `read` | One attendee by id, with their event, order reference and check-in state. |
| `categories.list` | `eventzilla.api.categories.list` | `read` | Event category names, for the `category` filter on events.list. Answers HTTP 200 with an error body rather than a 401 when the key is refused, which this plugin turns into an auth error. |
| `checkout.confirm` | `eventzilla.api.checkout.confirm` | `write` | Record the payment result and turn a filled checkout into a confirmed order. Emails the buyer unless `sendemail` is false. This is the step that completes a registration. |
| `checkout.create` | `eventzilla.api.checkout.create` | `write` | Reserve tickets and get one `ticket_price_id` per ticket plus a checkout id. The order stays incomplete until checkout.confirm, so an abandoned reservation holds inventory without charging anyone. |
| `checkout.fillOrder` | `eventzilla.api.checkout.fillOrder` | `write` | Attach buyer and attendee details to a reserved checkout. Nothing is charged and no email is sent until checkout.confirm. |
| `checkout.prepare` | `eventzilla.api.checkout.prepare` | `read` | What is on sale for one event date — ticket types, availability, payment options and registration questions — and the `payment_id` the later steps need. Needs the event’s `dateid`, not its `id`. |
| `events.attendees` | `eventzilla.api.events.attendees` | `read` | Every attendee for one event with their barcode, ticket type, answers and check-in state. The route takes no paging parameters, so the whole list arrives at once. |
| `events.get` | `eventzilla.api.events.get` | `read` | One event by its `id`. Answers an array even for a single id; an unknown id gives an empty array, not an error. |
| `events.list` | `eventzilla.api.events.list` | `read` | The account's events, paged with offset. Filter by status (only "live" is accepted) or category, and page with the returned next_offset. An empty account answers HTTP 200 with {"message":"No events found"} rather than an array, which is read here as an empty page. |
| `events.transactions` | `eventzilla.api.events.transactions` | `read` | Paid and pending orders for one event, with buyer, amount and reference. Paged by offset; next_offset comes back on the result. |
| `orders.cancel` | `eventzilla.api.orders.cancel` | `destructive` | Cancel an order. The order and its tickets stop standing and the buyer is not restored by any other call; issuing a replacement means a new checkout. |
| `orders.confirm` | `eventzilla.api.orders.confirm` | `write` | Confirm an order after checkout. Emails the buyer unless `sendemail` is false. Confirming an already-confirmed order is the API’s own decision to make. |
| `sales.toggle` | `eventzilla.api.sales.toggle` | `write` | Open or close ticket sales for an event. Closing a sold-out event this way is reversible by toggling back. |
| `tickets.create` | `eventzilla.api.tickets.create` | `write` | Add a free ticket type to an event. Paid pricing is not part of this route: the reference documents it as free ticket types only. |
| `tickets.list` | `eventzilla.api.tickets.list` | `read` | The ticket types on sale for one event, with price, quantity and sales window, plus any donation options. |
| `tickets.update` | `eventzilla.api.tickets.update` | `write` | Change an existing free ticket type. Every field is required, because the API treats this as a full replace rather than a patch. |
| `transactions.get` | `eventzilla.api.transactions.get` | `read` | One order by checkout id or reference number. Verified live, this route does not filter: a small integer answers the account's most recent transaction, a real checkout id answers "Unauthorized access", and an unknown reference answers "Invalid reference number" (404). Check the returned refno before trusting it. |
| `users.get` | `eventzilla.api.users.get` | `read` | One organizer by id, in the same array envelope as the list. |
| `users.list` | `eventzilla.api.users.list` | `read` | The organizer account and its sub-organizers, paged by offset. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/eventzilla

## License

Apache-2.0
