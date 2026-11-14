import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveWebhooks } from '..';
import { createHoneyHiveMatch, verifyHoneyHiveWebhookSignature } from './types';

export const example: HoneyHiveWebhooks['example'] = {
	match: createHoneyHiveMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyHoneyHiveWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'honeyhive.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
