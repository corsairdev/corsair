# @corsair-dev/ghost

Publish with Ghost: posts, pages, tags, members and their custom fields, labels, newsletters, tiers, offers, staff users, roles and invites, image, media and file uploads, themes and webhooks through the Admin API, and published content through the Content API (82 operations), plus signed webhooks.

## Install

```bash
pnpm add @corsair-dev/ghost
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `content.authors.get` | `ghost.api.content.authors.get` | `read` | Read a published author by id. Content API. Uses the Content API key. |
| `content.authors.getBySlug` | `ghost.api.content.authors.getBySlug` | `read` | Read a published author by slug. Content API. Uses the Content API key. |
| `content.authors.list` | `ghost.api.content.authors.list` | `read` | Browse published authors. Content API: public content only. Uses the Content API key. |
| `content.pages.get` | `ghost.api.content.pages.get` | `read` | Read a published page by id. Content API. Uses the Content API key. |
| `content.pages.getBySlug` | `ghost.api.content.pages.getBySlug` | `read` | Read a published page by slug. Content API. Uses the Content API key. |
| `content.pages.list` | `ghost.api.content.pages.list` | `read` | Browse published pages. Content API: public content only. Uses the Content API key. |
| `content.posts.get` | `ghost.api.content.posts.get` | `read` | Read a published post by id. Content API. Uses the Content API key. |
| `content.posts.getBySlug` | `ghost.api.content.posts.getBySlug` | `read` | Read a published post by slug. Content API. Uses the Content API key. |
| `content.posts.list` | `ghost.api.content.posts.list` | `read` | Browse published posts. Content API: public content only. Uses the Content API key. |
| `content.settings.get` | `ghost.api.content.settings.get` | `read` | Read public settings. Content API: title, description, logo, navigation and the other public settings. Uses the Content API key. |
| `content.tags.get` | `ghost.api.content.tags.get` | `read` | Read a published tag by id. Content API. Uses the Content API key. |
| `content.tags.getBySlug` | `ghost.api.content.tags.getBySlug` | `read` | Read a published tag by slug. Content API. Uses the Content API key. |
| `content.tags.list` | `ghost.api.content.tags.list` | `read` | Browse published tags. Content API: public content only. Uses the Content API key. |
| `content.tiers.list` | `ghost.api.content.tiers.list` | `read` | Browse tiers. Content API: the public tiers and their prices. Uses the Content API key. |
| `files.upload` | `ghost.api.files.upload` | `write` | Upload a file. Any file for a file card. Returns its URL. |
| `images.upload` | `ghost.api.images.upload` | `write` | Upload an image. Returns the image URL to use in posts. JPEG, PNG, GIF, SVG, WebP (icon: also ICO). |
| `invites.create` | `ghost.api.invites.create` | `destructive` | Invite a staff user. Emails an invitation to join the site with the given role. Ghost emails the invitation; a site without mail set up answers 500 "Error sending email!". |
| `invites.delete` | `ghost.api.invites.delete` | `destructive` | Revoke a staff invitation. Cannot be undone. |
| `invites.list` | `ghost.api.invites.list` | `read` | Browse pending staff invitations. Needs a staff access token: an integration key answers 403 (live 11-28). |
| `labels.create` | `ghost.api.labels.create` | `write` | Add a label. (POST /admin/labels/) |
| `labels.delete` | `ghost.api.labels.delete` | `destructive` | Delete a label. Cannot be undone. (DELETE /admin/labels/{id}/) |
| `labels.get` | `ghost.api.labels.get` | `read` | Read a label by id. (GET /admin/labels/{id}/) |
| `labels.getBySlug` | `ghost.api.labels.getBySlug` | `read` | Read a label by slug. (GET /admin/labels/slug/{slug}/) |
| `labels.list` | `ghost.api.labels.list` | `read` | Browse labels. Lists labels, 15 per page by default. |
| `labels.update` | `ghost.api.labels.update` | `write` | Edit a label. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `media.upload` | `ghost.api.media.upload` | `write` | Upload a video or audio file. MP4, WebM, OGG, MP3, WAV, M4A. Returns the file URL. |
| `members.create` | `ghost.api.members.create` | `destructive` | Add a member. With send_email true, Ghost emails the member a sign-in link. |
| `members.customFields.create` | `ghost.api.members.customFields.create` | `write` | Add a member custom field. The key is made from the name and never changes. |
| `members.customFields.delete` | `ghost.api.members.customFields.delete` | `destructive` | Delete a member custom field. Deletes the field and every member's value for it. Archive the field first (status archived): an active field answers 422. Cannot be undone. |
| `members.customFields.get` | `ghost.api.members.customFields.get` | `read` | Read a member custom field. (GET /admin/members/metafields/custom/{key}/) |
| `members.customFields.list` | `ghost.api.members.customFields.list` | `read` | Browse member custom fields. Active fields by default; filter status:archived or status:[active,archived]. |
| `members.customFields.reorder` | `ghost.api.members.customFields.reorder` | `write` | Reorder member custom fields. Send every active field in the new order. |
| `members.customFields.update` | `ghost.api.members.customFields.update` | `write` | Edit a member custom field. Rename it, change its options or access, or archive it (status archived). |
| `members.delete` | `ghost.api.members.delete` | `destructive` | Delete a member. Cannot be undone. (DELETE /admin/members/{id}/) |
| `members.get` | `ghost.api.members.get` | `read` | Read a member by id. (GET /admin/members/{id}/) |
| `members.list` | `ghost.api.members.list` | `read` | Browse members. Lists members, the 15 newest by default. Use filter (status:paid, label:vip, email:...) and search. |
| `members.update` | `ghost.api.members.update` | `write` | Edit a member. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `newsletters.create` | `ghost.api.newsletters.create` | `write` | Add a newsletter. (POST /admin/newsletters/) |
| `newsletters.get` | `ghost.api.newsletters.get` | `read` | Read a newsletter by id. (GET /admin/newsletters/{id}/) |
| `newsletters.list` | `ghost.api.newsletters.list` | `read` | Browse newsletters. Lists newsletters, 15 per page by default. |
| `newsletters.update` | `ghost.api.newsletters.update` | `write` | Edit a newsletter. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `offers.create` | `ghost.api.offers.create` | `write` | Add a offer. (POST /admin/offers/) |
| `offers.get` | `ghost.api.offers.get` | `read` | Read a offer by id. (GET /admin/offers/{id}/) |
| `offers.list` | `ghost.api.offers.list` | `read` | Browse offers. Lists offers, 15 per page by default. |
| `offers.update` | `ghost.api.offers.update` | `write` | Edit a offer. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `pages.copy` | `ghost.api.pages.copy` | `write` | Copy a page. Makes a draft copy of the page. |
| `pages.create` | `ghost.api.pages.create` | `write` | Add a page. (POST /admin/pages/) |
| `pages.delete` | `ghost.api.pages.delete` | `destructive` | Delete a page. Cannot be undone. (DELETE /admin/pages/{id}/) |
| `pages.get` | `ghost.api.pages.get` | `read` | Read a page by id. (GET /admin/pages/{id}/) |
| `pages.getBySlug` | `ghost.api.pages.getBySlug` | `read` | Read a page by slug. (GET /admin/pages/slug/{slug}/) |
| `pages.list` | `ghost.api.pages.list` | `read` | Browse pages. Lists pages, 15 per page by default. |
| `pages.update` | `ghost.api.pages.update` | `write` | Edit a page. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `posts.copy` | `ghost.api.posts.copy` | `write` | Copy a post. Makes a draft copy of the post. |
| `posts.create` | `ghost.api.posts.create` | `destructive` | Add a post. Creating with status published puts the post on the live site; pass source=html to send html instead of lexical. |
| `posts.delete` | `ghost.api.posts.delete` | `destructive` | Delete a post. Cannot be undone. (DELETE /admin/posts/{id}/) |
| `posts.get` | `ghost.api.posts.get` | `read` | Read a post by id. (GET /admin/posts/{id}/) |
| `posts.getBySlug` | `ghost.api.posts.getBySlug` | `read` | Read a post by slug. (GET /admin/posts/slug/{slug}/) |
| `posts.list` | `ghost.api.posts.list` | `read` | Browse posts. Lists posts, 15 per page by default. |
| `posts.update` | `ghost.api.posts.update` | `destructive` | Edit a post. Send updated_at as read: a stale value answers 409. Publishing with newsletter set emails the post to members. Send updated_at as last read (a stale value answers 409). Setting status published with the newsletter query value emails the post to members, which cannot be undone. |
| `roles.list` | `ghost.api.roles.list` | `read` | Browse staff roles. Use permissions=assign to list only the roles this key may give. |
| `site.get` | `ghost.api.site.get` | `read` | Read site details. The site title, description, logo, icon, accent colour, URL and Ghost version. No authentication needed. Works without authentication. |
| `tags.create` | `ghost.api.tags.create` | `write` | Add a tag. (POST /admin/tags/) |
| `tags.delete` | `ghost.api.tags.delete` | `destructive` | Delete a tag. Cannot be undone. (DELETE /admin/tags/{id}/) |
| `tags.get` | `ghost.api.tags.get` | `read` | Read a tag by id. (GET /admin/tags/{id}/) |
| `tags.getBySlug` | `ghost.api.tags.getBySlug` | `read` | Read a tag by slug. (GET /admin/tags/slug/{slug}/) |
| `tags.list` | `ghost.api.tags.list` | `read` | Browse tags. Lists tags, 15 per page by default. |
| `tags.update` | `ghost.api.tags.update` | `write` | Edit a tag. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `themes.activate` | `ghost.api.themes.activate` | `destructive` | Activate a theme. Switches the live site to this theme. Switches the live site to this theme. |
| `themes.upload` | `ghost.api.themes.upload` | `destructive` | Upload a theme. A theme ZIP. A theme with the same name is replaced. |
| `tiers.create` | `ghost.api.tiers.create` | `write` | Add a tier. (POST /admin/tiers/) |
| `tiers.get` | `ghost.api.tiers.get` | `read` | Read a tier by id. (GET /admin/tiers/{id}/) |
| `tiers.list` | `ghost.api.tiers.list` | `read` | Browse tiers. Lists tiers, 15 per page by default. |
| `tiers.update` | `ghost.api.tiers.update` | `write` | Edit a tier. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently. |
| `users.delete` | `ghost.api.users.delete` | `destructive` | Delete a staff user. Their posts move to the owner. Needs a staff access token of an Administrator (an integration key answers 403). Needs a staff access token of an Administrator: an integration key answers 403. Cannot be undone. |
| `users.get` | `ghost.api.users.get` | `read` | Read a staff user by id. (GET /admin/users/{id}/) |
| `users.getByEmail` | `ghost.api.users.getByEmail` | `read` | Read a staff user by email. (GET /admin/users/email/{email}/) |
| `users.getBySlug` | `ghost.api.users.getBySlug` | `read` | Read a staff user by slug. (GET /admin/users/slug/{slug}/) |
| `users.list` | `ghost.api.users.list` | `read` | Browse staff users. (GET /admin/users/) |
| `users.update` | `ghost.api.users.update` | `write` | Edit a staff user. Needs a staff access token or a user session (an integration key answers 403). Needs a staff access token (an Administrator's): an integration key answers 403. |
| `webhooks.create` | `ghost.api.webhooks.create` | `write` | Add a webhook. Ghost POSTs the event to target_url, signed with the secret. |
| `webhooks.delete` | `ghost.api.webhooks.delete` | `destructive` | Delete a webhook. Cannot be undone. (DELETE /admin/webhooks/{id}/) |
| `webhooks.update` | `ghost.api.webhooks.update` | `write` | Edit a webhook. (PUT /admin/webhooks/{id}/) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 29 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ghost

## License

Apache-2.0
