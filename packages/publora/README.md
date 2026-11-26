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
| `accounts.getPlatformLimits` | `publora.api.accounts.getPlatformLimits` | `read` | Live per-network limits Publora checks before scheduling (characters, images, videos, documents, GIFs, thumbnails). Use them to validate a post before sending it. |
| `accounts.list` | `publora.api.accounts.list` | `read` | List connected social accounts (LinkedIn, X, Instagram, Threads, TikTok, YouTube, Facebook Pages, Bluesky, Mastodon, Telegram) with connection and token status. Their platformId values are the targets for posts.create. |
| `accounts.testConnection` | `publora.api.accounts.testConnection` | `read` | Check that one connected account still works: token status, granted permissions and the last error, if any. |
| `analytics.postStatistics` | `publora.api.analytics.postStatistics` | `read` | Engagement counters (reactions, comments, reposts, quotes, saves and more) for up to 50 published Mastodon or Bluesky posts. Cached for about 2 hours; needs a plan with analytics. |
| `analytics.profileStatistics` | `publora.api.analytics.profileStatistics` | `read` | Followers, following and post count of one connected Mastodon or Bluesky account. Cached for about 2 hours; needs a plan with analytics. |
| `company.getWorkspaceContext` | `publora.api.company.getWorkspaceContext` | `read` | Context of one Agency Account and Workspace, to refresh its capabilities before a command. |
| `company.listConnections` | `publora.api.company.listConnections` | `read` | Publishing channels of a Workspace. Their channel keys (<platform>-<platformId>) are the platforms of company drafts. A channel with status reconnect_required must be reconnected before scheduling. |
| `company.listContexts` | `publora.api.company.listContexts` | `read` | Agency API start point: the Accounts and Workspaces the key's owner can act in, with each Workspace's capabilities. Pass a workspace id to the other company operations. |
| `company.listPlatforms` | `publora.api.company.listPlatforms` | `read` | Publishable networks with the text, media and platformSettings limits of Agency drafts. |
| `company.posts.cancelApproval` | `publora.api.company.posts.cancelApproval` | `write` | Remove the client review from a draft so it can be scheduled without the client's approval. Use only when the user asks. |
| `company.posts.completeMedia` | `publora.api.company.posts.completeMedia` | `write` | Verify an uploaded Agency media file after the PUT. On 409 AGENCY_CORE_MEDIA_UPLOAD_PENDING retry after Retry-After. |
| `company.posts.createDraft` | `publora.api.company.posts.createDraft` | `write` | Create an Agency draft in a Workspace (text, channels, per-channel text, settings, first comment). It never schedules; use company.posts.schedule. |
| `company.posts.get` | `publora.api.company.posts.get` | `read` | An Agency post group and its channel posts: status, errors, and postedId and permalink once published. includeApproval adds the client review. |
| `company.posts.getApproval` | `publora.api.company.posts.getApproval` | `read` | The client review of an Agency post group: status, comment, private review URL, expiry and decision. |
| `company.posts.listMedia` | `publora.api.company.posts.listMedia` | `read` | Media and the selected YouTube thumbnail of an Agency post group; url is set only for ready files. |
| `company.posts.recover` | `publora.api.company.posts.recover` | `write` | Copy the failed channels of a failed or partly published post group into a new draft, with its media. The source is not changed. |
| `company.posts.removeMedia` | `publora.api.company.posts.removeMedia` | `destructive` | Detach a file from an Agency draft; storage deletes it after deletionAfter. A requested client review becomes outdated. |
| `company.posts.requestApproval` | `publora.api.company.posts.requestApproval` | `write` | Start a client review round for a draft and get a private review URL. Publora does not send the URL; deliver it yourself. Editing the draft afterwards makes the round outdated. |
| `company.posts.reschedule` | `publora.api.company.posts.reschedule` | `destructive` | Move a scheduled Agency post to another time, before publishing starts. |
| `company.posts.reserveMedia` | `publora.api.company.posts.reserveMedia` | `write` | Reserve an upload for an Agency draft (or a YouTube thumbnail). PUT the exact bytes to uploadUrl with every uploadHeaders entry, then call company.posts.completeMedia. |
| `company.posts.retryApprovalNotification` | `publora.api.company.posts.retryApprovalNotification` | `destructive` | Send the review decision email to the user who requested the review again, when notificationStatus is failed. |
| `company.posts.schedule` | `publora.api.company.posts.schedule` | `destructive` | Schedule an Agency draft for a UTC time; the current time publishes it now. Channels must be usable, media ready and, while a client review is requested, approved. |
| `company.posts.unschedule` | `publora.api.company.posts.unschedule` | `write` | Return a scheduled Agency post to draft, before publishing starts. Allowed while billing is required. |
| `company.posts.updateDraft` | `publora.api.company.posts.updateDraft` | `write` | Change an Agency draft. Omitted fields keep their value. Editing makes a requested client review outdated. |
| `company.webhooks.create` | `publora.api.company.webhooks.create` | `write` | Subscribe a URL to a Workspace's post.published and post.failed events (up to 10). The reply is the only time the signing secret is shown. |
| `company.webhooks.delete` | `publora.api.company.webhooks.delete` | `destructive` | Delete a Workspace webhook subscription. |
| `company.webhooks.list` | `publora.api.company.webhooks.list` | `read` | Webhook subscriptions of a Workspace (post.published, post.failed). Workspace settings managers only. |
| `company.webhooks.regenerateSecret` | `publora.api.company.webhooks.regenerateSecret` | `destructive` | Issue a new signing secret for a Workspace subscription; the old one stops working at once. |
| `company.webhooks.update` | `publora.api.company.webhooks.update` | `write` | Change a Workspace subscription's name, URL or events, or turn it on or off. |
| `linkedin.accountStatistics` | `publora.api.linkedin.accountStatistics` | `read` | Totals or daily figures across all published LinkedIn posts of one account, optionally for a date range. |
| `linkedin.addReaction` | `publora.api.linkedin.addReaction` | `write` | React to a LinkedIn post as the connected account (LIKE, PRAISE, EMPATHY, INTEREST, APPRECIATION or ENTERTAINMENT). The reaction is public. |
| `linkedin.createComment` | `publora.api.linkedin.createComment` | `destructive` | Publish a comment, or a reply to a comment, on a LinkedIn post as the connected account. Supports @mentions and an image. |
| `linkedin.deleteComment` | `publora.api.linkedin.deleteComment` | `destructive` | Delete a comment from a LinkedIn post. |
| `linkedin.followers` | `publora.api.linkedin.followers` | `read` | LinkedIn follower count (lifetime) or daily follower growth for a date range. |
| `linkedin.mentionables` | `publora.api.linkedin.mentionables` | `read` | LinkedIn members you can @mention, collected from comments and reactions on connected company pages, each with a ready mention token. Paid plans only. |
| `linkedin.postStatistics` | `publora.api.linkedin.postStatistics` | `read` | Analytics for one LinkedIn post: impressions, members reached, reactions, comments and reshares. queryTypes "ALL" returns all five. Cached for 2 hours. |
| `linkedin.profileSummary` | `publora.api.linkedin.profileSummary` | `read` | LinkedIn profile summary: follower total and growth, plus aggregated post impressions, reactions, comments, reshares and reach. |
| `linkedin.removeReaction` | `publora.api.linkedin.removeReaction` | `write` | Remove the connected account's reaction from a LinkedIn post. |
| `linkedin.reshare` | `publora.api.linkedin.reshare` | `destructive` | Reshare a LinkedIn post to the connected account's feed (member or company page), with optional commentary. It is published right away. |
| `media.attach` | `publora.api.media.attach` | `write` | Attach one image or video to a draft or scheduled post by reference (an HTTPS download URL and a stable file id). Publora downloads it right away. A scheduled post goes back to draft and keeps its time. |
| `media.complete` | `publora.api.media.complete` | `write` | Check an uploaded file right away instead of when the post is scheduled. Optional. |
| `media.createUpload` | `publora.api.media.createUpload` | `write` | Get a pre-signed URL (valid for an hour) to PUT an image, video or PDF to, attached to a draft or scheduled post group. Use this for files that are not at a public URL. |
| `media.delete` | `publora.api.media.delete` | `destructive` | Remove an uploaded file from its post group. A scheduled post goes back to draft. |
| `media.uploadInstagramCover` | `publora.api.media.uploadInstagramCover` | `write` | Upload a cover image for an Instagram Reel (stored as JPEG). Set the returned URL as platformSettings.instagram.coverUrl with posts.update. |
| `media.uploadYoutubeThumbnail` | `publora.api.media.uploadYoutubeThumbnail` | `write` | Upload a custom YouTube thumbnail (JPEG or PNG, 2 MB max, at least 640x360) for a draft or scheduled post. Attach the returned mediaId as platformSettings.youtube.thumbnail with posts.update. |
| `posts.create` | `publora.api.posts.create` | `destructive` | Create one post for one or more connected accounts, with text, media URLs, per-network settings and first comments. Without scheduledTime or publishNow it is saved as a draft; with scheduledTime it is scheduled; publishNow publishes it right away and it cannot be recalled once live. An idempotencyKey makes a retry return the original post. |
| `posts.delete` | `publora.api.posts.delete` | `destructive` | Delete a post group with all its network copies and media. Content already published on a network stays live. |
| `posts.get` | `publora.api.posts.get` | `read` | Get one post group with its status, publish time, settings, attached media and each network's delivery state, including the live post id and link once published. |
| `posts.getLogs` | `publora.api.posts.getLogs` | `read` | Publishing log of a post group from the last 90 days, oldest first (up to 100 events): scheduled, processing, attempts, successes, failures and retries per network. |
| `posts.list` | `publora.api.posts.list` | `read` | List posts, newest first, filtered by status, network and scheduled date. Page with page and limit; pagination.hasNextPage says whether another page exists. |
| `posts.update` | `publora.api.posts.update` | `destructive` | Change a draft or scheduled post: text, targets (the list is replaced), publish time, status, settings, first comments or extra media. publishNow publishes it immediately. |
| `webhooks.create` | `publora.api.webhooks.create` | `write` | Subscribe an HTTPS URL to post.scheduled, post.published, post.failed and post.demoted events (up to 10 per account; needs a paid plan). The reply is the only time the signing secret is shown. |
| `webhooks.delete` | `publora.api.webhooks.delete` | `destructive` | Delete a webhook subscription. |
| `webhooks.list` | `publora.api.webhooks.list` | `read` | List webhook subscriptions (signing secrets are not returned). |
| `webhooks.regenerateSecret` | `publora.api.webhooks.regenerateSecret` | `destructive` | Issue a new signing secret for a webhook subscription. The old secret stops working at once, so deliveries fail verification until the receiver has the new one. |
| `webhooks.update` | `publora.api.webhooks.update` | `write` | Change a subscription's name, URL or events, or pause and resume it. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/publora

## License

Apache-2.0
