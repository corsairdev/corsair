import { logEventFromContext } from 'corsair/core';
import type { TyplessWebhooks } from '..';
import { createTyplessMatch, verifyTyplessWebhookSignature } from './types';

export const example: TyplessWebhooks['example'] = {
	match: createTyplessMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyTyplessWebhookSignature(request, ctx.key);
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
			'typless.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
