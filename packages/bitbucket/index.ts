import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { BITBUCKET_AUTH_URL, BITBUCKET_TOKEN_URL } from './client';
import { BitbucketEndpoints } from './endpoints';
import {
	BitbucketEndpointInputSchemas,
	BitbucketEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BitbucketSchema } from './schema';

const bitbucketEndpointsNested = BitbucketEndpoints;
export const bitbucketAuthConfig = {
	oauth_2: { account: ['account_id'] as const },
} as const satisfies PluginAuthConfig;
export type BitbucketPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalBitbucketPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bitbucketEndpointsNested>;
	/**
	 * OAuth scopes requested during authorization. Defaults to
	 * `defaultBitbucketScopes`, which covers every operation in the catalog;
	 * narrow it to only the scopes the operations you actually call need.
	 */
	scopes?: readonly string[];
};
export type BitbucketContext = CorsairPluginContext<
	typeof BitbucketSchema,
	BitbucketPluginOptions,
	undefined,
	typeof bitbucketAuthConfig
>;
export type BitbucketKeyBuilderContext =
	KeyBuilderContext<BitbucketPluginOptions>;
export type BitbucketBoundEndpoints = BindEndpoints<
	typeof bitbucketEndpointsNested
>;
export const bitbucketEndpointSchemas = {
	'pullRequests.approvePullRequest': {
		input: BitbucketEndpointInputSchemas.approvePullRequest,
		output: BitbucketEndpointOutputSchemas.approvePullRequest,
	},
	'sourceAndRefs.browseRepositoryPath': {
		input: BitbucketEndpointInputSchemas.browseRepositoryPath,
		output: BitbucketEndpointOutputSchemas.browseRepositoryPath,
	},
	'issues.getRepositoriesIssuesVote': {
		input: BitbucketEndpointInputSchemas.getRepositoriesIssuesVote,
		output: BitbucketEndpointOutputSchemas.getRepositoriesIssuesVote,
	},
	'sourceAndRefs.createBranch': {
		input: BitbucketEndpointInputSchemas.createBranch,
		output: BitbucketEndpointOutputSchemas.createBranch,
	},
	'pullRequests.createPullRequest': {
		input: BitbucketEndpointInputSchemas.createPullRequest,
		output: BitbucketEndpointOutputSchemas.createPullRequest,
	},
	'issues.createIssue': {
		input: BitbucketEndpointInputSchemas.createIssue,
		output: BitbucketEndpointOutputSchemas.createIssue,
	},
	'issues.createIssueComment': {
		input: BitbucketEndpointInputSchemas.createIssueComment,
		output: BitbucketEndpointOutputSchemas.createIssueComment,
	},
	'commitsAndInsights.createRepositoriesCommitReportsAnnotations': {
		input:
			BitbucketEndpointInputSchemas.createRepositoriesCommitReportsAnnotations,
		output:
			BitbucketEndpointOutputSchemas.createRepositoriesCommitReportsAnnotations,
	},
	'pullRequests.createPullRequestComment': {
		input: BitbucketEndpointInputSchemas.createPullRequestComment,
		output: BitbucketEndpointOutputSchemas.createPullRequestComment,
	},
	'repositories.createRepository': {
		input: BitbucketEndpointInputSchemas.createRepository,
		output: BitbucketEndpointOutputSchemas.createRepository,
	},
	'snippets.createSnippetComment': {
		input: BitbucketEndpointInputSchemas.createSnippetComment,
		output: BitbucketEndpointOutputSchemas.createSnippetComment,
	},
	'pipelinesAndDeployments.createTeamsPipelinesConfigVariables': {
		input: BitbucketEndpointInputSchemas.createTeamsPipelinesConfigVariables,
		output: BitbucketEndpointOutputSchemas.createTeamsPipelinesConfigVariables,
	},
	'pipelinesAndDeployments.createUsersPipelinesConfigVariables': {
		input: BitbucketEndpointInputSchemas.createUsersPipelinesConfigVariables,
		output: BitbucketEndpointOutputSchemas.createUsersPipelinesConfigVariables,
	},
	'commitsAndInsights.deleteCommitComment': {
		input: BitbucketEndpointInputSchemas.deleteCommitComment,
		output: BitbucketEndpointOutputSchemas.deleteCommitComment,
	},
	'commitsAndInsights.deleteRepositoriesCommitReportsAnnotations': {
		input:
			BitbucketEndpointInputSchemas.deleteRepositoriesCommitReportsAnnotations,
		output:
			BitbucketEndpointOutputSchemas.deleteRepositoriesCommitReportsAnnotations,
	},
	'issues.deleteIssue': {
		input: BitbucketEndpointInputSchemas.deleteIssue,
		output: BitbucketEndpointOutputSchemas.deleteIssue,
	},
	'repositories.deleteRepository': {
		input: BitbucketEndpointInputSchemas.deleteRepository,
		output: BitbucketEndpointOutputSchemas.deleteRepository,
	},
	'snippets.deleteSnippetsWatch': {
		input: BitbucketEndpointInputSchemas.deleteSnippetsWatch,
		output: BitbucketEndpointOutputSchemas.deleteSnippetsWatch,
	},
	'pipelinesAndDeployments.deleteUserPipelineVariable': {
		input: BitbucketEndpointInputSchemas.deleteUserPipelineVariable,
		output: BitbucketEndpointOutputSchemas.deleteUserPipelineVariable,
	},
	'commitsAndInsights.getCommitBuildStatus': {
		input: BitbucketEndpointInputSchemas.getCommitBuildStatus,
		output: BitbucketEndpointOutputSchemas.getCommitBuildStatus,
	},
	'commitsAndInsights.getCommitChanges': {
		input: BitbucketEndpointInputSchemas.getCommitChanges,
		output: BitbucketEndpointOutputSchemas.getCommitChanges,
	},
	'commitsAndInsights.getCommitDiff': {
		input: BitbucketEndpointInputSchemas.getCommitDiff,
		output: BitbucketEndpointOutputSchemas.getCommitDiff,
	},
	'commitsAndInsights.getRepositoriesCommitReports': {
		input: BitbucketEndpointInputSchemas.getRepositoriesCommitReports,
		output: BitbucketEndpointOutputSchemas.getRepositoriesCommitReports,
	},
	'pipelinesAndDeployments.getOpenidConfiguration': {
		input: BitbucketEndpointInputSchemas.getOpenidConfiguration,
		output: BitbucketEndpointOutputSchemas.getOpenidConfiguration,
	},
	'pullRequests.getPullRequest': {
		input: BitbucketEndpointInputSchemas.getPullRequest,
		output: BitbucketEndpointOutputSchemas.getPullRequest,
	},
	'pullRequests.getPullRequestCommits': {
		input: BitbucketEndpointInputSchemas.getPullRequestCommits,
		output: BitbucketEndpointOutputSchemas.getPullRequestCommits,
	},
	'pullRequests.getPullRequestDiff': {
		input: BitbucketEndpointInputSchemas.getPullRequestDiff,
		output: BitbucketEndpointOutputSchemas.getPullRequestDiff,
	},
	'pullRequests.getPullRequestDiffstat': {
		input: BitbucketEndpointInputSchemas.getPullRequestDiffstat,
		output: BitbucketEndpointOutputSchemas.getPullRequestDiffstat,
	},
	'commitsAndInsights.getRepositoriesMergeBase': {
		input: BitbucketEndpointInputSchemas.getRepositoriesMergeBase,
		output: BitbucketEndpointOutputSchemas.getRepositoriesMergeBase,
	},
	'sourceAndRefs.getRepositoriesBranchingModel': {
		input: BitbucketEndpointInputSchemas.getRepositoriesBranchingModel,
		output: BitbucketEndpointOutputSchemas.getRepositoriesBranchingModel,
	},
	'commitsAndInsights.getRepositoriesCommit': {
		input: BitbucketEndpointInputSchemas.getRepositoriesCommit,
		output: BitbucketEndpointOutputSchemas.getRepositoriesCommit,
	},
	'pipelinesAndDeployments.getRepositoriesEnvironments2': {
		input: BitbucketEndpointInputSchemas.getRepositoriesEnvironments2,
		output: BitbucketEndpointOutputSchemas.getRepositoriesEnvironments2,
	},
	'commitsAndInsights.getRepositoryPatch': {
		input: BitbucketEndpointInputSchemas.getRepositoryPatch,
		output: BitbucketEndpointOutputSchemas.getRepositoryPatch,
	},
	'usersAndPermissions.getSshLatestKeys': {
		input: BitbucketEndpointInputSchemas.getSshLatestKeys,
		output: BitbucketEndpointOutputSchemas.getSshLatestKeys,
	},
	'workspacesAndProjects.getWorkspacesPullrequests': {
		input: BitbucketEndpointInputSchemas.getWorkspacesPullrequests,
		output: BitbucketEndpointOutputSchemas.getWorkspacesPullrequests,
	},
	'sourceAndRefs.getBranch': {
		input: BitbucketEndpointInputSchemas.getBranch,
		output: BitbucketEndpointOutputSchemas.getBranch,
	},
	'commitsAndInsights.getCommitComment': {
		input: BitbucketEndpointInputSchemas.getCommitComment,
		output: BitbucketEndpointOutputSchemas.getCommitComment,
	},
	'commitsAndInsights.getRepositoriesCommitComments': {
		input: BitbucketEndpointInputSchemas.getRepositoriesCommitComments,
		output: BitbucketEndpointOutputSchemas.getRepositoriesCommitComments,
	},
	'commitsAndInsights.getRepositoriesCommitReport': {
		input: BitbucketEndpointInputSchemas.getRepositoriesCommitReport,
		output: BitbucketEndpointOutputSchemas.getRepositoriesCommitReport,
	},
	'commitsAndInsights.getRepositoriesCommitReportsAnnotations': {
		input:
			BitbucketEndpointInputSchemas.getRepositoriesCommitReportsAnnotations,
		output:
			BitbucketEndpointOutputSchemas.getRepositoriesCommitReportsAnnotations,
	},
	'commitsAndInsights.getRepositoriesCommitStatuses': {
		input: BitbucketEndpointInputSchemas.getRepositoriesCommitStatuses,
		output: BitbucketEndpointOutputSchemas.getRepositoriesCommitStatuses,
	},
	'usersAndPermissions.getCurrentUser2': {
		input: BitbucketEndpointInputSchemas.getCurrentUser2,
		output: BitbucketEndpointOutputSchemas.getCurrentUser2,
	},
	'pipelinesAndDeployments.getDeploymentEnvironmentVariables': {
		input: BitbucketEndpointInputSchemas.getDeploymentEnvironmentVariables,
		output: BitbucketEndpointOutputSchemas.getDeploymentEnvironmentVariables,
	},
	'sourceAndRefs.getRepositoriesEffectiveBranchingModel': {
		input: BitbucketEndpointInputSchemas.getRepositoriesEffectiveBranchingModel,
		output:
			BitbucketEndpointOutputSchemas.getRepositoriesEffectiveBranchingModel,
	},
	'sourceAndRefs.getRepositoriesFilehistory': {
		input: BitbucketEndpointInputSchemas.getRepositoriesFilehistory,
		output: BitbucketEndpointOutputSchemas.getRepositoriesFilehistory,
	},
	'sourceAndRefs.getFileFromRepository': {
		input: BitbucketEndpointInputSchemas.getFileFromRepository,
		output: BitbucketEndpointOutputSchemas.getFileFromRepository,
	},
	'searchAndDiscovery.getHookEvents': {
		input: BitbucketEndpointInputSchemas.getHookEvents,
		output: BitbucketEndpointOutputSchemas.getHookEvents,
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesSteps': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPipelinesSteps,
		output: BitbucketEndpointOutputSchemas.getRepositoriesPipelinesSteps,
	},
	'workspacesAndProjects.getProjectsRepos': {
		input: BitbucketEndpointInputSchemas.getProjectsRepos,
		output: BitbucketEndpointOutputSchemas.getProjectsRepos,
	},
	'pullRequests.getPullRequestComment': {
		input: BitbucketEndpointInputSchemas.getPullRequestComment,
		output: BitbucketEndpointOutputSchemas.getPullRequestComment,
	},
	'pullRequests.getRepositoriesPullrequestsComments': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPullrequestsComments,
		output: BitbucketEndpointOutputSchemas.getRepositoriesPullrequestsComments,
	},
	'pullRequests.getRepositoriesPullrequestsStatuses': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPullrequestsStatuses,
		output: BitbucketEndpointOutputSchemas.getRepositoriesPullrequestsStatuses,
	},
	'pullRequests.getRepositoriesPullrequestsActivity': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPullrequestsActivity,
		output: BitbucketEndpointOutputSchemas.getRepositoriesPullrequestsActivity,
	},
	'sourceAndRefs.getRawFileContent': {
		input: BitbucketEndpointInputSchemas.getRawFileContent,
		output: BitbucketEndpointOutputSchemas.getRawFileContent,
	},
	'sourceAndRefs.getRepositoriesSrc': {
		input: BitbucketEndpointInputSchemas.getRepositoriesSrc,
		output: BitbucketEndpointOutputSchemas.getRepositoriesSrc,
	},
	'repositories.getRepository': {
		input: BitbucketEndpointInputSchemas.getRepository,
		output: BitbucketEndpointOutputSchemas.getRepository,
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigSshKnownHosts': {
		input:
			BitbucketEndpointInputSchemas.getRepositoriesPipelinesConfigSshKnownHosts,
		output:
			BitbucketEndpointOutputSchemas.getRepositoriesPipelinesConfigSshKnownHosts,
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigRunners': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPipelinesConfigRunners,
		output:
			BitbucketEndpointOutputSchemas.getRepositoriesPipelinesConfigRunners,
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigSchedules': {
		input:
			BitbucketEndpointInputSchemas.getRepositoriesPipelinesConfigSchedules,
		output:
			BitbucketEndpointOutputSchemas.getRepositoriesPipelinesConfigSchedules,
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigVariables': {
		input:
			BitbucketEndpointInputSchemas.getRepositoriesPipelinesConfigVariables,
		output:
			BitbucketEndpointOutputSchemas.getRepositoriesPipelinesConfigVariables,
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigCaches': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPipelinesConfigCaches,
		output: BitbucketEndpointOutputSchemas.getRepositoriesPipelinesConfigCaches,
	},
	'sourceAndRefs.getRepositoriesRefs': {
		input: BitbucketEndpointInputSchemas.getRepositoriesRefs,
		output: BitbucketEndpointOutputSchemas.getRepositoriesRefs,
	},
	'repositories.getRepositoriesWatchers': {
		input: BitbucketEndpointInputSchemas.getRepositoriesWatchers,
		output: BitbucketEndpointOutputSchemas.getRepositoriesWatchers,
	},
	'snippets.getSnippet': {
		input: BitbucketEndpointInputSchemas.getSnippet,
		output: BitbucketEndpointOutputSchemas.getSnippet,
	},
	'snippets.getSnippetsWatch': {
		input: BitbucketEndpointInputSchemas.getSnippetsWatch,
		output: BitbucketEndpointOutputSchemas.getSnippetsWatch,
	},
	'pipelinesAndDeployments.getRepositoriesPipelines2': {
		input: BitbucketEndpointInputSchemas.getRepositoriesPipelines2,
		output: BitbucketEndpointOutputSchemas.getRepositoriesPipelines2,
	},
	'sourceAndRefs.getRepositoriesRefsTags': {
		input: BitbucketEndpointInputSchemas.getRepositoriesRefsTags,
		output: BitbucketEndpointOutputSchemas.getRepositoriesRefsTags,
	},
	'usersAndPermissions.getUser': {
		input: BitbucketEndpointInputSchemas.getUser,
		output: BitbucketEndpointOutputSchemas.getUser,
	},
	'usersAndPermissions.getUserEmails2': {
		input: BitbucketEndpointInputSchemas.getUserEmails2,
		output: BitbucketEndpointOutputSchemas.getUserEmails2,
	},
	'usersAndPermissions.getUserEmails': {
		input: BitbucketEndpointInputSchemas.getUserEmails,
		output: BitbucketEndpointOutputSchemas.getUserEmails,
	},
	'usersAndPermissions.getUserPermissionsRepositories': {
		input: BitbucketEndpointInputSchemas.getUserPermissionsRepositories,
		output: BitbucketEndpointOutputSchemas.getUserPermissionsRepositories,
	},
	'usersAndPermissions.getUserPermissionsWorkspaces': {
		input: BitbucketEndpointInputSchemas.getUserPermissionsWorkspaces,
		output: BitbucketEndpointOutputSchemas.getUserPermissionsWorkspaces,
	},
	'usersAndPermissions.getUserWorkspaces': {
		input: BitbucketEndpointInputSchemas.getUserWorkspaces,
		output: BitbucketEndpointOutputSchemas.getUserWorkspaces,
	},
	'workspacesAndProjects.getWorkspace': {
		input: BitbucketEndpointInputSchemas.getWorkspace,
		output: BitbucketEndpointOutputSchemas.getWorkspace,
	},
	'repositories.listRepositories': {
		input: BitbucketEndpointInputSchemas.listRepositories,
		output: BitbucketEndpointOutputSchemas.listRepositories,
	},
	'sourceAndRefs.listBranches': {
		input: BitbucketEndpointInputSchemas.listBranches,
		output: BitbucketEndpointOutputSchemas.listBranches,
	},
	'commitsAndInsights.listCommits': {
		input: BitbucketEndpointInputSchemas.listCommits,
		output: BitbucketEndpointOutputSchemas.listCommits,
	},
	'commitsAndInsights.listCommitsFromRevision': {
		input: BitbucketEndpointInputSchemas.listCommitsFromRevision,
		output: BitbucketEndpointOutputSchemas.listCommitsFromRevision,
	},
	'commitsAndInsights.createRepositoriesCommits2': {
		input: BitbucketEndpointInputSchemas.createRepositoriesCommits2,
		output: BitbucketEndpointOutputSchemas.createRepositoriesCommits2,
	},
	'commitsAndInsights.listCommitsOnMaster': {
		input: BitbucketEndpointInputSchemas.listCommitsOnMaster,
		output: BitbucketEndpointOutputSchemas.listCommitsOnMaster,
	},
	'pipelinesAndDeployments.listDeployments': {
		input: BitbucketEndpointInputSchemas.listDeployments,
		output: BitbucketEndpointOutputSchemas.listDeployments,
	},
	'issues.listIssues': {
		input: BitbucketEndpointInputSchemas.listIssues,
		output: BitbucketEndpointOutputSchemas.listIssues,
	},
	'pipelinesAndDeployments.listPipelines': {
		input: BitbucketEndpointInputSchemas.listPipelines,
		output: BitbucketEndpointOutputSchemas.listPipelines,
	},
	'pullRequests.listPullRequestTasks': {
		input: BitbucketEndpointInputSchemas.listPullRequestTasks,
		output: BitbucketEndpointOutputSchemas.listPullRequestTasks,
	},
	'pullRequests.listPullRequests': {
		input: BitbucketEndpointInputSchemas.listPullRequests,
		output: BitbucketEndpointOutputSchemas.listPullRequests,
	},
	'repositories.listRepositoriesInWorkspace': {
		input: BitbucketEndpointInputSchemas.listRepositoriesInWorkspace,
		output: BitbucketEndpointOutputSchemas.listRepositoriesInWorkspace,
	},
	'pipelinesAndDeployments.listRepositoriesEnvironments': {
		input: BitbucketEndpointInputSchemas.listRepositoriesEnvironments,
		output: BitbucketEndpointOutputSchemas.listRepositoriesEnvironments,
	},
	'sourceAndRefs.listRepositoryPaths': {
		input: BitbucketEndpointInputSchemas.listRepositoryPaths,
		output: BitbucketEndpointOutputSchemas.listRepositoryPaths,
	},
	'snippets.listSnippets': {
		input: BitbucketEndpointInputSchemas.listSnippets,
		output: BitbucketEndpointOutputSchemas.listSnippets,
	},
	'sourceAndRefs.listTags': {
		input: BitbucketEndpointInputSchemas.listTags,
		output: BitbucketEndpointOutputSchemas.listTags,
	},
	'issues.listVersions': {
		input: BitbucketEndpointInputSchemas.listVersions,
		output: BitbucketEndpointOutputSchemas.listVersions,
	},
	'workspacesAndProjects.listWorkspaceMembers': {
		input: BitbucketEndpointInputSchemas.listWorkspaceMembers,
		output: BitbucketEndpointOutputSchemas.listWorkspaceMembers,
	},
	'workspacesAndProjects.listWorkspaceProjects': {
		input: BitbucketEndpointInputSchemas.listWorkspaceProjects,
		output: BitbucketEndpointOutputSchemas.listWorkspaceProjects,
	},
	'workspacesAndProjects.listWorkspaces': {
		input: BitbucketEndpointInputSchemas.listWorkspaces,
		output: BitbucketEndpointOutputSchemas.listWorkspaces,
	},
	'pullRequests.requestPullRequestChanges': {
		input: BitbucketEndpointInputSchemas.requestPullRequestChanges,
		output: BitbucketEndpointOutputSchemas.requestPullRequestChanges,
	},
	'searchAndDiscovery.searchTeamCode': {
		input: BitbucketEndpointInputSchemas.searchTeamCode,
		output: BitbucketEndpointOutputSchemas.searchTeamCode,
	},
	'searchAndDiscovery.searchUserRepositoriesCode': {
		input: BitbucketEndpointInputSchemas.searchUserRepositoriesCode,
		output: BitbucketEndpointOutputSchemas.searchUserRepositoriesCode,
	},
	'searchAndDiscovery.getWorkspacesSearchCode': {
		input: BitbucketEndpointInputSchemas.getWorkspacesSearchCode,
		output: BitbucketEndpointOutputSchemas.getWorkspacesSearchCode,
	},
	'issues.updateIssue': {
		input: BitbucketEndpointInputSchemas.updateIssue,
		output: BitbucketEndpointOutputSchemas.updateIssue,
	},
	'commitsAndInsights.updateRepositoriesCommitComments': {
		input: BitbucketEndpointInputSchemas.updateRepositoriesCommitComments,
		output: BitbucketEndpointOutputSchemas.updateRepositoriesCommitComments,
	},
	'commitsAndInsights.updateInsightsProjectsReposCommitsReports': {
		input:
			BitbucketEndpointInputSchemas.updateInsightsProjectsReposCommitsReports,
		output:
			BitbucketEndpointOutputSchemas.updateInsightsProjectsReposCommitsReports,
	},
	'commitsAndInsights.updateRepositoriesCommitReportsAnnotations': {
		input:
			BitbucketEndpointInputSchemas.updateRepositoriesCommitReportsAnnotations,
		output:
			BitbucketEndpointOutputSchemas.updateRepositoriesCommitReportsAnnotations,
	},
	'pipelinesAndDeployments.updateTeamsPipelinesConfigVariables': {
		input: BitbucketEndpointInputSchemas.updateTeamsPipelinesConfigVariables,
		output: BitbucketEndpointOutputSchemas.updateTeamsPipelinesConfigVariables,
	},
	'pipelinesAndDeployments.updateUsersPipelinesConfigVariables': {
		input: BitbucketEndpointInputSchemas.updateUsersPipelinesConfigVariables,
		output: BitbucketEndpointOutputSchemas.updateUsersPipelinesConfigVariables,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bitbucketEndpointsNested
>;
const bitbucketEndpointMeta = {
	'pullRequests.approvePullRequest': {
		riskLevel: 'write',
		description:
			'Tool to approve a pull request as the authenticated user. Use when you need to formally approve changes in a pull request review process.',
	},
	'sourceAndRefs.browseRepositoryPath': {
		riskLevel: 'read',
		description:
			'Tool to retrieve content for a file path or browse directory contents at a specified revision in a Bitbucket repository. Use when you need flexible access to repository content - returns raw file data for files or paginated directory listings for directories.',
	},
	'issues.getRepositoriesIssuesVote': {
		riskLevel: 'read',
		description:
			'Tool to check whether the authenticated user has voted for a specific issue in a Bitbucket repository. Use when you need to verify if the current user has already voted on an issue before attempting to vote or unvote.',
	},
	'sourceAndRefs.createBranch': {
		riskLevel: 'write',
		description:
			"Creates a new branch in a Bitbucket repository from a target commit hash; the branch name must be unique, adhere to Bitbucket's naming conventions, and not include the 'refs/heads/' prefix.",
	},
	'pullRequests.createPullRequest': {
		riskLevel: 'write',
		description:
			'Creates a new pull request in a specified Bitbucket repository, ensuring the source branch exists and is distinct from the (optional) destination branch.',
	},
	'issues.createIssue': {
		riskLevel: 'write',
		description:
			'Creates a new issue in a Bitbucket repository, setting the authenticated user as reporter; ensures assignee (if provided) has repository access, and that any specified milestone, version, or component IDs exist.',
	},
	'issues.createIssueComment': {
		riskLevel: 'write',
		description:
			'Adds a new comment with markdown support to an existing Bitbucket issue.',
	},
	'commitsAndInsights.createRepositoriesCommitReportsAnnotations': {
		riskLevel: 'write',
		description:
			'Adds multiple annotations to a commit report in bulk. Use when you need to add code analysis findings (vulnerabilities, code smells, bugs) to a report attached to a specific commit.',
	},
	'pullRequests.createPullRequestComment': {
		riskLevel: 'write',
		description:
			'Creates a new comment on a Bitbucket pull request. Supports top-level comments, threaded replies, and inline code comments. Use when providing feedback on a PR, replying to existing comments, or commenting on specific code lines.',
	},
	'repositories.createRepository': {
		riskLevel: 'write',
		description:
			"Creates a new Bitbucket 'git' repository in a specified workspace, defaulting to the workspace's oldest project if `project_key` is not provided.",
	},
	'snippets.createSnippetComment': {
		riskLevel: 'write',
		description:
			'Posts a new top-level comment or a threaded reply to an existing comment on a specified Bitbucket snippet.',
	},
	'pipelinesAndDeployments.createTeamsPipelinesConfigVariables': {
		riskLevel: 'write',
		description:
			'Creates a team-level pipeline configuration variable in Bitbucket. Use when you need to add environment variables or configuration values that should be available to all pipelines within a team.',
	},
	'pipelinesAndDeployments.createUsersPipelinesConfigVariables': {
		riskLevel: 'write',
		description:
			'Creates a user-level pipeline variable for Bitbucket pipelines. Use when you need to create account-level configuration variables that can be used across all repositories owned by the user.',
	},
	'commitsAndInsights.deleteCommitComment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently deletes a specific comment on a commit. Use when removing outdated, incorrect, or unwanted feedback on a commit.',
	},
	'commitsAndInsights.deleteRepositoriesCommitReportsAnnotations': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a single annotation matching the provided ID from a commit report. Use when you need to remove a specific annotation from a code analysis report.',
	},
	'issues.deleteIssue': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently deletes a specific issue, identified by its `issue_id`, from the repository specified by `repo_slug` within the given `workspace`.',
	},
	'repositories.deleteRepository': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently deletes a specified Bitbucket repository; this action is irreversible and does not affect forks.',
	},
	'snippets.deleteSnippetsWatch': {
		riskLevel: 'write',
		description:
			'Stops watching a specific snippet. Use when you want to unsubscribe from notifications for a snippet.',
	},
	'pipelinesAndDeployments.deleteUserPipelineVariable': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently deletes a user-level pipeline configuration variable identified by its UUID. Use this to remove pipeline variables that are no longer needed at the account level.',
	},
	'commitsAndInsights.getCommitBuildStatus': {
		riskLevel: 'read',
		description:
			'Get a specific build status for a commit in Bitbucket. Use when you need to check the status of a particular build/CI run for a commit.',
	},
	'commitsAndInsights.getCommitChanges': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a page of changes made in a specified commit, showing all changed files with their change statistics (lines added/removed, status). Use when you need to enumerate files modified in a specific commit or commit range.',
	},
	'commitsAndInsights.getCommitDiff': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the unified diff between two provided revisions or for a single commit in a Bitbucket repository. Use when you need to see the actual code changes in a commit or between two commits. Supports filtering by file path and various diff options.',
	},
	'commitsAndInsights.getRepositoriesCommitReports': {
		riskLevel: 'read',
		description:
			'Tool to get reports linked to a specific commit. Use when you need to retrieve analysis results, test reports, security scans, or code coverage data associated with a commit.',
	},
	'pipelinesAndDeployments.getOpenidConfiguration': {
		riskLevel: 'read',
		description:
			'Retrieves the OpenID Connect discovery configuration for Bitbucket Pipelines OIDC. Use when integrating Bitbucket Pipelines with resource servers (AWS, GCP, Vault) using OpenID Connect authentication. Returns issuer URL, JWKS URI, and supported capabilities.',
	},
	'pullRequests.getPullRequest': {
		riskLevel: 'read',
		description: 'Get a single pull request by ID with complete details.',
	},
	'pullRequests.getPullRequestCommits': {
		riskLevel: 'read',
		description:
			'Tool to retrieve commits for a specified pull request. Use when reviewing the commit history of a PR or analyzing changes included in a pull request.',
	},
	'pullRequests.getPullRequestDiff': {
		riskLevel: 'read',
		description:
			'Tool to fetch the unified diff for a Bitbucket pull request (follows 302 redirect to repository diff). Use when reviewing code changes in a PR. Supports optional truncation for large diffs via max_chars parameter.',
	},
	'pullRequests.getPullRequestDiffstat': {
		riskLevel: 'read',
		description:
			'Tool to get the diffstat for a Bitbucket pull request, showing all changed files with their change statistics (lines added/removed, status). Use when you need to enumerate files modified in a PR.',
	},
	'commitsAndInsights.getRepositoriesMergeBase': {
		riskLevel: 'read',
		description:
			'Get the merge base (best common ancestor) between two commits in a Bitbucket repository. Use when you need to find the common ancestor commit between two branches or commits for comparison or merge operations.',
	},
	'sourceAndRefs.getRepositoriesBranchingModel': {
		riskLevel: 'read',
		description:
			"Return the branching model as applied to the repository. Use when you need to understand the repository's branch workflow configuration, including development/production branches and branch type prefixes.",
	},
	'commitsAndInsights.getRepositoriesCommit': {
		riskLevel: 'read',
		description:
			'Tool to retrieve detailed information about a specific commit in a Bitbucket repository. Use when you need to get complete commit details including author, message, date, parents, and related links.',
	},
	'pipelinesAndDeployments.getRepositoriesEnvironments2': {
		riskLevel: 'read',
		description:
			'Retrieve detailed information about a specific deployment environment in a Bitbucket repository. Use when you need to get environment configuration, deployment settings, or check environment properties like locks and restrictions.',
	},
	'commitsAndInsights.getRepositoryPatch': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the git patch content for a Bitbucket repository at a specified revision or commit range. Use when you need to review code changes, generate diffs, or analyze modifications between commits. Returns raw patch in unified diff format.',
	},
	'usersAndPermissions.getSshLatestKeys': {
		riskLevel: 'read',
		description:
			'Retrieves a paginated list of SSH keys for a specified Bitbucket user. Use when you need to view or audit SSH keys configured for a user account.',
	},
	'workspacesAndProjects.getWorkspacesPullrequests': {
		riskLevel: 'read',
		description:
			'Tool to get all workspace pull requests authored by a specified user. Use when you need to retrieve pull requests created by a specific user across all repositories in a workspace.',
	},
	'sourceAndRefs.getBranch': {
		riskLevel: 'read',
		description:
			'Retrieves detailed information about a specific branch in a Bitbucket repository. Use when you need to get branch metadata, the commit it points to, or verify a branch exists.',
	},
	'commitsAndInsights.getCommitComment': {
		riskLevel: 'read',
		description:
			'Retrieves a specific comment from a commit by its ID. Use when you need to fetch details of a particular commit comment including content, author, timestamps, and inline location.',
	},
	'commitsAndInsights.getRepositoriesCommitComments': {
		riskLevel: 'read',
		description:
			'Retrieves all comments on a specific commit in a Bitbucket repository. Returns both global and inline code comments. Use when you need to view feedback, discussions, or notes left on a specific commit.',
	},
	'commitsAndInsights.getRepositoriesCommitReport': {
		riskLevel: 'read',
		description:
			'Returns a single report matching the provided ID from a commit. Use when you need to retrieve details of a specific analysis report (e.g., security scan, code coverage, test results, or bug report) for a commit.',
	},
	'commitsAndInsights.getRepositoriesCommitReportsAnnotations': {
		riskLevel: 'read',
		description:
			'Returns a single annotation matching the provided ID from a commit report. Use when you need to retrieve details of a specific code analysis finding (e.g., vulnerability, code smell, or bug) identified in a commit.',
	},
	'commitsAndInsights.getRepositoriesCommitStatuses': {
		riskLevel: 'read',
		description:
			'Returns all build statuses (e.g., CI/CD pipeline results) for a specific commit. Use when you need to check build status, verify test results, or monitor deployment pipelines for a particular commit.',
	},
	'usersAndPermissions.getCurrentUser2': {
		riskLevel: 'read',
		description:
			'Tool to retrieve complete profile information for the currently authenticated Bitbucket user. Use when you need comprehensive user details including account_id, username, nickname, and other profile fields.',
	},
	'pipelinesAndDeployments.getDeploymentEnvironmentVariables': {
		riskLevel: 'read',
		description:
			'Retrieves deployment environment level variables for a specific Bitbucket repository environment. Use when you need to view or audit environment-specific configuration variables for deployments.',
	},
	'sourceAndRefs.getRepositoriesEffectiveBranchingModel': {
		riskLevel: 'read',
		description:
			"Retrieves the effective branching model for a Bitbucket repository, showing which branching model is currently applied (including any inheritance from project-level settings). Use when you need to understand the repository's branch workflow configuration, including development and production branches and branch type prefixes.",
	},
	'sourceAndRefs.getRepositoriesFilehistory': {
		riskLevel: 'read',
		description:
			'Returns a paginated list of commits that modified the specified file. Use when you need to track file changes over time, find who modified a file, or determine when a file was created or last changed.',
	},
	'sourceAndRefs.getFileFromRepository': {
		riskLevel: 'read',
		description:
			"Retrieves a specific file's content from a Bitbucket repository at a given commit (hash, branch, or tag), failing if the file path is invalid for that commit.",
	},
	'searchAndDiscovery.getHookEvents': {
		riskLevel: 'read',
		description:
			'Retrieves a paginated list of all valid webhook events for a specified entity type (repository or workspace). Use when you need to discover available webhook event types for subscription or webhook configuration.',
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesSteps': {
		riskLevel: 'read',
		description:
			'Retrieves all steps for a given pipeline. Use when you need to inspect the individual steps of a pipeline execution, including their state, duration, and commands.',
	},
	'workspacesAndProjects.getProjectsRepos': {
		riskLevel: 'read',
		description:
			'Retrieves repositories from a project in a Bitbucket workspace. Use when you need to list all repositories belonging to a specific project key within a workspace.',
	},
	'pullRequests.getPullRequestComment': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific comment from a pull request by its ID. Use when you need to fetch details of a particular pull request comment including content, author, timestamps, and inline location.',
	},
	'pullRequests.getRepositoriesPullrequestsComments': {
		riskLevel: 'read',
		description:
			'Retrieves a paginated list of comments on a specific pull request in a Bitbucket repository. Returns global, inline, and threaded comments. Use when you need to view feedback, discussions, or reviews left on a pull request.',
	},
	'pullRequests.getRepositoriesPullrequestsStatuses': {
		riskLevel: 'read',
		description:
			'Returns all build statuses (e.g., CI/CD pipeline results) for a specific pull request. Use when you need to check build status, verify test results, or monitor deployment pipelines for a pull request.',
	},
	'pullRequests.getRepositoriesPullrequestsActivity': {
		riskLevel: 'read',
		description:
			'Get paginated activity log for all pull requests in a repository. Returns comments, updates, approvals, and request changes. Use when you need to track pull request activity history.',
	},
	'sourceAndRefs.getRawFileContent': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the raw content of a file from a Bitbucket repository at a specified commit, branch, or tag. Use when you need to read file contents from a specific revision.',
	},
	'sourceAndRefs.getRepositoriesSrc': {
		riskLevel: 'read',
		description:
			"Lists the contents of the root directory on the repository's main branch without needing to specify a commit or branch. This endpoint redirects to the main branch automatically.",
	},
	'repositories.getRepository': {
		riskLevel: 'read',
		description:
			'Retrieves detailed information about a specific repository in a Bitbucket workspace. Use when you need to get repository metadata, settings, or details.',
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigSshKnownHosts': {
		riskLevel: 'read',
		description:
			'Retrieves repository-level SSH known hosts configured for Bitbucket Pipelines. Use when you need to list or verify SSH known hosts that Pipelines can connect to during builds.',
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigRunners': {
		riskLevel: 'read',
		description:
			"Retrieves the list of self-hosted runners configured for a repository's pipelines. Use when you need to view available runners for pipeline execution.",
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigSchedules': {
		riskLevel: 'read',
		description:
			'Retrieves configured pipeline schedules for a Bitbucket repository. Use when you need to view scheduled pipeline runs and their cron patterns.',
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigVariables': {
		riskLevel: 'read',
		description:
			'Retrieves repository-level pipeline variables for a specific Bitbucket repository. Use when you need to view or audit pipeline configuration variables that are scoped to a repository.',
	},
	'pipelinesAndDeployments.getRepositoriesPipelinesConfigCaches': {
		riskLevel: 'read',
		description:
			'Retrieves the repository pipelines caches. Use when you need to list all caches configured for Bitbucket Pipelines in a specific repository.',
	},
	'sourceAndRefs.getRepositoriesRefs': {
		riskLevel: 'read',
		description:
			'Returns the branches and tags in the repository. Use when you need to list all refs (both branches and tags) in a single API call with optional filtering by type, name pattern, or commit hash.',
	},
	'repositories.getRepositoriesWatchers': {
		riskLevel: 'read',
		description:
			'Retrieves a paginated list of all the watchers on the specified repository. Use when you need to see who is watching a particular repository.',
	},
	'snippets.getSnippet': {
		riskLevel: 'read',
		description:
			'Retrieves a specific Bitbucket snippet by its encoded ID from an existing workspace, returning its metadata and file structure.',
	},
	'snippets.getSnippetsWatch': {
		riskLevel: 'read',
		description:
			'Checks if the current user is watching a specific snippet. Use when you need to verify watch status for a snippet.',
	},
	'pipelinesAndDeployments.getRepositoriesPipelines2': {
		riskLevel: 'read',
		description:
			'Retrieve a specified pipeline from a Bitbucket repository. Use when you need to get detailed information about a specific pipeline execution including its status, build number, and results.',
	},
	'sourceAndRefs.getRepositoriesRefsTags': {
		riskLevel: 'read',
		description:
			'Retrieves detailed information about a specific tag in a Bitbucket repository. Use when you need to get tag metadata, target commit details, or verify a tag exists.',
	},
	'usersAndPermissions.getUser': {
		riskLevel: 'read',
		description:
			'Retrieves public profile information for a specific Bitbucket user by username or UUID. Use when you need to get user details like display name, avatar, creation date, and links to related resources.',
	},
	'usersAndPermissions.getUserEmails2': {
		riskLevel: 'read',
		description:
			'Retrieves details about a specific email address for the authenticated user. Use when you need to check if an email is primary, confirmed, or verify email ownership.',
	},
	'usersAndPermissions.getUserEmails': {
		riskLevel: 'read',
		description:
			"Returns all the authenticated user's email addresses, both confirmed and unconfirmed. Use when you need to retrieve all email addresses associated with the current user's account.",
	},
	'usersAndPermissions.getUserPermissionsRepositories': {
		riskLevel: 'read',
		description:
			'Returns an object for each repository the caller has explicit access to, including their permission level. Use when you need to discover which repositories the authenticated user can access and their specific permissions.',
	},
	'usersAndPermissions.getUserPermissionsWorkspaces': {
		riskLevel: 'read',
		description:
			'Retrieves workspace memberships and permission levels for the authenticated user. Returns an object for each workspace the caller is a member of, along with their effective role (highest privilege level). Use when you need to determine which workspaces a user can access and their permission level in each.',
	},
	'usersAndPermissions.getUserWorkspaces': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all workspaces accessible to the authenticated user. Use when you need to list workspaces the current user can access, optionally filtered by workspace slug or permission level.',
	},
	'workspacesAndProjects.getWorkspace': {
		riskLevel: 'read',
		description:
			'Retrieves detailed information about a specific Bitbucket workspace. Use when you need to get workspace metadata, settings, or details.',
	},
	'repositories.listRepositories': {
		riskLevel: 'read',
		description:
			'Retrieves a paginated list of all public repositories on Bitbucket. Use when you need to discover or search across public repositories, optionally filtered by role, query string, creation date, or sorted by various fields.',
	},
	'sourceAndRefs.listBranches': {
		riskLevel: 'read',
		description:
			'Lists branches in a Bitbucket repository with optional server-side filtering by name pattern (BBQL) and sorting. Use when you need to discover available branches, search for specific branch patterns, or navigate repository branch structure.',
	},
	'commitsAndInsights.listCommits': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a page of commits from a Bitbucket repository. Returns commits in reverse chronological order (newest first), similar to git log. Use when you need to browse commit history, filter commits by branch/tag, or restrict to commits affecting a specific path.',
	},
	'commitsAndInsights.listCommitsFromRevision': {
		riskLevel: 'read',
		description:
			'Tool to list commits starting from a specific revision in a Bitbucket repository. Commits are paginated and returned in reverse chronological order. Use when you need to retrieve commit history from a specific commit, branch, or tag.',
	},
	'commitsAndInsights.createRepositoriesCommits2': {
		riskLevel: 'write',
		description:
			'Tool to list commits from a revision using POST method. Identical to GET endpoint but allows sending include/exclude parameters in request body to avoid URL length limits. Use when include/exclude parameters are too long for query strings.',
	},
	'commitsAndInsights.listCommitsOnMaster': {
		riskLevel: 'read',
		description:
			'Lists commits on the master branch of a Bitbucket repository. Use when you need to retrieve the commit history for the master branch, including commit messages, authors, dates, and parent relationships.',
	},
	'pipelinesAndDeployments.listDeployments': {
		riskLevel: 'read',
		description:
			'Lists deployments for a specified Bitbucket repository. Use when you need to view deployment history and status across environments.',
	},
	'issues.listIssues': {
		riskLevel: 'read',
		description:
			'Lists issues in a Bitbucket repository with optional filtering by state, priority, kind, or assignee. Use when you need to discover issue IDs or get an overview of repository issues.',
	},
	'pipelinesAndDeployments.listPipelines': {
		riskLevel: 'read',
		description:
			'Tool to find pipelines in a Bitbucket repository. Returns pipeline metadata including state, trigger, and duration. Use when you need to browse pipeline history or check pipeline status.',
	},
	'pullRequests.listPullRequestTasks': {
		riskLevel: 'read',
		description:
			'Lists all tasks associated with a pull request in a Bitbucket repository. Use when you need to view or track tasks on a PR.',
	},
	'pullRequests.listPullRequests': {
		riskLevel: 'read',
		description:
			'Lists pull requests in a specified, accessible Bitbucket repository, optionally filtering by state (OPEN, MERGED, DECLINED).',
	},
	'repositories.listRepositoriesInWorkspace': {
		riskLevel: 'read',
		description:
			'Lists repositories in a specified Bitbucket workspace, accessible to the authenticated user, with options to filter by role or query string, and sort results. Responses are paginated; iterate using the `next` field in each response until it is absent to retrieve all repositories.',
	},
	'pipelinesAndDeployments.listRepositoriesEnvironments': {
		riskLevel: 'read',
		description:
			'List all deployment environments configured for a Bitbucket repository. Use when you need to view available environments for deployments, check environment configurations, or select an environment for deployment operations.',
	},
	'sourceAndRefs.listRepositoryPaths': {
		riskLevel: 'read',
		description:
			'Lists file and directory entries under a repository path at a given revision, with optional breadth-first recursion via max_depth for repository traversal and scanning. Fails if the path points to a file rather than a directory.',
	},
	'snippets.listSnippets': {
		riskLevel: 'read',
		description:
			'Returns all snippets accessible to the authenticated user. Use when you need to discover or list snippets, optionally filtered by role (owner, contributor, or member).',
	},
	'sourceAndRefs.listTags': {
		riskLevel: 'read',
		description:
			'Lists tags in a Bitbucket repository with optional server-side filtering by name pattern or commit hash (BBQL) and sorting. Use when you need to discover available tags, search for specific tag patterns, or find tags pointing to specific commits.',
	},
	'issues.listVersions': {
		riskLevel: 'read',
		description:
			"Lists versions (milestones) in a Bitbucket repository's issue tracker. Use when you need to discover available versions for associating with issues, or to retrieve version IDs for use with create_issue.",
	},
	'workspacesAndProjects.listWorkspaceMembers': {
		riskLevel: 'read',
		description:
			'Lists all members of a specified Bitbucket workspace; the workspace must exist.',
	},
	'workspacesAndProjects.listWorkspaceProjects': {
		riskLevel: 'read',
		description:
			'Lists projects in a specified Bitbucket workspace. Use when you need to retrieve all projects belonging to a workspace.',
	},
	'workspacesAndProjects.listWorkspaces': {
		riskLevel: 'read',
		description:
			'Lists Bitbucket workspaces accessible to the authenticated user, optionally filtered and sorted. Results are paginated; follow the `next` field in each response to retrieve subsequent pages until `next` is absent. When multiple workspaces are returned, verify the correct `slug` or UUID before passing to downstream tools.',
	},
	'pullRequests.requestPullRequestChanges': {
		riskLevel: 'write',
		description:
			'Tool to request changes on a pull request as the authenticated user. Use when you need to formally request changes in a pull request review process, indicating the PR needs modifications before approval.',
	},
	'searchAndDiscovery.searchTeamCode': {
		riskLevel: 'read',
		description:
			'Search for code in repositories of a specified team. Matches can occur in file content or paths. Note: Teams endpoints were deprecated in Oct 2020; use workspace search endpoints for new integrations.',
	},
	'searchAndDiscovery.searchUserRepositoriesCode': {
		riskLevel: 'read',
		description:
			'Tool to search for code in the repositories of a specified user. Use when you need to find specific code patterns, functions, or text across all repositories owned by a user.',
	},
	'searchAndDiscovery.getWorkspacesSearchCode': {
		riskLevel: 'read',
		description:
			'Tool to search for code in the repositories of the specified workspace. Use when you need to find specific code patterns, function definitions, or text across all repositories in a workspace.',
	},
	'issues.updateIssue': {
		riskLevel: 'write',
		description:
			'Updates an existing issue in a Bitbucket repository by modifying specified attributes; requires `workspace`, `repo_slug`, `issue_id`, and at least one attribute to update.',
	},
	'commitsAndInsights.updateRepositoriesCommitComments': {
		riskLevel: 'write',
		description:
			"Updates the contents of a comment on a commit. Use when you need to modify an existing comment's text on a commit.",
	},
	'commitsAndInsights.updateInsightsProjectsReposCommitsReports': {
		riskLevel: 'write',
		description:
			"Create or update an insight report for a commit. Creates a new report if it doesn't exist, or replaces the existing one if a report already exists for the given repository, commit, and report key. Note: replacing an existing report will be rejected if the authenticated user was not the creator of the specified report.",
	},
	'commitsAndInsights.updateRepositoriesCommitReportsAnnotations': {
		riskLevel: 'write',
		description:
			'Creates or updates an individual annotation for a commit report. Use when you need to add or modify code analysis findings (vulnerabilities, code smells, or bugs) identified in a commit.',
	},
	'pipelinesAndDeployments.updateTeamsPipelinesConfigVariables': {
		riskLevel: 'write',
		description:
			'Updates a team-level pipeline configuration variable in Bitbucket. Use when you need to modify existing environment variables or configuration values that are available to all pipelines within a team.',
	},
	'pipelinesAndDeployments.updateUsersPipelinesConfigVariables': {
		riskLevel: 'write',
		description:
			'Updates a user-level pipeline variable for Bitbucket pipelines. Use when you need to modify account-level configuration variables such as changing the value, key name, or security status.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bitbucketEndpointsNested
>;
const defaultAuthType = 'oauth_2' as const;
/**
 * Scopes requested when the caller does not pass `options.scopes`. Every scope
 * here is required by at least one catalog operation — `repository:admin` by
 * `createRepository`, `repository:delete` by `deleteRepository`,
 * `pipeline:variable` by the pipeline variable operations and `runner` by
 * `getRepositoriesPipelinesConfigRunners` — so dropping one disables those
 * endpoints for the connection.
 */
export const defaultBitbucketScopes = [
	'account',
	'email',
	'repository',
	'repository:write',
	'repository:admin',
	'repository:delete',
	'pullrequest',
	'pullrequest:write',
	'issue',
	'issue:write',
	'snippet',
	'snippet:write',
	'project',
	'pipeline',
	'pipeline:write',
	'pipeline:variable',
	'runner',
] as const;
export type BaseBitbucketPlugin<T extends BitbucketPluginOptions> =
	CorsairPlugin<
		'bitbucket',
		typeof BitbucketSchema,
		typeof bitbucketEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;
export type InternalBitbucketPlugin =
	BaseBitbucketPlugin<BitbucketPluginOptions>;
export type ExternalBitbucketPlugin<T extends BitbucketPluginOptions> =
	BaseBitbucketPlugin<T>;
export function bitbucket<const T extends BitbucketPluginOptions>(
	incomingOptions: BitbucketPluginOptions & T = {} as BitbucketPluginOptions &
		T,
): ExternalBitbucketPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bitbucket',
		schema: BitbucketSchema,
		options,
		authConfig: bitbucketAuthConfig,
		oauthConfig: {
			providerName: 'Bitbucket',
			authUrl: BITBUCKET_AUTH_URL,
			tokenUrl: BITBUCKET_TOKEN_URL,
			scopes: [...(options.scopes ?? defaultBitbucketScopes)],
		},
		hooks: options.hooks,
		endpoints: bitbucketEndpointsNested,
		webhooks: {},
		endpointMeta: bitbucketEndpointMeta,
		endpointSchemas: bitbucketEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: BitbucketKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source !== 'endpoint' || ctx.authType !== 'oauth_2')
				throw new AuthMissingError('bitbucket', 'oauth_2');
			return getOAuthAccessToken(ctx, {
				plugin: 'bitbucket',
				tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
				tokenAuthMethod: 'basic',
			});
		},
	} satisfies InternalBitbucketPlugin;
}
export { bitbucketEndpointsNested };
export type {
	BitbucketEndpointInputs,
	BitbucketEndpointOutputs,
} from './endpoints/types';
