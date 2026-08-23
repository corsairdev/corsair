import { logEventFromContext } from 'corsair/core';
import type { DiffbotWebhooks } from '..';
import { createDiffbotMatch, verifyDiffbotWebhookSignature } from './types';

export const example: DiffbotWebhooks['example'] = {
	match: createDiffbotMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDiffbotWebhookSignature(request, ctx.key);
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
			'diffbot.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
