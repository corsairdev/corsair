import { logEventFromContext } from 'corsair/core';
import type { WixWebhooks } from '..';
import { createWixMatch, verifyWixWebhookSignature } from './types';

export const example: WixWebhooks['example'] = {
	match: createWixMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyWixWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'wix.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
