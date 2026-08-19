import { z } from 'zod';

export const BitbucketRequestBodySchema = z.union([
	z.object({}).loose(),
	z.array(z.object({}).loose()),
]);
/** POST /repositories/{workspace}/{repo_slug}/refs/branches */
export const BitbucketCreateBranchBodySchema = z
	.object({
		name: z.string().min(1),
		target: z.object({ hash: z.string().min(1) }).loose(),
	})
	.loose();
/** POST /repositories/{workspace}/{repo_slug}/pullrequests */
export const BitbucketCreatePullRequestBodySchema = z
	.object({
		title: z.string().min(1),
		source: z
			.object({
				branch: z.object({ name: z.string().min(1) }).loose(),
			})
			.loose(),
	})
	.loose();
/** POST /repositories/{workspace}/{repo_slug}/issues — title is the only required element. */
export const BitbucketCreateIssueBodySchema = z
	.object({
		title: z.string().min(1),
	})
	.loose();
/**
 * Attributes `PUT /repositories/{workspace}/{repo_slug}/issues/{issue_id}`
 * updates. Bitbucket requires at least one of them — a payload without any is
 * either rejected or silently leaves the issue unchanged — so the body schema
 * below refuses `{}` and bodies that carry only unrecognized keys.
 */
export const bitbucketIssueUpdateAttributes = [
	'title',
	'content',
	'state',
	'kind',
	'priority',
	'assignee',
	'milestone',
	'component',
	'version',
] as const;
export const BitbucketIssueUpdateBodySchema = z
	.object({
		title: z.string().min(1).optional(),
		content: z.object({ raw: z.string() }).loose().optional(),
		state: z
			.enum([
				'new',
				'open',
				'resolved',
				'on hold',
				'invalid',
				'duplicate',
				'wontfix',
				'closed',
			])
			.optional(),
		kind: z.enum(['bug', 'enhancement', 'proposal', 'task']).optional(),
		priority: z
			.enum(['trivial', 'minor', 'major', 'critical', 'blocker'])
			.optional(),
		// `null` clears the field; an object selects one (by uuid, account_id or name).
		assignee: z.object({}).loose().nullable().optional(),
		milestone: z.object({}).loose().nullable().optional(),
		component: z.object({}).loose().nullable().optional(),
		version: z.object({}).loose().nullable().optional(),
	})
	.loose()
	.refine(
		(body) =>
			bitbucketIssueUpdateAttributes.some(
				(attribute) => body[attribute] !== undefined,
			),
		{
			message:
				'must set at least one issue attribute to update (' +
				bitbucketIssueUpdateAttributes.join(', ') +
				')',
		},
	);
