import { z } from 'zod';

// Inputs use Gitea's own parameter names; outputs are `.loose()` and their
// documented fields nullish, so a field Gitea adds or omits cannot fail a
// call that has already happened. Field names are matched against live
// responses from gitea.com (see test-fixtures.ts), not the docs' examples:
// nested user objects use `created`/`last_login` while top-level fields are
// snake_case, and unset values arrive as JSON null or Go zero time
// "0001-01-01T00:00:00Z".

// ── shared object schemas ─────────────────────────────────────────────────

const OwnerSchema = z
	.string()
	.min(1)
	.describe('The owner (user or org) of the repository.');

const RepoSchema = z.string().min(1).describe('The repository name.');

/** Issue routes take the issue NUMBER (1-based per repo), never `Issue.id`. */
const IssueIndexSchema = z
	.number()
	.int()
	.positive()
	.describe(
		"The issue's `number` (shown in the issue URL), not its global `id`.",
	);

/** Release and hook routes take their numeric ids. */
const NumericIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The numeric `id` of the resource.');

const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page number of results to return (1-based). Defaults to 1.');

// The server caps this at MAX_RESPONSE_ITEMS (50 by default). Values above
// the cap are rejected here because the client sends 50 when the caller
// omits one, and a larger value would silently return the cap anyway.
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(50)
	.optional()
	.describe(
		'Page size of results, at most 50 (the server-side cap). Defaults to 50.',
	);

const JsonValueMapSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

const TimestampSchema = z
	.string()
	.describe('An RFC3339 timestamp; offsets as well as `Z` are accepted.');

const UserSchema = z
	.object({
		id: z.number(),
		login: z.string().nullish(),
		// One of User, Organization, Bot; a new type must not fail a read.
		type: z.string().nullish(),
		login_name: z.string().nullish(),
		source_id: z.number().nullish(),
		full_name: z.string().nullish(),
		email: z.string().nullish(),
		avatar_url: z.string().nullish(),
		html_url: z.string().nullish(),
		language: z.string().nullish(),
		is_admin: z.boolean().nullish(),
		// Nested user objects use `created`/`last_login` (no _at), and unset
		// values arrive as Go zero time, so they stay plain strings.
		last_login: z.string().nullish(),
		created: z.string().nullish(),
		restricted: z.boolean().nullish(),
		active: z.boolean().nullish(),
		prohibit_login: z.boolean().nullish(),
		location: z.string().nullish(),
		website: z.string().nullish(),
		description: z.string().nullish(),
		visibility: z.string().nullish(),
		followers_count: z.number().nullish(),
		following_count: z.number().nullish(),
		starred_repos_count: z.number().nullish(),
		username: z.string().nullish(),
	})
	.loose();

export type GiteaUser = z.infer<typeof UserSchema>;

const PermissionsSchema = z
	.object({
		admin: z.boolean().nullish(),
		push: z.boolean().nullish(),
		pull: z.boolean().nullish(),
	})
	.loose();

