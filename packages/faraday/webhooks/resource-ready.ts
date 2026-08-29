import { logEventFromContext } from 'corsair/core';
import type { FaradayWebhooks } from '..';
import { createFaradayMatch, verifyFaradayWebhookSignature } from './types';

export const resourceReady: FaradayWebhooks['resourceReady'] = {
	match: createFaradayMatch('resource.ready_with_update'),

	handler: async (ctx, request) => {
		const verification = verifyFaradayWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const eventId = await logEventFromContext(
			ctx,
			'faraday.webhook.resourceReady',
			{ ...request.payload },
			'completed',
		);
		if (!eventId) {
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to record webhook event',
			};
		}

		return { success: true, data: request.payload };
	},
};
