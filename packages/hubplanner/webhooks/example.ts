import { logEventFromContext } from 'corsair/core';
import type { HubPlannerWebhooks } from '..';
import { createHubPlannerMatch, verifyHubPlannerWebhookSignature } from './types';

export const example: HubPlannerWebhooks['example'] = {
	match: createHubPlannerMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHubPlannerWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'hubplanner.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
