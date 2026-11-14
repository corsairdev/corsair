# @corsair-dev/fomo

Fomo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fomo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `application.get` | `fomo.api.application.get` | `read` | Get Fomo application settings |
| `application.getStats` | `fomo.api.application.getStats` | `read` | Get notification statistics and conversion data |
| `application.update` | `fomo.api.application.update` | `write` | Update Fomo application settings |
| `events.create` | `fomo.api.events.create` | `destructive` | Create a new Fomo event notification |
| `events.delete` | `fomo.api.events.delete` | `destructive` | Delete a Fomo event by ID |
| `events.get` | `fomo.api.events.get` | `read` | Retrieve a Fomo event by ID |
| `events.list` | `fomo.api.events.list` | `read` | List Fomo events with optional pagination |
| `events.search` | `fomo.api.events.search` | `read` | Search for an event by external_id or email_address |
| `events.update` | `fomo.api.events.update` | `write` | Update an existing Fomo event by ID |
| `templates.create` | `fomo.api.templates.create` | `write` | Create a new Fomo event template |
| `templates.delete` | `fomo.api.templates.delete` | `destructive` | Delete a Fomo event template by ID |
| `templates.get` | `fomo.api.templates.get` | `read` | Retrieve a Fomo event template by ID |
| `templates.list` | `fomo.api.templates.list` | `read` | List Fomo event templates (event types) |
| `templates.update` | `fomo.api.templates.update` | `write` | Update an existing Fomo event template |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fomo

## License

Apache-2.0
