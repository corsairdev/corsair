import { z } from 'zod';

// ── Shared schemas (Part 1: analytics, contacts, contact books/groups,
// conversations). Schemas come from the examples and property tables of
// https://missiveapp.com/docs/developers/rest-api/endpoints. Response objects
// are .loose() because the documented components are partial views of the
// live payload, and their fields accept null and unknown enum values so one
// unexpected record cannot fail a whole page; request objects are .strict()
// so typos fail at the boundary.

const MissiveOrganizationRefSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const MissiveUserRefSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		username: z.string().nullish(),
		avatar_url: z.string().nullish(),
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
		id: z.string().nullish(),
		filename: z.string().nullish(),
		extension: z.string().nullish(),
		url: z.string().nullish(),
		media_type: z.string().nullish(),
		sub_type: z.string().nullish(),
		size: z.number().int().nullish(),
		width: z.number().int().nullish(),
		height: z.number().int().nullish(),
	})
	.loose();

const MissiveTeamRefSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		organization: z.string().nullish(),
		active_members: z.array(z.string()).nullish(),
		observers: z.array(z.unknown()).nullish(), // unknown: team observers are documented only by name in the reference.
	})
	.loose();

const MissiveConversationUserSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		unassigned: z.boolean().nullish(),
		closed: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		trashed: z.boolean().nullish(),
		junked: z.boolean().nullish(),
		assigned: z.boolean().nullish(),
		flagged: z.boolean().nullish(),
		snoozed: z.boolean().nullish(),
	})
	.loose();

const MissiveAuthorSchema = z
	.object({
		name: z.string().nullish(),
		address: z.string().nullish(),
	})
	.loose();

const MissiveSharedLabelRefSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const MissiveConversationSchema = z
	.object({
		id: z.string().nullish(),
		created_at: z.number().int().nullish(),
		subject: z.string().nullish(),
		latest_message_subject: z.string().nullish(),
		organization: MissiveOrganizationRefSchema.nullish(),
		color: z.string().nullish(),
		assignees: z.array(MissiveUserRefSchema).nullish(),
		users: z.array(MissiveConversationUserSchema).nullish(),
		attachments_count: z.number().int().nullish(),
		messages_count: z.number().int().nullish(),
		authors: z.array(MissiveAuthorSchema).nullish(),
		external_authors: z.array(MissiveAuthorSchema).nullish(),
		drafts_count: z.number().int().nullish(),
		send_later_messages_count: z.number().int().nullish(),
		tasks_count: z.number().int().nullish(),
		completed_tasks_count: z.number().int().nullish(),
		web_url: z.string().nullish(),
		app_url: z.string().nullish(),
		assignee_names: z.string().nullish(),
		assignee_emails: z.string().nullish(),
		shared_label_names: z.string().nullish(),
		last_activity_at: z.number().int().nullish(),
		team: MissiveTeamRefSchema.nullish(),
		// Documented as "Array of shared label objects" and shown as
		// [{ id, name }] in the Get a Message example; ids are accepted too.
		shared_labels: z
			.array(z.union([z.string(), MissiveSharedLabelRefSchema]))
			.nullish(),
	})
	.loose();

// ── Contact pieces ────────────────────────────────────────────────────────────

const MissiveContactBookSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		user: z.string().nullish(),
		organization: z.string().nullish(),
		share_with_organization: z.boolean().nullish(),
		share_with_team: z.string().nullish(),
		share_with_users: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		importing: z.boolean().nullish(),
		import_error_text: z.string().nullish(),
		import_rows_count: z.number().int().nullish(),
		import_processed_rows_count: z.number().int().nullish(),
	})
	.loose();

const MissiveContactGroupSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

// One `infos` entry of a request; the required fields differ per kind, so the
// union keeps the provider's own per-kind contract instead of one loose blob.
// Entries stay .loose() because an update must send back every info it wants
// to keep, including whatever extra keys Missive returned on the read.
const MissiveContactInfoInputSchema = z.discriminatedUnion('kind', [
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
			// The reference marks label required, but its own List contacts
			// example returns a custom info without one; a read-then-update
			// round trip must not fail here.
			label: z.literal('other').optional(),
			custom_label: z.string().optional(),
		})
		.loose(),
]);

