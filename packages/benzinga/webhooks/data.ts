import { logEventFromContext } from 'corsair/core';
import type { BenzingaWebhooks } from '..';
import {
	matchBenzingaDataWebhook,
	verifyBenzingaWebhookSignature,
} from './types';

export const data: BenzingaWebhooks['data'] = {
	match: matchBenzingaDataWebhook,

	handler: async (ctx, request) => {
		const verification = verifyBenzingaWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'benzinga.webhook.data',
			{ id: event.id, kind: event.kind },
			'completed',
		);

		return { success: true, data: event };
	},
};
