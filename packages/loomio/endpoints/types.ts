import { z } from 'zod';

// Inputs use Loomio's own snake_case parameter names. Outputs mirror the
// /api/user0 serializers: every response is a compound record whose primary
// array is named after the resource (`groups`, `discussions`, `threads`,
// `items`, `polls`, `comments`) with sibling arrays (users, topics, groups,
// outcomes, poll_options) and `meta: {root, total}`. Sibling arrays and any
// field whose real shape no published source pins down are deliberately
// undeclared: `.loose()` passes them through untouched instead of guessing
// types. Known fields are `.nullish()` because Loomio sends JSON null and a
// read must not fail on data it already returned.

// ── shared pieces ─────────────────────────────────────────────────────────

/** A numeric id, a url key, or a group handle; Loomio's show routes take all three. */
const IdOrKeySchema = z
	.union([z.number().int().positive(), z.string().min(1)])
	.describe('Numeric id, url key, or handle.');

const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Records to skip for this page; Loomio defaults to 0.');

const PageLimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Records per page; Loomio defaults to 50 when omitted.');

const PageLimitCappedSchema = z
	.number()
	.int()
	.min(1)
	.max(500)
	.optional()
	.describe(
		'Records per page, capped at 500; Loomio defaults to 50 when omitted.',
	);

const MetaSchema = z
	.object({
		root: z.string().nullish(),
		/** Full match count before pagination; absent on single-record responses. */
		total: z.number().nullish(),
	})
	.loose();

export type LoomioMeta = z.infer<typeof MetaSchema>;

/** Optional controls over the related records a compound response carries. */
const RelatedRecordControls = {
	compact: z
		.boolean()
		.optional()
		.describe(
			'Send compact=1: omit bulky related topics, groups, parents, memberships, reactions, tags, and translations.',
		),
	exclude_types: z
		.array(z.string().min(1))
		.optional()
		.describe(
			'Singular related record types to omit, e.g. ["group", "reaction"]. The primary records always stay.',
		),
};

/** Query params for `compact` and `exclude_types`, omitted when unset. */
export function relatedQuery(input: {
	compact?: boolean;
	exclude_types?: string[];
}): { compact?: number; exclude_types?: string } {
	return {
		compact: input.compact ? 1 : undefined,
		exclude_types:
			input.exclude_types && input.exclude_types.length > 0
				? input.exclude_types.join(' ')
				: undefined,
	};
}

/**
 * The offset of the next page, derived in each list endpoint's `shape` from
 * `meta.total` and the records actually returned. Undefined once paging is
 * done, when the response carries no total, or when an empty page would
 * repeat the current offset (the total is counted before the page is read).
 */
export function nextOffset(
	total: number | null | undefined,
	offset: number,
	returned: number,
): number | undefined {
	if (typeof total !== 'number' || returned <= 0) return undefined;
	const next = offset + returned;
	return next < total ? next : undefined;
}

/** Timestamps for unset state can arrive as false or null, not only strings. */
/**
 * Loomio computes some poll figures as Ruby BigDecimals (total_score, and the
 * quorum figures on weighted polls), and Rails encodes a BigDecimal as a JSON
 * string such as "12.5". Accept both forms.
 */
const DecimalSchema = z
	.union([z.number(), z.string()])
	.nullish()
	.describe('A number, or a decimal string such as "12.5".');

const SetAtSchema = z
	.union([z.string(), z.boolean()])
	.nullish()
	.describe('ISO 8601 timestamp when set; false or null when unset.');

// ── records ───────────────────────────────────────────────────────────────

export const GroupSchema = z
	.object({
		id: z.number(),
		key: z.string().nullish(),
		handle: z.string().nullish(),
		name: z.string().nullish(),
		full_name: z.string().nullish(),
		description: z.string().nullish(),
		description_format: z.string().nullish(),
		logo_url: z.string().nullish(),
		created_at: z.string().nullish(),
		creator_id: z.number().nullish(),
		enabled: z.boolean().nullish(),
		parent_id: z.number().nullish(),
		group_privacy: z.string().nullish(),
		membership_granted_upon: z.string().nullish(),
		listed_in_explore: z.boolean().nullish(),
		memberships_count: z.number().nullish(),
		accepted_memberships_count: z.number().nullish(),
		pending_memberships_count: z.number().nullish(),
		admin_memberships_count: z.number().nullish(),
		discussions_count: z.number().nullish(),
		polls_count: z.number().nullish(),
		subgroups_count: z.number().nullish(),
		token: z.string().nullish(),
		members_can_add_members: z.boolean().nullish(),
		members_can_start_discussions: z.boolean().nullish(),
		members_can_edit_discussions: z.boolean().nullish(),
		members_can_edit_comments: z.boolean().nullish(),
		members_can_delete_comments: z.boolean().nullish(),
		members_can_create_subgroups: z.boolean().nullish(),
		members_can_raise_motions: z.boolean().nullish(),
		discarded_at: z.string().nullish(),
	})
	.loose();

export type LoomioGroup = z.infer<typeof GroupSchema>;

export const DiscussionSchema = z
	.object({
		id: z.number(),
		key: z.string().nullish(),
		group_id: z.number().nullish(),
		topic_id: z.number().nullish(),
		title: z.string().nullish(),
		content_locale: z.string().nullish(),
		description: z.string().nullish(),
		description_format: z.string().nullish(),
		discussion_template_id: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		context_changed_at: z.string().nullish(),
		versions_count: z.number().nullish(),
		mentioned_usernames: z.array(z.string()).nullish(),
		discarded_at: z.string().nullish(),
	})
	.loose();

export type LoomioDiscussion = z.infer<typeof DiscussionSchema>;

export const CommentSchema = z
	.object({
		id: z.number(),
		body: z.string().nullish(),
		body_format: z.string().nullish(),
		mentioned_usernames: z.array(z.string()).nullish(),
		topic_id: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		parent_id: z.number().nullish(),
		parent_type: z.string().nullish(),
		content_locale: z.string().nullish(),
		versions_count: z.number().nullish(),
		author_id: z.number().nullish(),
		discarded_at: z.string().nullish(),
		discarded_by: z.number().nullish(),
	})
	.loose();

export type LoomioComment = z.infer<typeof CommentSchema>;

