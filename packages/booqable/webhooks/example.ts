import { logEventFromContext } from 'corsair/core';
import type { BooqableWebhooks } from '..';
import { createBooqableMatch, verifyBooqableWebhookSignature } from './types';

export const example: BooqableWebhooks['example'] = {
	match: createBooqableMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBooqableWebhookSignature(request, ctx.key);
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
			'booqable.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
