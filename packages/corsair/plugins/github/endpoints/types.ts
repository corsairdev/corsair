import { z } from 'zod';
import type {
	Issue,
	PullRequest,
	Release,
	Repository,
	Workflow,
	WorkflowRun,
} from '../types';

const SimpleUserSchema = z.object({
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	login: z.string(),
	id: z.number(),
	nodeId: z.string().optional(),
	avatarUrl: z.string().optional(),
	gravatarId: z.string().nullable().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	followersUrl: z.string().optional(),
	followingUrl: z.string().optional(),
	gistsUrl: z.string().optional(),
	starredUrl: z.string().optional(),
	subscriptionsUrl: z.string().optional(),
	organizationsUrl: z.string().optional(),
	reposUrl: z.string().optional(),
	eventsUrl: z.string().optional(),
	receivedEventsUrl: z.string().optional(),
	type: z.string().optional(),
	siteAdmin: z.boolean().optional(),
	starredAt: z.string().optional(),
});

const LabelSchema = z.object({
	id: z.number().optional(),
	nodeId: z.string().optional(),
	url: z.string().optional(),
	name: z.string().optional(),
	description: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	default: z.boolean().optional(),
});

const MilestoneSchema = z.object({
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	labelsUrl: z.string().optional(),
	id: z.number().optional(),
	nodeId: z.string().optional(),
	number: z.number().optional(),
	state: z.enum(['open', 'closed']).optional(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	creator: SimpleUserSchema.optional(),
	openIssues: z.number().optional(),
	closedIssues: z.number().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	closedAt: z.string().nullable().optional(),
	dueOn: z.string().nullable().optional(),
});

const RepositorySchema = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	name: z.string(),
	fullName: z.string().optional(),
	private: z.boolean().optional(),
	htmlUrl: z.string().optional(),
	description: z.string().nullable().optional(),
	fork: z.boolean().optional(),
	url: z.string().optional(),
	createdAt: z.union([z.string(), z.date()]).nullable().optional(),
	updatedAt: z.union([z.string(), z.date()]).nullable().optional(),
	pushedAt: z.union([z.string(), z.date()]).nullable().optional(),
	defaultBranch: z.string().optional(),
	language: z.string().nullable().optional(),
	stargazersCount: z.number().optional(),
	watchersCount: z.number().optional(),
	forksCount: z.number().optional(),
	openIssuesCount: z.number().optional(),
	archived: z.boolean().optional(),
	disabled: z.boolean().optional(),
	owner: SimpleUserSchema.optional(),
});

const IssueSchema = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	url: z.string().optional(),
	repositoryUrl: z.string().optional(),
	labelsUrl: z.string().optional(),
	commentsUrl: z.string().optional(),
	eventsUrl: z.string().optional(),
	htmlUrl: z.string().optional(),
	number: z.number(),
	state: z.string(),
	stateReason: z
		.enum(['completed', 'reopened', 'not_planned', 'duplicate'])
		.nullable()
		.optional(),
	title: z.string(),
	body: z.string().nullable().optional(),
	user: SimpleUserSchema.nullable().optional(),
	labels: z.array(z.union([z.string(), LabelSchema])).optional(),
	assignee: SimpleUserSchema.nullable().optional(),
	assignees: z.array(SimpleUserSchema).nullable().optional(),
	locked: z.boolean().optional(),
	comments: z.number().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	closedAt: z.string().nullable().optional(),
});

const PullRequestSchema = z.object({
	url: z.string(),
	id: z.number(),
	nodeId: z.string().optional(),
	htmlUrl: z.string().optional(),
	diffUrl: z.string().optional(),
	patchUrl: z.string().optional(),
	issueUrl: z.string().optional(),
	number: z.number(),
	state: z.enum(['open', 'closed']),
	locked: z.boolean().optional(),
	title: z.string(),
	user: SimpleUserSchema.optional(),
	body: z.string().nullable().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	closedAt: z.string().nullable().optional(),
	mergedAt: z.string().nullable().optional(),
	mergeCommitSha: z.string().nullable().optional(),
	assignee: SimpleUserSchema.nullable().optional(),
	assignees: z.array(SimpleUserSchema).nullable().optional(),
	labels: z.array(LabelSchema).optional(),
	milestone: MilestoneSchema.nullable().optional(),
	commitsUrl: z.string().optional(),
	reviewCommentsUrl: z.string().optional(),
	reviewCommentUrl: z.string().optional(),
	commentsUrl: z.string().optional(),
	statusesUrl: z.string().optional(),
	head: z
		.object({
			label: z.string().optional(),
			ref: z.string().optional(),
			sha: z.string().optional(),
			user: SimpleUserSchema.optional(),
			repo: RepositorySchema.nullable().optional(),
		})
		.optional(),
	base: z
		.object({
			label: z.string().optional(),
			ref: z.string().optional(),
			sha: z.string().optional(),
			user: SimpleUserSchema.optional(),
			repo: RepositorySchema.optional(),
		})
		.optional(),
	authorAssociation: z.string().optional(),
	draft: z.boolean().optional(),
	merged: z.boolean().optional(),
	mergeable: z.boolean().nullable().optional(),
	comments: z.number().optional(),
	reviewComments: z.number().optional(),
	commits: z.number().optional(),
	additions: z.number().optional(),
	deletions: z.number().optional(),
	changedFiles: z.number().optional(),
});

