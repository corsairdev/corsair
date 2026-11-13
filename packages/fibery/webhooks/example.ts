import { logEventFromContext } from 'corsair/core';
import type { FiberyWebhooks } from '..';
import { createFiberyMatch, verifyFiberyWebhookSignature } from './types';

export const example: FiberyWebhooks['example'] = {
	match: createFiberyMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFiberyWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'fibery.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
