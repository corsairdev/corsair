import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// SupportBee shapes come from the OpenAPI document embedded in
// https://supportbee.com/docs/api/reference. Dates arrive as a date-time
// string, a date string or a Unix timestamp, and the same field can be any of
// the three, so every date below is a union.

/** A date the API sends as an ISO date-time, an ISO date or a Unix timestamp. */
const DateSchema = z.union([z.string(), z.number()]);

/** The paging fields a list route puts beside its collection. */
const pagingFields = {
	total: z.number().int().nullish(),
	current_page: z.number().int().nullish(),
	per_page: z.number().int().nullish(),
	total_pages: z.number().int().nullish(),
};

const ThumbnailSchema = z
	.object({
		thumb20: z.string().nullish(),
		thumb24: z.string().nullish(),
		thumb32: z.string().nullish(),
		thumb48: z.string().nullish(),
		thumb64: z.string().nullish(),
		thum128: z.string().nullish(),
		thum256: z.string().nullish(),
	})
	.loose();

const AttachmentSchema = z
	.object({
		id: z.number().int().nullish(),
		created_at: DateSchema.nullish(),
		filename: z.string().nullish(),
		content_type: z.string().nullish(),
		url: z
			.object({
				original: z.string().nullish(),
				thumb: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/** A body in both forms: `text` is plain and `html` keeps the markup. */
const ContentPartSchema = z
	.object({
		text: z.string().nullish(),
		html: z.string().nullish(),
		attachments: z.array(AttachmentSchema).nullish(),
	})
	.loose();

/** The customer who opened a ticket. */
const RequesterSchema = z
	.object({
		id: z.number().int().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		role: z.string().nullish(),
		agent: z.boolean().nullish(),
		picture: z.union([z.array(ThumbnailSchema), ThumbnailSchema]).nullish(),
	})
	.loose();

/** A staff member or customer as SupportBee sends it on a user route. */
const UserSchema = z
	.object({
		id: z.number().int().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		agent: z.boolean().nullish(),
		picture: z.union([z.array(ThumbnailSchema), ThumbnailSchema]).nullish(),
	})
	.loose();

const TeamSchema = z
	.object({
		id: z.number().int().nullish(),
		name: z.string().nullish(),
		// SupportBee documents a team picture as an array of sizes.
		picture: z.union([z.array(ThumbnailSchema), ThumbnailSchema]).nullish(),
	})
	.loose();

const TicketSchema = z
	.object({
		id: z.number().int(),
		subject: z.string().nullish(),
		replies_count: z.number().int().nullish(),
		comments_count: z.number().int().nullish(),
		last_activity_at: DateSchema.nullish(),
		created_at: DateSchema.nullish(),
		unanswered: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		spam: z.boolean().nullish(),
		summary: z.string().nullish(),
		/**
		 * The docs show an array of addresses; the live API sends an object keyed
		 * by how the ticket arrived, such as `{ web: "...@supportbeemail.com" }`.
		 */
		source: z
			.union([z.array(z.string()), z.record(z.string(), z.string().nullish())])
			.nullish(),
		cc: z.array(z.string()).nullish(),
		bcc: z.array(z.string()).nullish(),
		/** The docs show names; the live API sends `{ id, name, color }` objects. */
		labels: z
			.array(
				z.union([
					z.string(),
					z
						.object({
							id: z.number().int().nullish(),
							name: z.string().nullish(),
							color: z.string().nullish(),
						})
						.loose(),
				]),
			)
			.nullish(),
		requester: RequesterSchema.nullish(),
		content: ContentPartSchema.nullish(),
		// The docs spell these `asignee`; the live API sends `assignee`.
		current_user_asignee: UserSchema.nullish(),
		current_team_asignee: TeamSchema.nullish(),
		current_user_assignee: UserSchema.nullish(),
		current_team_assignee: TeamSchema.nullish(),
	})
	.loose();

const TicketReplySchema = z
	.object({
		id: z.number().int(),
		created_at: DateSchema.nullish(),
		summary: z.string().nullish(),
		cc: z.array(z.string()).nullish(),
		bcc: z.array(z.string()).nullish(),
		ticket: z
			.object({
				replies_count: z.number().int().nullish(),
				comments_count: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		replier: z
			.object({
				id: z.number().int().nullish(),
				email: z.string().nullish(),
				name: z.string().nullish(),
				agent: z.boolean().nullish(),
				picture: ThumbnailSchema.nullish(),
			})
			.loose()
			.nullish(),
		content: z
			.object({
				body: z.string().nullish(),
				html: z.string().nullish(),
				attachments: z.array(AttachmentSchema).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const CommentSchema = z
	.object({
		id: z.number().int(),
		created_at: DateSchema.nullish(),
		ticket: z
			.object({
				replies_count: z.number().int().nullish(),
				comments_count: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
		commenter: UserSchema.nullish(),
		content: ContentPartSchema.nullish(),
	})
	.loose();

const DraftRecipientSchema = z
	.object({
		email: z.string().nullish(),
		name: z.string().nullish(),
		picture: ThumbnailSchema.nullish(),
	})
	.loose();

const DraftSchema = z
	.object({
		id: z.number().int().nullish(),
		cc: z.array(DraftRecipientSchema).nullish(),
		bcc: z.array(DraftRecipientSchema).nullish(),
		last_saved_by: UserSchema.nullish(),
		last_saved_at: DateSchema.nullish(),
		content: ContentPartSchema.nullish(),
	})
	.loose();

const AuditEntrySchema = z
	.object({
		action: z.string().nullish(),
		actor: z
			.object({
				name: z.string().nullish(),
				profile_picture_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		url: z.string().nullish(),
		severity: z.string().nullish(),
		happened_at: z.string().nullish(),
	})
	.loose();

const UserExtendedSchema = z
	.object({
		id: z.number().int(),
		type: z.string().nullish(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		name: z.string().nullish(),
		role: z.string().nullish(),
		agent: z.boolean().nullish(),
		two_factor_authentication_enabled: z.boolean().nullish(),
		picture: ThumbnailSchema.nullish(),
		can_members_access_group_tickets: z.boolean().nullish(),
		email_domains: z.array(z.string()).nullish(),
		members_count: z.number().int().nullish(),
		active_tickets_count: z.number().int().nullish(),
		requested_tickets_count: z.number().int().nullish(),
		teams: z.array(TeamSchema).nullish(),
	})
	.loose();

const SnippetSchema = z
	.object({
		id: z.number().int(),
		created_at: DateSchema.nullish(),
		name: z.string().nullish(),
		tags: z.string().nullish(),
		content: z
			.object({
				text: z.string().nullish(),
				html: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const ForwardingAddressSchema = z
	.object({
		id: z.number().int().nullish(),
		forward_to: z.string().nullish(),
		from: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const DataPointSchema = z
	.object({
		value: z.string().nullish(),
		timestamp: DateSchema.nullish(),
	})
	.loose();

/** The record a ticket assignment answers, on either the user or team route. */
const assignmentSchema = (key: 'user' | 'team') =>
	z
		.object({
			[`${key}_assignment`]: z
				.object({
					id: z.number().int().nullish(),
					created_at: DateSchema.nullish(),
					ticket: z
						.object({ id: z.number().int().nullish() })
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
			// Spelled `asignee` by the API.
			asignee: z
				.object({ [key]: z.union([UserSchema, TeamSchema]).nullish() })
				.loose()
				.nullish(),
		})
		.loose();

/** The routes that only flip a flag on a ticket answer 204 with no body. */
const ticketActionInput = z.object({ id: z.number().int() });

const ticketActionResponse = z.object({
	id: z.number().int(),
	updated: z.literal(true),
});

// ── tickets ───────────────────────────────────────────────────────────────

const TicketsListInputSchema = z.object({
	per_page: z.number().int().min(1).max(100).optional(),
	page: z.number().int().min(1).optional(),
	archived: z.string().optional(),
	spam: z.boolean().optional(),
	trash: z.boolean().optional(),
	replies: z.boolean().optional(),
	max_replies: z.number().int().min(0).optional(),
	assigned_user: z.string().optional(),
	assigned_team: z.string().optional(),
	label: z.string().optional(),
	/** A date, in any of the formats the API documents. */
	since: z.union([z.string(), z.number()]).optional(),
	until: z.union([z.string(), z.number()]).optional(),
	sort_by: z.string().optional(),
	requester_emails: z.string().optional(),
	total_only: z.boolean().optional(),
});

export type TicketsListInput = z.input<typeof TicketsListInputSchema>;

/** With total_only, SupportBee answers only `{ total }` and no tickets. */
const TicketsListResponseSchema = z
	.object({
		...pagingFields,
		tickets: z.array(TicketSchema).optional(),
		total: z.number().int().nullish(),
	})
	.loose();

export type TicketsListResponse = z.infer<typeof TicketsListResponseSchema>;

const TicketsCreateInputSchema = z.object({
	subject: z.string().optional(),
	requester_name: z.string().optional(),
	requester_email: z.string().optional(),
	cc: z.array(z.string()).optional(),
	bcc: z.array(z.string()).optional(),
	notify_requester: z.boolean().optional(),
	content: z
		.object({
			text: z.string().optional(),
			html: z.string().optional(),
			attachment_ids: z.array(z.number().int()).optional(),
		})
		.optional(),
	forwarding_address_id: z.union([z.string(), z.number()]).optional(),
});

export type TicketsCreateInput = z.input<typeof TicketsCreateInputSchema>;

const TicketsCreateResponseSchema = TicketSchema;

export type TicketsCreateResponse = z.infer<typeof TicketsCreateResponseSchema>;

const TicketsSearchInputSchema = z.object({
	query: z.string().min(1),
	per_page: z.number().int().min(1).max(100).optional(),
	page: z.number().int().min(1).optional(),
	spam: z.boolean().optional(),
	trash: z.boolean().optional(),
});

export type TicketsSearchInput = z.input<typeof TicketsSearchInputSchema>;

const TicketsSearchResponseSchema = z
	.object({
		...pagingFields,
		tickets: z.array(TicketSchema),
	})
	.loose();

export type TicketsSearchResponse = z.infer<typeof TicketsSearchResponseSchema>;

const TicketsGetInputSchema = z.object({ id: z.number().int() });

export type TicketsGetInput = z.input<typeof TicketsGetInputSchema>;

const TicketsGetResponseSchema = z.object({ ticket: TicketSchema }).loose();

export type TicketsGetResponse = z.infer<typeof TicketsGetResponseSchema>;

const TicketsDeleteInputSchema = z.object({ id: z.number().int() });

export type TicketsDeleteInput = z.input<typeof TicketsDeleteInputSchema>;

/** Only a trashed ticket can be deleted, and the route answers 204. */
const TicketsDeleteResponseSchema = z.object({
	id: z.number().int(),
	deleted: z.literal(true),
});

export type TicketsDeleteResponse = z.infer<typeof TicketsDeleteResponseSchema>;

const TicketsArchiveInputSchema = ticketActionInput;
export type TicketsArchiveInput = z.input<typeof TicketsArchiveInputSchema>;
const TicketsArchiveResponseSchema = ticketActionResponse;
export type TicketsArchiveResponse = z.infer<
	typeof TicketsArchiveResponseSchema
>;

const TicketsUnarchiveInputSchema = ticketActionInput;
export type TicketsUnarchiveInput = z.input<typeof TicketsUnarchiveInputSchema>;
const TicketsUnarchiveResponseSchema = ticketActionResponse;
export type TicketsUnarchiveResponse = z.infer<
	typeof TicketsUnarchiveResponseSchema
>;

const TicketsMarkAnsweredInputSchema = ticketActionInput;
export type TicketsMarkAnsweredInput = z.input<
	typeof TicketsMarkAnsweredInputSchema
>;
const TicketsMarkAnsweredResponseSchema = ticketActionResponse;
export type TicketsMarkAnsweredResponse = z.infer<
	typeof TicketsMarkAnsweredResponseSchema
>;

const TicketsMarkUnansweredInputSchema = ticketActionInput;
export type TicketsMarkUnansweredInput = z.input<
	typeof TicketsMarkUnansweredInputSchema
>;
const TicketsMarkUnansweredResponseSchema = ticketActionResponse;
export type TicketsMarkUnansweredResponse = z.infer<
	typeof TicketsMarkUnansweredResponseSchema
>;

const TicketsMarkSpamInputSchema = ticketActionInput;
export type TicketsMarkSpamInput = z.input<typeof TicketsMarkSpamInputSchema>;
const TicketsMarkSpamResponseSchema = ticketActionResponse;
export type TicketsMarkSpamResponse = z.infer<
	typeof TicketsMarkSpamResponseSchema
>;

const TicketsUnmarkSpamInputSchema = ticketActionInput;
export type TicketsUnmarkSpamInput = z.input<
	typeof TicketsUnmarkSpamInputSchema
>;
const TicketsUnmarkSpamResponseSchema = ticketActionResponse;
export type TicketsUnmarkSpamResponse = z.infer<
	typeof TicketsUnmarkSpamResponseSchema
>;

const TicketsTrashInputSchema = ticketActionInput;
export type TicketsTrashInput = z.input<typeof TicketsTrashInputSchema>;
const TicketsTrashResponseSchema = ticketActionResponse;
export type TicketsTrashResponse = z.infer<typeof TicketsTrashResponseSchema>;

const TicketsUntrashInputSchema = ticketActionInput;
export type TicketsUntrashInput = z.input<typeof TicketsUntrashInputSchema>;
const TicketsUntrashResponseSchema = ticketActionResponse;
export type TicketsUntrashResponse = z.infer<
	typeof TicketsUntrashResponseSchema
>;

const TicketsAssignUserInputSchema = z.object({
	id: z.number().int(),
	user_id: z.number().int(),
});

export type TicketsAssignUserInput = z.input<
	typeof TicketsAssignUserInputSchema
>;

const TicketsAssignUserResponseSchema = assignmentSchema('user');

export type TicketsAssignUserResponse = z.infer<
	typeof TicketsAssignUserResponseSchema
>;

const TicketsUnassignUserInputSchema = ticketActionInput;
export type TicketsUnassignUserInput = z.input<
	typeof TicketsUnassignUserInputSchema
>;
const TicketsUnassignUserResponseSchema = ticketActionResponse;
export type TicketsUnassignUserResponse = z.infer<
	typeof TicketsUnassignUserResponseSchema
>;

const TicketsAssignTeamInputSchema = z.object({
	id: z.number().int(),
	team_id: z.number().int(),
});

export type TicketsAssignTeamInput = z.input<
	typeof TicketsAssignTeamInputSchema
>;

const TicketsAssignTeamResponseSchema = assignmentSchema('team');

export type TicketsAssignTeamResponse = z.infer<
	typeof TicketsAssignTeamResponseSchema
>;

const TicketsUnassignTeamInputSchema = ticketActionInput;
export type TicketsUnassignTeamInput = z.input<
	typeof TicketsUnassignTeamInputSchema
>;
const TicketsUnassignTeamResponseSchema = ticketActionResponse;
export type TicketsUnassignTeamResponse = z.infer<
	typeof TicketsUnassignTeamResponseSchema
>;

const TicketsAuditInputSchema = z.object({ id: z.number().int() });
export type TicketsAuditInput = z.input<typeof TicketsAuditInputSchema>;

const TicketsAuditResponseSchema = z
	.object({ audit: z.array(AuditEntrySchema) })
	.loose();

export type TicketsAuditResponse = z.infer<typeof TicketsAuditResponseSchema>;

const TicketsAddLabelInputSchema = z.object({
	ticket_id: z.number().int(),
	label_name: z.string().min(1),
});

export type TicketsAddLabelInput = z.input<typeof TicketsAddLabelInputSchema>;

const TicketsAddLabelResponseSchema = z
	.object({
		label: z
			.object({
				id: z.number().int().nullish(),
				label: z.string().nullish(),
				ticket: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type TicketsAddLabelResponse = z.infer<
	typeof TicketsAddLabelResponseSchema
>;

const TicketsRemoveLabelInputSchema = TicketsAddLabelInputSchema;

export type TicketsRemoveLabelInput = z.input<
	typeof TicketsRemoveLabelInputSchema
>;

const TicketsRemoveLabelResponseSchema = z.object({
	ticket_id: z.number().int(),
	label_name: z.string(),
	removed: z.literal(true),
});

export type TicketsRemoveLabelResponse = z.infer<
	typeof TicketsRemoveLabelResponseSchema
>;

// ── replies ───────────────────────────────────────────────────────────────

const RepliesListInputSchema = z.object({ ticket_id: z.number().int() });
export type RepliesListInput = z.input<typeof RepliesListInputSchema>;

const RepliesListResponseSchema = z
	.object({ replies: z.array(TicketReplySchema) })
	.loose();

export type RepliesListResponse = z.infer<typeof RepliesListResponseSchema>;

const RepliesGetInputSchema = z.object({
	ticket_id: z.number().int(),
	id: z.number().int(),
});

export type RepliesGetInput = z.input<typeof RepliesGetInputSchema>;

const RepliesGetResponseSchema = TicketReplySchema;

export type RepliesGetResponse = z.infer<typeof RepliesGetResponseSchema>;

const RepliesCreateInputSchema = z.object({
	ticket_id: z.number().int(),
	content: z.object({
		text: z.string().optional(),
		html: z.string().optional(),
		attachment_ids: z.array(z.number().int()).optional(),
	}),
	cc: z.array(z.string()).optional(),
	bcc: z.array(z.string()).optional(),
	on_behalf_of: z
		.object({
			id: z.number().int().optional(),
			email: z.string().optional(),
		})
		.optional(),
});

export type RepliesCreateInput = z.input<typeof RepliesCreateInputSchema>;

const RepliesCreateResponseSchema = z
	.object({ reply: TicketReplySchema })
	.loose();

export type RepliesCreateResponse = z.infer<typeof RepliesCreateResponseSchema>;

// ── comments ──────────────────────────────────────────────────────────────

const CommentsListInputSchema = z.object({ ticket_id: z.number().int() });
export type CommentsListInput = z.input<typeof CommentsListInputSchema>;

const CommentsListResponseSchema = z
	.object({ comments: z.array(CommentSchema) })
	.loose();

export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

const CommentsCreateInputSchema = z.object({
	ticket_id: z.number().int(),
	content: z.object({
		text: z.string().optional(),
		html: z.string().optional(),
		attachment_ids: z.array(z.number().int()).optional(),
	}),
});

export type CommentsCreateInput = z.input<typeof CommentsCreateInputSchema>;

const CommentsCreateResponseSchema = z
	.object({ comment: CommentSchema })
	.loose();

export type CommentsCreateResponse = z.infer<
	typeof CommentsCreateResponseSchema
>;

// ── drafts ────────────────────────────────────────────────────────────────

const draftFields = {
	content: z.object({
		text: z.string().optional(),
		html: z.string().optional(),
		attachment_ids: z.array(z.number().int()).optional(),
	}),
	/** A comma-separated string, not an array, on this route. */
	cc: z.string().optional(),
	bcc: z.string().optional(),
};

const DraftsGetInputSchema = z.object({
	ticket_id: z.number().int(),
	quote: z.boolean().optional(),
	time_zone: z.string().optional(),
});

export type DraftsGetInput = z.input<typeof DraftsGetInputSchema>;

const DraftsGetResponseSchema = z.object({ draft: DraftSchema }).loose();

export type DraftsGetResponse = z.infer<typeof DraftsGetResponseSchema>;

const DraftsCreateInputSchema = z.object({
	ticket_id: z.number().int(),
	...draftFields,
});

export type DraftsCreateInput = z.input<typeof DraftsCreateInputSchema>;

const DraftsCreateResponseSchema = z.object({ draft: DraftSchema }).loose();

export type DraftsCreateResponse = z.infer<typeof DraftsCreateResponseSchema>;

const DraftsUpdateInputSchema = DraftsCreateInputSchema;

export type DraftsUpdateInput = z.input<typeof DraftsUpdateInputSchema>;

const DraftsUpdateResponseSchema = DraftsCreateResponseSchema;

export type DraftsUpdateResponse = z.infer<typeof DraftsUpdateResponseSchema>;

const DraftsDeleteInputSchema = z.object({ ticket_id: z.number().int() });
export type DraftsDeleteInput = z.input<typeof DraftsDeleteInputSchema>;

const DraftsDeleteResponseSchema = z.object({
	ticket_id: z.number().int(),
	deleted: z.literal(true),
});

export type DraftsDeleteResponse = z.infer<typeof DraftsDeleteResponseSchema>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({
	with_invited: z.boolean().optional(),
	with_roles: z.string().optional(),
	type: z.string().optional(),
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z
	.object({ users: z.array(UserExtendedSchema) })
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersCreateInputSchema = z.object({
	email: z.string().optional(),
	name: z.string().min(1),
	/** 9 collaborator, 10 agent, 20 admin. Omitted creates a customer. */
	role: z.number().int().optional(),
	team_ids: z.array(z.number().int()).optional(),
	/** `user` or `customer_group`. */
	type: z.string().optional(),
	can_members_access_group_tickets: z.boolean().nullish(),
	email_domains: z.array(z.string()).optional(),
});

export type UsersCreateInput = z.input<typeof UsersCreateInputSchema>;

const UsersCreateResponseSchema = z
	.object({ user: UserExtendedSchema })
	.loose();

export type UsersCreateResponse = z.infer<typeof UsersCreateResponseSchema>;

const UsersGetInputSchema = z.object({
	id: z.number().int(),
	max_tickets: z.number().int().optional(),
});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = z.object({ user: UserExtendedSchema }).loose();

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

const UsersUpdateInputSchema = z.object({
	id: z.number().int(),
	email: z.string().optional(),
	name: z.string().optional(),
	role: z.number().int().optional(),
	team_ids: z.array(z.number().int()).optional(),
	type: z.string().optional(),
	can_members_access_group_tickets: z.boolean().nullish(),
	email_domains: z.array(z.string()).optional(),
});

export type UsersUpdateInput = z.input<typeof UsersUpdateInputSchema>;

const UsersUpdateResponseSchema = z
	.object({ user: UserExtendedSchema })
	.loose();

export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

const UsersListMembersInputSchema = z.object({ id: z.number().int() });
export type UsersListMembersInput = z.input<typeof UsersListMembersInputSchema>;

const UsersListMembersResponseSchema = z
	.object({ users: z.array(UserExtendedSchema) })
	.loose();

export type UsersListMembersResponse = z.infer<
	typeof UsersListMembersResponseSchema
>;

const UsersAddMemberInputSchema = z.object({
	id: z.number().int(),
	member_id: z.number().int(),
});

export type UsersAddMemberInput = z.input<typeof UsersAddMemberInputSchema>;

const UsersAddMemberResponseSchema = z
	.object({ user: UserExtendedSchema })
	.loose();

export type UsersAddMemberResponse = z.infer<
	typeof UsersAddMemberResponseSchema
>;

// ── teams ─────────────────────────────────────────────────────────────────

const TeamsListInputSchema = z.object({
	with_users: z.boolean().optional(),
	user: z.string().optional(),
});

export type TeamsListInput = z.input<typeof TeamsListInputSchema>;

const TeamsListResponseSchema = z
	.object({ teams: z.array(TeamSchema) })
	.loose();

export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;

// ── attachments ───────────────────────────────────────────────────────────

const AttachmentsCreateInputSchema = z.object({
	filename: z.string().min(1),
	/** Base64 content, with or without a data URI prefix. */
	content: z.string().min(1),
	content_type: z.string().optional(),
});

export type AttachmentsCreateInput = z.input<
	typeof AttachmentsCreateInputSchema
>;

const AttachmentsCreateResponseSchema = AttachmentSchema;

export type AttachmentsCreateResponse = z.infer<
	typeof AttachmentsCreateResponseSchema
>;

// ── snippets ──────────────────────────────────────────────────────────────

const SnippetsListInputSchema = z.object({});

export type SnippetsListInput = z.input<typeof SnippetsListInputSchema>;

const SnippetsListResponseSchema = z
	.object({ snippets: z.array(SnippetSchema) })
	.loose();

export type SnippetsListResponse = z.infer<typeof SnippetsListResponseSchema>;

const SnippetsCreateInputSchema = z.object({
	name: z.string().min(1),
	/** Comma-separated tags. */
	tags: z.string().optional(),
	content: z
		.object({
			text: z.string().optional(),
			html: z.string().optional(),
		})
		.refine(
			(value) => value.text !== undefined || value.html !== undefined,
			'a snippet needs text or html',
		),
});

export type SnippetsCreateInput = z.input<typeof SnippetsCreateInputSchema>;

const SnippetsCreateResponseSchema = z
	.object({ snippet: SnippetSchema })
	.loose();

export type SnippetsCreateResponse = z.infer<
	typeof SnippetsCreateResponseSchema
>;

const SnippetsUpdateInputSchema = SnippetsCreateInputSchema.extend({
	id: z.number().int(),
});

export type SnippetsUpdateInput = z.input<typeof SnippetsUpdateInputSchema>;

const SnippetsUpdateResponseSchema = SnippetsCreateResponseSchema;

export type SnippetsUpdateResponse = z.infer<
	typeof SnippetsUpdateResponseSchema
>;

const SnippetsDeleteInputSchema = z.object({ id: z.number().int() });
export type SnippetsDeleteInput = z.input<typeof SnippetsDeleteInputSchema>;

const SnippetsDeleteResponseSchema = z.object({
	id: z.number().int(),
	deleted: z.literal(true),
});

export type SnippetsDeleteResponse = z.infer<
	typeof SnippetsDeleteResponseSchema
>;

// ── filters ───────────────────────────────────────────────────────────────

const FiltersCreateRuleInputSchema = z.object({
	requester_email: z.string().optional(),
	delivered_to: z.string().optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
});

export type FiltersCreateRuleInput = z.input<
	typeof FiltersCreateRuleInputSchema
>;

const FiltersCreateRuleResponseSchema = z
	.object({ rule: z.object({ id: z.string() }).loose() })
	.loose();

export type FiltersCreateRuleResponse = z.infer<
	typeof FiltersCreateRuleResponseSchema
>;

const FiltersCreateConsequenceInputSchema = z
	.object({
		archive: z.boolean().optional(),
		spam: z.boolean().optional(),
		trash: z.boolean().optional(),
		label: z.string().optional(),
		/** A user id as a string. A ticket takes a user or a team, not both. */
		assign_user: z.string().optional(),
		assign_team: z.string().optional(),
	})
	.refine(
		(value) =>
			value.assign_user === undefined || value.assign_team === undefined,
		'a consequence assigns a user or a team, not both',
	);

export type FiltersCreateConsequenceInput = z.input<
	typeof FiltersCreateConsequenceInputSchema
>;

const FiltersCreateConsequenceResponseSchema = z
	.object({ consequence: z.object({ id: z.string() }).loose() })
	.loose();

export type FiltersCreateConsequenceResponse = z.infer<
	typeof FiltersCreateConsequenceResponseSchema
>;

const FiltersCreateInputSchema = z.object({
	rule_id: z.string().min(1),
	consequence_id: z.string().min(1),
});

export type FiltersCreateInput = z.input<typeof FiltersCreateInputSchema>;

/** The route documents no body, so the plugin reports the ids it linked. */
const FiltersCreateResponseSchema = z.object({
	rule_id: z.string(),
	consequence_id: z.string(),
	filter_id: z
		.string()
		.optional()
		.describe('The new filter id, when returned.'),
	created: z.literal(true),
});

export type FiltersCreateResponse = z.infer<typeof FiltersCreateResponseSchema>;

// ── emails (forwarding addresses) ─────────────────────────────────────────

const EmailsListInputSchema = z.object({});

export type EmailsListInput = z.input<typeof EmailsListInputSchema>;

const EmailsListResponseSchema = z
	.object({ forwarding_addresses: z.array(ForwardingAddressSchema) })
	.loose();

export type EmailsListResponse = z.infer<typeof EmailsListResponseSchema>;

const EmailsCreateInputSchema = z.object({
	email: z.string().min(1),
	name: z.string().optional(),
	filter_spam: z.boolean().optional(),
	use_agent_name: z.boolean().optional(),
});

export type EmailsCreateInput = z.input<typeof EmailsCreateInputSchema>;

const EmailsCreateResponseSchema = z
	.object({ forwarding_address: ForwardingAddressSchema })
	.loose();

export type EmailsCreateResponse = z.infer<typeof EmailsCreateResponseSchema>;

// ── reports ───────────────────────────────────────────────────────────────

const reportFilters = {
	user: z.number().int().optional(),
	team: z.number().int().optional(),
	label: z.string().optional(),
	/** A date, in any of the formats the API documents. */
	since: z.union([z.string(), z.number()]).optional(),
};

const ReportsDataPointsResponseSchema = z
	.object({ data_points: z.array(DataPointSchema) })
	.loose();

const ReportsAvgFirstResponseTimeInputSchema = z.object(reportFilters);
export type ReportsAvgFirstResponseTimeInput = z.input<
	typeof ReportsAvgFirstResponseTimeInputSchema
>;

const ReportsAvgFirstResponseTimeResponseSchema =
	ReportsDataPointsResponseSchema;
export type ReportsAvgFirstResponseTimeResponse = z.infer<
	typeof ReportsAvgFirstResponseTimeResponseSchema
>;

const ReportsTicketsCountInputSchema = z.object(reportFilters);
export type ReportsTicketsCountInput = z.input<
	typeof ReportsTicketsCountInputSchema
>;

const ReportsTicketsCountResponseSchema = ReportsDataPointsResponseSchema;
export type ReportsTicketsCountResponse = z.infer<
	typeof ReportsTicketsCountResponseSchema
>;

const ReportsRepliesCountInputSchema = z.object(reportFilters);
export type ReportsRepliesCountInput = z.input<
	typeof ReportsRepliesCountInputSchema
>;

const ReportsRepliesCountResponseSchema = ReportsDataPointsResponseSchema;
export type ReportsRepliesCountResponse = z.infer<
	typeof ReportsRepliesCountResponseSchema
>;

// ── labels ────────────────────────────────────────────────────────────────

const LabelsListInputSchema = z.object({});

export type LabelsListInput = z.input<typeof LabelsListInputSchema>;

const LabelsListResponseSchema = z
	.object({
		labels: z.array(
			z
				.object({
					name: z.string().nullish(),
					color: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type LabelsListResponse = z.infer<typeof LabelsListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SupportbeeEndpointInputs = {
	ticketsList: TicketsListInput;
	ticketsCreate: TicketsCreateInput;
	ticketsSearch: TicketsSearchInput;
	ticketsGet: TicketsGetInput;
	ticketsDelete: TicketsDeleteInput;
	ticketsArchive: TicketsArchiveInput;
	ticketsUnarchive: TicketsUnarchiveInput;
	ticketsMarkAnswered: TicketsMarkAnsweredInput;
	ticketsMarkUnanswered: TicketsMarkUnansweredInput;
	ticketsMarkSpam: TicketsMarkSpamInput;
	ticketsUnmarkSpam: TicketsUnmarkSpamInput;
	ticketsTrash: TicketsTrashInput;
	ticketsUntrash: TicketsUntrashInput;
	ticketsAssignUser: TicketsAssignUserInput;
	ticketsUnassignUser: TicketsUnassignUserInput;
	ticketsAssignTeam: TicketsAssignTeamInput;
	ticketsUnassignTeam: TicketsUnassignTeamInput;
	ticketsAudit: TicketsAuditInput;
	ticketsAddLabel: TicketsAddLabelInput;
	ticketsRemoveLabel: TicketsRemoveLabelInput;
	repliesList: RepliesListInput;
	repliesGet: RepliesGetInput;
	repliesCreate: RepliesCreateInput;
	commentsList: CommentsListInput;
	commentsCreate: CommentsCreateInput;
	draftsGet: DraftsGetInput;
	draftsCreate: DraftsCreateInput;
	draftsUpdate: DraftsUpdateInput;
	draftsDelete: DraftsDeleteInput;
	usersList: UsersListInput;
	usersCreate: UsersCreateInput;
	usersGet: UsersGetInput;
	usersUpdate: UsersUpdateInput;
	usersListMembers: UsersListMembersInput;
	usersAddMember: UsersAddMemberInput;
	teamsList: TeamsListInput;
	attachmentsCreate: AttachmentsCreateInput;
	snippetsList: SnippetsListInput;
	snippetsCreate: SnippetsCreateInput;
	snippetsUpdate: SnippetsUpdateInput;
	snippetsDelete: SnippetsDeleteInput;
	filtersCreateRule: FiltersCreateRuleInput;
	filtersCreateConsequence: FiltersCreateConsequenceInput;
	filtersCreate: FiltersCreateInput;
	emailsList: EmailsListInput;
	emailsCreate: EmailsCreateInput;
	reportsAvgFirstResponseTime: ReportsAvgFirstResponseTimeInput;
	reportsTicketsCount: ReportsTicketsCountInput;
	reportsRepliesCount: ReportsRepliesCountInput;
	labelsList: LabelsListInput;
};

export type SupportbeeEndpointOutputs = {
	ticketsList: TicketsListResponse;
	ticketsCreate: TicketsCreateResponse;
	ticketsSearch: TicketsSearchResponse;
	ticketsGet: TicketsGetResponse;
	ticketsDelete: TicketsDeleteResponse;
	ticketsArchive: TicketsArchiveResponse;
	ticketsUnarchive: TicketsUnarchiveResponse;
	ticketsMarkAnswered: TicketsMarkAnsweredResponse;
	ticketsMarkUnanswered: TicketsMarkUnansweredResponse;
	ticketsMarkSpam: TicketsMarkSpamResponse;
	ticketsUnmarkSpam: TicketsUnmarkSpamResponse;
	ticketsTrash: TicketsTrashResponse;
	ticketsUntrash: TicketsUntrashResponse;
	ticketsAssignUser: TicketsAssignUserResponse;
	ticketsUnassignUser: TicketsUnassignUserResponse;
	ticketsAssignTeam: TicketsAssignTeamResponse;
	ticketsUnassignTeam: TicketsUnassignTeamResponse;
	ticketsAudit: TicketsAuditResponse;
	ticketsAddLabel: TicketsAddLabelResponse;
	ticketsRemoveLabel: TicketsRemoveLabelResponse;
	repliesList: RepliesListResponse;
	repliesGet: RepliesGetResponse;
	repliesCreate: RepliesCreateResponse;
	commentsList: CommentsListResponse;
	commentsCreate: CommentsCreateResponse;
	draftsGet: DraftsGetResponse;
	draftsCreate: DraftsCreateResponse;
	draftsUpdate: DraftsUpdateResponse;
	draftsDelete: DraftsDeleteResponse;
	usersList: UsersListResponse;
	usersCreate: UsersCreateResponse;
	usersGet: UsersGetResponse;
	usersUpdate: UsersUpdateResponse;
	usersListMembers: UsersListMembersResponse;
	usersAddMember: UsersAddMemberResponse;
	teamsList: TeamsListResponse;
	attachmentsCreate: AttachmentsCreateResponse;
	snippetsList: SnippetsListResponse;
	snippetsCreate: SnippetsCreateResponse;
	snippetsUpdate: SnippetsUpdateResponse;
	snippetsDelete: SnippetsDeleteResponse;
	filtersCreateRule: FiltersCreateRuleResponse;
	filtersCreateConsequence: FiltersCreateConsequenceResponse;
	filtersCreate: FiltersCreateResponse;
	emailsList: EmailsListResponse;
	emailsCreate: EmailsCreateResponse;
	reportsAvgFirstResponseTime: ReportsAvgFirstResponseTimeResponse;
	reportsTicketsCount: ReportsTicketsCountResponse;
	reportsRepliesCount: ReportsRepliesCountResponse;
	labelsList: LabelsListResponse;
};

export const SupportbeeEndpointInputSchemas = {
	ticketsList: TicketsListInputSchema,
	ticketsCreate: TicketsCreateInputSchema,
	ticketsSearch: TicketsSearchInputSchema,
	ticketsGet: TicketsGetInputSchema,
	ticketsDelete: TicketsDeleteInputSchema,
	ticketsArchive: TicketsArchiveInputSchema,
	ticketsUnarchive: TicketsUnarchiveInputSchema,
	ticketsMarkAnswered: TicketsMarkAnsweredInputSchema,
	ticketsMarkUnanswered: TicketsMarkUnansweredInputSchema,
	ticketsMarkSpam: TicketsMarkSpamInputSchema,
	ticketsUnmarkSpam: TicketsUnmarkSpamInputSchema,
	ticketsTrash: TicketsTrashInputSchema,
	ticketsUntrash: TicketsUntrashInputSchema,
	ticketsAssignUser: TicketsAssignUserInputSchema,
	ticketsUnassignUser: TicketsUnassignUserInputSchema,
	ticketsAssignTeam: TicketsAssignTeamInputSchema,
	ticketsUnassignTeam: TicketsUnassignTeamInputSchema,
	ticketsAudit: TicketsAuditInputSchema,
	ticketsAddLabel: TicketsAddLabelInputSchema,
	ticketsRemoveLabel: TicketsRemoveLabelInputSchema,
	repliesList: RepliesListInputSchema,
	repliesGet: RepliesGetInputSchema,
	repliesCreate: RepliesCreateInputSchema,
	commentsList: CommentsListInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	draftsGet: DraftsGetInputSchema,
	draftsCreate: DraftsCreateInputSchema,
	draftsUpdate: DraftsUpdateInputSchema,
	draftsDelete: DraftsDeleteInputSchema,
	usersList: UsersListInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersGet: UsersGetInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersListMembers: UsersListMembersInputSchema,
	usersAddMember: UsersAddMemberInputSchema,
	teamsList: TeamsListInputSchema,
	attachmentsCreate: AttachmentsCreateInputSchema,
	snippetsList: SnippetsListInputSchema,
	snippetsCreate: SnippetsCreateInputSchema,
	snippetsUpdate: SnippetsUpdateInputSchema,
	snippetsDelete: SnippetsDeleteInputSchema,
	filtersCreateRule: FiltersCreateRuleInputSchema,
	filtersCreateConsequence: FiltersCreateConsequenceInputSchema,
	filtersCreate: FiltersCreateInputSchema,
	emailsList: EmailsListInputSchema,
	emailsCreate: EmailsCreateInputSchema,
	reportsAvgFirstResponseTime: ReportsAvgFirstResponseTimeInputSchema,
	reportsTicketsCount: ReportsTicketsCountInputSchema,
	reportsRepliesCount: ReportsRepliesCountInputSchema,
	labelsList: LabelsListInputSchema,
} as const;

export const SupportbeeEndpointOutputSchemas = {
	ticketsList: TicketsListResponseSchema,
	ticketsCreate: TicketsCreateResponseSchema,
	ticketsSearch: TicketsSearchResponseSchema,
	ticketsGet: TicketsGetResponseSchema,
	ticketsDelete: TicketsDeleteResponseSchema,
	ticketsArchive: TicketsArchiveResponseSchema,
	ticketsUnarchive: TicketsUnarchiveResponseSchema,
	ticketsMarkAnswered: TicketsMarkAnsweredResponseSchema,
	ticketsMarkUnanswered: TicketsMarkUnansweredResponseSchema,
	ticketsMarkSpam: TicketsMarkSpamResponseSchema,
	ticketsUnmarkSpam: TicketsUnmarkSpamResponseSchema,
	ticketsTrash: TicketsTrashResponseSchema,
	ticketsUntrash: TicketsUntrashResponseSchema,
	ticketsAssignUser: TicketsAssignUserResponseSchema,
	ticketsUnassignUser: TicketsUnassignUserResponseSchema,
	ticketsAssignTeam: TicketsAssignTeamResponseSchema,
	ticketsUnassignTeam: TicketsUnassignTeamResponseSchema,
	ticketsAudit: TicketsAuditResponseSchema,
	ticketsAddLabel: TicketsAddLabelResponseSchema,
	ticketsRemoveLabel: TicketsRemoveLabelResponseSchema,
	repliesList: RepliesListResponseSchema,
	repliesGet: RepliesGetResponseSchema,
	repliesCreate: RepliesCreateResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	draftsGet: DraftsGetResponseSchema,
	draftsCreate: DraftsCreateResponseSchema,
	draftsUpdate: DraftsUpdateResponseSchema,
	draftsDelete: DraftsDeleteResponseSchema,
	usersList: UsersListResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	usersListMembers: UsersListMembersResponseSchema,
	usersAddMember: UsersAddMemberResponseSchema,
	teamsList: TeamsListResponseSchema,
	attachmentsCreate: AttachmentsCreateResponseSchema,
	snippetsList: SnippetsListResponseSchema,
	snippetsCreate: SnippetsCreateResponseSchema,
	snippetsUpdate: SnippetsUpdateResponseSchema,
	snippetsDelete: SnippetsDeleteResponseSchema,
	filtersCreateRule: FiltersCreateRuleResponseSchema,
	filtersCreateConsequence: FiltersCreateConsequenceResponseSchema,
	filtersCreate: FiltersCreateResponseSchema,
	emailsList: EmailsListResponseSchema,
	emailsCreate: EmailsCreateResponseSchema,
	reportsAvgFirstResponseTime: ReportsAvgFirstResponseTimeResponseSchema,
	reportsTicketsCount: ReportsTicketsCountResponseSchema,
	reportsRepliesCount: ReportsRepliesCountResponseSchema,
	labelsList: LabelsListResponseSchema,
} as const;