const RepositorySchema = z
	.object({
		id: z.number(),
		owner: UserSchema.nullish(),
		name: z.string().nullish(),
		full_name: z.string().nullish(),
		description: z.string().nullish(),
		empty: z.boolean().nullish(),
		private: z.boolean().nullish(),
		fork: z.boolean().nullish(),
		template: z.boolean().nullish(),
		mirror: z.boolean().nullish(),
		size: z.number().nullish(),
		language: z.string().nullish(),
		languages_url: z.string().nullish(),
		html_url: z.string().nullish(),
		url: z.string().nullish(),
		link: z.string().nullish(),
		ssh_url: z.string().nullish(),
		clone_url: z.string().nullish(),
		original_url: z.string().nullish(),
		website: z.string().nullish(),
		stars_count: z.number().nullish(),
		forks_count: z.number().nullish(),
		watchers_count: z.number().nullish(),
		branch_count: z.number().nullish(),
		open_issues_count: z.number().nullish(),
		open_pr_counter: z.number().nullish(),
		release_counter: z.number().nullish(),
		default_branch: z.string().nullish(),
		archived: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		archived_at: z.string().nullish(),
		permissions: PermissionsSchema.nullish(),
		has_code: z.boolean().nullish(),
		has_issues: z.boolean().nullish(),
		// unknown: the internal tracker settings are a small fixed map Gitea can
		// extend, passed through as sent.
		internal_tracker: JsonValueMapSchema.nullish(),
		has_wiki: z.boolean().nullish(),
		has_pull_requests: z.boolean().nullish(),
		has_projects: z.boolean().nullish(),
		projects_mode: z.string().nullish(),
		has_releases: z.boolean().nullish(),
		has_packages: z.boolean().nullish(),
		has_actions: z.boolean().nullish(),
		ignore_whitespace_conflicts: z.boolean().nullish(),
		allow_merge_commits: z.boolean().nullish(),
		allow_rebase: z.boolean().nullish(),
		allow_rebase_explicit: z.boolean().nullish(),
		allow_rebase_update: z.boolean().nullish(),
		allow_squash_merge: z.boolean().nullish(),
		allow_fast_forward_only_merge: z.boolean().nullish(),
		allow_merge_update: z.boolean().nullish(),
		allow_manual_merge: z.boolean().nullish(),
		autodetect_manual_merge: z.boolean().nullish(),
		default_delete_branch_after_merge: z.boolean().nullish(),
		default_merge_style: z.string().nullish(),
		default_update_style: z.string().nullish(),
		default_allow_maintainer_edit: z.boolean().nullish(),
		avatar_url: z.string().nullish(),
		internal: z.boolean().nullish(),
		mirror_interval: z.string().nullish(),
		// Unset mirror timestamps arrive as Go zero time strings.
		mirror_updated: z.string().nullish(),
		mirror_last_sync_at: z.string().nullish(),
		object_format_name: z.string().nullish(),
		topics: z.array(z.string()).nullish(),
		licenses: z.array(z.string()).nullish(),
	})
	.loose();

export type GiteaRepository = z.infer<typeof RepositorySchema>;

const LabelSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		// Lowercase hex without the leading `#`, e.g. "00a316"; kept a string so
		// a future format change cannot fail a read.
		color: z.string().nullish(),
		description: z.string().nullish(),
		exclusive: z.boolean().nullish(),
		is_archived: z.boolean().nullish(),
		url: z.string().nullish(),
	})
	.loose();

const AttachmentSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		size: z.number().nullish(),
		download_count: z.number().nullish(),
		created_at: z.string().nullish(),
		uuid: z.string().nullish(),
		browser_download_url: z.string().nullish(),
	})
	.loose();

const PullRequestMetaSchema = z
	.object({
		merged: z.boolean().nullish(),
		merged_at: z.string().nullish(),
		draft: z.boolean().nullish(),
		html_url: z.string().nullish(),
	})
	.loose();

const RepositoryMetaSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		owner: z.string().nullish(),
		full_name: z.string().nullish(),
	})
	.loose();