export const TopicSchema = z
	.object({
		id: z.number(),
		group_id: z.number().nullish(),
		items_count: z.number().nullish(),
		replies_count: z.number().nullish(),
		active_polls_count: z.number().nullish(),
		last_activity_at: z.string().nullish(),
		discarded_at: z.string().nullish(),
		locked_at: SetAtSchema,
		locker_id: z.number().nullish(),
		pinned_at: SetAtSchema,
		topicable_id: z.number().nullish(),
		topicable_type: z.string().nullish(),
		has_anonymous_polls: z.boolean().nullish(),
		tags: z.array(z.string()).nullish(),
		topic_reader_id: z.number().nullish(),
		last_read_at: SetAtSchema,
	})
	.loose()
	.describe(
		'Thread metadata. The thread title is not on this record; join the related `discussions` (or `polls`) array on `topicable_id`.',
	);

export type LoomioTopic = z.infer<typeof TopicSchema>;

export const TopicItemSchema = z
	.object({
		id: z.number(),
		sequence_id: z.number().nullish(),
		position: z.number().nullish(),
		depth: z.number().nullish(),
		child_count: z.number().nullish(),
		kind: z.string().nullish(),
		topic_id: z.number().nullish(),
		created_at: z.string().nullish(),
		itemable_id: z.number().nullish(),
		itemable_type: z.string().nullish(),
		pinned: z.boolean().nullish(),
		pinned_title: z.string().nullish(),
		parent_id: z.number().nullish(),
		actor_id: z.number().nullish(),
		position_key: z.string().nullish(),
		change_note: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

export type LoomioTopicItem = z.infer<typeof TopicItemSchema>;

export const PollSchema = z
	.object({
		id: z.number(),
		key: z.string().nullish(),
		title: z.string().nullish(),
		details: z.string().nullish(),
		details_format: z.string().nullish(),
		poll_type: z.string().nullish(),
		poll_option_names: z.array(z.string()).nullish(),
		closing_at: z.string().nullish(),
		closed_at: z.string().nullish(),
		opening_at: z.string().nullish(),
		opened_at: z.string().nullish(),
		created_at: z.string().nullish(),
		anonymous: z.boolean().nullish(),
		hide_results: z.string().nullish(),
		shuffle_options: z.boolean().nullish(),
		specified_voters_only: z.boolean().nullish(),
		stance_reason_required: z.string().nullish(),
		reason_prompt: z.string().nullish(),
		notify_on_closing_soon: z.string().nullish(),
		notify_on_open: z.boolean().nullish(),
		topic_id: z.number().nullish(),
		group_id: z.number().nullish(),
		author_id: z.number().nullish(),
		discarded_at: z.string().nullish(),
		discarded_by: z.number().nullish(),
		vote_count_cast: z.number().nullish(),
		vote_count_eligible: z.number().nullish(),
		vote_count_uncast: z.number().nullish(),
		participation_pct: z.number().nullish(),
		total_score: DecimalSchema,
		quorum_pct: z.number().nullish(),
		quorum_reached: z.boolean().nullish(),
		quorum_threshold: DecimalSchema,
		quorum_shortfall: DecimalSchema,
		score_min: z.number().nullish(),
		score_max: z.number().nullish(),
		choice_count_min: z.number().nullish(),
		choice_count_max: z.number().nullish(),
		points_per_voter: z.number().nullish(),
		meeting_duration: z.number().nullish(),
		stv_seats: z.number().nullish(),
		stv_method: z.string().nullish(),
		stv_quota: z
			.string()
			.nullish()
			.describe('STV quota method: `droop` or `hare`.'),
		chart_type: z.string().nullish(),
		show_none_of_the_above: z.boolean().nullish(),
		weighted_voting: z.boolean().nullish(),
		current_outcome_id: z.number().nullish(),
	})
	.loose()
	.describe(
		'Poll record. The chosen options arrive in the related `poll_options` array and the current outcome in `outcomes`, matched by `current_outcome_id`.',
	);

export type LoomioPoll = z.infer<typeof PollSchema>;

// ── groups ────────────────────────────────────────────────────────────────

const GroupsListInputSchema = z.object({
	limit: PageLimitCappedSchema,
	offset: OffsetSchema,
	...RelatedRecordControls,
});

export type GroupsListInput = z.input<typeof GroupsListInputSchema>;

const GroupsListResponseSchema = z
	.object({
		groups: z.array(GroupSchema),
		meta: MetaSchema,
		next_offset: z
			.number()
			.optional()
			.describe('Offset of the next page, derived from `meta.total`.'),
	})
	.loose();

export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

const GroupsGetInputSchema = z.object({
	id: IdOrKeySchema.describe('The group, by numeric id, url key, or handle.'),
	...RelatedRecordControls,
});

export type GroupsGetInput = z.input<typeof GroupsGetInputSchema>;

const GroupsGetResponseSchema = z
	.object({ group: GroupSchema })
	.loose()
	.describe('Envelope with the group in `group`; related records ride along.');

export type GroupsGetResponse = z.infer<typeof GroupsGetResponseSchema>;

// ── discussions ───────────────────────────────────────────────────────────

export const LOOMIO_DISCUSSION_STATUSES = ['open', 'closed', 'all'] as const;

const DiscussionsListInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group whose discussions to list. Required.'),
	status: z
		.enum(LOOMIO_DISCUSSION_STATUSES)
		.optional()
		.describe('Filter: `open` (default), `closed`, or `all`.'),
	limit: PageLimitSchema,
	offset: OffsetSchema,
	...RelatedRecordControls,
});

export type DiscussionsListInput = z.input<typeof DiscussionsListInputSchema>;

const DiscussionsListResponseSchema = z
	.object({
		discussions: z.array(DiscussionSchema),
		meta: MetaSchema,
		next_offset: z.number().optional(),
	})
	.loose();

export type DiscussionsListResponse = z.infer<
	typeof DiscussionsListResponseSchema
>;

const DiscussionsGetInputSchema = z.object({
	id: IdOrKeySchema.describe('The discussion, by numeric id or url key.'),
	...RelatedRecordControls,
});

export type DiscussionsGetInput = z.input<typeof DiscussionsGetInputSchema>;

const DiscussionsGetResponseSchema = z
	.object({ discussion: DiscussionSchema })
	.loose();

