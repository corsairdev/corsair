import { z } from 'zod';

// ============================================================================
// Common Schemas (reusable across endpoints)
// ============================================================================

const GitlabUserRefSchema = z
	.object({
		id: z.number(),
		username: z.string(),
		name: z.string().nullable().optional(),
		state: z.string().optional(),
		avatar_url: z.string().nullable().optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

const GitlabNamespaceSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		path: z.string().optional(),
		kind: z.string().optional(),
		full_path: z.string().optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

const GitlabMilestoneRefSchema = z
	.object({
		id: z.number(),
		iid: z.number().optional(),
		title: z.string(),
		state: z.string().optional(),
		due_date: z.string().nullable().optional(),
	})
	.passthrough();

const GitlabLabelRefSchema = z.string();

const GitlabNoteSchema = z
	.object({
		id: z.number(),
		body: z.string(),
		author: GitlabUserRefSchema.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		system: z.boolean().optional(),
		noteable_id: z.number().optional(),
		noteable_type: z.string().optional(),
		noteable_iid: z.number().optional(),
		resolvable: z.boolean().optional(),
	})
	.passthrough();

const GitlabCommitRefSchema = z
	.object({
		id: z.string(),
		short_id: z.string().optional(),
		title: z.string().optional(),
		message: z.string().optional(),
		author_name: z.string().optional(),
		author_email: z.string().optional(),
		authored_date: z.string().optional(),
		committed_date: z.string().optional(),
		committer_name: z.string().optional(),
		committer_email: z.string().optional(),
		parent_ids: z.array(z.string()).optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

const GitlabDiffSchema = z
	.object({
		old_path: z.string(),
		new_path: z.string(),
		a_mode: z.string().optional(),
		b_mode: z.string().optional(),
		diff: z.string(),
		new_file: z.boolean().optional(),
		renamed_file: z.boolean().optional(),
		deleted_file: z.boolean().optional(),
	})
	.passthrough();

const GitlabJobSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		status: z.string().optional(),
		stage: z.string().optional(),
		ref: z.string().optional(),
		created_at: z.string().optional(),
		started_at: z.string().nullable().optional(),
		finished_at: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		web_url: z.string().optional(),
		pipeline: z
			.object({ id: z.number(), status: z.string().optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const GitlabTreeItemSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		path: z.string(),
		mode: z.string().optional(),
	})
	.passthrough();

const GitlabFileSchema = z
	.object({
		file_name: z.string(),
		file_path: z.string(),
		size: z.number().optional(),
		encoding: z.string().optional(),
		content: z.string().optional(),
		content_sha256: z.string().optional(),
		ref: z.string().optional(),
		blob_id: z.string().optional(),
		commit_id: z.string().optional(),
		last_commit_id: z.string().optional(),
	})
	.passthrough();

const GitlabCompareSchema = z
	.object({
		commit: GitlabCommitRefSchema.optional(),
		commits: z.array(GitlabCommitRefSchema).optional(),
		diffs: z.array(GitlabDiffSchema).optional(),
		compare_timeout: z.boolean().optional(),
		compare_same_ref: z.boolean().optional(),
	})
	.passthrough();

const PaginationQuerySchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});

// ============================================================================
// Users
// ============================================================================

const UsersGetCurrentUserInputSchema = z.object({});
const UsersGetCurrentUserResponseSchema = z
	.object({
		id: z.number(),
		username: z.string(),
		name: z.string().nullable().optional(),
		state: z.string().optional(),
		avatar_url: z.string().nullable().optional(),
		web_url: z.string().optional(),
		email: z.string().nullable().optional(),
		bio: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		created_at: z.string().optional(),
		is_admin: z.boolean().optional(),
		bot: z.boolean().optional(),
		two_factor_enabled: z.boolean().optional(),
	})
	.passthrough();

const UsersGetUserInputSchema = z.object({ user_id: z.number() });
const UsersGetUserResponseSchema = GitlabUserRefSchema;

const UsersListInputSchema = PaginationQuerySchema.extend({
	search: z.string().optional(),
	username: z.string().optional(),
	active: z.boolean().optional(),
	blocked: z.boolean().optional(),
});
const UsersListResponseSchema = z.array(GitlabUserRefSchema);

// ============================================================================
// Projects
// ============================================================================

const ProjectSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		path: z.string().optional(),
		path_with_namespace: z.string().optional(),
		description: z.string().nullable().optional(),
		default_branch: z.string().nullable().optional(),
		visibility: z.string().optional(),
		ssh_url_to_repo: z.string().optional(),
		http_url_to_repo: z.string().optional(),
		web_url: z.string().optional(),
		archived: z.boolean().optional(),
		created_at: z.string().optional(),
		last_activity_at: z.string().optional(),
		creator_id: z.number().optional(),
		namespace: GitlabNamespaceSchema.optional(),
		owner: GitlabUserRefSchema.optional(),
		star_count: z.number().optional(),
		forks_count: z.number().optional(),
		open_issues_count: z.number().optional(),
		topics: z.array(z.string()).optional(),
		empty_repo: z.boolean().optional(),
	})
	.passthrough();

const ProjectsListInputSchema = PaginationQuerySchema.extend({
	search: z.string().optional(),
	owned: z.boolean().optional(),
	membership: z.boolean().optional(),
	starred: z.boolean().optional(),
	archived: z.boolean().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	simple: z.boolean().optional(),
});
const ProjectsListResponseSchema = z.array(ProjectSchema);

const ProjectsGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	statistics: z.boolean().optional(),
	license: z.boolean().optional(),
});
const ProjectsGetResponseSchema = ProjectSchema;

const ProjectsCreateInputSchema = z.object({
	name: z.string(),
	path: z.string().optional(),
	namespace_id: z.number().optional(),
	description: z.string().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
	initialize_with_readme: z.boolean().optional(),
	default_branch: z.string().optional(),
});
const ProjectsCreateResponseSchema = ProjectSchema;

const ProjectsUpdateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	name: z.string().optional(),
	description: z.string().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
	default_branch: z.string().optional(),
	archived: z.boolean().optional(),
});
const ProjectsUpdateResponseSchema = ProjectSchema;

const ProjectsDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
});
const ProjectsDeleteResponseSchema = z.object({}).passthrough();

const ProjectsForkInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	namespace_id: z.number().optional(),
	namespace_path: z.string().optional(),
	name: z.string().optional(),
	path: z.string().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
});
const ProjectsForkResponseSchema = ProjectSchema;

// ============================================================================
// Issues
// ============================================================================

const IssueSchema = z
	.object({
		id: z.number(),
		iid: z.number(),
		project_id: z.number(),
		title: z.string(),
		description: z.string().nullable().optional(),
		state: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		closed_at: z.string().nullable().optional(),
		closed_by: GitlabUserRefSchema.nullable().optional(),
		author: GitlabUserRefSchema.optional(),
		assignee: GitlabUserRefSchema.nullable().optional(),
		assignees: z.array(GitlabUserRefSchema).optional(),
		labels: z.array(GitlabLabelRefSchema).optional(),
		milestone: GitlabMilestoneRefSchema.nullable().optional(),
		web_url: z.string().optional(),
		confidential: z.boolean().optional(),
		due_date: z.string().nullable().optional(),
		weight: z.number().nullable().optional(),
		references: z
			.object({
				short: z.string().optional(),
				relative: z.string().optional(),
				full: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const IssuesListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	state: z.enum(['opened', 'closed', 'all']).optional(),
	labels: z.string().optional(),
	milestone: z.string().optional(),
	search: z.string().optional(),
	assignee_id: z.number().optional(),
	author_id: z.number().optional(),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	confidential: z.boolean().optional(),
});
const IssuesListResponseSchema = z.array(IssueSchema);

const IssuesGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	issue_iid: z.number(),
});
const IssuesGetResponseSchema = IssueSchema;

const IssuesCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	title: z.string(),
	description: z.string().optional(),
	assignee_ids: z.array(z.number()).optional(),
	milestone_id: z.number().optional(),
	labels: z.string().optional(),
	due_date: z.string().optional(),
	confidential: z.boolean().optional(),
	weight: z.number().optional(),
});
const IssuesCreateResponseSchema = IssueSchema;

const IssuesUpdateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	issue_iid: z.number(),
	title: z.string().optional(),
	description: z.string().optional(),
	assignee_ids: z.array(z.number()).optional(),
	milestone_id: z.number().optional(),
	labels: z.string().optional(),
	state_event: z.enum(['close', 'reopen']).optional(),
	due_date: z.string().optional(),
	confidential: z.boolean().optional(),
	weight: z.number().optional(),
});
const IssuesUpdateResponseSchema = IssueSchema;

const IssuesDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	issue_iid: z.number(),
});
const IssuesDeleteResponseSchema = z.object({}).passthrough();

const IssuesListNotesInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	issue_iid: z.number(),
	order_by: z.enum(['created_at', 'updated_at']).optional(),
	sort: z.enum(['asc', 'desc']).optional(),
});
const IssuesListNotesResponseSchema = z.array(GitlabNoteSchema);

const IssuesCreateNoteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	issue_iid: z.number(),
	body: z.string(),
});
const IssuesCreateNoteResponseSchema = GitlabNoteSchema;

// ============================================================================
// Merge Requests
// ============================================================================

const MergeRequestSchema = z
	.object({
		id: z.number(),
		iid: z.number(),
		project_id: z.number(),
		title: z.string(),
		description: z.string().nullable().optional(),
		state: z.string().optional(),
		source_branch: z.string().optional(),
		target_branch: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		merged_at: z.string().nullable().optional(),
		closed_at: z.string().nullable().optional(),
		merged_by: GitlabUserRefSchema.nullable().optional(),
		author: GitlabUserRefSchema.optional(),
		assignee: GitlabUserRefSchema.nullable().optional(),
		assignees: z.array(GitlabUserRefSchema).optional(),
		reviewers: z.array(GitlabUserRefSchema).optional(),
		labels: z.array(GitlabLabelRefSchema).optional(),
		milestone: GitlabMilestoneRefSchema.nullable().optional(),
		merge_commit_sha: z.string().nullable().optional(),
		sha: z.string().optional(),
		web_url: z.string().optional(),
		detailed_merge_status: z.string().optional(),
		has_conflicts: z.boolean().optional(),
		draft: z.boolean().optional(),
		changes_count: z.string().nullable().optional(),
		references: z
			.object({
				short: z.string().optional(),
				relative: z.string().optional(),
				full: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const MergeRequestsListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	state: z.enum(['opened', 'closed', 'merged', 'all']).optional(),
	labels: z.string().optional(),
	milestone: z.string().optional(),
	search: z.string().optional(),
	author_id: z.number().optional(),
	assignee_id: z.number().optional(),
	reviewer_id: z.number().optional(),
	source_branch: z.string().optional(),
	target_branch: z.string().optional(),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	scope: z.enum(['created_by_me', 'assigned_to_me', 'all']).optional(),
});
const MergeRequestsListResponseSchema = z.array(MergeRequestSchema);

const MergeRequestsGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
});
const MergeRequestsGetResponseSchema = MergeRequestSchema;

const MergeRequestsCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	source_branch: z.string(),
	target_branch: z.string(),
	title: z.string(),
	description: z.string().optional(),
	assignee_id: z.number().optional(),
	assignee_ids: z.array(z.number()).optional(),
	reviewer_ids: z.array(z.number()).optional(),
	labels: z.string().optional(),
	milestone_id: z.number().optional(),
	remove_source_branch: z.boolean().optional(),
	squash: z.boolean().optional(),
});
const MergeRequestsCreateResponseSchema = MergeRequestSchema;

const MergeRequestsUpdateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
	title: z.string().optional(),
	description: z.string().optional(),
	assignee_id: z.number().optional(),
	assignee_ids: z.array(z.number()).optional(),
	reviewer_ids: z.array(z.number()).optional(),
	labels: z.string().optional(),
	milestone_id: z.number().optional(),
	state_event: z.enum(['close', 'reopen']).optional(),
	remove_source_branch: z.boolean().optional(),
	squash: z.boolean().optional(),
});
const MergeRequestsUpdateResponseSchema = MergeRequestSchema;

const MergeRequestsDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
});
const MergeRequestsDeleteResponseSchema = z.object({}).passthrough();

const MergeRequestsMergeInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
	merge_commit_message: z.string().optional(),
	squash_commit_message: z.string().optional(),
	squash: z.boolean().optional(),
	should_remove_source_branch: z.boolean().optional(),
	merge_when_pipeline_succeeds: z.boolean().optional(),
	sha: z.string().optional(),
});
const MergeRequestsMergeResponseSchema = MergeRequestSchema;

const MergeRequestsApproveInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
	sha: z.string().optional(),
});
const MergeRequestsApproveResponseSchema = z.object({}).passthrough();

const MergeRequestsListNotesInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
	order_by: z.enum(['created_at', 'updated_at']).optional(),
	sort: z.enum(['asc', 'desc']).optional(),
});
const MergeRequestsListNotesResponseSchema = z.array(GitlabNoteSchema);

const MergeRequestsCreateNoteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	merge_request_iid: z.number(),
	body: z.string(),
});
const MergeRequestsCreateNoteResponseSchema = GitlabNoteSchema;

// ============================================================================
// Branches
// ============================================================================

const BranchSchema = z
	.object({
		name: z.string(),
		merged: z.boolean().optional(),
		protected: z.boolean().optional(),
		default: z.boolean().optional(),
		developers_can_push: z.boolean().optional(),
		developers_can_merge: z.boolean().optional(),
		can_push: z.boolean().optional(),
		web_url: z.string().optional(),
		commit: GitlabCommitRefSchema.optional(),
	})
	.passthrough();

const BranchesListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	search: z.string().optional(),
});
const BranchesListResponseSchema = z.array(BranchSchema);

const BranchesGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	branch: z.string(),
});
const BranchesGetResponseSchema = BranchSchema;

const BranchesCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	branch: z.string(),
	ref: z.string(),
});
const BranchesCreateResponseSchema = BranchSchema;

const BranchesDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	branch: z.string(),
});
const BranchesDeleteResponseSchema = z.object({}).passthrough();

// ============================================================================
// Commits
// ============================================================================

const CommitsListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	ref_name: z.string().optional(),
	since: z.string().optional(),
	until: z.string().optional(),
	path: z.string().optional(),
	all: z.boolean().optional(),
	with_stats: z.boolean().optional(),
});
const CommitsListResponseSchema = z.array(GitlabCommitRefSchema);

const CommitsGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	sha: z.string(),
	stats: z.boolean().optional(),
});
const CommitsGetResponseSchema = GitlabCommitRefSchema.extend({
	stats: z
		.object({
			additions: z.number().optional(),
			deletions: z.number().optional(),
			total: z.number().optional(),
		})
		.optional(),
});

const CommitsGetDiffInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	sha: z.string(),
});
const CommitsGetDiffResponseSchema = z.array(GitlabDiffSchema);

// ============================================================================
// Pipelines
// ============================================================================

const PipelineSchema = z
	.object({
		id: z.number(),
		iid: z.number().optional(),
		project_id: z.number().optional(),
		status: z.string().optional(),
		source: z.string().optional(),
		ref: z.string().optional(),
		sha: z.string().optional(),
		web_url: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		started_at: z.string().nullable().optional(),
		finished_at: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		user: GitlabUserRefSchema.optional(),
	})
	.passthrough();

const PipelinesListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	status: z.string().optional(),
	ref: z.string().optional(),
	sha: z.string().optional(),
	source: z.string().optional(),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
});
const PipelinesListResponseSchema = z.array(PipelineSchema);

const PipelinesGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	pipeline_id: z.number(),
});
const PipelinesGetResponseSchema = PipelineSchema;

const PipelinesCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	ref: z.string(),
	variables: z
		.array(
			z.object({
				key: z.string(),
				value: z.string(),
				variable_type: z.string().optional(),
			}),
		)
		.optional(),
});
const PipelinesCreateResponseSchema = PipelineSchema;

const PipelinesRetryInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	pipeline_id: z.number(),
});
const PipelinesRetryResponseSchema = PipelineSchema;

const PipelinesCancelInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	pipeline_id: z.number(),
});
const PipelinesCancelResponseSchema = PipelineSchema;

const PipelinesDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	pipeline_id: z.number(),
});
const PipelinesDeleteResponseSchema = z.object({}).passthrough();

const PipelinesListJobsInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	pipeline_id: z.number(),
	scope: z.array(z.string()).optional(),
});
const PipelinesListJobsResponseSchema = z.array(GitlabJobSchema);

// ============================================================================
// Groups
// ============================================================================

const GroupSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		path: z.string().optional(),
		full_path: z.string().optional(),
		full_name: z.string().optional(),
		description: z.string().nullable().optional(),
		visibility: z.string().optional(),
		parent_id: z.number().nullable().optional(),
		web_url: z.string().optional(),
		created_at: z.string().optional(),
		avatar_url: z.string().nullable().optional(),
	})
	.passthrough();

const GroupsListInputSchema = PaginationQuerySchema.extend({
	search: z.string().optional(),
	owned: z.boolean().optional(),
	top_level_only: z.boolean().optional(),
	statistics: z.boolean().optional(),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
});
const GroupsListResponseSchema = z.array(GroupSchema);

