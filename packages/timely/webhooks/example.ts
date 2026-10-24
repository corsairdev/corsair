import { logEventFromContext } from 'corsair/core';
import type { TimelyWebhooks } from '..';
import { createTimelyMatch, verifyTimelyWebhookSignature } from './types';

export const example: TimelyWebhooks['example'] = {
	match: createTimelyMatch('example'),

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
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'timely.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
