import { logEventFromContext } from 'corsair/core';
import type { TrustpilotWebhooks } from '..';
import { createTrustpilotMatch, verifyTrustpilotWebhookSignature } from './types';

export const example: TrustpilotWebhooks['example'] = {
	match: createTrustpilotMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyTrustpilotWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'trustpilot.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
