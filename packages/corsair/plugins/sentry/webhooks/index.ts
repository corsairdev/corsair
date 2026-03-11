import { eventAlert, metricAlert } from './alerts';
import { commentCreated, commentDeleted, commentUpdated } from './comments';
import { issueAssigned, issueCreated, issueResolved } from './issues';

export const IssueWebhooks = {
	created: issueCreated,
	resolved: issueResolved,
	assigned: issueAssigned,
};

export const AlertWebhooks = {
	eventAlert: eventAlert,
	metricAlert: metricAlert,
};

export const CommentWebhooks = {
	created: commentCreated,
	updated: commentUpdated,
	deleted: commentDeleted,
};

export * from './types';
