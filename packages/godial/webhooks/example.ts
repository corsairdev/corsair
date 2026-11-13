import { logEventFromContext } from 'corsair/core';
import type { GoDialWebhooks } from '..';
import { createGoDialMatch, verifyGoDialWebhookSignature } from './types';

export const example: GoDialWebhooks['example'] = {
	match: createGoDialMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGoDialWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'godial.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
