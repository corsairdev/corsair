import { logEventFromContext } from 'corsair/core';
import type { ExistWebhooks } from '..';
import { createExistMatch, verifyExistWebhookSignature } from './types';

export const example: ExistWebhooks['example'] = {
	match: createExistMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyExistWebhookSignature(request, ctx.key);
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
			'exist.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
