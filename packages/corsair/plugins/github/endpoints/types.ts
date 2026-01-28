import type {
	Issue,
	PullRequest,
	Release,
	Repository,
	Workflow,
	WorkflowRun,
} from '../types';

export type IssuesListResponse = Array<Issue>;
export type IssueGetResponse = Issue;
export type IssueCreateResponse = Issue;
export type IssueUpdateResponse = Issue;
export type IssueCommentCreateResponse = {
	id: number;
	nodeId: string;
	url: string;
	body?: string;
	bodyText?: string;
	bodyHtml?: string;
	htmlUrl: string;
	user: {
		login: string;
		id: number;
		nodeId: string;
		avatarUrl: string;
	};
	createdAt: string;
	updatedAt: string;
	issueUrl: string;
};

export type PullRequestsListResponse = Array<PullRequest>;
export type PullRequestGetResponse = PullRequest;
export type PullRequestReviewListResponse = Array<{
	id: number;
	nodeId: string;
	user: {
		login: string;
		id: number;
	};
	body: string;
	state: string;
	htmlUrl: string;
	pullRequestUrl: string;
	submittedAt?: string;
	commitId: string | null;
}>;
export type PullRequestReviewCreateResponse = {
	id: number;
	nodeId: string;
	user: {
		login: string;
		id: number;
	};
	body: string;
	state: string;
	htmlUrl: string;
	pullRequestUrl: string;
	submittedAt?: string;
	commitId: string | null;
};

export type RepositoriesListResponse = Array<Repository>;
export type RepositoryGetResponse = Repository;
export type RepositoryBranchesListResponse = Array<{
	name: string;
	commit: {
		sha: string;
		url: string;
	};
	protected: boolean;
}>;
export type RepositoryCommitsListResponse = Array<{
	url: string;
	sha: string;
	nodeId: string;
	htmlUrl: string;
	commentsUrl: string;
	commit: {
		url: string;
		author: {
			name: string;
			email: string;
			date: string;
		} | null;
		committer: {
			name: string;
			email: string;
			date: string;
		} | null;
		message: string;
		commentCount: number;
		tree: {
			sha: string;
			url: string;
		};
	};
	author: {
		login: string;
		id: number;
	} | null;
	committer: {
		login: string;
		id: number;
	} | null;
	parents: Array<{
		sha: string;
		url: string;
		htmlUrl?: string;
	}>;
}>;
export type RepositoryContentGetResponse =
	| {
			type: 'file';
			encoding: string;
			size: number;
			name: string;
			path: string;
			content: string;
			sha: string;
			url: string;
			gitUrl: string | null;
			htmlUrl: string | null;
			downloadUrl: string | null;
	  }
	| {
			type: 'dir';
			name: string;
			path: string;
			sha: string;
			size: number;
			url: string;
			gitUrl: string | null;
			htmlUrl: string | null;
			downloadUrl: string | null;
	  }
	| Array<{
			type: 'file' | 'dir' | 'submodule' | 'symlink';
			size: number;
			name: string;
			path: string;
			sha: string;
			url: string;
			gitUrl: string | null;
			htmlUrl: string | null;
			downloadUrl: string | null;
	  }>;

export type ReleasesListResponse = Array<Release>;
export type ReleaseGetResponse = Release;
export type ReleaseCreateResponse = Release;
export type ReleaseUpdateResponse = Release;

export type WorkflowsListResponse = {
	totalCount: number;
	workflows: Array<Workflow>;
};
export type WorkflowGetResponse = Workflow;
export type WorkflowRunsListResponse = {
	totalCount: number;
	workflowRuns: Array<WorkflowRun>;
};

export type GithubEndpointOutputs = {
	issuesList: IssuesListResponse;
	issuesGet: IssueGetResponse;
	issuesCreate: IssueCreateResponse;
	issuesUpdate: IssueUpdateResponse;
	issuesCreateComment: IssueCommentCreateResponse;
	pullRequestsList: PullRequestsListResponse;
	pullRequestsGet: PullRequestGetResponse;
	pullRequestsListReviews: PullRequestReviewListResponse;
	pullRequestsCreateReview: PullRequestReviewCreateResponse;
	repositoriesList: RepositoriesListResponse;
	repositoriesGet: RepositoryGetResponse;
	repositoriesListBranches: RepositoryBranchesListResponse;
	repositoriesListCommits: RepositoryCommitsListResponse;
	repositoriesGetContent: RepositoryContentGetResponse;
	releasesList: ReleasesListResponse;
	releasesGet: ReleaseGetResponse;
	releasesCreate: ReleaseCreateResponse;
	releasesUpdate: ReleaseUpdateResponse;
	workflowsList: WorkflowsListResponse;
	workflowsGet: WorkflowGetResponse;
	workflowsListRuns: WorkflowRunsListResponse;
};
