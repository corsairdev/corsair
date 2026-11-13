import { logEventFromContext } from 'corsair/core';
import type { ElorusWebhooks } from '..';
import { createElorusMatch, verifyElorusWebhookSignature } from './types';

export const example: ElorusWebhooks['example'] = {
	match: createElorusMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyElorusWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'elorus.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
