import { logEventFromContext } from 'corsair/core';
import type { GriptapeWebhooks } from '..';
import { createGriptapeMatch, verifyGriptapeWebhookSignature } from './types';

export const example: GriptapeWebhooks['example'] = {
	match: createGriptapeMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGriptapeWebhookSignature(request, ctx.key);
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
			'griptape.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
