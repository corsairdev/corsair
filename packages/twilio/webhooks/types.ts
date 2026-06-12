import { createHmac, timingSafeEqual } from 'node:crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';
import { z } from 'zod';

// ── Incoming SMS Webhook ──────────────────────────────────────────────────────

export const MessageReceivedEventSchema = z.object({
	MessageSid: z.string(),
	SmsSid: z.string().optional(),
	AccountSid: z.string(),
	MessagingServiceSid: z.string().optional(),
	From: z.string(),
	To: z.string(),
	Body: z.string(),
	NumMedia: z.string(),
	NumSegments: z.string().optional(),
	SmsStatus: z.string().optional(),
	ApiVersion: z.string().optional(),
	FromCity: z.string().optional(),
	FromState: z.string().optional(),
	FromCountry: z.string().optional(),
	FromZip: z.string().optional(),
	ToCity: z.string().optional(),
	ToState: z.string().optional(),
	ToCountry: z.string().optional(),
	ToZip: z.string().optional(),
});

export type MessageReceivedEvent = z.infer<typeof MessageReceivedEventSchema>;

// ── Message Status Callback ───────────────────────────────────────────────────

export const MessageStatusEventSchema = z.object({
	MessageSid: z.string(),
	AccountSid: z.string(),
	From: z.string(),
	To: z.string(),
	MessageStatus: z.enum([
		'accepted',
		'queued',
		'sending',
		'sent',
		'delivered',
		'undelivered',
		'failed',
		'receiving',
		'received',
		'read',
	]),
	ErrorCode: z.string().optional(),
	ErrorMessage: z.string().optional(),
	ApiVersion: z.string().optional(),
});

export type MessageStatusEvent = z.infer<typeof MessageStatusEventSchema>;

// ── Call Status Callback ──────────────────────────────────────────────────────

export const CallStatusEventSchema = z.object({
	CallSid: z.string(),
	AccountSid: z.string(),
	From: z.string(),
	To: z.string(),
	CallStatus: z.enum([
		'queued',
		'ringing',
		'in-progress',
		'completed',
		'busy',
		'no-answer',
		'canceled',
		'failed',
	]),
	Direction: z.string().optional(),
	Duration: z.string().optional(),
	CallDuration: z.string().optional(),
	ApiVersion: z.string().optional(),
	Timestamp: z.string().optional(),
	SequenceNumber: z.string().optional(),
});

export type CallStatusEvent = z.infer<typeof CallStatusEventSchema>;

// ── Aggregate Types ───────────────────────────────────────────────────────────

export type TwilioWebhookOutputs = {
	messageReceived: MessageReceivedEvent;
	messageStatus: MessageStatusEvent;
	callStatus: CallStatusEvent;
};

// ── Webhook Matchers ──────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			// Twilio webhooks are form-urlencoded, try parsing as such
			const params = new URLSearchParams(body);
			const obj: Record<string, unknown> = {};
			for (const [key, value] of params) {
				obj[key] = value;
			}
			return Object.keys(obj).length > 0 ? obj : null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createTwilioMatch(
	matchFn: (body: Record<string, unknown>) => boolean,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && matchFn(parsedBody);
	};
}

// ── Signature Verification ────────────────────────────────────────────────────

/**
 * Verifies a Twilio webhook request signature using HMAC-SHA1.
 *
 * Twilio generates the X-Twilio-Signature by:
 * 1. Taking the full webhook URL
 * 2. Sorting all POST parameters alphabetically by key
 * 3. Concatenating each key + value to the URL
 * 4. Computing HMAC-SHA1 with the Auth Token as secret
 * 5. Base64 encoding the result
 */
export function verifyTwilioWebhookSignature(
	url: string,
	params: Record<string, string>,
	signature: string,
	authToken: string,
): { valid: boolean; error?: string } {
	if (!signature) {
		return { valid: false, error: 'Missing X-Twilio-Signature header' };
	}

	if (!authToken) {
		return { valid: false, error: 'Missing auth token for verification' };
	}

	// Build the data string: URL + sorted params concatenated
	const sortedKeys = Object.keys(params).sort();
	let data = url;
	for (const key of sortedKeys) {
		data += key + params[key];
	}

	// Compute HMAC-SHA1
	const expectedSignature = createHmac('sha1', authToken)
		.update(data)
		.digest('base64');

	// Use timing-safe comparison to prevent timing side-channel attacks
	const expectedBuf = Buffer.from(expectedSignature);
	const actualBuf = Buffer.from(signature);
	const valid =
		expectedBuf.length === actualBuf.length &&
		timingSafeEqual(expectedBuf, actualBuf);
	return valid
		? { valid: true }
		: { valid: false, error: 'Signature verification failed' };
}
