import { createHmac, timingSafeEqual } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { getHeader, readBodyRecord } from 'corsair/core';
import type { Meeting } from '../endpoints/types';
import { MeetingSchema } from '../endpoints/types';

export const MeetingContentReadyEventSchema = MeetingSchema;
export type MeetingContentReadyEvent = Meeting;

export type FathomAiWebhookOutputs = {
	meetingContentReady: MeetingContentReadyEvent;
};

const SIGNATURE_TOLERANCE_SECONDS = 300;

export function isFathomAiDelivery(request: RawWebhookRequest): boolean {
	const body = readBodyRecord(request);
	return (
		getHeader(request.headers, 'webhook-id') !== undefined &&
		getHeader(request.headers, 'webhook-timestamp') !== undefined &&
		getHeader(request.headers, 'webhook-signature') !== undefined &&
		typeof body?.recording_id === 'number' &&
		typeof body.share_url === 'string'
	);
}

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

// Fathom signs with the Standard Webhooks scheme: base64 HMAC-SHA256 over
// `${webhook-id}.${webhook-timestamp}.${raw body}`, keyed by the base64 secret after `whsec_`.
export function verifyFathomAiWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	now: number = Math.floor(Date.now() / 1000),
): { valid: true } | { valid: false; error: string } {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Fathom webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	if (request.rawBody === undefined) {
		return { valid: false, error: 'Missing raw body' };
	}

	const id = getHeader(request.headers, 'webhook-id');
	const timestamp = getHeader(request.headers, 'webhook-timestamp');
	const signatures = getHeader(request.headers, 'webhook-signature');
	if (!id || !timestamp || !signatures) {
		return { valid: false, error: 'Missing webhook signature headers' };
	}

	const sentAt = Number(timestamp);
	if (
		!Number.isInteger(sentAt) ||
		Math.abs(now - sentAt) > SIGNATURE_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'Webhook timestamp outside tolerance' };
	}

	const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${request.rawBody}`)
		.digest('base64');
	const matches = signatures
		.split(' ')
		.some((entry) => safeEqual(entry.slice(entry.indexOf(',') + 1), expected));

	return matches
		? { valid: true }
		: { valid: false, error: 'Invalid webhook signature' };
}