const GroupsGetInputSchema = z.object({
	group_id: z.union([z.number(), z.string()]),
	with_projects: z.boolean().optional(),
});
const GroupsGetResponseSchema = GroupSchema;

const GroupsCreateInputSchema = z.object({
	name: z.string(),
	path: z.string(),
	description: z.string().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
	parent_id: z.number().optional(),
});
const GroupsCreateResponseSchema = GroupSchema;

const GroupsUpdateInputSchema = z.object({
	group_id: z.union([z.number(), z.string()]),
	name: z.string().optional(),
	path: z.string().optional(),
	description: z.string().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
});
const GroupsUpdateResponseSchema = GroupSchema;

const GroupsDeleteInputSchema = z.object({
	group_id: z.union([z.number(), z.string()]),
});
const GroupsDeleteResponseSchema = z.object({}).passthrough();

const GroupsListProjectsInputSchema = PaginationQuerySchema.extend({
	group_id: z.union([z.number(), z.string()]),
	search: z.string().optional(),
	archived: z.boolean().optional(),
	visibility: z.enum(['public', 'internal', 'private']).optional(),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	simple: z.boolean().optional(),
});
const GroupsListProjectsResponseSchema = z.array(ProjectSchema);

// ============================================================================
// Labels
// ============================================================================

const LabelSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		color: z.string().optional(),
		text_color: z.string().optional(),
		description: z.string().nullable().optional(),
		open_issues_count: z.number().optional(),
		closed_issues_count: z.number().optional(),
		open_merge_requests_count: z.number().optional(),
		subscribed: z.boolean().optional(),
		is_project_label: z.boolean().optional(),
	})
	.passthrough();

const LabelsListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	search: z.string().optional(),
});
const LabelsListResponseSchema = z.array(LabelSchema);

const LabelsCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	name: z.string(),
	color: z.string(),
	description: z.string().optional(),
	priority: z.number().optional(),
});
const LabelsCreateResponseSchema = LabelSchema;

const LabelsUpdateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	label_id: z.number(),
	new_name: z.string().optional(),
	color: z.string().optional(),
	description: z.string().optional(),
	priority: z.number().optional(),
});
const LabelsUpdateResponseSchema = LabelSchema;

const LabelsDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	label_id: z.number(),
});
const LabelsDeleteResponseSchema = z.object({}).passthrough();

// ============================================================================
// Milestones
// ============================================================================

const MilestoneSchema = z
	.object({
		id: z.number(),
		iid: z.number().optional(),
		project_id: z.number().optional(),
		title: z.string(),
		description: z.string().nullable().optional(),
		state: z.string().optional(),
		due_date: z.string().nullable().optional(),
		start_date: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

const MilestonesListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	state: z.enum(['active', 'closed']).optional(),
	search: z.string().optional(),
});
const MilestonesListResponseSchema = z.array(MilestoneSchema);

const MilestonesGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	milestone_id: z.number(),
});
const MilestonesGetResponseSchema = MilestoneSchema;

const MilestonesCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	title: z.string(),
	description: z.string().optional(),
	due_date: z.string().optional(),
	start_date: z.string().optional(),
});
const MilestonesCreateResponseSchema = MilestoneSchema;

const MilestonesUpdateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	milestone_id: z.number(),
	title: z.string().optional(),
	description: z.string().optional(),
	due_date: z.string().optional(),
	start_date: z.string().optional(),
	state_event: z.enum(['close', 'activate']).optional(),
});
const MilestonesUpdateResponseSchema = MilestoneSchema;

const MilestonesDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	milestone_id: z.number(),
});
const MilestonesDeleteResponseSchema = z.object({}).passthrough();

// ============================================================================
// Releases
// ============================================================================

const ReleaseSchema = z
	.object({
		tag_name: z.string(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		created_at: z.string().optional(),
		released_at: z.string().optional(),
		upcoming_release: z.boolean().optional(),
		author: GitlabUserRefSchema.optional(),
		commit: GitlabCommitRefSchema.optional(),
		milestones: z.array(GitlabMilestoneRefSchema).optional(),
	})
	.passthrough();

const ReleasesListInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	order_by: z.string().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
});
const ReleasesListResponseSchema = z.array(ReleaseSchema);

const ReleasesGetInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	tag_name: z.string(),
});
const ReleasesGetResponseSchema = ReleaseSchema;

const ReleasesCreateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	tag_name: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	ref: z.string().optional(),
	released_at: z.string().optional(),
	milestones: z.array(z.string()).optional(),
});
const ReleasesCreateResponseSchema = ReleaseSchema;

const ReleasesUpdateInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	tag_name: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	released_at: z.string().optional(),
	milestones: z.array(z.string()).optional(),
});
const ReleasesUpdateResponseSchema = ReleaseSchema;

const ReleasesDeleteInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	tag_name: z.string(),
});
const ReleasesDeleteResponseSchema = z.object({}).passthrough();

// ============================================================================
// Repository
// ============================================================================

const RepositoryGetTreeInputSchema = PaginationQuerySchema.extend({
	project_id: z.union([z.number(), z.string()]),
	path: z.string().optional(),
	ref: z.string().optional(),
	recursive: z.boolean().optional(),
});
const RepositoryGetTreeResponseSchema = z.array(GitlabTreeItemSchema);

const RepositoryGetFileInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	file_path: z.string(),
	ref: z.string().optional(),
});
const RepositoryGetFileResponseSchema = GitlabFileSchema;

const RepositoryCompareInputSchema = z.object({
	project_id: z.union([z.number(), z.string()]),
	from: z.string(),
	to: z.string(),
	straight: z.boolean().optional(),
});
const RepositoryCompareResponseSchema = GitlabCompareSchema;

// ============================================================================
// Type Exports
// ============================================================================

export type UsersGetCurrentUserInput = z.infer<
	typeof UsersGetCurrentUserInputSchema
>;
export type UsersGetCurrentUserResponse = z.infer<
	typeof UsersGetCurrentUserResponseSchema
