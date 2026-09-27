# @corsair-dev/pagerduty

Pagerduty plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pagerduty
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `incidentNotes.create` | `pagerduty.api.incidentNotes.create` | `write` | Add a note to an incident |
| `incidentNotes.list` | `pagerduty.api.incidentNotes.list` | `read` | List notes for an incident |
| `incidents.create` | `pagerduty.api.incidents.create` | `write` | Create a new incident |
| `incidents.get` | `pagerduty.api.incidents.get` | `read` | Get a single incident by ID |
| `incidents.list` | `pagerduty.api.incidents.list` | `read` | List incidents with optional filters |
| `incidents.update` | `pagerduty.api.incidents.update` | `write` | Update an incident (acknowledge, resolve, reassign) |
| `logEntries.get` | `pagerduty.api.logEntries.get` | `read` | Get a single log entry by ID |
| `logEntries.list` | `pagerduty.api.logEntries.list` | `read` | List log entries |
| `users.get` | `pagerduty.api.users.get` | `read` | Get a user by ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pagerduty

## License

Apache-2.0
