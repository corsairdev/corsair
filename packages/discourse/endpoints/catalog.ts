// Generated with endpoints/operation-types.ts from Discourse's OpenAPI spec:
// one entry per operation in discourse-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { discourseSchemaEntry } from './openapi-schema';
import { createDiscourseOperation as op } from './operations';

export const discourseEndpointsNested = {
	backups: {
		create: op('backups.create'),
		download: op('backups.download'),
		list: op('backups.list'),
		sendDownloadEmail: op('backups.sendDownloadEmail'),
	},
	badges: {
		create: op('badges.create'),
		delete: op('badges.delete'),
		grant: op('badges.grant'),
		list: op('badges.list'),
		listForUser: op('badges.listForUser'),
		update: op('badges.update'),
	},
	categories: {
		create: op('categories.create'),
		get: op('categories.get'),
		list: op('categories.list'),
		listTopics: op('categories.listTopics'),
		update: op('categories.update'),
	},
	events: {
		exportIcs: op('events.exportIcs'),
		list: op('events.list'),
	},
	groups: {
		addMembers: op('groups.addMembers'),
		create: op('groups.create'),
		delete: op('groups.delete'),
		get: op('groups.get'),
		getById: op('groups.getById'),
		list: op('groups.list'),
		listMembers: op('groups.listMembers'),
		removeMembers: op('groups.removeMembers'),
		update: op('groups.update'),
	},
	invites: {
		create: op('invites.create'),
		createMultiple: op('invites.createMultiple'),
	},
	notifications: {
		list: op('notifications.list'),
		markRead: op('notifications.markRead'),
	},
	posts: {
		create: op('posts.create'),
		delete: op('posts.delete'),
		get: op('posts.get'),
		list: op('posts.list'),
		listReplies: op('posts.listReplies'),
		lock: op('posts.lock'),
		performAction: op('posts.performAction'),
		update: op('posts.update'),
	},
	privateMessages: {
		list: op('privateMessages.list'),
		listSent: op('privateMessages.listSent'),
	},
	search: {
		query: op('search.query'),
	},
	site: {
		get: op('site.get'),
		getBasicInfo: op('site.getBasicInfo'),
	},
	tags: {
		createGroup: op('tags.createGroup'),
		get: op('tags.get'),
		getGroup: op('tags.getGroup'),
		list: op('tags.list'),
		listGroups: op('tags.listGroups'),
		updateGroup: op('tags.updateGroup'),
	},
	topics: {
		bookmark: op('topics.bookmark'),
		createTimer: op('topics.createTimer'),
		delete: op('topics.delete'),
		get: op('topics.get'),
		getByExternalId: op('topics.getByExternalId'),
		getPosts: op('topics.getPosts'),
		invite: op('topics.invite'),
		inviteGroup: op('topics.inviteGroup'),
		listLatest: op('topics.listLatest'),
		listTop: op('topics.listTop'),
		setNotificationLevel: op('topics.setNotificationLevel'),
		update: op('topics.update'),
		updateStatus: op('topics.updateStatus'),
		updateTimestamp: op('topics.updateTimestamp'),
	},
	uploads: {
		abortMultipart: op('uploads.abortMultipart'),
		batchPresignMultipartParts: op('uploads.batchPresignMultipartParts'),
		completeExternal: op('uploads.completeExternal'),
		completeMultipart: op('uploads.completeMultipart'),
		create: op('uploads.create'),
		createMultipart: op('uploads.createMultipart'),
		generatePresignedPut: op('uploads.generatePresignedPut'),
	},
	users: {
		activate: op('users.activate'),
		adminGet: op('users.adminGet'),
		adminList: op('users.adminList'),
		adminListByFlag: op('users.adminListByFlag'),
		anonymize: op('users.anonymize'),
		changePassword: op('users.changePassword'),
		create: op('users.create'),
		deactivate: op('users.deactivate'),
		delete: op('users.delete'),
		get: op('users.get'),
		getByExternalId: op('users.getByExternalId'),
		getByProviderExternalId: op('users.getByProviderExternalId'),
		getEmails: op('users.getEmails'),
		listActions: op('users.listActions'),
		listDirectory: op('users.listDirectory'),
		logOut: op('users.logOut'),
		merge: op('users.merge'),
		refreshGravatar: op('users.refreshGravatar'),
		sendPasswordResetEmail: op('users.sendPasswordResetEmail'),
		silence: op('users.silence'),
		suspend: op('users.suspend'),
		update: op('users.update'),
		updateAvatar: op('users.updateAvatar'),
		updateEmail: op('users.updateEmail'),
		updateUsername: op('users.updateUsername'),
	},
} as const;