>;
export type UsersGetUserInput = z.infer<typeof UsersGetUserInputSchema>;
export type UsersGetUserResponse = z.infer<typeof UsersGetUserResponseSchema>;
export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;
export type ProjectsForkInput = z.infer<typeof ProjectsForkInputSchema>;
export type ProjectsForkResponse = z.infer<typeof ProjectsForkResponseSchema>;

export type IssuesListInput = z.infer<typeof IssuesListInputSchema>;
export type IssuesListResponse = z.infer<typeof IssuesListResponseSchema>;
export type IssuesGetInput = z.infer<typeof IssuesGetInputSchema>;
export type IssuesGetResponse = z.infer<typeof IssuesGetResponseSchema>;
export type IssuesCreateInput = z.infer<typeof IssuesCreateInputSchema>;
export type IssuesCreateResponse = z.infer<typeof IssuesCreateResponseSchema>;
export type IssuesUpdateInput = z.infer<typeof IssuesUpdateInputSchema>;
export type IssuesUpdateResponse = z.infer<typeof IssuesUpdateResponseSchema>;
export type IssuesDeleteInput = z.infer<typeof IssuesDeleteInputSchema>;
export type IssuesDeleteResponse = z.infer<typeof IssuesDeleteResponseSchema>;
export type IssuesListNotesInput = z.infer<typeof IssuesListNotesInputSchema>;
export type IssuesListNotesResponse = z.infer<
	typeof IssuesListNotesResponseSchema
>;
export type IssuesCreateNoteInput = z.infer<typeof IssuesCreateNoteInputSchema>;
export type IssuesCreateNoteResponse = z.infer<
	typeof IssuesCreateNoteResponseSchema
>;

export type MergeRequestsListInput = z.infer<
	typeof MergeRequestsListInputSchema
>;
export type MergeRequestsListResponse = z.infer<
	typeof MergeRequestsListResponseSchema
>;
export type MergeRequestsGetInput = z.infer<typeof MergeRequestsGetInputSchema>;
export type MergeRequestsGetResponse = z.infer<
	typeof MergeRequestsGetResponseSchema
>;
export type MergeRequestsCreateInput = z.infer<
	typeof MergeRequestsCreateInputSchema
>;
export type MergeRequestsCreateResponse = z.infer<
	typeof MergeRequestsCreateResponseSchema
>;
export type MergeRequestsUpdateInput = z.infer<
	typeof MergeRequestsUpdateInputSchema
>;
export type MergeRequestsUpdateResponse = z.infer<
	typeof MergeRequestsUpdateResponseSchema
>;
export type MergeRequestsDeleteInput = z.infer<
	typeof MergeRequestsDeleteInputSchema
>;
export type MergeRequestsDeleteResponse = z.infer<
	typeof MergeRequestsDeleteResponseSchema
>;
export type MergeRequestsMergeInput = z.infer<
	typeof MergeRequestsMergeInputSchema
>;
export type MergeRequestsMergeResponse = z.infer<
	typeof MergeRequestsMergeResponseSchema
>;
export type MergeRequestsApproveInput = z.infer<
	typeof MergeRequestsApproveInputSchema
>;
export type MergeRequestsApproveResponse = z.infer<
	typeof MergeRequestsApproveResponseSchema
>;
export type MergeRequestsListNotesInput = z.infer<
	typeof MergeRequestsListNotesInputSchema
>;
export type MergeRequestsListNotesResponse = z.infer<
	typeof MergeRequestsListNotesResponseSchema
>;
export type MergeRequestsCreateNoteInput = z.infer<
	typeof MergeRequestsCreateNoteInputSchema
>;
export type MergeRequestsCreateNoteResponse = z.infer<
	typeof MergeRequestsCreateNoteResponseSchema
>;

export type BranchesListInput = z.infer<typeof BranchesListInputSchema>;
export type BranchesListResponse = z.infer<typeof BranchesListResponseSchema>;
export type BranchesGetInput = z.infer<typeof BranchesGetInputSchema>;
export type BranchesGetResponse = z.infer<typeof BranchesGetResponseSchema>;
export type BranchesCreateInput = z.infer<typeof BranchesCreateInputSchema>;
export type BranchesCreateResponse = z.infer<
	typeof BranchesCreateResponseSchema
>;
export type BranchesDeleteInput = z.infer<typeof BranchesDeleteInputSchema>;
export type BranchesDeleteResponse = z.infer<
	typeof BranchesDeleteResponseSchema
>;

export type CommitsListInput = z.infer<typeof CommitsListInputSchema>;
export type CommitsListResponse = z.infer<typeof CommitsListResponseSchema>;
export type CommitsGetInput = z.infer<typeof CommitsGetInputSchema>;
export type CommitsGetResponse = z.infer<typeof CommitsGetResponseSchema>;
export type CommitsGetDiffInput = z.infer<typeof CommitsGetDiffInputSchema>;
export type CommitsGetDiffResponse = z.infer<
	typeof CommitsGetDiffResponseSchema
>;

export type PipelinesListInput = z.infer<typeof PipelinesListInputSchema>;
export type PipelinesListResponse = z.infer<typeof PipelinesListResponseSchema>;
export type PipelinesGetInput = z.infer<typeof PipelinesGetInputSchema>;
export type PipelinesGetResponse = z.infer<typeof PipelinesGetResponseSchema>;
export type PipelinesCreateInput = z.infer<typeof PipelinesCreateInputSchema>;
export type PipelinesCreateResponse = z.infer<
	typeof PipelinesCreateResponseSchema
>;
export type PipelinesRetryInput = z.infer<typeof PipelinesRetryInputSchema>;
export type PipelinesRetryResponse = z.infer<
	typeof PipelinesRetryResponseSchema
>;
export type PipelinesCancelInput = z.infer<typeof PipelinesCancelInputSchema>;
export type PipelinesCancelResponse = z.infer<
	typeof PipelinesCancelResponseSchema
