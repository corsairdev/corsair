import { logEventFromContext } from 'corsair/core';
import type { GristWebhooks } from '..';
import { createGristMatch, verifyGristWebhookSignature } from './types';

export const example: GristWebhooks['example'] = {
	match: createGristMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGristWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'grist.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