export type DiscussionsGetResponse = z.infer<
	typeof DiscussionsGetResponseSchema
>;

export const LOOMIO_BODY_FORMATS = ['md', 'html'] as const;

const DiscussionsCreateInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group to start the discussion in.'),
	title: z.string().min(1).describe('The discussion title. Required.'),
	description: z.string().optional().describe('The discussion body.'),
	description_format: z
		.enum(LOOMIO_BODY_FORMATS)
		.optional()
		.describe('Format of `description`; `md` (default) or `html`.'),
	recipient_audience: z
		.string()
		.optional()
		.describe('Notify an audience in the group about the new discussion.'),
	recipient_user_ids: z
		.array(z.number().int().positive())
		.optional()
		.describe('Notify these user ids about the new discussion.'),
	recipient_emails: z
		.array(z.string().min(3))
		.optional()
		.describe('Invite these email addresses to the group with the discussion.'),
	recipient_message: z
		.string()
		.optional()
		.describe('Message sent to the notified recipients.'),
});

export type DiscussionsCreateInput = z.input<
	typeof DiscussionsCreateInputSchema
>;

const DiscussionsCreateResponseSchema = z
	.object({ discussion: DiscussionSchema })
	.loose();

export type DiscussionsCreateResponse = z.infer<
	typeof DiscussionsCreateResponseSchema
>;

// ── comments ──────────────────────────────────────────────────────────────

const CommentsCreateInputSchema = z.object({
	discussion_id: z
		.number()
		.int()
		.positive()
		.describe('The discussion to comment on (its numeric discussion id).'),
	parent_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Reply to this comment id inside the discussion.'),
	body: z.string().min(1).describe('The comment text. Required.'),
	body_format: z
		.enum(LOOMIO_BODY_FORMATS)
		.optional()
		.describe('Format of `body`; `md` (default) or `html`.'),
});

export type CommentsCreateInput = z.input<typeof CommentsCreateInputSchema>;

const CommentsCreateResponseSchema = z
	.object({ comment: CommentSchema })
	.loose();

export type CommentsCreateResponse = z.infer<
	typeof CommentsCreateResponseSchema
>;

// ── threads ───────────────────────────────────────────────────────────────

const ThreadsListInputSchema = z.object({
	limit: PageLimitSchema,
	offset: OffsetSchema,
	...RelatedRecordControls,
});

export type ThreadsListInput = z.input<typeof ThreadsListInputSchema>;

const ThreadsListResponseSchema = z
	.object({
		threads: z.array(TopicSchema),
		meta: MetaSchema,
		next_offset: z.number().optional(),
	})
	.loose()
	.describe(
		'Threads ordered by latest activity. Titles sit in the related `discussions` and `polls` arrays, matched by `topicable_id`.',
	);

export type ThreadsListResponse = z.infer<typeof ThreadsListResponseSchema>;

const ThreadsItemsInputSchema = z.object({
	topic_id: z
		.number()
		.int()
		.positive()
		.describe('The thread id, which is its `topic_id`.'),
	limit: PageLimitCappedSchema,
	offset: OffsetSchema,
	...RelatedRecordControls,
});

export type ThreadsItemsInput = z.input<typeof ThreadsItemsInputSchema>;

const ThreadsItemsResponseSchema = z
	.object({
		items: z.array(TopicItemSchema),
		meta: MetaSchema,
		next_offset: z.number().optional(),
	})
	.loose()
	.describe(
		'The thread timeline in ascending sequence order. Comments, polls, votes and outcomes ride along in related arrays, matched by `itemable_id`.',
	);

export type ThreadsItemsResponse = z.infer<typeof ThreadsItemsResponseSchema>;

const ThreadsMarkdownInputSchema = z.object({
	topic_id: z
		.number()
		.int()
		.positive()
		.describe('The thread id, which is its `topic_id`.'),
});

export type ThreadsMarkdownInput = z.input<typeof ThreadsMarkdownInputSchema>;

const ThreadsMarkdownResponseSchema = z
	.object({ markdown: z.string() })
	.loose()
	.describe('The whole visible thread as one markdown document.');

export type ThreadsMarkdownResponse = z.infer<
	typeof ThreadsMarkdownResponseSchema
>;

// ── polls ─────────────────────────────────────────────────────────────────

export const LOOMIO_POLL_STATUSES = ['active', 'closed', 'all'] as const;

const PollsListInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group whose polls to list. Required.'),
	status: z
		.enum(LOOMIO_POLL_STATUSES)
		.optional()
		.describe('Filter: `active` (default), `closed`, or `all`.'),
	limit: PageLimitSchema,
	offset: OffsetSchema,
	...RelatedRecordControls,
});

export type PollsListInput = z.input<typeof PollsListInputSchema>;

const PollsListResponseSchema = z
	.object({
		polls: z.array(PollSchema),
		meta: MetaSchema,
		next_offset: z.number().optional(),
	})
	.loose();

export type PollsListResponse = z.infer<typeof PollsListResponseSchema>;

const PollsGetInputSchema = z.object({
	id: IdOrKeySchema.describe('The poll, by numeric id or url key.'),
	...RelatedRecordControls,
});

export type PollsGetInput = z.input<typeof PollsGetInputSchema>;

const PollsGetResponseSchema = z.object({ poll: PollSchema }).loose();

export type PollsGetResponse = z.infer<typeof PollsGetResponseSchema>;

export const LOOMIO_POLL_TYPES = [
	'proposal',
	'poll',
	'count',
	'score',
	'ranked_choice',
	'meeting',
	'dot_vote',
] as const;

export const LOOMIO_HIDE_RESULTS_OPTIONS = [
	'off',
	'until_vote',
	'until_closed',
] as const;

export const LOOMIO_STANCE_REASON_REQUIREMENTS = [
	'disabled',
	'optional',
	'required',
	'required_for_disagree_or_block',
	'required_for_block',
] as const;

export const LOOMIO_NOTIFY_ON_CLOSING_SOON_OPTIONS = [
	'nobody',
	'author',
	'voters_uncast',
	'voters',
] as const;

