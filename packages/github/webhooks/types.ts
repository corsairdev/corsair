import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
	login: z.string(),
	id: z.number(),
	node_id: z.string(),
	name: z.string().optional(),
	email: z.string().nullable().optional(),
	avatar_url: z.string(),
	gravatar_id: z.string(),
	url: z.string(),
	html_url: z.string(),
	followers_url: z.string(),
	following_url: z.string(),
	gists_url: z.string(),
	starred_url: z.string(),
	subscriptions_url: z.string(),
	organizations_url: z.string(),
	repos_url: z.string(),
	events_url: z.string(),
	received_events_url: z.string(),
	type: z.enum(['Bot', 'User', 'Organization']),
	site_admin: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;

export const RepositorySchema = z.object({
	id: z.number(),
	node_id: z.string(),
	name: z.string(),
	full_name: z.string(),
	private: z.boolean(),
	owner: UserSchema,
	html_url: z.string(),
	description: z.string().nullable(),
	fork: z.boolean(),
	url: z.string(),
	created_at: z.union([z.number(), z.string()]),
	updated_at: z.string(),
	pushed_at: z.union([z.number(), z.string()]).nullable(),
	default_branch: z.string(),
});
export type Repository = z.infer<typeof RepositorySchema>;

export const PullRequestSchema = z.object({
	url: z.string(),
	id: z.number(),
	node_id: z.string(),
	html_url: z.string(),
	diff_url: z.string(),
	patch_url: z.string(),
	issue_url: z.string(),
	number: z.number(),
	state: z.enum(['open', 'closed']),
	locked: z.boolean(),
	title: z.string(),
	user: UserSchema,
	body: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	closed_at: z.string().nullable(),
	merged_at: z.string().nullable(),
	merge_commit_sha: z.string().nullable(),
	assignee: UserSchema.nullable(),
	assignees: z.array(UserSchema),
	draft: z.boolean().optional(),
	merged: z.boolean().nullable(),
	mergeable: z.boolean().nullable(),
	comments: z.number(),
	review_comments: z.number(),
	commits: z.number(),
	additions: z.number(),
	deletions: z.number(),
	changed_files: z.number(),
	active_lock_reason: z.string().nullable().optional(),
	merged_by: UserSchema.nullable().optional(),
});
export type PullRequest = z.infer<typeof PullRequestSchema>;

const CommitterSchema = z.object({
	name: z.string(),
	email: z.string().nullable(),
	username: z.string().optional(),
	date: z.string().optional(),
});
export type Committer = z.infer<typeof CommitterSchema>;

export const CommitSchema = z.object({
	id: z.string(),
	tree_id: z.string(),
	distinct: z.boolean(),
	message: z.string(),
	timestamp: z.string(),
	url: z.string(),
	author: CommitterSchema,
	committer: CommitterSchema,
	added: z.array(z.string()),
	modified: z.array(z.string()),
	removed: z.array(z.string()),
});
export type Commit = z.infer<typeof CommitSchema>;

const OrganizationSchema = z.object({
	login: z.string(),
	id: z.number(),
	node_id: z.string(),
	url: z.string(),
	html_url: z.string().optional(),
	repos_url: z.string(),
	events_url: z.string(),
	hooks_url: z.string(),
	issues_url: z.string(),
	members_url: z.string(),
	public_members_url: z.string(),
	avatar_url: z.string(),
	description: z.string().nullable(),
});

const InstallationSchema = z.object({
	id: z.number(),
	node_id: z.string(),
});

export const IssueLabelSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	url: z.string(),
	name: z.string(),
	color: z.string(),
	default: z.boolean(),
	description: z.string().nullable(),
});
export type IssueLabel = z.infer<typeof IssueLabelSchema>;

export const MilestoneSchema = z.object({
	url: z.string(),
	html_url: z.string(),
	labels_url: z.string(),
	id: z.number(),
	node_id: z.string(),
	number: z.number(),
	title: z.string(),
	description: z.string().nullable(),
	creator: UserSchema.nullable(),
	open_issues: z.number(),
	closed_issues: z.number(),
	state: z.enum(['open', 'closed']),
	created_at: z.string(),
	updated_at: z.string(),
	due_on: z.string().nullable(),
	closed_at: z.string().nullable(),
});
export type Milestone = z.infer<typeof MilestoneSchema>;

export const IssueSchema = z.object({
	url: z.string(),
	repository_url: z.string(),
	html_url: z.string(),
	id: z.number(),
	node_id: z.string(),
	number: z.number(),
	title: z.string(),
	user: UserSchema,
	labels: z.array(IssueLabelSchema),
	state: z.enum(['open', 'closed']),
	locked: z.boolean(),
	assignee: UserSchema.nullable(),
	assignees: z.array(UserSchema),
	milestone: MilestoneSchema.nullable(),
	comments: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
	closed_at: z.string().nullable(),
	body: z.string().nullable(),
	active_lock_reason: z.string().nullable().optional(),
	draft: z.boolean().optional(),
	pull_request: z
		.object({
			url: z.string(),
			html_url: z.string(),
			diff_url: z.string(),
			patch_url: z.string(),
		})
		.optional(),
});
export type Issue = z.infer<typeof IssueSchema>;

