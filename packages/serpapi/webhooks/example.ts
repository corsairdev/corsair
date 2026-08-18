import { logEventFromContext } from 'corsair/core';
import type { SerpapiWebhooks } from '..';
import { createSerpapiMatch, verifySerpapiWebhookSignature } from './types';

export const example: SerpapiWebhooks['example'] = {
	match: createSerpapiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySerpapiWebhookSignature(request, ctx.key);
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
			'serpapi.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
