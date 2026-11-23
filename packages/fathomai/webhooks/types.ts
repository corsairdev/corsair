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

/**
 * How many delivery ids each process remembers to refuse a replayed delivery. Fathom's
 * `webhook-timestamp` cannot bound replays (see verifyFathomAiWebhook), so a repeat
 * `webhook-id` is refused instead. Memory only: another process, or this one after a
 * restart, accepts a delivery it has not seen.
 */
export const FATHOM_AI_REMEMBERED_DELIVERIES = 10_000;

const seenDeliveries = new Set<string>();

/**
 * Claims a delivery id for one account. Returns false when the id was already claimed,
 * so a duplicate or replayed delivery is not handled twice. The oldest id is forgotten
 * once FATHOM_AI_REMEMBERED_DELIVERIES are held.
 */
export function claimFathomAiDelivery(scope: string, id: string): boolean {
	const key = `${scope}:${id}`;
	if (seenDeliveries.has(key)) return false;
	seenDeliveries.add(key);
	if (seenDeliveries.size > FATHOM_AI_REMEMBERED_DELIVERIES) {
		const oldest = seenDeliveries.values().next().value;
		if (oldest !== undefined) seenDeliveries.delete(oldest);
	}
	return true;
}

/** Releases a claimed id when handling failed, so Fathom's retry of it is handled. */
export function releaseFathomAiDelivery(scope: string, id: string): void {
	seenDeliveries.delete(`${scope}:${id}`);
}

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
//
// The timestamp is checked for format but not for age. Fathom's `webhook-timestamp` is not
// the send time: on 2026-11-23 every signed delivery from Fathom carried one of two frozen
// values (2026-11-22 19:14:08 and 21:45:23 UTC, likely the sending workers' start times), 10
// to 16 hours old on arrival and older every hour, so the usual five minute window refuses every
// real delivery. Replays are refused by `webhook-id` instead (claimFathomAiDelivery).
export function verifyFathomAiWebhook(
	// `unknown` payload: the signature covers the raw body, so verification never reads the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
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

	if (!/^\d{1,12}$/.test(timestamp)) {
		return { valid: false, error: 'Malformed webhook-timestamp' };
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
