import { logEventFromContext } from 'corsair/core';
import type { BlackbaudWebhooks } from '..';
import { createBlackbaudMatch, verifyBlackbaudWebhookSignature } from './types';

export const example: BlackbaudWebhooks['example'] = {
	match: createBlackbaudMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBlackbaudWebhookSignature(request, ctx.key);
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
			'blackbaud.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