const MissiveMembershipGroupInputSchema = z
	.object({
		kind: z.enum(['group', 'organization']),
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();

const MissiveMembershipInputSchema = z
	.object({
		department: z.string().optional(),
		title: z.string().optional(),
		location: z.string().optional(),
		description: z.string().optional(),
		group: MissiveMembershipGroupInputSchema,
	})
	.loose();

// Request-side contact attributes, as listed under Create contact(s). Strict,
// so a mistyped attribute fails here instead of being dropped by Missive.
const MissiveContactAttributesShape = {
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
	infos: z.array(MissiveContactInfoInputSchema).optional(),
	memberships: z.array(MissiveMembershipInputSchema).optional(),
};

const MissiveContactCreateItemSchema = z
	.object({
		contact_book: z.string().min(1),
		...MissiveContactAttributesShape,
	})
	.strict();

const MissiveContactUpdateItemSchema = z
	.object({
		id: z.string().min(1),
		contact_book: z.string().min(1).optional(),
		...MissiveContactAttributesShape,
	})
	.strict();

// Response-side contact info. Only field types are checked: Missive's own
// List contacts example returns a custom info without a label, and a kind or
// label added later must not fail a whole page of contacts.
const MissiveContactInfoSchema = z
	.object({
		kind: z.string().nullish(),
		label: z.string().nullish(),
		custom_label: z.string().nullish(),
		value: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const MissiveMembershipGroupSchema = z
	.object({
		kind: z.string().nullish(),
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const MissiveMembershipSchema = z
	.object({
		department: z.string().nullish(),
		title: z.string().nullish(),
		location: z.string().nullish(),
		description: z.string().nullish(),
		group: MissiveMembershipGroupSchema.nullish(),
	})
	.loose();

const MissiveContactSchema = z
	.object({
		id: z.string().nullish(),
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
		contact_book: z.string().nullish(),
		deleted: z.boolean().nullish(),
		modified_at: z.number().int().nullish(),
		infos: z.array(MissiveContactInfoSchema).nullish(),
		memberships: z.array(MissiveMembershipSchema).nullish(),
	})
	.loose();

// ── Conversation entry pieces ────────────────────────────────────────────────

const MissiveMessageSchema = z
	.object({
		id: z.string().nullish(),
		subject: z.string().nullish(),
		draft: z.boolean().nullish(),
		preview: z.string().nullish(),
		type: z.string().nullish(),
		delivered_at: z.number().int().nullish(),
		updated_at: z.number().int().nullish(),
		created_at: z.number().int().nullish(),
		email_message_id: z.string().nullish(),
		in_reply_to: z.array(z.string()).nullish(),
		references: z.array(z.string()).nullish(),
		from_field: MissiveFieldRefSchema.nullish(),
		to_fields: z.array(MissiveFieldRefSchema).nullish(),
		cc_fields: z.array(MissiveFieldRefSchema).nullish(),
		bcc_fields: z.array(MissiveFieldRefSchema).nullish(),
		reply_to_fields: z.array(MissiveFieldRefSchema).nullish(),
		attachments: z.array(MissiveMessageAttachmentSchema).nullish(),
		author: MissiveUserRefSchema.nullish(),
	})
	.loose();

const MissiveCommentSchema = z
	.object({
		id: z.string().nullish(),
		body: z.string().nullish(),
		created_at: z.number().int().nullish(),
		mentions: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						index: z.number().int().nullish(),
						length: z.number().int().nullish(),
					})
					.loose(),
			)
			.nullish(),
		author: MissiveUserRefSchema.nullish(),
	})
	.loose();

const MissivePostSchema = z
	.object({
		id: z.string().nullish(),
		created_at: z.number().int().nullish(),
		username: z.string().nullish(),
		username_icon: z.string().nullish(),
		conversation_icon: z.string().nullish(),
		notification: z
			.object({
				title: z.string().nullish(),
				body: z.string().nullish(),
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
			.nullish(),
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
// Batch routes take an ids array; the factory joins them with commas.
const MissiveIdsInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
	})
	.strict();

// The report contents depend on the requested metrics and filters, so only
// the object envelope is validated and the payload stays provider-defined.
const MissiveAnalyticsGetReportOutputSchema = z.record(z.string(), z.unknown());

const MissiveContactCreateInputSchema = z
	.object({
		body: z.array(MissiveContactCreateItemSchema).min(1),
	})
	.strict();

const MissiveContactUpdateInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
		body: z.array(MissiveContactUpdateItemSchema).min(1),
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

// ── Part 2 shared pieces (drafts, messages, organizations, responses,
// posts). Envelope keys and field names stay provider-verbatim.

// Sender/recipient across channels: email uses address/name, SMS and
// WhatsApp use phone_number (plus type for WhatsApp), Messenger/Instagram
// and custom channels use id/username/name.
const MissiveChannelFieldRefSchema = z
	.object({
		name: z.string().nullish(),
		address: z.string().nullish(),
		phone_number: z.string().nullish(),
		type: z
			.enum(['signalwire', 'twilio', 'twilio_whatsapp', 'whatsapp'])
			.nullish(),
		id: z.string().nullish(),
		username: z.string().nullish(),
	})
	.loose();

const MissiveUploadAttachmentSchema = z
	.object({
		base64_data: z.string(),
		filename: z.string(),
	})
	.strict();

const MissiveOrganizationSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const MissiveResponseSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		body: z.string().nullish(),
		subject: z.string().nullish(),
		modified_at: z.number().int().nullish(),
		organization: z.string().nullish(),
		user: z.string().nullish(),
		share_with_team: z.string().nullish(),
		shared_labels: z.array(z.string()).nullish(),
		to_fields: z.array(MissiveFieldRefSchema).nullish(),
		cc_fields: z.array(MissiveFieldRefSchema).nullish(),
		bcc_fields: z.array(MissiveFieldRefSchema).nullish(),
		attachments: z.array(MissiveMessageAttachmentSchema).nullish(),
		external_id: z.string().nullish(),
		external_source: z.string().nullish(),
	})
	.loose();

// Conversation scoping and state fields shared by the draft, message, and
// post creation payloads; every one is optional there.
const MissiveConversationScopingShape = {
	team: z.string().optional(),
	force_team: z.boolean().optional(),
	organization: z.string().optional(),
	add_users: z.array(z.string()).optional(),
	add_assignees: z.array(z.string()).optional(),
	remove_assignees: z.array(z.string()).optional(),
	conversation_subject: z.string().optional(),
	conversation_color: z.string().optional(),
	add_shared_labels: z.array(z.string()).optional(),
	remove_shared_labels: z.array(z.string()).optional(),
	add_to_inbox: z.boolean().optional(),
	add_to_team_inbox: z.boolean().optional(),
	close: z.boolean().optional(),
	reopen: z.boolean().optional(),
};

const MissiveDraftsCreateInputSchema = z
	.object({
		body: z
			.object({
				subject: z.string().nullish(),
				body: z.string().nullish(),
				quote_previous_message: z.boolean().optional(),
				add_default_signature: z.boolean().optional(),
				from_field: MissiveChannelFieldRefSchema.nullish(),
				to_fields: z.array(MissiveChannelFieldRefSchema).optional(),
				cc_fields: z.array(MissiveChannelFieldRefSchema).optional(),
				bcc_fields: z.array(MissiveChannelFieldRefSchema).optional(),
				account: z.string().optional(),
				attachments: z.array(MissiveUploadAttachmentSchema).optional(),
				references: z.array(z.string()).optional(),
				conversation: z.string().optional(),
				...MissiveConversationScopingShape,
				send: z.boolean().optional(),
				send_at: z.number().int().optional(),
				auto_followup: z.boolean().optional(),
				external_response_id: z.string().optional(),
				// unknown: WhatsApp template variables are caller-defined placeholder values.
				external_response_variables: z
					.record(z.string(), z.unknown())
					.optional(),
			})
			.strict()
			.refine((body) => !(body.send === true && body.send_at !== undefined), {
				message: 'send_at cannot be combined with send true',
			})
			.refine(
				(body) => !(body.auto_followup === true && body.send_at === undefined),
				{ message: 'send_at is required when auto_followup is true' },
			),
	})
	.strict();

// Missive does not document the create-draft body: successful POSTs may
// return 201 with no body, and the delete-draft route says the draft id is
// returned in the create response. Accept both documented forms under the
// provider's plural-key envelope convention.
const MissiveDraftsCreateOutputSchema = z.union([
	z.undefined(),
	z
		.object({
			drafts: z.union([MissiveMessageSchema, z.array(MissiveMessageSchema)]),
		})
		.loose(),
]);

const MissiveDraftsDeleteOutputSchema = z.undefined();

const MissiveMessagesCreateInputSchema = z
	.object({
		body: z
			.object({
				account: z.string().min(1),
				subject: z.string().nullish(),
				body: z.string().nullish(),
				from_field: MissiveChannelFieldRefSchema,
				to_fields: z.array(MissiveChannelFieldRefSchema).optional(),
				cc_fields: z.array(MissiveChannelFieldRefSchema).optional(),
				bcc_fields: z.array(MissiveChannelFieldRefSchema).optional(),
				delivered_at: z.number().int().optional(),
				attachments: z.array(MissiveUploadAttachmentSchema).optional(),
				external_id: z.string().optional(),
				references: z.array(z.string()).optional(),
				conversation: z.string().optional(),
				...MissiveConversationScopingShape,
			})
			.strict(),
	})
	.strict();

// Missive does not document the create-message body; the same tolerant
// create-output union as drafts applies.
const MissiveMessagesCreateOutputSchema = z.union([
	z.undefined(),
	z
		.object({
			messages: z.union([MissiveMessageSchema, z.array(MissiveMessageSchema)]),
		})
		.loose(),
]);

// Documented verbatim: a single id answers {messages: {object}} while
// comma-separated ids answer {messages: [array]}.
const MissiveMessagesGetOutputSchema = z
	.object({
		messages: z.union([MissiveMessageSchema, z.array(MissiveMessageSchema)]),
	})
	.loose();

const MissiveMessagesListInputSchema = z
	.object({
		email_message_id: z.string().min(1),
	})
	.strict();

const MissiveMessagesListOutputSchema = z
	.object({
		messages: z.array(MissiveMessageSchema),
	})
	.loose();

const MissiveOrganizationListInputSchema = z
	.object({
		limit: z.number().int().min(1).max(200).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

const MissiveOrganizationListOutputSchema = z
	.object({
		organizations: z.array(MissiveOrganizationSchema),
	})
	.loose();

const MissiveResponseListInputSchema = z
	.object({
		organization: z.string().optional(),
		limit: z.number().int().min(1).max(200).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

const MissiveResponseListOutputSchema = z
	.object({
		responses: z.array(MissiveResponseSchema),
	})
	.loose();

// The reference documents the response item shape for the whole family but
// not the single-resource envelope (Missive mixes object and array values
// under the plural key), so the value accepts both forms.
const MissiveResponseGetOutputSchema = z
	.object({
		responses: z.union([MissiveResponseSchema, z.array(MissiveResponseSchema)]),
	})
	.loose();

// A response attachment in a request: a new file (`base64_data`, `filename`,
// and a temporary `id` for an inline image), or an attachment Missive already
// returned, sent back so an update keeps it. Loose for that second form.
const MissiveResponseAttachmentInputSchema = z
	.object({
		id: z.string().optional(),
		filename: z.string().optional(),
		base64_data: z.string().optional(),
	})
	.loose();

// Request-side saved-response attributes, as listed under Create response(s).
const MissiveResponseAttributesShape = {
	title: z.string().max(500).optional(),
	body: z.string().optional(),
	subject: z.string().max(500).nullish(),
	organization: z.string().min(1).optional(),
	user: z.string().min(1).optional(),
	share_with_team: z.string().nullish(),
	shared_labels: z.array(z.string()).optional(),
	to_fields: z.array(MissiveFieldRefSchema).optional(),
	cc_fields: z.array(MissiveFieldRefSchema).optional(),
	bcc_fields: z.array(MissiveFieldRefSchema).optional(),
	external_id: z.string().nullish(),
	external_source: z.string().nullish(),
	attachments: z.array(MissiveResponseAttachmentInputSchema).optional(),
};

const MissiveResponseCreateInputSchema = z
	.object({
		body: z
			.array(
				z
					.object(MissiveResponseAttributesShape)
					.strict()
					.refine(
						(response) =>
							(response.organization === undefined) !==
							(response.user === undefined),
						{
							message: 'Either organization or user is required, but not both',
						},
					),
			)
			.min(1),
	})
	.strict();

const MissiveResponseUpdateInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
		body: z
			.array(
				z
					.object({
						id: z.string().min(1),
						...MissiveResponseAttributesShape,
					})
					.strict(),
			)
			.min(1),
	})
	.strict()
	.refine((input) => input.body.length === input.ids.length, {
		message:
			'Missive requires exactly one responses object per id passed in the URL',
	});

const MissiveResponseDeleteOutputSchema = z.undefined();

const MissivePostsCreateInputSchema = z
	.object({
		body: z
			.object({
				conversation: z.string().optional(),
				references: z.array(z.string()).optional(),
				username: z.string().optional(),
				username_icon: z.string().optional(),
				conversation_icon: z.string().optional(),
				text: z.string().optional(),
				markdown: z.string().optional(),
				notification: z
					.object({
						title: z.string().optional(),
						body: z.string().optional(),
					})
					.loose(),
				attachments: z
					.array(
						// unknown: post attachments are free-form rich-content blocks the
						// provider renders generically; only the example fields are known.
						z.record(z.string(), z.unknown()),
					)
					.optional(),
				...MissiveConversationScopingShape,
			})
			.strict()
			.refine(
				(body) =>
					(body.text !== undefined && body.text.length > 0) ||
					(body.markdown !== undefined && body.markdown.length > 0) ||
					(body.attachments !== undefined && body.attachments.length > 0),
				{ message: 'One of text, markdown, or attachments is required' },
			)
			.refine((body) => body.text === undefined || body.text.length <= 8000, {
				message: 'text is limited to 8000 characters',
			})
			.refine(
				(body) => body.markdown === undefined || body.markdown.length <= 8000,
				{ message: 'markdown is limited to 8000 characters' },
			),
	})
	.strict();

// The reference documents only the conversation and post ids in the create
// response, under the provider's plural-key envelope convention.
const MissivePostsCreateOutputSchema = z
	.object({
		posts: z
			.object({
				conversation: z.string().optional(),
				id: z.string().optional(),
			})
			.loose(),
	})
	.loose();

const MissivePostsDeleteOutputSchema = z.undefined();

// ── Part 3 shared pieces (shared labels, teams, users, tasks, hooks) ─────

const MissiveSharedLabelSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		name_with_parent_names: z.string().nullish(),
		organization: z.string().nullish(),
		color: z.string().nullish(),
		parent: z.string().nullish(),
		share_with_organization: z.boolean().nullish(),
		share_with_team: z.string().nullish(),
		share_with_users: z.array(z.string()).nullish(),
		// A string in responses; documented today: organization, delegates.
		visibility: z.string().nullish(),
	})
	.loose();

const MissiveOrgPageListInputSchema = z
	.object({
		organization: z.string().optional(),
		limit: z.number().int().min(1).max(200).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

const MissiveSharedLabelListOutputSchema = z
	.object({
		shared_labels: z.array(MissiveSharedLabelSchema),
	})
	.loose();

const MissiveSharedLabelCreateInputSchema = z
	.object({
		body: z
			.array(
				z
					.object({
						name: z.string().min(1),
						organization: z.string().min(1),
						color: z.string().optional(),
						parent: z.string().optional(),
						share_with_organization: z.boolean().optional(),
						share_with_team: z.string().nullish(),
						share_with_users: z.array(z.string()).optional(),
						visibility: z.enum(['organization', 'delegates']).optional(),
					})
					.strict(),
			)
			.min(1),
	})
	.strict();

const MissiveSharedLabelUpdateInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
		body: z
			.array(
				z
					.object({
						id: z.string().min(1),
						name: z.string().optional(),
						organization: z.string().optional(),
						color: z.string().optional(),
						parent: z.string().optional(),
						share_with_organization: z.boolean().optional(),
						share_with_team: z.string().nullish(),
						share_with_users: z.array(z.string()).optional(),
						visibility: z.enum(['organization', 'delegates']).optional(),
					})
					.strict(),
			)
			.min(1),
	})
	.strict()
	.refine((input) => input.body.length === input.ids.length, {
		message:
			'Missive requires exactly one shared_labels object per id passed in the URL',
	});

// Business-hours day windows as documented: one entry per weekday with the
// second offsets the team covers.
const MissiveBusinessHoursSchema = z
	.object({
		tz: z.string().optional(),
		t: z
			.array(
				z
					.object({
						d: z.number().int().optional(),
						s: z.array(z.number().int()).optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const MissiveTeamBehaviorShape = {
	team_mention_behavior: z
		.enum(['only_active_members', 'all_members'])
		.optional(),
	user_reply_behavior: z
		.enum(['assign_user', 'leave_in_team_inbox'])
		.optional(),
	received_reply_behavior: z
		.enum(['show_in_assignee_inbox', 'show_in_team_inbox'])
		.optional(),
	team_sidebar_behavior: z
		.enum(['show_team_space', 'show_team_inbox'])
		.optional(),
	team_inbox_enabled: z.boolean().optional(),
	chat_room_enabled: z.boolean().optional(),
};

const MissiveTeamSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		organization: z.string().nullish(),
		active_members: z.array(z.string()).nullish(),
		observers: z.array(z.string()).nullish(),
		emoji: z.string().nullish(),
		color: z.string().nullish(),
		business_hours: MissiveBusinessHoursSchema.nullish(),
		inactivity_period: z.number().int().nullish(),
		// Strings in responses; requests keep the documented enums.
		team_mention_behavior: z.string().nullish(),
		user_reply_behavior: z.string().nullish(),
		received_reply_behavior: z.string().nullish(),
		team_sidebar_behavior: z.string().nullish(),
		team_inbox_enabled: z.boolean().nullish(),
		chat_room_enabled: z.boolean().nullish(),
	})
	.loose();

const MissiveTeamListOutputSchema = z
	.object({
		teams: z.array(MissiveTeamSchema),
	})
	.loose();

const MissiveTeamCreateInputSchema = z
	.object({
		body: z
			.array(
				z
					.object({
						name: z.string().min(1),
						organization: z.string().min(1),
						emoji: z.string().optional(),
						color: z.string().optional(),
						active_members: z.array(z.string()).optional(),
						observers: z.array(z.string()).optional(),
						business_hours: MissiveBusinessHoursSchema.optional(),
						inactivity_period: z.number().int().optional(),
						...MissiveTeamBehaviorShape,
					})
					.strict(),
			)
			.min(1),
	})
	.strict();

const MissiveTeamUpdateInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1),
		body: z
			.array(
				z
					.object({
						id: z.string().min(1),
						name: z.string().optional(),
						organization: z.string().optional(),
						emoji: z.string().optional(),
						color: z.string().optional(),
						active_members: z.array(z.string()).optional(),
						observers: z.array(z.string()).optional(),
						business_hours: MissiveBusinessHoursSchema.optional(),
						inactivity_period: z.number().int().optional(),
						...MissiveTeamBehaviorShape,
					})
					.strict(),
			)
			.min(1),
	})
	.strict()
	.refine((input) => input.body.length === input.ids.length, {
		message:
			'Missive requires exactly one teams object per id passed in the URL',
	});

const MissiveUserSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		avatar_url: z.string().nullish(),
		me: z.boolean().nullish(),
	})
	.loose();

const MissiveUserListOutputSchema = z
	.object({
		users: z.array(MissiveUserSchema),
	})
	.loose();

// List/Create/Update carry assignee and team UUIDs; Get a task embeds full
// user and team objects instead, so the value accepts both forms.
const MissiveTaskSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		// Strings, not enums: a state or type Missive adds later must not fail
		// a whole page. Documented today: todo, in_progress, closed; task,
		// conversation.
		state: z.string().nullish(),
		type: z.string().nullish(),
		conversation: z.string().nullish(),
		due_at: z.number().int().nullish(),
		started_at: z.number().int().nullish(),
		closed_at: z.number().int().nullish(),
		// Assignees are UUIDs in list/create/update responses and full user
		// objects in get; unassigned tasks omit the field or send null.
		assignees: z
			.union([z.array(z.string()), z.array(MissiveUserSchema)])
			.nullish(),
		// Team is a UUID in list/create/update, a full object in get, and
		// absent or null on unassigned tasks.
		team: z.union([z.string(), MissiveTeamSchema]).nullish(),
		last_activity_at: z.number().int().nullish(),
	})
	.loose();