export const CommentSchema = z.object({
	url: z.string(),
	html_url: z.string(),
	issue_url: z.string(),
	id: z.number(),
	node_id: z.string(),
	user: UserSchema,
	created_at: z.string(),
	updated_at: z.string(),
	author_association: z.string(),
	body: z.string(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const PRReviewSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	user: UserSchema,
	body: z.string().nullable(),
	commit_id: z.string(),
	submitted_at: z.string().nullable(),
	state: z.string(),
	html_url: z.string(),
	pull_request_url: z.string(),
	author_association: z.string(),
});
export type PRReview = z.infer<typeof PRReviewSchema>;

export const PRReviewCommentSchema = z.object({
	url: z.string(),
	pull_request_review_id: z.number().nullable(),
	id: z.number(),
	node_id: z.string(),
	diff_hunk: z.string(),
	path: z.string(),
	position: z.number().nullable(),
	original_position: z.number().nullable(),
	commit_id: z.string(),
	original_commit_id: z.string(),
	user: UserSchema,
	body: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	html_url: z.string(),
	pull_request_url: z.string(),
	author_association: z.string(),
});
export type PRReviewComment = z.infer<typeof PRReviewCommentSchema>;

export const ReleaseSchema = z.object({
	url: z.string(),
	assets_url: z.string(),
	upload_url: z.string(),
	html_url: z.string(),
	id: z.number(),
	node_id: z.string(),
	tag_name: z.string(),
	target_commitish: z.string(),
	name: z.string().nullable(),
	draft: z.boolean(),
	prerelease: z.boolean(),
	created_at: z.string(),
	published_at: z.string().nullable(),
	author: UserSchema,
	body: z.string().nullable(),
	tarball_url: z.string().nullable(),
	zipball_url: z.string().nullable(),
});
export type Release = z.infer<typeof ReleaseSchema>;

export const DeploymentSchema = z.object({
	url: z.string(),
	id: z.number(),
	node_id: z.string(),
	sha: z.string(),
	ref: z.string(),
	task: z.string(),
	environment: z.string(),
	description: z.string().nullable(),
	creator: UserSchema.nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	statuses_url: z.string(),
	repository_url: z.string(),
	performed_via_github_app: z.unknown().nullable().optional(),
});
export type Deployment = z.infer<typeof DeploymentSchema>;

export const DeploymentStatusSchema = z.object({
	url: z.string(),
	id: z.number(),
	node_id: z.string(),
	state: z.enum([
		'error',
		'failure',
		'inactive',
		'in_progress',
		'queued',
		'pending',
		'success',
		'waiting',
	]),
	creator: UserSchema,
	description: z.string().nullable(),
	environment: z.string().optional(),
	target_url: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	deployment_url: z.string(),
	repository_url: z.string(),
});
export type DeploymentStatus = z.infer<typeof DeploymentStatusSchema>;

export const WorkflowRunSchema = z.object({
	id: z.number(),
	name: z.string().nullable(),
	node_id: z.string(),
	head_branch: z.string().nullable(),
	head_sha: z.string(),
	run_number: z.number(),
	event: z.string(),
	status: z.string().nullable(),
	conclusion: z.string().nullable(),
	workflow_id: z.number(),
	url: z.string(),
	html_url: z.string(),
	pull_requests: z.array(z.unknown()),
	created_at: z.string(),
	updated_at: z.string(),
	run_attempt: z.number().optional(),
	run_started_at: z.string().optional(),
	triggering_actor: UserSchema.nullable().optional(),
	actor: UserSchema.nullable().optional(),
});
export type WorkflowRun = z.infer<typeof WorkflowRunSchema>;

export const WorkflowJobSchema = z.object({
	id: z.number(),
	run_id: z.number(),
	run_url: z.string(),
	node_id: z.string(),
	head_sha: z.string(),
	url: z.string(),
	html_url: z.string(),
	status: z.enum(['queued', 'in_progress', 'completed', 'waiting']),
	conclusion: z.string().nullable(),
	started_at: z.string(),
	completed_at: z.string().nullable(),
	name: z.string(),
	steps: z.array(
		z.object({
			name: z.string(),
			status: z.string(),
			conclusion: z.string().nullable(),
			number: z.number(),
			started_at: z.string().nullable(),
			completed_at: z.string().nullable(),
		}),
	),
	runner_id: z.number().nullable(),
	runner_name: z.string().nullable(),
	runner_group_id: z.number().nullable(),
	runner_group_name: z.string().nullable(),
	workflow_name: z.string().nullable(),
	head_branch: z.string().nullable(),
});
export type WorkflowJob = z.infer<typeof WorkflowJobSchema>;

export const CheckRunSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	head_sha: z.string(),
	external_id: z.string().nullable(),
	url: z.string(),
	html_url: z.string().nullable(),
	details_url: z.string().nullable(),
	status: z.enum(['queued', 'in_progress', 'completed']),
	conclusion: z.string().nullable(),
	started_at: z.string().nullable(),
	completed_at: z.string().nullable(),
	name: z.string(),
	check_suite: z
		.object({
			id: z.number(),
			node_id: z.string(),
			head_branch: z.string().nullable(),
			head_sha: z.string(),
			status: z.string().nullable(),
			conclusion: z.string().nullable(),
			url: z.string(),
		})
		.nullable()
		.optional(),
	app: z.unknown().nullable().optional(),
	pull_requests: z.array(z.unknown()),
});
export type CheckRun = z.infer<typeof CheckRunSchema>;

export const CheckSuiteSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	head_branch: z.string().nullable(),
	head_sha: z.string(),
	status: z.string().nullable(),
	conclusion: z.string().nullable(),
	url: z.string(),
	before: z.string().nullable(),
	after: z.string().nullable(),
	pull_requests: z.array(z.unknown()),
	created_at: z.string(),
	updated_at: z.string(),
	app: z.unknown().nullable().optional(),
});
export type CheckSuite = z.infer<typeof CheckSuiteSchema>;

export const DiscussionSchema = z.object({
	repository_url: z.string(),
	category: z.object({
		id: z.number(),
		node_id: z.string(),
		repository_id: z.number(),
		emoji: z.string(),
		name: z.string(),
		description: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		slug: z.string(),
		is_answerable: z.boolean(),
	}),
	answer_html_url: z.string().nullable().optional(),
	answer_chosen_at: z.string().nullable().optional(),
	answer_chosen_by: UserSchema.nullable().optional(),
	html_url: z.string(),
	id: z.number(),
	node_id: z.string(),
	number: z.number(),
	title: z.string(),
	user: UserSchema,
	state: z.string(),
	locked: z.boolean(),
	comments: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
	author_association: z.string(),
	active_lock_reason: z.string().nullable(),
	body: z.string().nullable(),
});
export type Discussion = z.infer<typeof DiscussionSchema>;

export const DiscussionCommentSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	html_url: z.string(),
	parent_id: z.number().nullable(),
	child_comment_count: z.number(),
	repository_url: z.string(),
	discussion_id: z.number(),
	author_association: z.string(),
	user: UserSchema,
	created_at: z.string(),
	updated_at: z.string(),
	body: z.string(),
});
export type DiscussionComment = z.infer<typeof DiscussionCommentSchema>;

export const DependabotAlertSchema = z.object({
	number: z.number(),
	state: z.string(),
	dependency: z.object({
		package: z.object({
			ecosystem: z.string(),
			name: z.string(),
		}),
		manifest_path: z.string(),
		scope: z.string().nullable(),
	}),
	security_advisory: z.object({
		ghsa_id: z.string(),
		cve_id: z.string().nullable(),
		summary: z.string(),
		description: z.string(),
		severity: z.string(),
		identifiers: z.array(z.object({ value: z.string(), type: z.string() })),
		references: z.array(z.object({ url: z.string() })),
		published_at: z.string(),
		updated_at: z.string(),
		withdrawn_at: z.string().nullable(),
	}),
	security_vulnerability: z.object({
		package: z.object({
			ecosystem: z.string(),
			name: z.string(),
		}),
		severity: z.string(),
		vulnerable_version_range: z.string(),
		first_patched_version: z.object({ identifier: z.string() }).nullable(),
	}),
	url: z.string(),
	html_url: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	dismissed_at: z.string().nullable(),
	dismissed_by: UserSchema.nullable(),
	dismissed_reason: z.string().nullable(),
	dismissed_comment: z.string().nullable(),
	fixed_at: z.string().nullable(),
	auto_dismissed_at: z.string().nullable().optional(),
});
export type DependabotAlert = z.infer<typeof DependabotAlertSchema>;

