import { logEventFromContext } from 'corsair/core';
import type { BeaconstacWebhooks } from '..';
import {
	createBeaconstacMatch,
	verifyBeaconstacWebhookSignature,
} from './types';

export const example: BeaconstacWebhooks['example'] = {
	match: createBeaconstacMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBeaconstacWebhookSignature(request, ctx.key);
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
			'beaconstac.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