>;
export type PipelinesDeleteInput = z.infer<typeof PipelinesDeleteInputSchema>;
export type PipelinesDeleteResponse = z.infer<
	typeof PipelinesDeleteResponseSchema
>;
export type PipelinesListJobsInput = z.infer<
	typeof PipelinesListJobsInputSchema
>;
export type PipelinesListJobsResponse = z.infer<
	typeof PipelinesListJobsResponseSchema
>;

export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;
export type GroupsGetInput = z.infer<typeof GroupsGetInputSchema>;
export type GroupsGetResponse = z.infer<typeof GroupsGetResponseSchema>;
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;
export type GroupsCreateResponse = z.infer<typeof GroupsCreateResponseSchema>;
export type GroupsUpdateInput = z.infer<typeof GroupsUpdateInputSchema>;
export type GroupsUpdateResponse = z.infer<typeof GroupsUpdateResponseSchema>;
export type GroupsDeleteInput = z.infer<typeof GroupsDeleteInputSchema>;
export type GroupsDeleteResponse = z.infer<typeof GroupsDeleteResponseSchema>;
export type GroupsListProjectsInput = z.infer<
	typeof GroupsListProjectsInputSchema
>;
export type GroupsListProjectsResponse = z.infer<
	typeof GroupsListProjectsResponseSchema
>;

export type LabelsListInput = z.infer<typeof LabelsListInputSchema>;
export type LabelsListResponse = z.infer<typeof LabelsListResponseSchema>;
export type LabelsCreateInput = z.infer<typeof LabelsCreateInputSchema>;
export type LabelsCreateResponse = z.infer<typeof LabelsCreateResponseSchema>;
export type LabelsUpdateInput = z.infer<typeof LabelsUpdateInputSchema>;
export type LabelsUpdateResponse = z.infer<typeof LabelsUpdateResponseSchema>;
export type LabelsDeleteInput = z.infer<typeof LabelsDeleteInputSchema>;
export type LabelsDeleteResponse = z.infer<typeof LabelsDeleteResponseSchema>;

export type MilestonesListInput = z.infer<typeof MilestonesListInputSchema>;
export type MilestonesListResponse = z.infer<
	typeof MilestonesListResponseSchema
>;
export type MilestonesGetInput = z.infer<typeof MilestonesGetInputSchema>;
export type MilestonesGetResponse = z.infer<typeof MilestonesGetResponseSchema>;
export type MilestonesCreateInput = z.infer<typeof MilestonesCreateInputSchema>;
export type MilestonesCreateResponse = z.infer<
	typeof MilestonesCreateResponseSchema
>;
export type MilestonesUpdateInput = z.infer<typeof MilestonesUpdateInputSchema>;
export type MilestonesUpdateResponse = z.infer<
	typeof MilestonesUpdateResponseSchema
>;
export type MilestonesDeleteInput = z.infer<typeof MilestonesDeleteInputSchema>;
export type MilestonesDeleteResponse = z.infer<
	typeof MilestonesDeleteResponseSchema
>;

export type ReleasesListInput = z.infer<typeof ReleasesListInputSchema>;
export type ReleasesListResponse = z.infer<typeof ReleasesListResponseSchema>;
export type ReleasesGetInput = z.infer<typeof ReleasesGetInputSchema>;
export type ReleasesGetResponse = z.infer<typeof ReleasesGetResponseSchema>;
export type ReleasesCreateInput = z.infer<typeof ReleasesCreateInputSchema>;
export type ReleasesCreateResponse = z.infer<
	typeof ReleasesCreateResponseSchema
>;
export type ReleasesUpdateInput = z.infer<typeof ReleasesUpdateInputSchema>;
export type ReleasesUpdateResponse = z.infer<
	typeof ReleasesUpdateResponseSchema
>;
export type ReleasesDeleteInput = z.infer<typeof ReleasesDeleteInputSchema>;
export type ReleasesDeleteResponse = z.infer<
	typeof ReleasesDeleteResponseSchema
>;

export type RepositoryGetTreeInput = z.infer<
	typeof RepositoryGetTreeInputSchema
>;
export type RepositoryGetTreeResponse = z.infer<
	typeof RepositoryGetTreeResponseSchema
>;
export type RepositoryGetFileInput = z.infer<
	typeof RepositoryGetFileInputSchema
>;
export type RepositoryGetFileResponse = z.infer<
	typeof RepositoryGetFileResponseSchema
>;
export type RepositoryCompareInput = z.infer<
	typeof RepositoryCompareInputSchema
>;
export type RepositoryCompareResponse = z.infer<
	typeof RepositoryCompareResponseSchema
>;

// ============================================================================
// Aggregated Input/Output Maps
// ============================================================================

