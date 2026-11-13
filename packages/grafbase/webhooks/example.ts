import { logEventFromContext } from 'corsair/core';
import type { GrafbaseWebhooks } from '..';
import { createGrafbaseMatch, verifyGrafbaseWebhookSignature } from './types';

export const example: GrafbaseWebhooks['example'] = {
	match: createGrafbaseMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGrafbaseWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'grafbase.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
