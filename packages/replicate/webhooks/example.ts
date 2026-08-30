import { logEventFromContext } from 'corsair/core';
import type { ReplicateWebhooks } from '..';
import { createReplicateMatch, verifyReplicateWebhookSignature } from './types';

export const example: ReplicateWebhooks['example'] = {
	match: createReplicateMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyReplicateWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'replicate.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