const MilestoneSchema = z
	.object({
		id: z.number(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		state: z.string().nullish(),
		open_issues_count: z.number().nullish(),
		closed_issues_count: z.number().nullish(),
		due_on: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		closed_at: z.string().nullish(),
	})
	.loose();

const IssueSchema = z
	.object({
		id: z.number(),
		number: z.number(),
		url: z.string().nullish(),
		html_url: z.string().nullish(),
		// The poster; Gitea names it `user`.
		user: UserSchema.nullish(),
		original_author: z.string().nullish(),
		original_author_id: z.number().nullish(),
		title: z.string().nullish(),
		body: z.string().nullish(),
		ref: z.string().nullish(),
		assets: z.array(AttachmentSchema).nullish(),
		labels: z.array(LabelSchema).nullish(),
		milestone: MilestoneSchema.nullish(),
		// Unset fields arrive as JSON null, not absent: assignees is null, not [].
		projects: z.array(z.number()).nullish(),
		assignee: UserSchema.nullish(),
		assignees: z.array(UserSchema).nullish(),
		state: z.string().nullish(),
		is_locked: z.boolean().nullish(),
		// Comment count, not the comments themselves.
		comments: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		closed_at: z.string().nullish(),
		due_date: z.string().nullish(),
		time_estimate: z.number().nullish(),
		// Present and non-null when the issue is a pull request.
		pull_request: PullRequestMetaSchema.nullish(),
		repository: RepositoryMetaSchema.nullish(),
		pin_order: z.number().nullish(),
		content_version: z.number().nullish(),
	})
	.loose();

export type GiteaIssue = z.infer<typeof IssueSchema>;

const PayloadUserSchema = z
	.object({
		name: z.string().nullish(),
		email: z.string().nullish(),
		username: z.string().nullish(),
	})
	.loose();

const PayloadCommitSchema = z
	.object({
		id: z.string().nullish(),
		message: z.string().nullish(),
		url: z.string().nullish(),
		author: PayloadUserSchema.nullish(),
		committer: PayloadUserSchema.nullish(),
		// unknown: verification flags are a small map Gitea extends between
		// versions, passed through as sent.
		verification: JsonValueMapSchema.nullish(),
		timestamp: z.string().nullish(),
		added: z.array(z.string()).nullish(),
		removed: z.array(z.string()).nullish(),
		modified: z.array(z.string()).nullish(),
	})
	.loose();

const BranchSchema = z
	.object({
		name: z.string().nullish(),
		commit: PayloadCommitSchema.nullish(),
		protected: z.boolean().nullish(),
		effective_branch_protection_name: z.string().nullish(),
		user_can_push: z.boolean().nullish(),
		user_can_merge: z.boolean().nullish(),
		enable_status_check: z.boolean().nullish(),
		required_approvals: z.number().nullish(),
		status_check_contexts: z.array(z.string()).nullish(),
	})
	.loose();

export type GiteaBranch = z.infer<typeof BranchSchema>;

const CommitUserSchema = z
	.object({
		name: z.string().nullish(),
		email: z.string().nullish(),
		// Git signature dates keep their original UTC offset, e.g.
		// 2020-10-27T11:53:06+08:00, so this is a plain string.
		date: z.string().nullish(),
	})
	.loose();

const CommitMetaSchema = z
	.object({
		url: z.string().nullish(),
		sha: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

const RepoCommitSchema = z
	.object({
		url: z.string().nullish(),
		message: z.string().nullish(),
		author: CommitUserSchema.nullish(),
		committer: CommitUserSchema.nullish(),
		tree: CommitMetaSchema.nullish(),
		verification: JsonValueMapSchema.nullish(),
	})
	.loose();

const CommitStatsSchema = z
	.object({
		total: z.number().nullish(),
		additions: z.number().nullish(),
		deletions: z.number().nullish(),
	})
	.loose();

const CommitSchema = z
	.object({
		url: z.string().nullish(),
		sha: z.string().nullish(),
		// The commit list uses `created` (no _at), matching the nested objects.
		created: z.string().nullish(),
		html_url: z.string().nullish(),
		author: UserSchema.nullish(),
		committer: UserSchema.nullish(),
		commit: RepoCommitSchema.nullish(),
		parents: z.array(CommitMetaSchema).nullish(),
		stats: CommitStatsSchema.nullish(),
		files: z
			.array(
				z
					.object({
						filename: z.string().nullish(),
						status: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type GiteaCommit = z.infer<typeof CommitSchema>;

const CommentSchema = z
	.object({
		id: z.number(),
		body: z.string().nullish(),
		user: UserSchema.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		issue_url: z.string().nullish(),
		pull_request_url: z.string().nullish(),
		html_url: z.string().nullish(),
		original_author: z.string().nullish(),
		original_author_id: z.number().nullish(),
		assets: z.array(AttachmentSchema).nullish(),
	})
	.loose();

export type GiteaComment = z.infer<typeof CommentSchema>;

const ReleaseSchema = z
	.object({
		id: z.number(),
		tag_name: z.string().nullish(),
		target_commitish: z.string().nullish(),
		name: z.string().nullish(),
		body: z.string().nullish(),
		draft: z.boolean().nullish(),
		prerelease: z.boolean().nullish(),
		author: UserSchema.nullish(),
		assets: z.array(AttachmentSchema).nullish(),
		created_at: z.string().nullish(),
		published_at: z.string().nullish(),
		url: z.string().nullish(),
		html_url: z.string().nullish(),
		tarball_url: z.string().nullish(),
		zipball_url: z.string().nullish(),
		upload_url: z.string().nullish(),
	})
	.loose();

export type GiteaRelease = z.infer<typeof ReleaseSchema>;

const HookSchema = z
	.object({
		id: z.number(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		active: z.boolean().nullish(),
		events: z.array(z.string()).nullish(),
		// The signing secret is not echoed back; url and content_type are.
		config: z.record(z.string(), z.string()).nullish(),
		authorization_header: z.string().nullish(),
		branch_filter: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type GiteaHook = z.infer<typeof HookSchema>;

// ── user.me ───────────────────────────────────────────────────────────────

const UserMeInputSchema = z.object({});

export type UserMeInput = z.input<typeof UserMeInputSchema>;

const UserMeResponseSchema = UserSchema;

export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;

// ── repos.list / get / create / delete ────────────────────────────────────

const ReposListInputSchema = z.object({
	page: PageSchema,
	limit: LimitSchema,
});

export type ReposListInput = z.input<typeof ReposListInputSchema>;

const ReposListResponseSchema = z.object({
	repositories: z.array(RepositorySchema),
	page: z.number().int(),
	limit: z.number().int(),
});

export type ReposListResponse = z.infer<typeof ReposListResponseSchema>;

const ReposGetInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
});

export type ReposGetInput = z.input<typeof ReposGetInputSchema>;

const ReposGetResponseSchema = RepositorySchema;

export type ReposGetResponse = z.infer<typeof ReposGetResponseSchema>;

export const REPO_OBJECT_FORMATS = ['sha1', 'sha256'] as const;
export const REPO_TRUST_MODELS = [
	'default',
	'collaborator',
	'committer',
	'collaboratorcommitter',
] as const;

const ReposCreateInputSchema = z.object({
	// Gitea also rejects names its UI would (spaces, reserved names); only the
	// spec-required non-emptiness is pinned here.
	name: z.string().min(1).describe('Name of the repository to create.'),
	description: z
		.string()
		.optional()
		.describe('Short description displayed next to the repository.'),
	private: z
		.boolean()
		.optional()
		.describe('Make the repository private. Defaults to public.'),
	auto_init: z
		.boolean()
		.optional()
		.describe(
			'Create an initial commit with a README so the repository is not empty.',
		),
	default_branch: z
		.string()
		.optional()
		.describe('Branch used as the default, e.g. main.'),
	gitignores: z
		.string()
		.optional()
		.describe('Comma-separated gitignore template names applied on auto_init.'),
	issue_labels: z
		.string()
		.optional()
		.describe('Issue label set applied on auto_init.'),
	license: z
		.string()
		.optional()
		.describe('License template applied on auto_init.'),
	readme: z
		.string()
		.optional()
		.describe('Readme template applied on auto_init.'),
	template: z
		.boolean()
		.optional()
		.describe('Mark the repository as a template.'),
	object_format_name: z
		.enum(REPO_OBJECT_FORMATS)
		.optional()
		.describe('Git object format. Defaults to sha1.'),
	trust_model: z
		.enum(REPO_TRUST_MODELS)
		.optional()
		.describe('Which signatures to trust when verifying commits.'),
});

export type ReposCreateInput = z.input<typeof ReposCreateInputSchema>;

const ReposCreateResponseSchema = RepositorySchema;

export type ReposCreateResponse = z.infer<typeof ReposCreateResponseSchema>;

const ReposDeleteInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
});

export type ReposDeleteInput = z.input<typeof ReposDeleteInputSchema>;

// The delete answers 204 with an empty body; the result records what was
// removed because there is nothing left to read back.
const ReposDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	owner: z.string(),
	repo: z.string(),
});

export type ReposDeleteResponse = z.infer<typeof ReposDeleteResponseSchema>;

// ── branches.list ─────────────────────────────────────────────────────────

const BranchesListInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	q: z
		.string()
		.optional()
		.describe('Only branches whose name contains this string.'),
	page: PageSchema,
	limit: LimitSchema,
});

export type BranchesListInput = z.input<typeof BranchesListInputSchema>;

const BranchesListResponseSchema = z.object({
	branches: z.array(BranchSchema),
	page: z.number().int(),
	limit: z.number().int(),
});

export type BranchesListResponse = z.infer<typeof BranchesListResponseSchema>;

// ── commits.list ──────────────────────────────────────────────────────────

const CommitsListInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	sha: z
		.string()
		.optional()
		.describe('Branch or tag name, or a commit SHA, to start listing from.'),
	path: z.string().optional().describe('Only commits touching this file path.'),
	since: TimestampSchema.optional().describe(
		'Only commits made at or after this time.',
	),
	until: TimestampSchema.optional().describe(
		'Only commits made at or before this time.',
	),
	stat: z
		.boolean()
		.optional()
		.describe('Include add and delete counts per commit.'),
	verification: z
		.boolean()
		.optional()
		.describe('Include signature verification per commit.'),
	files: z
		.boolean()
		.optional()
		.describe('Include the list of affected files per commit.'),
	page: PageSchema,
	limit: LimitSchema,
	// Gitea's own query name: exclude commits reachable from this ref.
	not: z
		.string()
		.optional()
		.describe(
			'Exclude commits reachable from this ref (the API names the parameter `not`).',
		),
});

export type CommitsListInput = z.input<typeof CommitsListInputSchema>;

const CommitsListResponseSchema = z.object({
	commits: z.array(CommitSchema),
	page: z.number().int(),
	limit: z.number().int(),
});

export type CommitsListResponse = z.infer<typeof CommitsListResponseSchema>;

// ── issues.list / get / create / update ───────────────────────────────────

export const ISSUE_STATES = ['open', 'closed', 'all'] as const;
export const ISSUE_TYPES = ['issues', 'pulls'] as const;

const IssuesListInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	state: z
		.enum(ISSUE_STATES)
		.optional()
		.describe('Only issues in this state. Defaults to open.'),
	// Comma-separated label names, as the API takes them.
	labels: z
		.string()
		.optional()
		.describe('Comma-separated label names to filter by.'),
	q: z
		.string()
		.optional()
		.describe('Filter issues whose title or body contains this string.'),
	type: z
		.enum(ISSUE_TYPES)
		.optional()
		.describe(
			'Only issues or only pull requests; the issues list returns both by default.',
		),
	milestones: z
		.string()
		.optional()
		.describe(
			'Comma-separated milestone ids to filter by, or * for any milestone.',
		),
	since: TimestampSchema.optional().describe(
		'Only issues updated at or after this time.',
	),
	before: TimestampSchema.optional().describe(
		'Only issues updated at or before this time.',
	),
	created_by: z
		.string()
		.optional()
		.describe('Only issues created by this user name.'),
	assigned_by: z
		.string()
		.optional()
		.describe('Only issues assigned to this user name.'),
	mentioned_by: z
		.string()
		.optional()
		.describe('Only issues mentioning this user name.'),
	page: PageSchema,
	limit: LimitSchema,
});

