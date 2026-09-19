# @corsair-dev/facebook

Facebook plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/facebook
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.create` | `facebook.api.comments.create` | `write` | Create a comment on a Page post or other object. |
| `comments.delete` | `facebook.api.comments.delete` | `write` | Delete a comment. |
| `comments.get` | `facebook.api.comments.get` | `read` | Retrieve a single comment by ID. |
| `comments.list` | `facebook.api.comments.list` | `read` | List comments on a Page post or other object. |
| `comments.update` | `facebook.api.comments.update` | `write` | Update or hide a comment. |
| `conversations.getMessages` | `facebook.api.conversations.getMessages` | `read` | List messages in a Messenger conversation. |
| `conversations.list` | `facebook.api.conversations.list` | `read` | List Messenger conversations for a Page (optional platform filter). |
| `messages.getDetails` | `facebook.api.messages.getDetails` | `read` | Retrieve a single Messenger message by ID. |
| `messages.markSeen` | `facebook.api.messages.markSeen` | `write` | Mark the most recent messages in a conversation as seen. |
| `messages.send` | `facebook.api.messages.send` | `write` | Send a text Messenger message from a Page. |
| `messages.sendMedia` | `facebook.api.messages.sendMedia` | `write` | Send a media Messenger message from a Page. |
| `messages.toggleTyping` | `facebook.api.messages.toggleTyping` | `write` | Show or hide the Messenger typing indicator. |
| `pages.assignTask` | `facebook.api.pages.assignTask` | `write` | Assign Page tasks to a business/system user via /assigned_users. |
| `pages.getDetails` | `facebook.api.pages.getDetails` | `read` | Retrieve metadata for a Facebook Page. |
| `pages.getInsights` | `facebook.api.pages.getInsights` | `read` | Retrieve Page insights for the given metrics and period. |
| `pages.getRoles` | `facebook.api.pages.getRoles` | `read` | List users and their roles on a Facebook Page. |
| `pages.listManaged` | `facebook.api.pages.listManaged` | `read` | List Facebook Pages the authenticated user manages, including page access tokens. |
| `pages.removeTask` | `facebook.api.pages.removeTask` | `write` | Remove a business/system user from Page task assignments. |
| `pages.search` | `facebook.api.pages.search` | `read` | Search Pages via /pages/search (deprecated for most apps; Workplace-only). Prefer pages.listManaged or pages.getDetails. |
| `pages.updateSettings` | `facebook.api.pages.updateSettings` | `write` | Update editable settings on a Facebook Page. |
| `photos.addToAlbum` | `facebook.api.photos.addToAlbum` | `write` | Add a photo to an existing album. |
| `photos.createAlbum` | `facebook.api.photos.createAlbum` | `write` | Create a photo album on a Page. |
| `photos.createPost` | `facebook.api.photos.createPost` | `write` | Create and publish a photo post on a Page (uses caption per Graph docs). |
| `photos.list` | `facebook.api.photos.list` | `read` | List Page photos via /photos (defaults to type=uploaded). |
| `photos.upload` | `facebook.api.photos.upload` | `write` | Upload a photo to a Page. |
| `photos.uploadBatch` | `facebook.api.photos.uploadBatch` | `write` | Upload multiple photos using the Graph API batch endpoint. |
| `posts.create` | `facebook.api.posts.create` | `write` | Publish or schedule a Page feed post (supports attached_media for multi-photo). |
| `posts.delete` | `facebook.api.posts.delete` | `write` | Delete a Page post. |
| `posts.get` | `facebook.api.posts.get` | `read` | Retrieve a single Page post by ID. |
| `posts.getInsights` | `facebook.api.posts.getInsights` | `read` | Retrieve insights for a Page post. |
| `posts.getReactions` | `facebook.api.posts.getReactions` | `read` | List reactions on a Page post. |
| `posts.list` | `facebook.api.posts.list` | `read` | List Page timeline content via /feed (page posts + visitor posts + tagged posts). |
| `posts.listScheduled` | `facebook.api.posts.listScheduled` | `read` | List scheduled but unpublished Page posts. |
| `posts.listTagged` | `facebook.api.posts.listTagged` | `read` | List posts in which the Page is tagged. |
| `posts.publishScheduled` | `facebook.api.posts.publishScheduled` | `write` | Publish a previously scheduled post immediately. |
| `posts.reschedule` | `facebook.api.posts.reschedule` | `write` | Change the scheduled publish time of a post. |
| `posts.update` | `facebook.api.posts.update` | `write` | Update an existing Page post. |
| `reactions.add` | `facebook.api.reactions.add` | `write` | Add a LIKE to a post or comment via /likes (Graph only allows LIKE programmatically). |
| `reactions.unlike` | `facebook.api.reactions.unlike` | `write` | Remove a LIKE from a post or comment via DELETE /likes. |
| `users.getCurrentUser` | `facebook.api.users.getCurrentUser` | `read` | Get the authenticated Facebook user via /me. |
| `users.getUserPages` | `facebook.api.users.getUserPages` | `read` | Deprecated. List Facebook Pages for the authenticated user via /me/accounts. |
| `videos.createPost` | `facebook.api.videos.createPost` | `write` | Create a video post on a Page using file_url. |
| `videos.list` | `facebook.api.videos.list` | `read` | List Page videos via GET /{page-id}/videos (Video API; needs pages_read_engagement + MANAGE). |
| `videos.upload` | `facebook.api.videos.upload` | `write` | Publish a Page video from file_url (same edge as createPost; not resumable/chunked). |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/facebook

## License

Apache-2.0
