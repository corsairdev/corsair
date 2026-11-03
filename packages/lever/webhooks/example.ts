import { logEventFromContext } from 'corsair/core';
import type { LeverWebhooks } from '..';
import { createLeverMatch, verifyLeverWebhookSignature } from './types';

export const example: LeverWebhooks['example'] = {
	match: createLeverMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyLeverWebhookSignature(request, ctx.key);
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
			'lever.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
