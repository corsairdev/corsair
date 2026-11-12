import { logEventFromContext } from 'corsair/core';
import type { EncodianWebhooks } from '..';
import { createEncodianMatch, verifyEncodianWebhookSignature } from './types';

export const example: EncodianWebhooks['example'] = {
	match: createEncodianMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyEncodianWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'encodian.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
