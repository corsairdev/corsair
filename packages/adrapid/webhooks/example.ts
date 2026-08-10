import { logEventFromContext } from 'corsair/core';
import type { AdrapidWebhooks } from '..';
import { createAdrapidMatch, verifyAdrapidWebhookSignature } from './types';

export const example: AdrapidWebhooks['example'] = {
	match: createAdrapidMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAdrapidWebhookSignature(request, ctx.key);
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
			'adrapid.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