export const discourseEndpointSchemas = {
	'backups.create': discourseSchemaEntry('backups.create'),
	'backups.download': discourseSchemaEntry('backups.download'),
	'backups.list': discourseSchemaEntry('backups.list'),
	'backups.sendDownloadEmail': discourseSchemaEntry(
		'backups.sendDownloadEmail',
	),
	'badges.create': discourseSchemaEntry('badges.create'),
	'badges.delete': discourseSchemaEntry('badges.delete'),
	'badges.grant': discourseSchemaEntry('badges.grant'),
	'badges.list': discourseSchemaEntry('badges.list'),
	'badges.listForUser': discourseSchemaEntry('badges.listForUser'),
	'badges.update': discourseSchemaEntry('badges.update'),
	'categories.create': discourseSchemaEntry('categories.create'),
	'categories.get': discourseSchemaEntry('categories.get'),
	'categories.list': discourseSchemaEntry('categories.list'),
	'categories.listTopics': discourseSchemaEntry('categories.listTopics'),
	'categories.update': discourseSchemaEntry('categories.update'),
	'events.exportIcs': discourseSchemaEntry('events.exportIcs'),
	'events.list': discourseSchemaEntry('events.list'),
	'groups.addMembers': discourseSchemaEntry('groups.addMembers'),
	'groups.create': discourseSchemaEntry('groups.create'),
	'groups.delete': discourseSchemaEntry('groups.delete'),
	'groups.get': discourseSchemaEntry('groups.get'),
	'groups.getById': discourseSchemaEntry('groups.getById'),
	'groups.list': discourseSchemaEntry('groups.list'),
	'groups.listMembers': discourseSchemaEntry('groups.listMembers'),
	'groups.removeMembers': discourseSchemaEntry('groups.removeMembers'),
	'groups.update': discourseSchemaEntry('groups.update'),
	'invites.create': discourseSchemaEntry('invites.create'),
	'invites.createMultiple': discourseSchemaEntry('invites.createMultiple'),
	'notifications.list': discourseSchemaEntry('notifications.list'),
	'notifications.markRead': discourseSchemaEntry('notifications.markRead'),
	'posts.create': discourseSchemaEntry('posts.create'),
	'posts.delete': discourseSchemaEntry('posts.delete'),
	'posts.get': discourseSchemaEntry('posts.get'),
	'posts.list': discourseSchemaEntry('posts.list'),
	'posts.listReplies': discourseSchemaEntry('posts.listReplies'),
	'posts.lock': discourseSchemaEntry('posts.lock'),
	'posts.performAction': discourseSchemaEntry('posts.performAction'),
	'posts.update': discourseSchemaEntry('posts.update'),
	'privateMessages.list': discourseSchemaEntry('privateMessages.list'),
	'privateMessages.listSent': discourseSchemaEntry('privateMessages.listSent'),
	'search.query': discourseSchemaEntry('search.query'),
	'site.get': discourseSchemaEntry('site.get'),
	'site.getBasicInfo': discourseSchemaEntry('site.getBasicInfo'),
	'tags.createGroup': discourseSchemaEntry('tags.createGroup'),
	'tags.get': discourseSchemaEntry('tags.get'),
	'tags.getGroup': discourseSchemaEntry('tags.getGroup'),
	'tags.list': discourseSchemaEntry('tags.list'),
	'tags.listGroups': discourseSchemaEntry('tags.listGroups'),
	'tags.updateGroup': discourseSchemaEntry('tags.updateGroup'),
	'topics.bookmark': discourseSchemaEntry('topics.bookmark'),
	'topics.createTimer': discourseSchemaEntry('topics.createTimer'),
	'topics.delete': discourseSchemaEntry('topics.delete'),
	'topics.get': discourseSchemaEntry('topics.get'),
	'topics.getByExternalId': discourseSchemaEntry('topics.getByExternalId'),
	'topics.getPosts': discourseSchemaEntry('topics.getPosts'),
	'topics.invite': discourseSchemaEntry('topics.invite'),
	'topics.inviteGroup': discourseSchemaEntry('topics.inviteGroup'),
	'topics.listLatest': discourseSchemaEntry('topics.listLatest'),
	'topics.listTop': discourseSchemaEntry('topics.listTop'),
	'topics.setNotificationLevel': discourseSchemaEntry(
		'topics.setNotificationLevel',
	),
	'topics.update': discourseSchemaEntry('topics.update'),
	'topics.updateStatus': discourseSchemaEntry('topics.updateStatus'),
	'topics.updateTimestamp': discourseSchemaEntry('topics.updateTimestamp'),
	'uploads.abortMultipart': discourseSchemaEntry('uploads.abortMultipart'),
	'uploads.batchPresignMultipartParts': discourseSchemaEntry(
		'uploads.batchPresignMultipartParts',
	),
	'uploads.completeExternal': discourseSchemaEntry('uploads.completeExternal'),
	'uploads.completeMultipart': discourseSchemaEntry(
		'uploads.completeMultipart',
	),
	'uploads.create': discourseSchemaEntry('uploads.create'),
	'uploads.createMultipart': discourseSchemaEntry('uploads.createMultipart'),
	'uploads.generatePresignedPut': discourseSchemaEntry(
		'uploads.generatePresignedPut',
	),
	'users.activate': discourseSchemaEntry('users.activate'),
	'users.adminGet': discourseSchemaEntry('users.adminGet'),
	'users.adminList': discourseSchemaEntry('users.adminList'),
	'users.adminListByFlag': discourseSchemaEntry('users.adminListByFlag'),
	'users.anonymize': discourseSchemaEntry('users.anonymize'),
	'users.changePassword': discourseSchemaEntry('users.changePassword'),
	'users.create': discourseSchemaEntry('users.create'),
	'users.deactivate': discourseSchemaEntry('users.deactivate'),
	'users.delete': discourseSchemaEntry('users.delete'),
	'users.get': discourseSchemaEntry('users.get'),
	'users.getByExternalId': discourseSchemaEntry('users.getByExternalId'),
	'users.getByProviderExternalId': discourseSchemaEntry(
		'users.getByProviderExternalId',
	),
	'users.getEmails': discourseSchemaEntry('users.getEmails'),
	'users.listActions': discourseSchemaEntry('users.listActions'),
	'users.listDirectory': discourseSchemaEntry('users.listDirectory'),
	'users.logOut': discourseSchemaEntry('users.logOut'),
	'users.merge': discourseSchemaEntry('users.merge'),
	'users.refreshGravatar': discourseSchemaEntry('users.refreshGravatar'),
	'users.sendPasswordResetEmail': discourseSchemaEntry(
		'users.sendPasswordResetEmail',
	),
	'users.silence': discourseSchemaEntry('users.silence'),
	'users.suspend': discourseSchemaEntry('users.suspend'),
	'users.update': discourseSchemaEntry('users.update'),
	'users.updateAvatar': discourseSchemaEntry('users.updateAvatar'),
	'users.updateEmail': discourseSchemaEntry('users.updateEmail'),
	'users.updateUsername': discourseSchemaEntry('users.updateUsername'),
} satisfies RequiredPluginEndpointSchemas<typeof discourseEndpointsNested>;

