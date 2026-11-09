import { z } from 'zod';

// ── Shared schemas (Part 1: analytics, contacts, contact books/groups,
// conversations). Schemas come from the examples and property tables of
// https://missiveapp.com/docs/developers/rest-api/endpoints. Response objects
// are .loose() because the documented components are partial views of the
// live payload; request objects are .strict() so typos fail at the boundary.

const MissiveOrganizationRefSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

const MissiveUserRefSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		username: z.string().optional(),
		avatar_url: z.string().optional(),
	})
	.loose();

// Sender/recipient of an email message: { name, address }.
const MissiveFieldRefSchema = z
	.object({
		name: z.string().nullish(),
		address: z.string().nullish(),
	})
	.loose();

const MissiveMessageAttachmentSchema = z
	.object({
		id: z.string().optional(),
		filename: z.string().optional(),
		extension: z.string().optional(),
		url: z.string().optional(),
		media_type: z.string().optional(),
		sub_type: z.string().optional(),
		size: z.number().int().optional(),
		width: z.number().int().optional(),
		height: z.number().int().optional(),
	})
	.loose();

const MissiveTeamRefSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		organization: z.string().optional(),
		active_members: z.array(z.string()).optional(),
		observers: z.array(z.unknown()).optional(), // unknown: team observers are documented only by name in the reference.
	})
	.loose();

const MissiveConversationUserSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		unassigned: z.boolean().optional(),
		closed: z.boolean().optional(),
		archived: z.boolean().optional(),
		trashed: z.boolean().optional(),
		junked: z.boolean().optional(),
		assigned: z.boolean().optional(),
		flagged: z.boolean().optional(),
		snoozed: z.boolean().optional(),
	})
	.loose();

const MissiveAuthorSchema = z
	.object({
		name: z.string().nullish(),
		address: z.string().nullish(),
	})
	.loose();

const MissiveConversationSchema = z
	.object({
		id: z.string().optional(),
		created_at: z.number().int().optional(),
		subject: z.string().nullish(),
		latest_message_subject: z.string().nullish(),
		organization: MissiveOrganizationRefSchema.nullish(),
		color: z.string().nullish(),
		assignees: z.array(MissiveUserRefSchema).optional(),
		users: z.array(MissiveConversationUserSchema).optional(),
		attachments_count: z.number().int().optional(),
		messages_count: z.number().int().optional(),
		authors: z.array(MissiveAuthorSchema).optional(),
		external_authors: z.array(MissiveAuthorSchema).optional(),
		drafts_count: z.number().int().optional(),
		send_later_messages_count: z.number().int().optional(),
		tasks_count: z.number().int().optional(),
		completed_tasks_count: z.number().int().optional(),
		web_url: z.string().optional(),
		app_url: z.string().optional(),
		assignee_names: z.string().optional(),
		assignee_emails: z.string().optional(),
		shared_label_names: z.string().optional(),
		last_activity_at: z.number().int().optional(),
		team: MissiveTeamRefSchema.nullish(),
		shared_labels: z.array(z.string()).optional(),
	})
	.loose();

// ── Contact pieces ────────────────────────────────────────────────────────────

const MissiveContactBookSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		user: z.string().optional(),
		organization: z.string().nullish(),
		share_with_organization: z.boolean().optional(),
		share_with_team: z.string().nullish(),
		share_with_users: z.array(z.string()).optional(),
		description: z.string().nullish(),
		importing: z.boolean().optional(),
		import_error_text: z.string().nullish(),
		import_rows_count: z.number().int().optional(),
		import_processed_rows_count: z.number().int().optional(),
	})
	.loose();

const MissiveContactGroupSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

