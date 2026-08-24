import { logEventFromContext } from 'corsair/core';
import type { TextrazorWebhooks } from '..';
import { createTextrazorMatch, verifyTextrazorWebhookSignature } from './types';

export const example: TextrazorWebhooks['example'] = {
	match: createTextrazorMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyTextrazorWebhookSignature(request, ctx.key);
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
			'textrazor.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
