import { logEventFromContext } from 'corsair/core';
import type { FingertipWebhooks } from '..';
import { createFingertipMatch, verifyFingertipWebhookSignature } from './types';

export const example: FingertipWebhooks['example'] = {
	match: createFingertipMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFingertipWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'fingertip.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
