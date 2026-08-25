import { logEventFromContext } from 'corsair/core';
import type { AscoraWebhooks } from '..';
import { createAscoraMatch, verifyAscoraWebhookSignature } from './types';

export const example: AscoraWebhooks['example'] = {
	match: createAscoraMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAscoraWebhookSignature(request, ctx.key);
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
			'ascora.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
