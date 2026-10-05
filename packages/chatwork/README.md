# @corsair-dev/chatwork

Chatwork plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/chatwork
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `chatwork.api.account.get` | `read` | Get profile information of the authenticated user |
| `members.list` | `chatwork.api.members.list` | `read` | List members belonging to a chat room |
| `messages.get` | `chatwork.api.messages.get` | `read` | Get a specific message from a chat room |
| `messages.list` | `chatwork.api.messages.list` | `read` | List messages in a chat room |
| `messages.send` | `chatwork.api.messages.send` | `write` | Send a new message to a chat room |
| `rooms.get` | `chatwork.api.rooms.get` | `read` | Get details of a specific chat room |
| `rooms.list` | `chatwork.api.rooms.list` | `read` | List chat rooms the authenticated user belongs to |

## Auth

Auth: API key, OAuth 2.0 (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/chatwork

## License

Apache-2.0
