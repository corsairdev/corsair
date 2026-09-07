import { logEventFromContext } from 'corsair/core';
import type { WaboxappWebhooks } from '..';
import { createWaboxappMatch, verifyWaboxappWebhookSignature } from './types';

export const example: WaboxappWebhooks['message'] = {
	match: createWaboxappMatch('message'),

	handler: async (ctx, request) => {
		const verification = verifyWaboxappWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.event !== 'message') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'waboxapp.webhook.message',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
