// Generated from Ghost's OpenAPI spec (https://docs.ghost.org/admin-api,
// fetched 2026-11-28); ghost-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput } from 'corsair/http';

export type GhostJsonValue =
	| null
	| boolean
	| number
	| string
	| GhostJsonValue[]
	| { [key: string]: GhostJsonValue | undefined };

export const GHOST_OPERATION_IDS = [
	'content.authors.get',
	'content.authors.getBySlug',
	'content.authors.list',
	'content.pages.get',
	'content.pages.getBySlug',
	'content.pages.list',
	'content.posts.get',
	'content.posts.getBySlug',
	'content.posts.list',
	'content.settings.get',
	'content.tags.get',
	'content.tags.getBySlug',
	'content.tags.list',
	'content.tiers.list',
	'files.upload',
	'images.upload',
	'invites.create',
	'invites.delete',
	'invites.list',
	'labels.create',
	'labels.delete',
	'labels.get',
	'labels.getBySlug',
	'labels.list',
	'labels.update',
	'media.upload',
	'members.create',
	'members.customFields.create',
	'members.customFields.delete',
	'members.customFields.get',
	'members.customFields.list',
	'members.customFields.reorder',
	'members.customFields.update',
	'members.delete',
	'members.get',
	'members.list',
	'members.update',
	'newsletters.create',
	'newsletters.get',
	'newsletters.list',
	'newsletters.update',
	'offers.create',
	'offers.get',
	'offers.list',
	'offers.update',
	'pages.copy',
	'pages.create',
	'pages.delete',
	'pages.get',
	'pages.getBySlug',
	'pages.list',
	'pages.update',
	'posts.copy',
	'posts.create',
	'posts.delete',
	'posts.get',
	'posts.getBySlug',
	'posts.list',
	'posts.update',
	'roles.list',
	'site.get',
	'tags.create',
	'tags.delete',
	'tags.get',
	'tags.getBySlug',
	'tags.list',
	'tags.update',
	'themes.activate',
	'themes.upload',
	'tiers.create',
	'tiers.get',
	'tiers.list',
	'tiers.update',
	'users.delete',
	'users.get',
	'users.getByEmail',
	'users.getBySlug',
	'users.list',
	'users.update',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.update',
] as const;

export type GhostOperationId = (typeof GHOST_OPERATION_IDS)[number];

export type GhostAuthorInput = {
	id?: string;
	name?: string;
	slug?: string;
	email?: string;
	profile_image?: string;
	cover_image?: string;
	bio?: string;
	website?: string;
	location?: string;
	facebook?: string;
	twitter?: string;
	accessibility?: string;
	status?: string;
	meta_title?: string;
	meta_description?: string;
	tour?: string;
	last_seen?: string;
	created_at?: string;
	updated_at?: string;
	roles?: Array<Record<string, GhostJsonValue>>;
	url?: string;
	count?: Record<string, GhostJsonValue>;
};

export type GhostLabelInput = {
	id?: string;
	name?: string;
	slug?: string;
	created_at?: string;
	updated_at?: string;
};

export type GhostNewsletterInput = {
	id?: string;
	uuid?: string;
	name?: string;
	slug?: string;
	description?: string;
	sender_name?: string;
	sender_email?: string;
	sender_reply_to?: string;
	status?: 'active' | 'archived';
	visibility?: string;
	subscribe_on_signup?: boolean;
	sort_order?: number;
	header_image?: string;
	show_header_icon?: boolean;
	show_header_title?: boolean;
	title_font_category?: string;
	title_alignment?: string;
	show_feature_image?: boolean;
	body_font_category?: string;
	footer_content?: string;
	show_badge?: boolean;
	show_header_name?: boolean;
	created_at?: string;
	updated_at?: string;
	count?: Record<string, GhostJsonValue>;
};

export type GhostTagInput = {
	id?: string;
	name?: string;
	slug?: string;
	description?: string;
	feature_image?: string;
	visibility?: 'public' | 'internal';
	og_image?: string;
	og_title?: string;
	og_description?: string;
	twitter_image?: string;
	twitter_title?: string;
	twitter_description?: string;
	meta_title?: string;
	meta_description?: string;
	codeinjection_head?: string;
	codeinjection_foot?: string;
	canonical_url?: string;
	accent_color?: string;
	url?: string;
	created_at?: string;
	updated_at?: string;
	count?: Record<string, GhostJsonValue>;
};

