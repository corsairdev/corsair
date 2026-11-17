# @corsair-dev/postonce

PostOnce plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/postonce
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.list` | `postonce.api.accounts.list` | `read` | List connected social accounts (LinkedIn, X, Threads, Bluesky, Facebook Pages, Instagram, TikTok, YouTube, Pinterest) with status, capabilities and media requirements. Their ids are the targets for posts.create. |
| `posts.cancel` | `postonce.api.posts.cancel` | `destructive` | Cancel a scheduled or still-pending post. The post record is kept with status cancelled; content already published on a network stays live. |
| `posts.create` | `postonce.api.posts.create` | `destructive` | Create one post for one or more connected accounts, with text and media URLs. Without publish_at it publishes immediately and cannot be recalled once live; with publish_at it is scheduled. An idempotencyKey makes a retry return the original post. |
| `posts.get` | `postonce.api.posts.get` | `read` | Get one post with its per-account delivery state: status, platform post URL and any platform error. |
| `posts.list` | `postonce.api.posts.list` | `read` | List the profile's posts, newest first, including dashboard and workflow posts. Page with after = meta.next_cursor. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postonce

## License

Apache-2.0
