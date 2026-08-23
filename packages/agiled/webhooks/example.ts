import { logEventFromContext } from 'corsair/core';
import type { AgiledWebhooks } from '..';
import { createAgiledMatch, verifyAgiledWebhookSignature } from './types';

export const example: AgiledWebhooks['example'] = {
	match: createAgiledMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAgiledWebhookSignature(request, ctx.key);
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
			'agiled.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