const PollOptionAttributesSchema = z.object({
	name: z.string().min(1).describe('The option text, e.g. `Agree`.'),
	meaning: z
		.string()
		.optional()
		.describe('Short explanation shown under the option.'),
	prompt: z
		.string()
		.optional()
		.describe('Question asked when selecting the option.'),
	icon: z.string().optional().describe('Icon name for the option.'),
	priority: z
		.number()
		.int()
		.optional()
		.describe('Option order, starting at 0.'),
	test_operator: z
		.enum(['gte', 'lte'])
		.nullish()
		.describe(
			'Vote-share requirement: `gte` (at least) or `lte` (no more than); null disables it.',
		),
	test_percent: z
		.number()
		.int()
		.min(0)
		.max(100)
		.nullish()
		.describe('Percentage for the vote-share requirement.'),
	test_against: z
		.enum(['score_percent', 'voter_percent'])
		.nullish()
		.describe(
			"Compare the option's share of score cast, or its voters against all eligible voters.",
		),
});

export type LoomioPollOptionAttributes = z.input<
	typeof PollOptionAttributesSchema
>;

const PollsCreateInputSchema = z
	.object({
		group_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'Start the poll in this group. Provide this or `discussion_id`.',
			),
		discussion_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'Start the poll on this discussion. Provide this or `group_id`.',
			),
		title: z.string().min(1).describe('The poll question. Required.'),
		details: z.string().optional().describe('The poll body text.'),
		details_format: z
			.enum(LOOMIO_BODY_FORMATS)
			.optional()
			.describe('Format of `details`; `md` (default) or `html`.'),
		poll_type: z
			.enum(LOOMIO_POLL_TYPES)
			.describe(
				'Voting style: proposal, poll, count, score, ranked_choice, meeting, or dot_vote.',
			),
		options: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				'Option texts. For a proposal, Loomio uses agree, disagree, abstain, and block when omitted.',
			),
		poll_options_attributes: z
			.array(PollOptionAttributesSchema)
			.min(1)
			.optional()
			.describe(
				'Options with per-option settings; an alternative to `options`.',
			),
		closing_at: z
			.string()
			.datetime({ offset: true })
			.nullish()
			.describe(
				'ISO 8601 close time. Omit or send null to keep the poll a draft with voting disabled.',
			),
		specified_voters_only: z
			.boolean()
			.optional()
			.describe('Restrict voting to invited voters.'),
		hide_results: z
			.enum(LOOMIO_HIDE_RESULTS_OPTIONS)
			.optional()
			.describe('Hide results until a vote is cast or until the poll closes.'),
		anonymous: z
			.boolean()
			.optional()
			.describe(
				'Hide voter identities. Needs closing_at (Loomio refuses anonymous drafts). Options freeze after the first ballot.',
			),
		shuffle_options: z
			.boolean()
			.optional()
			.describe('Show options in random order.'),
		stance_reason_required: z
			.enum(LOOMIO_STANCE_REASON_REQUIREMENTS)
			.optional()
			.describe('When a reason statement is required with a vote.'),
		reason_prompt: z
			.string()
			.optional()
			.describe('Question shown when a reason is requested.'),
		notify_on_closing_soon: z
			.enum(LOOMIO_NOTIFY_ON_CLOSING_SOON_OPTIONS)
			.optional()
			.describe('Who is reminded before the poll closes.'),
		recipient_audience: z
			.string()
			.optional()
			.describe('Notify an audience in the group about the poll.'),
		recipient_user_ids: z
			.array(z.number().int().positive())
			.optional()
			.describe('Notify these user ids about the poll.'),
		recipient_emails: z
			.array(z.string().min(3))
			.optional()
			.describe('Invite these email addresses to vote.'),
		recipient_message: z
			.string()
			.optional()
			.describe('Message sent to the notified recipients.'),
		notify_recipients: z
			.boolean()
			.optional()
			.describe('Send the invitation notification.'),
	})
	.superRefine((value, ctx) => {
		if (value.group_id === undefined && value.discussion_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide group_id or discussion_id to place the poll.',
				path: ['group_id'],
			});
		}
		// Loomio saves the poll, then PollService.invite refuses any anonymous
		// poll that isn't open (no closing_at), so the caller gets a 403 and a
		// stray draft stays behind.
		if (value.anonymous === true && !value.closing_at) {
			ctx.addIssue({
				code: 'custom',
				message:
					'An anonymous poll needs closing_at: Loomio refuses anonymous drafts after saving them.',
				path: ['closing_at'],
			});
		}
	});

export type PollsCreateInput = z.input<typeof PollsCreateInputSchema>;

const PollsCreateResponseSchema = z
	.object({ poll: PollSchema })
	.loose()
	.describe(
		'The created poll in `poll`; its options arrive in the related `poll_options` array.',
	);

export type PollsCreateResponse = z.infer<typeof PollsCreateResponseSchema>;

// ── edits and soft deletes ────────────────────────────────────────────────

const NumericIdSchema = z.number().int().positive();

const RecipientFields = {
	recipient_audience: z
		.string()
		.nullish()
		.describe(
			'`group` notifies the whole group; null notifies nobody beyond the listed recipients.',
		),
	recipient_user_ids: z
		.array(z.number().int().positive())
		.optional()
		.describe('Notify or invite these user ids.'),
	recipient_emails: z
		.array(z.string().min(3))
		.optional()
		.describe('Invite these email addresses; Loomio emails each one.'),
	recipient_message: z
		.string()
		.optional()
		.describe('Message included in the email invitation.'),
};

const DiscussionsUpdateInputSchema = z.object({
	id: NumericIdSchema.describe('The discussion id.'),
	title: z.string().min(1).optional().describe('New title.'),
	description: z.string().optional().describe('New context (body).'),
	description_format: z
		.enum(LOOMIO_BODY_FORMATS)
		.optional()
		.describe('Format of `description`; `md` (default) or `html`.'),
	...RecipientFields,
});

export type DiscussionsUpdateInput = z.input<
	typeof DiscussionsUpdateInputSchema
>;

const DiscussionsDeleteInputSchema = z.object({
	id: NumericIdSchema.describe('The discussion id to soft-delete.'),
});

export type DiscussionsDeleteInput = z.input<
	typeof DiscussionsDeleteInputSchema
>;

const CommentsUpdateInputSchema = z.object({
	id: NumericIdSchema.describe('The comment id.'),
	body: z.string().min(1).describe('The new comment text.'),
	body_format: z
		.enum(LOOMIO_BODY_FORMATS)
		.optional()
		.describe('Format of `body`; `md` (default) or `html`.'),
});

