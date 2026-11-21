import { logEventFromContext } from 'corsair/core';
import type { MailerLiteWebhooks } from '..';
import { createMailerLiteMatch, verifyMailerLiteWebhookSignature } from './types';

export const example: MailerLiteWebhooks['example'] = {
	match: createMailerLiteMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyMailerLiteWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'mailerlite.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