const MissiveTaskListInputSchema = z
	.object({
		limit: z.number().int().min(2).max(50).optional(),
		until: z.number().int().optional(),
		organization: z.string().optional(),
		team: z.string().optional(),
		assignee: z.string().optional(),
		state: z.enum(['todo', 'in_progress', 'closed']).optional(),
		type: z.enum(['task', 'conversation', 'all']).optional(),
		conversation: z.string().optional(),
		due_at_gteq: z.number().int().optional(),
		due_at_lteq: z.number().int().optional(),
	})
	.strict();

const MissiveTaskListOutputSchema = z
	.object({
		tasks: z.array(MissiveTaskSchema),
	})
	.loose();

// Documented verbatim: GET /tasks/:id answers the single task under the
// plural key while list answers an array.
const MissiveTaskGetOutputSchema = z
	.object({
		tasks: MissiveTaskSchema,
	})
	.loose();

const MissiveTaskCreateInputSchema = z
	.object({
		body: z
			.object({
				title: z.string().min(1),
				description: z.string().optional(),
				state: z.enum(['todo', 'in_progress', 'closed']).optional(),
				organization: z.string().optional(),
				team: z.string().optional(),
				assignees: z.array(z.string()).optional(),
				due_at: z.number().int().optional(),
				subtask: z.boolean().optional(),
				conversation: z.string().optional(),
				references: z.array(z.string()).optional(),
				conversation_subject: z.string().optional(),
				add_users: z.array(z.string()).optional(),
				add_to_inbox: z.boolean().optional(),
			})
			.strict()
			.refine((body) => body.title.length <= 1000, {
				message: 'title is limited to 1000 characters',
			})
			.refine(
				(body) =>
					body.description === undefined || body.description.length <= 10000,
				{ message: 'description is limited to 10000 characters' },
			)
			.refine(
				(body) =>
					body.subtask === true ||
					body.team !== undefined ||
					body.assignees !== undefined,
				{
					message: 'Either team or assignees is required for standalone tasks',
				},
			)
			.refine(
				(body) =>
					!(
						body.subtask === true &&
						body.conversation === undefined &&
						(body.references === undefined || body.references.length === 0)
					),
				{
					message:
						'conversation or references is required when subtask is true',
				},
			),
	})
	.strict();

const MissiveTaskUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		body: z
			.object({
				title: z.string().optional(),
				description: z.string().optional(),
				state: z.enum(['todo', 'in_progress', 'closed']).optional(),
				assignees: z.array(z.string()).optional(),
				team: z.string().optional(),
				due_at: z.number().int().optional(),
			})
			.strict()
			.refine((body) => body.title === undefined || body.title.length <= 1000, {
				message: 'title is limited to 1000 characters',
			})
			.refine(
				(body) =>
					body.description === undefined || body.description.length <= 10000,
				{ message: 'description is limited to 10000 characters' },
			),
	})
	.strict();

const MissiveHooksCreateInputSchema = z
	.object({
		body: z
			.object({
				type: z.enum([
					'incoming_email',
					'incoming_sms_message',
					'incoming_facebook_message',
					'incoming_whatsapp_message',
					'incoming_twilio_chat_message',
					'new_comment',
				]),
				url: z.string().min(1),
				organization: z.string().optional(),
				content_contains: z.string().nullish(),
				content_starts_with: z.string().nullish(),
				content_ends_with: z.string().nullish(),
				is_task: z.boolean().optional(),
				author: z.string().nullish(),
				mention: z.string().nullish(),
				from_eq: z.string().nullish(),
				subject_contains: z.string().nullish(),
			})
			.strict(),
	})
	.strict();