export type GitlabEndpointInputs = {
	usersGetCurrentUser: UsersGetCurrentUserInput;
	usersGetUser: UsersGetUserInput;
	usersList: UsersListInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	projectsFork: ProjectsForkInput;
	issuesList: IssuesListInput;
	issuesGet: IssuesGetInput;
	issuesCreate: IssuesCreateInput;
	issuesUpdate: IssuesUpdateInput;
	issuesDelete: IssuesDeleteInput;
	issuesListNotes: IssuesListNotesInput;
	issuesCreateNote: IssuesCreateNoteInput;
	mergeRequestsList: MergeRequestsListInput;
	mergeRequestsGet: MergeRequestsGetInput;
	mergeRequestsCreate: MergeRequestsCreateInput;
	mergeRequestsUpdate: MergeRequestsUpdateInput;
	mergeRequestsDelete: MergeRequestsDeleteInput;
	mergeRequestsMerge: MergeRequestsMergeInput;
	mergeRequestsApprove: MergeRequestsApproveInput;
	mergeRequestsListNotes: MergeRequestsListNotesInput;
	mergeRequestsCreateNote: MergeRequestsCreateNoteInput;
	branchesList: BranchesListInput;
	branchesGet: BranchesGetInput;
	branchesCreate: BranchesCreateInput;
	branchesDelete: BranchesDeleteInput;
	commitsList: CommitsListInput;
	commitsGet: CommitsGetInput;
	commitsGetDiff: CommitsGetDiffInput;
	pipelinesList: PipelinesListInput;
	pipelinesGet: PipelinesGetInput;
	pipelinesCreate: PipelinesCreateInput;
	pipelinesRetry: PipelinesRetryInput;
	pipelinesCancel: PipelinesCancelInput;
	pipelinesDelete: PipelinesDeleteInput;
	pipelinesListJobs: PipelinesListJobsInput;
	groupsList: GroupsListInput;
	groupsGet: GroupsGetInput;
	groupsCreate: GroupsCreateInput;
	groupsUpdate: GroupsUpdateInput;
	groupsDelete: GroupsDeleteInput;
	groupsListProjects: GroupsListProjectsInput;
	labelsList: LabelsListInput;
	labelsCreate: LabelsCreateInput;
	labelsUpdate: LabelsUpdateInput;
	labelsDelete: LabelsDeleteInput;
	milestonesList: MilestonesListInput;
	milestonesGet: MilestonesGetInput;
	milestonesCreate: MilestonesCreateInput;
	milestonesUpdate: MilestonesUpdateInput;
	milestonesDelete: MilestonesDeleteInput;
	releasesList: ReleasesListInput;
	releasesGet: ReleasesGetInput;
	releasesCreate: ReleasesCreateInput;
	releasesUpdate: ReleasesUpdateInput;
	releasesDelete: ReleasesDeleteInput;
	repositoryGetTree: RepositoryGetTreeInput;
	repositoryGetFile: RepositoryGetFileInput;
	repositoryCompare: RepositoryCompareInput;
};

export type GitlabEndpointOutputs = {
	usersGetCurrentUser: UsersGetCurrentUserResponse;
	usersGetUser: UsersGetUserResponse;
	usersList: UsersListResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
	projectsFork: ProjectsForkResponse;
	issuesList: IssuesListResponse;
	issuesGet: IssuesGetResponse;
	issuesCreate: IssuesCreateResponse;
	issuesUpdate: IssuesUpdateResponse;
	issuesDelete: IssuesDeleteResponse;
	issuesListNotes: IssuesListNotesResponse;
	issuesCreateNote: IssuesCreateNoteResponse;
	mergeRequestsList: MergeRequestsListResponse;
	mergeRequestsGet: MergeRequestsGetResponse;
	mergeRequestsCreate: MergeRequestsCreateResponse;
	mergeRequestsUpdate: MergeRequestsUpdateResponse;
	mergeRequestsDelete: MergeRequestsDeleteResponse;
	mergeRequestsMerge: MergeRequestsMergeResponse;
	mergeRequestsApprove: MergeRequestsApproveResponse;
	mergeRequestsListNotes: MergeRequestsListNotesResponse;
	mergeRequestsCreateNote: MergeRequestsCreateNoteResponse;
	branchesList: BranchesListResponse;
	branchesGet: BranchesGetResponse;
	branchesCreate: BranchesCreateResponse;
	branchesDelete: BranchesDeleteResponse;
	commitsList: CommitsListResponse;
	commitsGet: CommitsGetResponse;
	commitsGetDiff: CommitsGetDiffResponse;
	pipelinesList: PipelinesListResponse;
	pipelinesGet: PipelinesGetResponse;
	pipelinesCreate: PipelinesCreateResponse;
	pipelinesRetry: PipelinesRetryResponse;
	pipelinesCancel: PipelinesCancelResponse;
	pipelinesDelete: PipelinesDeleteResponse;
	pipelinesListJobs: PipelinesListJobsResponse;
	groupsList: GroupsListResponse;
	groupsGet: GroupsGetResponse;
	groupsCreate: GroupsCreateResponse;
	groupsUpdate: GroupsUpdateResponse;
	groupsDelete: GroupsDeleteResponse;
	groupsListProjects: GroupsListProjectsResponse;
	labelsList: LabelsListResponse;
	labelsCreate: LabelsCreateResponse;
	labelsUpdate: LabelsUpdateResponse;
	labelsDelete: LabelsDeleteResponse;
	milestonesList: MilestonesListResponse;
	milestonesGet: MilestonesGetResponse;
	milestonesCreate: MilestonesCreateResponse;
	milestonesUpdate: MilestonesUpdateResponse;
	milestonesDelete: MilestonesDeleteResponse;
	releasesList: ReleasesListResponse;
	releasesGet: ReleasesGetResponse;
	releasesCreate: ReleasesCreateResponse;
	releasesUpdate: ReleasesUpdateResponse;
	releasesDelete: ReleasesDeleteResponse;
	repositoryGetTree: RepositoryGetTreeResponse;
	repositoryGetFile: RepositoryGetFileResponse;
	repositoryCompare: RepositoryCompareResponse;
};

// ============================================================================
// Aggregated Schema Maps
// ============================================================================

