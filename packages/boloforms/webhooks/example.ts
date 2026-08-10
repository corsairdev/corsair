import { logEventFromContext } from 'corsair/core';
import type { BoloformsWebhooks } from '..';
import { createBoloformsMatch, verifyBoloformsWebhookSignature } from './types';

export const example: BoloformsWebhooks['example'] = {
	match: createBoloformsMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBoloformsWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'boloforms.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
