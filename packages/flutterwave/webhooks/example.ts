import { logEventFromContext } from 'corsair/core';
import type { FlutterwaveWebhooks } from '..';
import {
	createFlutterwaveMatch,
	verifyFlutterwaveWebhookSignature,
} from './types';

export const example: FlutterwaveWebhooks['example'] = {
	match: createFlutterwaveMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFlutterwaveWebhookSignature(request, ctx.key);
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
			'flutterwave.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
