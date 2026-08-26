import { logEventFromContext } from 'corsair/core';
import type { BestBuyWebhooks } from '..';
import { createBestBuyMatch, verifyBestBuyWebhookSignature } from './types';

export const example: BestBuyWebhooks['example'] = {
	match: createBestBuyMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBestBuyWebhookSignature(request, ctx.key);
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

		await logEventFromContext(
			ctx,
			'bestbuy.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
