import { createBitbucketEndpoint } from './factory';
export const BitbucketEndpoints = {
	pullRequests: {
		approvePullRequest: createBitbucketEndpoint('approvePullRequest'),
		createPullRequest: createBitbucketEndpoint('createPullRequest'),
		createPullRequestComment: createBitbucketEndpoint(
			'createPullRequestComment',
		),
		getPullRequest: createBitbucketEndpoint('getPullRequest'),
		getPullRequestCommits: createBitbucketEndpoint('getPullRequestCommits'),
		getPullRequestDiff: createBitbucketEndpoint('getPullRequestDiff'),
		getPullRequestDiffstat: createBitbucketEndpoint('getPullRequestDiffstat'),
		getPullRequestComment: createBitbucketEndpoint('getPullRequestComment'),
		getRepositoriesPullrequestsComments: createBitbucketEndpoint(
			'getRepositoriesPullrequestsComments',
		),
		getRepositoriesPullrequestsStatuses: createBitbucketEndpoint(
			'getRepositoriesPullrequestsStatuses',
		),
		getRepositoriesPullrequestsActivity: createBitbucketEndpoint(
			'getRepositoriesPullrequestsActivity',
		),
		listPullRequestTasks: createBitbucketEndpoint('listPullRequestTasks'),
		listPullRequests: createBitbucketEndpoint('listPullRequests'),
		requestPullRequestChanges: createBitbucketEndpoint(
			'requestPullRequestChanges',
		),
	},
	sourceAndRefs: {
		browseRepositoryPath: createBitbucketEndpoint('browseRepositoryPath'),
		createBranch: createBitbucketEndpoint('createBranch'),
		getRepositoriesBranchingModel: createBitbucketEndpoint(
			'getRepositoriesBranchingModel',
		),
		getBranch: createBitbucketEndpoint('getBranch'),
		getRepositoriesEffectiveBranchingModel: createBitbucketEndpoint(
			'getRepositoriesEffectiveBranchingModel',
		),
		getRepositoriesFilehistory: createBitbucketEndpoint(
			'getRepositoriesFilehistory',
		),
		getFileFromRepository: createBitbucketEndpoint('getFileFromRepository'),
		getRawFileContent: createBitbucketEndpoint('getRawFileContent'),
		getRepositoriesSrc: createBitbucketEndpoint('getRepositoriesSrc'),
		getRepositoriesRefs: createBitbucketEndpoint('getRepositoriesRefs'),
		getRepositoriesRefsTags: createBitbucketEndpoint('getRepositoriesRefsTags'),
		listBranches: createBitbucketEndpoint('listBranches'),
		listRepositoryPaths: createBitbucketEndpoint('listRepositoryPaths'),
		listTags: createBitbucketEndpoint('listTags'),
	},
	issues: {
		getRepositoriesIssuesVote: createBitbucketEndpoint(
			'getRepositoriesIssuesVote',
		),
		createIssue: createBitbucketEndpoint('createIssue'),
		createIssueComment: createBitbucketEndpoint('createIssueComment'),
		deleteIssue: createBitbucketEndpoint('deleteIssue'),
		listIssues: createBitbucketEndpoint('listIssues'),
		listVersions: createBitbucketEndpoint('listVersions'),
		updateIssue: createBitbucketEndpoint('updateIssue'),
	},
	commitsAndInsights: {
		createRepositoriesCommitReportsAnnotations: createBitbucketEndpoint(
			'createRepositoriesCommitReportsAnnotations',
		),
		deleteCommitComment: createBitbucketEndpoint('deleteCommitComment'),
		deleteRepositoriesCommitReportsAnnotations: createBitbucketEndpoint(
			'deleteRepositoriesCommitReportsAnnotations',
		),
		getCommitBuildStatus: createBitbucketEndpoint('getCommitBuildStatus'),
		getCommitChanges: createBitbucketEndpoint('getCommitChanges'),
		getCommitDiff: createBitbucketEndpoint('getCommitDiff'),
		getRepositoriesCommitReports: createBitbucketEndpoint(
			'getRepositoriesCommitReports',
		),
		getRepositoriesMergeBase: createBitbucketEndpoint(
			'getRepositoriesMergeBase',
		),
		getRepositoriesCommit: createBitbucketEndpoint('getRepositoriesCommit'),
		getRepositoryPatch: createBitbucketEndpoint('getRepositoryPatch'),
		getCommitComment: createBitbucketEndpoint('getCommitComment'),
		getRepositoriesCommitComments: createBitbucketEndpoint(
			'getRepositoriesCommitComments',
		),
		getRepositoriesCommitReport: createBitbucketEndpoint(
			'getRepositoriesCommitReport',
		),
		getRepositoriesCommitReportsAnnotations: createBitbucketEndpoint(
			'getRepositoriesCommitReportsAnnotations',
		),
		getRepositoriesCommitStatuses: createBitbucketEndpoint(
			'getRepositoriesCommitStatuses',
		),
		listCommits: createBitbucketEndpoint('listCommits'),
		listCommitsFromRevision: createBitbucketEndpoint('listCommitsFromRevision'),
		createRepositoriesCommits2: createBitbucketEndpoint(
			'createRepositoriesCommits2',
		),
		listCommitsOnMaster: createBitbucketEndpoint('listCommitsOnMaster'),
		updateRepositoriesCommitComments: createBitbucketEndpoint(
			'updateRepositoriesCommitComments',
		),
		updateInsightsProjectsReposCommitsReports: createBitbucketEndpoint(
			'updateInsightsProjectsReposCommitsReports',
		),
		updateRepositoriesCommitReportsAnnotations: createBitbucketEndpoint(
			'updateRepositoriesCommitReportsAnnotations',
		),
	},
	repositories: {
		createRepository: createBitbucketEndpoint('createRepository'),
		deleteRepository: createBitbucketEndpoint('deleteRepository'),
		getRepository: createBitbucketEndpoint('getRepository'),
		getRepositoriesWatchers: createBitbucketEndpoint('getRepositoriesWatchers'),
		listRepositories: createBitbucketEndpoint('listRepositories'),
		listRepositoriesInWorkspace: createBitbucketEndpoint(
			'listRepositoriesInWorkspace',
		),
	},
	snippets: {
		createSnippetComment: createBitbucketEndpoint('createSnippetComment'),
		deleteSnippetsWatch: createBitbucketEndpoint('deleteSnippetsWatch'),
		getSnippet: createBitbucketEndpoint('getSnippet'),
		getSnippetsWatch: createBitbucketEndpoint('getSnippetsWatch'),
		listSnippets: createBitbucketEndpoint('listSnippets'),
	},
	pipelinesAndDeployments: {
		createTeamsPipelinesConfigVariables: createBitbucketEndpoint(
			'createTeamsPipelinesConfigVariables',
		),
		createUsersPipelinesConfigVariables: createBitbucketEndpoint(
			'createUsersPipelinesConfigVariables',
		),
		deleteUserPipelineVariable: createBitbucketEndpoint(
			'deleteUserPipelineVariable',
		),
		getOpenidConfiguration: createBitbucketEndpoint('getOpenidConfiguration'),
		getRepositoriesEnvironments2: createBitbucketEndpoint(
			'getRepositoriesEnvironments2',
		),
		getDeploymentEnvironmentVariables: createBitbucketEndpoint(
			'getDeploymentEnvironmentVariables',
		),
		getRepositoriesPipelinesSteps: createBitbucketEndpoint(
			'getRepositoriesPipelinesSteps',
		),
		getRepositoriesPipelinesConfigSshKnownHosts: createBitbucketEndpoint(
			'getRepositoriesPipelinesConfigSshKnownHosts',
		),
		getRepositoriesPipelinesConfigRunners: createBitbucketEndpoint(
			'getRepositoriesPipelinesConfigRunners',
		),
		getRepositoriesPipelinesConfigSchedules: createBitbucketEndpoint(
			'getRepositoriesPipelinesConfigSchedules',
		),
		getRepositoriesPipelinesConfigVariables: createBitbucketEndpoint(
			'getRepositoriesPipelinesConfigVariables',
		),
		getRepositoriesPipelinesConfigCaches: createBitbucketEndpoint(
			'getRepositoriesPipelinesConfigCaches',
		),
		getRepositoriesPipelines2: createBitbucketEndpoint(
			'getRepositoriesPipelines2',
		),
		listDeployments: createBitbucketEndpoint('listDeployments'),
		listPipelines: createBitbucketEndpoint('listPipelines'),
		listRepositoriesEnvironments: createBitbucketEndpoint(
			'listRepositoriesEnvironments',
		),
		updateTeamsPipelinesConfigVariables: createBitbucketEndpoint(
			'updateTeamsPipelinesConfigVariables',
		),
		updateUsersPipelinesConfigVariables: createBitbucketEndpoint(
			'updateUsersPipelinesConfigVariables',
		),
	},
	usersAndPermissions: {
		getSshLatestKeys: createBitbucketEndpoint('getSshLatestKeys'),
		getCurrentUser2: createBitbucketEndpoint('getCurrentUser2'),
		getUser: createBitbucketEndpoint('getUser'),
		getUserEmails2: createBitbucketEndpoint('getUserEmails2'),
		getUserEmails: createBitbucketEndpoint('getUserEmails'),
		getUserPermissionsRepositories: createBitbucketEndpoint(
			'getUserPermissionsRepositories',
		),
		getUserPermissionsWorkspaces: createBitbucketEndpoint(
			'getUserPermissionsWorkspaces',
		),
		getUserWorkspaces: createBitbucketEndpoint('getUserWorkspaces'),
	},
	workspacesAndProjects: {
		getWorkspacesPullrequests: createBitbucketEndpoint(
			'getWorkspacesPullrequests',
		),
		getProjectsRepos: createBitbucketEndpoint('getProjectsRepos'),
		getWorkspace: createBitbucketEndpoint('getWorkspace'),
		listWorkspaceMembers: createBitbucketEndpoint('listWorkspaceMembers'),
		listWorkspaceProjects: createBitbucketEndpoint('listWorkspaceProjects'),
		listWorkspaces: createBitbucketEndpoint('listWorkspaces'),
	},
	searchAndDiscovery: {
		getHookEvents: createBitbucketEndpoint('getHookEvents'),
		searchTeamCode: createBitbucketEndpoint('searchTeamCode'),
		searchUserRepositoriesCode: createBitbucketEndpoint(
			'searchUserRepositoriesCode',
		),
		getWorkspacesSearchCode: createBitbucketEndpoint('getWorkspacesSearchCode'),
	},
} as const;
export * from './operations';
export * from './types';
