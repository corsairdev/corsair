import { logEventFromContext } from '../../utils/events';
import type { AsanaWebhooks } from '..';
import { createAsanaEventMatch, verifyAsanaWebhookSignature } from './types';

export const taskEvent: AsanaWebhooks['taskEvent'] = {
	match: createAsanaEventMatch('task'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		if (signingSecret) {
			// request.rawBody is the raw request body string used for signature verification
			const rawBody = typeof request.payload === 'string'
				? request.payload
				: JSON.stringify(request.payload);
			const verification = verifyAsanaWebhookSignature(
				{ rawBody, headers: request.headers as Record<string, string> },
				signingSecret,
			);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
		}

		const payload = request.payload;
		if (!payload || !payload.events?.length) {
			return {
				success: true,
				data: { events: [] },
			};
		}

		const taskEvents = payload.events.filter(
			(event) => event.resource?.resource_type === 'task',
		);

		if (ctx.db.tasks) {
			for (const event of taskEvents) {
				if (
					event.resource?.gid &&
					(event.action === 'added' || event.action === 'changed')
				) {
					try {
						await ctx.db.tasks.upsertByEntityId(event.resource.gid, {
							gid: event.resource.gid,
							name: event.resource.name,
							resource_type: event.resource.resource_type,
							modified_at: event.created_at,
						});
					} catch (error) {
						console.warn('Failed to update task in database from webhook event:', error);
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'asana.webhook.taskEvent',
			{ event_count: taskEvents.length },
			'completed',
		);

		return {
			success: true,
			data: { events: taskEvents },
		};
	},
};