// One `infos` entry; the required fields differ per kind, so the union keeps
// the provider's own per-kind contract instead of one loose blob.
const MissiveContactInfoSchema = z.discriminatedUnion('kind', [
	z
		.object({
			kind: z.literal('email'),
			value: z.string(),
			label: z.enum(['home', 'work', 'personal', 'other']),
			custom_label: z.string().optional(),
		})
		.loose(),
	z
		.object({
			kind: z.literal('phone_number'),
			value: z.string(),
			label: z.enum([
				'main',
				'mobile',
				'home',
				'work',
				'home_fax',
				'work_fax',
				'other_fax',
				'pager',
				'other',
			]),
			custom_label: z.string().optional(),
		})
		.loose(),
	z
		.object({
			kind: z.literal('twitter'),
			value: z.string(),
			label: z.enum(['work', 'personal', 'other']),
			custom_label: z.string().optional(),
		})
		.loose(),
	z
		.object({
			kind: z.literal('facebook'),
			name: z.string(),
			label: z.enum(['work', 'personal', 'other']),
			custom_label: z.string().optional(),
		})
		.loose(),
	z
		.object({
			kind: z.literal('physical_address'),
			street: z.string().optional(),
			extended_address: z.string().optional(),
			city: z.string().optional(),
			region: z.string().optional(),
			postal_code: z.string().optional(),
			po_box: z.string().optional(),
			country: z.string().optional(),
			label: z.enum(['work', 'home', 'other']),
			custom_label: z.string().optional(),
		})
		.loose(),
	z
		.object({
			kind: z.literal('url'),
			value: z.string(),
			label: z.enum([
				'homepage',
				'profile',
				'blog',
				'work',
				'personal',
				'other',
			]),
			custom_label: z.string().optional(),
		})
		.loose(),
	z
		.object({
			kind: z.literal('custom'),
			value: z.string(),
			label: z.literal('other'),
			custom_label: z.string().optional(),
		})
		.loose(),
]);

