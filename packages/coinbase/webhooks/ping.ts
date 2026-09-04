import { logEventFromContext } from 'corsair/core';
import type { CoinbaseWebhooks } from '..';
import { createCoinbaseMatch, verifyCoinbaseWebhookSignature } from './types';

export const ping: CoinbaseWebhooks['ping'] = {
	match: createCoinbaseMatch('ping'),

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
			'coinbase.webhook.ping',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
