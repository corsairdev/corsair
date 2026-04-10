import { newIssue } from './newIssue';
import { newProject } from './newProject';
import { updatedIssue } from './updatedIssue';

export const IssueWebhooks = {
	newIssue,
	updatedIssue,
};

export const ProjectWebhooks = {
	newProject,
};

export * from './types';