const ReleaseAssetSchema = z.object({
	url: z.string(),
	browserDownloadUrl: z.string(),
	id: z.number(),
	nodeId: z.string(),
	name: z.string(),
	label: z.string().nullable(),
	state: z.enum(['uploaded', 'open']),
	contentType: z.string(),
	size: z.number(),
	downloadCount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const ReleaseSchema = z.object({
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	assetsUrl: z.string().optional(),
	uploadUrl: z.string().optional(),
	tarballUrl: z.string().nullable().optional(),
	zipballUrl: z.string().nullable().optional(),
	id: z.number(),
	nodeId: z.string().optional(),
	tagName: z.string().optional(),
	targetCommitish: z.string().optional(),
	name: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	draft: z.boolean().optional(),
	prerelease: z.boolean().optional(),
	createdAt: z.string().optional(),
	publishedAt: z.union([z.string(), z.date()]).nullable().optional(),
	author: SimpleUserSchema.optional(),
	assets: z.array(ReleaseAssetSchema).optional(),
});

const WorkflowSchema = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	name: z.string(),
	path: z.string(),
	state: z.enum([
		'active',
		'deleted',
		'disabled_fork',
		'disabled_inactivity',
		'disabled_manually',
	]),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	badgeUrl: z.string().optional(),
	deletedAt: z.string().optional(),
});

const WorkflowRunSchema = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	name: z.string().nullable().optional(),
	headBranch: z.string().nullable().optional(),
	headSha: z.string().optional(),
	path: z.string().optional(),
	runNumber: z.number().optional(),
	runAttempt: z.number().optional(),
	event: z.string().optional(),
	status: z.string().nullable().optional(),
	conclusion: z.string().nullable().optional(),
	workflowId: z.number().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	displayTitle: z.string().optional(),
});

const IssueCommentCreateResponseSchema = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	url: z.string().optional(),
	body: z.string().optional(),
	bodyText: z.string().optional(),
	bodyHtml: z.string().optional(),
	htmlUrl: z.string().optional(),
	user: z
		.object({
			login: z.string(),
			id: z.number(),
			nodeId: z.string().optional(),
			avatarUrl: z.string().optional(),
		})
		.optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	issueUrl: z.string().optional(),
});

const PullRequestReviewSchema = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	user: z
		.object({
			login: z.string(),
			id: z.number(),
		})
		.optional(),
	body: z.string().optional(),
	state: z.string().optional(),
	htmlUrl: z.string().optional(),
	pullRequestUrl: z.string().optional(),
	submittedAt: z.string().optional(),
	commitId: z.string().nullable().optional(),
});

const RepositoryBranchesListResponseSchema = z.array(
	z.object({
		name: z.string(),
		commit: z.object({
			sha: z.string(),
			url: z.string(),
		}),
		protected: z.boolean(),
	}),
);

const RepositoryCommitsListResponseSchema = z.array(
	z.object({
		url: z.string().optional(),
		sha: z.string(),
		nodeId: z.string().optional(),
		htmlUrl: z.string().optional(),
		commentsUrl: z.string().optional(),
		commit: z.object({
			url: z.string().optional(),
			author: z
				.object({
					name: z.string(),
					email: z.string(),
					date: z.string(),
				})
				.nullable()
				.optional(),
			committer: z
				.object({
					name: z.string(),
					email: z.string(),
					date: z.string(),
				})
				.nullable()
				.optional(),
			message: z.string(),
			commentCount: z.number().optional(),
			tree: z
				.object({
					sha: z.string(),
					url: z.string().optional(),
				})
				.optional(),
		}),
		author: z
			.object({
				login: z.string(),
				id: z.number(),
			})
			.nullable()
			.optional(),
		committer: z
			.object({
				login: z.string(),
				id: z.number(),
			})
			.nullable()
			.optional(),
		parents: z
			.array(
				z.object({
					sha: z.string(),
					url: z.string().optional(),
					htmlUrl: z.string().optional(),
				}),
			)
			.optional(),
	}),
);

