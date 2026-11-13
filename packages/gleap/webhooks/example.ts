import { logEventFromContext } from 'corsair/core';
import type { GleapWebhooks } from '..';
import { createGleapMatch, verifyGleapWebhookSignature } from './types';

export const example: GleapWebhooks['example'] = {
	match: createGleapMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGleapWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'gleap.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
