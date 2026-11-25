// Fixture envelopes built from the /api/user0 serializers (discussion,
// poll, comment, membership, group, topic, topic_item) and the official API
// docs. No API key was available at build time, so these are not live
// captures; api.test.ts re-checks the read shapes against the real service.

export const API_KEY = 'loomio-test-key';

export const user = {
	id: 7,
	name: 'Ada Lovelace',
	username: 'ada',
	email: 'ada@loomio.example',
	avatar_url: 'https://www.loomio.example/ada.png',
};

export const group = {
	id: 12,
	key: 'gKq8',
	handle: 'design',
	name: 'Design',
	full_name: 'Design collective',
	description: 'Design talk',
	description_format: 'md',
	logo_url: 'https://www.loomio.example/logo.png',
	created_at: '2026-01-15T10:00:00.000Z',
	creator_id: 7,
	enabled: true,
	parent_id: null,
	group_privacy: 'open',
	membership_granted_upon: 'approval',
	listed_in_explore: false,
	memberships_count: 9,
	accepted_memberships_count: 8,
	pending_memberships_count: 1,
	admin_memberships_count: 2,
	discussions_count: 24,
	polls_count: 5,
	subgroups_count: 2,
	token: 'join-token',
	members_can_add_members: false,
	members_can_start_discussions: true,
	members_can_edit_discussions: true,
	members_can_edit_comments: false,
	members_can_delete_comments: false,
	members_can_create_subgroups: false,
	members_can_raise_motions: false,
	discarded_at: null,
};

export const discussion = {
	id: 88,
	key: 'dX2',
	group_id: 12,
	topic_id: 55,
	title: 'Colour palette for spring',
	content_locale: 'en',
	description: 'Pick three colours.',
	description_format: 'md',
	discussion_template_id: null,
	created_at: '2026-03-01T09:00:00.000Z',
	updated_at: '2026-03-02T11:30:00.000Z',
	context_changed_at: '2026-03-02T11:30:00.000Z',
	versions_count: 2,
	mentioned_usernames: ['ada'],
	discarded_at: null,
};

export const comment = {
	id: 401,
	body: 'I like the blue.',
	body_format: 'md',
	mentioned_usernames: [],
	topic_id: 55,
	created_at: '2026-03-02T10:00:00.000Z',
	updated_at: '2026-03-02T10:00:00.000Z',
	parent_id: 55,
	parent_type: 'Discussion',
	content_locale: 'en',
	versions_count: 0,
	author_id: 7,
	discarded_at: null,
	discarded_by: null,
};

export const topic = {
	id: 55,
	group_id: 12,
	items_count: 3,
	replies_count: 1,
	active_polls_count: 1,
	last_activity_at: '2026-03-03T08:00:00.000Z',
	discarded_at: null,
	locked_at: false,
	locker_id: null,
	pinned_at: null,
	topicable_id: 88,
	topicable_type: 'Discussion',
	has_anonymous_polls: false,
	tags: ['design'],
	topic_reader_id: 900,
	last_read_at: false,
};

export const topicItem = {
	id: 771,
	sequence_id: 1,
	position: 0,
	depth: 0,
	child_count: 0,
	kind: 'new_comment',
	topic_id: 55,
	created_at: '2026-03-02T10:00:00.000Z',
	itemable_id: 401,
	itemable_type: 'Comment',
	pinned: false,
	pinned_title: null,
	parent_id: null,
	actor_id: 7,
	position_key: '000',
	change_note: null,
	tags: [],
};

export const poll = {
	id: 63,
	key: 'pL4',
	title: 'Which blue?',
	details: 'Pick one.',
	details_format: 'md',
	poll_type: 'poll',
	poll_option_names: ['Sky blue', 'Navy'],
	closing_at: '2026-04-01T00:00:00.000Z',
	closed_at: null,
	opening_at: null,
	opened_at: '2026-03-02T09:00:00.000Z',
	created_at: '2026-03-01T12:00:00.000Z',
	anonymous: false,
	hide_results: 'off',
	shuffle_options: false,
	specified_voters_only: false,
	stance_reason_required: 'optional',
	reason_prompt: null,
	notify_on_closing_soon: 'author',
	notify_on_open: false,
	topic_id: 55,
	group_id: 12,
	author_id: 7,
	discarded_at: null,
	discarded_by: null,
	vote_count_cast: 4,
	vote_count_eligible: 8,
	vote_count_uncast: 4,
	participation_pct: 50,
	total_score: null,
	quorum_pct: 50,
	quorum_reached: true,
	quorum_threshold: 4,
	quorum_shortfall: 0,
	min_score: null,
	max_score: null,
	minimum_stance_choices: null,
	maximum_stance_choices: null,
	dots_per_person: null,
	meeting_duration: null,
	stv_seats: null,
	stv_method: null,
	stv_quota: null,
	chart_type: 'bar',
	show_none_of_the_above: false,
	weighted_voting: false,
	current_outcome_id: null,
};

export const groupsEnvelope = {
	groups: [group],
	users: [user],
	memberships: [
		{
			id: 300,
			group_id: 12,
			user_id: 7,
			admin: true,
			created_at: '2026-01-15T10:00:00.000Z',
		},
	],
	meta: { root: 'groups', total: 1 },
};

export const discussionsEnvelope = {
	discussions: [discussion],
	users: [user],
	groups: [group],
	meta: { root: 'discussions', total: 24 },
};

export const commentsEnvelope = {
	comments: [comment],
	users: [user],
	reactions: [],
	meta: { root: 'comments', total: null },
};

export const threadsEnvelope = {
	threads: [topic],
	discussions: [discussion],
	groups: [group],
	users: [user],
	meta: { root: 'threads', total: 6 },
};

export const itemsEnvelope = {
	items: [topicItem],
	comments: [comment],
	users: [user],
	meta: { root: 'items', total: 3 },
};

export const markdownResponse = {
	markdown: '# Colour palette for spring\n\nPick three colours.',
};

export const pollsEnvelope = {
	polls: [poll],
	poll_options: [
		{ id: 5, poll_id: 63, name: 'Sky blue' },
		{ id: 6, poll_id: 63, name: 'Navy' },
	],
	users: [user],
	outcomes: [],
	meta: { root: 'polls', total: 5 },
};

export const BAD_KEY_BODY = {
	error: 'You are not authorized to access this page.',
};
export const NOT_FOUND_BODY = { error: 404 };
export const BAD_REQUEST_BODY = { error: 400 };
export const VALIDATION_BODY = { errors: { title: ["can't be blank"] } };
export const UNKNOWN_ROUTE_BODY = { status: 404, error: 'Not Found' };
