import { logEventFromContext } from 'corsair/core';
import type { TwilioWebhooks } from '..';
import {
	createTwilioMatch,
	verifyTwilioWebhookSignature,
} from './types';

export const status: TwilioWebhooks['callsStatus'] = {
	match: createTwilioMatch('callsStatus'),
	handler: async (ctx, request) => {
		const verification = verifyTwilioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(ctx, 'twilio.webhook.call.status', { ...event }, 'completed');

		return { success: true, data: event };
	},
};