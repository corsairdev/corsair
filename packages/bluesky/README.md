# @corsair-dev/bluesky

Bluesky plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bluesky
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `feeds.getTimeline` | `bluesky.api.feeds.getTimeline` | `read` | Get the home timeline feed of the authenticated user |
| `posts.create` | `bluesky.api.posts.create` | `write` | Create/publish a new post (skeet) on Bluesky |
| `posts.deleteRecord` | `bluesky.api.posts.deleteRecord` | `destructive` | Delete a post on Bluesky [DESTRUCTIVE] |
| `profiles.get` | `bluesky.api.profiles.get` | `read` | Get profile information for a Bluesky actor/user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bluesky

## License

Apache-2.0
