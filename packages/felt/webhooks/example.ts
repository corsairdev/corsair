import { logEventFromContext } from 'corsair/core';
import type { FeltWebhooks } from '..';
import { createFeltMatch, verifyFeltWebhookSignature } from './types';

export const example: FeltWebhooks['example'] = {
	match: createFeltMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFeltWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'felt.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
