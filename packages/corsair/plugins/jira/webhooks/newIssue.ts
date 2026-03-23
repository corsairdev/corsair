import type { JiraWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
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

		if (ctx.db.issues && event.issue?.id && event.issue?.key) {
			try {
				await ctx.db.issues.upsertByEntityId(event.issue.id, {
					id: event.issue.id,
					key: event.issue.key,
					summary: event.issue.fields?.summary,
					status: event.issue.fields?.status?.name,
					assigneeAccountId: event.issue.fields?.assignee?.accountId,
					assigneeDisplayName: event.issue.fields?.assignee?.displayName,
					reporterAccountId: event.issue.fields?.reporter?.accountId,
					reporterDisplayName: event.issue.fields?.reporter?.displayName,
					priority: event.issue.fields?.priority?.name ?? undefined,
					issueType: event.issue.fields?.issuetype?.name,
					projectKey: event.issue.fields?.project?.key,
					projectId: event.issue.fields?.project?.id,
					labels: event.issue.fields?.labels,
					created: event.issue.fields?.created,
					updated: event.issue.fields?.updated,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save new issue to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'jira.webhook.newIssue',
			{ issueKey: event.issue?.key },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
