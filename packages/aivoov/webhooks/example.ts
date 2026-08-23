import { logEventFromContext } from 'corsair/core';
import type { AivoovWebhooks } from '..';
import { createAivoovMatch, verifyAivoovWebhookSignature } from './types';

export const example: AivoovWebhooks['example'] = {
	match: createAivoovMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyAivoovWebhookSignature(request, ctx.key);
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
			'aivoov.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
