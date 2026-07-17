import { newIssue } from './new-issue';
import { newProject } from './new-project';
import { updatedIssue } from './updated-issue';

export const IssueWebhooks = {
	newIssue,
	updatedIssue,
};

export const ProjectWebhooks = {
	newProject,
};

export * from './types';
