import { logEventFromContext } from 'corsair/core';
import type { BunnycdnWebhooks } from '..';
import { createBunnycdnMatch, verifyBunnycdnWebhookSignature } from './types';

export const example: BunnycdnWebhooks['example'] = {
	match: createBunnycdnMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBunnycdnWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'bunnycdn.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
