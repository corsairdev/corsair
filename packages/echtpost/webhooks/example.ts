import { logEventFromContext } from 'corsair/core';
import type { EchtpostWebhooks } from '..';
import { createEchtpostMatch, verifyEchtpostWebhookSignature } from './types';

export const example: EchtpostWebhooks['example'] = {
	match: createEchtpostMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyEchtpostWebhookSignature(request, ctx.key);
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
			'echtpost.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
