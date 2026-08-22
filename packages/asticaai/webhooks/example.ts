import { logEventFromContext } from 'corsair/core';
import type { AsticaAiWebhooks } from '..';
import { createAsticaAiMatch, verifyAsticaAiWebhookSignature } from './types';

export const example: AsticaAiWebhooks['example'] = {
	match: createAsticaAiMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAsticaAiWebhookSignature(request, ctx.key);
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
			'asticaai.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