export type IssuesListInput = z.input<typeof IssuesListInputSchema>;

const IssuesListResponseSchema = z.object({
	issues: z.array(IssueSchema),
	page: z.number().int(),
	limit: z.number().int(),
});

export type IssuesListResponse = z.infer<typeof IssuesListResponseSchema>;

const IssuesGetInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	index: IssueIndexSchema,
});

export type IssuesGetInput = z.input<typeof IssuesGetInputSchema>;

const IssuesGetResponseSchema = IssueSchema;

export type IssuesGetResponse = z.infer<typeof IssuesGetResponseSchema>;

const IssuesCreateInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	title: z.string().min(1).describe('Title of the issue.'),
	body: z.string().optional().describe('Body of the issue, markdown.'),
	assignee: z
		.string()
		.optional()
		.describe('User name to assign; ignored when assignees is set.'),
	assignees: z.array(z.string()).optional().describe('User names to assign.'),
	// Opening an issue already closed, without an extra update call.
	closed: z.boolean().optional().describe('Create the issue already closed.'),
	due_date: TimestampSchema.optional().describe('Deadline shown on the issue.'),
	labels: z
		.array(z.number().int())
		.optional()
		.describe('Label ids to apply; ids come from the repository label list.'),
	milestone: z.number().int().optional().describe('Milestone id to set.'),
	projects: z
		.array(z.number().int())
		.optional()
		.describe('Project ids to add the issue to.'),
	ref: z.string().optional().describe('Git reference the issue relates to.'),
});

