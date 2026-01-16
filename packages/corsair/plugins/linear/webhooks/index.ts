import { commentCreate, commentRemove, commentUpdate } from './comments';
import { issueCreate, issueRemove, issueUpdate } from './issues';
import { projectCreate, projectRemove, projectUpdate } from './projects';

export const CommentWebhooks = {
	create: commentCreate,
	update: commentUpdate,
	remove: commentRemove,
};

export const IssueWebhooks = {
	create: issueCreate,
	update: issueUpdate,
	remove: issueRemove,
};

export const ProjectWebhooks = {
	create: projectCreate,
	update: projectUpdate,
	remove: projectRemove,
};

export * from './types';
