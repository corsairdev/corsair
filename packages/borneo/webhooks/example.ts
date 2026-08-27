import { logEventFromContext } from 'corsair/core';
import type { BorneoWebhooks } from '..';
import { createBorneoMatch, verifyBorneoWebhookSignature } from './types';

export const example: BorneoWebhooks['example'] = {
	match: createBorneoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBorneoWebhookSignature(request, ctx.key);
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
			'borneo.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
