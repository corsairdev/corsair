import { logEventFromContext } from 'corsair/core';
import type { JiraWebhooks } from '..';
import { createJiraMatch, verifyJiraWebhookSignature } from './types';

export const newProject: JiraWebhooks['newProject'] = {
	match: createJiraMatch('project_created'),

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

		if (event.project?.id && event.project?.key && ctx.db.projects) {
			try {
				await ctx.db.projects.upsertByEntityId(event.project.id, {
					id: event.project.id,
					key: event.project.key,
					...(event.project.name && { name: event.project.name }),
					...(event.project.description && {
						description: event.project.description,
					}),
					...(event.project.projectTypeKey && {
						projectTypeKey: event.project.projectTypeKey,
					}),
					...(event.project.lead?.accountId && {
						leadAccountId: event.project.lead.accountId,
					}),
					...(event.project.lead?.displayName && {
						leadDisplayName: event.project.lead.displayName,
					}),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save new project to database:', error);
			}
		}

		if (event.project?.lead?.accountId && ctx.db.users) {
			try {
				await ctx.db.users.upsertByEntityId(event.project.lead.accountId, {
					accountId: event.project.lead.accountId,
					...(event.project.lead.displayName && {
						displayName: event.project.lead.displayName,
					}),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save project lead to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'jira.webhook.newProject',
			{ projectKey: event.project?.key },
			'completed',
		);

		return { success: true, data: event };
	},
};
