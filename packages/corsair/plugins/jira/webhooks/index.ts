import { newIssue } from './newIssue';
import { updatedIssue } from './updatedIssue';
import { newProject } from './newProject';

export const IssueWebhooks = {
	newIssue,
	updatedIssue,
};

export const ProjectWebhooks = {
	newProject,
};

export * from './types';
