# @corsair-dev/postmark

Transactional email API for sending single and batch messages, managing templates and streams, and reading delivery statistics.

## Install

```bash
pnpm add @corsair-dev/postmark
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bounces.activate` | `postmark.api.bounces.activate` | `write` | Reactivate an address Postmark deactivated after a bounce. A hard bounce that cannot be reactivated reports so |
| `bounces.delivery` | `postmark.api.bounces.delivery` | `read` | Read delivery statistics broken down by bounce type |
| `bounces.get` | `postmark.api.bounces.get` | `read` | Read one bounce by its numeric id |
| `bounces.list` | `postmark.api.bounces.list` | `read` | List bounces filtered by type, address, tag, message or date window |
| `email.send` | `postmark.api.email.send` | `destructive` | Send one transactional email. This delivers a real message and cannot be recalled once Postmark accepts it |
| `email.sendBatch` | `postmark.api.email.sendBatch` | `destructive` | Send up to 500 emails in one request. The response is a per-message result list, and a 200 does not mean every message was sent |
| `server.get` | `postmark.api.server.get` | `read` | Read this server's settings, including its delivery type and whether SMTP is on |
| `server.update` | `postmark.api.server.update` | `write` | Change server settings such as tracking, hook URLs and the inbound spam threshold |
| `stats.overview` | `postmark.api.stats.overview` | `read` | Read the outbound overview: sends, opens, clicks, bounces and spam complaints with their rates |
| `stats.sends` | `postmark.api.stats.sends` | `read` | Read the daily sent count over a date window |
| `streams.archive` | `postmark.api.streams.archive` | `destructive` | Archive a message stream, after which it can no longer send. The default transactional and inbound streams cannot be archived |
| `streams.get` | `postmark.api.streams.get` | `read` | Read one message stream |
| `streams.list` | `postmark.api.streams.list` | `read` | List the message streams on this server |
| `templates.create` | `postmark.api.templates.create` | `write` | Create a standard or layout template |
| `templates.delete` | `postmark.api.templates.delete` | `destructive` | Delete a template. Sends already made with it are unaffected, but it cannot be restored |
| `templates.get` | `postmark.api.templates.get` | `read` | Read one template by id or alias |
| `templates.list` | `postmark.api.templates.list` | `read` | List the templates on this server, paged by `Count` and `Offset` |
| `templates.update` | `postmark.api.templates.update` | `write` | Change a template's name, subject, bodies or alias |
| `templates.validate` | `postmark.api.templates.validate` | `read` | Render a template against a model and report whether its subject and bodies are valid |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postmark

## License

Apache-2.0
