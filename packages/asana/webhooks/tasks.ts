import { logEventFromContext } from 'corsair/core';
import type { AsanaBoundEndpoints, AsanaWebhooks } from '..';
import { createAsanaEventMatch, verifyAsanaWebhookSignature } from './types';

export const taskEvent: AsanaWebhooks['taskEvent'] = {
	match: createAsanaEventMatch('task'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyAsanaWebhookSignature(
			{ payload: request.rawBody, headers: request.headers },
			signingSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
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
			// Type assertion so that the endpoints are the correct type
			const endpoints = ctx.endpoints as AsanaBoundEndpoints;

			for (const event of taskEvents) {
				if (
					event.resource?.gid &&
					(event.action === 'added' || event.action === 'changed')
				) {
					try {
						// Fetch full task data via bound endpoint (handles auth automatically)
						await endpoints.tasks.get({ task_gid: event.resource.gid });
					} catch (error) {
						console.warn(
							'asana webhook: failed to fetch/upsert task',
							event.resource.gid,
							error,
						);
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
