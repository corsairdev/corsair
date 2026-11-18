import * as Collaboration from './collaboration';
import * as Issues from './issues';
import * as Projects from './projects';

export const ProjectsEndpoints = {
	list: Projects.list,
	get: Projects.get,
	getByKey: Projects.getByKey,
	templates: Projects.templates,
};

export const IssuesEndpoints = {
	list: Issues.list,
	get: Issues.get,
	getByNumber: Issues.getByNumber,
	types: Issues.types,
	fields: Issues.fields,
};

export const SprintsEndpoints = {
	list: Collaboration.list,
	get: Collaboration.get,
};

export const WorkflowsEndpoints = {
	list: Collaboration.workflows,
	nextStates: Collaboration.nextStates,
};

export const TagsEndpoints = {
	list: Collaboration.tags,
};

export const MembersEndpoints = {
	list: Collaboration.members,
};

export * from './types';
