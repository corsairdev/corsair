import { logEventFromContext } from 'corsair/core';
import type { TwilioWebhooks } from '../index';
import { createTwilioMatch, verifyTwilioWebhookSignature } from './types';

export const received: TwilioWebhooks['messageReceived'] = {
	match: createTwilioMatch((body) => {
		return (
			typeof body.MessageSid === 'string' &&
			typeof body.Body === 'string' &&
			!('MessageStatus' in body)
		);
	}),

	handler: async (ctx, request) => {
		const url = request.headers['x-forwarded-url'] ?? '';
		const signature = request.headers['x-twilio-signature'] ?? '';
		// Twilio webhook payloads arrive as form-urlencoded key=value pairs (all string values),
		// but the typed payload uses a structured Zod schema — cast to Record<string, string> for signature verification
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
			'twilio.webhook.message.received',
			{ MessageSid: event.MessageSid, From: event.From, To: event.To },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const statusUpdate: TwilioWebhooks['messageStatus'] = {
	match: createTwilioMatch((body) => {
		return (
			typeof body.MessageSid === 'string' &&
			typeof body.MessageStatus === 'string'
		);
	}),

	handler: async (ctx, request) => {
		const url = request.headers['x-forwarded-url'] ?? '';
		const signature = request.headers['x-twilio-signature'] ?? '';
		// Twilio webhook payloads arrive as form-urlencoded key=value pairs (all string values),
		// but the typed payload uses a structured Zod schema — cast to Record<string, string> for signature verification
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
			'twilio.webhook.message.status',
			{ MessageSid: event.MessageSid, MessageStatus: event.MessageStatus },
			'completed',
		);

		return { success: true, data: event };
	},
};