export const GitlabEndpointInputSchemas = {
	usersGetCurrentUser: UsersGetCurrentUserInputSchema,
	usersGetUser: UsersGetUserInputSchema,
	usersList: UsersListInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsFork: ProjectsForkInputSchema,
	issuesList: IssuesListInputSchema,
	issuesGet: IssuesGetInputSchema,
	issuesCreate: IssuesCreateInputSchema,
	issuesUpdate: IssuesUpdateInputSchema,
	issuesDelete: IssuesDeleteInputSchema,
	issuesListNotes: IssuesListNotesInputSchema,
	issuesCreateNote: IssuesCreateNoteInputSchema,
	mergeRequestsList: MergeRequestsListInputSchema,
	mergeRequestsGet: MergeRequestsGetInputSchema,
	mergeRequestsCreate: MergeRequestsCreateInputSchema,
	mergeRequestsUpdate: MergeRequestsUpdateInputSchema,
	mergeRequestsDelete: MergeRequestsDeleteInputSchema,
	mergeRequestsMerge: MergeRequestsMergeInputSchema,
	mergeRequestsApprove: MergeRequestsApproveInputSchema,
	mergeRequestsListNotes: MergeRequestsListNotesInputSchema,
	mergeRequestsCreateNote: MergeRequestsCreateNoteInputSchema,
	branchesList: BranchesListInputSchema,
	branchesGet: BranchesGetInputSchema,
	branchesCreate: BranchesCreateInputSchema,
	branchesDelete: BranchesDeleteInputSchema,
	commitsList: CommitsListInputSchema,
	commitsGet: CommitsGetInputSchema,
	commitsGetDiff: CommitsGetDiffInputSchema,
	pipelinesList: PipelinesListInputSchema,
	pipelinesGet: PipelinesGetInputSchema,
	pipelinesCreate: PipelinesCreateInputSchema,
	pipelinesRetry: PipelinesRetryInputSchema,
	pipelinesCancel: PipelinesCancelInputSchema,
	pipelinesDelete: PipelinesDeleteInputSchema,
	pipelinesListJobs: PipelinesListJobsInputSchema,
	groupsList: GroupsListInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	groupsListProjects: GroupsListProjectsInputSchema,
	labelsList: LabelsListInputSchema,
	labelsCreate: LabelsCreateInputSchema,
	labelsUpdate: LabelsUpdateInputSchema,
	labelsDelete: LabelsDeleteInputSchema,
	milestonesList: MilestonesListInputSchema,
	milestonesGet: MilestonesGetInputSchema,
	milestonesCreate: MilestonesCreateInputSchema,
	milestonesUpdate: MilestonesUpdateInputSchema,
	milestonesDelete: MilestonesDeleteInputSchema,
	releasesList: ReleasesListInputSchema,
	releasesGet: ReleasesGetInputSchema,
	releasesCreate: ReleasesCreateInputSchema,
	releasesUpdate: ReleasesUpdateInputSchema,
	releasesDelete: ReleasesDeleteInputSchema,
	repositoryGetTree: RepositoryGetTreeInputSchema,
	repositoryGetFile: RepositoryGetFileInputSchema,
	repositoryCompare: RepositoryCompareInputSchema,
} as const;

export const GitlabEndpointOutputSchemas = {
	usersGetCurrentUser: UsersGetCurrentUserResponseSchema,
	usersGetUser: UsersGetUserResponseSchema,
	usersList: UsersListResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	projectsFork: ProjectsForkResponseSchema,
	issuesList: IssuesListResponseSchema,
	issuesGet: IssuesGetResponseSchema,
	issuesCreate: IssuesCreateResponseSchema,
	issuesUpdate: IssuesUpdateResponseSchema,
	issuesDelete: IssuesDeleteResponseSchema,
	issuesListNotes: IssuesListNotesResponseSchema,
	issuesCreateNote: IssuesCreateNoteResponseSchema,
	mergeRequestsList: MergeRequestsListResponseSchema,
	mergeRequestsGet: MergeRequestsGetResponseSchema,
	mergeRequestsCreate: MergeRequestsCreateResponseSchema,
	mergeRequestsUpdate: MergeRequestsUpdateResponseSchema,
	mergeRequestsDelete: MergeRequestsDeleteResponseSchema,
	mergeRequestsMerge: MergeRequestsMergeResponseSchema,
	mergeRequestsApprove: MergeRequestsApproveResponseSchema,
	mergeRequestsListNotes: MergeRequestsListNotesResponseSchema,
	mergeRequestsCreateNote: MergeRequestsCreateNoteResponseSchema,
	branchesList: BranchesListResponseSchema,
	branchesGet: BranchesGetResponseSchema,
	branchesCreate: BranchesCreateResponseSchema,
	branchesDelete: BranchesDeleteResponseSchema,
	commitsList: CommitsListResponseSchema,
	commitsGet: CommitsGetResponseSchema,
	commitsGetDiff: CommitsGetDiffResponseSchema,
	pipelinesList: PipelinesListResponseSchema,
	pipelinesGet: PipelinesGetResponseSchema,
	pipelinesCreate: PipelinesCreateResponseSchema,
	pipelinesRetry: PipelinesRetryResponseSchema,
	pipelinesCancel: PipelinesCancelResponseSchema,
	pipelinesDelete: PipelinesDeleteResponseSchema,
	pipelinesListJobs: PipelinesListJobsResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	groupsCreate: GroupsCreateResponseSchema,
	groupsUpdate: GroupsUpdateResponseSchema,
	groupsDelete: GroupsDeleteResponseSchema,
	groupsListProjects: GroupsListProjectsResponseSchema,
	labelsList: LabelsListResponseSchema,
	labelsCreate: LabelsCreateResponseSchema,
	labelsUpdate: LabelsUpdateResponseSchema,
	labelsDelete: LabelsDeleteResponseSchema,
	milestonesList: MilestonesListResponseSchema,
	milestonesGet: MilestonesGetResponseSchema,
	milestonesCreate: MilestonesCreateResponseSchema,
	milestonesUpdate: MilestonesUpdateResponseSchema,
	milestonesDelete: MilestonesDeleteResponseSchema,
	releasesList: ReleasesListResponseSchema,
	releasesGet: ReleasesGetResponseSchema,
	releasesCreate: ReleasesCreateResponseSchema,
	releasesUpdate: ReleasesUpdateResponseSchema,
	releasesDelete: ReleasesDeleteResponseSchema,
	repositoryGetTree: RepositoryGetTreeResponseSchema,
	repositoryGetFile: RepositoryGetFileResponseSchema,
	repositoryCompare: RepositoryCompareResponseSchema,
} as const;
