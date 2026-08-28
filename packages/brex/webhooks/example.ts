import { logEventFromContext } from 'corsair/core';
import type { BrexWebhooks } from '..';
import { createBrexMatch, verifyBrexWebhookSignature } from './types';

export const example: BrexWebhooks['example'] = {
	match: createBrexMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBrexWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'brex.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
