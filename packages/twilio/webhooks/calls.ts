import { logEventFromContext } from 'corsair/core';
import type { TwilioWebhooks } from '../index';
import { createTwilioMatch, verifyTwilioWebhookSignature } from './types';

export const statusUpdate: TwilioWebhooks['callStatus'] = {
	match: createTwilioMatch((body) => {
		return (
			typeof body.CallSid === 'string' && typeof body.CallStatus === 'string'
		);
	}),

	handler: async (ctx, request) => {
		const url = request.headers['x-forwarded-url'] ?? '';
		const signature = request.headers['x-twilio-signature'] ?? '';
		const params = request.payload as unknown as Record<string, string>;

		const verification = verifyTwilioWebhookSignature(
			url as string,
			params,
			signature as string,
			ctx.key,
		);

		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'twilio.webhook.call.status',
			{ CallSid: event.CallSid, CallStatus: event.CallStatus },
			'completed',
		);

		return { success: true, data: event };
	},
};
