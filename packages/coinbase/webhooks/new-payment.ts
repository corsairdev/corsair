import { logEventFromContext } from 'corsair/core';
import type { CoinbaseWebhooks } from '..';
import { createCoinbaseMatch, verifyCoinbaseWebhookSignature } from './types';

export const newPayment: CoinbaseWebhooks['newPayment'] = {
	match: createCoinbaseMatch('wallet:addresses:new-payment'),

	handler: async (ctx, request) => {
		const verification = verifyCoinbaseWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'coinbase.webhook.newPayment',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
