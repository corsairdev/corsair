import { logEventFromContext } from 'corsair/core';
import type { ProductboardWebhooks } from '..';
import { createProductboardMatch, verifyProductboardWebhookSignature } from './types';

export const example: ProductboardWebhooks['example'] = {
	match: createProductboardMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyProductboardWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'productboard.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
