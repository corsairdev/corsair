import { logEventFromContext } from 'corsair/core';
import type { CloudcartWebhooks } from '..';
import { createCloudcartMatch, verifyCloudcartWebhookSignature } from './types';

export const example: CloudcartWebhooks['example'] = {
	match: createCloudcartMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCloudcartWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'cloudcart.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
