import { logEventFromContext } from 'corsair/core';
import type { OuraWebhooks } from '..';
import { createOuraMatch, verifyOuraWebhookSignature } from './types';

export const dailySleep: OuraWebhooks['dailySleep'] = {
	match: createOuraMatch('daily_sleep'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyOuraWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.data_type !== 'daily_sleep') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'oura.webhook.dailySleep',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
