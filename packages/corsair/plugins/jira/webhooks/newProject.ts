import type { JiraWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
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

		if (ctx.db.projects && event.project?.id && event.project?.key) {
			try {
				await ctx.db.projects.upsertByEntityId(event.project.id, {
					id: event.project.id,
					key: event.project.key,
					name: event.project.name,
					description: event.project.description,
					projectTypeKey: event.project.projectTypeKey,
					leadAccountId: event.project.lead?.accountId,
					leadDisplayName: event.project.lead?.displayName,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save new project to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'jira.webhook.newProject',
			{ projectKey: event.project?.key },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
