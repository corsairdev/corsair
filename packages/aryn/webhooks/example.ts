import { logEventFromContext } from 'corsair/core';
import type { ArynWebhooks } from '..';
import { createArynMatch, verifyArynWebhookSignature } from './types';

export const example: ArynWebhooks['example'] = {
	match: createArynMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyArynWebhookSignature(request, ctx.key);
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

		await logEventFromContext(
			ctx,
			'aryn.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
