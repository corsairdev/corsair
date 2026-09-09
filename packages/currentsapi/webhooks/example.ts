import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiWebhooks } from '..';
import {
	createCurrentsApiMatch,
	verifyCurrentsApiWebhookSignature,
} from './types';

export const example: CurrentsApiWebhooks['example'] = {
	match: createCurrentsApiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCurrentsApiWebhookSignature(request, ctx.key);
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
			'currentsapi.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