const MissiveMembershipGroupSchema = z
	.object({
		kind: z.enum(['group', 'organization']),
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

const MissiveMembershipSchema = z
	.object({
		department: z.string().optional(),
		title: z.string().optional(),
		location: z.string().optional(),
		description: z.string().optional(),
		group: MissiveMembershipGroupSchema,
	})
	.loose();

const MissiveContactSchema = z
	.object({
		id: z.string().optional(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		middle_name: z.string().nullish(),
		phonetic_first_name: z.string().nullish(),
		phonetic_last_name: z.string().nullish(),
		phonetic_middle_name: z.string().nullish(),
		prefix: z.string().nullish(),
		suffix: z.string().nullish(),
		nickname: z.string().nullish(),
		file_as: z.string().nullish(),
		notes: z.string().nullish(),
		starred: z.boolean().nullish(),
		gender: z.string().nullish(),
		contact_book: z.string().optional(),
		deleted: z.boolean().optional(),
		modified_at: z.number().int().optional(),
		infos: z.array(MissiveContactInfoSchema).optional(),
		memberships: z.array(MissiveMembershipSchema).optional(),
	})
	.loose();

// ── Conversation entry pieces ────────────────────────────────────────────────

const MissiveMessageSchema = z
	.object({
		id: z.string().optional(),
		subject: z.string().nullish(),
		draft: z.boolean().optional(),
		preview: z.string().optional(),
		type: z.string().optional(),
		delivered_at: z.number().int().nullish(),
		updated_at: z.number().int().optional(),
		created_at: z.number().int().optional(),
		email_message_id: z.string().nullish(),
		in_reply_to: z.array(z.string()).optional(),
		references: z.array(z.string()).optional(),
		from_field: MissiveFieldRefSchema.nullish(),
		to_fields: z.array(MissiveFieldRefSchema).optional(),
		cc_fields: z.array(MissiveFieldRefSchema).optional(),
		bcc_fields: z.array(MissiveFieldRefSchema).optional(),
		reply_to_fields: z.array(MissiveFieldRefSchema).optional(),
		attachments: z.array(MissiveMessageAttachmentSchema).optional(),
		author: MissiveUserRefSchema.nullish(),
	})
	.loose();

const MissiveCommentSchema = z
	.object({
		id: z.string().optional(),
		body: z.string().optional(),
		created_at: z.number().int().optional(),
		mentions: z
			.array(
				z
					.object({
						id: z.string().optional(),
						index: z.number().int().optional(),
						length: z.number().int().optional(),
					})
					.loose(),
			)
			.optional(),
		author: MissiveUserRefSchema.nullish(),
	})
	.loose();

const MissivePostSchema = z
	.object({
		id: z.string().optional(),
		created_at: z.number().int().optional(),
		username: z.string().nullish(),
		username_icon: z.string().nullish(),
		conversation_icon: z.string().nullish(),
		notification: z
			.object({
				title: z.string().optional(),
				body: z.string().optional(),
			})
			.loose()
			.nullish(),
		text: z.string().nullish(),
		markdown: z.string().nullish(),
		attachments: z
			.array(
				// unknown: post attachments are free-form rich-content blocks the
				// provider renders generically; only the example fields are known.
				z.record(z.string(), z.unknown()),
			)
			.optional(),
	})
	.loose();

// ── Per-operation schemas ─────────────────────────────────────────────────────

const MissiveAccountTypeSchema = z.enum([
	'custom',
	'email',
	'instagram',
	'live_chat',
	'messenger',
	'sms',
	'whatsapp',
]);

const MissiveAnalyticsCreateReportInputSchema = z
	.object({
		body: z
			.object({
				organization: z.string().min(1),
				start: z.number().int(),
				end: z.number().int(),
				time_zone: z.string().optional(),
				teams: z.array(z.string()).optional(),
				users: z.array(z.string()).optional(),
				accounts: z.array(z.string()).optional(),
				account_types: z.array(MissiveAccountTypeSchema).optional(),
				shared_labels: z.array(z.string()).optional(),
			})
			.strict(),
	})
	.strict();

const MissiveAnalyticsCreateReportOutputSchema = z
	.object({
		reports: z
			.object({
				id: z.string().optional(),
			})
			.loose(),
	})
	.loose();

const MissiveIdInputSchema = z.object({ id: z.string().min(1) }).strict();

// The report contents depend on the requested metrics and filters, so only
// the object envelope is validated and the payload stays provider-defined.
const MissiveAnalyticsGetReportOutputSchema = z.record(z.string(), z.unknown());

const MissiveContactCreateInputSchema = z
	.object({
		body: z.array(MissiveContactSchema).min(1),
	})
	.strict();

const MissiveContactUpdateInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
		body: z.array(MissiveContactSchema).min(1),
	})
	.strict()
	.refine((input) => input.body.length === input.ids.length, {
		message:
			'Missive requires exactly one contacts object per id passed in the URL',
	});

const MissiveContactListInputSchema = z
	.object({
		contact_book: z.string().min(1),
		order: z.enum(['last_name', 'last_modified']).optional(),
		limit: z.number().int().min(1).max(200).optional(),
		offset: z.number().int().min(0).optional(),
		modified_since: z.number().int().optional(),
		include_deleted: z.boolean().optional(),
		search: z.string().optional(),
	})
	.strict();

const MissiveContactListOutputSchema = z
	.object({
		contacts: z.array(MissiveContactSchema),
	})
	.loose();

// Missive documents single-resource envelopes inconsistently: GET
// /conversations/:id answers {conversations:[...]}, GET /messages/:id answers
// {messages:{...}}, and the GET /contacts/:id envelope is undocumented, so
// the value accepts both the object and the array form.
const MissiveContactGetOutputSchema = z
	.object({
		contacts: z.union([MissiveContactSchema, z.array(MissiveContactSchema)]),
	})
	.loose();

const MissiveContactBookListOutputSchema = z
	.object({
		contact_books: z.array(MissiveContactBookSchema),
	})
	.loose();

const MissiveContactBookListInputSchema = z
	.object({
		limit: z.number().int().min(1).max(200).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

const MissiveContactGroupListInputSchema = z
	.object({
		contact_book: z.string().min(1),
		kind: z.enum(['group', 'organization']),
		limit: z.number().int().min(1).max(200).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

const MissiveContactGroupListOutputSchema = z
	.object({
		contact_groups: z.array(MissiveContactGroupSchema),
	})
	.loose();

const MissiveConversationListInputSchema = z
	.object({
		limit: z.number().int().min(1).max(50).optional(),
		until: z.number().int().optional(),
		inbox: z.boolean().optional(),
		all: z.boolean().optional(),
		assigned: z.boolean().optional(),
		closed: z.boolean().optional(),
		snoozed: z.boolean().optional(),
		flagged: z.boolean().optional(),
		trashed: z.boolean().optional(),
		junked: z.boolean().optional(),
		drafts: z.boolean().optional(),
		shared_label: z.string().optional(),
		team_inbox: z.string().optional(),
		team_closed: z.string().optional(),
		team_all: z.string().optional(),
		organization: z.string().optional(),
		email: z.string().optional(),
		domain: z.string().optional(),
		contact_organization: z.string().optional(),
	})
	.strict()
	.refine(
		(input) =>
			Boolean(
				input.inbox ||
					input.all ||
					input.assigned ||
					input.closed ||
					input.snoozed ||
					input.flagged ||
					input.trashed ||
					input.junked ||
					input.drafts ||
					input.shared_label ||
					input.team_inbox ||
					input.team_closed ||
					input.team_all,
			),
		{
			message:
				'Missive requires at least one mailbox filter (inbox, all, assigned, closed, snoozed, flagged, trashed, junked, drafts, shared_label, team_inbox, team_closed, team_all)',
		},
	)
	.refine(
		(input) =>
			[input.email, input.domain, input.contact_organization].filter(
				(value) => value !== undefined,
			).length <= 1,
		{
			message:
				'The email, domain, and contact_organization filters are mutually exclusive',
		},
	);

const MissiveConversationListOutputSchema = z
	.object({
		conversations: z.array(MissiveConversationSchema),
	})
	.loose();

const MissiveConversationGetOutputSchema = z
	.object({
		conversations: z.array(MissiveConversationSchema),
	})
	.loose();

const MissiveConversationUpdateInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
		body: z
			.array(
				z
					.object({
						id: z.string().min(1),
						subject: z.string().optional(),
						color: z.string().optional(),
						conversation_color: z.string().optional(),
						organization: z.string().optional(),
						team: z.string().optional(),
						force_team: z.boolean().optional(),
						add_users: z.array(z.string()).optional(),
						add_assignees: z.array(z.string()).optional(),
						remove_assignees: z.array(z.string()).optional(),
						add_shared_labels: z.array(z.string()).optional(),
						remove_shared_labels: z.array(z.string()).optional(),
						add_to_inbox: z.boolean().optional(),
						add_to_team_inbox: z.boolean().optional(),
						close: z.boolean().optional(),
						reopen: z.boolean().optional(),
					})
					.strict(),
			)
			.min(1),
	})
	.strict()
	.refine((input) => input.body.length === input.ids.length, {
		message:
			'Missive requires exactly one conversations object per id passed in the URL',
	});

const MissiveConversationUpdateOutputSchema = z
	.object({
		conversations: z.array(MissiveConversationSchema),
	})
	.loose();

const MissiveLimitUntilInputSchema = z
	.object({
		id: z.string().min(1),
		limit: z.number().int().min(1).max(10).optional(),
		until: z.number().int().optional(),
	})
	.strict();

const MissiveConversationMessagesOutputSchema = z
	.object({
		messages: z.array(MissiveMessageSchema),
	})
	.loose();

const MissiveConversationCommentsOutputSchema = z
	.object({
		comments: z.array(MissiveCommentSchema),
	})
	.loose();

const MissiveConversationDraftsOutputSchema = z
	.object({
		drafts: z.array(MissiveMessageSchema),
	})
	.loose();

const MissiveConversationPostsOutputSchema = z
	.object({
		posts: z.array(MissivePostSchema),
	})
	.loose();

const MissiveConversationMergeInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				target: z.string().min(1),
				subject: z.string().optional(),
			})
			.strict(),
	})
	.strict();

