import { logEventFromContext } from 'corsair/core';
import type { JiraWebhooks } from '..';
import { createJiraMatch, verifyJiraWebhookSignature } from './types';

export const newIssue: JiraWebhooks['newIssue'] = {
	match: createJiraMatch('jira:issue_created'),

	handler: async (ctx, request) => {
		const verification = verifyJiraWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.issue?.id && event.issue?.key && ctx.db.issues) {
			try {
				await ctx.db.issues.upsertByEntityId(event.issue.id, {
					id: event.issue.id,
					key: event.issue.key,
					...(event.issue.fields?.summary && {
						summary: event.issue.fields.summary,
					}),
					...(event.issue.fields?.status?.name && {
						status: event.issue.fields.status.name,
					}),
					...(event.issue.fields?.assignee?.accountId && {
						assigneeAccountId: event.issue.fields.assignee.accountId,
					}),
					...(event.issue.fields?.assignee?.displayName && {
						assigneeDisplayName: event.issue.fields.assignee.displayName,
					}),
					...(event.issue.fields?.reporter?.accountId && {
						reporterAccountId: event.issue.fields.reporter.accountId,
					}),
					...(event.issue.fields?.reporter?.displayName && {
						reporterDisplayName: event.issue.fields.reporter.displayName,
					}),
					...(event.issue.fields?.priority?.name && {
						priority: event.issue.fields.priority.name,
					}),
					...(event.issue.fields?.issuetype?.name && {
						issueType: event.issue.fields.issuetype.name,
					}),
					...(event.issue.fields?.project?.key && {
						projectKey: event.issue.fields.project.key,
					}),
					...(event.issue.fields?.project?.id && {
						projectId: event.issue.fields.project.id,
					}),
					...(event.issue.fields?.labels && {
						labels: event.issue.fields.labels,
					}),
					...(event.issue.fields?.created && {
						created: event.issue.fields.created,
					}),
					...(event.issue.fields?.updated && {
						updated: event.issue.fields.updated,
					}),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save new issue to database:', error);
			}
		}

		if (event.user?.accountId && ctx.db.users) {
			try {
				await ctx.db.users.upsertByEntityId(event.user.accountId, {
					accountId: event.user.accountId,
					...(event.user.displayName && {
						displayName: event.user.displayName,
					}),
					...(event.user.emailAddress && {
						emailAddress: event.user.emailAddress,
					}),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'jira.webhook.newIssue',
			{ issueKey: event.issue?.key },
			'completed',
		);

		return { success: true, data: event };
	},
};
