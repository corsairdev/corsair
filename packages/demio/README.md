# @corsair-dev/demio

Demio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/demio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.get` | `demio.api.events.get` | `read` | Read one event with every date the filter allowed |
| `events.getDate` | `demio.api.events.getDate` | `read` | Read one date of an event |
| `events.list` | `demio.api.events.list` | `read` | List events, each collapsed to one representative date |
| `ping.check` | `demio.api.ping.check` | `read` | Check that the API key and secret are accepted |
| `registrations.create` | `demio.api.registrations.create` | `write` | Register a person for an event date and return their join link |
| `reports.participants` | `demio.api.reports.participants` | `read` | List who registered for a date, whether they attended, and their custom fields |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/demio

## License

Apache-2.0
