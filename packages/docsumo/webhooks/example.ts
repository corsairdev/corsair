import { logEventFromContext } from 'corsair/core';
import type { DocsumoWebhooks } from '..';
import { createDocsumoMatch, verifyDocsumoWebhookSignature } from './types';

export const example: DocsumoWebhooks['example'] = {
	match: createDocsumoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDocsumoWebhookSignature(request, ctx.key);
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

		await logEventFromContext(
			ctx,
			'docsumo.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
