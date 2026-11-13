import { logEventFromContext } from 'corsair/core';
import type { FinmeiWebhooks } from '..';
import { createFinmeiMatch, verifyFinmeiWebhookSignature } from './types';

export const example: FinmeiWebhooks['example'] = {
	match: createFinmeiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFinmeiWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'finmei.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