export type IssuesCreateInput = z.input<typeof IssuesCreateInputSchema>;

const IssuesCreateResponseSchema = IssueSchema;

export type IssuesCreateResponse = z.infer<typeof IssuesCreateResponseSchema>;

const IssuesUpdateInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	index: IssueIndexSchema,
	title: z
		.string()
		.optional()
		.describe('New title; omitted keeps the current one.'),
	body: z
		.string()
		.optional()
		.describe('New body; omitted keeps the current one.'),
	// Close and reopen both go through this field; reopening is possible, so
	// the state change stays undoable and the operation stays a write.
	state: z
		.enum(['open', 'closed'])
		.optional()
		.describe('Set to closed to close the issue, open to reopen it.'),
	assignee: z
		.string()
		.optional()
		.describe('User name to assign; ignored when assignees is set.'),
	assignees: z.array(z.string()).optional().describe('User names to assign.'),
	due_date: TimestampSchema.optional().describe(
		'New deadline; pair with unset_due_date to clear it.',
	),
	milestone: z.number().int().optional().describe('Milestone id to set.'),
	projects: z
		.array(z.number().int())
		.optional()
		.describe('Project ids to set.'),
	ref: z.string().optional().describe('Git reference the issue relates to.'),
	unset_due_date: z
		.boolean()
		.optional()
		.describe('Clear the deadline instead of setting one.'),
	// Optimistic-lock token from a previous read; a stale value answers 409.
	content_version: z
		.number()
		.int()
		.optional()
		.describe(
			'The `content_version` from a previous read, so a stale edit is refused rather than applied.',
		),
});

