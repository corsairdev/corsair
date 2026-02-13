import {
	create as commentsCreate,
	list as commentsList,
	update as commentsUpdate,
	deleteComment,
} from './comments';
import {
	deleteIssue,
	create as issuesCreate,
	get as issuesGet,
	list as issuesList,
	update as issuesUpdate,
} from './issues';
import {
	deleteProject,
	create as projectsCreate,
	get as projectsGet,
	list as projectsList,
	update as projectsUpdate,
} from './projects';
import { get as teamsGet, list as teamsList } from './teams';
import { get as usersGet, list as usersList } from './users';
import {
	get as statesGet,
	getCanceledStateId,
	list as statesList,
} from './states';

export const Comments = {
	list: commentsList,
	create: commentsCreate,
	update: commentsUpdate,
	delete: deleteComment,
};

export const Issues = {
	list: issuesList,
	get: issuesGet,
	create: issuesCreate,
	update: issuesUpdate,
	delete: deleteIssue,
};

export const Projects = {
	list: projectsList,
	get: projectsGet,
	create: projectsCreate,
	update: projectsUpdate,
	delete: deleteProject,
};

export const Teams = {
	list: teamsList,
	get: teamsGet,
};

export const Users = {
	list: usersList,
	get: usersGet,
};

export const States = {
	list: statesList,
	get: statesGet,
	getCanceledStateId,
};

export * from './types';