const RepositoryContentGetResponseSchema = z.union([
	z.object({
		type: z.literal('file'),
		encoding: z.string().optional(),
		size: z.number().optional(),
		name: z.string(),
		path: z.string().optional(),
		content: z.string().optional(),
		sha: z.string(),
		url: z.string().optional(),
		gitUrl: z.string().nullable().optional(),
		htmlUrl: z.string().nullable().optional(),
		downloadUrl: z.string().nullable().optional(),
	}),
	z.object({
		type: z.literal('dir'),
		name: z.string(),
		path: z.string().optional(),
		sha: z.string(),
		size: z.number().optional(),
		url: z.string().optional(),
		gitUrl: z.string().nullable().optional(),
		htmlUrl: z.string().nullable().optional(),
		downloadUrl: z.string().nullable().optional(),
	}),
	z.array(
		z.object({
			type: z.enum(['file', 'dir', 'submodule', 'symlink']),
			size: z.number().optional(),
			name: z.string(),
			path: z.string().optional(),
			sha: z.string(),
			url: z.string().optional(),
			gitUrl: z.string().nullable().optional(),
			htmlUrl: z.string().nullable().optional(),
			downloadUrl: z.string().nullable().optional(),
		}),
	),
]);

export const GithubEndpointOutputSchemas = {
	issuesList: z.array(IssueSchema),
	issuesGet: IssueSchema,
	issuesCreate: IssueSchema,
	issuesUpdate: IssueSchema,
	issuesCreateComment: IssueCommentCreateResponseSchema,
	pullRequestsList: z.array(PullRequestSchema),
	pullRequestsGet: PullRequestSchema,
	pullRequestsListReviews: z.array(PullRequestReviewSchema),
	pullRequestsCreateReview: PullRequestReviewSchema,
	repositoriesList: z.array(RepositorySchema),
	repositoriesGet: RepositorySchema,
	repositoriesListBranches: RepositoryBranchesListResponseSchema,
	repositoriesListCommits: RepositoryCommitsListResponseSchema,
	repositoriesGetContent: RepositoryContentGetResponseSchema,
	releasesList: z.array(ReleaseSchema),
	releasesGet: ReleaseSchema,
	releasesCreate: ReleaseSchema,
	releasesUpdate: ReleaseSchema,
	workflowsList: z
		.object({
			totalCount: z.number().optional(),
			total_count: z.number().optional(),
			workflows: z.array(WorkflowSchema).optional(),
		})
		.passthrough(),
	workflowsGet: WorkflowSchema,
	workflowsListRuns: z
		.object({
			totalCount: z.number().optional(),
			total_count: z.number().optional(),
			workflowRuns: z.array(WorkflowRunSchema).optional(),
			workflow_runs: z.array(WorkflowRunSchema).optional(),
		})
		.passthrough(),
} as const;

export type GithubEndpointOutputs = {
	[K in keyof typeof GithubEndpointOutputSchemas]: z.infer<
		typeof GithubEndpointOutputSchemas[K]
	>;
};

export type IssuesListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.issuesList
>;
export type IssueGetResponse = z.infer<
	typeof GithubEndpointOutputSchemas.issuesGet
>;
export type IssueCreateResponse = z.infer<
	typeof GithubEndpointOutputSchemas.issuesCreate
>;
export type IssueUpdateResponse = z.infer<
	typeof GithubEndpointOutputSchemas.issuesUpdate
>;
export type IssueCommentCreateResponse = z.infer<
	typeof GithubEndpointOutputSchemas.issuesCreateComment
>;

export type PullRequestsListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.pullRequestsList
>;
export type PullRequestGetResponse = z.infer<
	typeof GithubEndpointOutputSchemas.pullRequestsGet
>;
export type PullRequestReviewListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.pullRequestsListReviews
>;
export type PullRequestReviewCreateResponse = z.infer<
	typeof GithubEndpointOutputSchemas.pullRequestsCreateReview
>;

export type RepositoriesListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.repositoriesList
>;
export type RepositoryGetResponse = z.infer<
	typeof GithubEndpointOutputSchemas.repositoriesGet
>;
export type RepositoryBranchesListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.repositoriesListBranches
>;
export type RepositoryCommitsListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.repositoriesListCommits
>;
export type RepositoryContentGetResponse = z.infer<
	typeof GithubEndpointOutputSchemas.repositoriesGetContent
>;

export type ReleasesListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.releasesList
>;
export type ReleaseGetResponse = z.infer<
	typeof GithubEndpointOutputSchemas.releasesGet
>;
export type ReleaseCreateResponse = z.infer<
	typeof GithubEndpointOutputSchemas.releasesCreate
>;
export type ReleaseUpdateResponse = z.infer<
	typeof GithubEndpointOutputSchemas.releasesUpdate
>;

export type WorkflowsListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.workflowsList
>;
export type WorkflowGetResponse = z.infer<
	typeof GithubEndpointOutputSchemas.workflowsGet
>;
export type WorkflowRunsListResponse = z.infer<
	typeof GithubEndpointOutputSchemas.workflowsListRuns
>;
