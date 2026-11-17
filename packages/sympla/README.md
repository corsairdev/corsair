# @corsair-dev/sympla

Sympla plugin for Corsair: read a Sympla organizer's events, presentations, orders and participants, and check participants in.

## Install

```bash
pnpm add @corsair-dev/sympla
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.list` | `sympla.api.events.list` | `read` | List the events of the Sympla organizer, with cursor pagination. |
| `events.get` | `sympla.api.events.get` | `read` | Get one event: dates, address, host, category and publication status. |
| `presentations.list` | `sympla.api.presentations.list` | `read` | List the presentations (sessions or dates) of an event. |
| `presentations.get` | `sympla.api.presentations.get` | `read` | Get one presentation of an event, with its sectors. |
| `orders.list` | `sympla.api.orders.list` | `read` | List the orders of an event, filterable by date, buyer email and cancelled status. |
| `orders.listByPresentation` | `sympla.api.orders.listByPresentation` | `read` | List the orders of one presentation of an event. |
| `orders.get` | `sympla.api.orders.get` | `read` | Get one order of an event. |
| `participants.list` | `sympla.api.participants.list` | `read` | List the participants (tickets) of an event, with check-in status. |
| `participants.listByOrder` | `sympla.api.participants.listByOrder` | `read` | List the participants (tickets) in one order. |
| `participants.listByPresentation` | `sympla.api.participants.listByPresentation` | `read` | List the participants (tickets) of one presentation. |
| `participants.get` | `sympla.api.participants.get` | `read` | Get one participant of an event by participant id. |
| `participants.getByTicketNumber` | `sympla.api.participants.getByTicketNumber` | `read` | Get one participant of an event by ticket number. |
| `participants.checkIn` | `sympla.api.participants.checkIn` | `destructive` | Check a participant in by participant id. The API has no way to undo a check-in. |
| `participants.checkInByTicketNumber` | `sympla.api.participants.checkInByTicketNumber` | `destructive` | Check a participant in by ticket number. The API has no way to undo a check-in. |
| `participants.checkInByQrCode` | `sympla.api.participants.checkInByQrCode` | `destructive` | Check a participant in with the fields of a scanned ticket QR code. The API has no way to undo a check-in. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sympla

## License

Apache-2.0
