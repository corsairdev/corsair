import { logEventFromContext } from 'corsair/core';
import type { BoldsignWebhooks } from '..';
import { createBoldsignMatch, verifyBoldsignWebhookSignature } from './types';

export const example: BoldsignWebhooks['example'] = {
	match: createBoldsignMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBoldsignWebhookSignature(request, ctx.key);
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
			'boldsign.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
