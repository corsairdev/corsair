# @corsair-dev/timely

Timely plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/timely
```

## Endpoints

Resources: accounts, clients, projects, users, teams, tags (labels), time entries (events), reports. List endpoints support `page` and `per_page` (max 100).

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles Timely webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/timely

## License

Apache-2.0