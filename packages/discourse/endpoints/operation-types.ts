// Generated from Discourse's OpenAPI spec (https://docs.discourse.org/openapi.json,
// fetched 2026-11-28); discourse-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type DiscourseJsonValue =
	| null
	| boolean
	| number
	| string
	| DiscourseJsonValue[]
	| { [key: string]: DiscourseJsonValue | undefined };

export const DISCOURSE_OPERATION_IDS = [
	'backups.create',
	'backups.download',
	'backups.list',
	'backups.sendDownloadEmail',
	'badges.create',
	'badges.delete',
	'badges.grant',
	'badges.list',
	'badges.listForUser',
	'badges.update',
	'categories.create',
	'categories.get',
	'categories.list',
	'categories.listTopics',
	'categories.update',
	'events.exportIcs',
	'events.list',
	'groups.addMembers',
	'groups.create',
	'groups.delete',
	'groups.get',
	'groups.getById',
	'groups.list',
	'groups.listMembers',
	'groups.removeMembers',
	'groups.update',
	'invites.create',
	'invites.createMultiple',
	'notifications.list',
	'notifications.markRead',
	'posts.create',
	'posts.delete',
	'posts.get',
	'posts.list',
	'posts.listReplies',
	'posts.lock',
	'posts.performAction',
	'posts.update',
	'privateMessages.list',
	'privateMessages.listSent',
	'search.query',
	'site.get',
	'site.getBasicInfo',
	'tags.createGroup',
	'tags.get',
	'tags.getGroup',
	'tags.list',
	'tags.listGroups',
	'tags.updateGroup',
	'topics.bookmark',
	'topics.createTimer',
	'topics.delete',
	'topics.get',
	'topics.getByExternalId',
	'topics.getPosts',
	'topics.invite',
	'topics.inviteGroup',
	'topics.listLatest',
	'topics.listTop',
	'topics.setNotificationLevel',
	'topics.update',
	'topics.updateStatus',
	'topics.updateTimestamp',
	'uploads.abortMultipart',
	'uploads.batchPresignMultipartParts',
	'uploads.completeExternal',
	'uploads.completeMultipart',
	'uploads.create',
	'uploads.createMultipart',
	'uploads.generatePresignedPut',
	'users.activate',
	'users.adminGet',
	'users.adminList',
	'users.adminListByFlag',
	'users.anonymize',
	'users.changePassword',
	'users.create',
	'users.deactivate',
	'users.delete',
	'users.get',
	'users.getByExternalId',
	'users.getByProviderExternalId',
	'users.getEmails',
	'users.listActions',
	'users.listDirectory',
	'users.logOut',
	'users.merge',
	'users.refreshGravatar',
	'users.sendPasswordResetEmail',
	'users.silence',
	'users.suspend',
	'users.update',
	'users.updateAvatar',
	'users.updateEmail',
	'users.updateUsername',
] as const;

export type DiscourseOperationId = (typeof DISCOURSE_OPERATION_IDS)[number];

export type DiscourseOperationInputs = {
	'backups.create': {
		with_uploads: boolean;
	};
	'backups.download': {
		filename: string | number;
		token: string;
	};
	'backups.list': Record<string, never>;
	'backups.sendDownloadEmail': {
		filename: string | number;
	};
	'badges.create': {
		/** The name for the new badge. */
		name: string;
		/** The ID for the badge type. 1 for Gold, 2 for Silver, 3 for Bronze. */
		badge_type_id: number;
	};
	'badges.delete': {
		id: number;
	};
	'badges.grant': {
		/** The username of the user to grant the badge to. */
		username: string;
		/** The ID of the badge to grant. Either badge_id or badge_name is required. */
		badge_id?: number;
		/** The name of the badge to grant. Either badge_id or badge_name is required. */
		badge_name?: string;
		/** Optional URL of a post or topic associated with the grant. Cannot be used together with post_id. */
		reason?: string;
		/** Optional ID of a visible, non-deleted post associated with the grant. Cannot be used together with reason. */
		post_id?: number;
		/** Suppress the notification for this grant only. Omit or set to false to preserve normal notification behavior, including existing suppression rules. The badge is still granted and grant events still occur. */
		suppress_notification?: boolean;
	};
	'badges.list': Record<string, never>;
	'badges.listForUser': {
		username: string | number;
	};
	'badges.update': {
		id: number;
		/** The name for the new badge. */
		name: string;
		/** The ID for the badge type. 1 for Gold, 2 for Silver, 3 for Bronze. */
		badge_type_id: number;
	};
	'categories.create': {
		name: string;
		color?: string;
		text_color?: string;
		style_type?: string;
		emoji?: string;
		icon?: string;
		parent_category_id?: number;
		allow_badges?: boolean;
		slug?: string;
		topic_featured_links_allowed?: boolean;
		permissions?: {
			everyone?: number;
			staff?: number;
		};
		search_priority?: number;
		form_template_ids?: Array<DiscourseJsonValue>;
		category_localizations?: Array<{
			/** The unique identifier for an existing localization. Must be included otherwise the record will be deleted. */
			id?: number;
			/** The locale for the localization, e.g., 'en', 'zh_CN'. Locale should be in the list of SiteSetting.content_localization_supported_locales. */
			locale: string;
			/** The name of the category in the specified locale. */
			name: string;
			/** The description excerpt of the category in the specified locale. */
			description?: string;
		}>;
	};
	'categories.get': {
		id: number;
	};
	'categories.list': {
		include_subcategories?: true;
	};
	'categories.listTopics': {
		slug: string | number;
		id: number;
	};
	'categories.update': {
		id: number;
		name: string;
		color?: string;
		text_color?: string;
		style_type?: string;
		emoji?: string;
		icon?: string;
		parent_category_id?: number;
		allow_badges?: boolean;
		slug?: string;
		topic_featured_links_allowed?: boolean;
		permissions?: {
			everyone?: number;
			staff?: number;
		};
		search_priority?: number;
		form_template_ids?: Array<DiscourseJsonValue>;
		category_localizations?: Array<{
			/** The unique identifier for an existing localization. Must be included otherwise the record will be deleted. */
			id?: number;
			/** The locale for the localization, e.g., 'en', 'zh_CN'. Locale should be in the list of SiteSetting.content_localization_supported_locales. */
			locale: string;
			/** The name of the category in the specified locale. */
			name: string;
			/** The description excerpt of the category in the specified locale. */
			description?: string;
		}>;
	};
	'events.exportIcs': {
		/** Filter events by category ID */
		category_id?: number;
		/** Include events from subcategories when filtering by category */
		include_subcategories?: boolean;
		/** Filter to events where the specified user (username) has RSVP'd as going */
		attending_user?: string;
		/** Return events starting before this date/time (ISO 8601 format) */
		before?: string;
		/** Return events starting after this date/time (ISO 8601 format) */
		after?: string;
		/** Sort order for events by start date (default: asc) */
		order?: 'asc' | 'desc';
		/** Maximum number of events to return (default: 200) */
		limit?: number;
	};
	'events.list': {
		/** Include detailed event information (creator, invitees, stats, etc.) */
		include_details?: boolean;
		/** Include card fields without detailed event HTML or statistics */
		include_card?: boolean;
		/** Filter events by category ID */
		category_id?: number;
		/** Include events from subcategories when filtering by category */
		include_subcategories?: boolean;
		/** Filter to events associated with a specific post ID */
		post_id?: number;
		/** Filter to events where the specified user (username) has RSVP'd as going */
		attending_user?: string;
		/** Return events starting before this date/time (ISO 8601 format) */
		before?: string;
		/** Return events starting after this date/time (ISO 8601 format) */
		after?: string;
		/** Sort order for events by start date (default: asc) */
		order?: 'asc' | 'desc';
		/** Maximum number of events to return (default: 200) */
		limit?: number;
		/** Filter to events whose topic has every specified tag */
		tags?: Array<string>;
		/** Search event names, descriptions, and locations */
		search?: string;
		/** Filter by event attendance status */
		status?: 'public' | 'private' | 'standalone';
	};
	'groups.addMembers': {
		id: number;
		/** comma separated list */
		usernames?: string;
	};
	'groups.create': {
		group: {
			name: string;
			full_name?: string;
			/** About Group */
			bio_raw?: string;
			/** comma,separated */
			usernames?: string;
			/** comma,separated */
			owner_usernames?: string;
			/** pipe|separated */
			automatic_membership_email_domains?: string;
			visibility_level?: number;
			primary_group?: boolean;
			flair_icon?: string;
			flair_upload_id?: number;
			flair_bg_color?: string;
			public_admission?: boolean;
			public_exit?: boolean;
			default_notification_level?: number;
			muted_category_ids?: Array<number>;
			regular_category_ids?: Array<number>;
			watching_category_ids?: Array<number>;
			tracking_category_ids?: Array<number>;
			watching_first_post_category_ids?: Array<number>;
		};
	};
	'groups.delete': {
		id: number;
	};
	'groups.get': {
		/** Use group name instead of id */
		name: string | number;
	};
	'groups.getById': {
		/** Use group name instead of id */
		id: string | number;
	};
	'groups.list': Record<string, never>;
	'groups.listMembers': {
		/** Use group name instead of id */
		name: string | number;
	};
	'groups.removeMembers': {
		id: number;
		/** comma separated list */
		usernames?: string;
	};
	'groups.update': {
		id: number;
		group: {
			name: string;
			full_name?: string;
			/** About Group */
			bio_raw?: string;
			/** comma,separated */
			usernames?: string;
			/** comma,separated */
			owner_usernames?: string;
			/** pipe|separated */
			automatic_membership_email_domains?: string;
			visibility_level?: number;
			primary_group?: boolean;
			flair_icon?: string;
			flair_upload_id?: number;
			flair_bg_color?: string;
			public_admission?: boolean;
			public_exit?: boolean;
			default_notification_level?: number;
			muted_category_ids?: Array<number>;
			regular_category_ids?: Array<number>;
			watching_category_ids?: Array<number>;
			tracking_category_ids?: Array<number>;
			watching_first_post_category_ids?: Array<number>;
		};
	};
	'invites.create': {
		/** required for email invites only */
		email?: string;
		skip_email?: boolean;
		/** optional, for email invites */
		custom_message?: string;
		/** optional, for link invites */
		max_redemptions_allowed?: number;
		topic_id?: number;
		/** Optional, either this or `group_names`. Comma separated list for multiple ids. */
		group_ids?: string;
		/** Optional, either this or `group_ids`. Comma separated list for multiple names. */
		group_names?: string;
		/** optional, if not supplied, the invite_expiry_days site setting is used */
		expires_at?: string;
	};
	'invites.createMultiple': {
		/** pass 1 email per invite to be generated. other properties will be shared by each invite. */
		email?: Array<string>;
		skip_email?: boolean;
		/** optional, for email invites */
		custom_message?: string;
		/** optional, for link invites */
		max_redemptions_allowed?: number;
		topic_id?: number;
		/** Optional, either this or `group_names`. Comma separated list for multiple ids. */
		group_ids?: string;
		/** Optional, either this or `group_ids`. Comma separated list for multiple names. */
		group_names?: string;
		/** optional, if not supplied, the invite_expiry_days site setting is used */
		expires_at?: string;
	};
	'notifications.list': Record<string, never>;
	'notifications.markRead': {
		/** (optional) Leave off to mark all notifications as read */
		id?: number;
	};
	'posts.create': {
		/** Required if creating a new topic or new private message. */
		title?: string;
		raw: string;
		/** Required if creating a new post. */
		topic_id?: number;
		/** Optional if creating a new topic, and ignored if creating a new post. */
		category?: number;
		/** Required for private message, comma separated. */
		target_recipients?: string;
		/** Deprecated. Use target_recipients instead. */
		target_usernames?: string;
		/** Required for new private message. */
		archetype?: string;
		created_at?: string;
		/** Optional, the post number to reply to inside a topic. */
		reply_to_post_number?: number;
		/** Provide a URL from a remote system to associate a forum topic with that URL, typically for using Discourse as a comments system for an external blog. */
		embed_url?: string;
		/** Provide an external_id from a remote system to associate a forum topic with that id. */
		external_id?: string;
		/** If false, the user will not track the topic. By default, the user will track the topic. */
		auto_track?: boolean;
	};
	'posts.delete': {
		id: number;
		/** The `SiteSetting.can_permanently_delete` needs to be enabled first before this param can be used. Also this endpoint needs to be called first without `force_destroy` and then followed up with a second call 5 minutes later with `force_destroy` to permanently delete. */
		force_destroy?: boolean;
	};
	'posts.get': {
		id: string | number;
	};
	'posts.list': {
		/** Load posts with an id lower than this value. Useful for pagination. */
		before?: number;
	};
	'posts.listReplies': {
		id: string | number;
	};
	'posts.lock': {
		id: string | number;
		/** Whether to lock the post (true/false) */
		locked: string;
	};
	'posts.performAction': {
		/** The ID of the post to perform the action on */
		id: number;
		/** The ID of the post action type (e.g., 2 for like) */
		post_action_type_id: number;
		/** Whether to flag the entire topic */
		flag_topic?: boolean;
	};
	'posts.update': {
		id: string | number;
		post?: {
			raw: string;
			edit_reason?: string;
		};
		/** Skip bumping the topic when updating the post. Requires staff or TL4 permissions. */
		bypass_bump?: boolean;
	};
	'privateMessages.list': {
		username: string | number;
	};
	'privateMessages.listSent': {
		username: string | number;
	};
	'search.query': {
		/** The query string needs to be url encoded and is made up of the following options: - Search term. This is just a string. Usually it would be the first item in the query. - `@<username>`: Use the `@` followed by the username to specify posts by this user. - `#<category>`: Use the `#` followed by… */
		q?: string;
		page?: number;
	};
	'site.get': Record<string, never>;
	'site.getBasicInfo': Record<string, never>;
	'tags.createGroup': {
		name: string;
	};
	'tags.get': {
		name: string | number;
	};
	'tags.getGroup': {
		id: string | number;
	};
	'tags.list': Record<string, never>;
	'tags.listGroups': Record<string, never>;
	'tags.updateGroup': {
		id: string | number;
		name?: string;
	};
	'topics.bookmark': {
		id: string | number;
	};
	'topics.createTimer': {
		id: string | number;
		time?: string;
		status_type?: string;
		based_on_last_post?: boolean;
		category_id?: number;
	};
	'topics.delete': {
		id: string | number;
	};
	'topics.get': {
		id: string | number;
	};
	'topics.getByExternalId': {
		external_id: string | number;
	};
	'topics.getPosts': {
		id: string | number;
		/** The ids of the posts to read (repeat for several). */
		'post_ids[]': Array<number>;
	};
	'topics.invite': {
		id: string | number;
		user?: string;
		email?: string;
	};
	'topics.inviteGroup': {
		id: string | number;
		/** The name of the group to invite */
		group?: string;
		/** Whether to notify the group, it defaults to true */
		should_notify?: boolean;
	};
	'topics.listLatest': {
		/** Enum: `default`, `created`, `activity`, `views`, `posts`, `category`, `likes`, `op_likes`, `posters` */
		order?: string;
		/** Defaults to `desc`, add `ascending=true` to sort asc */
		ascending?: string;
		/** Maximum number of topics returned, between 1-100 */
		per_page?: number;
	};
	'topics.listTop': {
		/** Enum: `all`, `yearly`, `quarterly`, `monthly`, `weekly`, `daily` */
		period?: string;
		/** Maximum number of topics returned, between 1-100 */
		per_page?: number;
	};
	'topics.setNotificationLevel': {
		id: string | number;
		notification_level: '0' | '1' | '2' | '3';
	};
	'topics.update': {
		id: string | number;
		topic?: {
			title?: string;
			category_id?: number;
		};
	};
	'topics.updateStatus': {
		id: string | number;
		status: 'closed' | 'pinned' | 'pinned_globally' | 'archived' | 'visible';
		enabled: 'true' | 'false';
		/** Only required for `pinned` and `pinned_globally` */
		until?: string;
	};
	'topics.updateTimestamp': {
		id: string | number;
		timestamp: string;
	};
	'uploads.abortMultipart': {
		/** The identifier of the multipart upload in the external storage provider. This is the multipart upload_id in AWS S3. */
		external_upload_identifier: string;
	};
	'uploads.batchPresignMultipartParts': {
		/** The part numbers to generate the presigned URLs for. Each part number must be between 1 and 10000. A request can have at most 100 part numbers. */
		part_numbers: Array<DiscourseJsonValue>;
		/** The unique identifier returned in the original /create-multipart request. */
		unique_identifier: string;
	};
	'uploads.completeExternal': {
		/** The unique identifier returned in the original /generate-presigned-put request. */
		unique_identifier: string;
		/** Optionally set this to true if the upload is for a private message. */
		for_private_message?: string;
		/** Optionally set this to true if the upload is for a site setting. */
		for_site_setting?: string;
		/** Optionally set this to true if the upload was pasted into the upload area. This will convert PNG files to JPEG. */
		pasted?: string;
	};
	'uploads.completeMultipart': {
		/** The unique identifier returned in the original /create-multipart request. */
		unique_identifier: string;
		/** All of the part numbers and their corresponding ETags that have been uploaded must be provided. */
		parts: Array<DiscourseJsonValue>;
	};
	'uploads.create': {
		upload_type:
			| 'avatar'
			| 'profile_background'
			| 'card_background'
			| 'custom_emoji'
			| 'composer';
		/** required if uploading an avatar */
		user_id?: number;
		/** Use this flag to return an id and url */
		synchronous?: boolean;
		file?: FileInput;
	};
	'uploads.createMultipart': {
		upload_type:
			| 'avatar'
			| 'profile_background'
			| 'card_background'
			| 'custom_emoji'
			| 'composer';
		file_name: string;
		/** File size should be represented in bytes. */
		file_size: number;
		metadata?: {
			/** The SHA1 checksum of the upload binary blob. Optionally be provided and serves as an additional security check when later processing the file in complete-external-upload endpoint. */
			'sha1-checksum'?: string;
		};
	};
	'uploads.generatePresignedPut': {
		type:
			| 'avatar'
			| 'profile_background'
			| 'card_background'
			| 'custom_emoji'
			| 'composer';
		file_name: string;
		/** File size should be represented in bytes. */
		file_size: number;
		metadata?: {
			/** The SHA1 checksum of the upload binary blob. Optionally be provided and serves as an additional security check when later processing the file in complete-external-upload endpoint. */
			'sha1-checksum'?: string;
		};
	};
	'users.activate': {
		id: number;
	};
	'users.adminGet': {
		id: number;
	};
	'users.adminList': {
		order?:
			| 'created'
			| 'last_emailed'
			| 'seen'
			| 'username'
			| 'email'
			| 'trust_level'
			| 'days_visited'
			| 'posts_read'
			| 'topics_viewed'
			| 'posts'
			| 'read_time';
		asc?: 'true';
		page?: number;
		/** Include user email addresses in response. These requests will be logged in the staff action logs. */
		show_emails?: boolean;
		/** Include user stats information */
		stats?: boolean;
		/** Filter to the user with this email address */
		email?: string;
		/** Filter to users with this IP address */
		ip?: string;
	};
	'users.adminListByFlag': {
		flag: 'active' | 'new' | 'staff' | 'suspended' | 'blocked' | 'suspect';
		order?:
			| 'created'
			| 'last_emailed'
			| 'seen'
			| 'username'
			| 'email'
			| 'trust_level'
			| 'days_visited'
			| 'posts_read'
			| 'topics_viewed'
			| 'posts'
			| 'read_time';
		asc?: 'true';
		page?: number;
		/** Include user email addresses in response. These requests will be logged in the staff action logs. */
		show_emails?: boolean;
		/** Include user stats information */
		stats?: boolean;
		/** Filter to the user with this email address */
		email?: string;
		/** Filter to users with this IP address */
		ip?: string;
	};
	'users.anonymize': {
		id: number;
	};
	'users.changePassword': {
		token: string | number;
		username: string;
		password: string;
	};
	'users.create': {
		name: string;
		email: string;
		password: string;
		username: string;
		/** This param requires an admin api key in the request header or it will be ignored */
		active?: boolean;
		approved?: boolean;
		user_fields?: {
			'1'?: boolean;
		};
		external_ids?: Record<string, DiscourseJsonValue>;
	};
	'users.deactivate': {
		id: number;
	};
	'users.delete': {
		id: number;
		delete_posts?: boolean;
		block_email?: boolean;
		block_urls?: boolean;
		block_ip?: boolean;
	};
	'users.get': {
		username: string | number;
	};
	'users.getByExternalId': {
		external_id: string | number;
	};
	'users.getByProviderExternalId': {
		/** Authentication provider name. Can be found in the provider callback URL: `/auth/{provider}/callback` */
		provider: string | number;
		external_id: string | number;
	};
	'users.getEmails': {
		username: string | number;
	};
	'users.listActions': {
		offset: number;
		username: string;
		filter: string;
	};
	'users.listDirectory': {
		period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all';
		order:
			| 'likes_received'
			| 'likes_given'
			| 'topic_count'
			| 'post_count'
			| 'topics_entered'
			| 'posts_read'
			| 'days_visited';
		asc?: 'true';
		page?: number;
	};
	'users.logOut': {
		id: number;
	};
	'users.merge': {
		/** ID of the user to merge */
		id: number;
		/** Username of the user to merge into */
		target_username: string;
	};
	'users.refreshGravatar': {
		username: string | number;
	};
	'users.sendPasswordResetEmail': {
		login: string;
	};
	'users.silence': {
		id: number;
		silenced_till: string;
		reason: string;
		/** Will send an email with this message when present */
		message?: string;
		post_action?: string;
	};
	'users.suspend': {
		id: number;
		suspend_until: string;
		reason: string;
		/** Will send an email with this message when present */
		message?: string;
		post_action?: string;
	};
	'users.update': {
		username: string | number;
		name?: string;
		external_ids?: Record<string, DiscourseJsonValue>;
	};
	'users.updateAvatar': {
		username: string | number;
		upload_id?: number;
		associated_account_id?: number;
		type:
			| string
			| 'uploaded'
			| 'custom'
			| 'gravatar'
			| 'current'
			| 'associated_account'
			| 'system';
	};
	'users.updateEmail': {
		username: string | number;
		email: string;
	};
	'users.updateUsername': {
		username: string | number;
		new_username: string;
	};
};

