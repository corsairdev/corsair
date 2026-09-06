import { logEventFromContext } from 'corsair/core';
import type { CoinmarketcalWebhooks } from '..';
import {
	createCoinmarketcalMatch,
	verifyCoinmarketcalWebhookSignature,
} from './types';

export const example: CoinmarketcalWebhooks['example'] = {
	match: createCoinmarketcalMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCoinmarketcalWebhookSignature(request, ctx.key);
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
			'coinmarketcal.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
