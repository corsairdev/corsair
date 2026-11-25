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

/**
 * The offset of the next page, derived in each list endpoint's `shape` from
 * `meta.total` and the records actually returned. Undefined once paging is
 * done or when the response carries no total.
 */
export function nextOffset(
	total: number | null | undefined,
	offset: number,
	returned: number,
): number | undefined {
	if (typeof total !== 'number') return undefined;
	const next = offset + returned;
	return next < total ? next : undefined;
}

/** Timestamps for unset state can arrive as false or null, not only strings. */
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
		total_score: z.number().nullish(),
		quorum_pct: z.number().nullish(),
		quorum_reached: z.boolean().nullish(),
		quorum_threshold: z.number().nullish(),
		quorum_shortfall: z.number().nullish(),
		min_score: z.number().nullish(),
		max_score: z.number().nullish(),
		minimum_stance_choices: z.number().nullish(),
		maximum_stance_choices: z.number().nullish(),
		dots_per_person: z.number().nullish(),
		meeting_duration: z.number().nullish(),
		stv_seats: z.number().nullish(),
		stv_method: z.string().nullish(),
		stv_quota: z.number().nullish(),
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
		.describe('The discussion (thread) to comment on.'),
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
	priority: z.number().int().optional().describe('Sort order for the option.'),
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
				'Hide voter identities. Options freeze after the first ballot.',
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
	});

export type PollsCreateInput = z.input<typeof PollsCreateInputSchema>;

const PollsCreateResponseSchema = z
	.object({ poll: PollSchema })
	.loose()
	.describe(
		'The created poll in `poll`; its options arrive in the related `poll_options` array.',
	);

export type PollsCreateResponse = z.infer<typeof PollsCreateResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type LoomioEndpointInputs = {
	groupsList: GroupsListInput;
	groupsGet: GroupsGetInput;
	discussionsList: DiscussionsListInput;
	discussionsGet: DiscussionsGetInput;
	discussionsCreate: DiscussionsCreateInput;
	commentsCreate: CommentsCreateInput;
	threadsList: ThreadsListInput;
	threadsItems: ThreadsItemsInput;
	threadsMarkdown: ThreadsMarkdownInput;
	pollsList: PollsListInput;
	pollsGet: PollsGetInput;
	pollsCreate: PollsCreateInput;
};

export type LoomioEndpointOutputs = {
	groupsList: GroupsListResponse;
	groupsGet: GroupsGetResponse;
	discussionsList: DiscussionsListResponse;
	discussionsGet: DiscussionsGetResponse;
	discussionsCreate: DiscussionsCreateResponse;
	commentsCreate: CommentsCreateResponse;
	threadsList: ThreadsListResponse;
	threadsItems: ThreadsItemsResponse;
	threadsMarkdown: ThreadsMarkdownResponse;
	pollsList: PollsListResponse;
	pollsGet: PollsGetResponse;
	pollsCreate: PollsCreateResponse;
};

export const LoomioEndpointInputSchemas = {
	groupsList: GroupsListInputSchema,
	groupsGet: GroupsGetInputSchema,
	discussionsList: DiscussionsListInputSchema,
	discussionsGet: DiscussionsGetInputSchema,
	discussionsCreate: DiscussionsCreateInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	threadsList: ThreadsListInputSchema,
	threadsItems: ThreadsItemsInputSchema,
	threadsMarkdown: ThreadsMarkdownInputSchema,
	pollsList: PollsListInputSchema,
	pollsGet: PollsGetInputSchema,
	pollsCreate: PollsCreateInputSchema,
} as const;

export const LoomioEndpointOutputSchemas = {
	groupsList: GroupsListResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	discussionsList: DiscussionsListResponseSchema,
	discussionsGet: DiscussionsGetResponseSchema,
	discussionsCreate: DiscussionsCreateResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	threadsList: ThreadsListResponseSchema,
	threadsItems: ThreadsItemsResponseSchema,
	threadsMarkdown: ThreadsMarkdownResponseSchema,
	pollsList: PollsListResponseSchema,
	pollsGet: PollsGetResponseSchema,
	pollsCreate: PollsCreateResponseSchema,
} as const;
