import { logEventFromContext } from 'corsair/core';
import type { MetaAdsWebhooks } from '..';
import { createMetaAdsMatch, verifyMetaAdsWebhookSignature } from './types';

export const example: MetaAdsWebhooks['example'] = {
	match: createMetaAdsMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyMetaAdsWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'metaads.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
