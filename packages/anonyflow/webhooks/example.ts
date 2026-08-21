import { logEventFromContext } from 'corsair/core';
import type { AnonyflowWebhooks } from '..';
import { createAnonyflowMatch, verifyAnonyflowWebhookSignature } from './types';

export const example: AnonyflowWebhooks['example'] = {
	match: createAnonyflowMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAnonyflowWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'anonyflow.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
