import { logEventFromContext } from 'corsair/core';
import type { FireberryWebhooks } from '..';
import { createFireberryMatch, verifyFireberryWebhookSignature } from './types';

export const example: FireberryWebhooks['example'] = {
	match: createFireberryMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFireberryWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'fireberry.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
