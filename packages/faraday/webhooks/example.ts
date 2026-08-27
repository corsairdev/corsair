import { logEventFromContext } from 'corsair/core';
import type { FaradayWebhooks } from '..';
import { createFaradayMatch, verifyFaradayWebhookSignature } from './types';

export const example: FaradayWebhooks['example'] = {
	match: createFaradayMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFaradayWebhookSignature(request, ctx.key);
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

		const eventId = await logEventFromContext(
			ctx,
			'faraday.webhook.example',
			{ ...event },
			'completed',
		);
		if (!eventId) {
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to record webhook event',
			};
		}

		return { success: true, data: event };
	},
};
