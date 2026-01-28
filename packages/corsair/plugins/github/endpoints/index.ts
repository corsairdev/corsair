import * as Issues from './issues';
import * as PullRequests from './pull-requests';
import * as Releases from './releases';
import * as Repositories from './repositories';
import * as Workflows from './workflows';

export const IssuesEndpoints = {
	list: Issues.list,
	get: Issues.get,
	create: Issues.create,
	update: Issues.update,
	createComment: Issues.createComment,
};

export const PullRequestsEndpoints = {
	list: PullRequests.list,
	get: PullRequests.get,
	listReviews: PullRequests.listReviews,
	createReview: PullRequests.createReview,
};

export const RepositoriesEndpoints = {
	list: Repositories.list,
	get: Repositories.get,
	listBranches: Repositories.listBranches,
	listCommits: Repositories.listCommits,
	getContent: Repositories.getContent,
};

export const ReleasesEndpoints = {
	list: Releases.list,
	get: Releases.get,
	create: Releases.create,
	update: Releases.update,
};

export const WorkflowsEndpoints = {
	list: Workflows.list,
	get: Workflows.get,
	listRuns: Workflows.listRuns,
};

export * from './types';
