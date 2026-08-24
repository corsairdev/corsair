import { logEventFromContext } from 'corsair/core';
import type { BrowseraiWebhooks } from '..';
import { createBrowseraiMatch, verifyBrowseraiWebhookSignature } from './types';

export const example: BrowseraiWebhooks['example'] = {
	match: createBrowseraiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBrowseraiWebhookSignature(request, ctx.key);
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
			'browserai.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