const MissiveConversationMergeOutputSchema = z
	.object({
		conversations: z.array(MissiveConversationSchema),
	})
	.loose();

// ── Registries ────────────────────────────────────────────────────────────────

export const MissiveEndpointInputSchemas = {
	'analytics.createReport': MissiveAnalyticsCreateReportInputSchema,
	'analytics.getReport': MissiveIdInputSchema,
	'contacts.create': MissiveContactCreateInputSchema,
	'contacts.update': MissiveContactUpdateInputSchema,
	'contacts.list': MissiveContactListInputSchema,
	'contacts.get': MissiveIdInputSchema,
	'contactBooks.list': MissiveContactBookListInputSchema,
	'contactGroups.list': MissiveContactGroupListInputSchema,
	'conversations.list': MissiveConversationListInputSchema,
	'conversations.get': MissiveIdInputSchema,
	'conversations.update': MissiveConversationUpdateInputSchema,
	'conversations.listMessages': MissiveLimitUntilInputSchema,
	'conversations.listComments': MissiveLimitUntilInputSchema,
	'conversations.listDrafts': MissiveLimitUntilInputSchema,
	'conversations.listPosts': MissiveLimitUntilInputSchema,
	'conversations.merge': MissiveConversationMergeInputSchema,
} as const;

export const MissiveEndpointOutputSchemas = {
	'analytics.createReport': MissiveAnalyticsCreateReportOutputSchema,
	'analytics.getReport': MissiveAnalyticsGetReportOutputSchema,
	'contacts.create': MissiveContactListOutputSchema,
	'contacts.update': MissiveContactListOutputSchema,
	'contacts.list': MissiveContactListOutputSchema,
	'contacts.get': MissiveContactGetOutputSchema,
	'contactBooks.list': MissiveContactBookListOutputSchema,
	'contactGroups.list': MissiveContactGroupListOutputSchema,
	'conversations.list': MissiveConversationListOutputSchema,
	'conversations.get': MissiveConversationGetOutputSchema,
	'conversations.update': MissiveConversationUpdateOutputSchema,
	'conversations.listMessages': MissiveConversationMessagesOutputSchema,
	'conversations.listComments': MissiveConversationCommentsOutputSchema,
	'conversations.listDrafts': MissiveConversationDraftsOutputSchema,
	'conversations.listPosts': MissiveConversationPostsOutputSchema,
	'conversations.merge': MissiveConversationMergeOutputSchema,
} as const;

export type MissiveEndpointInputs = {
	[K in keyof typeof MissiveEndpointInputSchemas]: z.infer<
		(typeof MissiveEndpointInputSchemas)[K]
	>;
};

export type MissiveEndpointOutputs = {
	[K in keyof typeof MissiveEndpointOutputSchemas]: z.infer<
		(typeof MissiveEndpointOutputSchemas)[K]
	>;
};

export type MissiveConversation = z.infer<typeof MissiveConversationSchema>;
export type MissiveContact = z.infer<typeof MissiveContactSchema>;
export type MissiveMessage = z.infer<typeof MissiveMessageSchema>;
export type MissiveComment = z.infer<typeof MissiveCommentSchema>;
export type MissivePost = z.infer<typeof MissivePostSchema>;
export type MissiveContactBook = z.infer<typeof MissiveContactBookSchema>;
export type MissiveContactGroup = z.infer<typeof MissiveContactGroupSchema>;
