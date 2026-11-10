# @corsair-dev/eventbrite

Eventbrite plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/eventbrite
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attendees.get` | `eventbrite.api.attendees.get` | `read` | Read one attendee of an event |
| `attendees.list` | `eventbrite.api.attendees.list` | `read` | List an event's attendees with their ticket class, order, check-in state and barcodes. Private: requires access to the event |
| `discounts.create` | `eventbrite.api.discounts.create` | `write` | Create a discount code: a fixed amount or a percentage off, optionally limited by quantity, dates or ticket classes |
| `discounts.delete` | `eventbrite.api.discounts.delete` | `destructive` | Delete a discount code. Only an unused code can be deleted, and a deleted code cannot be restored |
| `discounts.get` | `eventbrite.api.discounts.get` | `read` | Read one discount code with its amount and usage |
| `discounts.list` | `eventbrite.api.discounts.list` | `read` | List an organization’s discounts for one scope (`event`, `multi_events` or `user`), optionally by code |
| `discounts.update` | `eventbrite.api.discounts.update` | `write` | Change a discount code |
| `events.cancel` | `eventbrite.api.events.cancel` | `write` | Cancel an event. Refused while it has any pending or completed orders; a canceled event cannot be reopened, only copied |
| `events.copy` | `eventbrite.api.events.copy` | `write` | Duplicate an event into a new draft with a new ID, copying its payment options, payout method, refund policy and tax settings |
| `events.create` | `eventbrite.api.events.create` | `write` | Create an event under an organization: name, start and end, currency, and optionally a venue or online-only, category, format and listing options |
| `events.delete` | `eventbrite.api.events.delete` | `destructive` | Permanently delete an event and, for a series parent, every occurrence. Refused while any of them has orders |
| `events.description` | `eventbrite.api.events.description` | `read` | Read the event’s fully rendered HTML description, which the event object itself no longer returns |
| `events.displaySettings` | `eventbrite.api.events.displaySettings` | `read` | Read what the listing page shows: dates, times, timezone, map and the Facebook options |
| `events.get` | `eventbrite.api.events.get` | `read` | Read one event by ID, optionally inlining its venue, organizer, category, format, logo and ticket availability |
| `events.listByOrganization` | `eventbrite.api.events.listByOrganization` | `read` | List an organization's events, filtered by status, name, currency, time window, series membership, venue, organizer or explicit IDs |
| `events.listBySeries` | `eventbrite.api.events.listBySeries` | `read` | List the occurrences of a recurring event series |
| `events.listByVenue` | `eventbrite.api.events.listByVenue` | `read` | List the events held at a venue, optionally in a start-date window |
| `events.publish` | `eventbrite.api.events.publish` | `write` | Publish an event so it can take registrations and purchases. It needs a name, an organizer, at least one ticket and valid payment options |
| `events.unpublish` | `eventbrite.api.events.unpublish` | `write` | Take a published event back to draft. Refused while the event has any pending or completed orders, unless it is completed and paid out |
| `events.update` | `eventbrite.api.events.update` | `write` | Change an event; on a series parent, name, dates, currency, capacity, password and show_remaining also apply to every occurrence |
| `events.updateDisplaySettings` | `eventbrite.api.events.updateDisplaySettings` | `write` | Change what the event listing page shows |
| `orders.get` | `eventbrite.api.orders.get` | `read` | Read one order with its buyer details and cost breakdown |
| `orders.listByEvent` | `eventbrite.api.orders.listByEvent` | `read` | List the orders of one event, filtered by status, change time, buyer email or refund request status |
| `orders.listByOrganization` | `eventbrite.api.orders.listByOrganization` | `read` | List the orders placed against an organization's events |
| `orders.listByUser` | `eventbrite.api.orders.listByUser` | `read` | List the orders one user placed. `me` reads the authenticated user’s |
| `organizations.list` | `eventbrite.api.organizations.list` | `read` | List the organizations a user belongs to, which is how you find the organization_id every other call needs |
| `questions.create` | `eventbrite.api.questions.create` | `write` | Add a custom registration question: text, paragraph, checkbox, dropdown, radio or waiver, asked of the buyer or each attendee |
| `questions.delete` | `eventbrite.api.questions.delete` | `destructive` | Delete a custom registration question and the answers already collected with it |
| `questions.get` | `eventbrite.api.questions.get` | `read` | Read one custom registration question |
| `questions.list` | `eventbrite.api.questions.list` | `read` | List the custom registration questions of an event |
| `questions.listCanned` | `eventbrite.api.questions.listCanned` | `read` | List the default questions Eventbrite adds to every event, with whether each is currently included |
| `ticketClasses.create` | `eventbrite.api.ticketClasses.create` | `write` | Add a ticket class to an event: free, donation or priced, with capacity, sale window and sales channels |
| `ticketClasses.delete` | `eventbrite.api.ticketClasses.delete` | `destructive` | Delete a ticket class. Refused once tickets have been sold from it, and not allowed for the last ticket while the event is live |
| `ticketClasses.get` | `eventbrite.api.ticketClasses.get` | `read` | Read one ticket class of an event |
| `ticketClasses.list` | `eventbrite.api.ticketClasses.list` | `read` | List an event’s ticket classes with their capacity, sold count and on-sale status |
| `ticketClasses.listForSale` | `eventbrite.api.ticketClasses.listForSale` | `read` | List the ticket classes currently purchasable at a point of sale, optionally for one promo code |
| `ticketClasses.update` | `eventbrite.api.ticketClasses.update` | `write` | Change a ticket class. The price cannot change once any ticket has sold |
| `users.get` | `eventbrite.api.users.get` | `read` | Read a user by ID |
| `users.me` | `eventbrite.api.users.me` | `read` | Read the authenticated user: id, name and verified emails |
| `venues.create` | `eventbrite.api.venues.create` | `write` | Create a venue under an organization, with its address |
| `venues.get` | `eventbrite.api.venues.get` | `read` | Read one venue with its address and coordinates |
| `venues.list` | `eventbrite.api.venues.list` | `read` | List an organization's venues |
| `venues.update` | `eventbrite.api.venues.update` | `write` | Change a venue’s name, address or capacity |
| `webhooks.create` | `eventbrite.api.webhooks.create` | `write` | Subscribe an HTTPS endpoint to event, order, attendee, organizer, ticket class or venue actions |
| `webhooks.delete` | `eventbrite.api.webhooks.delete` | `destructive` | Delete a webhook subscription together with its delivery history |
| `webhooks.list` | `eventbrite.api.webhooks.list` | `read` | List an organization's webhook subscriptions |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/eventbrite

## License

Apache-2.0