export type IssuesUpdateInput = z.input<typeof IssuesUpdateInputSchema>;

const IssuesUpdateResponseSchema = IssueSchema;

export type IssuesUpdateResponse = z.infer<typeof IssuesUpdateResponseSchema>;

// ── comments.list / create ────────────────────────────────────────────────

const CommentsListInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	index: IssueIndexSchema,
	since: TimestampSchema.optional().describe(
		'Only comments updated at or after this time.',
	),
	before: TimestampSchema.optional().describe(
		'Only comments updated at or before this time.',
	),
	// This route takes no page or limit: it returns every matching comment.
});

export type CommentsListInput = z.input<typeof CommentsListInputSchema>;

const CommentsListResponseSchema = z.object({
	comments: z.array(CommentSchema),
});

export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

const CommentsCreateInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	index: IssueIndexSchema,
	body: z.string().min(1).describe('Comment text, markdown.'),
});

export type CommentsCreateInput = z.input<typeof CommentsCreateInputSchema>;

const CommentsCreateResponseSchema = CommentSchema;

export type CommentsCreateResponse = z.infer<
	typeof CommentsCreateResponseSchema
>;

// ── releases.list / create ────────────────────────────────────────────────

const ReleasesListInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	draft: z
		.boolean()
		.optional()
		.describe('Only draft (true) or published (false) releases.'),
	pre_release: z
		.boolean()
		.optional()
		.describe(
			'Only prereleases (true) or final releases (false). Sent to the API as `pre-release`.',
		),
	tag_filter: z
		.string()
		.optional()
		.describe('Only releases whose tag matches this filter.'),
	page: PageSchema,
	limit: LimitSchema,
});

