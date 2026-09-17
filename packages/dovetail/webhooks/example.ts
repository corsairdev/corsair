import { logEventFromContext } from 'corsair/core';
import type { DovetailWebhooks } from '..';
import { createDovetailMatch, verifyDovetailWebhookSignature } from './types';

export const example: DovetailWebhooks['example'] = {
	match: createDovetailMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDovetailWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'dovetail.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
