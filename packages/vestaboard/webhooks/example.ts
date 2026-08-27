import { logEventFromContext } from 'corsair/core';
import type { VestaboardWebhooks } from '..';
import { createVestaboardMatch, verifyVestaboardWebhookSignature } from './types';

export const example: VestaboardWebhooks['example'] = {
	match: createVestaboardMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyVestaboardWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'vestaboard.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
