import { logEventFromContext } from 'corsair/core';
import type { ThinkificWebhooks } from '..';
import { createThinkificMatch, verifyThinkificWebhookSignature } from './types';

export const example: ThinkificWebhooks['example'] = {
	match: createThinkificMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyThinkificWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'thinkific.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
