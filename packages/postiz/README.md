# @corsair-dev/postiz

Social media scheduling API for publishing and managing posts across connected channels, exposed by Corsair.

## Install

```bash
pnpm add @corsair-dev/postiz
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.platform` | `postiz.api.analytics.platform` | `read` | Read one channel's analytics rows for a period |
| `integrations.findSlot` | `postiz.api.integrations.findSlot` | `read` | Read a channel's next free posting slot |
| `integrations.isConnected` | `postiz.api.integrations.isConnected` | `read` | Confirm the API key is valid and the workspace is reachable |
| `integrations.list` | `postiz.api.integrations.list` | `read` | List the connected channels, optionally narrowed to one customer group |
| `media.list` | `postiz.api.media.list` | `read` | Page through the organization's media library |
| `notifications.list` | `postiz.api.notifications.list` | `read` | Page through the organization notifications, newest first |
| `posts.changeStatus` | `postiz.api.posts.changeStatus` | `write` | Move a post between draft and scheduled, without touching its content or date |
| `posts.create` | `postiz.api.posts.create` | `destructive` | Create a post as a draft, scheduled, or published immediately. A schedule or an immediate post goes out to every listed channel and cannot be recalled by this plugin once published |
| `posts.delete` | `postiz.api.posts.delete` | `destructive` | Delete a post, which also deletes every post in its group. A published post stays live on the platform |
| `posts.list` | `postiz.api.posts.list` | `read` | List posts in a date window with their state, release URL and any platform error |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postiz

## License

Apache-2.0
