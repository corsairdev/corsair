# @corsair-dev/livesession

LiveSession plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/livesession
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `alerts.create` | `livesession.api.alerts.create` | `write` | Create an alert delivered to Slack or a webhook |
| `alerts.delete` | `livesession.api.alerts.delete` | `destructive` | Permanently delete an alert by ID |
| `alerts.list` | `livesession.api.alerts.list` | `read` | List all alerts configured for the token scope |
| `alerts.update` | `livesession.api.alerts.update` | `write` | Update an existing alert by ID |
| `sessions.list` | `livesession.api.sessions.list` | `read` | List recorded sessions with page, size, visitor, email, timezone, and date filters |
| `webhooks.create` | `livesession.api.webhooks.create` | `write` | Create an outbound webhook for a website |
| `webhooks.delete` | `livesession.api.webhooks.delete` | `destructive` | Permanently delete an outbound webhook by ID |
| `webhooks.list` | `livesession.api.webhooks.list` | `read` | List all outbound webhooks for the token scope |
| `webhooks.update` | `livesession.api.webhooks.update` | `write` | Update an outbound webhook by ID |
| `websites.list` | `livesession.api.websites.list` | `read` | List all websites available to the token |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/livesession

## License

Apache-2.0