export type CommentsUpdateInput = z.input<typeof CommentsUpdateInputSchema>;

const CommentsDeleteInputSchema = z.object({
	id: NumericIdSchema.describe('The comment id to soft-delete.'),
});

export type CommentsDeleteInput = z.input<typeof CommentsDeleteInputSchema>;

const CommentsWriteResponseSchema = z
	.object({ comment: CommentSchema })
	.loose();

export type CommentsUpdateResponse = z.infer<
	typeof CommentsWriteResponseSchema
>;
export type CommentsDeleteResponse = CommentsUpdateResponse;

const PollOptionEditSchema = PollOptionAttributesSchema.extend({
	id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Existing option id to edit or remove; omit for a new option.'),
	name: z.string().min(1).optional().describe('The option text.'),
	_destroy: z
		.boolean()
		.optional()
		.describe('With an existing `id`, remove that option.'),
});

const PollsUpdateInputSchema = z.object({
	id: NumericIdSchema.describe('The poll id.'),
	title: z.string().min(1).optional().describe('New poll title.'),
	details: z.string().optional().describe('New poll details.'),
	details_format: z
		.enum(LOOMIO_BODY_FORMATS)
		.optional()
		.describe('Format of `details`; `md` (default) or `html`.'),
	options: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Replacement option names; may affect existing votes.'),
	poll_options_attributes: z
		.array(PollOptionEditSchema)
		.min(1)
		.optional()
		.describe(
			'Edit options by `id`, add ones without an `id`, remove with `id` + `_destroy: true`. Omitted options stay.',
		),
	reason_prompt: z.string().optional().describe('Shared reason prompt.'),
	stance_reason_required: z
		.enum(LOOMIO_STANCE_REASON_REQUIREMENTS)
		.optional()
		.describe('When a reason is required with a vote.'),
	closing_at: z
		.string()
		.datetime({ offset: true })
		.nullish()
		.describe('ISO 8601 close time; a future time opens voting.'),
	...RecipientFields,
});

export type PollsUpdateInput = z.input<typeof PollsUpdateInputSchema>;

const PollsDeleteInputSchema = z.object({
	id: NumericIdSchema.describe('The poll id to soft-delete.'),
});

export type PollsDeleteInput = z.input<typeof PollsDeleteInputSchema>;

// ── threads.get ───────────────────────────────────────────────────────────

const ThreadsGetInputSchema = z.object({
	topic_id: z
		.number()
		.int()
		.positive()
		.describe('The thread id, which is its `topic_id`.'),
	...RelatedRecordControls,
});

export type ThreadsGetInput = z.input<typeof ThreadsGetInputSchema>;

const ThreadsGetResponseSchema = z
	.object({ thread: TopicSchema })
	.loose()
	.describe(
		'The thread in `thread`; its discussion or poll rides in the related arrays.',
	);

export type ThreadsGetResponse = z.infer<typeof ThreadsGetResponseSchema>;

// ── memberships ───────────────────────────────────────────────────────────

export const MembershipSchema = z
	.object({
		id: z.number(),
		group_id: z.number().nullish(),
		user_id: z.number().nullish(),
		inviter_id: z.number().nullish(),
		admin: z.boolean().nullish(),
		delegate: z.boolean().nullish(),
		title: z.string().nullish(),
		created_at: z.string().nullish(),
		accepted_at: z.string().nullish(),
		revoked_at: z.string().nullish(),
		user_email: z
			.string()
			.nullish()
			.describe('Only for your own membership or when you are a group admin.'),
	})
	.loose();

export type LoomioMembership = z.infer<typeof MembershipSchema>;

const MembershipsListInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group whose memberships to list. Required.'),
	limit: PageLimitSchema,
	offset: OffsetSchema,
	...RelatedRecordControls,
});

export type MembershipsListInput = z.input<typeof MembershipsListInputSchema>;

const MembershipsListResponseSchema = z
	.object({
		memberships: z.array(MembershipSchema),
		meta: MetaSchema,
		next_offset: z.number().optional(),
	})
	.loose()
	.describe('Memberships with the related `users` array, matched by user_id.');

export type MembershipsListResponse = z.infer<
	typeof MembershipsListResponseSchema
>;

const MembershipsManageInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group to manage. The key user must be a group admin.'),
	emails: z
		.array(z.string().min(3))
		.describe('Email addresses to invite; Loomio emails each new address.'),
	remove_absent: z
		.boolean()
		.optional()
		.describe(
			'Remove every current member whose email is not in `emails`. An empty list removes everyone. The plugin first reads the group memberships so an address that differs only in letter case keeps its member.',
		),
});

export type MembershipsManageInput = z.input<
	typeof MembershipsManageInputSchema
>;

const EmailChangesSchema = z
	.object({
		added_emails: z.array(z.string()).nullish(),
		removed_emails: z.array(z.string()).nullish(),
	})
	.loose();

export type MembershipsManageResponse = z.infer<typeof EmailChangesSchema>;

// ── reports ───────────────────────────────────────────────────────────────

const YearMonthSchema = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM.');

const ReportsGetInputSchema = z.object({
	section: z
		.enum(['base', 'users', 'countries'])
		.optional()
		.describe('Report section; `users` gives per-person activity rows.'),
	group_scope: z
		.enum(['custom', 'my'])
		.optional()
		.describe('`my` (all your groups) or `custom` (the `group_ids`).'),
	group_ids: z
		.array(z.number().int().positive())
		.optional()
		.describe('Groups to report on when `group_scope` is `custom`.'),
	start_month: YearMonthSchema.optional().describe(
		'First month (YYYY-MM); defaults to 12 months ago.',
	),
	end_month: YearMonthSchema.optional().describe(
		'Last month (YYYY-MM); defaults to this month.',
	),
	interval: z
		.enum(['day', 'week', 'month', 'year'])
		.optional()
		.describe('Interval for the `base` section.'),
	member_type: z
		.enum(['delegate'])
		.optional()
		.describe('With `section: users`, return only current delegates.'),
});

export type ReportsGetInput = z.input<typeof ReportsGetInputSchema>;

