import { logEventFromContext } from 'corsair/core';
import type { StackExchangeWebhooks } from '..';
import { createStackExchangeMatch, verifyStackExchangeWebhookSignature } from './types';

export const example: StackExchangeWebhooks['example'] = {
	match: createStackExchangeMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyStackExchangeWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'stackexchange.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
