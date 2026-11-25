# @corsair-dev/publora

Publora plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/publora
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.getContext` | `publora.api.accounts.getContext` | `read` | The plan, features, monthly and scheduled post quotas, latest allowed schedule date and allowed networks of the key's account. Check it before a batch of posts. |
| `accounts.list` | `publora.api.accounts.list` | `read` | List connected social accounts (LinkedIn, X, Instagram, Threads, TikTok, YouTube, Facebook Pages, Bluesky, Mastodon, Telegram) with connection and token status. Their platformId values are the targets for posts.create. |
| `media.complete` | `publora.api.media.complete` | `write` | Check an uploaded file right away instead of when the post is scheduled. Optional. |
| `media.createUpload` | `publora.api.media.createUpload` | `write` | Get a pre-signed URL (valid for an hour) to PUT an image, video or PDF to, attached to a draft or scheduled post group. Use this for files that are not at a public URL. |
| `media.delete` | `publora.api.media.delete` | `destructive` | Remove an uploaded file from its post group. A scheduled post goes back to draft. |
| `posts.create` | `publora.api.posts.create` | `destructive` | Create one post for one or more connected accounts, with text, media URLs, per-network settings and first comments. Without scheduledTime or publishNow it is saved as a draft; with scheduledTime it is scheduled; publishNow publishes it right away and it cannot be recalled once live. An idempotencyKey makes a retry return the original post. |
| `posts.delete` | `publora.api.posts.delete` | `destructive` | Delete a post group with all its network copies and media. Content already published on a network stays live. |
| `posts.get` | `publora.api.posts.get` | `read` | Get one post group with its status, publish time, settings, attached media and each network's delivery state, including the live post id and link once published. |
| `posts.list` | `publora.api.posts.list` | `read` | List posts, newest first, filtered by status, network and scheduled date. Page with page and limit; pagination.hasNextPage says whether another page exists. |
| `posts.update` | `publora.api.posts.update` | `destructive` | Change a draft or scheduled post: text, targets (the list is replaced), publish time, status, settings, first comments or extra media. publishNow publishes it immediately. |
| `webhooks.create` | `publora.api.webhooks.create` | `write` | Subscribe an HTTPS URL to post.scheduled, post.published, post.failed and post.demoted events (up to 10 per account; needs a paid plan). The reply is the only time the signing secret is shown. |
| `webhooks.delete` | `publora.api.webhooks.delete` | `destructive` | Delete a webhook subscription. |
| `webhooks.list` | `publora.api.webhooks.list` | `read` | List webhook subscriptions (signing secrets are not returned). |
| `webhooks.update` | `publora.api.webhooks.update` | `write` | Change a subscription's name, URL or events, or pause and resume it. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/publora

## License

Apache-2.0
