import { logEventFromContext } from 'corsair/core';
import type { RazorpayWebhooks } from '..';
import { createRazorpayMatch, verifyRazorpayWebhookSignature } from './types';

export const example: RazorpayWebhooks['example'] = {
	match: createRazorpayMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyRazorpayWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'razorpay.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
