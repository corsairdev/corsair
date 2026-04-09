import * as CommentEndpoints from './comments';
import * as IssueEndpoints from './issues';
import * as ProjectEndpoints from './projects';
import * as SprintEndpoints from './sprints';
import * as UserEndpoints from './users';

export const Issues = {
	create: IssueEndpoints.create,
	get: IssueEndpoints.get,
	edit: IssueEndpoints.edit,
	delete: IssueEndpoints.deleteIssue,
	search: IssueEndpoints.search,
	assign: IssueEndpoints.assign,
	getTransitions: IssueEndpoints.getTransitions,
	transition: IssueEndpoints.transition,
	bulkCreate: IssueEndpoints.bulkCreate,
	bulkFetch: IssueEndpoints.bulkFetch,
	addAttachment: IssueEndpoints.addAttachment,
	addWatcher: IssueEndpoints.addWatcher,
	removeWatcher: IssueEndpoints.removeWatcher,
	linkIssues: IssueEndpoints.linkIssues,
};

export const Comments = {
	add: CommentEndpoints.add,
	get: CommentEndpoints.get,
	list: CommentEndpoints.list,
	update: CommentEndpoints.update,
	delete: CommentEndpoints.deleteComment,
};

export const Projects = {
	create: ProjectEndpoints.create,
	get: ProjectEndpoints.get,
	list: ProjectEndpoints.list,
	getRoles: ProjectEndpoints.getRoles,
};

export const Sprints = {
	create: SprintEndpoints.create,
	list: SprintEndpoints.list,
	moveIssues: SprintEndpoints.moveIssues,
	listBoards: SprintEndpoints.listBoards,
};

export const Users = {
	getCurrent: UserEndpoints.getCurrent,
	find: UserEndpoints.find,
	getAll: UserEndpoints.getAll,
};

export const Groups = {
	getAll: UserEndpoints.groupsGetAll,
	create: UserEndpoints.groupsCreate,
};

export * from './types';
