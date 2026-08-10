import { logEventFromContext } from 'corsair/core';
import type { AmaraWebhooks } from '..';
import { createAmaraMatch, verifyAmaraWebhookSignature } from './types';

export const example: AmaraWebhooks['example'] = {
	match: createAmaraMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAmaraWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'amara.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
