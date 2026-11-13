import { logEventFromContext } from 'corsair/core';
import type { GorgiasWebhooks } from '..';
import { createGorgiasMatch, verifyGorgiasWebhookSignature } from './types';

export const example: GorgiasWebhooks['example'] = {
	match: createGorgiasMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGorgiasWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'gorgias.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
