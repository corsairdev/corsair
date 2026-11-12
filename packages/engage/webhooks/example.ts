import { logEventFromContext } from 'corsair/core';
import type { EngageWebhooks } from '..';
import { createEngageMatch, verifyEngageWebhookSignature } from './types';

export const example: EngageWebhooks['example'] = {
	match: createEngageMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyEngageWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'engage.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