export const BitbucketResponseSchema = z.union([
	z.object({}).loose(),
	z.array(z.unknown()),
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);

export const BitbucketEndpointInputSchemas = {
	approvePullRequest: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	browseRepositoryPath: z
		.object({
			commit: z.string(),
			path: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			format: z.enum(['meta', 'rendered']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			max_depth: z.number().int().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesIssuesVote: z
		.object({
			issue_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	createBranch: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketCreateBranchBodySchema,
		})
		.strict(),
	createPullRequest: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketCreatePullRequestBodySchema,
		})
		.strict(),
	createIssue: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketCreateIssueBodySchema,
		})
		.strict(),
	createIssueComment: z
		.object({
			issue_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	createRepositoriesCommitReportsAnnotations: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			reportId: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	createPullRequestComment: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	createRepository: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketRequestBodySchema.optional(),
		})
		.strict(),
	createSnippetComment: z
		.object({
			encoded_id: z.union([z.string(), z.number().int()]),
			workspace: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	createTeamsPipelinesConfigVariables: z
		.object({
			username: z.string(),
			body: BitbucketRequestBodySchema.optional(),
		})
		.strict(),
	createUsersPipelinesConfigVariables: z
		.object({
			selected_user: z.string(),
			body: BitbucketRequestBodySchema.optional(),
		})
		.strict(),
	deleteCommitComment: z
		.object({
			comment_id: z.union([z.string(), z.number().int()]),
			commit: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	deleteRepositoriesCommitReportsAnnotations: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			reportId: z.string(),
			annotationId: z.string(),
		})
		.strict(),
	deleteIssue: z
		.object({
			issue_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	deleteRepository: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			redirect_to: z.string().optional(),
		})
		.strict(),
	deleteSnippetsWatch: z
		.object({
			encoded_id: z.union([z.string(), z.number().int()]),
			workspace: z.string(),
		})
		.strict(),
	deleteUserPipelineVariable: z
		.object({
			selected_user: z.string(),
			variable_uuid: z.string(),
		})
		.strict(),
	getCommitBuildStatus: z
		.object({
			commit: z.string(),
			key: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getCommitChanges: z
		.object({
			repo_slug: z.string(),
			spec: z.string(),
			workspace: z.string(),
			ignore_whitespace: z.boolean().optional(),
			merge: z.boolean().optional(),
			path: z.string().optional(),
			renames: z.boolean().optional(),
			topic: z.boolean().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getCommitDiff: z
		.object({
			repo_slug: z.string(),
			spec: z.string(),
			workspace: z.string(),
			context: z.number().int().optional(),
			path: z.string().optional(),
			ignore_whitespace: z.boolean().optional(),
			binary: z.boolean().optional(),
			renames: z.boolean().optional(),
			merge: z.boolean().optional(),
			topic: z.boolean().optional(),
		})
		.strict(),
	getRepositoriesCommitReports: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getOpenidConfiguration: z
		.object({
			workspace: z.string(),
		})
		.strict(),
	getPullRequest: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getPullRequestCommits: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getPullRequestDiff: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getPullRequestDiffstat: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesMergeBase: z
		.object({
			repo_slug: z.string(),
			revspec: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesBranchingModel: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesCommit: z
		.object({
			commit: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesEnvironments2: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			environment_uuid: z.string(),
		})
		.strict(),
	getRepositoryPatch: z
		.object({
			repo_slug: z.string(),
			spec: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getSshLatestKeys: z
		.object({
			selected_user: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getWorkspacesPullrequests: z
		.object({
			selected_user: z.string(),
			workspace: z.string(),
			state: z.enum(['OPEN', 'MERGED', 'DECLINED', 'SUPERSEDED']).optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getBranch: z
		.object({
			name: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getCommitComment: z
		.object({
			comment_id: z.union([z.string(), z.number().int()]),
			commit: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesCommitComments: z
		.object({
			commit: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesCommitReport: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			reportId: z.string(),
		})
		.strict(),
	getRepositoriesCommitReportsAnnotations: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			reportId: z.string(),
			annotationId: z.string(),
		})
		.strict(),
	getRepositoriesCommitStatuses: z
		.object({
			commit: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			refname: z.string().optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getCurrentUser2: z.object({}).strict(),
	getDeploymentEnvironmentVariables: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			environment_uuid: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesEffectiveBranchingModel: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesFilehistory: z
		.object({
			commit: z.string(),
			path: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			renames: z.string().optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getFileFromRepository: z
		.object({
			commit: z.string(),
			path: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			format: z.enum(['meta', 'rendered']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			max_depth: z.number().int().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getHookEvents: z
		.object({
			subject_type: z.enum(['repository', 'workspace']),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPipelinesSteps: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			pipeline_uuid: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getProjectsRepos: z
		.object({
			workspace: z.string(),
			role: z.enum(['admin', 'contributor', 'member', 'owner']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			project_key: z.string().min(1),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getPullRequestComment: z
		.object({
			comment_id: z.union([z.string(), z.number().int()]),
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesPullrequestsComments: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPullrequestsStatuses: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPullrequestsActivity: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRawFileContent: z
		.object({
			commit: z.string(),
			path: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			format: z.enum(['meta', 'rendered']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			max_depth: z.number().int().optional(),
		})
		.strict(),
	getRepositoriesSrc: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			format: z.enum(['meta']).optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepository: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesPipelinesConfigSshKnownHosts: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPipelinesConfigRunners: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPipelinesConfigSchedules: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPipelinesConfigVariables: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesPipelinesConfigCaches: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesRefs: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getRepositoriesWatchers: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getSnippet: z
		.object({
			encoded_id: z.union([z.string(), z.number().int()]),
			workspace: z.string(),
		})
		.strict(),
	getSnippetsWatch: z
		.object({
			encoded_id: z.union([z.string(), z.number().int()]),
			workspace: z.string(),
		})
		.strict(),
	getRepositoriesPipelines2: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			pipeline_uuid: z.string(),
		})
		.strict(),
	getRepositoriesRefsTags: z
		.object({
			name: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	getUser: z
		.object({
			selected_user: z.string(),
		})
		.strict(),
	getUserEmails2: z
		.object({
			email: z.string(),
		})
		.strict(),
	getUserEmails: z.object({}).strict(),
	getUserPermissionsRepositories: z
		.object({
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getUserPermissionsWorkspaces: z
		.object({
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getUserWorkspaces: z
		.object({
			sort: z.string().optional(),
			administrator: z.boolean().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	getWorkspace: z
		.object({
			workspace: z.string(),
		})
		.strict(),
	listRepositories: z
		.object({
			after: z.string().optional(),
			role: z.enum(['admin', 'contributor', 'member', 'owner']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listBranches: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listCommits: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listCommitsFromRevision: z
		.object({
			repo_slug: z.string(),
			revision: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	createRepositoriesCommits2: z
		.object({
			repo_slug: z.string(),
			revision: z.string(),
			workspace: z.string(),
			body: BitbucketRequestBodySchema.optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listCommitsOnMaster: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listDeployments: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listIssues: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listPipelines: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			'creator.uuid': z.string().optional(),
			'target.ref_type': z.enum(['BRANCH', 'TAG', 'ANNOTATED_TAG']).optional(),
			'target.ref_name': z.string().optional(),
			'target.branch': z.string().optional(),
			'target.commit.hash': z.string().optional(),
			'target.selector.pattern': z.string().optional(),
			'target.selector.type': z
				.enum(['BRANCH', 'TAG', 'CUSTOM', 'PULLREQUESTS', 'DEFAULT'])
				.optional(),
			created_on: z.string().optional(),
			trigger_type: z
				.enum(['PUSH', 'MANUAL', 'SCHEDULED', 'PARENT_STEP'])
				.optional(),
			status: z
				.enum([
					'PARSING',
					'PENDING',
					'PAUSED',
					'HALTED',
					'BUILDING',
					'ERROR',
					'PASSED',
					'FAILED',
					'STOPPED',
					'UNKNOWN',
				])
				.optional(),
			sort: z
				.enum(['creator.uuid', 'created_on', 'run_creation_date'])
				.optional(),
			page: z.number().int().optional(),
			pagelen: z.number().int().optional(),
		})
		.strict(),
	listPullRequestTasks: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			q: z.string().optional(),
			sort: z.string().optional(),
			pagelen: z.number().int().optional(),
			page: z.number().int().positive().optional(),
		})
		.strict(),
	listPullRequests: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			state: z.enum(['OPEN', 'MERGED', 'DECLINED', 'SUPERSEDED']).optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listRepositoriesInWorkspace: z
		.object({
			workspace: z.string(),
			role: z.enum(['admin', 'contributor', 'member', 'owner']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listRepositoriesEnvironments: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listRepositoryPaths: z
		.object({
			commit: z.string(),
			path: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			format: z.enum(['meta', 'rendered']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			max_depth: z.number().int().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listSnippets: z
		.object({
			role: z.enum(['owner', 'contributor', 'member']).optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listTags: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listVersions: z
		.object({
			repo_slug: z.string(),
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listWorkspaceMembers: z
		.object({
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listWorkspaceProjects: z
		.object({
			workspace: z.string(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	listWorkspaces: z
		.object({
			role: z.enum(['owner', 'collaborator', 'member']).optional(),
			q: z.string().optional(),
			sort: z.string().optional(),
			page: z.number().int().positive().optional(),
			pagelen: z.number().int().positive().optional(),
		})
		.strict(),
	requestPullRequestChanges: z
		.object({
			pull_request_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
		})
		.strict(),
	searchTeamCode: z
		.object({
			username: z.string(),
			search_query: z.string().optional(),
			page: z.number().int().optional(),
			pagelen: z.number().int().optional(),
		})
		.strict(),
	searchUserRepositoriesCode: z
		.object({
			selected_user: z.string(),
			search_query: z.string().optional(),
			page: z.number().int().optional(),
			pagelen: z.number().int().optional(),
		})
		.strict(),
	getWorkspacesSearchCode: z
		.object({
			workspace: z.string(),
			search_query: z.string().optional(),
			page: z.number().int().optional(),
			pagelen: z.number().int().optional(),
		})
		.strict(),
	updateIssue: z
		.object({
			issue_id: z.union([z.string(), z.number().int()]),
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketIssueUpdateBodySchema,
		})
		.strict(),
	updateRepositoriesCommitComments: z
		.object({
			comment_id: z.union([z.string(), z.number().int()]),
			commit: z.string(),
			repo_slug: z.string(),
			workspace: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	updateInsightsProjectsReposCommitsReports: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			reportId: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	updateRepositoriesCommitReportsAnnotations: z
		.object({
			workspace: z.string(),
			repo_slug: z.string(),
			commit: z.string(),
			reportId: z.string(),
			annotationId: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	updateTeamsPipelinesConfigVariables: z
		.object({
			username: z.string(),
			variable_uuid: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
	updateUsersPipelinesConfigVariables: z
		.object({
			selected_user: z.string(),
			variable_uuid: z.string(),
			body: BitbucketRequestBodySchema,
		})
		.strict(),
} as const;
export const BitbucketEndpointOutputSchemas = {
	approvePullRequest: BitbucketResponseSchema,
	browseRepositoryPath: BitbucketResponseSchema,
	getRepositoriesIssuesVote: BitbucketResponseSchema,
	createBranch: BitbucketResponseSchema,
	createPullRequest: BitbucketResponseSchema,
	createIssue: BitbucketResponseSchema,
	createIssueComment: BitbucketResponseSchema,
	createRepositoriesCommitReportsAnnotations: BitbucketResponseSchema,
	createPullRequestComment: BitbucketResponseSchema,
	createRepository: BitbucketResponseSchema,
	createSnippetComment: BitbucketResponseSchema,
	createTeamsPipelinesConfigVariables: BitbucketResponseSchema,
	createUsersPipelinesConfigVariables: BitbucketResponseSchema,
	deleteCommitComment: z.null(),
	deleteRepositoriesCommitReportsAnnotations: z.null(),
	deleteIssue: z.null(),
	deleteRepository: z.null(),
	deleteSnippetsWatch: z.null(),
	deleteUserPipelineVariable: z.null(),
	getCommitBuildStatus: BitbucketResponseSchema,
	getCommitChanges: BitbucketResponseSchema,
	getCommitDiff: z.string(),
	getRepositoriesCommitReports: BitbucketResponseSchema,
	getOpenidConfiguration: BitbucketResponseSchema,
	getPullRequest: BitbucketResponseSchema,
	getPullRequestCommits: BitbucketResponseSchema,
	getPullRequestDiff: z.string(),
	getPullRequestDiffstat: BitbucketResponseSchema,
	getRepositoriesMergeBase: BitbucketResponseSchema,
	getRepositoriesBranchingModel: BitbucketResponseSchema,
	getRepositoriesCommit: BitbucketResponseSchema,
	getRepositoriesEnvironments2: BitbucketResponseSchema,
	getRepositoryPatch: z.string(),
	getSshLatestKeys: BitbucketResponseSchema,
	getWorkspacesPullrequests: BitbucketResponseSchema,
	getBranch: BitbucketResponseSchema,
	getCommitComment: BitbucketResponseSchema,
	getRepositoriesCommitComments: BitbucketResponseSchema,
	getRepositoriesCommitReport: BitbucketResponseSchema,
	getRepositoriesCommitReportsAnnotations: BitbucketResponseSchema,
	getRepositoriesCommitStatuses: BitbucketResponseSchema,
	getCurrentUser2: BitbucketResponseSchema,
	getDeploymentEnvironmentVariables: BitbucketResponseSchema,
	getRepositoriesEffectiveBranchingModel: BitbucketResponseSchema,
	getRepositoriesFilehistory: BitbucketResponseSchema,
	getFileFromRepository: BitbucketResponseSchema,
	getHookEvents: BitbucketResponseSchema,
	getRepositoriesPipelinesSteps: BitbucketResponseSchema,
	getProjectsRepos: BitbucketResponseSchema,
	getPullRequestComment: BitbucketResponseSchema,
	getRepositoriesPullrequestsComments: BitbucketResponseSchema,
	getRepositoriesPullrequestsStatuses: BitbucketResponseSchema,
	getRepositoriesPullrequestsActivity: BitbucketResponseSchema,
	getRawFileContent: z.string(),
	getRepositoriesSrc: BitbucketResponseSchema,
	getRepository: BitbucketResponseSchema,
	getRepositoriesPipelinesConfigSshKnownHosts: BitbucketResponseSchema,
	getRepositoriesPipelinesConfigRunners: BitbucketResponseSchema,
	getRepositoriesPipelinesConfigSchedules: BitbucketResponseSchema,
	getRepositoriesPipelinesConfigVariables: BitbucketResponseSchema,
	getRepositoriesPipelinesConfigCaches: BitbucketResponseSchema,
	getRepositoriesRefs: BitbucketResponseSchema,
	getRepositoriesWatchers: BitbucketResponseSchema,
	getSnippet: BitbucketResponseSchema,
	getSnippetsWatch: BitbucketResponseSchema,
	getRepositoriesPipelines2: BitbucketResponseSchema,
	getRepositoriesRefsTags: BitbucketResponseSchema,
	getUser: BitbucketResponseSchema,
	getUserEmails2: BitbucketResponseSchema,
	getUserEmails: BitbucketResponseSchema,
	getUserPermissionsRepositories: BitbucketResponseSchema,
	getUserPermissionsWorkspaces: BitbucketResponseSchema,
	getUserWorkspaces: BitbucketResponseSchema,
	getWorkspace: BitbucketResponseSchema,
	listRepositories: BitbucketResponseSchema,
	listBranches: BitbucketResponseSchema,
	listCommits: BitbucketResponseSchema,
	listCommitsFromRevision: BitbucketResponseSchema,
	createRepositoriesCommits2: BitbucketResponseSchema,
	listCommitsOnMaster: BitbucketResponseSchema,
	listDeployments: BitbucketResponseSchema,
	listIssues: BitbucketResponseSchema,
	listPipelines: BitbucketResponseSchema,
	listPullRequestTasks: BitbucketResponseSchema,
	listPullRequests: BitbucketResponseSchema,
	listRepositoriesInWorkspace: BitbucketResponseSchema,
	listRepositoriesEnvironments: BitbucketResponseSchema,
	listRepositoryPaths: BitbucketResponseSchema,
	listSnippets: BitbucketResponseSchema,
	listTags: BitbucketResponseSchema,
	listVersions: BitbucketResponseSchema,
	listWorkspaceMembers: BitbucketResponseSchema,
	listWorkspaceProjects: BitbucketResponseSchema,
	listWorkspaces: BitbucketResponseSchema,
	requestPullRequestChanges: BitbucketResponseSchema,
	searchTeamCode: BitbucketResponseSchema,
	searchUserRepositoriesCode: BitbucketResponseSchema,
	getWorkspacesSearchCode: BitbucketResponseSchema,
	updateIssue: BitbucketResponseSchema,
	updateRepositoriesCommitComments: BitbucketResponseSchema,
	updateInsightsProjectsReposCommitsReports: BitbucketResponseSchema,
	updateRepositoriesCommitReportsAnnotations: BitbucketResponseSchema,
	updateTeamsPipelinesConfigVariables: BitbucketResponseSchema,
	updateUsersPipelinesConfigVariables: BitbucketResponseSchema,
} as const;
export type BitbucketEndpointInputs = {
	[K in keyof typeof BitbucketEndpointInputSchemas]: z.infer<
		(typeof BitbucketEndpointInputSchemas)[K]
	>;
};
export type BitbucketEndpointOutputs = {
	[K in keyof typeof BitbucketEndpointOutputSchemas]: z.infer<
		(typeof BitbucketEndpointOutputSchemas)[K]
	>;
};
