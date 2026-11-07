import { logEventFromContext } from 'corsair/core';
import type { MixmaxWebhooks } from '..';
import { createMixmaxMatch, verifyMixmaxWebhookSignature } from './types';

export const example: MixmaxWebhooks['example'] = {
	match: createMixmaxMatch('mixmax.event'),

	handler: async (ctx, request) => {
		const verification = verifyMixmaxWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'mixmax.event') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'mixmax.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};