export type ReleasesListInput = z.input<typeof ReleasesListInputSchema>;

const ReleasesListResponseSchema = z.object({
	releases: z.array(ReleaseSchema),
	page: z.number().int(),
	limit: z.number().int(),
});

export type ReleasesListResponse = z.infer<typeof ReleasesListResponseSchema>;

const ReleasesCreateInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	tag_name: z
		.string()
		.min(1)
		.describe(
			'Tag to release; created on the target commit if it does not exist. A tag that already has a release answers 409.',
		),
	target_commitish: z
		.string()
		.optional()
		.describe(
			'Branch or SHA the tag points at when the tag does not exist yet. Defaults to the default branch.',
		),
	name: z.string().optional().describe('Release title.'),
	body: z.string().optional().describe('Release notes, markdown.'),
	draft: z
		.boolean()
		.optional()
		.describe('Create as a draft, invisible to non-collaborators.'),
	prerelease: z
		.boolean()
		.optional()
		.describe('Mark the release as a prerelease.'),
	tag_message: z
		.string()
		.optional()
		.describe('Annotation for the tag created along with the release.'),
});

export type ReleasesCreateInput = z.input<typeof ReleasesCreateInputSchema>;

const ReleasesCreateResponseSchema = ReleaseSchema;

export type ReleasesCreateResponse = z.infer<
	typeof ReleasesCreateResponseSchema
>;

// ── webhooks.list / create / delete (API management only) ─────────────────

export const HOOK_TYPES = [
	'dingtalk',
	'discord',
	'gitea',
	'gogs',
	'msteams',
	'slack',
	'telegram',
	'feishu',
	'wechatwork',
	'packagist',
] as const;

const WebhooksListInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	page: PageSchema,
	limit: LimitSchema,
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z.object({
	hooks: z.array(HookSchema),
	page: z.number().int(),
	limit: z.number().int(),
});

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksCreateInputSchema = z
	.object({
		owner: OwnerSchema,
		repo: RepoSchema,
		type: z
			.enum(HOOK_TYPES)
			.describe(
				'Which payload format the target expects, e.g. gitea, slack or discord.',
			),
		config: z
			.record(z.string(), z.string())
			.describe(
				'Target settings. `url` (delivery target) and `content_type` (json or form) are required; a `secret` key sets the HMAC signing secret and is never echoed back.',
			),
		active: z
			.boolean()
			.optional()
			.describe(
				'Whether the hook triggers on events. Gitea creates hooks inactive when this is omitted.',
			),
		events: z
			.array(z.string())
			.optional()
			.describe(
				"Event names to subscribe, as named in the repository's webhook settings (for example push, issue_events, pull_request_events). Empty subscribes push only.",
			),
		name: z.string().optional().describe('Display name of the hook.'),
		authorization_header: z
			.string()
			.optional()
			.describe('Sent as the Authorization header on every delivery.'),
		branch_filter: z
			.string()
			.optional()
			.describe('Glob pattern restricting which branches trigger push events.'),
	})
	.superRefine((value, refine) => {
		const config = value.config;
		if (!config.url || config.url.length === 0) {
			refine.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['config'],
				message: 'config.url is required: the URL deliveries are POSTed to',
			});
		}
		if (!config.content_type || config.content_type.length === 0) {
			refine.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['config'],
				message: "config.content_type is required: 'json' or 'form'",
			});
		}
	});