const MissiveHooksCreateOutputSchema = z
	.object({
		hooks: z
			.object({
				id: z.string().optional(),
			})
			.loose(),
	})
	.loose();

const MissiveHooksDeleteOutputSchema = z.undefined();

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
	'drafts.create': MissiveDraftsCreateInputSchema,
	'drafts.delete': MissiveIdInputSchema,
	'messages.create': MissiveMessagesCreateInputSchema,
	'messages.get': MissiveIdsInputSchema,
	'messages.list': MissiveMessagesListInputSchema,
	'organizations.list': MissiveOrganizationListInputSchema,
	'responses.list': MissiveResponseListInputSchema,
	'responses.get': MissiveIdInputSchema,
	'responses.create': MissiveResponseCreateInputSchema,
	'responses.update': MissiveResponseUpdateInputSchema,
	'responses.delete': MissiveIdsInputSchema,
	'posts.create': MissivePostsCreateInputSchema,
	'posts.delete': MissiveIdInputSchema,
	'sharedLabels.create': MissiveSharedLabelCreateInputSchema,
	'sharedLabels.update': MissiveSharedLabelUpdateInputSchema,
	'sharedLabels.list': MissiveOrgPageListInputSchema,
	'teams.list': MissiveOrgPageListInputSchema,
	'teams.create': MissiveTeamCreateInputSchema,
	'teams.update': MissiveTeamUpdateInputSchema,
	'users.list': MissiveOrgPageListInputSchema,
	'tasks.list': MissiveTaskListInputSchema,
	'tasks.get': MissiveIdInputSchema,
	'tasks.create': MissiveTaskCreateInputSchema,
	'tasks.update': MissiveTaskUpdateInputSchema,
	'hooks.create': MissiveHooksCreateInputSchema,
	'hooks.delete': MissiveIdInputSchema,
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
	'drafts.create': MissiveDraftsCreateOutputSchema,
	'drafts.delete': MissiveDraftsDeleteOutputSchema,
	'messages.create': MissiveMessagesCreateOutputSchema,
	'messages.get': MissiveMessagesGetOutputSchema,
	'messages.list': MissiveMessagesListOutputSchema,
	'organizations.list': MissiveOrganizationListOutputSchema,
	'responses.list': MissiveResponseListOutputSchema,
	'responses.get': MissiveResponseGetOutputSchema,
	'responses.create': MissiveResponseListOutputSchema,
	'responses.update': MissiveResponseListOutputSchema,
	'responses.delete': MissiveResponseDeleteOutputSchema,
	'posts.create': MissivePostsCreateOutputSchema,
	'posts.delete': MissivePostsDeleteOutputSchema,
	'sharedLabels.create': MissiveSharedLabelListOutputSchema,
	'sharedLabels.update': MissiveSharedLabelListOutputSchema,
	'sharedLabels.list': MissiveSharedLabelListOutputSchema,
	'teams.list': MissiveTeamListOutputSchema,
	'teams.create': MissiveTeamListOutputSchema,
	'teams.update': MissiveTeamListOutputSchema,
	'users.list': MissiveUserListOutputSchema,
	'tasks.list': MissiveTaskListOutputSchema,
	'tasks.get': MissiveTaskGetOutputSchema,
	'tasks.create': MissiveTaskGetOutputSchema,
	'tasks.update': MissiveTaskGetOutputSchema,
	'hooks.create': MissiveHooksCreateOutputSchema,
	'hooks.delete': MissiveHooksDeleteOutputSchema,
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
