import { logEventFromContext } from 'corsair/core';
import type { SevdeskWebhooks } from '..';
import { createSevdeskMatch, verifySevdeskWebhookSignature } from './types';

export const example: SevdeskWebhooks['example'] = {
	match: createSevdeskMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySevdeskWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'sevdesk.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
