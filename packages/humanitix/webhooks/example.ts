import { logEventFromContext } from 'corsair/core';
import type { HumanitixWebhooks } from '..';
import { createHumanitixMatch, verifyHumanitixWebhookSignature } from './types';

export const example: HumanitixWebhooks['example'] = {
	match: createHumanitixMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHumanitixWebhookSignature(request, ctx.key);
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
			'humanitix.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
