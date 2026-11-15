import { logEventFromContext } from 'corsair/core';
import type { QuickBooksWebhooks } from '..';
import { createQuickBooksMatch, verifyQuickBooksWebhookSignature } from './types';

export const example: QuickBooksWebhooks['example'] = {
	match: createQuickBooksMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyQuickBooksWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'quickbooks.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
