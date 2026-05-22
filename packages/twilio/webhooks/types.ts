import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

const TwilioWebhookBaseSchema = z.object({}).passthrough();

export const TwilioMessageReceivedWebhookSchema = TwilioWebhookBaseSchema.extend({
	AccountSid: z.string(),
	MessageSid: z.string(),
	SmsSid: z.string().optional(),
	SmsMessageSid: z.string().optional(),
	MessageStatus: z.string().optional(),
	From: z.string(),
	To: z.string(),
	Body: z.string(),
	NumMedia: z.string().optional(),
	FromCity: z.string().optional(),
	FromState: z.string().optional(),
	FromZip: z.string().optional(),
	FromCountry: z.string().optional(),
	ToCity: z.string().optional(),
	ToState: z.string().optional(),
	ToZip: z.string().optional(),
	ToCountry: z.string().optional(),
});

export type TwilioMessageReceivedWebhook = z.infer<
	typeof TwilioMessageReceivedWebhookSchema
>;

export const TwilioMessageStatusWebhookSchema = TwilioWebhookBaseSchema.extend({
	AccountSid: z.string(),
	MessageSid: z.string(),
	MessageStatus: z.enum([
		'queued',
		'sending',
		'sent',
		'failed',
		'delivered',
		'undelivered',
		'receiving',
		'received',
		'accepted',
		'scheduled',
		'read',
		'partially_delivered',
		'canceled',
	]),
	ErrorCode: z.string().optional(),
	RawDlrDoneDate: z.string().optional(),
	ChannelInstallSid: z.string().optional(),
	ChannelStatusMessage: z.string().optional(),
	ChannelPrefix: z.string().optional(),
	EventType: z.string().optional(),
});

export type TwilioMessageStatusWebhook = z.infer<
	typeof TwilioMessageStatusWebhookSchema
>;

export const TwilioCallStatusWebhookSchema = TwilioWebhookBaseSchema.extend({
	AccountSid: z.string(),
	CallSid: z.string(),
	CallStatus: z.enum([
		'queued',
		'initiated',
		'ringing',
		'in-progress',
		'completed',
		'busy',
		'failed',
		'no-answer',
		'canceled',
	]),
	ApiVersion: z.string().optional(),
	From: z.string().optional(),
	To: z.string().optional(),
	Direction: z.string().optional(),
	CallDuration: z.string().optional(),
	Duration: z.string().optional(),
	SipResponseCode: z.string().optional(),
	RecordingUrl: z.string().optional(),
	RecordingSid: z.string().optional(),
	RecordingDuration: z.string().optional(),
	CallbackSource: z.string().optional(),
	SequenceNumber: z.string().optional(),
	StirStatus: z.string().optional(),
});

export type TwilioCallStatusWebhook = z.infer<typeof TwilioCallStatusWebhookSchema>;

export type TwilioWebhookOutputs = {
	messagesReceived: TwilioMessageReceivedWebhook;
	messagesStatus: TwilioMessageStatusWebhook;
	callsStatus: TwilioCallStatusWebhook;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			const params = new URLSearchParams(body);
			const parsed = Object.fromEntries(params.entries());
			return Object.keys(parsed).length > 0 ? parsed : null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createTwilioMatch(eventType: keyof TwilioWebhookOutputs): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		if (eventType === 'messagesReceived') {
			return typeof parsedBody.MessageSid === 'string' && typeof parsedBody.Body === 'string';
		}
		if (eventType === 'messagesStatus') {
			return typeof parsedBody.MessageSid === 'string' && typeof parsedBody.MessageStatus === 'string';
		}
		return typeof parsedBody.CallSid === 'string' && typeof parsedBody.CallStatus === 'string';
	};
}

export function verifyTwilioWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement webhook signature verification
	return { valid: true };
}
