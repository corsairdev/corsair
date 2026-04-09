import { logEventFromContext } from 'corsair/core';
import type { OuraWebhooks } from '..';
import { createOuraMatch, verifyOuraWebhookSignature } from './types';

export const dailyReadiness: OuraWebhooks['dailyReadiness'] = {
	match: createOuraMatch('daily_readiness'),

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

		if (event.data_type !== 'daily_readiness') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'oura.webhook.dailyReadiness',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
