# @corsair-dev/appointo

Appointo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/appointo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `appointments.getAvailability` | `appointo.api.appointments.getAvailability` | `read` | Get calendar availability for an appointment |
| `appointments.list` | `appointo.api.appointments.list` | `read` | List all appointments |
| `appointments.upsertConfig` | `appointo.api.appointments.upsertConfig` | `write` | Update appointment configuration |
| `bookings.cancel` | `appointo.api.bookings.cancel` | `destructive` | Cancel a booking |
| `bookings.create` | `appointo.api.bookings.create` | `write` | Create a new booking |
| `bookings.list` | `appointo.api.bookings.list` | `read` | List all bookings |
| `bookings.reschedule` | `appointo.api.bookings.reschedule` | `write` | Reschedule an existing booking |
| `bookings.update` | `appointo.api.bookings.update` | `write` | Update a booking (buffer updates) |
| `products.list` | `appointo.api.products.list` | `read` | List all products |
| `subscriptions.list` | `appointo.api.subscriptions.list` | `read` | List all appointment subscriptions |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/appointo

## License

Apache-2.0
