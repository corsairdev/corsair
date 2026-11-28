# @corsair-dev/discourse

Run a Discourse forum: topics, posts, private messages, categories, tags, groups, users and their moderation, badges, invites, notifications, search, uploads and backups (95 operations), plus signed webhooks.

## Install

```bash
pnpm add @corsair-dev/discourse
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `backups.create` | `discourse.api.backups.create` | `destructive` | Create backup. Needs an admin API key. (POST /admin/backups.json) |
| `backups.download` | `discourse.api.backups.download` | `read` | Download backup. The backup file needs the download token from the email backups.sendDownloadEmail sends. Needs an admin API key. |
| `backups.list` | `discourse.api.backups.list` | `read` | List backups. Needs an admin API key. (GET /admin/backups.json) |
| `backups.sendDownloadEmail` | `discourse.api.backups.sendDownloadEmail` | `destructive` | Send download backup email. Needs an admin API key. |
| `badges.create` | `discourse.api.badges.create` | `write` | Create badge. Needs an admin API key. (POST /admin/badges.json) |
| `badges.delete` | `discourse.api.badges.delete` | `destructive` | Delete badge. Needs an admin API key. Cannot be undone. |
| `badges.grant` | `discourse.api.badges.grant` | `destructive` | Grant a badge to a user. (POST /user_badges.json) |
| `badges.list` | `discourse.api.badges.list` | `read` | List badges. Needs an admin API key. (GET /admin/badges.json) |
| `badges.listForUser` | `discourse.api.badges.listForUser` | `read` | List badges for a user. (GET /user-badges/{username}.json) |
| `badges.update` | `discourse.api.badges.update` | `write` | Update badge. Needs an admin API key. (PUT /admin/badges/{id}.json) |
| `categories.create` | `discourse.api.categories.create` | `write` | Creates a category. (POST /categories.json) |
| `categories.get` | `discourse.api.categories.get` | `read` | Show category. (GET /c/{id}/show.json) |
| `categories.list` | `discourse.api.categories.list` | `read` | Retrieves a list of categories. (GET /categories.json) |
| `categories.listTopics` | `discourse.api.categories.listTopics` | `read` | List topics. (GET /c/{slug}/{id}.json) |
| `categories.update` | `discourse.api.categories.update` | `write` | Updates a category. (PUT /categories/{id}.json) |
| `events.exportIcs` | `discourse.api.events.exportIcs` | `read` | Export calendar events in iCalendar format. Needs the Discourse Calendar (post event) plugin: without it the route answers 404. |
| `events.list` | `discourse.api.events.list` | `read` | List calendar events. Needs the Discourse Calendar (post event) plugin: without it the route answers 404. |
| `groups.addMembers` | `discourse.api.groups.addMembers` | `write` | Add group members. (PUT /groups/{id}/members.json) |
| `groups.create` | `discourse.api.groups.create` | `write` | Create a group. Needs an admin API key. (POST /admin/groups.json) |
| `groups.delete` | `discourse.api.groups.delete` | `destructive` | Delete a group. Needs an admin API key. Cannot be undone. |
| `groups.get` | `discourse.api.groups.get` | `read` | Get a group. (GET /groups/{name}.json) |
| `groups.getById` | `discourse.api.groups.getById` | `read` | Get a group by id. (GET /groups/by-id/{id}.json) |
| `groups.list` | `discourse.api.groups.list` | `read` | List groups. (GET /groups.json) |
| `groups.listMembers` | `discourse.api.groups.listMembers` | `read` | List group members. (GET /groups/{name}/members.json) |
| `groups.removeMembers` | `discourse.api.groups.removeMembers` | `destructive` | Remove group members. Cannot be undone. (DELETE /groups/{id}/members.json) |
| `groups.update` | `discourse.api.groups.update` | `write` | Update a group. (PUT /groups/{id}.json) |
| `invites.create` | `discourse.api.invites.create` | `destructive` | Create an invite. (POST /invites.json) |
| `invites.createMultiple` | `discourse.api.invites.createMultiple` | `destructive` | Create multiple invites. (POST /invites/create-multiple.json) |
| `notifications.list` | `discourse.api.notifications.list` | `read` | Get the notifications that belong to the current user. |
| `notifications.markRead` | `discourse.api.notifications.markRead` | `write` | Mark notifications as read. (PUT /notifications/mark-read.json) |
| `posts.create` | `discourse.api.posts.create` | `destructive` | Creates a new topic, a new post, or a private message. Creates a topic (title + raw), a reply (topic_id + raw) or a private message (archetype private_message + target_recipients); it is public on the forum and notifies watchers. |
| `posts.delete` | `discourse.api.posts.delete` | `destructive` | delete a single post. Cannot be undone. (DELETE /posts/{id}.json) |
| `posts.get` | `discourse.api.posts.get` | `read` | Retrieve a single post. This endpoint can be used to get the number of likes on a post using the actions_summary property in the response. actions_summary responses with the id of 2 signify a like. If there are no actions_summary items with the id of 2, that means there are 0 likes. |
| `posts.list` | `discourse.api.posts.list` | `read` | List latest posts across topics. (GET /posts.json) |
| `posts.listReplies` | `discourse.api.posts.listReplies` | `read` | List replies to a post. (GET /posts/{id}/replies.json) |
| `posts.lock` | `discourse.api.posts.lock` | `write` | Lock a post from being edited. (PUT /posts/{id}/locked.json) |
| `posts.performAction` | `discourse.api.posts.performAction` | `destructive` | Like a post and other actions. (POST /post_actions.json) |
| `posts.update` | `discourse.api.posts.update` | `write` | Update a single post. (PUT /posts/{id}.json) |
| `privateMessages.list` | `discourse.api.privateMessages.list` | `read` | Get a list of private messages for a user. |
| `privateMessages.listSent` | `discourse.api.privateMessages.listSent` | `read` | Get a list of private messages sent for a user. |
| `search.query` | `discourse.api.search.query` | `read` | Search for a term. (GET /search.json) |
| `site.get` | `discourse.api.site.get` | `read` | Get site info. Can be used to fetch all categories and subcategories. |
| `site.getBasicInfo` | `discourse.api.site.getBasicInfo` | `read` | Get site basic info. Can be used to fetch basic info about a site. |
| `tags.createGroup` | `discourse.api.tags.createGroup` | `write` | Creates a tag group. (POST /tag_groups.json) |
| `tags.get` | `discourse.api.tags.get` | `read` | Get a specific tag. (GET /tag/{name}.json) |
| `tags.getGroup` | `discourse.api.tags.getGroup` | `read` | Get a single tag group. (GET /tag_groups/{id}.json) |
| `tags.list` | `discourse.api.tags.list` | `read` | Get a list of tags. (GET /tags.json) |
| `tags.listGroups` | `discourse.api.tags.listGroups` | `read` | Get a list of tag groups. (GET /tag_groups.json) |
| `tags.updateGroup` | `discourse.api.tags.updateGroup` | `write` | Update tag group. (PUT /tag_groups/{id}.json) |
| `topics.bookmark` | `discourse.api.topics.bookmark` | `write` | Bookmark topic. (PUT /t/{id}/bookmark.json) |
| `topics.createTimer` | `discourse.api.topics.createTimer` | `write` | Create topic timer. (POST /t/{id}/timer.json) |
| `topics.delete` | `discourse.api.topics.delete` | `destructive` | Remove a topic. Cannot be undone. (DELETE /t/{id}.json) |
| `topics.get` | `discourse.api.topics.get` | `read` | Get a single topic. (GET /t/{id}.json) |
| `topics.getByExternalId` | `discourse.api.topics.getByExternalId` | `read` | Get topic by external_id. Discourse answers with a redirect to the topic on the forum's configured hostname, which the client follows. |
| `topics.getPosts` | `discourse.api.topics.getPosts` | `read` | Get specific posts from a topic. (GET /t/{id}/posts.json) |
| `topics.invite` | `discourse.api.topics.invite` | `destructive` | Invite to topic. (POST /t/{id}/invite.json) |
| `topics.inviteGroup` | `discourse.api.topics.inviteGroup` | `destructive` | Invite group to topic. (POST /t/{id}/invite-group.json) |
| `topics.listLatest` | `discourse.api.topics.listLatest` | `read` | Get the latest topics. (GET /latest.json) |
| `topics.listTop` | `discourse.api.topics.listTop` | `read` | Get the top topics filtered by period. (GET /top.json) |
| `topics.setNotificationLevel` | `discourse.api.topics.setNotificationLevel` | `write` | Set notification level. (POST /t/{id}/notifications.json) |
| `topics.update` | `discourse.api.topics.update` | `write` | Update a topic. (PUT /t/-/{id}.json) |
| `topics.updateStatus` | `discourse.api.topics.updateStatus` | `write` | Update the status of a topic. (PUT /t/{id}/status.json) |
| `topics.updateTimestamp` | `discourse.api.topics.updateTimestamp` | `write` | Update topic timestamp. (PUT /t/{id}/change-timestamp.json) |
| `uploads.abortMultipart` | `discourse.api.uploads.abortMultipart` | `write` | Abort multipart upload. This endpoint aborts the multipart upload initiated with /create-multipart. This should be used when cancelling the upload. It does not matter if parts were already uploaded into the external storage provider. Needs uploads stored on S3 (enable_direct_s3_uploads). |
| `uploads.batchPresignMultipartParts` | `discourse.api.uploads.batchPresignMultipartParts` | `read` | Generates batches of presigned URLs for multipart parts. Multipart uploads are uploaded in chunks or parts to individual presigned URLs, similar to the one generated by /generate-presigned-put. The part numbers provided must be between 1 and 10000, and a request can have at most 100 part numbers. Needs uploads stored on S3 (enable_direct_s3_uploads). |
| `uploads.completeExternal` | `discourse.api.uploads.completeExternal` | `write` | Completes a direct external upload. Completes an external upload initialized with /get-presigned-put. The file will be moved from its temporary location in external storage to a final destination in the S3 bucket. An Upload record will also be created in the database in most cases. Needs uploads stored on S3 (enable_direct_s3_uploads). |
| `uploads.completeMultipart` | `discourse.api.uploads.completeMultipart` | `write` | Complete multipart upload. Completes the multipart upload in the external store, and copies the file from its temporary location to its final location in the store. All of the parts must have been uploaded to the external storage provider. Needs uploads stored on S3 (enable_direct_s3_uploads). |
| `uploads.create` | `discourse.api.uploads.create` | `write` | Creates an upload. (POST /uploads.json) |
| `uploads.createMultipart` | `discourse.api.uploads.createMultipart` | `write` | Creates a multipart external upload. Creates a multipart upload in the external storage provider, storing a temporary reference to the external upload similar to /get-presigned-put. You must have the correct permissions and CORS settings configured in your external provider. We support AWS S3 as the default. Needs uploads stored on S3 (enable_direct_s3_uploads). |
| `uploads.generatePresignedPut` | `discourse.api.uploads.generatePresignedPut` | `read` | Initiates a direct external upload. Direct external uploads bypass the usual method of creating uploads via the POST /uploads route, and upload directly to an external provider, which by default is S3. Needs uploads stored on S3 (enable_direct_s3_uploads): a local-storage forum answers 400 or 404. |
| `users.activate` | `discourse.api.users.activate` | `write` | Activate a user. Needs an admin API key. |
| `users.adminGet` | `discourse.api.users.adminGet` | `read` | Get a user by id. Needs an admin API key. |
| `users.adminList` | `discourse.api.users.adminList` | `read` | List users. Needs an admin API key. (GET /admin/users.json) |
| `users.adminListByFlag` | `discourse.api.users.adminListByFlag` | `read` | List users by flag. Needs an admin API key. |
| `users.anonymize` | `discourse.api.users.anonymize` | `destructive` | Anonymize a user. Replaces the user's name, email and profile for good. Needs an admin API key. |
| `users.changePassword` | `discourse.api.users.changePassword` | `destructive` | Change password. (PUT /users/password-reset/{token}.json) |
| `users.create` | `discourse.api.users.create` | `write` | Creates a user. A forum with hide_email_address_taken on answers success without a user_id (and creates nothing) when the email is taken; with normalize_emails, plus addresses of one inbox count as the same email. |
| `users.deactivate` | `discourse.api.users.deactivate` | `destructive` | Deactivate a user. Needs an admin API key. |
| `users.delete` | `discourse.api.users.delete` | `destructive` | Delete a user. Needs an admin API key. Cannot be undone. |
| `users.get` | `discourse.api.users.get` | `read` | Get a single user by username. (GET /u/{username}.json) |
| `users.getByExternalId` | `discourse.api.users.getByExternalId` | `read` | Get a user by external_id. (GET /u/by-external/{external_id}.json) |
| `users.getByProviderExternalId` | `discourse.api.users.getByProviderExternalId` | `read` | Get a user by identity provider external ID. |
| `users.getEmails` | `discourse.api.users.getEmails` | `read` | Get email addresses belonging to a user. |
| `users.listActions` | `discourse.api.users.listActions` | `read` | Get a list of user actions. (GET /user_actions.json) |
| `users.listDirectory` | `discourse.api.users.listDirectory` | `read` | Get a public list of users. (GET /directory_items.json) |
| `users.logOut` | `discourse.api.users.logOut` | `destructive` | Log a user out. Needs an admin API key. (POST /admin/users/{id}/log_out.json) |
| `users.merge` | `discourse.api.users.merge` | `destructive` | Merge a user. Merge a user into another user. Requires admin permissions. The source user cannot be a staff member. The merge runs in the background and deletes the source user when complete. Moves everything the user posted to another user and deletes the first one. Needs an admin API key. |
| `users.refreshGravatar` | `discourse.api.users.refreshGravatar` | `write` | Refresh gravatar. (POST /user_avatar/{username}/refresh_gravatar.json) |
| `users.sendPasswordResetEmail` | `discourse.api.users.sendPasswordResetEmail` | `destructive` | Send password reset email. (POST /session/forgot_password.json) |
| `users.silence` | `discourse.api.users.silence` | `destructive` | Silence a user. Needs an admin API key. (PUT /admin/users/{id}/silence.json) |
| `users.suspend` | `discourse.api.users.suspend` | `destructive` | Suspend a user. Needs an admin API key. (PUT /admin/users/{id}/suspend.json) |
| `users.update` | `discourse.api.users.update` | `write` | Update a user. (PUT /u/{username}.json) |
| `users.updateAvatar` | `discourse.api.users.updateAvatar` | `write` | Update avatar. (PUT /u/{username}/preferences/avatar/pick.json) |
| `users.updateEmail` | `discourse.api.users.updateEmail` | `destructive` | Update email. (PUT /u/{username}/preferences/email.json) |
| `users.updateUsername` | `discourse.api.users.updateUsername` | `destructive` | Update username. (PUT /u/{username}/preferences/username.json) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 37 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/discourse

## License

Apache-2.0
