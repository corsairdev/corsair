import { logEventFromContext } from 'corsair/core';
import type { AppdragWebhooks } from '..';
import { createAppdragMatch, verifyAppdragWebhookSignature } from './types';

export const example: AppdragWebhooks['example'] = {
	match: createAppdragMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAppdragWebhookSignature(request, ctx.key);
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
			'appdrag.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
