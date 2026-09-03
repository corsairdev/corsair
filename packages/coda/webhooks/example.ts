import { logEventFromContext } from 'corsair/core';
import type { CodaWebhooks } from '..';
import { createCodaMatch, verifyCodaWebhookSignature } from './types';

export const example: CodaWebhooks['example'] = {
	match: createCodaMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyCodaWebhookSignature(request, ctx.key);
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
			'coda.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
