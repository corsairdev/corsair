import * as Comments from './comments';
import * as Discussions from './discussions';
import * as Forks from './forks';
import * as Issues from './issues';
import * as PullRequests from './pull-requests';
import * as Releases from './releases';
import * as Repositories from './repositories';
import * as Search from './search';
import * as Users from './users';
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
	star: Repositories.star,
	unstar: Repositories.unstar,
	checkStarred: Repositories.checkStarred,
	listStarred: Repositories.listStarred,
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

export const DiscussionsEndpoints = {
	list: Discussions.list,
	get: Discussions.get,
};

export const ForksEndpoints = {
	list: Forks.list,
};

export const CommentsEndpoints = {
	list: Comments.list,
	listForIssue: Comments.listForIssue,
	get: Comments.get,
	update: Comments.update,
	delete: Comments.deleteComment,
};

export const UsersEndpoints = {
	list: Users.list,
	get: Users.get,
	getById: Users.getById,
	getAuthenticated: Users.getAuthenticated,
	update: Users.update,
	getHovercard: Users.getHovercard,
};

export const SearchEndpoints = {
	issues: Search.issues,
	repositories: Search.repositories,
	users: Search.users,
};

export * from './types';
