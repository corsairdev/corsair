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
| `media.list` | `postiz.api.media.list` | `read` | Page through the organization's media library, optionally filtered by file name |
| `media.uploadFromUrl` | `postiz.api.media.uploadFromUrl` | `write` | Copy a file from a public URL into the media library, for use as a post attachment |
| `notifications.list` | `postiz.api.notifications.list` | `read` | Page through the organization notifications, newest first |
| `posts.changeStatus` | `postiz.api.posts.changeStatus` | `destructive` | Move a post between draft and scheduled. Scheduling queues it to publish at its stored date to every channel it targets |
| `posts.create` | `postiz.api.posts.create` | `destructive` | Create a post as a draft, scheduled, or published immediately. A schedule or an immediate post goes out to every listed channel and cannot be recalled by this plugin once published |
| `posts.delete` | `postiz.api.posts.delete` | `destructive` | Delete a post, which also deletes every post in its group. A published post stays live on the platform |
| `posts.list` | `postiz.api.posts.list` | `read` | List posts in a date window with their state, release URL and any platform error |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use. For a self-hosted Postiz, set the account's `base_url` to the instance's https URL. For Postiz Cloud, set it to `https://api.postiz.com`; an empty value also reaches Cloud, but Corsair then reports the account as partly set up. If you pass `key` as a plugin option, also pass `baseUrl` for a self-hosted instance: an inline key never reads the stored `base_url`, so without `baseUrl` the calls go to Postiz Cloud.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postiz

## License

Apache-2.0
