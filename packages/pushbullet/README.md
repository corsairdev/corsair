# @corsair-dev/pushbullet

Pushbullet plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pushbullet
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chats.create` | `pushbullet.api.chats.create` | `write` | Start a chat with another Pushbullet user by email |
| `chats.delete` | `pushbullet.api.chats.delete` | `destructive` | Delete a chat |
| `chats.list` | `pushbullet.api.chats.list` | `read` | List the chats on the account |
| `chats.setMuted` | `pushbullet.api.chats.setMuted` | `write` | Mute or unmute a chat |
| `devices.delete` | `pushbullet.api.devices.delete` | `destructive` | Delete a device from the account |
| `devices.list` | `pushbullet.api.devices.list` | `read` | List devices registered to the account |
| `devices.register` | `pushbullet.api.devices.register` | `write` | Register a new device on the account |
| `devices.update` | `pushbullet.api.devices.update` | `write` | Update a device nickname, model or push token |
| `files.uploadRequest` | `pushbullet.api.files.uploadRequest` | `write` | Reserve an upload slot, returning the upload URL and the file URL to use in a file push |
| `pushes.create` | `pushbullet.api.pushes.create` | `write` | Send a note, link or file push to a device, person or channel |
| `pushes.delete` | `pushbullet.api.pushes.delete` | `destructive` | Delete a single push |
| `pushes.deleteAll` | `pushbullet.api.pushes.deleteAll` | `destructive` | Delete every push on the account |
| `pushes.list` | `pushbullet.api.pushes.list` | `read` | List pushes on the account, optionally modified after a time |
| `pushes.update` | `pushbullet.api.pushes.update` | `write` | Mark a push dismissed or undismissed |
| `users.me` | `pushbullet.api.users.me` | `read` | Retrieve the account the access token belongs to |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pushbullet

## License

Apache-2.0