// unknown: each report section has its own aggregate shape (the docs pin only
// the `users` rows), so values pass through untouched.
const ReportsGetResponseSchema = z
	.record(z.string(), z.unknown())
	.describe(
		'The requested report section, e.g. `users` rows with threads, comments, polls, votes and reactions counts.',
	);

export type ReportsGetResponse = z.infer<typeof ReportsGetResponseSchema>;

// ── search ────────────────────────────────────────────────────────────────

export const LOOMIO_SEARCH_TYPES = [
	'Discussion',
	'Comment',
	'Poll',
	'Stance',
	'Outcome',
] as const;

const SearchQueryInputSchema = z.object({
	query: z
		.string()
		.optional()
		.describe('Search text; exact and fuzzy matches.'),
	group_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Restrict to one visible group.'),
	org_id: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Restrict to a parent group and its subgroups; 0 for direct discussions.',
		),
	types: z
		.array(z.enum(LOOMIO_SEARCH_TYPES))
		.min(1)
		.optional()
		.describe('Restrict to these result types.'),
	tag: z.string().optional().describe('Restrict to topics with this tag.'),
	author_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			"Restrict to one author; without `query`, returns that author's recent activity.",
		),
	order: z
		.enum(['authored_at_desc'])
		.optional()
		.describe('Order by authoring time, newest first.'),
	...RelatedRecordControls,
});

export type SearchQueryInput = z.input<typeof SearchQueryInputSchema>;

export const SearchResultSchema = z
	.object({
		id: z.union([z.number(), z.string()]).nullish(),
		searchable_type: z.string().nullish(),
		searchable_id: z.number().nullish(),
		highlight: z.string().nullish(),
		group_id: z.number().nullish(),
		group_name: z.string().nullish(),
		discussion_key: z.string().nullish(),
		poll_key: z.string().nullish(),
		author_id: z.number().nullish(),
		author_name: z.string().nullish(),
		authored_at: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

const SearchQueryResponseSchema = z
	.object({ search_results: z.array(SearchResultSchema) })
	.loose()
	.describe('Up to 20 results; no paging and no `meta.total`.');

export type SearchQueryResponse = z.infer<typeof SearchQueryResponseSchema>;

// ── webhooks (Loomio route: /chatbots) ────────────────────────────────────

export const LOOMIO_WEBHOOK_FORMATS = [
	'markdown',
	'slack',
	'discord',
	'microsoft',
	'webex',
] as const;

export const LOOMIO_WEBHOOK_EVENTS = [
	'new_discussion',
	'discussion_edited',
	'new_comment',
	'poll_created',
	'poll_edited',
	'poll_closing_soon',
	'poll_expired',
	'poll_closed_by_user',
	'poll_reopened',
	'outcome_created',
	'outcome_updated',
	'outcome_review_due',
	'stance_created',
	'stance_updated',
] as const;

export const WebhookSchema = z
	.object({
		id: z.number(),
		group_id: z.number().nullish(),
		name: z.string().nullish(),
		kind: z.string().nullish(),
		webhook_kind: z.string().nullish(),
		server: z.string().nullish(),
		channel: z.string().nullish(),
		event_kinds: z.array(z.string()).nullish(),
		notification_only: z.boolean().nullish(),
	})
	.loose();

export type LoomioWebhook = z.infer<typeof WebhookSchema>;

const WebhooksListInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group; the key user must be a group admin.'),
	limit: PageLimitCappedSchema,
	offset: OffsetSchema,
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z
	.object({
		chatbots: z.array(WebhookSchema),
		meta: MetaSchema,
		next_offset: z.number().optional(),
	})
	.loose()
	.describe('The group webhooks in `chatbots`, oldest first.');

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhookFields = {
	name: z.string().min(1).describe('Admin-facing name.'),
	kind: z
		.enum(['webhook', 'matrix'])
		.describe('`webhook` for an outgoing webhook, `matrix` for Matrix.'),
	webhook_kind: z
		.enum(LOOMIO_WEBHOOK_FORMATS)
		.optional()
		.describe('Payload format; `markdown` suits a general endpoint.'),
	server: z
		.string()
		.url()
		.describe('Destination URL; must be public HTTPS. Treat it as a secret.'),
	event_kinds: z
		.array(z.enum(LOOMIO_WEBHOOK_EVENTS))
		.optional()
		.describe('Events sent automatically.'),
	notification_only: z
		.boolean()
		.optional()
		.describe('Send only the notification headline.'),
};

const WebhooksCreateInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group; the key user must be a group admin.'),
	...WebhookFields,
});

export type WebhooksCreateInput = z.input<typeof WebhooksCreateInputSchema>;

const WebhooksUpdateInputSchema = z.object({
	id: NumericIdSchema.describe('The webhook id.'),
	name: WebhookFields.name.optional(),
	kind: WebhookFields.kind.optional(),
	webhook_kind: WebhookFields.webhook_kind,
	server: WebhookFields.server.optional(),
	event_kinds: WebhookFields.event_kinds,
	notification_only: WebhookFields.notification_only,
});

export type WebhooksUpdateInput = z.input<typeof WebhooksUpdateInputSchema>;

const WebhookWriteResponseSchema = z.object({ chatbot: WebhookSchema }).loose();

export type WebhooksCreateResponse = z.infer<typeof WebhookWriteResponseSchema>;
export type WebhooksUpdateResponse = WebhooksCreateResponse;

const WebhooksDeleteInputSchema = z.object({
	id: NumericIdSchema.describe('The webhook id to delete.'),
});

export type WebhooksDeleteInput = z.input<typeof WebhooksDeleteInputSchema>;

const SuccessResponseSchema = z
	.object({
		// Loomio answers `true` on most routes and the string `success` on some.
		success: z.union([z.boolean(), z.string()]),
	})
	.loose();

export type LoomioSuccessResponse = z.infer<typeof SuccessResponseSchema>;

const WebhooksCheckInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('A group where the key user is an admin.'),
	server: z
		.string()
		.url()
		.describe('Destination URL that receives the test message.'),
});

export type WebhooksCheckInput = z.input<typeof WebhooksCheckInputSchema>;

const WebhooksCheckResponseSchema = z
	.object({ delivered: z.literal(true) })
	.describe('Loomio answers an empty 200 once the test message is sent.');

export type WebhooksCheckResponse = z.infer<typeof WebhooksCheckResponseSchema>;

