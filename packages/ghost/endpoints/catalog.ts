// Generated with endpoints/operation-types.ts from Ghost's OpenAPI spec:
// one entry per operation in ghost-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { ghostSchemaEntry } from './openapi-schema';
import { createGhostOperation as op } from './operations';

export const ghostEndpointsNested = {
	content: {
		authors: {
			get: op('content.authors.get'),
			getBySlug: op('content.authors.getBySlug'),
			list: op('content.authors.list'),
		},
		pages: {
			get: op('content.pages.get'),
			getBySlug: op('content.pages.getBySlug'),
			list: op('content.pages.list'),
		},
		posts: {
			get: op('content.posts.get'),
			getBySlug: op('content.posts.getBySlug'),
			list: op('content.posts.list'),
		},
		settings: {
			get: op('content.settings.get'),
		},
		tags: {
			get: op('content.tags.get'),
			getBySlug: op('content.tags.getBySlug'),
			list: op('content.tags.list'),
		},
		tiers: {
			list: op('content.tiers.list'),
		},
	},
	files: {
		upload: op('files.upload'),
	},
	images: {
		upload: op('images.upload'),
	},
	invites: {
		create: op('invites.create'),
		delete: op('invites.delete'),
		list: op('invites.list'),
	},
	labels: {
		create: op('labels.create'),
		delete: op('labels.delete'),
		get: op('labels.get'),
		getBySlug: op('labels.getBySlug'),
		list: op('labels.list'),
		update: op('labels.update'),
	},
	media: {
		upload: op('media.upload'),
	},
	members: {
		create: op('members.create'),
		customFields: {
			create: op('members.customFields.create'),
			delete: op('members.customFields.delete'),
			get: op('members.customFields.get'),
			list: op('members.customFields.list'),
			reorder: op('members.customFields.reorder'),
			update: op('members.customFields.update'),
		},
		delete: op('members.delete'),
		get: op('members.get'),
		list: op('members.list'),
		update: op('members.update'),
	},
	newsletters: {
		create: op('newsletters.create'),
		get: op('newsletters.get'),
		list: op('newsletters.list'),
		update: op('newsletters.update'),
	},
	offers: {
		create: op('offers.create'),
		get: op('offers.get'),
		list: op('offers.list'),
		update: op('offers.update'),
	},
	pages: {
		copy: op('pages.copy'),
		create: op('pages.create'),
		delete: op('pages.delete'),
		get: op('pages.get'),
		getBySlug: op('pages.getBySlug'),
		list: op('pages.list'),
		update: op('pages.update'),
	},
	posts: {
		copy: op('posts.copy'),
		create: op('posts.create'),
		delete: op('posts.delete'),
		get: op('posts.get'),
		getBySlug: op('posts.getBySlug'),
		list: op('posts.list'),
		update: op('posts.update'),
	},
	roles: {
		list: op('roles.list'),
	},
	site: {
		get: op('site.get'),
	},
	tags: {
		create: op('tags.create'),
		delete: op('tags.delete'),
		get: op('tags.get'),
		getBySlug: op('tags.getBySlug'),
		list: op('tags.list'),
		update: op('tags.update'),
	},
	themes: {
		activate: op('themes.activate'),
		upload: op('themes.upload'),
	},
	tiers: {
		create: op('tiers.create'),
		get: op('tiers.get'),
		list: op('tiers.list'),
		update: op('tiers.update'),
	},
	users: {
		delete: op('users.delete'),
		get: op('users.get'),
		getByEmail: op('users.getByEmail'),
		getBySlug: op('users.getBySlug'),
		list: op('users.list'),
		update: op('users.update'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		update: op('webhooks.update'),
	},
} as const;

export const ghostEndpointSchemas = {
	'content.authors.get': ghostSchemaEntry('content.authors.get'),
	'content.authors.getBySlug': ghostSchemaEntry('content.authors.getBySlug'),
	'content.authors.list': ghostSchemaEntry('content.authors.list'),
	'content.pages.get': ghostSchemaEntry('content.pages.get'),
	'content.pages.getBySlug': ghostSchemaEntry('content.pages.getBySlug'),
	'content.pages.list': ghostSchemaEntry('content.pages.list'),
	'content.posts.get': ghostSchemaEntry('content.posts.get'),
	'content.posts.getBySlug': ghostSchemaEntry('content.posts.getBySlug'),
	'content.posts.list': ghostSchemaEntry('content.posts.list'),
	'content.settings.get': ghostSchemaEntry('content.settings.get'),
	'content.tags.get': ghostSchemaEntry('content.tags.get'),
	'content.tags.getBySlug': ghostSchemaEntry('content.tags.getBySlug'),
	'content.tags.list': ghostSchemaEntry('content.tags.list'),
	'content.tiers.list': ghostSchemaEntry('content.tiers.list'),
	'files.upload': ghostSchemaEntry('files.upload'),
	'images.upload': ghostSchemaEntry('images.upload'),
	'invites.create': ghostSchemaEntry('invites.create'),
	'invites.delete': ghostSchemaEntry('invites.delete'),
	'invites.list': ghostSchemaEntry('invites.list'),
	'labels.create': ghostSchemaEntry('labels.create'),
	'labels.delete': ghostSchemaEntry('labels.delete'),
	'labels.get': ghostSchemaEntry('labels.get'),
	'labels.getBySlug': ghostSchemaEntry('labels.getBySlug'),
	'labels.list': ghostSchemaEntry('labels.list'),
	'labels.update': ghostSchemaEntry('labels.update'),
	'media.upload': ghostSchemaEntry('media.upload'),
	'members.create': ghostSchemaEntry('members.create'),
	'members.customFields.create': ghostSchemaEntry(
		'members.customFields.create',
	),
	'members.customFields.delete': ghostSchemaEntry(
		'members.customFields.delete',
	),
	'members.customFields.get': ghostSchemaEntry('members.customFields.get'),
	'members.customFields.list': ghostSchemaEntry('members.customFields.list'),
	'members.customFields.reorder': ghostSchemaEntry(
		'members.customFields.reorder',
	),
	'members.customFields.update': ghostSchemaEntry(
		'members.customFields.update',
	),
	'members.delete': ghostSchemaEntry('members.delete'),
	'members.get': ghostSchemaEntry('members.get'),
	'members.list': ghostSchemaEntry('members.list'),
	'members.update': ghostSchemaEntry('members.update'),
	'newsletters.create': ghostSchemaEntry('newsletters.create'),
	'newsletters.get': ghostSchemaEntry('newsletters.get'),
	'newsletters.list': ghostSchemaEntry('newsletters.list'),
	'newsletters.update': ghostSchemaEntry('newsletters.update'),
	'offers.create': ghostSchemaEntry('offers.create'),
	'offers.get': ghostSchemaEntry('offers.get'),
	'offers.list': ghostSchemaEntry('offers.list'),
	'offers.update': ghostSchemaEntry('offers.update'),
	'pages.copy': ghostSchemaEntry('pages.copy'),
	'pages.create': ghostSchemaEntry('pages.create'),
	'pages.delete': ghostSchemaEntry('pages.delete'),
	'pages.get': ghostSchemaEntry('pages.get'),
	'pages.getBySlug': ghostSchemaEntry('pages.getBySlug'),
	'pages.list': ghostSchemaEntry('pages.list'),
	'pages.update': ghostSchemaEntry('pages.update'),
	'posts.copy': ghostSchemaEntry('posts.copy'),
	'posts.create': ghostSchemaEntry('posts.create'),
	'posts.delete': ghostSchemaEntry('posts.delete'),
	'posts.get': ghostSchemaEntry('posts.get'),
	'posts.getBySlug': ghostSchemaEntry('posts.getBySlug'),
	'posts.list': ghostSchemaEntry('posts.list'),
	'posts.update': ghostSchemaEntry('posts.update'),
	'roles.list': ghostSchemaEntry('roles.list'),
	'site.get': ghostSchemaEntry('site.get'),
	'tags.create': ghostSchemaEntry('tags.create'),
	'tags.delete': ghostSchemaEntry('tags.delete'),
	'tags.get': ghostSchemaEntry('tags.get'),
	'tags.getBySlug': ghostSchemaEntry('tags.getBySlug'),
	'tags.list': ghostSchemaEntry('tags.list'),
	'tags.update': ghostSchemaEntry('tags.update'),
	'themes.activate': ghostSchemaEntry('themes.activate'),
	'themes.upload': ghostSchemaEntry('themes.upload'),
	'tiers.create': ghostSchemaEntry('tiers.create'),
	'tiers.get': ghostSchemaEntry('tiers.get'),
	'tiers.list': ghostSchemaEntry('tiers.list'),
	'tiers.update': ghostSchemaEntry('tiers.update'),
	'users.delete': ghostSchemaEntry('users.delete'),
	'users.get': ghostSchemaEntry('users.get'),
	'users.getByEmail': ghostSchemaEntry('users.getByEmail'),
	'users.getBySlug': ghostSchemaEntry('users.getBySlug'),
	'users.list': ghostSchemaEntry('users.list'),
	'users.update': ghostSchemaEntry('users.update'),
	'webhooks.create': ghostSchemaEntry('webhooks.create'),
	'webhooks.delete': ghostSchemaEntry('webhooks.delete'),
	'webhooks.update': ghostSchemaEntry('webhooks.update'),
} satisfies RequiredPluginEndpointSchemas<typeof ghostEndpointsNested>;

export const ghostEndpointMeta = {
	'content.authors.get': {
		riskLevel: 'read',
		description:
			'Read a published author by id. Content API. Uses the Content API key.',
	},
	'content.authors.getBySlug': {
		riskLevel: 'read',
		description:
			'Read a published author by slug. Content API. Uses the Content API key.',
	},
	'content.authors.list': {
		riskLevel: 'read',
		description:
			'Browse published authors. Content API: public content only. Uses the Content API key.',
	},
	'content.pages.get': {
		riskLevel: 'read',
		description:
			'Read a published page by id. Content API. Uses the Content API key.',
	},
	'content.pages.getBySlug': {
		riskLevel: 'read',
		description:
			'Read a published page by slug. Content API. Uses the Content API key.',
	},
	'content.pages.list': {
		riskLevel: 'read',
		description:
			'Browse published pages. Content API: public content only. Uses the Content API key.',
	},
	'content.posts.get': {
		riskLevel: 'read',
		description:
			'Read a published post by id. Content API. Uses the Content API key.',
	},
	'content.posts.getBySlug': {
		riskLevel: 'read',
		description:
			'Read a published post by slug. Content API. Uses the Content API key.',
	},
	'content.posts.list': {
		riskLevel: 'read',
		description:
			'Browse published posts. Content API: public content only. Uses the Content API key.',
	},
	'content.settings.get': {
		riskLevel: 'read',
		description:
			'Read public settings. Content API: title, description, logo, navigation and the other public settings. Uses the Content API key.',
	},
	'content.tags.get': {
		riskLevel: 'read',
		description:
			'Read a published tag by id. Content API. Uses the Content API key.',
	},
	'content.tags.getBySlug': {
		riskLevel: 'read',
		description:
			'Read a published tag by slug. Content API. Uses the Content API key.',
	},
	'content.tags.list': {
		riskLevel: 'read',
		description:
			'Browse published tags. Content API: public content only. Uses the Content API key.',
	},
	'content.tiers.list': {
		riskLevel: 'read',
		description:
			'Browse tiers. Content API: the public tiers and their prices. Uses the Content API key.',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a file. Any file for a file card. Returns its URL.',
	},
	'images.upload': {
		riskLevel: 'write',
		description:
			'Upload an image. Returns the image URL to use in posts. JPEG, PNG, GIF, SVG, WebP (icon: also ICO).',
	},
	'invites.create': {
		riskLevel: 'destructive',
		description:
			'Invite a staff user. Emails an invitation to join the site with the given role. Ghost emails the invitation; a site without mail set up answers 500 "Error sending email!".',
	},
	'invites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke a staff invitation. Cannot be undone.',
	},
	'invites.list': {
		riskLevel: 'read',
		description:
			'Browse pending staff invitations. Needs a staff access token: an integration key answers 403 (live 11-28).',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Add a label. (POST /admin/labels/)',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a label. Cannot be undone. (DELETE /admin/labels/{id}/)',
	},
	'labels.get': {
		riskLevel: 'read',
		description: 'Read a label by id. (GET /admin/labels/{id}/)',
	},
	'labels.getBySlug': {
		riskLevel: 'read',
		description: 'Read a label by slug. (GET /admin/labels/slug/{slug}/)',
	},
	'labels.list': {
		riskLevel: 'read',
		description: 'Browse labels. Lists labels, 15 per page by default.',
	},
	'labels.update': {
		riskLevel: 'write',
		description:
			'Edit a label. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'media.upload': {
		riskLevel: 'write',
		description:
			'Upload a video or audio file. MP4, WebM, OGG, MP3, WAV, M4A. Returns the file URL.',
	},
	'members.create': {
		riskLevel: 'destructive',
		description:
			'Add a member. With send_email true, Ghost emails the member a sign-in link.',
	},
	'members.customFields.create': {
		riskLevel: 'write',
		description:
			'Add a member custom field. The key is made from the name and never changes.',
	},
	'members.customFields.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a member custom field. Deletes the field and every member's value for it. Archive the field first (status archived): an active field answers 422. Cannot be undone.",
	},
	'members.customFields.get': {
		riskLevel: 'read',
		description:
			'Read a member custom field. (GET /admin/members/metafields/custom/{key}/)',
	},
	'members.customFields.list': {
		riskLevel: 'read',
		description:
			'Browse member custom fields. Active fields by default; filter status:archived or status:[active,archived].',
	},
	'members.customFields.reorder': {
		riskLevel: 'write',
		description:
			'Reorder member custom fields. Send every active field in the new order.',
	},
	'members.customFields.update': {
		riskLevel: 'write',
		description:
			'Edit a member custom field. Rename it, change its options or access, or archive it (status archived).',
	},
	'members.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a member. Cannot be undone. (DELETE /admin/members/{id}/)',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Read a member by id. (GET /admin/members/{id}/)',
	},
	'members.list': {
		riskLevel: 'read',
		description:
			'Browse members. Lists members, the 15 newest by default. Use filter (status:paid, label:vip, email:...) and search.',
	},
	'members.update': {
		riskLevel: 'write',
		description:
			'Edit a member. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'newsletters.create': {
		riskLevel: 'write',
		description: 'Add a newsletter. (POST /admin/newsletters/)',
	},
	'newsletters.get': {
		riskLevel: 'read',
		description: 'Read a newsletter by id. (GET /admin/newsletters/{id}/)',
	},
	'newsletters.list': {
		riskLevel: 'read',
		description:
			'Browse newsletters. Lists newsletters, 15 per page by default.',
	},
	'newsletters.update': {
		riskLevel: 'write',
		description:
			'Edit a newsletter. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'offers.create': {
		riskLevel: 'write',
		description: 'Add a offer. (POST /admin/offers/)',
	},
	'offers.get': {
		riskLevel: 'read',
		description: 'Read a offer by id. (GET /admin/offers/{id}/)',
	},
	'offers.list': {
		riskLevel: 'read',
		description: 'Browse offers. Lists offers, 15 per page by default.',
	},
	'offers.update': {
		riskLevel: 'write',
		description:
			'Edit a offer. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'pages.copy': {
		riskLevel: 'write',
		description: 'Copy a page. Makes a draft copy of the page.',
	},
	'pages.create': {
		riskLevel: 'write',
		description: 'Add a page. (POST /admin/pages/)',
	},
	'pages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a page. Cannot be undone. (DELETE /admin/pages/{id}/)',
	},
	'pages.get': {
		riskLevel: 'read',
		description: 'Read a page by id. (GET /admin/pages/{id}/)',
	},
	'pages.getBySlug': {
		riskLevel: 'read',
		description: 'Read a page by slug. (GET /admin/pages/slug/{slug}/)',
	},
	'pages.list': {
		riskLevel: 'read',
		description: 'Browse pages. Lists pages, 15 per page by default.',
	},
	'pages.update': {
		riskLevel: 'write',
		description:
			'Edit a page. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'posts.copy': {
		riskLevel: 'write',
		description: 'Copy a post. Makes a draft copy of the post.',
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Add a post. Creating with status published puts the post on the live site; pass source=html to send html instead of lexical.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a post. Cannot be undone. (DELETE /admin/posts/{id}/)',
	},
	'posts.get': {
		riskLevel: 'read',
		description: 'Read a post by id. (GET /admin/posts/{id}/)',
	},
	'posts.getBySlug': {
		riskLevel: 'read',
		description: 'Read a post by slug. (GET /admin/posts/slug/{slug}/)',
	},
	'posts.list': {
		riskLevel: 'read',
		description: 'Browse posts. Lists posts, 15 per page by default.',
	},
	'posts.update': {
		riskLevel: 'destructive',
		description:
			'Edit a post. Send updated_at as read: a stale value answers 409. Publishing with newsletter set emails the post to members. Send updated_at as last read (a stale value answers 409). Setting status published with the newsletter query value emails the post to members, which cannot be undone.',
	},
	'roles.list': {
		riskLevel: 'read',
		description:
			'Browse staff roles. Use permissions=assign to list only the roles this key may give.',
	},
	'site.get': {
		riskLevel: 'read',
		description:
			'Read site details. The site title, description, logo, icon, accent colour, URL and Ghost version. No authentication needed. Works without authentication.',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Add a tag. (POST /admin/tags/)',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a tag. Cannot be undone. (DELETE /admin/tags/{id}/)',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Read a tag by id. (GET /admin/tags/{id}/)',
	},
	'tags.getBySlug': {
		riskLevel: 'read',
		description: 'Read a tag by slug. (GET /admin/tags/slug/{slug}/)',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'Browse tags. Lists tags, 15 per page by default.',
	},
	'tags.update': {
		riskLevel: 'write',
		description:
			'Edit a tag. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'themes.activate': {
		riskLevel: 'destructive',
		description:
			'Activate a theme. Switches the live site to this theme. Switches the live site to this theme.',
	},
	'themes.upload': {
		riskLevel: 'destructive',
		description:
			'Upload a theme. A theme ZIP. A theme with the same name is replaced.',
	},
	'tiers.create': {
		riskLevel: 'write',
		description: 'Add a tier. (POST /admin/tiers/)',
	},
	'tiers.get': {
		riskLevel: 'read',
		description: 'Read a tier by id. (GET /admin/tiers/{id}/)',
	},
	'tiers.list': {
		riskLevel: 'read',
		description: 'Browse tiers. Lists tiers, 15 per page by default.',
	},
	'tiers.update': {
		riskLevel: 'write',
		description:
			'Edit a tier. Send updated_at as read: a stale value answers 409, so two edits never overwrite each other silently.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a staff user. Their posts move to the owner. Needs a staff access token of an Administrator (an integration key answers 403). Needs a staff access token of an Administrator: an integration key answers 403. Cannot be undone.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read a staff user by id. (GET /admin/users/{id}/)',
	},
	'users.getByEmail': {
		riskLevel: 'read',
		description:
			'Read a staff user by email. (GET /admin/users/email/{email}/)',
	},
	'users.getBySlug': {
		riskLevel: 'read',
		description: 'Read a staff user by slug. (GET /admin/users/slug/{slug}/)',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'Browse staff users. (GET /admin/users/)',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			"Edit a staff user. Needs a staff access token or a user session (an integration key answers 403). Needs a staff access token (an Administrator's): an integration key answers 403.",
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Add a webhook. Ghost POSTs the event to target_url, signed with the secret.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook. Cannot be undone. (DELETE /admin/webhooks/{id}/)',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Edit a webhook. (PUT /admin/webhooks/{id}/)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ghostEndpointsNested>;