export const LabelSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	url: z.string(),
	name: z.string(),
	color: z.string(),
	default: z.boolean(),
	description: z.string().nullable(),
});
export type Label = z.infer<typeof LabelSchema>;

export const TeamSchema = z.object({
	id: z.number(),
	node_id: z.string(),
	url: z.string(),
	html_url: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string().nullable(),
	privacy: z.string(),
	permission: z.string(),
	members_url: z.string(),
	repositories_url: z.string(),
	parent: z.unknown().nullable(),
});
export type Team = z.infer<typeof TeamSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Pull Request event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PullRequestOpenedEventSchema = z.object({
	action: z.literal('opened'),
	number: z.number(),
	pull_request: PullRequestSchema.extend({
		state: z.literal('open'),
		closed_at: z.null(),
		merged_at: z.null(),
		active_lock_reason: z.null(),
		merged_by: z.null(),
	}),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestOpenedEvent = z.infer<
	typeof PullRequestOpenedEventSchema
>;

export const PullRequestClosedEventSchema = z.object({
	action: z.literal('closed'),
	number: z.number(),
	pull_request: PullRequestSchema.extend({
		state: z.literal('closed'),
		closed_at: z.string(),
		merged: z.boolean(),
	}),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestClosedEvent = z.infer<
	typeof PullRequestClosedEventSchema
>;

export const PullRequestSynchronizeEventSchema = z.object({
	action: z.literal('synchronize'),
	number: z.number(),
	before: z.string(),
	after: z.string(),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestSynchronizeEvent = z.infer<
	typeof PullRequestSynchronizeEventSchema
>;

export const PullRequestReopenedEventSchema = z.object({
	action: z.literal('reopened'),
	number: z.number(),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReopenedEvent = z.infer<
	typeof PullRequestReopenedEventSchema
>;

export const PullRequestLabeledEventSchema = z.object({
	action: z.literal('labeled'),
	number: z.number(),
	pull_request: PullRequestSchema,
	label: IssueLabelSchema.optional(),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestLabeledEvent = z.infer<
	typeof PullRequestLabeledEventSchema
>;

export const PullRequestUnlabeledEventSchema = z.object({
	action: z.literal('unlabeled'),
	number: z.number(),
	pull_request: PullRequestSchema,
	label: IssueLabelSchema.optional(),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestUnlabeledEvent = z.infer<
	typeof PullRequestUnlabeledEventSchema
>;

export const PullRequestReviewRequestedEventSchema = z.object({
	action: z.literal('review_requested'),
	number: z.number(),
	pull_request: PullRequestSchema,
	requested_reviewer: UserSchema.optional(),
	requested_team: TeamSchema.optional(),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewRequestedEvent = z.infer<
	typeof PullRequestReviewRequestedEventSchema
>;

export const PullRequestReadyForReviewEventSchema = z.object({
	action: z.literal('ready_for_review'),
	number: z.number(),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReadyForReviewEvent = z.infer<
	typeof PullRequestReadyForReviewEventSchema
>;

export const PullRequestConvertedToDraftEventSchema = z.object({
	action: z.literal('converted_to_draft'),
	number: z.number(),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestConvertedToDraftEvent = z.infer<
	typeof PullRequestConvertedToDraftEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Pull Request Review event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PullRequestReviewSubmittedEventSchema = z.object({
	action: z.literal('submitted'),
	review: PRReviewSchema,
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewSubmittedEvent = z.infer<
	typeof PullRequestReviewSubmittedEventSchema
>;

export const PullRequestReviewDismissedEventSchema = z.object({
	action: z.literal('dismissed'),
	review: PRReviewSchema,
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewDismissedEvent = z.infer<
	typeof PullRequestReviewDismissedEventSchema
>;

export const PullRequestReviewEditedEventSchema = z.object({
	action: z.literal('edited'),
	review: PRReviewSchema,
	pull_request: PullRequestSchema,
	changes: z
		.object({ body: z.object({ from: z.string() }).optional() })
		.optional(),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewEditedEvent = z.infer<
	typeof PullRequestReviewEditedEventSchema
>;

export const PullRequestReviewCommentCreatedEventSchema = z.object({
	action: z.literal('created'),
	comment: PRReviewCommentSchema,
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewCommentCreatedEvent = z.infer<
	typeof PullRequestReviewCommentCreatedEventSchema
>;

export const PullRequestReviewCommentEditedEventSchema = z.object({
	action: z.literal('edited'),
	comment: PRReviewCommentSchema,
	changes: z
		.object({ body: z.object({ from: z.string() }).optional() })
		.optional(),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewCommentEditedEvent = z.infer<
	typeof PullRequestReviewCommentEditedEventSchema
>;

export const PullRequestReviewCommentDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	comment: PRReviewCommentSchema,
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewCommentDeletedEvent = z.infer<
	typeof PullRequestReviewCommentDeletedEventSchema
>;

export const PullRequestReviewThreadResolvedEventSchema = z.object({
	action: z.literal('resolved'),
	thread: z.object({
		node_id: z.string(),
		comments: z.array(PRReviewCommentSchema),
	}),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewThreadResolvedEvent = z.infer<
	typeof PullRequestReviewThreadResolvedEventSchema
>;

export const PullRequestReviewThreadUnresolvedEventSchema = z.object({
	action: z.literal('unresolved'),
	thread: z.object({
		node_id: z.string(),
		comments: z.array(PRReviewCommentSchema),
	}),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestReviewThreadUnresolvedEvent = z.infer<
	typeof PullRequestReviewThreadUnresolvedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Push event schema
// ─────────────────────────────────────────────────────────────────────────────

export const PushEventSchema = z.object({
	ref: z.string(),
	before: z.string(),
	after: z.string(),
	created: z.boolean(),
	deleted: z.boolean(),
	forced: z.boolean(),
	base_ref: z.string().nullable(),
	compare: z.string(),
	commits: z.array(CommitSchema),
	head_commit: CommitSchema.nullable(),
	repository: RepositorySchema,
	pusher: CommitterSchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type PushEvent = z.infer<typeof PushEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Branch / tag event schemas (create & delete)
// ─────────────────────────────────────────────────────────────────────────────

export const BranchCreatedEventSchema = z.object({
	ref: z.string(),
	ref_type: z.literal('branch'),
	master_branch: z.string(),
	description: z.string().nullable(),
	pusher_type: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type BranchCreatedEvent = z.infer<typeof BranchCreatedEventSchema>;

export const BranchDeletedEventSchema = z.object({
	ref: z.string(),
	ref_type: z.literal('branch'),
	pusher_type: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type BranchDeletedEvent = z.infer<typeof BranchDeletedEventSchema>;

export const TagCreatedEventSchema = z.object({
	ref: z.string(),
	ref_type: z.literal('tag'),
	master_branch: z.string(),
	description: z.string().nullable(),
	pusher_type: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type TagCreatedEvent = z.infer<typeof TagCreatedEventSchema>;

export const TagDeletedEventSchema = z.object({
	ref: z.string(),
	ref_type: z.literal('tag'),
	pusher_type: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type TagDeletedEvent = z.infer<typeof TagDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Star event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const StarCreatedEventSchema = z.object({
	action: z.literal('created'),
	starred_at: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	organization: OrganizationSchema.optional(),
	installation: InstallationSchema.optional(),
});
export type StarCreatedEvent = z.infer<typeof StarCreatedEventSchema>;

export const StarDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	starred_at: z.null(),
	repository: RepositorySchema,
	sender: UserSchema,
	organization: OrganizationSchema.optional(),
	installation: InstallationSchema.optional(),
});
export type StarDeletedEvent = z.infer<typeof StarDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Issue event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const IssueOpenedEventSchema = z.object({
	action: z.literal('opened'),
	issue: IssueSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueOpenedEvent = z.infer<typeof IssueOpenedEventSchema>;

export const IssueClosedEventSchema = z.object({
	action: z.literal('closed'),
	issue: IssueSchema.extend({ state: z.literal('closed') }),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueClosedEvent = z.infer<typeof IssueClosedEventSchema>;

export const IssueReopenedEventSchema = z.object({
	action: z.literal('reopened'),
	issue: IssueSchema.extend({ state: z.literal('open') }),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueReopenedEvent = z.infer<typeof IssueReopenedEventSchema>;

export const IssueLabeledEventSchema = z.object({
	action: z.literal('labeled'),
	issue: IssueSchema,
	label: IssueLabelSchema.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueLabeledEvent = z.infer<typeof IssueLabeledEventSchema>;

export const IssueUnlabeledEventSchema = z.object({
	action: z.literal('unlabeled'),
	issue: IssueSchema,
	label: IssueLabelSchema.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueUnlabeledEvent = z.infer<typeof IssueUnlabeledEventSchema>;

export const IssueAssignedEventSchema = z.object({
	action: z.literal('assigned'),
	issue: IssueSchema,
	assignee: UserSchema.nullable().optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueAssignedEvent = z.infer<typeof IssueAssignedEventSchema>;

export const IssueUnassignedEventSchema = z.object({
	action: z.literal('unassigned'),
	issue: IssueSchema,
	assignee: UserSchema.nullable().optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueUnassignedEvent = z.infer<typeof IssueUnassignedEventSchema>;

export const IssueEditedEventSchema = z.object({
	action: z.literal('edited'),
	issue: IssueSchema,
	changes: z
		.object({
			title: z.object({ from: z.string() }).optional(),
			body: z.object({ from: z.string() }).optional(),
		})
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueEditedEvent = z.infer<typeof IssueEditedEventSchema>;

export const IssueDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	issue: IssueSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueDeletedEvent = z.infer<typeof IssueDeletedEventSchema>;

export const IssueTransferredEventSchema = z.object({
	action: z.literal('transferred'),
	issue: IssueSchema,
	changes: z
		.object({
			new_issue: IssueSchema.optional(),
			new_repository: RepositorySchema.optional(),
		})
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueTransferredEvent = z.infer<typeof IssueTransferredEventSchema>;

export const IssueLockedEventSchema = z.object({
	action: z.literal('locked'),
	issue: IssueSchema.extend({ locked: z.literal(true) }),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueLockedEvent = z.infer<typeof IssueLockedEventSchema>;

export const IssueUnlockedEventSchema = z.object({
	action: z.literal('unlocked'),
	issue: IssueSchema.extend({ locked: z.literal(false) }),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueUnlockedEvent = z.infer<typeof IssueUnlockedEventSchema>;

export const IssuePinnedEventSchema = z.object({
	action: z.literal('pinned'),
	issue: IssueSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssuePinnedEvent = z.infer<typeof IssuePinnedEventSchema>;

export const IssueUnpinnedEventSchema = z.object({
	action: z.literal('unpinned'),
	issue: IssueSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type IssueUnpinnedEvent = z.infer<typeof IssueUnpinnedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Comment event schemas (issue & pull request comments)
// ─────────────────────────────────────────────────────────────────────────────

export const CommentCreatedEventSchema = z.object({
	action: z.literal('created'),
	issue: IssueSchema,
	comment: CommentSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CommentCreatedEvent = z.infer<
	typeof CommentCreatedEventSchema
>;

export const CommentEditedEventSchema = z.object({
	action: z.literal('edited'),
	issue: IssueSchema,
	comment: CommentSchema,
	changes: z
		.object({ body: z.object({ from: z.string() }).optional() })
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CommentEditedEvent = z.infer<
	typeof CommentEditedEventSchema
>;

export const CommentDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	issue: IssueSchema,
	comment: CommentSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CommentDeletedEvent = z.infer<
	typeof CommentDeletedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Release event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ReleasePublishedEventSchema = z.object({
	action: z.literal('published'),
	release: ReleaseSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleasePublishedEvent = z.infer<typeof ReleasePublishedEventSchema>;

export const ReleaseCreatedEventSchema = z.object({
	action: z.literal('created'),
	release: ReleaseSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleaseCreatedEvent = z.infer<typeof ReleaseCreatedEventSchema>;

export const ReleaseEditedEventSchema = z.object({
	action: z.literal('edited'),
	release: ReleaseSchema,
	changes: z.record(z.unknown()).optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleaseEditedEvent = z.infer<typeof ReleaseEditedEventSchema>;

export const ReleaseDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	release: ReleaseSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleaseDeletedEvent = z.infer<typeof ReleaseDeletedEventSchema>;

export const ReleasePrereleaseEventSchema = z.object({
	action: z.literal('prereleased'),
	release: ReleaseSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleasePrereleaseEvent = z.infer<
	typeof ReleasePrereleaseEventSchema
>;

export const ReleaseReleasedEventSchema = z.object({
	action: z.literal('released'),
	release: ReleaseSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleaseReleasedEvent = z.infer<typeof ReleaseReleasedEventSchema>;

export const ReleaseUnpublishedEventSchema = z.object({
	action: z.literal('unpublished'),
	release: ReleaseSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ReleaseUnpublishedEvent = z.infer<
	typeof ReleaseUnpublishedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Deployment event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const DeploymentCreatedEventSchema = z.object({
	action: z.literal('created'),
	deployment: DeploymentSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DeploymentCreatedEvent = z.infer<
	typeof DeploymentCreatedEventSchema
>;

export const DeploymentStatusCreatedEventSchema = z.object({
	action: z.literal('created'),
	deployment: DeploymentSchema,
	deployment_status: DeploymentStatusSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DeploymentStatusCreatedEvent = z.infer<
	typeof DeploymentStatusCreatedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Workflow event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const WorkflowRunCompletedEventSchema = z.object({
	action: z.literal('completed'),
	workflow_run: WorkflowRunSchema,
	workflow: z.unknown().nullable(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowRunCompletedEvent = z.infer<
	typeof WorkflowRunCompletedEventSchema
>;

export const WorkflowRunInProgressEventSchema = z.object({
	action: z.literal('in_progress'),
	workflow_run: WorkflowRunSchema,
	workflow: z.unknown().nullable(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowRunInProgressEvent = z.infer<
	typeof WorkflowRunInProgressEventSchema
>;

export const WorkflowRunRequestedEventSchema = z.object({
	action: z.literal('requested'),
	workflow_run: WorkflowRunSchema,
	workflow: z.unknown().nullable(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowRunRequestedEvent = z.infer<
	typeof WorkflowRunRequestedEventSchema
>;

export const WorkflowJobCompletedEventSchema = z.object({
	action: z.literal('completed'),
	workflow_job: WorkflowJobSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowJobCompletedEvent = z.infer<
	typeof WorkflowJobCompletedEventSchema
>;

export const WorkflowJobQueuedEventSchema = z.object({
	action: z.literal('queued'),
	workflow_job: WorkflowJobSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowJobQueuedEvent = z.infer<
	typeof WorkflowJobQueuedEventSchema
>;

export const WorkflowJobInProgressEventSchema = z.object({
	action: z.literal('in_progress'),
	workflow_job: WorkflowJobSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowJobInProgressEvent = z.infer<
	typeof WorkflowJobInProgressEventSchema
>;

export const WorkflowJobWaitingEventSchema = z.object({
	action: z.literal('waiting'),
	workflow_job: WorkflowJobSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowJobWaitingEvent = z.infer<
	typeof WorkflowJobWaitingEventSchema
>;

export const WorkflowDispatchEventSchema = z.object({
	inputs: z.record(z.unknown()).nullable(),
	ref: z.string(),
	workflow: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WorkflowDispatchEvent = z.infer<typeof WorkflowDispatchEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Repository event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const RepositoryCreatedEventSchema = z.object({
	action: z.literal('created'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryCreatedEvent = z.infer<
	typeof RepositoryCreatedEventSchema
>;

export const RepositoryDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryDeletedEvent = z.infer<
	typeof RepositoryDeletedEventSchema
>;

export const RepositoryArchivedEventSchema = z.object({
	action: z.literal('archived'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryArchivedEvent = z.infer<
	typeof RepositoryArchivedEventSchema
>;

export const RepositoryUnarchivedEventSchema = z.object({
	action: z.literal('unarchived'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryUnarchivedEvent = z.infer<
	typeof RepositoryUnarchivedEventSchema
>;

export const RepositoryRenamedEventSchema = z.object({
	action: z.literal('renamed'),
	changes: z
		.object({
			repository: z.object({ name: z.object({ from: z.string() }) }).optional(),
		})
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryRenamedEvent = z.infer<
	typeof RepositoryRenamedEventSchema
>;

export const RepositoryPublicizedEventSchema = z.object({
	action: z.literal('publicized'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryPublicizedEvent = z.infer<
	typeof RepositoryPublicizedEventSchema
>;

export const RepositoryPrivatizedEventSchema = z.object({
	action: z.literal('privatized'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryPrivatizedEvent = z.infer<
	typeof RepositoryPrivatizedEventSchema
>;

export const RepositoryTransferredEventSchema = z.object({
	action: z.literal('transferred'),
	changes: z
		.object({
			owner: z
				.object({
					from: z.object({
						user: UserSchema.optional(),
						organization: OrganizationSchema.optional(),
					}),
				})
				.optional(),
		})
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type RepositoryTransferredEvent = z.infer<
	typeof RepositoryTransferredEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Check Run event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CheckRunCompletedEventSchema = z.object({
	action: z.literal('completed'),
	check_run: CheckRunSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CheckRunCompletedEvent = z.infer<
	typeof CheckRunCompletedEventSchema
>;

export const CheckRunCreatedEventSchema = z.object({
	action: z.literal('created'),
	check_run: CheckRunSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CheckRunCreatedEvent = z.infer<typeof CheckRunCreatedEventSchema>;

export const CheckRunRerequestedEventSchema = z.object({
	action: z.literal('rerequested'),
	check_run: CheckRunSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CheckRunRerequestedEvent = z.infer<
	typeof CheckRunRerequestedEventSchema
>;

export const CheckSuiteCompletedEventSchema = z.object({
	action: z.literal('completed'),
	check_suite: CheckSuiteSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CheckSuiteCompletedEvent = z.infer<
	typeof CheckSuiteCompletedEventSchema
>;

export const CheckSuiteRequestedEventSchema = z.object({
	action: z.literal('requested'),
	check_suite: CheckSuiteSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type CheckSuiteRequestedEvent = z.infer<
	typeof CheckSuiteRequestedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Discussion event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const DiscussionCreatedEventSchema = z.object({
	action: z.literal('created'),
	discussion: DiscussionSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionCreatedEvent = z.infer<
	typeof DiscussionCreatedEventSchema
>;

export const DiscussionEditedEventSchema = z.object({
	action: z.literal('edited'),
	discussion: DiscussionSchema,
	changes: z.record(z.unknown()).optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionEditedEvent = z.infer<typeof DiscussionEditedEventSchema>;

export const DiscussionClosedEventSchema = z.object({
	action: z.literal('closed'),
	discussion: DiscussionSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionClosedEvent = z.infer<typeof DiscussionClosedEventSchema>;

export const DiscussionReopenedEventSchema = z.object({
	action: z.literal('reopened'),
	discussion: DiscussionSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionReopenedEvent = z.infer<
	typeof DiscussionReopenedEventSchema
>;

export const DiscussionAnsweredEventSchema = z.object({
	action: z.literal('answered'),
	discussion: DiscussionSchema,
	answer: DiscussionCommentSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionAnsweredEvent = z.infer<
	typeof DiscussionAnsweredEventSchema
>;

export const DiscussionDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	discussion: DiscussionSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionDeletedEvent = z.infer<
	typeof DiscussionDeletedEventSchema
>;

export const DiscussionCommentCreatedEventSchema = z.object({
	action: z.literal('created'),
	discussion: DiscussionSchema,
	comment: DiscussionCommentSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionCommentCreatedEvent = z.infer<
	typeof DiscussionCommentCreatedEventSchema
>;

export const DiscussionCommentEditedEventSchema = z.object({
	action: z.literal('edited'),
	discussion: DiscussionSchema,
	comment: DiscussionCommentSchema,
	changes: z
		.object({ body: z.object({ from: z.string() }).optional() })
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionCommentEditedEvent = z.infer<
	typeof DiscussionCommentEditedEventSchema
>;

export const DiscussionCommentDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	discussion: DiscussionSchema,
	comment: DiscussionCommentSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DiscussionCommentDeletedEvent = z.infer<
	typeof DiscussionCommentDeletedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Security / Dependabot event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const DependabotAlertCreatedEventSchema = z.object({
	action: z.literal('created'),
	alert: DependabotAlertSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DependabotAlertCreatedEvent = z.infer<
	typeof DependabotAlertCreatedEventSchema
>;

export const DependabotAlertDismissedEventSchema = z.object({
	action: z.literal('dismissed'),
	alert: DependabotAlertSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DependabotAlertDismissedEvent = z.infer<
	typeof DependabotAlertDismissedEventSchema
>;

export const DependabotAlertFixedEventSchema = z.object({
	action: z.literal('fixed'),
	alert: DependabotAlertSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DependabotAlertFixedEvent = z.infer<
	typeof DependabotAlertFixedEventSchema
>;

export const DependabotAlertReopenedEventSchema = z.object({
	action: z.literal('reopened'),
	alert: DependabotAlertSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DependabotAlertReopenedEvent = z.infer<
	typeof DependabotAlertReopenedEventSchema
>;

export const DependabotAlertAutoDismissedEventSchema = z.object({
	action: z.literal('auto_dismissed'),
	alert: DependabotAlertSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DependabotAlertAutoDismissedEvent = z.infer<
	typeof DependabotAlertAutoDismissedEventSchema
>;

export const DependabotAlertAutoReopenedEventSchema = z.object({
	action: z.literal('auto_reopened'),
	alert: DependabotAlertSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type DependabotAlertAutoReopenedEvent = z.infer<
	typeof DependabotAlertAutoReopenedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Member / membership event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const MemberAddedEventSchema = z.object({
	action: z.literal('added'),
	member: UserSchema.nullable(),
	changes: z.record(z.unknown()).optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MemberAddedEvent = z.infer<typeof MemberAddedEventSchema>;

export const MemberRemovedEventSchema = z.object({
	action: z.literal('removed'),
	member: UserSchema.nullable(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MemberRemovedEvent = z.infer<typeof MemberRemovedEventSchema>;

export const MembershipAddedEventSchema = z.object({
	action: z.literal('added'),
	scope: z.string(),
	member: UserSchema.nullable(),
	team: TeamSchema,
	organization: OrganizationSchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
});
export type MembershipAddedEvent = z.infer<typeof MembershipAddedEventSchema>;

export const MembershipRemovedEventSchema = z.object({
	action: z.literal('removed'),
	scope: z.string(),
	member: UserSchema.nullable(),
	team: TeamSchema,
	organization: OrganizationSchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
});
export type MembershipRemovedEvent = z.infer<
	typeof MembershipRemovedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Milestone event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const MilestoneCreatedEventSchema = z.object({
	action: z.literal('created'),
	milestone: MilestoneSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MilestoneCreatedEvent = z.infer<typeof MilestoneCreatedEventSchema>;

export const MilestoneClosedEventSchema = z.object({
	action: z.literal('closed'),
	milestone: MilestoneSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MilestoneClosedEvent = z.infer<typeof MilestoneClosedEventSchema>;

export const MilestoneOpenedEventSchema = z.object({
	action: z.literal('opened'),
	milestone: MilestoneSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MilestoneOpenedEvent = z.infer<typeof MilestoneOpenedEventSchema>;

export const MilestoneEditedEventSchema = z.object({
	action: z.literal('edited'),
	milestone: MilestoneSchema,
	changes: z.record(z.unknown()).optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MilestoneEditedEvent = z.infer<typeof MilestoneEditedEventSchema>;

export const MilestoneDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	milestone: MilestoneSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type MilestoneDeletedEvent = z.infer<typeof MilestoneDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Label event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const LabelCreatedEventSchema = z.object({
	action: z.literal('created'),
	label: LabelSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type LabelCreatedEvent = z.infer<typeof LabelCreatedEventSchema>;

export const LabelEditedEventSchema = z.object({
	action: z.literal('edited'),
	label: LabelSchema,
	changes: z
		.object({
			name: z.object({ from: z.string() }).optional(),
			color: z.object({ from: z.string() }).optional(),
			description: z.object({ from: z.string() }).optional(),
		})
		.optional(),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type LabelEditedEvent = z.infer<typeof LabelEditedEventSchema>;

export const LabelDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	label: LabelSchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type LabelDeletedEvent = z.infer<typeof LabelDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Fork event schema
// ─────────────────────────────────────────────────────────────────────────────

export const ForkEventSchema = z.object({
	forkee: RepositorySchema,
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type ForkEvent = z.infer<typeof ForkEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Watch event schema
// ─────────────────────────────────────────────────────────────────────────────

export const WatchStartedEventSchema = z.object({
	action: z.literal('started'),
	repository: RepositorySchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type WatchStartedEvent = z.infer<typeof WatchStartedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Union and map types
// ─────────────────────────────────────────────────────────────────────────────

export type GithubWebhookEvent =
	| PullRequestOpenedEvent
	| PullRequestClosedEvent
	| PullRequestSynchronizeEvent
	| PullRequestReopenedEvent
	| PullRequestLabeledEvent
	| PullRequestUnlabeledEvent
	| PullRequestReviewRequestedEvent
	| PullRequestReadyForReviewEvent
	| PullRequestConvertedToDraftEvent
	| PullRequestReviewSubmittedEvent
	| PullRequestReviewDismissedEvent
	| PullRequestReviewEditedEvent
	| PullRequestReviewCommentCreatedEvent
	| PullRequestReviewCommentEditedEvent
	| PullRequestReviewCommentDeletedEvent
	| PullRequestReviewThreadResolvedEvent
	| PullRequestReviewThreadUnresolvedEvent
	| PushEventType
	| BranchCreatedEvent
	| BranchDeletedEvent
	| TagCreatedEvent
	| TagDeletedEvent
	| StarCreatedEvent
	| StarDeletedEvent
	| IssueOpenedEvent
	| IssueClosedEvent
	| IssueReopenedEvent
	| IssueLabeledEvent
	| IssueUnlabeledEvent
	| IssueAssignedEvent
	| IssueUnassignedEvent
	| IssueEditedEvent
	| IssueDeletedEvent
	| IssueTransferredEvent
	| IssueLockedEvent
	| IssueUnlockedEvent
	| IssuePinnedEvent
	| IssueUnpinnedEvent
	| CommentCreatedEvent
	| CommentEditedEvent
	| CommentDeletedEvent
	| ReleasePublishedEvent
	| ReleaseCreatedEvent
	| ReleaseEditedEvent
	| ReleaseDeletedEvent
	| ReleasePrereleaseEvent
	| ReleaseReleasedEvent
	| ReleaseUnpublishedEvent
	| DeploymentCreatedEvent
	| DeploymentStatusCreatedEvent
	| WorkflowRunCompletedEvent
	| WorkflowRunInProgressEvent
	| WorkflowRunRequestedEvent
	| WorkflowJobCompletedEvent
	| WorkflowJobQueuedEvent
	| WorkflowJobInProgressEvent
	| WorkflowJobWaitingEvent
	| WorkflowDispatchEvent
	| RepositoryCreatedEvent
	| RepositoryDeletedEvent
	| RepositoryArchivedEvent
	| RepositoryUnarchivedEvent
	| RepositoryRenamedEvent
	| RepositoryPublicizedEvent
	| RepositoryPrivatizedEvent
	| RepositoryTransferredEvent
	| CheckRunCompletedEvent
	| CheckRunCreatedEvent
	| CheckRunRerequestedEvent
	| CheckSuiteCompletedEvent
	| CheckSuiteRequestedEvent
	| DiscussionCreatedEvent
	| DiscussionEditedEvent
	| DiscussionClosedEvent
	| DiscussionReopenedEvent
	| DiscussionAnsweredEvent
	| DiscussionDeletedEvent
	| DiscussionCommentCreatedEvent
	| DiscussionCommentEditedEvent
	| DiscussionCommentDeletedEvent
	| DependabotAlertCreatedEvent
	| DependabotAlertDismissedEvent
	| DependabotAlertFixedEvent
	| DependabotAlertReopenedEvent
	| DependabotAlertAutoDismissedEvent
	| DependabotAlertAutoReopenedEvent
	| MemberAddedEvent
	| MemberRemovedEvent
	| MembershipAddedEvent
	| MembershipRemovedEvent
	| MilestoneCreatedEvent
	| MilestoneClosedEvent
	| MilestoneOpenedEvent
	| MilestoneEditedEvent
	| MilestoneDeletedEvent
	| LabelCreatedEvent
	| LabelEditedEvent
	| LabelDeletedEvent
	| ForkEvent
	| WatchStartedEvent;

export const GithubWebhookEventSchema: z.ZodType<GithubWebhookEvent> = z.union([
	PullRequestOpenedEventSchema,
	PullRequestClosedEventSchema,
	PullRequestSynchronizeEventSchema,
	PullRequestReopenedEventSchema,
	PullRequestLabeledEventSchema,
	PullRequestUnlabeledEventSchema,
	PullRequestReviewRequestedEventSchema,
	PullRequestReadyForReviewEventSchema,
	PullRequestConvertedToDraftEventSchema,
	PullRequestReviewSubmittedEventSchema,
	PullRequestReviewDismissedEventSchema,
	PullRequestReviewEditedEventSchema,
	PullRequestReviewCommentCreatedEventSchema,
	PullRequestReviewCommentEditedEventSchema,
	PullRequestReviewCommentDeletedEventSchema,
	PullRequestReviewThreadResolvedEventSchema,
	PullRequestReviewThreadUnresolvedEventSchema,
	PushEventSchema,
	BranchCreatedEventSchema,
	BranchDeletedEventSchema,
	TagCreatedEventSchema,
	TagDeletedEventSchema,
	StarCreatedEventSchema,
	StarDeletedEventSchema,
	IssueOpenedEventSchema,
	IssueClosedEventSchema,
	IssueReopenedEventSchema,
	IssueLabeledEventSchema,
	IssueUnlabeledEventSchema,
	IssueAssignedEventSchema,
	IssueUnassignedEventSchema,
	IssueEditedEventSchema,
	IssueDeletedEventSchema,
	IssueTransferredEventSchema,
	IssueLockedEventSchema,
	IssueUnlockedEventSchema,
	IssuePinnedEventSchema,
	IssueUnpinnedEventSchema,
	CommentCreatedEventSchema,
	CommentEditedEventSchema,
	CommentDeletedEventSchema,
	ReleasePublishedEventSchema,
	ReleaseCreatedEventSchema,
	ReleaseEditedEventSchema,
	ReleaseDeletedEventSchema,
	ReleasePrereleaseEventSchema,
	ReleaseReleasedEventSchema,
	ReleaseUnpublishedEventSchema,
	DeploymentCreatedEventSchema,
	DeploymentStatusCreatedEventSchema,
	WorkflowRunCompletedEventSchema,
	WorkflowRunInProgressEventSchema,
	WorkflowRunRequestedEventSchema,
	WorkflowJobCompletedEventSchema,
	WorkflowJobQueuedEventSchema,
	WorkflowJobInProgressEventSchema,
	WorkflowJobWaitingEventSchema,
	WorkflowDispatchEventSchema,
	RepositoryCreatedEventSchema,
	RepositoryDeletedEventSchema,
	RepositoryArchivedEventSchema,
	RepositoryUnarchivedEventSchema,
	RepositoryRenamedEventSchema,
	RepositoryPublicizedEventSchema,
	RepositoryPrivatizedEventSchema,
	RepositoryTransferredEventSchema,
	CheckRunCompletedEventSchema,
	CheckRunCreatedEventSchema,
	CheckRunRerequestedEventSchema,
	CheckSuiteCompletedEventSchema,
	CheckSuiteRequestedEventSchema,
	DiscussionCreatedEventSchema,
	DiscussionEditedEventSchema,
	DiscussionClosedEventSchema,
	DiscussionReopenedEventSchema,
	DiscussionAnsweredEventSchema,
	DiscussionDeletedEventSchema,
	DiscussionCommentCreatedEventSchema,
	DiscussionCommentEditedEventSchema,
	DiscussionCommentDeletedEventSchema,
	DependabotAlertCreatedEventSchema,
	DependabotAlertDismissedEventSchema,
	DependabotAlertFixedEventSchema,
	DependabotAlertReopenedEventSchema,
	DependabotAlertAutoDismissedEventSchema,
	DependabotAlertAutoReopenedEventSchema,
	MemberAddedEventSchema,
	MemberRemovedEventSchema,
	MembershipAddedEventSchema,
	MembershipRemovedEventSchema,
	MilestoneCreatedEventSchema,
	MilestoneClosedEventSchema,
	MilestoneOpenedEventSchema,
	MilestoneEditedEventSchema,
	MilestoneDeletedEventSchema,
	LabelCreatedEventSchema,
	LabelEditedEventSchema,
	LabelDeletedEventSchema,
	ForkEventSchema,
	WatchStartedEventSchema,
]);

export type GithubWebhookPayload<
	TEvent extends GithubWebhookEvent = GithubWebhookEvent,
> = TEvent;

export type GithubWebhookOutputs = {
	// Pull Requests
	pullRequestOpened: PullRequestOpenedEvent;
	pullRequestClosed: PullRequestClosedEvent;
	pullRequestSynchronize: PullRequestSynchronizeEvent;
	pullRequestReopened: PullRequestReopenedEvent;
	pullRequestLabeled: PullRequestLabeledEvent;
	pullRequestUnlabeled: PullRequestUnlabeledEvent;
	pullRequestReviewRequested: PullRequestReviewRequestedEvent;
	pullRequestReadyForReview: PullRequestReadyForReviewEvent;
	pullRequestConvertedToDraft: PullRequestConvertedToDraftEvent;
	// Pull Request Reviews
	pullRequestReviewSubmitted: PullRequestReviewSubmittedEvent;
	pullRequestReviewDismissed: PullRequestReviewDismissedEvent;
	pullRequestReviewEdited: PullRequestReviewEditedEvent;
	// Pull Request Review Comments
	pullRequestReviewCommentCreated: PullRequestReviewCommentCreatedEvent;
	pullRequestReviewCommentEdited: PullRequestReviewCommentEditedEvent;
	pullRequestReviewCommentDeleted: PullRequestReviewCommentDeletedEvent;
	// Pull Request Review Threads
	pullRequestReviewThreadResolved: PullRequestReviewThreadResolvedEvent;
	pullRequestReviewThreadUnresolved: PullRequestReviewThreadUnresolvedEvent;
	// Push
	push: PushEventType;
	// Branches & Tags
	branchCreated: BranchCreatedEvent;
	branchDeleted: BranchDeletedEvent;
	tagCreated: TagCreatedEvent;
	tagDeleted: TagDeletedEvent;
	// Stars
	starCreated: StarCreatedEvent;
	starDeleted: StarDeletedEvent;
	// Issues
	issueOpened: IssueOpenedEvent;
	issueClosed: IssueClosedEvent;
	issueReopened: IssueReopenedEvent;
	issueLabeled: IssueLabeledEvent;
	issueUnlabeled: IssueUnlabeledEvent;
	issueAssigned: IssueAssignedEvent;
	issueUnassigned: IssueUnassignedEvent;
	issueEdited: IssueEditedEvent;
	issueDeleted: IssueDeletedEvent;
	issueTransferred: IssueTransferredEvent;
	issueLocked: IssueLockedEvent;
	issueUnlocked: IssueUnlockedEvent;
	issuePinned: IssuePinnedEvent;
	issueUnpinned: IssueUnpinnedEvent;
	// Comments (issue & pull request)
	commentCreated: CommentCreatedEvent;
	commentEdited: CommentEditedEvent;
	commentDeleted: CommentDeletedEvent;
	// Releases
	releasePublished: ReleasePublishedEvent;
	releaseCreated: ReleaseCreatedEvent;
	releaseEdited: ReleaseEditedEvent;
	releaseDeleted: ReleaseDeletedEvent;
	releasePrereleased: ReleasePrereleaseEvent;
	releaseReleased: ReleaseReleasedEvent;
	releaseUnpublished: ReleaseUnpublishedEvent;
	// Deployments
	deploymentCreated: DeploymentCreatedEvent;
	deploymentStatusCreated: DeploymentStatusCreatedEvent;
	// Workflows
	workflowRunCompleted: WorkflowRunCompletedEvent;
	workflowRunInProgress: WorkflowRunInProgressEvent;
	workflowRunRequested: WorkflowRunRequestedEvent;
	workflowJobCompleted: WorkflowJobCompletedEvent;
	workflowJobQueued: WorkflowJobQueuedEvent;
	workflowJobInProgress: WorkflowJobInProgressEvent;
	workflowJobWaiting: WorkflowJobWaitingEvent;
	workflowDispatched: WorkflowDispatchEvent;
	// Repositories
	repositoryCreated: RepositoryCreatedEvent;
	repositoryDeleted: RepositoryDeletedEvent;
	repositoryArchived: RepositoryArchivedEvent;
	repositoryUnarchived: RepositoryUnarchivedEvent;
	repositoryRenamed: RepositoryRenamedEvent;
	repositoryPublicized: RepositoryPublicizedEvent;
	repositoryPrivatized: RepositoryPrivatizedEvent;
	repositoryTransferred: RepositoryTransferredEvent;
	// Check Runs & Suites
	checkRunCompleted: CheckRunCompletedEvent;
	checkRunCreated: CheckRunCreatedEvent;
	checkRunRerequested: CheckRunRerequestedEvent;
	checkSuiteCompleted: CheckSuiteCompletedEvent;
	checkSuiteRequested: CheckSuiteRequestedEvent;
	// Discussions
	discussionCreated: DiscussionCreatedEvent;
	discussionEdited: DiscussionEditedEvent;
	discussionClosed: DiscussionClosedEvent;
	discussionReopened: DiscussionReopenedEvent;
	discussionAnswered: DiscussionAnsweredEvent;
	discussionDeleted: DiscussionDeletedEvent;
	discussionCommentCreated: DiscussionCommentCreatedEvent;
	discussionCommentEdited: DiscussionCommentEditedEvent;
	discussionCommentDeleted: DiscussionCommentDeletedEvent;
	// Security (Dependabot)
	dependabotAlertCreated: DependabotAlertCreatedEvent;
	dependabotAlertDismissed: DependabotAlertDismissedEvent;
	dependabotAlertFixed: DependabotAlertFixedEvent;
	dependabotAlertReopened: DependabotAlertReopenedEvent;
	dependabotAlertAutoDismissed: DependabotAlertAutoDismissedEvent;
	dependabotAlertAutoReopened: DependabotAlertAutoReopenedEvent;
	// Members
	memberAdded: MemberAddedEvent;
	memberRemoved: MemberRemovedEvent;
	membershipAdded: MembershipAddedEvent;
	membershipRemoved: MembershipRemovedEvent;
	// Milestones
	milestoneCreated: MilestoneCreatedEvent;
	milestoneClosed: MilestoneClosedEvent;
	milestoneOpened: MilestoneOpenedEvent;
	milestoneEdited: MilestoneEditedEvent;
	milestoneDeleted: MilestoneDeletedEvent;
	// Labels
	labelCreated: LabelCreatedEvent;
	labelEdited: LabelEditedEvent;
	labelDeleted: LabelDeletedEvent;
	// Fork & Watch
	forked: ForkEvent;
	watchStarted: WatchStartedEvent;
};

export type PushEventType = PushEvent;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifyGithubWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-hub-signature-256'])
		? headers['x-hub-signature-256'][0]
		: headers['x-hub-signature-256'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-hub-signature-256 header',
		};
	}

	const isValid = verifyHmacSignatureWithPrefix(
		rawBody,
		webhookSecret,
		signature,
		'sha256=',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createGithubEventMatch(
	eventType: string,
	action?: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers as Record<string, string | undefined>;
		const githubEvent = headers['x-github-event'];
		if (githubEvent !== eventType) {
			return false;
		}
		if (action) {
			const parsedBody = parseBody(request.body) as Record<string, unknown>;
			return (parsedBody.action as string) === action;
		}
		return true;
	};
}
