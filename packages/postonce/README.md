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
| `analytics.get` | `postonce.api.analytics.get` | `read` | Per-account and per-post views, likes, comments, shares and saves over the last 7, 30 or 90 days, including posts made outside PostOnce, with each post compared to its account's median views. |
| `drafts.create` | `postonce.api.drafts.create` | `write` | Save text, media and intended accounts as a draft without publishing or scheduling it. |
| `drafts.get` | `postonce.api.drafts.get` | `read` | Get one draft. |
| `drafts.list` | `postonce.api.drafts.list` | `read` | List unscheduled drafts, newest first. Page with after = meta.next_after and after_id = meta.next_after_id. |
| `drafts.update` | `postonce.api.drafts.update` | `write` | Edit, archive, restore or mark a draft ready. Pass the draft's current updated_at as expected_updated_at; a stale value gets a 409. |
| `media.createUpload` | `postonce.api.media.createUpload` | `write` | Get a signed URL to upload an image or video to, and a media_id. After the file is PUT to the URL, media.get gives the public URL that posts and drafts accept. |
| `media.get` | `postonce.api.media.get` | `read` | Turn a media_id into the uploaded file's public URL. |
| `posts.cancel` | `postonce.api.posts.cancel` | `destructive` | Cancel a scheduled or still-pending post. The post record is kept with status cancelled; content already published on a network stays live. |
| `posts.create` | `postonce.api.posts.create` | `destructive` | Create one post for one or more connected accounts, with text and media URLs. Without publish_at it publishes immediately and cannot be recalled once live; with publish_at it is scheduled. An idempotencyKey makes a retry return the original post. |
| `posts.get` | `postonce.api.posts.get` | `read` | Get one post with its per-account delivery state: status, platform post URL and any platform error. |
| `posts.getAnalytics` | `postonce.api.posts.getAnalytics` | `read` | Views, likes, comments, shares and saves for each published copy of one post (TikTok, Instagram, YouTube and Facebook). Cached for up to an hour. |
| `posts.list` | `postonce.api.posts.list` | `read` | List the profile's posts, newest first, including dashboard and workflow posts. Page with after = meta.next_cursor. |
| `posts.publish` | `postonce.api.posts.publish` | `destructive` | Publish a scheduled post right now. It goes live on every target and cannot be recalled. |
| `posts.retryTarget` | `postonce.api.posts.retryTarget` | `destructive` | Retry one failed destination of a post (targetId from the post's targets). Published destinations are not posted again. |
| `posts.update` | `postonce.api.posts.update` | `write` | Change a scheduled post before it runs: text, accounts, media or publish time. Only the fields sent change. |
| `webhooks.create` | `postonce.api.webhooks.create` | `write` | Register an HTTPS endpoint for signed post.published, post.partially_published and post.failed events (up to 5). The reply is the only time the signing secret is shown. |
| `webhooks.delete` | `postonce.api.webhooks.delete` | `destructive` | Delete a webhook endpoint and its delivery log. |
| `webhooks.get` | `postonce.api.webhooks.get` | `read` | Get one registered webhook endpoint. |
| `webhooks.list` | `postonce.api.webhooks.list` | `read` | List registered webhook endpoints (signing secrets are not returned). |
| `workflows.create` | `postonce.api.workflows.create` | `destructive` | Create a cross-posting workflow. While active, PostOnce publishes every new post from the source account to the target accounts automatically. |
| `workflows.delete` | `postonce.api.workflows.delete` | `destructive` | Delete a cross-posting workflow and its queued items. |
| `workflows.get` | `postonce.api.workflows.get` | `read` | Get one cross-posting workflow. |
| `workflows.list` | `postonce.api.workflows.list` | `read` | List cross-posting workflows: each copies new posts from a source account to target accounts. |
| `workflows.update` | `postonce.api.workflows.update` | `destructive` | Change a cross-posting workflow: name, accounts, filters or is_active. Turning it on or adding targets makes PostOnce publish future posts to them automatically. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postonce

## License

Apache-2.0