export type WebhooksCreateInput = z.input<typeof WebhooksCreateInputSchema>;

const WebhooksCreateResponseSchema = HookSchema;

export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;

const WebhooksDeleteInputSchema = z.object({
	owner: OwnerSchema,
	repo: RepoSchema,
	id: NumericIdSchema,
});

export type WebhooksDeleteInput = z.input<typeof WebhooksDeleteInputSchema>;

const WebhooksDeleteResponseSchema = z.object({
	deleted: z.literal(true),
	id: z.number(),
});

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export type GiteaEndpointInputs = {
	userMe: UserMeInput;
	reposList: ReposListInput;
	reposGet: ReposGetInput;
	reposCreate: ReposCreateInput;
	reposDelete: ReposDeleteInput;
	branchesList: BranchesListInput;
	commitsList: CommitsListInput;
	issuesList: IssuesListInput;
	issuesGet: IssuesGetInput;
	issuesCreate: IssuesCreateInput;
	issuesUpdate: IssuesUpdateInput;
	commentsList: CommentsListInput;
	commentsCreate: CommentsCreateInput;
	releasesList: ReleasesListInput;
	releasesCreate: ReleasesCreateInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksDelete: WebhooksDeleteInput;
};

export type GiteaEndpointOutputs = {
	userMe: UserMeResponse;
	reposList: ReposListResponse;
	reposGet: ReposGetResponse;
	reposCreate: ReposCreateResponse;
	reposDelete: ReposDeleteResponse;
	branchesList: BranchesListResponse;
	commitsList: CommitsListResponse;
	issuesList: IssuesListResponse;
	issuesGet: IssuesGetResponse;
	issuesCreate: IssuesCreateResponse;
	issuesUpdate: IssuesUpdateResponse;
	commentsList: CommentsListResponse;
	commentsCreate: CommentsCreateResponse;
	releasesList: ReleasesListResponse;
	releasesCreate: ReleasesCreateResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksDelete: WebhooksDeleteResponse;
};

export const GiteaEndpointInputSchemas = {
	userMe: UserMeInputSchema,
	reposList: ReposListInputSchema,
	reposGet: ReposGetInputSchema,
	reposCreate: ReposCreateInputSchema,
	reposDelete: ReposDeleteInputSchema,
	branchesList: BranchesListInputSchema,
	commitsList: CommitsListInputSchema,
	issuesList: IssuesListInputSchema,
	issuesGet: IssuesGetInputSchema,
	issuesCreate: IssuesCreateInputSchema,
	issuesUpdate: IssuesUpdateInputSchema,
	commentsList: CommentsListInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	releasesList: ReleasesListInputSchema,
	releasesCreate: ReleasesCreateInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const GiteaEndpointOutputSchemas = {
	userMe: UserMeResponseSchema,
	reposList: ReposListResponseSchema,
	reposGet: ReposGetResponseSchema,
	reposCreate: ReposCreateResponseSchema,
	reposDelete: ReposDeleteResponseSchema,
	branchesList: BranchesListResponseSchema,
	commitsList: CommitsListResponseSchema,
	issuesList: IssuesListResponseSchema,
	issuesGet: IssuesGetResponseSchema,
	issuesCreate: IssuesCreateResponseSchema,
	issuesUpdate: IssuesUpdateResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	releasesList: ReleasesListResponseSchema,
	releasesCreate: ReleasesCreateResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
} as const;
