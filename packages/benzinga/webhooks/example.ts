import { logEventFromContext } from 'corsair/core';
import type { BenzingaWebhooks } from '..';
import { createBenzingaMatch, verifyBenzingaWebhookSignature } from './types';

export const example: BenzingaWebhooks['example'] = {
	match: createBenzingaMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBenzingaWebhookSignature(request, ctx.key);
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
			'benzinga.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