// ── server API (self-hosted, server key) ──────────────────────────────────

const ServerPageMetaSchema = z.object({ total: z.number().nullish() }).loose();

const ServerLimitSchema = z
	.number()
	.int()
	.min(1)
	.max(50)
	.optional()
	.describe('Records per page; default and maximum 50.');

export const ServerGroupSchema = z
	.object({
		id: z.number(),
		key: z.string().nullish(),
		name: z.string().nullish(),
		handle: z.string().nullish(),
		parent_id: z.number().nullish(),
		group_privacy: z.string().nullish(),
	})
	.loose();

const ServerGroupsListInputSchema = z.object({
	limit: ServerLimitSchema,
	offset: OffsetSchema,
});

export type ServerGroupsListInput = z.input<typeof ServerGroupsListInputSchema>;

const ServerGroupsListResponseSchema = z
	.object({
		groups: z.array(ServerGroupSchema),
		meta: ServerPageMetaSchema,
		next_offset: z.number().optional(),
	})
	.loose();

export type ServerGroupsListResponse = z.infer<
	typeof ServerGroupsListResponseSchema
>;

export const ServerMembershipSchema = z
	.object({
		id: z.number(),
		group_id: z.number().nullish(),
		user_id: z.number().nullish(),
		user_email: z.string().nullish(),
		user_name: z.string().nullish(),
		admin: z.boolean().nullish(),
		delegate: z.boolean().nullish(),
		accepted_at: z.string().nullish(),
		pending: z.boolean().nullish(),
	})
	.loose();

const ServerMembershipsListInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The group whose memberships to list. Required.'),
	limit: ServerLimitSchema,
	offset: OffsetSchema,
});

export type ServerMembershipsListInput = z.input<
	typeof ServerMembershipsListInputSchema
>;

const ServerMembershipsListResponseSchema = z
	.object({
		memberships: z.array(ServerMembershipSchema),
		meta: ServerPageMetaSchema,
		next_offset: z.number().optional(),
	})
	.loose();

export type ServerMembershipsListResponse = z.infer<
	typeof ServerMembershipsListResponseSchema
>;

const ServerMembershipsSyncInputSchema = z.object({
	group_id: z.number().int().positive().describe('The group to sync.'),
	emails: z
		.array(z.string().min(3).max(200))
		.describe(
			'Email addresses to invite. New addresses get unverified accounts and invitations.',
		),
	remove_absent: z
		.boolean()
		.optional()
		.describe(
			'Revoke members (group and subgroups) whose email is not listed. An empty list removes everyone.',
		),
});

export type ServerMembershipsSyncInput = z.input<
	typeof ServerMembershipsSyncInputSchema
>;

const ServerMembershipsUpdateInputSchema = z
	.object({
		id: NumericIdSchema.describe('The membership id.'),
		admin: z.boolean().optional().describe('Grant or remove group admin.'),
		delegate: z.boolean().optional().describe('Grant or remove delegate.'),
	})
	.refine((v) => v.admin !== undefined || v.delegate !== undefined, {
		message: 'Send admin, delegate, or both.',
		path: ['admin'],
	});

export type ServerMembershipsUpdateInput = z.input<
	typeof ServerMembershipsUpdateInputSchema
>;

const ServerMembershipResponseSchema = z
	.object({ membership: ServerMembershipSchema })
	.loose();

export type ServerMembershipsUpdateResponse = z.infer<
	typeof ServerMembershipResponseSchema
>;

const ServerMembershipsRevokeInputSchema = z.object({
	id: NumericIdSchema.describe('The membership id to revoke.'),
});

export type ServerMembershipsRevokeInput = z.input<
	typeof ServerMembershipsRevokeInputSchema
>;

export const ServerIdentitySchema = z
	.object({
		id: z.number(),
		identity_type: z.string().nullish(),
		uid: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export const ServerUserSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		username: z.string().nullish(),
		email: z.string().nullish(),
		is_admin: z.boolean().nullish(),
		active: z.boolean().nullish(),
		deactivated_at: z.string().nullish(),
		identities: z.array(ServerIdentitySchema).nullish(),
	})
	.loose();

export type LoomioServerUser = z.infer<typeof ServerUserSchema>;

const ServerUsersListInputSchema = z.object({
	is_admin: z
		.boolean()
		.optional()
		.describe('Only instance admins (true) or only non-admins (false).'),
});

export type ServerUsersListInput = z.input<typeof ServerUsersListInputSchema>;

const ServerUsersListResponseSchema = z
	.object({ users: z.array(ServerUserSchema) })
	.loose()
	.describe('Every account on the instance, oldest first; no paging.');

export type ServerUsersListResponse = z.infer<
	typeof ServerUsersListResponseSchema
>;

const ServerUserResponseSchema = z.object({ user: ServerUserSchema }).loose();

export type ServerUserResponse = z.infer<typeof ServerUserResponseSchema>;

const ServerUserSuccessResponseSchema = z
	.object({
		success: z.union([z.boolean(), z.string()]),
		user: ServerUserSchema,
	})
	.loose();

export type ServerUserSuccessResponse = z.infer<
	typeof ServerUserSuccessResponseSchema
>;

const ServerUsersCreateInputSchema = z.object({
	email: z.string().min(3).describe('Email address. Required.'),
	name: z.string().optional().describe('Display name.'),
	username: z.string().optional().describe('Username; must be unique.'),
	is_admin: z.boolean().optional().describe('Make the user an instance admin.'),
});

export type ServerUsersCreateInput = z.input<
	typeof ServerUsersCreateInputSchema
>;

const ServerUserFields = {
	name: z.string().optional().describe('Display name.'),
	username: z.string().optional().describe('Username; must be unique.'),
	email: z.string().min(3).optional().describe('Email address.'),
	is_admin: z.boolean().optional().describe('Instance admin flag.'),
};

const ServerUserByIdInputSchema = z.object({
	id: NumericIdSchema.describe('The user id.'),
});

export type ServerUserByIdInput = z.input<typeof ServerUserByIdInputSchema>;

const ServerUsersUpdateInputSchema = z.object({
	id: NumericIdSchema.describe('The user id.'),
	...ServerUserFields,
});

export type ServerUsersUpdateInput = z.input<
	typeof ServerUsersUpdateInputSchema
