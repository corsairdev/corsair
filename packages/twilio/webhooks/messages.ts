import { logEventFromContext } from 'corsair/core';
import type { TwilioWebhooks } from '..';
import {
	createTwilioMatch,
	verifyTwilioWebhookSignature,
} from './types';

export const received: TwilioWebhooks['messagesReceived'] = {
	match: createTwilioMatch('messagesReceived'),
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
		await logEventFromContext(ctx, 'twilio.webhook.message.received', { ...event }, 'completed');

		return { success: true, data: event };
	},
};

export const status: TwilioWebhooks['messagesStatus'] = {
	match: createTwilioMatch('messagesStatus'),
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
		await logEventFromContext(ctx, 'twilio.webhook.message.status', { ...event }, 'completed');

		return { success: true, data: event };
	},
};