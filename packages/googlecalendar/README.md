# @corsair-dev/googlecalendar

Google calendar plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googlecalendar
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calendar.getAvailability` | `googlecalendar.api.calendar.getAvailability` | `read` | Busy time ranges only, no event details; use events.getMany to see the events |
| `events.create` | `googlecalendar.api.events.create` | `write` | Create a new calendar event |
| `events.delete` | `googlecalendar.api.events.delete` | `destructive` | Delete a calendar event [DESTRUCTIVE] |
| `events.get` | `googlecalendar.api.events.get` | `read` | Get one event by its event id, not the iCalUID. For one occurrence of a recurring event, use the instance id from events.getMany with singleEvents true |
| `events.getMany` | `googlecalendar.api.events.getMany` | `read` | List events in a time window. Set singleEvents true or recurring events appear once; page with pageToken until nextPageToken is empty |
| `events.update` | `googlecalendar.api.events.update` | `write` | Update an existing calendar event |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlecalendar

## License

Apache-2.0