>;

const IdentityFields = {
	identity_type: z
		.string()
		.min(1)
		.describe('External identity provider, e.g. `saml` or `oauth`.'),
	uid: z.string().min(1).describe("The user's id at that provider."),
};

const ServerUserByIdentityInputSchema = z.object(IdentityFields);

export type ServerUserByIdentityInput = z.input<
	typeof ServerUserByIdentityInputSchema
>;

const ServerUsersUpdateByIdentityInputSchema = z.object({
	...IdentityFields,
	...ServerUserFields,
});

export type ServerUsersUpdateByIdentityInput = z.input<
	typeof ServerUsersUpdateByIdentityInputSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export const LoomioEndpointInputSchemas = {
	groupsList: GroupsListInputSchema,
	groupsGet: GroupsGetInputSchema,
	discussionsList: DiscussionsListInputSchema,
	discussionsGet: DiscussionsGetInputSchema,
	discussionsCreate: DiscussionsCreateInputSchema,
	discussionsUpdate: DiscussionsUpdateInputSchema,
	discussionsDelete: DiscussionsDeleteInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	commentsUpdate: CommentsUpdateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	threadsList: ThreadsListInputSchema,
	threadsGet: ThreadsGetInputSchema,
	threadsItems: ThreadsItemsInputSchema,
	threadsMarkdown: ThreadsMarkdownInputSchema,
	pollsList: PollsListInputSchema,
	pollsGet: PollsGetInputSchema,
	pollsCreate: PollsCreateInputSchema,
	pollsUpdate: PollsUpdateInputSchema,
	pollsDelete: PollsDeleteInputSchema,
	membershipsList: MembershipsListInputSchema,
	membershipsManage: MembershipsManageInputSchema,
	reportsGet: ReportsGetInputSchema,
	searchQuery: SearchQueryInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksCheck: WebhooksCheckInputSchema,
	serverGroupsList: ServerGroupsListInputSchema,
	serverMembershipsList: ServerMembershipsListInputSchema,
	serverMembershipsSync: ServerMembershipsSyncInputSchema,
	serverMembershipsUpdate: ServerMembershipsUpdateInputSchema,
	serverMembershipsRevoke: ServerMembershipsRevokeInputSchema,
	serverUsersList: ServerUsersListInputSchema,
	serverUsersCreate: ServerUsersCreateInputSchema,
	serverUsersGet: ServerUserByIdInputSchema,
	serverUsersUpdate: ServerUsersUpdateInputSchema,
	serverUsersDelete: ServerUserByIdInputSchema,
	serverUsersDeactivate: ServerUserByIdInputSchema,
	serverUsersReactivate: ServerUserByIdInputSchema,
	serverUsersRedact: ServerUserByIdInputSchema,
	serverUsersGetByIdentity: ServerUserByIdentityInputSchema,
	serverUsersUpdateByIdentity: ServerUsersUpdateByIdentityInputSchema,
	serverUsersDeleteByIdentity: ServerUserByIdentityInputSchema,
	serverUsersDeactivateByIdentity: ServerUserByIdentityInputSchema,
	serverUsersReactivateByIdentity: ServerUserByIdentityInputSchema,
	serverUsersRedactByIdentity: ServerUserByIdentityInputSchema,
} as const;

export const LoomioEndpointOutputSchemas = {
	groupsList: GroupsListResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	discussionsList: DiscussionsListResponseSchema,
	discussionsGet: DiscussionsGetResponseSchema,
	discussionsCreate: DiscussionsCreateResponseSchema,
	discussionsUpdate: DiscussionsCreateResponseSchema,
	discussionsDelete: DiscussionsCreateResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	commentsUpdate: CommentsWriteResponseSchema,
	commentsDelete: CommentsWriteResponseSchema,
	threadsList: ThreadsListResponseSchema,
	threadsGet: ThreadsGetResponseSchema,
	threadsItems: ThreadsItemsResponseSchema,
	threadsMarkdown: ThreadsMarkdownResponseSchema,
	pollsList: PollsListResponseSchema,
	pollsGet: PollsGetResponseSchema,
	pollsCreate: PollsCreateResponseSchema,
	pollsUpdate: PollsCreateResponseSchema,
	pollsDelete: PollsCreateResponseSchema,
	membershipsList: MembershipsListResponseSchema,
	membershipsManage: EmailChangesSchema,
	reportsGet: ReportsGetResponseSchema,
	searchQuery: SearchQueryResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhookWriteResponseSchema,
	webhooksUpdate: WebhookWriteResponseSchema,
	webhooksDelete: SuccessResponseSchema,
	webhooksCheck: WebhooksCheckResponseSchema,
	serverGroupsList: ServerGroupsListResponseSchema,
	serverMembershipsList: ServerMembershipsListResponseSchema,
	serverMembershipsSync: EmailChangesSchema,
	serverMembershipsUpdate: ServerMembershipResponseSchema,
	serverMembershipsRevoke: SuccessResponseSchema,
	serverUsersList: ServerUsersListResponseSchema,
	serverUsersCreate: ServerUserResponseSchema,
	serverUsersGet: ServerUserResponseSchema,
	serverUsersUpdate: ServerUserResponseSchema,
	serverUsersDelete: SuccessResponseSchema,
	serverUsersDeactivate: ServerUserSuccessResponseSchema,
	serverUsersReactivate: ServerUserSuccessResponseSchema,
	serverUsersRedact: SuccessResponseSchema,
	serverUsersGetByIdentity: ServerUserResponseSchema,
	serverUsersUpdateByIdentity: ServerUserResponseSchema,
	serverUsersDeleteByIdentity: SuccessResponseSchema,
	serverUsersDeactivateByIdentity: ServerUserSuccessResponseSchema,
	serverUsersReactivateByIdentity: ServerUserSuccessResponseSchema,
	serverUsersRedactByIdentity: SuccessResponseSchema,
} as const;

type Inputs = typeof LoomioEndpointInputSchemas;
type Outputs = typeof LoomioEndpointOutputSchemas;

export type LoomioEndpointInputs = {
	[K in keyof Inputs]: z.input<Inputs[K]>;
};

export type LoomioEndpointOutputs = {
	[K in keyof Outputs]: z.infer<Outputs[K]>;
};