export type GhostAuthor = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	email?: string | null;
	profile_image?: string | null;
	cover_image?: string | null;
	bio?: string | null;
	website?: string | null;
	location?: string | null;
	facebook?: string | null;
	twitter?: string | null;
	accessibility?: string | null;
	status?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	tour?: string | null;
	last_seen?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	roles?: Array<Record<string, GhostJsonValue>> | null;
	url?: string | null;
	count?: Record<string, GhostJsonValue> | null;
};

export type GhostCustomField = {
	namespace?: string | null;
	key?: string | null;
	name?: string | null;
	type?: string | null;
	settings?: Record<string, GhostJsonValue> | null;
	status?: string | null;
	access?: Record<string, GhostJsonValue> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostImage = {
	url?: string | null;
	ref?: string | null;
};

export type GhostInvite = {
	id?: string | null;
	role_id?: string | null;
	status?: string | null;
	email?: string | null;
	expires?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostLabel = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostMember = {
	id?: string | null;
	uuid?: string | null;
	email?: string | null;
	name?: string | null;
	note?: string | null;
	geolocation?: string | null;
	subscribed?: boolean | null;
	status?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	labels?: Array<GhostLabel | string> | null;
	subscriptions?: Array<Record<string, GhostJsonValue>> | null;
	avatar_image?: string | null;
	email_count?: number | null;
	email_opened_count?: number | null;
	email_open_rate?: number | null;
	last_seen_at?: string | null;
	comped?: boolean | null;
	unsubscribe_url?: string | null;
	can_comment?: boolean | null;
	commenting?: Record<string, GhostJsonValue> | null;
	email_suppression?: Record<string, GhostJsonValue> | null;
	newsletters?: Array<GhostNewsletter | Record<string, GhostJsonValue>> | null;
	tiers?: Array<Record<string, GhostJsonValue>> | null;
	metafields?: Record<string, GhostJsonValue> | null;
};

export type GhostMeta = {
	pagination?: GhostPagination | null;
};

export type GhostNewsletter = {
	id?: string | null;
	uuid?: string | null;
	name?: string | null;
	slug?: string | null;
	description?: string | null;
	sender_name?: string | null;
	sender_email?: string | null;
	sender_reply_to?: string | null;
	status?: string | null;
	visibility?: string | null;
	subscribe_on_signup?: boolean | null;
	sort_order?: number | null;
	header_image?: string | null;
	show_header_icon?: boolean | null;
	show_header_title?: boolean | null;
	title_font_category?: string | null;
	title_alignment?: string | null;
	show_feature_image?: boolean | null;
	body_font_category?: string | null;
	footer_content?: string | null;
	show_badge?: boolean | null;
	show_header_name?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	count?: Record<string, GhostJsonValue> | null;
};

export type GhostOffer = {
	id?: string | null;
	name?: string | null;
	code?: string | null;
	display_title?: string | null;
	display_description?: string | null;
	type?: string | null;
	cadence?: string | null;
	amount?: number | null;
	duration?: string | null;
	duration_in_months?: number | null;
	currency_restriction?: boolean | null;
	currency?: string | null;
	status?: string | null;
	redemption_count?: number | null;
	tier?: Record<string, GhostJsonValue> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostPagination = {
	page?: number | null;
	limit?: (number | string) | null;
	pages?: number | null;
	total?: number | null;
	next?: number | null;
	prev?: number | null;
};

export type GhostPost = {
	id?: string | null;
	uuid?: string | null;
	title?: string | null;
	slug?: string | null;
	lexical?: string | null;
	html?: string | null;
	mobiledoc?: string | null;
	comment_id?: string | null;
	feature_image?: string | null;
	feature_image_alt?: string | null;
	feature_image_caption?: string | null;
	featured?: boolean | null;
	status?: string | null;
	visibility?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	published_at?: string | null;
	custom_excerpt?: string | null;
	codeinjection_head?: string | null;
	codeinjection_foot?: string | null;
	custom_template?: string | null;
	canonical_url?: string | null;
	tags?: Array<GhostTag | string> | null;
	authors?: Array<GhostAuthor | string> | null;
	primary_author?: GhostAuthor | null;
	primary_tag?: GhostTag | null;
	tiers?: Array<Record<string, GhostJsonValue>> | null;
	url?: string | null;
	excerpt?: string | null;
	reading_time?: number | null;
	og_image?: string | null;
	og_title?: string | null;
	og_description?: string | null;
	twitter_image?: string | null;
	twitter_title?: string | null;
	twitter_description?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	email_subject?: string | null;
	email_only?: boolean | null;
	newsletter?: Record<string, GhostJsonValue> | null;
	email?: Record<string, GhostJsonValue> | null;
	email_segment?: string | null;
	frontmatter?: string | null;
	plaintext?: string | null;
};

export type GhostRole = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostSettings = {
	title?: string | null;
	description?: string | null;
	logo?: string | null;
	icon?: string | null;
	accent_color?: string | null;
	cover_image?: string | null;
	facebook?: string | null;
	twitter?: string | null;
	lang?: string | null;
	locale?: string | null;
	timezone?: string | null;
	codeinjection_head?: string | null;
	codeinjection_foot?: string | null;
	navigation?: Array<Record<string, GhostJsonValue>> | null;
	secondary_navigation?: Array<Record<string, GhostJsonValue>> | null;
	meta_title?: string | null;
	meta_description?: string | null;
	og_image?: string | null;
	og_title?: string | null;
	og_description?: string | null;
	twitter_image?: string | null;
	twitter_title?: string | null;
	twitter_description?: string | null;
	members_support_address?: string | null;
	url?: string | null;
};

export type GhostSite = {
	title?: string | null;
	description?: string | null;
	logo?: string | null;
	icon?: string | null;
	accent_color?: string | null;
	locale?: string | null;
	url?: string | null;
	version?: string | null;
};

export type GhostTag = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	description?: string | null;
	feature_image?: string | null;
	visibility?: string | null;
	og_image?: string | null;
	og_title?: string | null;
	og_description?: string | null;
	twitter_image?: string | null;
	twitter_title?: string | null;
	twitter_description?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	codeinjection_head?: string | null;
	codeinjection_foot?: string | null;
	canonical_url?: string | null;
	accent_color?: string | null;
	url?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	count?: Record<string, GhostJsonValue> | null;
};

export type GhostTheme = {
	name?: string | null;
	package?: Record<string, GhostJsonValue> | null;
	active?: boolean | null;
	templates?: Array<Record<string, GhostJsonValue>> | null;
	warnings?: Array<Record<string, GhostJsonValue>> | null;
	errors?: Array<Record<string, GhostJsonValue>> | null;
};

export type GhostTier = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	description?: string | null;
	active?: boolean | null;
	type?: string | null;
	welcome_page_url?: string | null;
	visibility?: string | null;
	monthly_price?: number | null;
	yearly_price?: number | null;
	currency?: string | null;
	trial_days?: number | null;
	benefits?: Array<string> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostUser = {
	id?: string | null;
	name?: string | null;
	slug?: string | null;
	email?: string | null;
	profile_image?: string | null;
	cover_image?: string | null;
	bio?: string | null;
	website?: string | null;
	location?: string | null;
	facebook?: string | null;
	twitter?: string | null;
	accessibility?: string | null;
	status?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	tour?: string | null;
	last_seen?: string | null;
	comment_notifications?: boolean | null;
	free_member_signup_notification?: boolean | null;
	paid_subscription_started_notification?: boolean | null;
	paid_subscription_canceled_notification?: boolean | null;
	mention_notifications?: boolean | null;
	milestone_notifications?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	roles?: Array<Record<string, GhostJsonValue>> | null;
	count?: Record<string, GhostJsonValue> | null;
	url?: string | null;
};

export type GhostWebhook = {
	id?: string | null;
	event?: string | null;
	target_url?: string | null;
	name?: string | null;
	secret?: string | null;
	api_version?: string | null;
	integration_id?: string | null;
	status?: string | null;
	last_triggered_at?: string | null;
	last_triggered_status?: string | null;
	last_triggered_error?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type GhostOperationInputs = {
	'content.authors.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'content.authors.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'content.authors.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'content.pages.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'content.pages.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'content.pages.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'content.posts.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'content.posts.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'content.posts.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'content.settings.get': Record<string, never>;
	'content.tags.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'content.tags.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'content.tags.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'content.tiers.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'files.upload': {
		/** The file. */
		file: FileInput;
		ref?: string;
	};
	'images.upload': {
		/** The file. */
		file: FileInput;
		/** Changes the checks Ghost runs (image by default). */
		purpose?: 'image' | 'profile_image' | 'icon';
		/** Returned as-is: the original path, to replace it in your content. */
		ref?: string;
	};
	'invites.create': {
		role_id: string;
		status?: string;
		email: string;
		expires?: number;
		updated_at?: string;
	};
	'invites.delete': {
		id: string;
	};
	'invites.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'labels.create': {
		name: string;
		slug?: string;
		updated_at?: string;
	};
	'labels.delete': {
		id: string;
	};
	'labels.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'labels.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'labels.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'labels.update': {
		id: string;
		name?: string;
		slug?: string;
		updated_at?: string;
	};
	'media.upload': {
		/** The file. */
		file: FileInput;
		ref?: string;
	};
	'members.create': {
		/** true: email the member a sign-in link. */
		send_email?: boolean;
		/** Which email send_email sends. */
		email_type?: 'signin' | 'signup' | 'subscribe';
		email: string;
		name?: string;
		note?: string;
		subscribed?: boolean;
		status?: 'free' | 'paid' | 'comped' | 'gift';
		updated_at?: string;
		labels?: Array<GhostLabelInput | string>;
		comped?: boolean;
		commenting?: Record<string, GhostJsonValue>;
		newsletters?: Array<GhostNewsletterInput | Record<string, GhostJsonValue>>;
		tiers?: Array<Record<string, GhostJsonValue>>;
		metafields?: Record<string, GhostJsonValue>;
	};
	'members.customFields.create': {
		namespace?: string;
		key?: string;
		name: string;
		type: 'short_text' | 'long_text' | 'list' | 'address' | 'phone';
		settings?: Record<string, GhostJsonValue>;
		status?: 'active' | 'archived';
		access?: Record<string, GhostJsonValue>;
		updated_at?: string;
	};
	'members.customFields.delete': {
		key: string;
	};
	'members.customFields.get': {
		key: string;
	};
	'members.customFields.list': {
		/** status:archived or status:[active,archived]. */
		filter?: string;
	};
	'members.customFields.reorder': {
		members_metafields: Array<{
			key: string;
		}>;
	};
	'members.customFields.update': {
		key: string;
		namespace?: string;
		name?: string;
		type?: 'short_text' | 'long_text' | 'list' | 'address' | 'phone';
		settings?: Record<string, GhostJsonValue>;
		status?: 'active' | 'archived';
		access?: Record<string, GhostJsonValue>;
		updated_at?: string;
	};
	'members.delete': {
		id: string;
	};
	'members.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'members.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
		/** Members whose name or email contains this text. */
		search?: string;
	};
	'members.update': {
		id: string;
		email?: string;
		name?: string;
		note?: string;
		subscribed?: boolean;
		status?: 'free' | 'paid' | 'comped' | 'gift';
		updated_at?: string;
		labels?: Array<GhostLabelInput | string>;
		comped?: boolean;
		commenting?: Record<string, GhostJsonValue>;
		newsletters?: Array<GhostNewsletterInput | Record<string, GhostJsonValue>>;
		tiers?: Array<Record<string, GhostJsonValue>>;
		metafields?: Record<string, GhostJsonValue>;
	};
	'newsletters.create': {
		/** true: subscribe every member who gets the default newsletter to this one too. */
		opt_in_existing?: boolean;
		name: string;
		slug?: string;
		description?: string;
		sender_name?: string;
		sender_email?: string;
		sender_reply_to?: string;
		status?: 'active' | 'archived';
		visibility?: string;
		subscribe_on_signup?: boolean;
		sort_order?: number;
		header_image?: string;
		show_header_icon?: boolean;
		show_header_title?: boolean;
		title_font_category?: string;
		title_alignment?: string;
		show_feature_image?: boolean;
		body_font_category?: string;
		footer_content?: string;
		show_badge?: boolean;
		show_header_name?: boolean;
		updated_at?: string;
	};
	'newsletters.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'newsletters.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'newsletters.update': {
		id: string;
		name?: string;
		slug?: string;
		description?: string;
		sender_name?: string;
		sender_email?: string;
		sender_reply_to?: string;
		status?: 'active' | 'archived';
		visibility?: string;
		subscribe_on_signup?: boolean;
		sort_order?: number;
		header_image?: string;
		show_header_icon?: boolean;
		show_header_title?: boolean;
		title_font_category?: string;
		title_alignment?: string;
		show_feature_image?: boolean;
		body_font_category?: string;
		footer_content?: string;
		show_badge?: boolean;
		show_header_name?: boolean;
		updated_at?: string;
	};
	'offers.create': {
		name?: string;
		code?: string;
		display_title?: string;
		display_description?: string;
		type?: 'percent' | 'fixed' | 'trial' | 'free_months';
		cadence?: 'month' | 'year';
		amount?: number;
		duration?: 'once' | 'forever' | 'repeating' | 'trial' | 'free_months';
		duration_in_months?: number;
		currency_restriction?: boolean;
		currency?: string;
		status?: 'active' | 'archived';
		tier?: Record<string, GhostJsonValue>;
		updated_at?: string;
	};
	'offers.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'offers.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'offers.update': {
		id: string;
		name?: string;
		code?: string;
		display_title?: string;
		display_description?: string;
		type?: 'percent' | 'fixed' | 'trial' | 'free_months';
		cadence?: 'month' | 'year';
		amount?: number;
		duration?: 'once' | 'forever' | 'repeating' | 'trial' | 'free_months';
		duration_in_months?: number;
		currency_restriction?: boolean;
		currency?: string;
		status?: 'active' | 'archived';
		tier?: Record<string, GhostJsonValue>;
		updated_at?: string;
	};
	'pages.copy': {
		id: string;
	};
	'pages.create': {
		/** html: the body holds html, which Ghost converts to Lexical. */
		source?: 'html';
		title: string;
		slug?: string;
		lexical?: string;
		html?: string;
		mobiledoc?: string;
		feature_image?: string;
		feature_image_alt?: string;
		feature_image_caption?: string;
		featured?: boolean;
		status?: 'draft' | 'published' | 'scheduled' | 'sent';
		visibility?: string;
		updated_at?: string;
		published_at?: string;
		custom_excerpt?: string;
		codeinjection_head?: string;
		codeinjection_foot?: string;
		custom_template?: string;
		canonical_url?: string;
		tags?: Array<GhostTagInput | string>;
		authors?: Array<GhostAuthorInput | string>;
		tiers?: Array<Record<string, GhostJsonValue>>;
		og_image?: string;
		og_title?: string;
		og_description?: string;
		twitter_image?: string;
		twitter_title?: string;
		twitter_description?: string;
		meta_title?: string;
		meta_description?: string;
		email_subject?: string;
		email_only?: boolean;
		frontmatter?: string;
	};
	'pages.delete': {
		id: string;
	};
	'pages.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'pages.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'pages.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'pages.update': {
		id: string;
		/** html: the body holds html, which Ghost converts to Lexical. */
		source?: 'html';
		title?: string;
		slug?: string;
		lexical?: string;
		html?: string;
		mobiledoc?: string;
		feature_image?: string;
		feature_image_alt?: string;
		feature_image_caption?: string;
		featured?: boolean;
		status?: 'draft' | 'published' | 'scheduled' | 'sent';
		visibility?: string;
		updated_at?: string;
		published_at?: string;
		custom_excerpt?: string;
		codeinjection_head?: string;
		codeinjection_foot?: string;
		custom_template?: string;
		canonical_url?: string;
		tags?: Array<GhostTagInput | string>;
		authors?: Array<GhostAuthorInput | string>;
		tiers?: Array<Record<string, GhostJsonValue>>;
		og_image?: string;
		og_title?: string;
		og_description?: string;
		twitter_image?: string;
		twitter_title?: string;
		twitter_description?: string;
		meta_title?: string;
		meta_description?: string;
		email_subject?: string;
		email_only?: boolean;
		frontmatter?: string;
	};
	'posts.copy': {
		id: string;
	};
	'posts.create': {
		/** html: the body holds html, which Ghost converts to Lexical. */
		source?: 'html';
		title: string;
		slug?: string;
		lexical?: string;
		html?: string;
		mobiledoc?: string;
		feature_image?: string;
		feature_image_alt?: string;
		feature_image_caption?: string;
		featured?: boolean;
		status?: 'draft' | 'published' | 'scheduled' | 'sent';
		visibility?: string;
		updated_at?: string;
		published_at?: string;
		custom_excerpt?: string;
		codeinjection_head?: string;
		codeinjection_foot?: string;
		custom_template?: string;
		canonical_url?: string;
		tags?: Array<GhostTagInput | string>;
		authors?: Array<GhostAuthorInput | string>;
		tiers?: Array<Record<string, GhostJsonValue>>;
		og_image?: string;
		og_title?: string;
		og_description?: string;
		twitter_image?: string;
		twitter_title?: string;
		twitter_description?: string;
		meta_title?: string;
		meta_description?: string;
		email_subject?: string;
		email_only?: boolean;
		frontmatter?: string;
	};
	'posts.delete': {
		id: string;
	};
	'posts.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'posts.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'posts.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
		/** Content formats to return, comma-separated: lexical (default), html, mobiledoc, plaintext. */
		formats?: string;
	};
	'posts.update': {
		id: string;
		/** html: the body holds html, which Ghost converts to Lexical. */
		source?: 'html';
		/** Slug of the newsletter to email the post to when this edit publishes it. */
		newsletter?: string;
		/** Which members get the email: all (default), status:free, status:-free, or an NQL filter. */
		email_segment?: string;
		title?: string;
		slug?: string;
		lexical?: string;
		html?: string;
		mobiledoc?: string;
		feature_image?: string;
		feature_image_alt?: string;
		feature_image_caption?: string;
		featured?: boolean;
		status?: 'draft' | 'published' | 'scheduled' | 'sent';
		visibility?: string;
		updated_at?: string;
		published_at?: string;
		custom_excerpt?: string;
		codeinjection_head?: string;
		codeinjection_foot?: string;
		custom_template?: string;
		canonical_url?: string;
		tags?: Array<GhostTagInput | string>;
		authors?: Array<GhostAuthorInput | string>;
		tiers?: Array<Record<string, GhostJsonValue>>;
		og_image?: string;
		og_title?: string;
		og_description?: string;
		twitter_image?: string;
		twitter_title?: string;
		twitter_description?: string;
		meta_title?: string;
		meta_description?: string;
		email_subject?: string;
		email_only?: boolean;
		frontmatter?: string;
	};
	'roles.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** assign: only roles the caller may assign. */
		permissions?: 'assign';
		/** Records per page. */
		limit?: number | 'all';
	};
	'site.get': Record<string, never>;
	'tags.create': {
		name: string;
		slug?: string;
		description?: string;
		feature_image?: string;
		visibility?: 'public' | 'internal';
		og_image?: string;
		og_title?: string;
		og_description?: string;
		twitter_image?: string;
		twitter_title?: string;
		twitter_description?: string;
		meta_title?: string;
		meta_description?: string;
		codeinjection_head?: string;
		codeinjection_foot?: string;
		canonical_url?: string;
		accent_color?: string;
		updated_at?: string;
	};
	'tags.delete': {
		id: string;
	};
	'tags.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'tags.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'tags.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'tags.update': {
		id: string;
		name?: string;
		slug?: string;
		description?: string;
		feature_image?: string;
		visibility?: 'public' | 'internal';
		og_image?: string;
		og_title?: string;
		og_description?: string;
		twitter_image?: string;
		twitter_title?: string;
		twitter_description?: string;
		meta_title?: string;
		meta_description?: string;
		codeinjection_head?: string;
		codeinjection_foot?: string;
		canonical_url?: string;
		accent_color?: string;
		updated_at?: string;
	};
	'themes.activate': {
		name: string;
	};
	'themes.upload': {
		/** The file. */
		file: FileInput;
	};
	'tiers.create': {
		name: string;
		slug?: string;
		description?: string;
		active?: boolean;
		type?: 'free' | 'paid';
		welcome_page_url?: string;
		visibility?: string;
		monthly_price?: number;
		yearly_price?: number;
		currency?: string;
		trial_days?: number;
		benefits?: Array<string>;
		updated_at?: string;
	};
	'tiers.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'tiers.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'tiers.update': {
		id: string;
		name?: string;
		slug?: string;
		description?: string;
		active?: boolean;
		type?: 'free' | 'paid';
		welcome_page_url?: string;
		visibility?: string;
		monthly_price?: number;
		yearly_price?: number;
		currency?: string;
		trial_days?: number;
		benefits?: Array<string>;
		updated_at?: string;
	};
	'users.delete': {
		id: string;
	};
	'users.get': {
		id: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'users.getByEmail': {
		email: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'users.getBySlug': {
		slug: string;
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
	};
	'users.list': {
		/** Related data to include, comma-separated (for example tags,authors). */
		include?: string;
		/** Only these fields, comma-separated. */
		fields?: string;
		/** An NQL filter, for example tag:getting-started+featured:true. */
		filter?: string;
		/** Records per page (15 by default), or all. */
		limit?: number | 'all';
		/** Which page of results. */
		page?: number;
		/** Sort order, for example published_at DESC. */
		order?: string;
	};
	'users.update': {
		id: string;
		name?: string;
		slug?: string;
		email?: string;
		profile_image?: string;
		cover_image?: string;
		bio?: string;
		website?: string;
		location?: string;
		facebook?: string;
		twitter?: string;
		accessibility?: string;
		status?: string;
		meta_title?: string;
		meta_description?: string;
		tour?: string;
		comment_notifications?: boolean;
		free_member_signup_notification?: boolean;
		paid_subscription_started_notification?: boolean;
		paid_subscription_canceled_notification?: boolean;
		mention_notifications?: boolean;
		milestone_notifications?: boolean;
		updated_at?: string;
		roles?: Array<Record<string, GhostJsonValue>>;
	};
	'webhooks.create': {
		event: string;
		target_url: string;
		name?: string;
		secret?: string;
		api_version?: string;
		integration_id?: string;
		status?: string;
		last_triggered_at?: string;
		last_triggered_status?: string;
		last_triggered_error?: string;
		updated_at?: string;
	};
	'webhooks.delete': {
		id: string;
	};
	'webhooks.update': {
		id: string;
		event?: string;
		target_url?: string;
		name?: string;
		secret?: string;
		api_version?: string;
		integration_id?: string;
		status?: string;
		last_triggered_at?: string;
		last_triggered_status?: string;
		last_triggered_error?: string;
		updated_at?: string;
	};
};

export type GhostOperationOutputs = {
	'content.authors.get': {
		authors?: Array<GhostAuthor> | null;
		meta?: GhostMeta | null;
	};
	'content.authors.getBySlug': {
		authors?: Array<GhostAuthor> | null;
		meta?: GhostMeta | null;
	};
	'content.authors.list': {
		authors?: Array<GhostAuthor> | null;
		meta?: GhostMeta | null;
	};
	'content.pages.get': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'content.pages.getBySlug': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'content.pages.list': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'content.posts.get': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'content.posts.getBySlug': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'content.posts.list': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'content.settings.get': {
		settings?: GhostSettings | null;
		meta?: Record<string, GhostJsonValue> | null;
	};
	'content.tags.get': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'content.tags.getBySlug': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'content.tags.list': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'content.tiers.list': {
		tiers?: Array<GhostTier> | null;
		meta?: GhostMeta | null;
	};
	'files.upload': {
		files?: Array<{
			url?: string | null;
			ref?: string | null;
		}> | null;
	};
	'images.upload': {
		images?: Array<GhostImage> | null;
	};
	'invites.create': {
		invites?: Array<GhostInvite> | null;
		meta?: GhostMeta | null;
	};
	'invites.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'invites.list': {
		invites?: Array<GhostInvite> | null;
		meta?: GhostMeta | null;
	};
	'labels.create': {
		labels?: Array<GhostLabel> | null;
		meta?: GhostMeta | null;
	};
	'labels.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'labels.get': {
		labels?: Array<GhostLabel> | null;
		meta?: GhostMeta | null;
	};
	'labels.getBySlug': {
		labels?: Array<GhostLabel> | null;
		meta?: GhostMeta | null;
	};
	'labels.list': {
		labels?: Array<GhostLabel> | null;
		meta?: GhostMeta | null;
	};
	'labels.update': {
		labels?: Array<GhostLabel> | null;
		meta?: GhostMeta | null;
	};
	'media.upload': {
		media?: Array<{
			url?: string | null;
			ref?: string | null;
		}> | null;
	};
	'members.create': {
		members?: Array<GhostMember> | null;
		meta?: GhostMeta | null;
	};
	'members.customFields.create': {
		members_metafields?: Array<GhostCustomField> | null;
		meta?: GhostMeta | null;
	};
	'members.customFields.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'members.customFields.get': {
		members_metafields?: Array<GhostCustomField> | null;
		meta?: GhostMeta | null;
	};
	'members.customFields.list': {
		members_metafields?: Array<GhostCustomField> | null;
		meta?: GhostMeta | null;
	};
	'members.customFields.reorder': {
		members_metafields?: Array<GhostCustomField> | null;
		meta?: GhostMeta | null;
	};
	'members.customFields.update': {
		members_metafields?: Array<GhostCustomField> | null;
		meta?: GhostMeta | null;
	};
	'members.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'members.get': {
		members?: Array<GhostMember> | null;
		meta?: GhostMeta | null;
	};
	'members.list': {
		members?: Array<GhostMember> | null;
		meta?: GhostMeta | null;
	};
	'members.update': {
		members?: Array<GhostMember> | null;
		meta?: GhostMeta | null;
	};
	'newsletters.create': {
		newsletters?: Array<GhostNewsletter> | null;
		meta?: GhostMeta | null;
	};
	'newsletters.get': {
		newsletters?: Array<GhostNewsletter> | null;
		meta?: GhostMeta | null;
	};
	'newsletters.list': {
		newsletters?: Array<GhostNewsletter> | null;
		meta?: GhostMeta | null;
	};
	'newsletters.update': {
		newsletters?: Array<GhostNewsletter> | null;
		meta?: GhostMeta | null;
	};
	'offers.create': {
		offers?: Array<GhostOffer> | null;
		meta?: GhostMeta | null;
	};
	'offers.get': {
		offers?: Array<GhostOffer> | null;
		meta?: GhostMeta | null;
	};
	'offers.list': {
		offers?: Array<GhostOffer> | null;
		meta?: GhostMeta | null;
	};
	'offers.update': {
		offers?: Array<GhostOffer> | null;
		meta?: GhostMeta | null;
	};
	'pages.copy': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'pages.create': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'pages.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'pages.get': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'pages.getBySlug': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'pages.list': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'pages.update': {
		pages?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'posts.copy': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'posts.create': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'posts.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'posts.get': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'posts.getBySlug': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'posts.list': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'posts.update': {
		posts?: Array<GhostPost> | null;
		meta?: GhostMeta | null;
	};
	'roles.list': {
		roles?: Array<GhostRole> | null;
		meta?: GhostMeta | null;
	};
	'site.get': {
		site?: GhostSite | null;
	};
	'tags.create': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'tags.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'tags.get': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'tags.getBySlug': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'tags.list': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'tags.update': {
		tags?: Array<GhostTag> | null;
		meta?: GhostMeta | null;
	};
	'themes.activate': {
		themes?: Array<GhostTheme> | null;
	};
	'themes.upload': {
		themes?: Array<GhostTheme> | null;
	};
	'tiers.create': {
		tiers?: Array<GhostTier> | null;
		meta?: GhostMeta | null;
	};
	'tiers.get': {
		tiers?: Array<GhostTier> | null;
		meta?: GhostMeta | null;
	};
	'tiers.list': {
		tiers?: Array<GhostTier> | null;
		meta?: GhostMeta | null;
	};
	'tiers.update': {
		tiers?: Array<GhostTier> | null;
		meta?: GhostMeta | null;
	};
	'users.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'users.get': {
		users?: Array<GhostUser> | null;
		meta?: GhostMeta | null;
	};
	'users.getByEmail': {
		users?: Array<GhostUser> | null;
		meta?: GhostMeta | null;
	};
	'users.getBySlug': {
		users?: Array<GhostUser> | null;
		meta?: GhostMeta | null;
	};
	'users.list': {
		users?: Array<GhostUser> | null;
		meta?: GhostMeta | null;
	};
	'users.update': {
		users?: Array<GhostUser> | null;
		meta?: GhostMeta | null;
	};
	'webhooks.create': {
		webhooks?: Array<GhostWebhook> | null;
		meta?: GhostMeta | null;
	};
	'webhooks.delete': {
		/** Ghost accepted the call; it answered with no body. */
		success: true;
	};
	'webhooks.update': {
		webhooks?: Array<GhostWebhook> | null;
		meta?: GhostMeta | null;
	};
};