export const discourseEndpointMeta = {
	'backups.create': {
		riskLevel: 'destructive',
		description:
			'Create backup. Needs an admin API key. (POST /admin/backups.json)',
	},
	'backups.download': {
		riskLevel: 'read',
		description:
			'Download backup. The backup file needs the download token from the email backups.sendDownloadEmail sends. Needs an admin API key.',
	},
	'backups.list': {
		riskLevel: 'read',
		description:
			'List backups. Needs an admin API key. (GET /admin/backups.json)',
	},
	'backups.sendDownloadEmail': {
		riskLevel: 'destructive',
		description: 'Send download backup email. Needs an admin API key.',
	},
	'badges.create': {
		riskLevel: 'write',
		description:
			'Create badge. Needs an admin API key. (POST /admin/badges.json)',
	},
	'badges.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete badge. Needs an admin API key. Cannot be undone.',
	},
	'badges.grant': {
		riskLevel: 'destructive',
		description: 'Grant a badge to a user. (POST /user_badges.json)',
	},
	'badges.list': {
		riskLevel: 'read',
		description:
			'List badges. Needs an admin API key. (GET /admin/badges.json)',
	},
	'badges.listForUser': {
		riskLevel: 'read',
		description: 'List badges for a user. (GET /user-badges/{username}.json)',
	},
	'badges.update': {
		riskLevel: 'write',
		description:
			'Update badge. Needs an admin API key. (PUT /admin/badges/{id}.json)',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Creates a category. (POST /categories.json)',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Show category. (GET /c/{id}/show.json)',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'Retrieves a list of categories. (GET /categories.json)',
	},
	'categories.listTopics': {
		riskLevel: 'read',
		description: 'List topics. (GET /c/{slug}/{id}.json)',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Updates a category. (PUT /categories/{id}.json)',
	},
	'events.exportIcs': {
		riskLevel: 'read',
		description:
			'Export calendar events in iCalendar format. Needs the Discourse Calendar (post event) plugin: without it the route answers 404.',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'List calendar events. Needs the Discourse Calendar (post event) plugin: without it the route answers 404.',
	},
	'groups.addMembers': {
		riskLevel: 'write',
		description: 'Add group members. (PUT /groups/{id}/members.json)',
	},
	'groups.create': {
		riskLevel: 'write',
		description:
			'Create a group. Needs an admin API key. (POST /admin/groups.json)',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a group. Needs an admin API key. Cannot be undone.',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Get a group. (GET /groups/{name}.json)',
	},
	'groups.getById': {
		riskLevel: 'read',
		description: 'Get a group by id. (GET /groups/by-id/{id}.json)',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List groups. (GET /groups.json)',
	},
	'groups.listMembers': {
		riskLevel: 'read',
		description: 'List group members. (GET /groups/{name}/members.json)',
	},
	'groups.removeMembers': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove group members. Cannot be undone. (DELETE /groups/{id}/members.json)',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update a group. (PUT /groups/{id}.json)',
	},
	'invites.create': {
		riskLevel: 'destructive',
		description: 'Create an invite. (POST /invites.json)',
	},
	'invites.createMultiple': {
		riskLevel: 'destructive',
		description:
			'Create multiple invites. (POST /invites/create-multiple.json)',
	},
	'notifications.list': {
		riskLevel: 'read',
		description: 'Get the notifications that belong to the current user.',
	},
	'notifications.markRead': {
		riskLevel: 'write',
		description:
			'Mark notifications as read. (PUT /notifications/mark-read.json)',
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new topic, a new post, or a private message. Creates a topic (title + raw), a reply (topic_id + raw) or a private message (archetype private_message + target_recipients); it is public on the forum and notifies watchers.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'delete a single post. Cannot be undone. (DELETE /posts/{id}.json)',
	},
	'posts.get': {
		riskLevel: 'read',
		description:
			'Retrieve a single post. This endpoint can be used to get the number of likes on a post using the actions_summary property in the response. actions_summary responses with the id of 2 signify a like. If there are no actions_summary items with the id of 2, that means there are 0 likes.',
	},
	'posts.list': {
		riskLevel: 'read',
		description: 'List latest posts across topics. (GET /posts.json)',
	},
	'posts.listReplies': {
		riskLevel: 'read',
		description: 'List replies to a post. (GET /posts/{id}/replies.json)',
	},
	'posts.lock': {
		riskLevel: 'write',
		description: 'Lock a post from being edited. (PUT /posts/{id}/locked.json)',
	},
	'posts.performAction': {
		riskLevel: 'destructive',
		description: 'Like a post and other actions. (POST /post_actions.json)',
	},
	'posts.update': {
		riskLevel: 'write',
		description: 'Update a single post. (PUT /posts/{id}.json)',
	},
	'privateMessages.list': {
		riskLevel: 'read',
		description: 'Get a list of private messages for a user.',
	},
	'privateMessages.listSent': {
		riskLevel: 'read',
		description: 'Get a list of private messages sent for a user.',
	},
	'search.query': {
		riskLevel: 'read',
		description: 'Search for a term. (GET /search.json)',
	},
	'site.get': {
		riskLevel: 'read',
		description:
			'Get site info. Can be used to fetch all categories and subcategories.',
	},
	'site.getBasicInfo': {
		riskLevel: 'read',
		description:
			'Get site basic info. Can be used to fetch basic info about a site.',
	},
	'tags.createGroup': {
		riskLevel: 'write',
		description: 'Creates a tag group. (POST /tag_groups.json)',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get a specific tag. (GET /tag/{name}.json)',
	},
	'tags.getGroup': {
		riskLevel: 'read',
		description: 'Get a single tag group. (GET /tag_groups/{id}.json)',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'Get a list of tags. (GET /tags.json)',
	},
	'tags.listGroups': {
		riskLevel: 'read',
		description: 'Get a list of tag groups. (GET /tag_groups.json)',
	},
	'tags.updateGroup': {
		riskLevel: 'write',
		description: 'Update tag group. (PUT /tag_groups/{id}.json)',
	},
	'topics.bookmark': {
		riskLevel: 'write',
		description: 'Bookmark topic. (PUT /t/{id}/bookmark.json)',
	},
	'topics.createTimer': {
		riskLevel: 'write',
		description: 'Create topic timer. (POST /t/{id}/timer.json)',
	},
	'topics.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a topic. Cannot be undone. (DELETE /t/{id}.json)',
	},
	'topics.get': {
		riskLevel: 'read',
		description: 'Get a single topic. (GET /t/{id}.json)',
	},
	'topics.getByExternalId': {
		riskLevel: 'read',
		description:
			"Get topic by external_id. Discourse answers with a redirect to the topic on the forum's configured hostname, which the client follows.",
	},
	'topics.getPosts': {
		riskLevel: 'read',
		description: 'Get specific posts from a topic. (GET /t/{id}/posts.json)',
	},
	'topics.invite': {
		riskLevel: 'destructive',
		description: 'Invite to topic. (POST /t/{id}/invite.json)',
	},
	'topics.inviteGroup': {
		riskLevel: 'destructive',
		description: 'Invite group to topic. (POST /t/{id}/invite-group.json)',
	},
	'topics.listLatest': {
		riskLevel: 'read',
		description: 'Get the latest topics. (GET /latest.json)',
	},
	'topics.listTop': {
		riskLevel: 'read',
		description: 'Get the top topics filtered by period. (GET /top.json)',
	},
	'topics.setNotificationLevel': {
		riskLevel: 'write',
		description: 'Set notification level. (POST /t/{id}/notifications.json)',
	},
	'topics.update': {
		riskLevel: 'write',
		description: 'Update a topic. (PUT /t/-/{id}.json)',
	},
	'topics.updateStatus': {
		riskLevel: 'write',
		description: 'Update the status of a topic. (PUT /t/{id}/status.json)',
	},
	'topics.updateTimestamp': {
		riskLevel: 'write',
		description: 'Update topic timestamp. (PUT /t/{id}/change-timestamp.json)',
	},
	'uploads.abortMultipart': {
		riskLevel: 'write',
		description:
			'Abort multipart upload. This endpoint aborts the multipart upload initiated with /create-multipart. This should be used when cancelling the upload. It does not matter if parts were already uploaded into the external storage provider. Needs uploads stored on S3 (enable_direct_s3_uploads).',
	},
	'uploads.batchPresignMultipartParts': {
		riskLevel: 'read',
		description:
			'Generates batches of presigned URLs for multipart parts. Multipart uploads are uploaded in chunks or parts to individual presigned URLs, similar to the one generated by /generate-presigned-put. The part numbers provided must be between 1 and 10000, and a request can have at most 100 part numbers. Needs uploads stored on S3 (enable_direct_s3_uploads).',
	},
	'uploads.completeExternal': {
		riskLevel: 'write',
		description:
			'Completes a direct external upload. Completes an external upload initialized with /get-presigned-put. The file will be moved from its temporary location in external storage to a final destination in the S3 bucket. An Upload record will also be created in the database in most cases. Needs uploads stored on S3 (enable_direct_s3_uploads).',
	},
	'uploads.completeMultipart': {
		riskLevel: 'write',
		description:
			'Complete multipart upload. Completes the multipart upload in the external store, and copies the file from its temporary location to its final location in the store. All of the parts must have been uploaded to the external storage provider. Needs uploads stored on S3 (enable_direct_s3_uploads).',
	},
	'uploads.create': {
		riskLevel: 'write',
		description: 'Creates an upload. (POST /uploads.json)',
	},
	'uploads.createMultipart': {
		riskLevel: 'write',
		description:
			'Creates a multipart external upload. Creates a multipart upload in the external storage provider, storing a temporary reference to the external upload similar to /get-presigned-put. You must have the correct permissions and CORS settings configured in your external provider. We support AWS S3 as the default. Needs uploads stored on S3 (enable_direct_s3_uploads).',
	},
	'uploads.generatePresignedPut': {
		riskLevel: 'read',
		description:
			'Initiates a direct external upload. Direct external uploads bypass the usual method of creating uploads via the POST /uploads route, and upload directly to an external provider, which by default is S3. Needs uploads stored on S3 (enable_direct_s3_uploads): a local-storage forum answers 400 or 404.',
	},
	'users.activate': {
		riskLevel: 'write',
		description: 'Activate a user. Needs an admin API key.',
	},
	'users.adminGet': {
		riskLevel: 'read',
		description: 'Get a user by id. Needs an admin API key.',
	},
	'users.adminList': {
		riskLevel: 'read',
		description: 'List users. Needs an admin API key. (GET /admin/users.json)',
	},
	'users.adminListByFlag': {
		riskLevel: 'read',
		description: 'List users by flag. Needs an admin API key.',
	},
	'users.anonymize': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Anonymize a user. Replaces the user's name, email and profile for good. Needs an admin API key.",
	},
	'users.changePassword': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Change password. (PUT /users/password-reset/{token}.json)',
	},
	'users.create': {
		riskLevel: 'write',
		description:
			'Creates a user. A forum with hide_email_address_taken on answers success without a user_id (and creates nothing) when the email is taken; with normalize_emails, plus addresses of one inbox count as the same email.',
	},
	'users.deactivate': {
		riskLevel: 'destructive',
		description: 'Deactivate a user. Needs an admin API key.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a user. Needs an admin API key. Cannot be undone.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a single user by username. (GET /u/{username}.json)',
	},
	'users.getByExternalId': {
		riskLevel: 'read',
		description:
			'Get a user by external_id. (GET /u/by-external/{external_id}.json)',
	},
	'users.getByProviderExternalId': {
		riskLevel: 'read',
		description: 'Get a user by identity provider external ID.',
	},
	'users.getEmails': {
		riskLevel: 'read',
		description: 'Get email addresses belonging to a user.',
	},
	'users.listActions': {
		riskLevel: 'read',
		description: 'Get a list of user actions. (GET /user_actions.json)',
	},
	'users.listDirectory': {
		riskLevel: 'read',
		description: 'Get a public list of users. (GET /directory_items.json)',
	},
	'users.logOut': {
		riskLevel: 'destructive',
		description:
			'Log a user out. Needs an admin API key. (POST /admin/users/{id}/log_out.json)',
	},
	'users.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge a user. Merge a user into another user. Requires admin permissions. The source user cannot be a staff member. The merge runs in the background and deletes the source user when complete. Moves everything the user posted to another user and deletes the first one. Needs an admin API key.',
	},
	'users.refreshGravatar': {
		riskLevel: 'write',
		description:
			'Refresh gravatar. (POST /user_avatar/{username}/refresh_gravatar.json)',
	},
	'users.sendPasswordResetEmail': {
		riskLevel: 'destructive',
		description:
			'Send password reset email. (POST /session/forgot_password.json)',
	},
	'users.silence': {
		riskLevel: 'destructive',
		description:
			'Silence a user. Needs an admin API key. (PUT /admin/users/{id}/silence.json)',
	},
	'users.suspend': {
		riskLevel: 'destructive',
		description:
			'Suspend a user. Needs an admin API key. (PUT /admin/users/{id}/suspend.json)',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a user. (PUT /u/{username}.json)',
	},
	'users.updateAvatar': {
		riskLevel: 'write',
		description:
			'Update avatar. (PUT /u/{username}/preferences/avatar/pick.json)',
	},
	'users.updateEmail': {
		riskLevel: 'destructive',
		description: 'Update email. (PUT /u/{username}/preferences/email.json)',
	},
	'users.updateUsername': {
		riskLevel: 'destructive',
		description:
			'Update username. (PUT /u/{username}/preferences/username.json)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof discourseEndpointsNested
>;