export type DiscourseOperationOutputs = {
	'backups.create': {
		success?: string | null;
	};
	'backups.download': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'backups.list': Array<{
		filename?: string | null;
		size?: number | null;
		last_modified?: string | null;
	}>;
	'backups.sendDownloadEmail': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'badges.create': {
		badge_types?: Array<{
			id?: number | null;
			name?: string | null;
			sort_order?: number | null;
		}> | null;
		badge?: {
			id?: number | null;
			name?: string | null;
			description?: string | null;
			grant_count?: number | null;
			allow_title?: boolean | null;
			multiple_grant?: boolean | null;
			icon?: string | null;
			image_url?: string | null;
			image_upload_id?: number | null;
			listable?: boolean | null;
			enabled?: boolean | null;
			badge_grouping_id?: number | null;
			system?: boolean | null;
			long_description?: string | null;
			slug?: string | null;
			manually_grantable?: boolean | null;
			query?: string | null;
			trigger?: string | null;
			target_posts?: boolean | null;
			auto_revoke?: boolean | null;
			show_posts?: boolean | null;
			badge_type_id?: number | null;
			show_in_post_header?: boolean | null;
		} | null;
	};
	'badges.delete': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'badges.grant': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'badges.list': {
		badges?: Array<{
			id?: number | null;
			name?: string | null;
			description?: string | null;
			grant_count?: number | null;
			allow_title?: boolean | null;
			multiple_grant?: boolean | null;
			icon?: string | null;
			image_url?: string | null;
			listable?: boolean | null;
			enabled?: boolean | null;
			badge_grouping_id?: number | null;
			system?: boolean | null;
			long_description?: string | null;
			slug?: string | null;
			manually_grantable?: boolean | null;
			query?: string | null;
			trigger?: number | null;
			target_posts?: boolean | null;
			auto_revoke?: boolean | null;
			show_posts?: boolean | null;
			i18n_name?: string | null;
			image_upload_id?: number | null;
			badge_type_id?: number | null;
			show_in_post_header?: boolean | null;
		}> | null;
		badge_types?: Array<{
			id?: number | null;
			name?: string | null;
			sort_order?: number | null;
		}> | null;
		badge_groupings?: Array<{
			id?: number | null;
			name?: string | null;
			description?: string | null;
			position?: number | null;
			system?: boolean | null;
		}> | null;
		admin_badges?: {
			protected_system_fields?: Array<DiscourseJsonValue> | null;
			triggers?: {
				user_change?: number | null;
				none?: number | null;
				post_revision?: number | null;
				trust_level_change?: number | null;
				post_action?: number | null;
			} | null;
			badge_ids?: Array<DiscourseJsonValue> | null;
			badge_grouping_ids?: Array<DiscourseJsonValue> | null;
			badge_type_ids?: Array<DiscourseJsonValue> | null;
		} | null;
	};
	'badges.listForUser': {
		badges?: Array<{
			id?: number | null;
			name?: string | null;
			description?: string | null;
			grant_count?: number | null;
			allow_title?: boolean | null;
			multiple_grant?: boolean | null;
			icon?: string | null;
			image_url?: string | null;
			listable?: boolean | null;
			enabled?: boolean | null;
			badge_grouping_id?: number | null;
			system?: boolean | null;
			slug?: string | null;
			manually_grantable?: boolean | null;
			badge_type_id?: number | null;
		}> | null;
		badge_types?: Array<{
			id?: number | null;
			name?: string | null;
			sort_order?: number | null;
		}> | null;
		granted_bies?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
			flair_name?: string | null;
			admin?: boolean | null;
			moderator?: boolean | null;
			trust_level?: number | null;
		}> | null;
		user_badges?: Array<{
			id?: number | null;
			granted_at?: string | null;
			grouping_position?: number | null;
			is_favorite?: string | null;
			can_favorite?: boolean | null;
			badge_id?: number | null;
			granted_by_id?: number | null;
		}> | null;
	};
	'badges.update': {
		badge_types?: Array<{
			id?: number | null;
			name?: string | null;
			sort_order?: number | null;
		}> | null;
		badge?: {
			id?: number | null;
			name?: string | null;
			description?: string | null;
			grant_count?: number | null;
			allow_title?: boolean | null;
			multiple_grant?: boolean | null;
			icon?: string | null;
			image_url?: string | null;
			image_upload_id?: number | null;
			listable?: boolean | null;
			enabled?: boolean | null;
			badge_grouping_id?: number | null;
			system?: boolean | null;
			long_description?: string | null;
			slug?: string | null;
			manually_grantable?: boolean | null;
			query?: string | null;
			trigger?: string | null;
			target_posts?: boolean | null;
			auto_revoke?: boolean | null;
			show_posts?: boolean | null;
			badge_type_id?: number | null;
			show_in_post_header?: boolean | null;
		} | null;
	};
	'categories.create': {
		category?: {
			id?: number | null;
			name?: string | null;
			color?: string | null;
			text_color?: string | null;
			style_type?: string | null;
			emoji?: string | null;
			icon?: string | null;
			slug?: string | null;
			locale?: string | null;
			topic_count?: number | null;
			post_count?: number | null;
			position?: number | null;
			description?: string | null;
			description_text?: string | null;
			description_excerpt?: string | null;
			topic_url?: string | null;
			read_restricted?: boolean | null;
			permission?: number | null;
			notification_level?: number | null;
			can_edit?: boolean | null;
			topic_template?: string | null;
			topic_title_placeholder?: string | null;
			form_template_ids?: Array<DiscourseJsonValue> | null;
			has_children?: boolean | null;
			subcategory_count?: number | null;
			sort_order?: string | null;
			sort_ascending?: string | null;
			show_subcategory_list?: boolean | null;
			num_featured_topics?: number | null;
			default_view?: string | null;
			subcategory_list_style?: string | null;
			default_top_period?: string | null;
			default_list_filter?: string | null;
			minimum_required_tags?: number | null;
			navigate_to_first_post_after_read?: boolean | null;
			custom_fields?: Record<string, DiscourseJsonValue> | null;
			allowed_tags?: Array<DiscourseJsonValue> | null;
			allowed_tag_groups?: Array<DiscourseJsonValue> | null;
			allow_global_tags?: boolean | null;
			required_tag_groups?: Array<{
				name?: string | null;
				min_count?: number | null;
			}> | null;
			category_setting?: {
				auto_bump_cooldown_days?: number | null;
				num_auto_bump_daily?: number | null;
				require_reply_approval?: boolean | null;
				require_topic_approval?: boolean | null;
				nested_replies_default?: boolean | null;
				topic_posting_review_mode?: string | null;
				reply_posting_review_mode?: string | null;
			} | null;
			category_localizations?: Array<DiscourseJsonValue> | null;
			read_only_banner?: string | null;
			permission_groups?: Array<{
				id?: number | null;
				name?: string | null;
			}> | null;
			available_groups?: Array<DiscourseJsonValue> | null;
			auto_close_hours?: string | null;
			auto_close_based_on_last_post?: boolean | null;
			allow_unlimited_owner_edits_on_first_post?: boolean | null;
			default_slow_mode_seconds?: string | null;
			group_permissions?: Array<{
				permission_type?: number | null;
				group_name?: string | null;
				group_id?: number | null;
			}> | null;
			email_in?: string | null;
			email_in_allow_strangers?: boolean | null;
			mailinglist_mirror?: boolean | null;
			all_topics_wiki?: boolean | null;
			can_delete?: boolean | null;
			allow_badges?: boolean | null;
			topic_featured_link_allowed?: boolean | null;
			search_priority?: number | null;
			topic_posting_review_group_ids?: Array<number> | null;
			reply_posting_review_group_ids?: Array<number> | null;
			uploaded_logo?: string | null;
			uploaded_logo_dark?: string | null;
			uploaded_background?: string | null;
			uploaded_background_dark?: string | null;
			category_types?: Record<string, DiscourseJsonValue> | null;
			category_type_settings?: Record<string, DiscourseJsonValue> | null;
			available_category_types?: Array<{
				id?: string | null;
				name?: string | null;
				title?: string | null;
				description?: string | null;
				icon?: string | null;
				svg_icon?: string | null;
				available?: boolean | null;
				visible?: boolean | null;
				configuration_schema?: Record<string, DiscourseJsonValue> | null;
			}> | null;
		} | null;
	};
	'categories.get': {
		category?: {
			id?: number | null;
			name?: string | null;
			color?: string | null;
			text_color?: string | null;
			style_type?: string | null;
			emoji?: string | null;
			icon?: string | null;
			slug?: string | null;
			locale?: string | null;
			topic_count?: number | null;
			post_count?: number | null;
			position?: number | null;
			description?: string | null;
			description_text?: string | null;
			description_excerpt?: string | null;
			topic_url?: string | null;
			read_restricted?: boolean | null;
			permission?: number | null;
			notification_level?: number | null;
			can_edit?: boolean | null;
			topic_template?: string | null;
			topic_title_placeholder?: string | null;
			form_template_ids?: Array<DiscourseJsonValue> | null;
			has_children?: boolean | null;
			subcategory_count?: number | null;
			sort_order?: string | null;
			sort_ascending?: string | null;
			show_subcategory_list?: boolean | null;
			num_featured_topics?: number | null;
			default_view?: string | null;
			subcategory_list_style?: string | null;
			default_top_period?: string | null;
			default_list_filter?: string | null;
			minimum_required_tags?: number | null;
			navigate_to_first_post_after_read?: boolean | null;
			custom_fields?: Record<string, DiscourseJsonValue> | null;
			allowed_tags?: Array<DiscourseJsonValue> | null;
			allowed_tag_groups?: Array<DiscourseJsonValue> | null;
			allow_global_tags?: boolean | null;
			required_tag_groups?: Array<{
				name?: string | null;
				min_count?: number | null;
			}> | null;
			category_setting?: {
				auto_bump_cooldown_days?: number | null;
				num_auto_bump_daily?: number | null;
				require_reply_approval?: boolean | null;
				require_topic_approval?: boolean | null;
				nested_replies_default?: boolean | null;
				topic_posting_review_mode?: string | null;
				reply_posting_review_mode?: string | null;
			} | null;
			category_localizations?: Array<DiscourseJsonValue> | null;
			read_only_banner?: string | null;
			permission_groups?: Array<{
				id?: number | null;
				name?: string | null;
			}> | null;
			available_groups?: Array<DiscourseJsonValue> | null;
			auto_close_hours?: string | null;
			auto_close_based_on_last_post?: boolean | null;
			allow_unlimited_owner_edits_on_first_post?: boolean | null;
			default_slow_mode_seconds?: string | null;
			group_permissions?: Array<{
				permission_type?: number | null;
				group_name?: string | null;
				group_id?: number | null;
			}> | null;
			email_in?: string | null;
			email_in_allow_strangers?: boolean | null;
			mailinglist_mirror?: boolean | null;
			all_topics_wiki?: boolean | null;
			can_delete?: boolean | null;
			allow_badges?: boolean | null;
			topic_featured_link_allowed?: boolean | null;
			search_priority?: number | null;
			topic_posting_review_group_ids?: Array<number> | null;
			reply_posting_review_group_ids?: Array<number> | null;
			uploaded_logo?: string | null;
			uploaded_logo_dark?: string | null;
			uploaded_background?: string | null;
			uploaded_background_dark?: string | null;
			category_types?: Record<string, DiscourseJsonValue> | null;
			category_type_settings?: Record<string, DiscourseJsonValue> | null;
			available_category_types?: Array<{
				id?: string | null;
				name?: string | null;
				title?: string | null;
				description?: string | null;
				icon?: string | null;
				svg_icon?: string | null;
				available?: boolean | null;
				visible?: boolean | null;
				configuration_schema?: Record<string, DiscourseJsonValue> | null;
			}> | null;
		} | null;
	};
	'categories.list': {
		category_list?: {
			can_create_category?: boolean | null;
			can_create_topic?: boolean | null;
			categories?: Array<{
				id?: number | null;
				name?: string | null;
				color?: string | null;
				text_color?: string | null;
				style_type?: string | null;
				emoji?: string | null;
				icon?: string | null;
				slug?: string | null;
				topic_count?: number | null;
				post_count?: number | null;
				position?: number | null;
				description?: string | null;
				description_text?: string | null;
				description_excerpt?: string | null;
				topic_url?: string | null;
				read_restricted?: boolean | null;
				permission?: number | null;
				notification_level?: number | null;
				can_edit?: boolean | null;
				topic_template?: string | null;
				topic_title_placeholder?: string | null;
				has_children?: boolean | null;
				subcategory_count?: number | null;
				sort_order?: string | null;
				sort_ascending?: string | null;
				show_subcategory_list?: boolean | null;
				num_featured_topics?: number | null;
				default_view?: string | null;
				subcategory_list_style?: string | null;
				default_top_period?: string | null;
				default_list_filter?: string | null;
				minimum_required_tags?: number | null;
				navigate_to_first_post_after_read?: boolean | null;
				topics_day?: number | null;
				topics_week?: number | null;
				topics_month?: number | null;
				topics_year?: number | null;
				topics_all_time?: number | null;
				is_uncategorized?: boolean | null;
				subcategory_ids?: Array<DiscourseJsonValue> | null;
				subcategory_list?: Array<DiscourseJsonValue> | null;
				uploaded_logo?: string | null;
				uploaded_logo_dark?: string | null;
				uploaded_background?: string | null;
				uploaded_background_dark?: string | null;
			}> | null;
		} | null;
	};
	'categories.listTopics': {
		users?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		}> | null;
		primary_groups?: Array<DiscourseJsonValue> | null;
		topic_list?: {
			filter?: string | null;
			can_create_topic?: boolean | null;
			per_page?: number | null;
			top_tags?: Array<{
				id?: number | null;
				name?: string | null;
				slug?: string | null;
			}> | null;
			topics?: Array<{
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
				reply_count?: number | null;
				highest_post_number?: number | null;
				image_url?: string | null;
				created_at?: string | null;
				last_posted_at?: string | null;
				bumped?: boolean | null;
				bumped_at?: string | null;
				archetype?: string | null;
				unseen?: boolean | null;
				pinned?: boolean | null;
				unpinned?: string | null;
				excerpt?: string | null;
				visible?: boolean | null;
				closed?: boolean | null;
				archived?: boolean | null;
				bookmarked?: boolean | null;
				liked?: boolean | null;
				views?: number | null;
				like_count?: number | null;
				has_summary?: boolean | null;
				last_poster_username?: string | null;
				category_id?: number | null;
				pinned_globally?: boolean | null;
				featured_link?: string | null;
				posters?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
			}> | null;
		} | null;
	};
	'categories.update': {
		success?: string | null;
		category?: {
			id?: number | null;
			name?: string | null;
			color?: string | null;
			text_color?: string | null;
			style_type?: string | null;
			emoji?: string | null;
			icon?: string | null;
			slug?: string | null;
			locale?: string | null;
			topic_count?: number | null;
			post_count?: number | null;
			position?: number | null;
			description?: string | null;
			description_text?: string | null;
			description_excerpt?: string | null;
			topic_url?: string | null;
			read_restricted?: boolean | null;
			permission?: number | null;
			notification_level?: number | null;
			can_edit?: boolean | null;
			topic_template?: string | null;
			topic_title_placeholder?: string | null;
			form_template_ids?: Array<DiscourseJsonValue> | null;
			has_children?: boolean | null;
			subcategory_count?: number | null;
			sort_order?: string | null;
			sort_ascending?: string | null;
			show_subcategory_list?: boolean | null;
			num_featured_topics?: number | null;
			default_view?: string | null;
			subcategory_list_style?: string | null;
			default_top_period?: string | null;
			default_list_filter?: string | null;
			minimum_required_tags?: number | null;
			navigate_to_first_post_after_read?: boolean | null;
			custom_fields?: Record<string, DiscourseJsonValue> | null;
			allowed_tags?: Array<DiscourseJsonValue> | null;
			allowed_tag_groups?: Array<DiscourseJsonValue> | null;
			allow_global_tags?: boolean | null;
			required_tag_groups?: Array<{
				name?: string | null;
				min_count?: number | null;
			}> | null;
			category_setting?: {
				auto_bump_cooldown_days?: number | null;
				num_auto_bump_daily?: number | null;
				require_reply_approval?: boolean | null;
				require_topic_approval?: boolean | null;
				nested_replies_default?: boolean | null;
				topic_posting_review_mode?: string | null;
				reply_posting_review_mode?: string | null;
			} | null;
			category_localizations?: Array<DiscourseJsonValue> | null;
			read_only_banner?: string | null;
			permission_groups?: Array<{
				id?: number | null;
				name?: string | null;
			}> | null;
			available_groups?: Array<DiscourseJsonValue> | null;
			auto_close_hours?: string | null;
			auto_close_based_on_last_post?: boolean | null;
			allow_unlimited_owner_edits_on_first_post?: boolean | null;
			default_slow_mode_seconds?: string | null;
			group_permissions?: Array<{
				permission_type?: number | null;
				group_name?: string | null;
				group_id?: number | null;
			}> | null;
			email_in?: string | null;
			email_in_allow_strangers?: boolean | null;
			mailinglist_mirror?: boolean | null;
			all_topics_wiki?: boolean | null;
			can_delete?: boolean | null;
			allow_badges?: boolean | null;
			topic_featured_link_allowed?: boolean | null;
			search_priority?: number | null;
			topic_posting_review_group_ids?: Array<number> | null;
			reply_posting_review_group_ids?: Array<number> | null;
			uploaded_logo?: string | null;
			uploaded_logo_dark?: string | null;
			uploaded_background?: string | null;
			uploaded_background_dark?: string | null;
			category_types?: Record<string, DiscourseJsonValue> | null;
			category_type_settings?: Record<string, DiscourseJsonValue> | null;
			available_category_types?: Array<{
				id?: string | null;
				name?: string | null;
				title?: string | null;
				description?: string | null;
				icon?: string | null;
				svg_icon?: string | null;
				available?: boolean | null;
				visible?: boolean | null;
				configuration_schema?: Record<string, DiscourseJsonValue> | null;
			}> | null;
		} | null;
	};
	'events.exportIcs': FileOutput;
	'events.list': {
		events?: Array<{
			id?: number | null;
			category_id?: number | null;
			name?: string | null;
			recurrence?: string | null;
			recurrence_until?: string | null;
			starts_at?: string | null;
			ends_at?: string | null;
			rrule?: string | null;
			show_local_time?: boolean | null;
			timezone?: string | null;
			duration?: string | null;
			all_day?: boolean | null;
			custom_fields?: Record<string, DiscourseJsonValue> | null;
			post?: {
				id?: number | null;
				post_number?: number | null;
				url?: string | null;
				category_slug?: string | null;
				topic?: {
					id?: number | null;
					title?: string | null;
					tags?: Array<string> | null;
					tags_descriptions?: Record<string, DiscourseJsonValue> | null;
					slug?: string | null;
				} | null;
			} | null;
			occurrences?: Array<{
				starts_at?: string | null;
				ends_at?: string | null;
			}> | null;
			can_act_on_discourse_post_event?: boolean | null;
			can_update_attendance?: boolean | null;
			creator?: {
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
			} | null;
			hosts?: Array<{
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
				title?: string | null;
			}> | null;
			is_closed?: boolean | null;
			is_expired?: boolean | null;
			is_ongoing?: boolean | null;
			is_private?: boolean | null;
			is_public?: boolean | null;
			is_standalone?: boolean | null;
			minimal?: boolean | null;
			raw_invitees?: Array<string> | null;
			reminders?: Array<{
				value?: number | null;
				unit?: string | null;
				period?: string | null;
				type?: string | null;
			}> | null;
			sample_invitees?: Array<Record<string, DiscourseJsonValue>> | null;
			should_display_invitees?: boolean | null;
			stats?: Record<string, DiscourseJsonValue> | null;
			status?: string | null;
			url?: string | null;
			description?: string | null;
			description_html?: string | null;
			location?: string | null;
			url_restates_location?: boolean | null;
			watching_invitee?: Record<string, DiscourseJsonValue> | null;
			chat_enabled?: boolean | null;
			channel?: Record<string, DiscourseJsonValue> | null;
			livestream?: boolean | null;
			allow_anonymous_livestream?: boolean | null;
			livestream_onebox?: string | null;
			is_zoom_livestream?: boolean | null;
			recording_url?: string | null;
			recording_onebox?: string | null;
			max_attendees?: number | null;
			at_capacity?: boolean | null;
			image_upload?: Record<string, DiscourseJsonValue> | null;
		}> | null;
	};
	'groups.addMembers': {
		success?: string | null;
		usernames?: Array<DiscourseJsonValue> | null;
		emails?: Array<DiscourseJsonValue> | null;
	};
	'groups.create': {
		basic_group?: {
			id?: number | null;
			automatic?: boolean | null;
			name?: string | null;
			user_count?: number | null;
			mentionable_level?: number | null;
			messageable_level?: number | null;
			visibility_level?: number | null;
			primary_group?: boolean | null;
			title?: string | null;
			grant_trust_level?: string | null;
			incoming_email?: string | null;
			has_messages?: boolean | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			bio_raw?: string | null;
			bio_cooked?: string | null;
			bio_excerpt?: string | null;
			public_admission?: boolean | null;
			public_exit?: boolean | null;
			allow_membership_requests?: boolean | null;
			full_name?: string | null;
			default_notification_level?: number | null;
			membership_request_template?: string | null;
			members_visibility_level?: number | null;
			can_see_members?: boolean | null;
			can_admin_group?: boolean | null;
			can_edit_group?: boolean | null;
			publish_read_state?: boolean | null;
		} | null;
	};
	'groups.delete': {
		success?: string | null;
	};
	'groups.get': {
		group?: {
			id?: number | null;
			automatic?: boolean | null;
			name?: string | null;
			user_count?: number | null;
			mentionable_level?: number | null;
			messageable_level?: number | null;
			visibility_level?: number | null;
			primary_group?: boolean | null;
			title?: string | null;
			grant_trust_level?: string | null;
			incoming_email?: string | null;
			has_messages?: boolean | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			bio_raw?: string | null;
			bio_cooked?: string | null;
			bio_excerpt?: string | null;
			public_admission?: boolean | null;
			public_exit?: boolean | null;
			allow_membership_requests?: boolean | null;
			full_name?: string | null;
			default_notification_level?: number | null;
			membership_request_template?: string | null;
			is_group_user?: boolean | null;
			members_visibility_level?: number | null;
			can_see_members?: boolean | null;
			can_admin_group?: boolean | null;
			can_edit_group?: boolean | null;
			publish_read_state?: boolean | null;
			is_group_owner_display?: boolean | null;
			mentionable?: boolean | null;
			messageable?: boolean | null;
			automatic_membership_email_domains?: string | null;
			smtp_updated_at?: string | null;
			smtp_updated_by?: Record<string, DiscourseJsonValue> | null;
			smtp_enabled?: boolean | null;
			smtp_server?: string | null;
			smtp_port?: string | null;
			smtp_ssl_mode?: number | null;
			email_username?: string | null;
			email_from_alias?: string | null;
			email_password?: string | null;
			message_count?: number | null;
			allow_unknown_sender_topic_replies?: boolean | null;
			associated_group_ids?: Array<DiscourseJsonValue> | null;
			watching_category_ids?: Array<DiscourseJsonValue> | null;
			tracking_category_ids?: Array<DiscourseJsonValue> | null;
			watching_first_post_category_ids?: Array<DiscourseJsonValue> | null;
			regular_category_ids?: Array<DiscourseJsonValue> | null;
			muted_category_ids?: Array<DiscourseJsonValue> | null;
			watching_tags?: Array<DiscourseJsonValue> | null;
			watching_first_post_tags?: Array<DiscourseJsonValue> | null;
			tracking_tags?: Array<DiscourseJsonValue> | null;
			regular_tags?: Array<DiscourseJsonValue> | null;
			muted_tags?: Array<DiscourseJsonValue> | null;
		} | null;
		extras?: {
			visible_group_names?: Array<DiscourseJsonValue> | null;
		} | null;
	};
	'groups.getById': {
		group?: {
			id?: number | null;
			automatic?: boolean | null;
			name?: string | null;
			user_count?: number | null;
			mentionable_level?: number | null;
			messageable_level?: number | null;
			visibility_level?: number | null;
			primary_group?: boolean | null;
			title?: string | null;
			grant_trust_level?: string | null;
			incoming_email?: string | null;
			has_messages?: boolean | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			bio_raw?: string | null;
			bio_cooked?: string | null;
			bio_excerpt?: string | null;
			public_admission?: boolean | null;
			public_exit?: boolean | null;
			allow_membership_requests?: boolean | null;
			full_name?: string | null;
			default_notification_level?: number | null;
			membership_request_template?: string | null;
			is_group_user?: boolean | null;
			members_visibility_level?: number | null;
			can_see_members?: boolean | null;
			can_admin_group?: boolean | null;
			can_edit_group?: boolean | null;
			publish_read_state?: boolean | null;
			is_group_owner_display?: boolean | null;
			mentionable?: boolean | null;
			messageable?: boolean | null;
			automatic_membership_email_domains?: string | null;
			smtp_updated_at?: string | null;
			smtp_updated_by?: Record<string, DiscourseJsonValue> | null;
			smtp_enabled?: boolean | null;
			smtp_server?: string | null;
			smtp_port?: string | null;
			smtp_ssl_mode?: number | null;
			email_username?: string | null;
			email_from_alias?: string | null;
			email_password?: string | null;
			message_count?: number | null;
			allow_unknown_sender_topic_replies?: boolean | null;
			associated_group_ids?: Array<DiscourseJsonValue> | null;
			watching_category_ids?: Array<DiscourseJsonValue> | null;
			tracking_category_ids?: Array<DiscourseJsonValue> | null;
			watching_first_post_category_ids?: Array<DiscourseJsonValue> | null;
			regular_category_ids?: Array<DiscourseJsonValue> | null;
			muted_category_ids?: Array<DiscourseJsonValue> | null;
			watching_tags?: Array<DiscourseJsonValue> | null;
			watching_first_post_tags?: Array<DiscourseJsonValue> | null;
			tracking_tags?: Array<DiscourseJsonValue> | null;
			regular_tags?: Array<DiscourseJsonValue> | null;
			muted_tags?: Array<DiscourseJsonValue> | null;
		} | null;
		extras?: {
			visible_group_names?: Array<DiscourseJsonValue> | null;
		} | null;
	};
	'groups.list': {
		groups?: Array<{
			id?: number | null;
			automatic?: boolean | null;
			name?: string | null;
			display_name?: string | null;
			user_count?: number | null;
			mentionable_level?: number | null;
			messageable_level?: number | null;
			visibility_level?: number | null;
			primary_group?: boolean | null;
			title?: string | null;
			grant_trust_level?: string | null;
			incoming_email?: string | null;
			has_messages?: boolean | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			bio_raw?: string | null;
			bio_cooked?: string | null;
			bio_excerpt?: string | null;
			public_admission?: boolean | null;
			public_exit?: boolean | null;
			allow_membership_requests?: boolean | null;
			full_name?: string | null;
			default_notification_level?: number | null;
			membership_request_template?: string | null;
			is_group_user?: boolean | null;
			is_group_owner?: boolean | null;
			members_visibility_level?: number | null;
			can_see_members?: boolean | null;
			can_admin_group?: boolean | null;
			can_edit_group?: boolean | null;
			publish_read_state?: boolean | null;
		}> | null;
		extras?: {
			type_filters?: Array<DiscourseJsonValue> | null;
		} | null;
		total_rows_groups?: number | null;
		load_more_groups?: string | null;
	};
	'groups.listMembers': {
		members?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
			title?: string | null;
			last_posted_at?: string | null;
			last_seen_at?: string | null;
			added_at?: string | null;
			timezone?: string | null;
		}> | null;
		owners?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
			title?: string | null;
			last_posted_at?: string | null;
			last_seen_at?: string | null;
			added_at?: string | null;
			timezone?: string | null;
		}> | null;
		meta?: {
			total?: number | null;
			limit?: number | null;
			offset?: number | null;
		} | null;
	};
	'groups.removeMembers': {
		success?: string | null;
		usernames?: Array<DiscourseJsonValue> | null;
		skipped_usernames?: Array<DiscourseJsonValue> | null;
	};
	'groups.update': {
		success?: string | null;
	};
	'invites.create': {
		id?: number | null;
		invite_key?: string | null;
		link?: string | null;
		description?: string | null;
		email?: string | null;
		domain?: string | null;
		emailed?: boolean | null;
		can_delete_invite?: boolean | null;
		custom_message?: string | null;
		created_at?: string | null;
		updated_at?: string | null;
		expires_at?: string | null;
		expired?: boolean | null;
		grants_admin?: boolean | null;
		grants_moderator?: boolean | null;
		topics?: Array<Record<string, DiscourseJsonValue>> | null;
		groups?: Array<Record<string, DiscourseJsonValue>> | null;
	};
	'invites.createMultiple': {
		num_successfully_created_invitations?: number | null;
		num_failed_invitations?: number | null;
		failed_invitations?: Array<DiscourseJsonValue> | null;
		successful_invitations?: Array<DiscourseJsonValue> | null;
	};
	'notifications.list': {
		notifications?: Array<{
			id?: number | null;
			user_id?: number | null;
			notification_type?: number | null;
			read?: boolean | null;
			created_at?: string | null;
			post_number?: number | null;
			topic_id?: number | null;
			slug?: string | null;
			data?: {
				badge_id?: number | null;
				badge_name?: string | null;
				badge_slug?: string | null;
				badge_title?: boolean | null;
				username?: string | null;
			} | null;
		}> | null;
		total_rows_notifications?: number | null;
		seen_notification_id?: number | null;
		load_more_notifications?: string | null;
	};
	'notifications.markRead': {
		success?: string | null;
	};
	'posts.create': {
		id?: number | null;
		name?: string | null;
		username?: string | null;
		avatar_template?: string | null;
		created_at?: string | null;
		raw?: string | null;
		cooked?: string | null;
		post_number?: number | null;
		post_type?: number | null;
		posts_count?: number | null;
		updated_at?: string | null;
		reply_count?: number | null;
		reply_to_post_number?: string | null;
		quote_count?: number | null;
		incoming_link_count?: number | null;
		reads?: number | null;
		readers_count?: number | null;
		score?: number | null;
		yours?: boolean | null;
		topic_id?: number | null;
		topic_slug?: string | null;
		display_username?: string | null;
		primary_group_name?: string | null;
		flair_name?: string | null;
		flair_url?: string | null;
		flair_bg_color?: string | null;
		flair_color?: string | null;
		flair_group_id?: number | null;
		badges_granted?: Array<DiscourseJsonValue> | null;
		version?: number | null;
		can_edit?: boolean | null;
		can_delete?: boolean | null;
		can_recover?: boolean | null;
		can_see_hidden_post?: boolean | null;
		can_wiki?: boolean | null;
		user_title?: string | null;
		bookmarked?: boolean | null;
		actions_summary?: Array<{
			id?: number | null;
			can_act?: boolean | null;
		}> | null;
		moderator?: boolean | null;
		admin?: boolean | null;
		staff?: boolean | null;
		user_id?: number | null;
		draft_sequence?: number | null;
		hidden?: boolean | null;
		trust_level?: number | null;
		deleted_at?: string | null;
		user_deleted?: boolean | null;
		edit_reason?: string | null;
		can_view_edit_history?: boolean | null;
		wiki?: boolean | null;
		reviewable_id?: number | null;
		reviewable_score_count?: number | null;
		reviewable_score_pending_count?: number | null;
		post_url?: string | null;
		post_localizations?: Array<DiscourseJsonValue> | null;
		mentioned_users?: Array<DiscourseJsonValue> | null;
	};
	'posts.delete': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'posts.get': {
		id?: number | null;
		username?: string | null;
		avatar_template?: string | null;
		created_at?: string | null;
		cooked?: string | null;
		post_number?: number | null;
		post_type?: number | null;
		posts_count?: number | null;
		updated_at?: string | null;
		reply_count?: number | null;
		reply_to_post_number?: string | null;
		quote_count?: number | null;
		incoming_link_count?: number | null;
		reads?: number | null;
		readers_count?: number | null;
		score?: number | null;
		yours?: boolean | null;
		topic_id?: number | null;
		topic_slug?: string | null;
		primary_group_name?: string | null;
		flair_name?: string | null;
		flair_url?: string | null;
		flair_bg_color?: string | null;
		flair_color?: string | null;
		flair_group_id?: number | null;
		version?: number | null;
		can_edit?: boolean | null;
		can_delete?: boolean | null;
		can_recover?: boolean | null;
		can_see_hidden_post?: boolean | null;
		can_wiki?: boolean | null;
		user_title?: string | null;
		bookmarked?: boolean | null;
		raw?: string | null;
		actions_summary?: Array<{
			/** `2`: like, `3`, `4`, `6`, `7`, `8`: flag */
			id?: number | null;
			count?: number | null;
			acted?: boolean | null;
			can_undo?: boolean | null;
			can_act?: boolean | null;
		}> | null;
		moderator?: boolean | null;
		admin?: boolean | null;
		staff?: boolean | null;
		user_id?: number | null;
		hidden?: boolean | null;
		trust_level?: number | null;
		deleted_at?: string | null;
		user_deleted?: boolean | null;
		edit_reason?: string | null;
		can_view_edit_history?: boolean | null;
		wiki?: boolean | null;
		reviewable_id?: number | null;
		reviewable_score_count?: number | null;
		reviewable_score_pending_count?: number | null;
		post_url?: string | null;
		mentioned_users?: Array<DiscourseJsonValue> | null;
		name?: string | null;
		display_username?: string | null;
	};
	'posts.list': {
		latest_posts?: Array<{
			id?: number | null;
			name?: string | null;
			username?: string | null;
			avatar_template?: string | null;
			created_at?: string | null;
			cooked?: string | null;
			post_number?: number | null;
			post_type?: number | null;
			posts_count?: number | null;
			updated_at?: string | null;
			reply_count?: number | null;
			reply_to_post_number?: string | null;
			quote_count?: number | null;
			incoming_link_count?: number | null;
			reads?: number | null;
			readers_count?: number | null;
			score?: number | null;
			yours?: boolean | null;
			topic_id?: number | null;
			topic_slug?: string | null;
			topic_title?: string | null;
			topic_html_title?: string | null;
			category_id?: number | null;
			display_username?: string | null;
			primary_group_name?: string | null;
			flair_name?: string | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			flair_group_id?: string | null;
			badges_granted?: Array<DiscourseJsonValue> | null;
			version?: number | null;
			can_edit?: boolean | null;
			can_delete?: boolean | null;
			can_recover?: boolean | null;
			can_see_hidden_post?: boolean | null;
			can_wiki?: boolean | null;
			user_title?: string | null;
			bookmarked?: boolean | null;
			raw?: string | null;
			actions_summary?: Array<{
				id?: number | null;
				can_act?: boolean | null;
			}> | null;
			moderator?: boolean | null;
			admin?: boolean | null;
			staff?: boolean | null;
			user_id?: number | null;
			hidden?: boolean | null;
			trust_level?: number | null;
			deleted_at?: string | null;
			user_deleted?: boolean | null;
			edit_reason?: string | null;
			can_view_edit_history?: boolean | null;
			wiki?: boolean | null;
			excerpt?: string | null;
			truncated?: boolean | null;
			reviewable_id?: string | null;
			reviewable_score_count?: number | null;
			reviewable_score_pending_count?: number | null;
			post_url?: string | null;
		}> | null;
	};
	'posts.listReplies': Array<{
		id?: number | null;
		name?: string | null;
		username?: string | null;
		avatar_template?: string | null;
		created_at?: string | null;
		cooked?: string | null;
		post_number?: number | null;
		post_type?: number | null;
		posts_count?: number | null;
		updated_at?: string | null;
		reply_count?: number | null;
		reply_to_post_number?: number | null;
		quote_count?: number | null;
		incoming_link_count?: number | null;
		reads?: number | null;
		readers_count?: number | null;
		score?: number | null;
		yours?: boolean | null;
		topic_id?: number | null;
		topic_slug?: string | null;
		display_username?: string | null;
		primary_group_name?: string | null;
		flair_name?: string | null;
		flair_url?: string | null;
		flair_bg_color?: string | null;
		flair_color?: string | null;
		flair_group_id?: number | null;
		version?: number | null;
		can_edit?: boolean | null;
		can_delete?: boolean | null;
		can_recover?: boolean | null;
		can_see_hidden_post?: boolean | null;
		can_wiki?: boolean | null;
		user_title?: string | null;
		reply_to_user?: {
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		} | null;
		bookmarked?: boolean | null;
		actions_summary?: Array<{
			id?: number | null;
			can_act?: boolean | null;
		}> | null;
		moderator?: boolean | null;
		admin?: boolean | null;
		staff?: boolean | null;
		user_id?: number | null;
		hidden?: boolean | null;
		trust_level?: number | null;
		deleted_at?: string | null;
		user_deleted?: boolean | null;
		edit_reason?: string | null;
		can_view_edit_history?: boolean | null;
		wiki?: boolean | null;
		reviewable_id?: number | null;
		reviewable_score_count?: number | null;
		reviewable_score_pending_count?: number | null;
		post_url?: string | null;
	}>;
	'posts.lock': {
		/** Whether the post is locked */
		locked?: boolean | null;
	};
	'posts.performAction': {
		/** The ID of the post */
		id?: number | null;
		/** The name of the post author */
		name?: string | null;
		/** The username of the post author */
		username?: string | null;
		/** Template for the author's avatar URL */
		avatar_template?: string | null;
		/** When the post was created */
		created_at?: string | null;
		/** The HTML content of the post */
		cooked?: string | null;
		/** The post number within the topic */
		post_number?: number | null;
		/** The type of post */
		post_type?: number | null;
		/** Total posts count for the user */
		posts_count?: number | null;
		/** When the post was last updated */
		updated_at?: string | null;
		/** Number of replies to this post */
		reply_count?: number | null;
		/** Post number this post is replying to */
		reply_to_post_number?: string | null;
		/** Number of times this post has been quoted */
		quote_count?: number | null;
		/** Number of incoming links to this post */
		incoming_link_count?: number | null;
		/** Number of reads */
		reads?: number | null;
		/** Number of readers */
		readers_count?: number | null;
		/** Post score */
		score?: number | null;
		/** Whether this post belongs to the current user */
		yours?: boolean | null;
		/** ID of the topic this post belongs to */
		topic_id?: number | null;
		/** Slug of the topic this post belongs to */
		topic_slug?: string | null;
		/** Display username of the post author */
		display_username?: string | null;
		/** Primary group name of the author */
		primary_group_name?: string | null;
		/** Flair name of the author */
		flair_name?: string | null;
		/** Flair URL of the author */
		flair_url?: string | null;
		/** Flair background color of the author */
		flair_bg_color?: string | null;
		/** Flair color of the author */
		flair_color?: string | null;
		/** Flair group ID of the author */
		flair_group_id?: number | null;
		/** Badges granted to the user */
		badges_granted?: Array<DiscourseJsonValue> | null;
		/** Version number of the post */
		version?: number | null;
		/** Whether the current user can edit this post */
		can_edit?: boolean | null;
		/** Whether the current user can delete this post */
		can_delete?: boolean | null;
		/** Whether the current user can recover this post */
		can_recover?: boolean | null;
		/** Whether the current user can see hidden posts */
		can_see_hidden_post?: boolean | null;
		/** Whether the current user can wiki this post */
		can_wiki?: boolean | null;
		/** Title of the post author */
		user_title?: string | null;
		/** Whether the post is bookmarked by the current user */
		bookmarked?: boolean | null;
		/** Summary of actions performed on this post */
		actions_summary?: Array<{
			/** ID of the action type (e.g., 2 for like) */
			id?: number | null;
			/** Number of times this action has been performed */
			count?: number | null;
			/** Whether the current user has performed this action */
			acted?: boolean | null;
			/** Whether the current user can undo this action */
			can_undo?: boolean | null;
			/** Whether the current user can perform this action */
			can_act?: boolean | null;
		}> | null;
		/** Whether the post author is a moderator */
		moderator?: boolean | null;
		/** Whether the post author is an admin */
		admin?: boolean | null;
		/** Whether the post author is staff */
		staff?: boolean | null;
		/** ID of the post author */
		user_id?: number | null;
		/** Whether the post is hidden */
		hidden?: boolean | null;
		/** Trust level of the post author */
		trust_level?: number | null;
		/** When the post was deleted */
		deleted_at?: string | null;
		/** Whether the post was deleted by the user */
		user_deleted?: boolean | null;
		/** Reason for the last edit */
		edit_reason?: string | null;
		/** Whether the current user can view edit history */
		can_view_edit_history?: boolean | null;
		/** Whether this is a wiki post */
		wiki?: boolean | null;
		/** ID of the reviewable if this post is under review */
		reviewable_id?: number | null;
		/** Number of reviewable scores */
		reviewable_score_count?: number | null;
		/** Number of pending reviewable scores */
		reviewable_score_pending_count?: number | null;
		/** URL of the post */
		post_url?: string | null;
	};
	'posts.update': {
		post?: {
			id?: number | null;
			username?: string | null;
			avatar_template?: string | null;
			created_at?: string | null;
			cooked?: string | null;
			post_number?: number | null;
			post_type?: number | null;
			posts_count?: number | null;
			updated_at?: string | null;
			reply_count?: number | null;
			reply_to_post_number?: string | null;
			quote_count?: number | null;
			incoming_link_count?: number | null;
			reads?: number | null;
			readers_count?: number | null;
			score?: number | null;
			yours?: boolean | null;
			topic_id?: number | null;
			topic_slug?: string | null;
			primary_group_name?: string | null;
			flair_name?: string | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			flair_group_id?: number | null;
			badges_granted?: Array<DiscourseJsonValue> | null;
			version?: number | null;
			can_edit?: boolean | null;
			can_delete?: boolean | null;
			can_recover?: boolean | null;
			can_see_hidden_post?: boolean | null;
			can_wiki?: boolean | null;
			user_title?: string | null;
			bookmarked?: boolean | null;
			raw?: string | null;
			actions_summary?: Array<{
				id?: number | null;
				can_act?: boolean | null;
			}> | null;
			moderator?: boolean | null;
			admin?: boolean | null;
			staff?: boolean | null;
			user_id?: number | null;
			draft_sequence?: number | null;
			hidden?: boolean | null;
			trust_level?: number | null;
			deleted_at?: string | null;
			user_deleted?: boolean | null;
			edit_reason?: string | null;
			can_view_edit_history?: boolean | null;
			wiki?: boolean | null;
			reviewable_id?: number | null;
			reviewable_score_count?: number | null;
			reviewable_score_pending_count?: number | null;
			post_url?: string | null;
			post_localizations?: Array<DiscourseJsonValue> | null;
			mentioned_users?: Array<DiscourseJsonValue> | null;
			name?: string | null;
			display_username?: string | null;
		} | null;
	};
	'privateMessages.list': {
		users?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		}> | null;
		primary_groups?: Array<DiscourseJsonValue> | null;
		topic_list?: {
			can_create_topic?: boolean | null;
			draft?: string | null;
			draft_key?: string | null;
			draft_sequence?: number | null;
			per_page?: number | null;
			topics?: Array<{
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
				reply_count?: number | null;
				highest_post_number?: number | null;
				image_url?: string | null;
				created_at?: string | null;
				last_posted_at?: string | null;
				bumped?: boolean | null;
				bumped_at?: string | null;
				archetype?: string | null;
				unseen?: boolean | null;
				last_read_post_number?: number | null;
				unread_posts?: number | null;
				pinned?: boolean | null;
				unpinned?: string | null;
				visible?: boolean | null;
				closed?: boolean | null;
				archived?: boolean | null;
				notification_level?: number | null;
				bookmarked?: boolean | null;
				liked?: boolean | null;
				views?: number | null;
				like_count?: number | null;
				has_summary?: boolean | null;
				last_poster_username?: string | null;
				category_id?: string | null;
				pinned_globally?: boolean | null;
				featured_link?: string | null;
				allowed_user_count?: number | null;
				posters?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
				participants?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
			}> | null;
		} | null;
	};
	'privateMessages.listSent': {
		users?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		}> | null;
		primary_groups?: Array<DiscourseJsonValue> | null;
		topic_list?: {
			can_create_topic?: boolean | null;
			draft?: string | null;
			draft_key?: string | null;
			draft_sequence?: number | null;
			per_page?: number | null;
			topics?: Array<{
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
				reply_count?: number | null;
				highest_post_number?: number | null;
				image_url?: string | null;
				created_at?: string | null;
				last_posted_at?: string | null;
				bumped?: boolean | null;
				bumped_at?: string | null;
				archetype?: string | null;
				unseen?: boolean | null;
				last_read_post_number?: number | null;
				unread_posts?: number | null;
				pinned?: boolean | null;
				unpinned?: string | null;
				visible?: boolean | null;
				closed?: boolean | null;
				archived?: boolean | null;
				notification_level?: number | null;
				bookmarked?: boolean | null;
				liked?: boolean | null;
				views?: number | null;
				like_count?: number | null;
				has_summary?: boolean | null;
				last_poster_username?: string | null;
				category_id?: string | null;
				pinned_globally?: boolean | null;
				featured_link?: string | null;
				allowed_user_count?: number | null;
				posters?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
				participants?: Array<DiscourseJsonValue> | null;
			}> | null;
		} | null;
	};
	'search.query': {
		posts?: Array<DiscourseJsonValue> | null;
		users?: Array<DiscourseJsonValue> | null;
		categories?: Array<DiscourseJsonValue> | null;
		tags?: Array<{
			id?: number | null;
			name?: string | null;
			slug?: string | null;
		}> | null;
		groups?: Array<DiscourseJsonValue> | null;
		grouped_search_result?: {
			more_posts?: string | null;
			more_users?: string | null;
			more_categories?: string | null;
			term?: string | null;
			search_log_id?: number | null;
			more_full_page_results?: string | null;
			can_create_topic?: boolean | null;
			error?: string | null;
			extra?: {
				categories?: Array<DiscourseJsonValue> | null;
			} | null;
			post_ids?: Array<DiscourseJsonValue> | null;
			user_ids?: Array<DiscourseJsonValue> | null;
			category_ids?: Array<DiscourseJsonValue> | null;
			tag_ids?: Array<DiscourseJsonValue> | null;
			group_ids?: Array<DiscourseJsonValue> | null;
		} | null;
	};
	'site.get': {
		default_archetype?: string | null;
		notification_types?: {
			mentioned?: number | null;
			replied?: number | null;
			quoted?: number | null;
			edited?: number | null;
			liked?: number | null;
			private_message?: number | null;
			invited_to_private_message?: number | null;
			invitee_accepted?: number | null;
			posted?: number | null;
			watching_category_or_tag?: number | null;
			new_features?: number | null;
			admin_problems?: number | null;
			moved_post?: number | null;
			linked?: number | null;
			granted_badge?: number | null;
			invited_to_topic?: number | null;
			custom?: number | null;
			group_mentioned?: number | null;
			group_message_summary?: number | null;
			watching_first_post?: number | null;
			topic_reminder?: number | null;
			liked_consolidated?: number | null;
			linked_consolidated?: number | null;
			post_approved?: number | null;
			code_review_commit_approved?: number | null;
			membership_request_accepted?: number | null;
			membership_request_consolidated?: number | null;
			bookmark_reminder?: number | null;
			reaction?: number | null;
			votes_released?: number | null;
			event_reminder?: number | null;
			event_invitation?: number | null;
			chat_mention?: number | null;
			chat_message?: number | null;
			chat_invitation?: number | null;
			chat_group_mention?: number | null;
			chat_quoted?: number | null;
			chat_watched_thread?: number | null;
			upcoming_change_available?: number | null;
			upcoming_change_automatically_promoted?: number | null;
			assigned?: number | null;
			question_answer_user_commented?: number | null;
			following?: number | null;
			following_created_topic?: number | null;
			following_replied?: number | null;
			circles_activity?: number | null;
			boost?: number | null;
			suggested_edit_created?: number | null;
			suggested_edit_accepted?: number | null;
			live_invitation?: number | null;
		} | null;
		post_types?: {
			regular?: number | null;
			moderator_action?: number | null;
			small_action?: number | null;
			whisper?: number | null;
		} | null;
		trust_levels?: {
			newuser?: number | null;
			basic?: number | null;
			member?: number | null;
			regular?: number | null;
			leader?: number | null;
		} | null;
		user_tips?: {
			first_notification?: number | null;
			topic_timeline?: number | null;
			post_menu?: number | null;
			topic_notification_levels?: number | null;
			suggested_topics?: number | null;
		} | null;
		groups?: Array<{
			id?: number | null;
			name?: string | null;
			full_name?: string | null;
			display_name?: string | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			automatic?: boolean | null;
		}> | null;
		filters?: Array<DiscourseJsonValue> | null;
		anonymous_list_filters?: Array<DiscourseJsonValue> | null;
		homepage_choices?: Array<DiscourseJsonValue> | null;
		homepage_options?: Array<{
			id?: string | null;
			path?: string | null;
			server_side?: boolean | null;
		}> | null;
		periods?: Array<DiscourseJsonValue> | null;
		top_menu_items?: Array<DiscourseJsonValue> | null;
		anonymous_top_menu_items?: Array<DiscourseJsonValue> | null;
		uncategorized_category_id?: number | null;
		user_field_max_length?: number | null;
		post_action_types?: Array<{
			id?: number | null;
			name_key?: string | null;
			name?: string | null;
			description?: string | null;
			short_description?: string | null;
			is_flag?: boolean | null;
			require_message?: boolean | null;
			enabled?: boolean | null;
			applies_to?: Array<DiscourseJsonValue> | null;
			is_used?: boolean | null;
			position?: number | null;
			auto_action_type?: boolean | null;
			system?: boolean | null;
		}> | null;
		topic_flag_types?: Array<{
			id?: number | null;
			name_key?: string | null;
			name?: string | null;
			description?: string | null;
			short_description?: string | null;
			is_flag?: boolean | null;
			require_message?: boolean | null;
			enabled?: boolean | null;
			applies_to?: Array<DiscourseJsonValue> | null;
			is_used?: boolean | null;
			position?: number | null;
			auto_action_type?: boolean | null;
			system?: boolean | null;
		}> | null;
		can_create_tag?: boolean | null;
		can_search?: boolean | null;
		can_tag_topics?: boolean | null;
		can_tag_pms?: boolean | null;
		tags_filter_regexp?: string | null;
		top_tags?: Array<{
			id?: number | null;
			name?: string | null;
			slug?: string | null;
		}> | null;
		wizard_required?: boolean | null;
		can_associate_groups?: boolean | null;
		email_configured?: boolean | null;
		upcoming_changes_with_css?: Array<string> | null;
		topic_featured_link_allowed_category_ids?: Array<DiscourseJsonValue> | null;
		user_themes?: Array<{
			theme_id?: number | null;
			name?: string | null;
			default?: boolean | null;
			color_scheme_id?: number | null;
			dark_color_scheme_id?: number | null;
			only_theme_color_schemes?: boolean | null;
		}> | null;
		user_color_schemes?: Array<{
			id?: number | null;
			name?: string | null;
			is_dark?: boolean | null;
			theme_id?: number | null;
			colors?: Array<DiscourseJsonValue> | null;
		}> | null;
		default_light_color_scheme?: Record<string, DiscourseJsonValue> | null;
		default_dark_color_scheme?: Record<string, DiscourseJsonValue> | null;
		censored_regexp?: Array<Record<string, DiscourseJsonValue>> | null;
		custom_emoji_translation?: Record<string, DiscourseJsonValue> | null;
		watched_words_replace?: string | null;
		watched_words_link?: string | null;
		markdown_additional_options?: Record<string, DiscourseJsonValue> | null;
		hashtag_configurations?: Record<string, DiscourseJsonValue> | null;
		hashtag_icons?: Record<string, DiscourseJsonValue> | null;
		displayed_about_plugin_stat_groups?: Array<DiscourseJsonValue> | null;
		categories?: Array<{
			id?: number | null;
			name?: string | null;
			color?: string | null;
			text_color?: string | null;
			style_type?: string | null;
			emoji?: string | null;
			icon?: string | null;
			slug?: string | null;
			topic_count?: number | null;
			post_count?: number | null;
			position?: number | null;
			description?: string | null;
			description_text?: string | null;
			description_excerpt?: string | null;
			topic_url?: string | null;
			read_restricted?: boolean | null;
			permission?: number | null;
			notification_level?: number | null;
			topic_template?: string | null;
			topic_title_placeholder?: string | null;
			has_children?: boolean | null;
			subcategory_count?: number | null;
			sort_order?: string | null;
			sort_ascending?: string | null;
			show_subcategory_list?: boolean | null;
			num_featured_topics?: number | null;
			default_view?: string | null;
			subcategory_list_style?: string | null;
			default_top_period?: string | null;
			default_list_filter?: string | null;
			minimum_required_tags?: number | null;
			navigate_to_first_post_after_read?: boolean | null;
			allow_global_tags?: boolean | null;
			required_tag_groups?: Array<{
				min_count?: number | null;
			}> | null;
			read_only_banner?: string | null;
			uploaded_logo?: string | null;
			uploaded_logo_dark?: string | null;
			uploaded_background?: string | null;
			uploaded_background_dark?: string | null;
			can_edit?: boolean | null;
			custom_fields?: Record<string, DiscourseJsonValue> | null;
			parent_category_id?: number | null;
			form_template_ids?: Array<DiscourseJsonValue> | null;
			category_types?: Record<string, DiscourseJsonValue> | null;
		}> | null;
		archetypes?: Array<{
			id?: string | null;
			name?: string | null;
			options?: Array<DiscourseJsonValue> | null;
		}> | null;
		user_fields?: Array<DiscourseJsonValue> | null;
		auth_providers?: Array<DiscourseJsonValue> | null;
		whispers_allowed_groups_names?: Array<DiscourseJsonValue> | null;
		denied_emojis?: Array<DiscourseJsonValue> | null;
		valid_flag_applies_to_types?: Array<DiscourseJsonValue> | null;
		navigation_menu_site_top_tags?: Array<DiscourseJsonValue> | null;
		full_name_required_for_signup?: boolean | null;
		full_name_visible_in_signup?: boolean | null;
		admin_config_login_routes?: Array<DiscourseJsonValue> | null;
		access_control?: {
			mandatory_acl?: Record<string, DiscourseJsonValue> | null;
			banned_acl?: Record<string, DiscourseJsonValue> | null;
		} | null;
		permanent_upcoming_change_names?: Array<string> | null;
		category_types?: Array<{
			id?: string | null;
			name?: string | null;
			title?: string | null;
			description?: string | null;
			icon?: string | null;
			svg_icon?: string | null;
			available?: boolean | null;
			visible?: boolean | null;
			configuration_schema?: Record<string, DiscourseJsonValue> | null;
		}> | null;
	};
	'site.getBasicInfo': {
		logo_url?: string | null;
		logo_small_url?: string | null;
		apple_touch_icon_url?: string | null;
		favicon_url?: string | null;
		title?: string | null;
		description?: string | null;
		header_primary_color?: string | null;
		header_background_color?: string | null;
		login_required?: boolean | null;
		locale?: string | null;
		include_in_discourse_discover?: boolean | null;
		mobile_logo_url?: string | null;
	};
	'tags.createGroup': {
		tag_group?: {
			id?: number | null;
			name?: string | null;
			tags?: Array<{
				id?: number | null;
				name?: string | null;
				slug?: string | null;
			}> | null;
			parent_tag?: Array<{
				id?: number | null;
				name?: string | null;
				slug?: string | null;
			}> | null;
			one_per_topic?: boolean | null;
			permissions?: Record<string, DiscourseJsonValue> | null;
		} | null;
	};
	'tags.get': {
		users?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		}> | null;
		primary_groups?: Array<DiscourseJsonValue> | null;
		topic_list?: {
			can_create_topic?: boolean | null;
			draft?: string | null;
			draft_key?: string | null;
			draft_sequence?: number | null;
			per_page?: number | null;
			tags?: Array<{
				id?: number | null;
				name?: string | null;
				topic_count?: number | null;
				staff?: boolean | null;
			}> | null;
			topics?: Array<{
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
				reply_count?: number | null;
				highest_post_number?: number | null;
				image_url?: string | null;
				created_at?: string | null;
				last_posted_at?: string | null;
				bumped?: boolean | null;
				bumped_at?: string | null;
				archetype?: string | null;
				unseen?: boolean | null;
				last_read_post_number?: number | null;
				unread_posts?: number | null;
				pinned?: boolean | null;
				unpinned?: string | null;
				visible?: boolean | null;
				closed?: boolean | null;
				archived?: boolean | null;
				notification_level?: number | null;
				bookmarked?: boolean | null;
				liked?: boolean | null;
				tags?: Array<DiscourseJsonValue> | null;
				views?: number | null;
				like_count?: number | null;
				has_summary?: boolean | null;
				last_poster_username?: string | null;
				category_id?: number | null;
				pinned_globally?: boolean | null;
				featured_link?: string | null;
				posters?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
			}> | null;
		} | null;
	};
	'tags.getGroup': {
		tag_group?: {
			id?: number | null;
			name?: string | null;
			tag_names?: Array<DiscourseJsonValue> | null;
			parent_tag_name?: Array<DiscourseJsonValue> | null;
			one_per_topic?: boolean | null;
			permissions?: {
				everyone?: number | null;
			} | null;
		} | null;
	};
	'tags.list': {
		tags?: Array<{
			id?: number | null;
			text?: string | null;
			name?: string | null;
			count?: number | null;
			pm_count?: number | null;
			target_tag?: string | null;
		}> | null;
		extras?: {
			categories?: Array<DiscourseJsonValue> | null;
		} | null;
	};
	'tags.listGroups': {
		tag_groups?: Array<{
			id?: number | null;
			name?: string | null;
			tags?: Array<{
				id?: number | null;
				name?: string | null;
				slug?: string | null;
			}> | null;
			parent_tag?: Array<{
				id?: number | null;
				name?: string | null;
				slug?: string | null;
			}> | null;
			one_per_topic?: boolean | null;
			permissions?: { [key: string]: number } | null;
		}> | null;
	};
	'tags.updateGroup': {
		success?: string | null;
		tag_group?: {
			id?: number | null;
			name?: string | null;
			tag_names?: Array<DiscourseJsonValue> | null;
			parent_tag_name?: Array<DiscourseJsonValue> | null;
			one_per_topic?: boolean | null;
			permissions?: {
				everyone?: number | null;
			} | null;
		} | null;
	};
	'topics.bookmark': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'topics.createTimer': {
		success?: string | null;
		execute_at?: string | null;
		duration?: string | null;
		based_on_last_post?: boolean | null;
		closed?: boolean | null;
		category_id?: number | null;
	};
	'topics.delete': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'topics.get': {
		post_stream?: {
			posts?: Array<{
				id?: number | null;
				name?: string | null;
				username?: string | null;
				avatar_template?: string | null;
				created_at?: string | null;
				cooked?: string | null;
				post_number?: number | null;
				post_type?: number | null;
				updated_at?: string | null;
				reply_count?: number | null;
				reply_to_post_number?: string | null;
				quote_count?: number | null;
				incoming_link_count?: number | null;
				reads?: number | null;
				readers_count?: number | null;
				score?: number | null;
				yours?: boolean | null;
				topic_id?: number | null;
				topic_slug?: string | null;
				display_username?: string | null;
				primary_group_name?: string | null;
				flair_name?: string | null;
				flair_url?: string | null;
				flair_bg_color?: string | null;
				flair_color?: string | null;
				version?: number | null;
				can_edit?: boolean | null;
				can_delete?: boolean | null;
				can_recover?: boolean | null;
				can_see_hidden_post?: boolean | null;
				can_wiki?: boolean | null;
				link_counts?: Array<{
					url?: string | null;
					internal?: boolean | null;
					reflection?: boolean | null;
					title?: string | null;
					clicks?: number | null;
				}> | null;
				read?: boolean | null;
				user_title?: string | null;
				bookmarked?: boolean | null;
				actions_summary?: Array<{
					id?: number | null;
					can_act?: boolean | null;
				}> | null;
				moderator?: boolean | null;
				admin?: boolean | null;
				staff?: boolean | null;
				user_id?: number | null;
				hidden?: boolean | null;
				trust_level?: number | null;
				deleted_at?: string | null;
				user_deleted?: boolean | null;
				edit_reason?: string | null;
				can_view_edit_history?: boolean | null;
				wiki?: boolean | null;
				reviewable_id?: number | null;
				reviewable_score_count?: number | null;
				reviewable_score_pending_count?: number | null;
			}> | null;
			stream?: Array<DiscourseJsonValue> | null;
		} | null;
		timeline_lookup?: Array<DiscourseJsonValue> | null;
		suggested_topics?: Array<{
			id?: number | null;
			title?: string | null;
			fancy_title?: string | null;
			slug?: string | null;
			posts_count?: number | null;
			reply_count?: number | null;
			highest_post_number?: number | null;
			image_url?: string | null;
			created_at?: string | null;
			last_posted_at?: string | null;
			bumped?: boolean | null;
			bumped_at?: string | null;
			archetype?: string | null;
			unseen?: boolean | null;
			pinned?: boolean | null;
			unpinned?: string | null;
			excerpt?: string | null;
			visible?: boolean | null;
			closed?: boolean | null;
			archived?: boolean | null;
			bookmarked?: boolean | null;
			liked?: boolean | null;
			tags?: Array<{
				id?: number | null;
				name?: string | null;
				slug?: string | null;
			}> | null;
			tags_descriptions?: Record<string, DiscourseJsonValue> | null;
			like_count?: number | null;
			views?: number | null;
			category_id?: number | null;
			featured_link?: string | null;
			posters?: Array<{
				extras?: string | null;
				description?: string | null;
				user?: {
					id?: number | null;
					username?: string | null;
					name?: string | null;
					avatar_template?: string | null;
				} | null;
			}> | null;
		}> | null;
		tags?: Array<{
			id?: number | null;
			name?: string | null;
			slug?: string | null;
		}> | null;
		tags_descriptions?: Record<string, DiscourseJsonValue> | null;
		id?: number | null;
		title?: string | null;
		fancy_title?: string | null;
		posts_count?: number | null;
		created_at?: string | null;
		views?: number | null;
		reply_count?: number | null;
		like_count?: number | null;
		last_posted_at?: string | null;
		visible?: boolean | null;
		closed?: boolean | null;
		archived?: boolean | null;
		has_summary?: boolean | null;
		archetype?: string | null;
		slug?: string | null;
		category_id?: number | null;
		word_count?: number | null;
		deleted_at?: string | null;
		user_id?: number | null;
		featured_link?: string | null;
		pinned_globally?: boolean | null;
		pinned_at?: string | null;
		pinned_until?: string | null;
		image_url?: string | null;
		slow_mode_seconds?: number | null;
		draft?: string | null;
		draft_key?: string | null;
		draft_sequence?: number | null;
		unpinned?: string | null;
		pinned?: boolean | null;
		current_post_number?: number | null;
		highest_post_number?: number | null;
		deleted_by?: string | null;
		has_deleted?: boolean | null;
		actions_summary?: Array<{
			id?: number | null;
			count?: number | null;
			hidden?: boolean | null;
			can_act?: boolean | null;
		}> | null;
		chunk_size?: number | null;
		bookmarked?: boolean | null;
		bookmarks?: Array<DiscourseJsonValue> | null;
		topic_timer?: string | null;
		message_bus_last_id?: number | null;
		participant_count?: number | null;
		show_read_indicator?: boolean | null;
		thumbnails?: string | null;
		slow_mode_enabled_until?: string | null;
		details?: {
			can_edit?: boolean | null;
			notification_level?: number | null;
			can_move_posts?: boolean | null;
			can_delete?: boolean | null;
			can_remove_allowed_users?: boolean | null;
			can_create_post?: boolean | null;
			can_reply_as_new_topic?: boolean | null;
			can_invite_to?: boolean | null;
			can_invite_via_email?: boolean | null;
			can_flag_topic?: boolean | null;
			can_convert_topic?: boolean | null;
			can_review_topic?: boolean | null;
			can_close_topic?: boolean | null;
			can_archive_topic?: boolean | null;
			can_split_merge_topic?: boolean | null;
			can_edit_staff_notes?: boolean | null;
			can_toggle_topic_visibility?: boolean | null;
			can_pin_unpin_topic?: boolean | null;
			can_banner_topic?: boolean | null;
			can_moderate_category?: boolean | null;
			can_remove_self_id?: number | null;
			participants?: Array<{
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
				post_count?: number | null;
				primary_group_name?: string | null;
				flair_name?: string | null;
				flair_url?: string | null;
				flair_color?: string | null;
				flair_bg_color?: string | null;
				flair_group_id?: number | null;
				admin?: boolean | null;
				moderator?: boolean | null;
				trust_level?: number | null;
			}> | null;
			created_by?: {
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
			} | null;
			last_poster?: {
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
			} | null;
		} | null;
	};
	'topics.getByExternalId': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'topics.getPosts': {
		post_stream?: {
			posts?: Array<{
				id?: number | null;
				name?: string | null;
				username?: string | null;
				avatar_template?: string | null;
				created_at?: string | null;
				cooked?: string | null;
				post_number?: number | null;
				post_type?: number | null;
				updated_at?: string | null;
				reply_count?: number | null;
				reply_to_post_number?: string | null;
				quote_count?: number | null;
				incoming_link_count?: number | null;
				reads?: number | null;
				readers_count?: number | null;
				score?: number | null;
				yours?: boolean | null;
				topic_id?: number | null;
				topic_slug?: string | null;
				display_username?: string | null;
				primary_group_name?: string | null;
				flair_name?: string | null;
				flair_url?: string | null;
				flair_bg_color?: string | null;
				flair_color?: string | null;
				version?: number | null;
				can_edit?: boolean | null;
				can_delete?: boolean | null;
				can_recover?: boolean | null;
				can_wiki?: boolean | null;
				read?: boolean | null;
				user_title?: string | null;
				actions_summary?: Array<{
					id?: number | null;
					can_act?: boolean | null;
				}> | null;
				moderator?: boolean | null;
				admin?: boolean | null;
				staff?: boolean | null;
				user_id?: number | null;
				hidden?: boolean | null;
				trust_level?: number | null;
				deleted_at?: string | null;
				user_deleted?: boolean | null;
				edit_reason?: string | null;
				can_view_edit_history?: boolean | null;
				wiki?: boolean | null;
				reviewable_id?: number | null;
				reviewable_score_count?: number | null;
				reviewable_score_pending_count?: number | null;
			}> | null;
		} | null;
		id?: number | null;
	};
	'topics.invite': {
		user?: {
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		} | null;
	};
	'topics.inviteGroup': {
		group?: {
			id?: number | null;
			name?: string | null;
		} | null;
	};
	'topics.listLatest': {
		users?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		}> | null;
		primary_groups?: Array<DiscourseJsonValue> | null;
		topic_list?: {
			can_create_topic?: boolean | null;
			draft?: string | null;
			draft_key?: string | null;
			draft_sequence?: number | null;
			per_page?: number | null;
			topics?: Array<{
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
				reply_count?: number | null;
				highest_post_number?: number | null;
				image_url?: string | null;
				created_at?: string | null;
				last_posted_at?: string | null;
				bumped?: boolean | null;
				bumped_at?: string | null;
				archetype?: string | null;
				unseen?: boolean | null;
				last_read_post_number?: number | null;
				unread_posts?: number | null;
				pinned?: boolean | null;
				unpinned?: string | null;
				visible?: boolean | null;
				closed?: boolean | null;
				archived?: boolean | null;
				notification_level?: number | null;
				bookmarked?: boolean | null;
				liked?: boolean | null;
				views?: number | null;
				like_count?: number | null;
				has_summary?: boolean | null;
				last_poster_username?: string | null;
				category_id?: number | null;
				op_like_count?: number | null;
				pinned_globally?: boolean | null;
				featured_link?: string | null;
				posters?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
			}> | null;
		} | null;
	};
	'topics.listTop': {
		users?: Array<{
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		}> | null;
		primary_groups?: Array<DiscourseJsonValue> | null;
		topic_list?: {
			can_create_topic?: boolean | null;
			draft?: string | null;
			draft_key?: string | null;
			draft_sequence?: number | null;
			for_period?: string | null;
			per_page?: number | null;
			topics?: Array<{
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
				reply_count?: number | null;
				highest_post_number?: number | null;
				image_url?: string | null;
				created_at?: string | null;
				last_posted_at?: string | null;
				bumped?: boolean | null;
				bumped_at?: string | null;
				archetype?: string | null;
				unseen?: boolean | null;
				last_read_post_number?: number | null;
				unread_posts?: number | null;
				pinned?: boolean | null;
				unpinned?: boolean | null;
				visible?: boolean | null;
				closed?: boolean | null;
				archived?: boolean | null;
				notification_level?: number | null;
				bookmarked?: boolean | null;
				liked?: boolean | null;
				views?: number | null;
				like_count?: number | null;
				has_summary?: boolean | null;
				last_poster_username?: string | null;
				category_id?: number | null;
				op_like_count?: number | null;
				pinned_globally?: boolean | null;
				featured_link?: string | null;
				posters?: Array<{
					extras?: string | null;
					description?: string | null;
					user_id?: number | null;
					primary_group_id?: number | null;
				}> | null;
			}> | null;
		} | null;
	};
	'topics.setNotificationLevel': {
		success?: string | null;
	};
	'topics.update': {
		basic_topic?: {
			id?: number | null;
			title?: string | null;
			fancy_title?: string | null;
			slug?: string | null;
			posts_count?: number | null;
		} | null;
	};
	'topics.updateStatus': {
		success?: string | null;
		topic_status_update?: string | null;
	};
	'topics.updateTimestamp': {
		success?: string | null;
	};
	'uploads.abortMultipart': {
		success?: string | null;
	};
	'uploads.batchPresignMultipartParts': {
		/** The presigned URLs for each part number, which has the part numbers as keys. */
		presigned_urls?: Record<string, DiscourseJsonValue> | null;
	};
	'uploads.completeExternal': {
		id?: number | null;
		url?: string | null;
		original_filename?: string | null;
		filesize?: number | null;
		width?: number | null;
		height?: number | null;
		thumbnail_width?: number | null;
		thumbnail_height?: number | null;
		extension?: string | null;
		short_url?: string | null;
		short_path?: string | null;
		retain_hours?: string | null;
		human_filesize?: string | null;
		dominant_color?: string | null;
		thumbnail?: {
			id?: number | null;
			upload_id?: number | null;
			url?: string | null;
			extension?: string | null;
			width?: number | null;
			height?: number | null;
			filesize?: number | null;
		} | null;
		optimized_video?: {
			id?: number | null;
			upload_id?: number | null;
			url?: string | null;
			extension?: string | null;
			filesize?: number | null;
			sha1?: string | null;
			original_filename?: string | null;
		} | null;
	};
	'uploads.completeMultipart': {
		id?: number | null;
		url?: string | null;
		original_filename?: string | null;
		filesize?: number | null;
		width?: number | null;
		height?: number | null;
		thumbnail_width?: number | null;
		thumbnail_height?: number | null;
		extension?: string | null;
		short_url?: string | null;
		short_path?: string | null;
		retain_hours?: string | null;
		human_filesize?: string | null;
		dominant_color?: string | null;
		thumbnail?: {
			id?: number | null;
			upload_id?: number | null;
			url?: string | null;
			extension?: string | null;
			width?: number | null;
			height?: number | null;
			filesize?: number | null;
		} | null;
		optimized_video?: {
			id?: number | null;
			upload_id?: number | null;
			url?: string | null;
			extension?: string | null;
			filesize?: number | null;
			sha1?: string | null;
			original_filename?: string | null;
		} | null;
	};
	'uploads.create': {
		id?: number | null;
		url?: string | null;
		original_filename?: string | null;
		filesize?: number | null;
		width?: number | null;
		height?: number | null;
		thumbnail_width?: number | null;
		thumbnail_height?: number | null;
		extension?: string | null;
		short_url?: string | null;
		short_path?: string | null;
		retain_hours?: string | null;
		human_filesize?: string | null;
		dominant_color?: string | null;
		thumbnail?: {
			id?: number | null;
			upload_id?: number | null;
			url?: string | null;
			extension?: string | null;
			width?: number | null;
			height?: number | null;
			filesize?: number | null;
		} | null;
		optimized_video?: {
			id?: number | null;
			upload_id?: number | null;
			url?: string | null;
			extension?: string | null;
			filesize?: number | null;
			sha1?: string | null;
			original_filename?: string | null;
		} | null;
	};
	'uploads.createMultipart': {
		/** The path of the temporary file on the external storage service. */
		key?: string | null;
		/** The identifier of the multipart upload in the external storage provider. This is the multipart upload_id in AWS S3. */
		external_upload_identifier?: string | null;
		/** A unique string that identifies the external upload. This must be stored and then sent in the /complete-multipart and /batch-presign-multipart-parts endpoints. */
		unique_identifier?: string | null;
	};
	'uploads.generatePresignedPut': {
		/** The path of the temporary file on the external storage service. */
		key?: string | null;
		/** A presigned PUT URL which must be used to upload the file binary blob to. */
		url?: string | null;
		/** A map of headers that must be sent with the PUT request. */
		signed_headers?: Record<string, DiscourseJsonValue> | null;
		/** A unique string that identifies the external upload. This must be stored and then sent in the /complete-external-upload endpoint to complete the direct upload. */
		unique_identifier?: string | null;
	};
	'users.activate': {
		success?: string | null;
	};
	'users.adminGet': {
		id?: number | null;
		username?: string | null;
		name?: string | null;
		avatar_template?: string | null;
		active?: boolean | null;
		admin?: boolean | null;
		/** Whether the bot is interactive. Only present for bot users. */
		interactive_bot?: boolean | null;
		moderator?: boolean | null;
		last_seen_at?: string | null;
		last_emailed_at?: string | null;
		created_at?: string | null;
		last_seen_age?: number | null;
		last_emailed_age?: number | null;
		created_at_age?: number | null;
		trust_level?: number | null;
		manual_locked_trust_level?: string | null;
		title?: string | null;
		time_read?: number | null;
		staged?: boolean | null;
		days_visited?: number | null;
		posts_read_count?: number | null;
		topics_entered?: number | null;
		post_count?: number | null;
		associated_accounts?: Array<DiscourseJsonValue> | null;
		can_send_activation_email?: boolean | null;
		can_activate?: boolean | null;
		can_deactivate?: boolean | null;
		can_change_trust_level?: boolean | null;
		ip_address?: string | null;
		registration_ip_address?: string | null;
		can_grant_admin?: boolean | null;
		can_revoke_admin?: boolean | null;
		can_grant_moderation?: boolean | null;
		can_revoke_moderation?: boolean | null;
		can_impersonate?: boolean | null;
		like_count?: number | null;
		like_given_count?: number | null;
		topic_count?: number | null;
		flags_given_count?: number | null;
		flags_received_count?: number | null;
		private_topics_count?: number | null;
		can_delete_all_posts?: boolean | null;
		can_be_deleted?: boolean | null;
		can_be_anonymized?: boolean | null;
		can_be_merged?: boolean | null;
		full_suspend_reason?: string | null;
		latest_export?: Record<string, DiscourseJsonValue> | null;
		full_silence_reason?: string | null;
		silence_reason?: string | null;
		post_edits_count?: number | null;
		primary_group_id?: number | null;
		badge_count?: number | null;
		warnings_received_count?: number | null;
		bounce_score?: number | null;
		reset_bounce_score_after?: string | null;
		can_view_action_logs?: boolean | null;
		can_disable_second_factor?: boolean | null;
		can_delete_sso_record?: boolean | null;
		api_key_count?: number | null;
		similar_users_count?: number | null;
		single_sign_on_record?: string | null;
		approved_by?: {
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
		} | null;
		suspended_by?: Record<string, DiscourseJsonValue> | null;
		silenced_by?: Record<string, DiscourseJsonValue> | null;
		penalty_counts?: {
			silenced?: number | null;
			suspended?: number | null;
		} | null;
		next_penalty?: string | null;
		tl3_requirements?: {
			time_period?: number | null;
			requirements_met?: boolean | null;
			requirements_lost?: boolean | null;
			trust_level_locked?: boolean | null;
			on_grace_period?: boolean | null;
			days_visited?: number | null;
			min_days_visited?: number | null;
			num_topics_replied_to?: number | null;
			min_topics_replied_to?: number | null;
			topics_viewed?: number | null;
			min_topics_viewed?: number | null;
			posts_read?: number | null;
			min_posts_read?: number | null;
			topics_viewed_all_time?: number | null;
			min_topics_viewed_all_time?: number | null;
			posts_read_all_time?: number | null;
			min_posts_read_all_time?: number | null;
			num_flagged_posts?: number | null;
			max_flagged_posts?: number | null;
			num_flagged_by_users?: number | null;
			max_flagged_by_users?: number | null;
			num_likes_given?: number | null;
			min_likes_given?: number | null;
			num_likes_received?: number | null;
			min_likes_received?: number | null;
			num_likes_received_days?: number | null;
			min_likes_received_days?: number | null;
			num_likes_received_users?: number | null;
			min_likes_received_users?: number | null;
			penalty_counts?: {
				silenced?: number | null;
				suspended?: number | null;
				total?: number | null;
			} | null;
		} | null;
		groups?: Array<{
			id?: number | null;
			automatic?: boolean | null;
			name?: string | null;
			display_name?: string | null;
			user_count?: number | null;
			mentionable_level?: number | null;
			messageable_level?: number | null;
			visibility_level?: number | null;
			primary_group?: boolean | null;
			title?: string | null;
			grant_trust_level?: string | null;
			incoming_email?: string | null;
			has_messages?: boolean | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			flair_group_id?: number | null;
			bio_raw?: string | null;
			bio_cooked?: string | null;
			bio_excerpt?: string | null;
			public_admission?: boolean | null;
			public_exit?: boolean | null;
			allow_membership_requests?: boolean | null;
			full_name?: string | null;
			default_notification_level?: number | null;
			membership_request_template?: string | null;
			members_visibility_level?: number | null;
			can_see_members?: boolean | null;
			can_admin_group?: boolean | null;
			publish_read_state?: boolean | null;
		}> | null;
		external_ids?: Record<string, DiscourseJsonValue> | null;
		include_ip?: boolean | null;
		upcoming_changes_stats?: Array<{
			name?: string | null;
			humanized_name?: string | null;
			description?: string | null;
			enabled?: boolean | null;
			specific_groups?: Array<string> | null;
			reason?: string | null;
		}> | null;
	};
	'users.adminList': Array<{
		id?: number | null;
		username?: string | null;
		name?: string | null;
		avatar_template?: string | null;
		email?: string | null;
		secondary_emails?: Array<DiscourseJsonValue> | null;
		active?: boolean | null;
		admin?: boolean | null;
		moderator?: boolean | null;
		last_seen_at?: string | null;
		last_emailed_at?: string | null;
		created_at?: string | null;
		last_seen_age?: number | null;
		last_emailed_age?: number | null;
		created_at_age?: number | null;
		trust_level?: number | null;
		manual_locked_trust_level?: string | null;
		title?: string | null;
		time_read?: number | null;
		staged?: boolean | null;
		days_visited?: number | null;
		posts_read_count?: number | null;
		topics_entered?: number | null;
		post_count?: number | null;
	}>;
	'users.adminListByFlag': Array<{
		id?: number | null;
		username?: string | null;
		name?: string | null;
		avatar_template?: string | null;
		email?: string | null;
		secondary_emails?: Array<DiscourseJsonValue> | null;
		active?: boolean | null;
		admin?: boolean | null;
		moderator?: boolean | null;
		last_seen_at?: string | null;
		last_emailed_at?: string | null;
		created_at?: string | null;
		last_seen_age?: number | null;
		last_emailed_age?: number | null;
		created_at_age?: number | null;
		trust_level?: number | null;
		manual_locked_trust_level?: string | null;
		title?: string | null;
		time_read?: number | null;
		staged?: boolean | null;
		days_visited?: number | null;
		posts_read_count?: number | null;
		topics_entered?: number | null;
		post_count?: number | null;
	}>;
	'users.anonymize': {
		success?: string | null;
		username?: string | null;
	};
	'users.changePassword': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'users.create': {
		success?: boolean | null;
		active?: boolean | null;
		message?: string | null;
		user_id?: number | null;
	};
	'users.deactivate': {
		success?: string | null;
	};
	'users.delete': {
		deleted?: boolean | null;
	};
	'users.get': {
		user_badges?: Array<DiscourseJsonValue> | null;
		user?: {
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
			last_posted_at?: string | null;
			last_seen_at?: string | null;
			created_at?: string | null;
			ignored?: boolean | null;
			muted?: boolean | null;
			can_ignore_user?: boolean | null;
			can_ignore_users?: boolean | null;
			can_mute_user?: boolean | null;
			can_mute_users?: boolean | null;
			can_send_private_messages?: boolean | null;
			can_send_private_message_to_user?: boolean | null;
			trust_level?: number | null;
			moderator?: boolean | null;
			admin?: boolean | null;
			title?: string | null;
			badge_count?: number | null;
			second_factor_backup_enabled?: boolean | null;
			user_fields?: {
				'1'?: string | null;
				'2'?: string | null;
			} | null;
			custom_fields?: {
				first_name?: string | null;
			} | null;
			time_read?: number | null;
			recent_time_read?: number | null;
			primary_group_id?: number | null;
			primary_group_name?: string | null;
			flair_group_id?: number | null;
			flair_name?: string | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			featured_topic?: {
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
			} | null;
			staged?: boolean | null;
			can_edit?: boolean | null;
			can_edit_avatar?: boolean | null;
			can_upload_avatar?: boolean | null;
			can_edit_username?: boolean | null;
			can_edit_email?: boolean | null;
			can_edit_name?: boolean | null;
			uploaded_avatar_id?: number | null;
			has_title_badges?: boolean | null;
			pending_count?: number | null;
			pending_posts_count?: number | null;
			profile_view_count?: number | null;
			second_factor_enabled?: boolean | null;
			can_upload_profile_header?: boolean | null;
			can_upload_user_card_background?: boolean | null;
			post_count?: number | null;
			topic_count?: number | null;
			can_be_deleted?: boolean | null;
			can_delete_all_posts?: boolean | null;
			staff_only_settings?: Array<string> | null;
			locale?: string | null;
			muted_category_ids?: Array<DiscourseJsonValue> | null;
			regular_category_ids?: Array<DiscourseJsonValue> | null;
			watched_tags?: Array<DiscourseJsonValue> | null;
			watching_first_post_tags?: Array<DiscourseJsonValue> | null;
			tracked_tags?: Array<DiscourseJsonValue> | null;
			muted_tags?: Array<DiscourseJsonValue> | null;
			tracked_category_ids?: Array<DiscourseJsonValue> | null;
			watched_category_ids?: Array<DiscourseJsonValue> | null;
			watched_first_post_category_ids?: Array<DiscourseJsonValue> | null;
			system_avatar_upload_id?: string | null;
			system_avatar_template?: string | null;
			associated_account_avatars?: Array<{
				id?: number | null;
				name?: string | null;
				upload_id?: number | null;
				avatar_template?: string | null;
			}> | null;
			selected_user_associated_account_id?: number | null;
			muted_usernames?: Array<DiscourseJsonValue> | null;
			ignored_usernames?: Array<DiscourseJsonValue> | null;
			allowed_pm_usernames?: Array<DiscourseJsonValue> | null;
			mailing_list_posts_per_day?: number | null;
			can_change_bio?: boolean | null;
			can_change_location?: boolean | null;
			can_change_website?: boolean | null;
			can_change_tracking_preferences?: boolean | null;
			user_api_keys?: string | null;
			user_passkeys?: Array<DiscourseJsonValue> | null;
			sidebar_tags?: Array<DiscourseJsonValue> | null;
			sidebar_category_ids?: Array<DiscourseJsonValue> | null;
			display_sidebar_tags?: boolean | null;
			can_pick_theme_with_custom_homepage?: boolean | null;
			user_auth_tokens?: Array<{
				id?: number | null;
				client_ip?: string | null;
				location?: string | null;
				browser?: string | null;
				device?: string | null;
				os?: string | null;
				icon?: string | null;
				created_at?: string | null;
				seen_at?: string | null;
				is_active?: boolean | null;
			}> | null;
			user_notification_schedule?: {
				enabled?: boolean | null;
				day_0_start_time?: number | null;
				day_0_end_time?: number | null;
				day_1_start_time?: number | null;
				day_1_end_time?: number | null;
				day_2_start_time?: number | null;
				day_2_end_time?: number | null;
				day_3_start_time?: number | null;
				day_3_end_time?: number | null;
				day_4_start_time?: number | null;
				day_4_end_time?: number | null;
				day_5_start_time?: number | null;
				day_5_end_time?: number | null;
				day_6_start_time?: number | null;
				day_6_end_time?: number | null;
			} | null;
			use_logo_small_as_avatar?: boolean | null;
			featured_user_badge_ids?: Array<DiscourseJsonValue> | null;
			invited_by?: string | null;
			groups?: Array<{
				id?: number | null;
				automatic?: boolean | null;
				name?: string | null;
				display_name?: string | null;
				user_count?: number | null;
				mentionable_level?: number | null;
				messageable_level?: number | null;
				visibility_level?: number | null;
				primary_group?: boolean | null;
				title?: string | null;
				grant_trust_level?: string | null;
				incoming_email?: string | null;
				has_messages?: boolean | null;
				flair_url?: string | null;
				flair_bg_color?: string | null;
				flair_color?: string | null;
				bio_raw?: string | null;
				bio_cooked?: string | null;
				bio_excerpt?: string | null;
				public_admission?: boolean | null;
				public_exit?: boolean | null;
				allow_membership_requests?: boolean | null;
				full_name?: string | null;
				default_notification_level?: number | null;
				membership_request_template?: string | null;
				members_visibility_level?: number | null;
				can_see_members?: boolean | null;
				can_admin_group?: boolean | null;
				publish_read_state?: boolean | null;
			}> | null;
			group_users?: Array<{
				group_id?: number | null;
				user_id?: number | null;
				notification_level?: number | null;
				owner?: boolean | null;
			}> | null;
			user_option?: {
				user_id?: number | null;
				mailing_list_mode?: boolean | null;
				mailing_list_mode_frequency?: number | null;
				email_digests?: boolean | null;
				email_level?: number | null;
				email_messages_level?: number | null;
				external_links_in_new_tab?: boolean | null;
				bookmark_auto_delete_preference?: number | null;
				color_scheme_id?: string | null;
				dark_scheme_id?: string | null;
				dynamic_favicon?: boolean | null;
				enable_quoting?: boolean | null;
				enable_smart_lists?: boolean | null;
				enable_markdown_monospace_font?: boolean | null;
				digest_after_minutes?: number | null;
				automatically_unpin_topics?: boolean | null;
				auto_track_topics_after_msecs?: number | null;
				notification_level_when_replying?: number | null;
				new_topic_duration_minutes?: number | null;
				email_previous_replies?: number | null;
				email_in_reply_to?: boolean | null;
				like_notification_frequency?: number | null;
				notify_on_linked_posts?: boolean | null;
				push_notification_level?: string | null;
				enable_upcoming_change_available_notifications?: boolean | null;
				include_tl0_in_digests?: boolean | null;
				theme_ids?: Array<DiscourseJsonValue> | null;
				theme_key_seq?: number | null;
				allow_private_messages?: boolean | null;
				enable_allowed_pm_users?: boolean | null;
				homepage_id?: string | null;
				hide_profile_and_presence?: boolean | null;
				hide_profile?: boolean | null;
				hide_presence?: boolean | null;
				text_size?: string | null;
				text_size_seq?: number | null;
				title_count_mode?: string | null;
				timezone?: string | null;
				skip_new_user_tips?: boolean | null;
				default_calendar?: string | null;
				oldest_search_log_date?: string | null;
				sidebar_link_to_filtered_list?: boolean | null;
				sidebar_show_count_of_new_items?: boolean | null;
				watched_precedence_over_muted?: boolean | null;
				seen_popups?: Array<DiscourseJsonValue> | null;
				composition_mode?: number | null;
				interface_color_mode?: number | null;
				automatically_translate?: boolean | null;
				understood_languages?: Array<string> | null;
				hidden_composer_toolbar_buttons?: Array<string> | null;
				show_original_content?: boolean | null;
				send_shortcut?: string | null;
			} | null;
		} | null;
	};
	'users.getByExternalId': {
		user_badges?: Array<DiscourseJsonValue> | null;
		user?: {
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
			last_posted_at?: string | null;
			last_seen_at?: string | null;
			created_at?: string | null;
			ignored?: boolean | null;
			muted?: boolean | null;
			can_ignore_user?: boolean | null;
			can_ignore_users?: boolean | null;
			can_mute_user?: boolean | null;
			can_mute_users?: boolean | null;
			can_send_private_messages?: boolean | null;
			can_send_private_message_to_user?: boolean | null;
			trust_level?: number | null;
			moderator?: boolean | null;
			admin?: boolean | null;
			title?: string | null;
			badge_count?: number | null;
			second_factor_backup_enabled?: boolean | null;
			user_fields?: {
				'1'?: string | null;
				'2'?: string | null;
			} | null;
			custom_fields?: {
				first_name?: string | null;
			} | null;
			time_read?: number | null;
			recent_time_read?: number | null;
			primary_group_id?: number | null;
			primary_group_name?: string | null;
			flair_group_id?: number | null;
			flair_name?: string | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			featured_topic?: {
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
			} | null;
			staged?: boolean | null;
			can_edit?: boolean | null;
			can_edit_avatar?: boolean | null;
			can_upload_avatar?: boolean | null;
			can_edit_username?: boolean | null;
			can_edit_email?: boolean | null;
			can_edit_name?: boolean | null;
			uploaded_avatar_id?: number | null;
			has_title_badges?: boolean | null;
			pending_count?: number | null;
			pending_posts_count?: number | null;
			profile_view_count?: number | null;
			second_factor_enabled?: boolean | null;
			can_upload_profile_header?: boolean | null;
			can_upload_user_card_background?: boolean | null;
			post_count?: number | null;
			topic_count?: number | null;
			can_be_deleted?: boolean | null;
			can_delete_all_posts?: boolean | null;
			staff_only_settings?: Array<string> | null;
			locale?: string | null;
			muted_category_ids?: Array<DiscourseJsonValue> | null;
			regular_category_ids?: Array<DiscourseJsonValue> | null;
			watched_tags?: Array<DiscourseJsonValue> | null;
			watching_first_post_tags?: Array<DiscourseJsonValue> | null;
			tracked_tags?: Array<DiscourseJsonValue> | null;
			muted_tags?: Array<DiscourseJsonValue> | null;
			tracked_category_ids?: Array<DiscourseJsonValue> | null;
			watched_category_ids?: Array<DiscourseJsonValue> | null;
			watched_first_post_category_ids?: Array<DiscourseJsonValue> | null;
			system_avatar_upload_id?: string | null;
			system_avatar_template?: string | null;
			associated_account_avatars?: Array<{
				id?: number | null;
				name?: string | null;
				upload_id?: number | null;
				avatar_template?: string | null;
			}> | null;
			selected_user_associated_account_id?: number | null;
			muted_usernames?: Array<DiscourseJsonValue> | null;
			ignored_usernames?: Array<DiscourseJsonValue> | null;
			allowed_pm_usernames?: Array<DiscourseJsonValue> | null;
			mailing_list_posts_per_day?: number | null;
			can_change_bio?: boolean | null;
			can_change_location?: boolean | null;
			can_change_website?: boolean | null;
			can_change_tracking_preferences?: boolean | null;
			user_api_keys?: string | null;
			user_passkeys?: Array<DiscourseJsonValue> | null;
			sidebar_tags?: Array<DiscourseJsonValue> | null;
			sidebar_category_ids?: Array<DiscourseJsonValue> | null;
			display_sidebar_tags?: boolean | null;
			can_pick_theme_with_custom_homepage?: boolean | null;
			user_auth_tokens?: Array<{
				id?: number | null;
				client_ip?: string | null;
				location?: string | null;
				browser?: string | null;
				device?: string | null;
				os?: string | null;
				icon?: string | null;
				created_at?: string | null;
				seen_at?: string | null;
				is_active?: boolean | null;
			}> | null;
			user_notification_schedule?: {
				enabled?: boolean | null;
				day_0_start_time?: number | null;
				day_0_end_time?: number | null;
				day_1_start_time?: number | null;
				day_1_end_time?: number | null;
				day_2_start_time?: number | null;
				day_2_end_time?: number | null;
				day_3_start_time?: number | null;
				day_3_end_time?: number | null;
				day_4_start_time?: number | null;
				day_4_end_time?: number | null;
				day_5_start_time?: number | null;
				day_5_end_time?: number | null;
				day_6_start_time?: number | null;
				day_6_end_time?: number | null;
			} | null;
			use_logo_small_as_avatar?: boolean | null;
			featured_user_badge_ids?: Array<DiscourseJsonValue> | null;
			invited_by?: string | null;
			groups?: Array<{
				id?: number | null;
				automatic?: boolean | null;
				name?: string | null;
				display_name?: string | null;
				user_count?: number | null;
				mentionable_level?: number | null;
				messageable_level?: number | null;
				visibility_level?: number | null;
				primary_group?: boolean | null;
				title?: string | null;
				grant_trust_level?: string | null;
				incoming_email?: string | null;
				has_messages?: boolean | null;
				flair_url?: string | null;
				flair_bg_color?: string | null;
				flair_color?: string | null;
				bio_raw?: string | null;
				bio_cooked?: string | null;
				bio_excerpt?: string | null;
				public_admission?: boolean | null;
				public_exit?: boolean | null;
				allow_membership_requests?: boolean | null;
				full_name?: string | null;
				default_notification_level?: number | null;
				membership_request_template?: string | null;
				members_visibility_level?: number | null;
				can_see_members?: boolean | null;
				can_admin_group?: boolean | null;
				publish_read_state?: boolean | null;
			}> | null;
			group_users?: Array<{
				group_id?: number | null;
				user_id?: number | null;
				notification_level?: number | null;
				owner?: boolean | null;
			}> | null;
			user_option?: {
				user_id?: number | null;
				mailing_list_mode?: boolean | null;
				mailing_list_mode_frequency?: number | null;
				email_digests?: boolean | null;
				email_level?: number | null;
				email_messages_level?: number | null;
				external_links_in_new_tab?: boolean | null;
				bookmark_auto_delete_preference?: number | null;
				color_scheme_id?: string | null;
				dark_scheme_id?: string | null;
				dynamic_favicon?: boolean | null;
				enable_quoting?: boolean | null;
				enable_smart_lists?: boolean | null;
				enable_markdown_monospace_font?: boolean | null;
				digest_after_minutes?: number | null;
				automatically_unpin_topics?: boolean | null;
				auto_track_topics_after_msecs?: number | null;
				notification_level_when_replying?: number | null;
				new_topic_duration_minutes?: number | null;
				email_previous_replies?: number | null;
				email_in_reply_to?: boolean | null;
				like_notification_frequency?: number | null;
				notify_on_linked_posts?: boolean | null;
				push_notification_level?: string | null;
				enable_upcoming_change_available_notifications?: boolean | null;
				include_tl0_in_digests?: boolean | null;
				theme_ids?: Array<DiscourseJsonValue> | null;
				theme_key_seq?: number | null;
				allow_private_messages?: boolean | null;
				enable_allowed_pm_users?: boolean | null;
				homepage_id?: string | null;
				hide_profile_and_presence?: boolean | null;
				hide_profile?: boolean | null;
				hide_presence?: boolean | null;
				text_size?: string | null;
				text_size_seq?: number | null;
				title_count_mode?: string | null;
				timezone?: string | null;
				skip_new_user_tips?: boolean | null;
				default_calendar?: string | null;
				oldest_search_log_date?: string | null;
				sidebar_link_to_filtered_list?: boolean | null;
				sidebar_show_count_of_new_items?: boolean | null;
				watched_precedence_over_muted?: boolean | null;
				seen_popups?: Array<DiscourseJsonValue> | null;
				composition_mode?: number | null;
				interface_color_mode?: number | null;
				automatically_translate?: boolean | null;
				understood_languages?: Array<string> | null;
				hidden_composer_toolbar_buttons?: Array<string> | null;
				show_original_content?: boolean | null;
				send_shortcut?: string | null;
			} | null;
		} | null;
	};
	'users.getByProviderExternalId': {
		user_badges?: Array<DiscourseJsonValue> | null;
		user?: {
			id?: number | null;
			username?: string | null;
			name?: string | null;
			avatar_template?: string | null;
			last_posted_at?: string | null;
			last_seen_at?: string | null;
			created_at?: string | null;
			ignored?: boolean | null;
			muted?: boolean | null;
			can_ignore_user?: boolean | null;
			can_ignore_users?: boolean | null;
			can_mute_user?: boolean | null;
			can_mute_users?: boolean | null;
			can_send_private_messages?: boolean | null;
			can_send_private_message_to_user?: boolean | null;
			trust_level?: number | null;
			moderator?: boolean | null;
			admin?: boolean | null;
			title?: string | null;
			badge_count?: number | null;
			second_factor_backup_enabled?: boolean | null;
			user_fields?: {
				'1'?: string | null;
				'2'?: string | null;
			} | null;
			custom_fields?: {
				first_name?: string | null;
			} | null;
			time_read?: number | null;
			recent_time_read?: number | null;
			primary_group_id?: number | null;
			primary_group_name?: string | null;
			flair_group_id?: number | null;
			flair_name?: string | null;
			flair_url?: string | null;
			flair_bg_color?: string | null;
			flair_color?: string | null;
			featured_topic?: {
				id?: number | null;
				title?: string | null;
				fancy_title?: string | null;
				slug?: string | null;
				posts_count?: number | null;
			} | null;
			staged?: boolean | null;
			can_edit?: boolean | null;
			can_edit_avatar?: boolean | null;
			can_upload_avatar?: boolean | null;
			can_edit_username?: boolean | null;
			can_edit_email?: boolean | null;
			can_edit_name?: boolean | null;
			uploaded_avatar_id?: number | null;
			has_title_badges?: boolean | null;
			pending_count?: number | null;
			pending_posts_count?: number | null;
			profile_view_count?: number | null;
			second_factor_enabled?: boolean | null;
			can_upload_profile_header?: boolean | null;
			can_upload_user_card_background?: boolean | null;
			post_count?: number | null;
			topic_count?: number | null;
			can_be_deleted?: boolean | null;
			can_delete_all_posts?: boolean | null;
			staff_only_settings?: Array<string> | null;
			locale?: string | null;
			muted_category_ids?: Array<DiscourseJsonValue> | null;
			regular_category_ids?: Array<DiscourseJsonValue> | null;
			watched_tags?: Array<DiscourseJsonValue> | null;
			watching_first_post_tags?: Array<DiscourseJsonValue> | null;
			tracked_tags?: Array<DiscourseJsonValue> | null;
			muted_tags?: Array<DiscourseJsonValue> | null;
			tracked_category_ids?: Array<DiscourseJsonValue> | null;
			watched_category_ids?: Array<DiscourseJsonValue> | null;
			watched_first_post_category_ids?: Array<DiscourseJsonValue> | null;
			system_avatar_upload_id?: string | null;
			system_avatar_template?: string | null;
			associated_account_avatars?: Array<{
				id?: number | null;
				name?: string | null;
				upload_id?: number | null;
				avatar_template?: string | null;
			}> | null;
			selected_user_associated_account_id?: number | null;
			muted_usernames?: Array<DiscourseJsonValue> | null;
			ignored_usernames?: Array<DiscourseJsonValue> | null;
			allowed_pm_usernames?: Array<DiscourseJsonValue> | null;
			mailing_list_posts_per_day?: number | null;
			can_change_bio?: boolean | null;
			can_change_location?: boolean | null;
			can_change_website?: boolean | null;
			can_change_tracking_preferences?: boolean | null;
			user_api_keys?: string | null;
			user_passkeys?: Array<DiscourseJsonValue> | null;
			sidebar_tags?: Array<DiscourseJsonValue> | null;
			sidebar_category_ids?: Array<DiscourseJsonValue> | null;
			display_sidebar_tags?: boolean | null;
			can_pick_theme_with_custom_homepage?: boolean | null;
			user_auth_tokens?: Array<{
				id?: number | null;
				client_ip?: string | null;
				location?: string | null;
				browser?: string | null;
				device?: string | null;
				os?: string | null;
				icon?: string | null;
				created_at?: string | null;
				seen_at?: string | null;
				is_active?: boolean | null;
			}> | null;
			user_notification_schedule?: {
				enabled?: boolean | null;
				day_0_start_time?: number | null;
				day_0_end_time?: number | null;
				day_1_start_time?: number | null;
				day_1_end_time?: number | null;
				day_2_start_time?: number | null;
				day_2_end_time?: number | null;
				day_3_start_time?: number | null;
				day_3_end_time?: number | null;
				day_4_start_time?: number | null;
				day_4_end_time?: number | null;
				day_5_start_time?: number | null;
				day_5_end_time?: number | null;
				day_6_start_time?: number | null;
				day_6_end_time?: number | null;
			} | null;
			use_logo_small_as_avatar?: boolean | null;
			featured_user_badge_ids?: Array<DiscourseJsonValue> | null;
			invited_by?: string | null;
			groups?: Array<{
				id?: number | null;
				automatic?: boolean | null;
				name?: string | null;
				display_name?: string | null;
				user_count?: number | null;
				mentionable_level?: number | null;
				messageable_level?: number | null;
				visibility_level?: number | null;
				primary_group?: boolean | null;
				title?: string | null;
				grant_trust_level?: string | null;
				incoming_email?: string | null;
				has_messages?: boolean | null;
				flair_url?: string | null;
				flair_bg_color?: string | null;
				flair_color?: string | null;
				bio_raw?: string | null;
				bio_cooked?: string | null;
				bio_excerpt?: string | null;
				public_admission?: boolean | null;
				public_exit?: boolean | null;
				allow_membership_requests?: boolean | null;
				full_name?: string | null;
				default_notification_level?: number | null;
				membership_request_template?: string | null;
				members_visibility_level?: number | null;
				can_see_members?: boolean | null;
				can_admin_group?: boolean | null;
				publish_read_state?: boolean | null;
			}> | null;
			group_users?: Array<{
				group_id?: number | null;
				user_id?: number | null;
				notification_level?: number | null;
				owner?: boolean | null;
			}> | null;
			user_option?: {
				user_id?: number | null;
				mailing_list_mode?: boolean | null;
				mailing_list_mode_frequency?: number | null;
				email_digests?: boolean | null;
				email_level?: number | null;
				email_messages_level?: number | null;
				external_links_in_new_tab?: boolean | null;
				bookmark_auto_delete_preference?: number | null;
				color_scheme_id?: string | null;
				dark_scheme_id?: string | null;
				dynamic_favicon?: boolean | null;
				enable_quoting?: boolean | null;
				enable_smart_lists?: boolean | null;
				enable_markdown_monospace_font?: boolean | null;
				digest_after_minutes?: number | null;
				automatically_unpin_topics?: boolean | null;
				auto_track_topics_after_msecs?: number | null;
				notification_level_when_replying?: number | null;
				new_topic_duration_minutes?: number | null;
				email_previous_replies?: number | null;
				email_in_reply_to?: boolean | null;
				like_notification_frequency?: number | null;
				notify_on_linked_posts?: boolean | null;
				push_notification_level?: string | null;
				enable_upcoming_change_available_notifications?: boolean | null;
				include_tl0_in_digests?: boolean | null;
				theme_ids?: Array<DiscourseJsonValue> | null;
				theme_key_seq?: number | null;
				allow_private_messages?: boolean | null;
				enable_allowed_pm_users?: boolean | null;
				homepage_id?: string | null;
				hide_profile_and_presence?: boolean | null;
				hide_profile?: boolean | null;
				hide_presence?: boolean | null;
				text_size?: string | null;
				text_size_seq?: number | null;
				title_count_mode?: string | null;
				timezone?: string | null;
				skip_new_user_tips?: boolean | null;
				default_calendar?: string | null;
				oldest_search_log_date?: string | null;
				sidebar_link_to_filtered_list?: boolean | null;
				sidebar_show_count_of_new_items?: boolean | null;
				watched_precedence_over_muted?: boolean | null;
				seen_popups?: Array<DiscourseJsonValue> | null;
				composition_mode?: number | null;
				interface_color_mode?: number | null;
				automatically_translate?: boolean | null;
				understood_languages?: Array<string> | null;
				hidden_composer_toolbar_buttons?: Array<string> | null;
				show_original_content?: boolean | null;
				send_shortcut?: string | null;
			} | null;
		} | null;
	};
	'users.getEmails': {
		email?: string | null;
		secondary_emails?: Array<DiscourseJsonValue> | null;
		unconfirmed_emails?: Array<DiscourseJsonValue> | null;
		associated_accounts?: Array<DiscourseJsonValue> | null;
	};
	'users.listActions': {
		user_actions?: Array<{
			excerpt?: string | null;
			action_type?: number | null;
			created_at?: string | null;
			avatar_template?: string | null;
			acting_avatar_template?: string | null;
			slug?: string | null;
			topic_id?: number | null;
			target_user_id?: number | null;
			target_name?: string | null;
			target_username?: string | null;
			post_number?: number | null;
			post_id?: number | null;
			username?: string | null;
			name?: string | null;
			user_id?: number | null;
			acting_username?: string | null;
			acting_name?: string | null;
			acting_user_id?: number | null;
			title?: string | null;
			deleted?: boolean | null;
			hidden?: boolean | null;
			post_type?: number | null;
			action_code?: string | null;
			category_id?: number | null;
			closed?: boolean | null;
			archived?: boolean | null;
		}> | null;
	};
	'users.listDirectory': {
		directory_items?: Array<{
			id?: number | null;
			likes_received?: number | null;
			likes_given?: number | null;
			topics_entered?: number | null;
			topic_count?: number | null;
			post_count?: number | null;
			posts_read?: number | null;
			days_visited?: number | null;
			user?: {
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
				title?: string | null;
			} | null;
		}> | null;
		meta?: {
			last_updated_at?: string | null;
			total_rows_directory_items?: number | null;
			load_more_directory_items?: string | null;
		} | null;
	};
	'users.logOut': {
		success?: string | null;
	};
	'users.merge': {
		success?: string | null;
	};
	'users.refreshGravatar': {
		gravatar_upload_id?: number | null;
		gravatar_avatar_template?: string | null;
	};
	'users.sendPasswordResetEmail': {
		success?: string | null;
		user_found?: boolean | null;
	};
	'users.silence': {
		silence?: {
			silenced?: boolean | null;
			silence_reason?: string | null;
			full_silence_reason?: string | null;
			silenced_till?: string | null;
			silenced_at?: string | null;
			silenced_by?: {
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
			} | null;
		} | null;
	};
	'users.suspend': {
		suspension?: {
			suspend_reason?: string | null;
			full_suspend_reason?: string | null;
			suspended_till?: string | null;
			suspended_at?: string | null;
			suspended_by?: {
				id?: number | null;
				username?: string | null;
				name?: string | null;
				avatar_template?: string | null;
			} | null;
		} | null;
	};
	'users.update': {
		success?: string | null;
		user?: Record<string, DiscourseJsonValue> | null;
	};
	'users.updateAvatar': {
		success?: string | null;
	};
	'users.updateEmail': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
	'users.updateUsername': {
		/** Discourse accepted the call; it answered with no body. */
		success: true;
	};
};
