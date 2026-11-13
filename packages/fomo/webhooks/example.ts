import { logEventFromContext } from 'corsair/core';
import type { FomoWebhooks } from '..';
import { createFomoMatch, verifyFomoWebhookSignature } from './types';

export const example: FomoWebhooks['example'] = {
	match: createFomoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFomoWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'fomo.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
