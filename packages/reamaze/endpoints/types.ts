import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// Re:amaze shapes come from https://www.reamaze.com/api. Resources nest small
// user and channel objects, identifiers arrive as either a string or a number
// depending on the resource, and a brand can add its own `data` keys.

/** An identifier the API sends as a string on some resources and a number on others. */
const IdSchema = z.union([z.string(), z.number()]);

/** A name/email pair, used for authors, assignees, recipients and note creators. */
const UserRefSchema = z
	.object({
		name: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

/** The channel a conversation belongs to. */
const CategorySchema = z
	.object({
		name: z.string().nullish(),
		slug: z.string().nullish(),
		email: z.string().nullish(),
		channel: z.number().int().nullish(),
	})
	.loose();

/** A message body and timestamp, as the conversation summary carries it. */
const MessageSummarySchema = z
	.object({
		body: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

const AttachmentSchema = z
	.object({
		file_file_name: z.string().nullish(),
		file_content_type: z.string().nullish(),
		file_file_size: z.number().nullish(),
		thumb_url: z.string().nullish(),
		url: z.string().nullish(),
		image: z.boolean().nullish(),
	})
	.loose();

const NoteSchema = z
	.object({
		id: IdSchema.nullish(),
		// A note's text arrives as `note` on the notes endpoints and as `content`
		// inside a contact's `notes` array, so both are accepted.
		note: z.string().nullish(),
		content: z.string().nullish(),
		body: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		creator: UserRefSchema.nullish(),
	})
	.loose();

const ContactSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		friendly_name: z.string().nullish(),
		mobile: z.string().nullish(),
		external_avatar_url: z.string().nullish(),
		notes: z.array(NoteSchema).nullish(),
		// unknown: customer data attributes are configured per brand, so their
		// keys and value types differ between accounts.
		data: z.record(z.string(), z.unknown()).nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const ConversationSchema = z
	.object({
		// Required: verified live, every conversation carries a slug, and it is the
		// identifier the get and update routes take. Requiring it means an
		// unrelated object cannot parse as a conversation.
		slug: z.string().describe('Identifier used by the get and update routes'),
		subject: z.string().nullish(),
		/** 0 open, 1 responded, 2 done, 3 spam, 4 archived, 5 on hold, 6 auto-done, 7/8 AI assigned/done, 9 AI spam. */
		status: z.number().int().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		tag_list: z.array(z.string()).nullish(),
		message: MessageSummarySchema.nullish(),
		last_staff_message: MessageSummarySchema.nullish(),
		last_customer_message: MessageSummarySchema.nullish(),
		author: UserRefSchema.nullish(),
		assignee: UserRefSchema.nullish(),
		category: CategorySchema.nullish(),
		// unknown: conversation data attributes are configured per brand, so their
		// keys and value types differ between accounts.
		data: z.record(z.string(), z.unknown()).nullish(),
		followers: z.array(UserRefSchema).nullish(),
	})
	.loose();

const MessageConversationSchema = z
	.object({
		subject: z.string().nullish(),
		slug: z.string().nullish(),
		created_at: z.string().nullish(),
		category: CategorySchema.nullish(),
	})
	.loose();

const MessageSchema = z
	.object({
		body: z.string().nullish(),
		original_body: z.string().nullish(),
		/** 0 regular, 1 internal note, 2 collision detected. */
		visibility: z.number().int().nullish(),
		origin: z.number().int().nullish(),
		origin_id: z.string().nullish(),
		created_at: z.string().nullish(),
		user: UserRefSchema.nullish(),
		recipients: z.array(UserRefSchema).nullish(),
		attachments: z.array(AttachmentSchema).nullish(),
		conversation: MessageConversationSchema.nullish(),
	})
	.loose();

const IdentitySchema = z
	.object({
		type: z.string().nullish(),
		identifier: z.string().nullish(),
	})
	.loose();

const ChannelSchema = z
	.object({
		name: z.string().nullish(),
		slug: z.string().nullish(),
		email: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		/** 1 email, 2 twitter, 3 facebook, 6 chat, 8 instagram, 9 SMS, 10 voice, 12+ messenger/ad/WhatsApp/TikTok. */
		channel: z.number().int().nullish(),
		/** 0 private, 1 public. */
		visibility: z.number().int().nullish(),
		spam_filter_enabled: z.boolean().nullish(),
		reply_from_origin: z.boolean().nullish(),
		verified: z.boolean().nullish(),
		verification_email: z.string().nullish(),
		last_verified: z.string().nullish(),
		settings_reply_from_name: z.string().nullish(),
		settings_signature: z.string().nullish(),
		brand: z
			.object({
				name: z.string().nullish(),
				url: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const ArticleSchema = z
	.object({
		title: z.string().nullish(),
		body: z.string().nullish(),
		slug: z.string().nullish(),
		/** 0 published, 1 draft, 4 internal. */
		status: z.number().int().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		url: z.string().nullish(),
		author: UserRefSchema.nullish(),
		topic: z
			.object({
				name: z.string().nullish(),
				slug: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const ResponseTemplateSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		body: z.string().nullish(),
		is_personal: z.number().int().nullish(),
		response_template_group: z
			.object({
				id: IdSchema.nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const StaffSchema = z
	.object({
		name: z.string().nullish(),
		email: z.string().nullish(),
		created_at: z.string().nullish(),
		// unknown: the vendor documents `role` as an unstable permission hash and
		// advises against relying on its keys, which change between plans.
		role: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const SatisfactionRatingSchema = z
	.object({
		id: IdSchema.nullish(),
		/** 1 to 5, or null when the customer left no rating. */
		rating: z.number().int().nullish(),
		comment: z.string().nullish(),
		user_id: IdSchema.nullish(),
		assignee_id: IdSchema.nullish(),
		conversation_id: IdSchema.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const IncidentStatusSchema = z.enum([
	'investigating',
	'identified',
	'monitoring',
	'resolved',
]);

const SystemStatusSchema = z.enum([
	'operational',
	'degraded_performance',
	'partial_outage',
	'major_outage',
	'under_maintenance',
]);

/**
 * Statuses as responses carry them. The enums above stay on the inputs; a
 * response is read as a plain string so a status Re:amaze adds later does not
 * fail a read.
 */
const IncidentStatusOutputSchema = z
	.string()
	.describe('investigating, identified, monitoring or resolved');

const SystemStatusOutputSchema = z
	.string()
	.describe(
		'operational, degraded_performance, partial_outage, major_outage or under_maintenance',
	);

const IncidentUpdateSchema = z
	.object({
		id: IdSchema.nullish(),
		status: IncidentStatusOutputSchema.nullish(),
		message: z.string().nullish(),
	})
	.loose();

const IncidentSystemSchema = z
	.object({
		id: IdSchema.nullish(),
		system_id: IdSchema.nullish(),
		status: SystemStatusOutputSchema.nullish(),
		system: z
			.object({
				id: IdSchema.nullish(),
				title: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const IncidentSchema = z
	.object({
		id: IdSchema.nullish(),
		title: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		status: IncidentStatusOutputSchema.nullish(),
		updates: z.array(IncidentUpdateSchema).nullish(),
		incidents_systems: z.array(IncidentSystemSchema).nullish(),
	})
	.loose();

const SystemSchema = z
	.object({
		id: IdSchema.nullish(),
		title: z.string().nullish(),
		account_id: IdSchema.nullish(),
		brand_id: IdSchema.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		status: SystemStatusOutputSchema.nullish(),
		active_incidents: z.array(IncidentSchema).nullish(),
	})
	.loose();

/**
 * Paging fields. Verified live: every paged collection sends `page_size`,
 * `page_count` and `total_count`, but they are optional here because a caller
 * that shapes a partial response should not be rejected, and `channels` sends
 * only `total_count`.
 */
const PagingShape = {
	page_size: z.number().int().nullish(),
	page_count: z.number().int().nullish(),
	total_count: z.number().int().nullish(),
};

/** A 1-based page number; the response carries page_size and page_count. */
const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe(
		'Page number, 1-based. The response carries page_size and page_count',
	);

/**
 * A `data[key]=value` filter hash.
 * unknown: the keys are custom attributes the brand defines, so their names and
 * value types differ per account and cannot be enumerated here.
 */
const DataFilterSchema = z
	.record(z.string(), z.unknown())
	.optional()
	.describe(
		'Sent as one `data[key]=value` query entry per key, ANDed by the API',
	);

// ── conversations ─────────────────────────────────────────────────────────

const ConversationsListInputSchema = z.object({
	filter: z
		.enum(['archived', 'open', 'unassigned', 'all'])
		.optional()
		.describe('Defaults to unarchived conversations only'),
	for: z
		.string()
		.optional()
		.describe('User email; returns conversations visible to that customer'),
	for_id: z
		.string()
		.optional()
		.describe('SSO user id; the same filter as `for`'),
	sort: z
		.enum(['updated', 'changed'])
		.optional()
		.describe(
			'updated orders by last customer message, changed by any update. Default is created_at',
		),
	tag: z.string().optional().describe('Comma-separated tags, all must match'),
	category: z.string().optional().describe('Channel slug'),
	page: PageSchema,
	start_date: z
		.string()
		.optional()
		.describe('ISO 8601; filters on the latest customer message time'),
	end_date: z
		.string()
		.optional()
		.describe('ISO 8601; filters on the latest customer message time'),
	origin: z
		.union([z.number().int(), z.string()])
		.optional()
		.describe('Origin number (1 email) or name (email)'),
	data: DataFilterSchema,
});

export type ConversationsListInput = z.input<
	typeof ConversationsListInputSchema
>;

const ConversationsListResponseSchema = z
	.object({
		conversations: z.array(ConversationSchema),
		...PagingShape,
	})
	.loose();

export type ConversationsListResponse = z.infer<
	typeof ConversationsListResponseSchema
>;

const ConversationsGetInputSchema = z.object({
	slug: z
		.string()
		.min(1)
		.describe('Conversation slug, unless id_type selects another identifier'),
	id_type: z
		.enum(['ref', 'origin'])
		.optional()
		.describe('ref looks up by ref_id, origin by origin id within `category`'),
	category: z
		.string()
		.optional()
		.describe('Channel slug, required when id_type is origin'),
	channel: z
		.union([z.number().int(), z.string()])
		.optional()
		.describe('Channel type, used with id_type=origin'),
});

export type ConversationsGetInput = z.input<typeof ConversationsGetInputSchema>;

const ConversationsGetResponseSchema = ConversationSchema;

export type ConversationsGetResponse = z.infer<
	typeof ConversationsGetResponseSchema
>;

const MessageCreateSchema = z
	.object({
		body: z.string().min(1).describe('Markdown is accepted'),
		recipients: z
			.array(z.string())
			.optional()
			.describe('Emails or phone numbers added as thread participants'),
		suppress_notifications: z
			.boolean()
			.optional()
			.describe('Send no email or integration notification for this message'),
		suppress_autoresolve: z
			.boolean()
			.optional()
			.describe('Do not mark the conversation done when the sender is staff'),
		suppress_surveys: z
			.union([z.boolean(), z.string()])
			.optional()
			.describe('true sends no survey; a YYYY-MM-DD date suppresses before it'),
		attachment: z
			.string()
			.optional()
			.describe('URL Re:amaze fetches to attach'),
		attachments: z.array(z.string()).optional(),
	})
	.loose();

const ConversationsCreateInputSchema = z.object({
	subject: z.string().min(1),
	category: z
		.string()
		.min(1)
		.describe('Channel slug the conversation is created in'),
	tag_list: z.array(z.string()).optional(),
	status: z
		.number()
		.int()
		.min(0)
		.max(9)
		.optional()
		.describe('0 open, 2 done, 3 spam, 5 on hold, 9 AI spam'),
	hold_until: z
		.string()
		.optional()
		.describe('ISO 8601; only meaningful when status is 5 (On Hold)'),
	// unknown: custom conversation attributes are defined per brand, so neither
	// their names nor their value types are known ahead of time.
	data: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Conversation data attributes'),
	assignee: z
		.string()
		.optional()
		.describe('Staff email the conversation is assigned to'),
	message: MessageCreateSchema,
	user: z
		.object({
			name: z.string().min(1),
			email: z.string().min(1),
			// unknown: customer attributes are brand-configured, so their keys and
			// value types vary between accounts.
			data: z
				.record(z.string(), z.unknown())
				.optional()
				.describe('Replaces the customer data attributes; one level deep'),
		})
		.describe('The customer the conversation is created for'),
});

export type ConversationsCreateInput = z.input<
	typeof ConversationsCreateInputSchema
>;

const ConversationsCreateResponseSchema = ConversationSchema;

export type ConversationsCreateResponse = z.infer<
	typeof ConversationsCreateResponseSchema
>;

const ConversationsUpdateInputSchema = z.object({
	slug: z.string().min(1),
	assignee: z
		.object({ email: z.string().min(1) })
		.optional()
		.describe('Reassigns the conversation to this staff user'),
	tag_list: z.array(z.string()).optional().describe('Replaces the tag list'),
	status: z.number().int().min(0).max(9).optional(),
	hold_until: z
		.string()
		.optional()
		.describe('ISO 8601; only meaningful when status is 5 (On Hold)'),
	// unknown: the same brand-configured attribute map as on create.
	data: z.record(z.string(), z.unknown()).optional(),
	category: z
		.string()
		.optional()
		.describe(
			'Moves the conversation to this channel; it must be an email channel',
		),
	brand: z
		.string()
		.optional()
		.describe('Destination brand URL, only when moving to another brand'),
});

export type ConversationsUpdateInput = z.input<
	typeof ConversationsUpdateInputSchema
>;

const ConversationsUpdateResponseSchema = ConversationSchema;

export type ConversationsUpdateResponse = z.infer<
	typeof ConversationsUpdateResponseSchema
>;

// ── messages ──────────────────────────────────────────────────────────────

const MessagesListInputSchema = z.object({
	filter: z
		.enum(['staff', 'customer'])
		.optional()
		.describe('Defaults to every message'),
	tag: z
		.string()
		.optional()
		.describe('Comma-separated tags on the conversation'),
	origin: z
		.number()
		.int()
		.optional()
		.describe('1 email, 2 twitter, 6 chat, 7 api, 9 sms, 15 whatsapp, 17 form'),
	page: PageSchema,
	sent_by: z.string().optional().describe('User email the message was sent by'),
	category: z.string().optional().describe('Channel slug'),
	start_date: z.string().optional().describe('ISO 8601 message creation bound'),
	end_date: z.string().optional().describe('ISO 8601 message creation bound'),
	include: z
		.literal('original_body')
		.optional()
		.describe('Adds `original_body`, the message HTML when present'),
});

export type MessagesListInput = z.input<typeof MessagesListInputSchema>;

const MessagesListResponseSchema = z
	.object({
		messages: z.array(MessageSchema),
		...PagingShape,
	})
	.loose();

export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

const MessagesCreateInputSchema = z.object({
	slug: z.string().min(1).describe('Conversation slug the message belongs to'),
	body: z.string().min(1).describe('Markdown is accepted'),
	visibility: z
		.number()
		.int()
		.min(0)
		.max(1)
		.optional()
		.describe('0 regular (default), 1 internal note'),
	user: z
		.object({
			name: z.string().optional(),
			email: z.string().optional(),
		})
		.optional()
		.describe('Sender; defaults to the authenticated user'),
	origin_id: z
		.string()
		.optional()
		.describe('Your own message id, which lets Re:amaze discard duplicates'),
	suppress_notifications: z.boolean().optional(),
	suppress_autoresolve: z.boolean().optional(),
	suppress_surveys: z.union([z.boolean(), z.string()]).optional(),
	attachment: z.string().optional().describe('URL Re:amaze fetches to attach'),
	attachments: z.array(z.string()).optional(),
	recipients: z
		.array(z.string())
		.optional()
		.describe('Emails or phone numbers added as thread participants'),
});

export type MessagesCreateInput = z.input<typeof MessagesCreateInputSchema>;

const MessagesCreateResponseSchema = MessageSchema;

export type MessagesCreateResponse = z.infer<
	typeof MessagesCreateResponseSchema
>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsListInputSchema = z.object({
	q: z.string().optional().describe('Search over contact name and email'),
	data: DataFilterSchema,
	sort: z
		.enum(['date'])
		.optional()
		.describe('date orders by create time descending; default is by name'),
	type: z
		.enum(['email', 'mobile'])
		.optional()
		.describe('Only contacts that have an email address or a phone number'),
	page: PageSchema,
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = z
	.object({
		contacts: z.array(ContactSchema),
		...PagingShape,
	})
	.loose();

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactsCreateInputSchema = z
	.object({
		name: z.string().min(1),
		email: z
			.string()
			.min(1)
			.optional()
			.describe('Either this or mobile is required'),
		mobile: z
			.string()
			.min(1)
			.optional()
			.describe(
				'E.164 without spaces, e.g. +12223334444. Either this or email is required',
			),
		id: z.string().optional().describe('Your own id for this contact'),
		external_avatar_url: z.string().optional(),
		notes: z
			.array(z.string())
			.optional()
			.describe('Plain note bodies attached at creation'),
		// unknown: brand-defined custom fields; the API passes them through untyped.
		data: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('Customer data attributes, one level deep'),
	})
	.refine((value) => Boolean(value.email || value.mobile), {
		message: 'Pass an email or a mobile number',
	});

export type ContactsCreateInput = z.input<typeof ContactsCreateInputSchema>;

const ContactsCreateResponseSchema = z
	.object({ contact: ContactSchema })
	.loose();

export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

const ContactsUpdateInputSchema = z.object({
	email: z.string().min(1).describe('The contact identifier in the path'),
	identifier_type: z
		.enum(['mobile', 'facebook', 'twitter', 'instagram'])
		.optional()
		.describe('Interprets `email` as this identity type instead of an email'),
	name: z.string().optional(),
	friendly_name: z.string().optional(),
	external_avatar_url: z.string().optional(),
	notes: z
		.array(z.string())
		.optional()
		.describe('Appends notes; a note is edited through the notes endpoints'),
	// unknown: brand-defined custom fields, as on create.
	data: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Customer data attributes, one level deep'),
});

export type ContactsUpdateInput = z.input<typeof ContactsUpdateInputSchema>;

const ContactsUpdateResponseSchema = z
	.object({ contact: ContactSchema })
	.loose();

export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

// ── identities ────────────────────────────────────────────────────────────

const IdentitiesListInputSchema = z.object({
	email: z
		.string()
		.min(1)
		.describe('Contact email whose identities are listed'),
});

export type IdentitiesListInput = z.input<typeof IdentitiesListInputSchema>;

const IdentitiesListResponseSchema = z
	.object({ identities: z.array(IdentitySchema) })
	.loose();

export type IdentitiesListResponse = z.infer<
	typeof IdentitiesListResponseSchema
>;

const IdentitiesCreateInputSchema = z.object({
	email: z
		.string()
		.min(1)
		.describe('Contact email the identity is attached to'),
	type: z
		.enum(['email', 'mobile', 'instagram', 'igsid', 'twitter'])
		.describe('Facebook identities cannot be added'),
	identifier: z.string().min(1).describe('Address or handle, matching `type`'),
});

export type IdentitiesCreateInput = z.input<typeof IdentitiesCreateInputSchema>;

const IdentitiesCreateResponseSchema = z
	.object({ identities: z.array(IdentitySchema) })
	.loose();

export type IdentitiesCreateResponse = z.infer<
	typeof IdentitiesCreateResponseSchema
>;

// ── notes ─────────────────────────────────────────────────────────────────

const ContactIdentifierSchema = z
	.string()
	.min(1)
	.describe('Contact email address or phone number');

const NotesListInputSchema = z.object({
	contact: ContactIdentifierSchema,
});

export type NotesListInput = z.input<typeof NotesListInputSchema>;

/**
 * Verified live: the route answers a **bare array**. The plugin wraps it under
 * `notes` so a caller always reads a named collection, and a non-array body
 * throws rather than becoming an empty list.
 */
const NotesListResponseSchema = z.object({
	notes: z.array(NoteSchema),
});

export type NotesListResponse = z.infer<typeof NotesListResponseSchema>;

const NotesCreateInputSchema = z.object({
	contact: ContactIdentifierSchema,
	body: z.string().min(1),
	creator_email: z
		.string()
		.optional()
		.describe('Staff email credited with the note; defaults to the caller'),
	created_at: z.string().optional().describe('ISO 8601; defaults to now'),
});

export type NotesCreateInput = z.input<typeof NotesCreateInputSchema>;

const NotesCreateResponseSchema = z.object({
	// The vendor documents "all notes for this contact"; verified live, the list
	// route for the same resource is a bare array, so both are accepted.
	notes: z.array(NoteSchema),
});

export type NotesCreateResponse = z.infer<typeof NotesCreateResponseSchema>;

const NotesUpdateInputSchema = z.object({
	contact: ContactIdentifierSchema,
	id: z.union([z.string(), z.number()]).describe('Note id'),
	body: z.string().min(1),
	creator_email: z
		.string()
		.optional()
		.describe(
			'Staff email credited with the note; the creator is kept when omitted',
		),
	created_at: z.string().optional(),
});

export type NotesUpdateInput = z.input<typeof NotesUpdateInputSchema>;

const NotesUpdateResponseSchema = z.object({
	notes: z.array(NoteSchema),
});

export type NotesUpdateResponse = z.infer<typeof NotesUpdateResponseSchema>;

const NotesDeleteInputSchema = z.object({
	contact: ContactIdentifierSchema,
	id: z.union([z.string(), z.number()]).describe('Note id'),
});

export type NotesDeleteInput = z.input<typeof NotesDeleteInputSchema>;

/**
 * A DELETE answers 200 with no body, so the identifiers are echoed back rather
 * than parsed from a response.
 */
const NotesDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	contact: z.string(),
	id: z.union([z.string(), z.number()]),
});

export type NotesDeleteResponse = z.infer<typeof NotesDeleteResponseSchema>;

// ── channels ──────────────────────────────────────────────────────────────

const ChannelsListInputSchema = z.object({
	channel: z
		.enum(['email', 'facebook', 'twitter', 'chat'])
		.optional()
		.describe('Defaults to every channel type'),
});

export type ChannelsListInput = z.input<typeof ChannelsListInputSchema>;

const ChannelsListResponseSchema = z
	.object({
		channels: z.array(ChannelSchema),
		// Verified live: this route sends `total_count` only, with no `page_size`
		// or `page_count`.
		total_count: z.number().int().nullish(),
	})
	.loose();

export type ChannelsListResponse = z.infer<typeof ChannelsListResponseSchema>;

const ChannelsGetInputSchema = z.object({
	slug: z.string().min(1).describe('Channel slug'),
});

export type ChannelsGetInput = z.input<typeof ChannelsGetInputSchema>;

const ChannelsGetResponseSchema = ChannelSchema;

export type ChannelsGetResponse = z.infer<typeof ChannelsGetResponseSchema>;

// ── articles ──────────────────────────────────────────────────────────────

const ArticlesListInputSchema = z.object({
	status: z
		.enum(['published', 'draft', 'internal'])
		.optional()
		.describe('Defaults to published articles only'),
	q: z.string().optional().describe('Search over article keywords'),
	page: PageSchema,
});

export type ArticlesListInput = z.input<typeof ArticlesListInputSchema>;

const ArticlesListResponseSchema = z
	.object({ articles: z.array(ArticleSchema), ...PagingShape })
	.loose();

export type ArticlesListResponse = z.infer<typeof ArticlesListResponseSchema>;

const ArticlesGetInputSchema = z.object({
	slug: z.string().min(1),
});

export type ArticlesGetInput = z.input<typeof ArticlesGetInputSchema>;

const ArticlesGetResponseSchema = ArticleSchema;

export type ArticlesGetResponse = z.infer<typeof ArticlesGetResponseSchema>;

const ArticleStatusSchema = z
	.union([z.literal(0), z.literal(1), z.literal(4)])
	.describe('0 published, 1 draft, 4 internal');

const ArticlesCreateInputSchema = z.object({
	topic: z.string().min(1).describe('Topic slug the article is filed under'),
	title: z.string().min(1),
	body: z.string().min(1),
	status: ArticleStatusSchema.optional(),
	topic_id: z.string().optional().describe('Topic slug carried in the body'),
});

export type ArticlesCreateInput = z.input<typeof ArticlesCreateInputSchema>;

const ArticlesCreateResponseSchema = ArticleSchema;

export type ArticlesCreateResponse = z.infer<
	typeof ArticlesCreateResponseSchema
>;

const ArticlesUpdateInputSchema = z.object({
	slug: z.string().min(1),
	title: z.string().optional(),
	body: z.string().optional(),
	status: ArticleStatusSchema.optional(),
	topic_id: z.string().optional(),
});

export type ArticlesUpdateInput = z.input<typeof ArticlesUpdateInputSchema>;

const ArticlesUpdateResponseSchema = ArticleSchema;

export type ArticlesUpdateResponse = z.infer<
	typeof ArticlesUpdateResponseSchema
>;

// ── reports ───────────────────────────────────────────────────────────────
//
// `brand`, `start_date` and `end_date` are shared by every report. Dates
// default to the last 30 days, and a window must be between 1 day and 1 year.
//
// Verified live, each report names its payload differently:
// `conversation_counts` for volume, `response_times` plus `summary` for
// response time, `report` for staff, `tags` for tags and `channels` for the
// channel summary.

const ReportInputShape = {
	brand: z
		.string()
		.optional()
		.describe('Brand URL; omit for every brand in the account'),
	start_date: z
		.string()
		.optional()
		.describe('YYYY-MM-DD; defaults to 30 days ago'),
	end_date: z.string().optional().describe('YYYY-MM-DD; defaults to today'),
};

const ReportsVolumeInputSchema = z.object(ReportInputShape);

export type ReportsVolumeInput = z.input<typeof ReportsVolumeInputSchema>;

/** Verified live: a map of `YYYY-MM-DD` to that day's conversation count. */
const ReportsVolumeResponseSchema = z
	.object({
		conversation_counts: z.record(z.string(), z.number()).nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
	})
	.loose();

export type ReportsVolumeResponse = z.infer<typeof ReportsVolumeResponseSchema>;

const ReportsResponseTimeInputSchema = z.object(ReportInputShape);

export type ReportsResponseTimeInput = z.input<
	typeof ReportsResponseTimeInputSchema
>;

const ReportsResponseTimeResponseSchema = z
	.object({
		// Verified live: a map of `YYYY-MM-DD` to that day's response time.
		// unknown: a day's value is a duration in seconds, and the API can send an
		// average or a nesting of percentiles depending on the metric it reports.
		response_times: z.record(z.string(), z.unknown()).nullish(),
		// unknown: averages, trends and ratios are nested numbers the vendor can
		// extend without a version bump.
		summary: z.record(z.string(), z.unknown()).nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
	})
	.loose();

export type ReportsResponseTimeResponse = z.infer<
	typeof ReportsResponseTimeResponseSchema
>;

const ReportsStaffInputSchema = z.object(ReportInputShape);

export type ReportsStaffInput = z.input<typeof ReportsStaffInputSchema>;

const ReportsStaffResponseSchema = z
	.object({
		// unknown: staff metrics are keyed by each staff member's display name,
		// which the account controls, and each value nests a per-day trend.
		report: z.record(z.string(), z.unknown()).nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
	})
	.loose();

export type ReportsStaffResponse = z.infer<typeof ReportsStaffResponseSchema>;

const ReportsTagsInputSchema = z.object(ReportInputShape);

export type ReportsTagsInput = z.input<typeof ReportsTagsInputSchema>;

/** Verified live: a map of tag name to how many conversations carried it. */
const ReportsTagsResponseSchema = z
	.object({
		tags: z.record(z.string(), z.number()).nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
	})
	.loose();

export type ReportsTagsResponse = z.infer<typeof ReportsTagsResponseSchema>;

const ReportsChannelSummaryInputSchema = z.object(ReportInputShape);

export type ReportsChannelSummaryInput = z.input<
	typeof ReportsChannelSummaryInputSchema
>;

const ReportsChannelSummaryResponseSchema = z
	.object({
		// unknown: the payload is keyed by channel id and each channel adds its
		// own metrics, so neither the keys nor the value fields are fixed.
		channels: z.record(z.string(), z.unknown()).nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
	})
	.loose();

export type ReportsChannelSummaryResponse = z.infer<
	typeof ReportsChannelSummaryResponseSchema
>;

// ── response templates ────────────────────────────────────────────────────

const ResponseTemplatesListInputSchema = z.object({
	q: z.string().optional().describe('Search over template keywords'),
	page: PageSchema,
});

export type ResponseTemplatesListInput = z.input<
	typeof ResponseTemplatesListInputSchema
>;

const ResponseTemplatesListResponseSchema = z
	.object({
		response_templates: z.array(ResponseTemplateSchema),
		...PagingShape,
	})
	.loose();

export type ResponseTemplatesListResponse = z.infer<
	typeof ResponseTemplatesListResponseSchema
>;

const ResponseTemplatesGetInputSchema = z.object({
	id: z.number().int().describe('Response template id'),
});

export type ResponseTemplatesGetInput = z.input<
	typeof ResponseTemplatesGetInputSchema
>;

const ResponseTemplatesGetResponseSchema = ResponseTemplateSchema;

export type ResponseTemplatesGetResponse = z.infer<
	typeof ResponseTemplatesGetResponseSchema
>;

const ResponseTemplatesCreateInputSchema = z.object({
	name: z.string().min(1),
	body: z.string().min(1),
	is_personal: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('1 creates a personal template when the caller may have one'),
});

export type ResponseTemplatesCreateInput = z.input<
	typeof ResponseTemplatesCreateInputSchema
>;

const ResponseTemplatesCreateResponseSchema = ResponseTemplateSchema;

export type ResponseTemplatesCreateResponse = z.infer<
	typeof ResponseTemplatesCreateResponseSchema
>;

const ResponseTemplatesUpdateInputSchema = z.object({
	id: z.number().int().describe('Response template id'),
	name: z.string().optional(),
	body: z.string().optional(),
	is_personal: z.union([z.literal(0), z.literal(1)]).optional(),
});

export type ResponseTemplatesUpdateInput = z.input<
	typeof ResponseTemplatesUpdateInputSchema
>;

const ResponseTemplatesUpdateResponseSchema = ResponseTemplateSchema;

export type ResponseTemplatesUpdateResponse = z.infer<
	typeof ResponseTemplatesUpdateResponseSchema
>;

// ── staff ─────────────────────────────────────────────────────────────────

const StaffListInputSchema = z.object({
	page: PageSchema,
});

export type StaffListInput = z.input<typeof StaffListInputSchema>;

const StaffListResponseSchema = z
	.object({ staff: z.array(StaffSchema), ...PagingShape })
	.loose();

export type StaffListResponse = z.infer<typeof StaffListResponseSchema>;

const StaffCreateInputSchema = z.object({
	name: z.string().min(1),
	email: z.string().min(1),
	password: z
		.string()
		.min(1)
		.describe('Temporary password; the user must change it at first login'),
});

export type StaffCreateInput = z.input<typeof StaffCreateInputSchema>;

const StaffCreateResponseSchema = StaffSchema;

export type StaffCreateResponse = z.infer<typeof StaffCreateResponseSchema>;

// ── satisfaction ratings ──────────────────────────────────────────────────

const SatisfactionRatingsListInputSchema = z.object({
	brand: z
		.string()
		.optional()
		.describe('Brand URL, or all_brands; omitting it also means all brands'),
	rating: z.number().int().min(1).max(5).optional(),
	assignee_id: z
		.string()
		.optional()
		.describe('Staff member the conversation was assigned to'),
	created_after: z.string().optional().describe('ISO 8601'),
	created_before: z.string().optional().describe('ISO 8601'),
	updated_after: z.string().optional().describe('ISO 8601'),
	updated_before: z.string().optional().describe('ISO 8601'),
	page: PageSchema,
});

export type SatisfactionRatingsListInput = z.input<
	typeof SatisfactionRatingsListInputSchema
>;

const SatisfactionRatingsListResponseSchema = z
	.object({
		satisfaction_ratings: z.array(SatisfactionRatingSchema),
		...PagingShape,
	})
	.loose();

export type SatisfactionRatingsListResponse = z.infer<
	typeof SatisfactionRatingsListResponseSchema
>;

// ── incidents ─────────────────────────────────────────────────────────────

const IncidentsListInputSchema = z.object({});

export type IncidentsListInput = z.input<typeof IncidentsListInputSchema>;

/**
 * Verified live: the route answers a **bare array**, empty on an instance with
 * no incidents. The plugin wraps it under `incidents`.
 */
const IncidentsListResponseSchema = z.object({
	incidents: z.array(IncidentSchema),
});

export type IncidentsListResponse = z.infer<typeof IncidentsListResponseSchema>;

const IncidentsGetInputSchema = z.object({
	identifier: z.string().min(1).describe('Incident id'),
});

export type IncidentsGetInput = z.input<typeof IncidentsGetInputSchema>;

const IncidentsGetResponseSchema = IncidentSchema;

export type IncidentsGetResponse = z.infer<typeof IncidentsGetResponseSchema>;

const IncidentUpdateInputSchema = z.object({
	status: IncidentStatusSchema,
	message: z.string().min(1),
});

const IncidentSystemUpdateInputSchema = z.object({
	/** Existing link id, required to change a system already on the incident. */
	id: z.string().optional(),
	system_id: z.string().min(1),
	status: SystemStatusSchema,
});

const IncidentsCreateInputSchema = z.object({
	title: z.string().min(1),
	updates_attributes: z.array(IncidentUpdateInputSchema).min(1),
	incidents_systems_attributes: z
		.array(IncidentSystemUpdateInputSchema)
		.optional(),
});

export type IncidentsCreateInput = z.input<typeof IncidentsCreateInputSchema>;

const IncidentsCreateResponseSchema = IncidentSchema;

export type IncidentsCreateResponse = z.infer<
	typeof IncidentsCreateResponseSchema
>;

const IncidentsUpdateInputSchema = z.object({
	identifier: z.string().min(1).describe('Incident id'),
	title: z.string().optional(),
	updates_attributes: z
		.array(IncidentUpdateInputSchema)
		.optional()
		.describe('Appends updates to the incident'),
	incidents_systems_attributes: z
		.array(IncidentSystemUpdateInputSchema)
		.optional(),
});

export type IncidentsUpdateInput = z.input<typeof IncidentsUpdateInputSchema>;

const IncidentsUpdateResponseSchema = IncidentSchema;

export type IncidentsUpdateResponse = z.infer<
	typeof IncidentsUpdateResponseSchema
>;

// ── systems ───────────────────────────────────────────────────────────────

const SystemsListInputSchema = z.object({});

export type SystemsListInput = z.input<typeof SystemsListInputSchema>;

/**
 * Verified live: the route answers a **bare array**, empty on an instance with
 * no systems. The plugin wraps it under `systems`.
 */
const SystemsListResponseSchema = z.object({
	systems: z.array(SystemSchema),
});

export type SystemsListResponse = z.infer<typeof SystemsListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ReamazeEndpointInputs = {
	conversationsList: ConversationsListInput;
	conversationsGet: ConversationsGetInput;
	conversationsCreate: ConversationsCreateInput;
	conversationsUpdate: ConversationsUpdateInput;
	messagesList: MessagesListInput;
	messagesCreate: MessagesCreateInput;
	contactsList: ContactsListInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	identitiesList: IdentitiesListInput;
	identitiesCreate: IdentitiesCreateInput;
	notesList: NotesListInput;
	notesCreate: NotesCreateInput;
	notesUpdate: NotesUpdateInput;
	notesDelete: NotesDeleteInput;
	channelsList: ChannelsListInput;
	channelsGet: ChannelsGetInput;
	articlesList: ArticlesListInput;
	articlesGet: ArticlesGetInput;
	articlesCreate: ArticlesCreateInput;
	articlesUpdate: ArticlesUpdateInput;
	reportsVolume: ReportsVolumeInput;
	reportsResponseTime: ReportsResponseTimeInput;
	reportsStaff: ReportsStaffInput;
	reportsTags: ReportsTagsInput;
	reportsChannelSummary: ReportsChannelSummaryInput;
	responseTemplatesList: ResponseTemplatesListInput;
	responseTemplatesGet: ResponseTemplatesGetInput;
	responseTemplatesCreate: ResponseTemplatesCreateInput;
	responseTemplatesUpdate: ResponseTemplatesUpdateInput;
	staffList: StaffListInput;
	staffCreate: StaffCreateInput;
	satisfactionRatingsList: SatisfactionRatingsListInput;
	incidentsList: IncidentsListInput;
	incidentsGet: IncidentsGetInput;
	incidentsCreate: IncidentsCreateInput;
	incidentsUpdate: IncidentsUpdateInput;
	systemsList: SystemsListInput;
};

export type ReamazeEndpointOutputs = {
	conversationsList: ConversationsListResponse;
	conversationsGet: ConversationsGetResponse;
	conversationsCreate: ConversationsCreateResponse;
	conversationsUpdate: ConversationsUpdateResponse;
	messagesList: MessagesListResponse;
	messagesCreate: MessagesCreateResponse;
	contactsList: ContactsListResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	identitiesList: IdentitiesListResponse;
	identitiesCreate: IdentitiesCreateResponse;
	notesList: NotesListResponse;
	notesCreate: NotesCreateResponse;
	notesUpdate: NotesUpdateResponse;
	notesDelete: NotesDeleteResponse;
	channelsList: ChannelsListResponse;
	channelsGet: ChannelsGetResponse;
	articlesList: ArticlesListResponse;
	articlesGet: ArticlesGetResponse;
	articlesCreate: ArticlesCreateResponse;
	articlesUpdate: ArticlesUpdateResponse;
	reportsVolume: ReportsVolumeResponse;
	reportsResponseTime: ReportsResponseTimeResponse;
	reportsStaff: ReportsStaffResponse;
	reportsTags: ReportsTagsResponse;
	reportsChannelSummary: ReportsChannelSummaryResponse;
	responseTemplatesList: ResponseTemplatesListResponse;
	responseTemplatesGet: ResponseTemplatesGetResponse;
	responseTemplatesCreate: ResponseTemplatesCreateResponse;
	responseTemplatesUpdate: ResponseTemplatesUpdateResponse;
	staffList: StaffListResponse;
	staffCreate: StaffCreateResponse;
	satisfactionRatingsList: SatisfactionRatingsListResponse;
	incidentsList: IncidentsListResponse;
	incidentsGet: IncidentsGetResponse;
	incidentsCreate: IncidentsCreateResponse;
	incidentsUpdate: IncidentsUpdateResponse;
	systemsList: SystemsListResponse;
};

export const ReamazeEndpointInputSchemas = {
	conversationsList: ConversationsListInputSchema,
	conversationsGet: ConversationsGetInputSchema,
	conversationsCreate: ConversationsCreateInputSchema,
	conversationsUpdate: ConversationsUpdateInputSchema,
	messagesList: MessagesListInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	contactsList: ContactsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	identitiesList: IdentitiesListInputSchema,
	identitiesCreate: IdentitiesCreateInputSchema,
	notesList: NotesListInputSchema,
	notesCreate: NotesCreateInputSchema,
	notesUpdate: NotesUpdateInputSchema,
	notesDelete: NotesDeleteInputSchema,
	channelsList: ChannelsListInputSchema,
	channelsGet: ChannelsGetInputSchema,
	articlesList: ArticlesListInputSchema,
	articlesGet: ArticlesGetInputSchema,
	articlesCreate: ArticlesCreateInputSchema,
	articlesUpdate: ArticlesUpdateInputSchema,
	reportsVolume: ReportsVolumeInputSchema,
	reportsResponseTime: ReportsResponseTimeInputSchema,
	reportsStaff: ReportsStaffInputSchema,
	reportsTags: ReportsTagsInputSchema,
	reportsChannelSummary: ReportsChannelSummaryInputSchema,
	responseTemplatesList: ResponseTemplatesListInputSchema,
	responseTemplatesGet: ResponseTemplatesGetInputSchema,
	responseTemplatesCreate: ResponseTemplatesCreateInputSchema,
	responseTemplatesUpdate: ResponseTemplatesUpdateInputSchema,
	staffList: StaffListInputSchema,
	staffCreate: StaffCreateInputSchema,
	satisfactionRatingsList: SatisfactionRatingsListInputSchema,
	incidentsList: IncidentsListInputSchema,
	incidentsGet: IncidentsGetInputSchema,
	incidentsCreate: IncidentsCreateInputSchema,
	incidentsUpdate: IncidentsUpdateInputSchema,
	systemsList: SystemsListInputSchema,
} as const;

export const ReamazeEndpointOutputSchemas = {
	conversationsList: ConversationsListResponseSchema,
	conversationsGet: ConversationsGetResponseSchema,
	conversationsCreate: ConversationsCreateResponseSchema,
	conversationsUpdate: ConversationsUpdateResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesCreate: MessagesCreateResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	identitiesList: IdentitiesListResponseSchema,
	identitiesCreate: IdentitiesCreateResponseSchema,
	notesList: NotesListResponseSchema,
	notesCreate: NotesCreateResponseSchema,
	notesUpdate: NotesUpdateResponseSchema,
	notesDelete: NotesDeleteResponseSchema,
	channelsList: ChannelsListResponseSchema,
	channelsGet: ChannelsGetResponseSchema,
	articlesList: ArticlesListResponseSchema,
	articlesGet: ArticlesGetResponseSchema,
	articlesCreate: ArticlesCreateResponseSchema,
	articlesUpdate: ArticlesUpdateResponseSchema,
	reportsVolume: ReportsVolumeResponseSchema,
	reportsResponseTime: ReportsResponseTimeResponseSchema,
	reportsStaff: ReportsStaffResponseSchema,
	reportsTags: ReportsTagsResponseSchema,
	reportsChannelSummary: ReportsChannelSummaryResponseSchema,
	responseTemplatesList: ResponseTemplatesListResponseSchema,
	responseTemplatesGet: ResponseTemplatesGetResponseSchema,
	responseTemplatesCreate: ResponseTemplatesCreateResponseSchema,
	responseTemplatesUpdate: ResponseTemplatesUpdateResponseSchema,
	staffList: StaffListResponseSchema,
	staffCreate: StaffCreateResponseSchema,
	satisfactionRatingsList: SatisfactionRatingsListResponseSchema,
	incidentsList: IncidentsListResponseSchema,
	incidentsGet: IncidentsGetResponseSchema,
	incidentsCreate: IncidentsCreateResponseSchema,
	incidentsUpdate: IncidentsUpdateResponseSchema,
	systemsList: SystemsListResponseSchema,
} as const;
