import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import type { EventPayload } from '../endpoints/types';
import { EventPayloadSchema } from '../endpoints/types';

const SIGNATURE_HEADER = 'x-xquik-signature';
const TIMESTAMP_HEADER = 'x-xquik-timestamp';
const NONCE_HEADER = 'x-xquik-nonce';
const SIGNATURE_PREFIX = 'sha256=';
const DEFAULT_MAX_AGE_MS = 5 * 60 * 1000;

export type XquikWebhookPayload = EventPayload;

export type XquikWebhookOutputs = {
	monitorEvent: XquikWebhookPayload;
	test: XquikWebhookPayload;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object'
				? (parsed as Record<string, unknown>)
				: {};
		} catch {
			return {};
		}
	}

	return body !== null && typeof body === 'object'
		? (body as Record<string, unknown>)
		: {};
}

function firstHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const direct = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(direct)) return direct[0];
	if (typeof direct === 'string') return direct;

	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== name) continue;
		if (Array.isArray(value)) return value[0];
		if (typeof value === 'string') return value;
	}

	return undefined;
}

function isFreshTimestamp(timestamp: string): boolean {
	const parsed = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(parsed)) return false;
	return Math.abs(Date.now() - parsed) <= DEFAULT_MAX_AGE_MS;
}

function signedPayload(
	timestamp: string,
	nonce: string,
	rawBody: string,
): string {
	return `${timestamp}.${nonce}.${rawBody}`;
}

function expectedSignature(
	timestamp: string,
	nonce: string,
	rawBody: string,
	secret: string,
): string {
	const digest = createHmac('sha256', secret)
		.update(signedPayload(timestamp, nonce, rawBody))
		.digest('hex');
	return `${SIGNATURE_PREFIX}${digest}`;
}

export function hasXquikSignature(request: RawWebhookRequest): boolean {
	return firstHeader(request.headers, SIGNATURE_HEADER) !== undefined;
}

export function createXquikMatch(
	eventType: XquikWebhookPayload['eventType'],
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = EventPayloadSchema.safeParse(parseBody(request.body));
		return parsed.success && parsed.data.eventType === eventType;
	};
}

export function createXquikMonitorEventMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = EventPayloadSchema.safeParse(parseBody(request.body));
		return parsed.success && parsed.data.eventType !== 'webhook.test';
	};
}

export function verifyXquikWebhookSignature(
	request: WebhookRequest<XquikWebhookPayload>,
	secret: string,
): { error?: string; valid: boolean } {
	if (secret.length === 0) {
		return { valid: true };
	}

	const signature = firstHeader(request.headers, SIGNATURE_HEADER);
	const timestamp = firstHeader(request.headers, TIMESTAMP_HEADER);
	const nonce = firstHeader(request.headers, NONCE_HEADER);

	if (signature === undefined) {
		return { error: 'Missing X-Xquik-Signature header', valid: false };
	}
	if (timestamp === undefined) {
		return { error: 'Missing X-Xquik-Timestamp header', valid: false };
	}
	if (nonce === undefined) {
		return { error: 'Missing X-Xquik-Nonce header', valid: false };
	}
	if (!isFreshTimestamp(timestamp)) {
		return { error: 'Stale Xquik webhook timestamp', valid: false };
	}
	if (request.rawBody === undefined) {
		return {
			error: 'Missing raw body for signature verification',
			valid: false,
		};
	}

	const expected = expectedSignature(timestamp, nonce, request.rawBody, secret);

	if (expected.length !== signature.length) {
		return { error: 'Invalid Xquik webhook signature', valid: false };
	}

	const valid = timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
	return valid
		? { valid }
		: { error: 'Invalid Xquik webhook signature', valid: false };
}
