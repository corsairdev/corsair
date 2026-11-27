# @corsair-dev/ntfy

ntfy (push notification service) plugin for Corsair: publish notifications, poll topic messages, manage message sequences, and read account and server stats.

## Install

```bash
pnpm add @corsair-dev/ntfy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.usage` | `ntfy.api.account.usage` | `read` | Read the account view: tier limits, messages/emails/calls used and remaining, and the daily reset time |
| `messages.clear` | `ntfy.api.messages.clear` | `write` | Mark a message as read and dismissed on subscribers (sends a message_clear event) |
| `messages.delete` | `ntfy.api.messages.delete` | `destructive` | Delete a message by sequence id, sending a delete event to subscribers; the cache entry is removed |
| `messages.poll` | `ntfy.api.messages.poll` | `read` | Read cached messages from one or more topics, optionally including scheduled ones, with since/filters |
| `messages.send` | `ntfy.api.messages.send` | `write` | Publish a notification to a topic; every subscriber gets a push, so the send cannot be undone |
| `messages.update` | `ntfy.api.messages.update` | `write` | Publish a new version of a message under an existing sequence id; the server keeps both versions and notifies again |
| `server.health` | `ntfy.api.server.health` | `read` | Read server health (healthy flag and role) |
| `server.stats` | `ntfy.api.server.stats` | `read` | Read server-wide totals: message count and rate per second |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ntfy

## License

Apache-2.0
