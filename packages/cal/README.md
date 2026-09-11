# @corsair-dev/cal

Cal plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bookings.cancel` | `cal.api.bookings.cancel` | `destructive` | Cancel a booking [DESTRUCTIVE] |
| `bookings.confirm` | `cal.api.bookings.confirm` | `write` | Confirm a pending booking |
| `bookings.create` | `cal.api.bookings.create` | `write` | Create a new booking |
| `bookings.decline` | `cal.api.bookings.decline` | `write` | Decline a pending booking |
| `bookings.get` | `cal.api.bookings.get` | `read` | Get a booking by UID |
| `bookings.list` | `cal.api.bookings.list` | `read` | List all bookings |
| `bookings.reschedule` | `cal.api.bookings.reschedule` | `write` | Reschedule a booking to a new time |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 5 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cal

## License

Apache-2.0
