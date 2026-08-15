import { logEventFromContext } from 'corsair/core';
import type { ApaleoWebhooks } from '..';
import { createApaleoMatch, verifyApaleoWebhookSignature } from './types';

export const example: ApaleoWebhooks['example'] = {
	match: createApaleoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyApaleoWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'apaleo.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
