import { logEventFromContext } from 'corsair/core';
import type { HandwryttenWebhooks } from '..';
import { createHandwryttenMatch, verifyHandwryttenWebhookSignature } from './types';

export const example: HandwryttenWebhooks['example'] = {
	match: createHandwryttenMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHandwryttenWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'handwrytten.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
