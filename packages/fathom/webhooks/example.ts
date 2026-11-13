import { logEventFromContext } from 'corsair/core';
import type { FathomWebhooks } from '..';
import { createFathomMatch, verifyFathomWebhookSignature } from './types';

export const example: FathomWebhooks['example'] = {
	match: createFathomMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyFathomWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'fathom.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
