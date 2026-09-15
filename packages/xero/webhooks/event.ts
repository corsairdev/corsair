import { logEventFromContext } from 'corsair/core';
import type { XeroWebhooks } from '../index';
import { createXeroEventMatch, verifyXeroWebhookSignature } from './types';

export const eventWebhook: XeroWebhooks['event'] = {
	match: createXeroEventMatch(),

	handler: async (ctx, request) => {
		const verification = verifyXeroWebhookSignature(request, ctx.key);
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
			'xero.webhook.event',
			{ count: event.events?.length ?? 0 },
			'completed',
		);

		return { success: true, data: event };
	},
};
