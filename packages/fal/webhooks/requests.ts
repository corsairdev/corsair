import { logEventFromContext } from 'corsair/core';
import type { FalWebhooks } from '..';
import { matchRequestCompleted, verifyFalWebhookSignature } from './types';

export const completed: FalWebhooks['requestCompleted'] = {
	match: matchRequestCompleted,

	handler: async (ctx, request) => {
		const verification = await verifyFalWebhookSignature(request);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error:
					verification.error || 'fal webhook signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'fal.webhook.requests.completed',
			{ requestId: event.request_id, status: event.status },
			'completed',
		);

		return { success: true, data: event };
	},
};
