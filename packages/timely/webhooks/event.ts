import { logEventFromContext } from 'corsair/core';
import type { TimelyWebhooks } from '..';
import { createTimelyMatch, verifyTimelyWebhookSignature } from './types';

export const event: TimelyWebhooks['event'] = {
	match: createTimelyMatch(),

	handler: async (ctx, request) => {
		const verification = verifyTimelyWebhookSignature(request, ctx.key);
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
			'timely.webhook.event',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
