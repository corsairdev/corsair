import { logEventFromContext } from 'corsair/core';
import type { DocmosisWebhooks } from '..';
import { createDocmosisMatch, verifyDocmosisWebhookSignature } from './types';

export const example: DocmosisWebhooks['example'] = {
	match: createDocmosisMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDocmosisWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'docmosis.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
