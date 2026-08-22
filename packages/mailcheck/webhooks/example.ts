import { logEventFromContext } from 'corsair/core';
import type { MailcheckWebhooks } from '..';
import { createMailcheckMatch, verifyMailcheckWebhookSignature } from './types';

export const example: MailcheckWebhooks['example'] = {
	match: createMailcheckMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyMailcheckWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'mailcheck.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
