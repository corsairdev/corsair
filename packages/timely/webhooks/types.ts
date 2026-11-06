import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/**
 * Timely delivers every webhook as `{ event, payload }`, where `payload` is a
 * thin reference to the changed record (not the full record — fetch it with
 * the matching `get` operation). Verified against live deliveries 2026-11-07.
 */
export const TimelyWebhookPayloadSchema = z
	.object({
		event: z.string(),
		payload: z
			.object({
				entity_id: z.union([z.number(), z.string()]),
				entity_type: z.string(),
				entity_path: z.string().nullish(),
				entity_external_id: z.string().nullish(),
				updated_from: z.string().nullish(),
				updated_at: z.string().nullish(),
				status: z.string().nullish(),
				date: z.string().nullish(),
			})
			// unknown: Timely may add reference fields; kept loose.
			.catchall(z.unknown()),
	})
	// unknown: Timely may add envelope fields; kept loose.
	.catchall(z.unknown());

export type TimelyWebhookPayload = z.infer<typeof TimelyWebhookPayloadSchema>;

export const TIMELY_WEBHOOK_EVENT_NAMES = {
	timeEntries: 'hours',
	projects: 'projects',
	tags: 'labels',
	tasks: 'forecasts',
} as const;

export type TimelyWebhookResource = keyof typeof TIMELY_WEBHOOK_EVENT_NAMES;
export type TimelyWebhookAction = 'created' | 'updated' | 'deleted';

export function timelyEventName(
	resource: TimelyWebhookResource,
	action: TimelyWebhookAction,
): string {
	return `${TIMELY_WEBHOOK_EVENT_NAMES[resource]}:${action}`;
}

// unknown: raw webhook bodies arrive as string, Buffer or parsed JSON.
function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	if (Buffer.isBuffer(body)) return parseBody(body.toString('utf8'));
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

const TIMELY_EVENT_PATTERN =
	/^(hours|projects|labels|forecasts):(created|updated|deleted)$/;

/** True for any Timely webhook body: `{ event: "<resource>:<action>", payload: {...} }`. */
export function isTimelyWebhookBody(body: unknown): boolean {
	const parsed = parseBody(body);
	if (!parsed || typeof parsed.event !== 'string') return false;
	const payload = parsed.payload;
	return (
		TIMELY_EVENT_PATTERN.test(parsed.event) &&
		payload !== null &&
		typeof payload === 'object' &&
		'entity_type' in payload
	);
}

export function createTimelyMatch(eventName: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		if (!isTimelyWebhookBody(request.body)) return false;
		return parseBody(request.body)?.event === eventName;
	};
}

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

/**
 * Returns the exact bytes of the top-level `payload` object inside the raw
 * body. Timely signs those bytes, not the whole body.
 */
export function extractRawPayload(rawBody: string): string | undefined {
	const marker = rawBody.indexOf('"payload"');
	if (marker < 0) return undefined;
	let i = rawBody.indexOf(':', marker + '"payload"'.length);
	if (i < 0) return undefined;
	i++;
	while (i < rawBody.length && /\s/.test(rawBody[i] ?? '')) i++;
	if (rawBody[i] !== '{') return undefined;
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let j = i; j < rawBody.length; j++) {
		const c = rawBody[j];
		if (inString) {
			if (escaped) escaped = false;
			else if (c === '\\') escaped = true;
			else if (c === '"') inString = false;
			continue;
		}
		if (c === '"') inString = true;
		else if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) return rawBody.slice(i, j + 1);
		}
	}
	return undefined;
}

// unknown: raw bodies can be string, Buffer or Uint8Array depending on the framework.
function asRawText(value: unknown): string | undefined {
	if (typeof value === 'string') return value;
	if (Buffer.isBuffer(value)) return value.toString('utf8');
	if (value instanceof Uint8Array) return Buffer.from(value).toString('utf8');
	return undefined;
}

function safeEqualHex(provided: string, expected: string): boolean {
	const a = Buffer.from(provided.trim().toLowerCase());
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Verifies Timely's `X-Signature` header: hex HMAC-SHA256, keyed with the
 * webhook's `secret_token`, over the JSON of the `payload` object. Timely sends
 * no signature for webhooks created without a secret; those fail closed.
 */
export function verifyTimelyWebhookSignature(
	request: WebhookRequest<TimelyWebhookPayload> | RawWebhookRequest,
	secret: string,
): { valid: boolean; error?: string } {
	if ('hubVerified' in request && request.hubVerified) return { valid: true };

	if (!secret) {
		return {
			valid: false,
			error:
				'Missing Timely webhook secret: store the webhook secret_token as webhook_signature or pass timely({ webhookSecret })',
		};
	}

	const signature = headerValue(
		request.headers as Record<string, string | string[] | undefined>,
		'x-signature',
	);
	if (!signature) {
		return {
			valid: false,
			error:
				'Missing X-Signature header (create the Timely webhook with a secret_token)',
		};
	}

	const candidates: string[] = [];
	const rawText =
		asRawText('rawBody' in request ? request.rawBody : undefined) ??
		asRawText('body' in request ? request.body : undefined);
	const rawPayload = rawText ? extractRawPayload(rawText) : undefined;
	if (rawPayload) candidates.push(rawPayload);
	// Fallback for frameworks that only hand over parsed JSON: Timely's own
	// serialization is compact JSON in key order, which JSON.stringify matches.
	const parsedPayload = parseBody(
		rawText ??
			('payload' in request
				? request.payload
				: 'body' in request
					? request.body
					: undefined),
	)?.payload;
	if (parsedPayload && typeof parsedPayload === 'object') {
		const reserialized = JSON.stringify(parsedPayload);
		if (!candidates.includes(reserialized)) candidates.push(reserialized);
	}
	if (candidates.length === 0) {
		return { valid: false, error: 'Webhook body has no payload to verify' };
	}

	for (const candidate of candidates) {
		const expected = createHmac('sha256', secret)
			.update(candidate)
			.digest('hex');
		if (safeEqualHex(signature, expected)) return { valid: true };
	}
	return { valid: false, error: 'Signature mismatch' };
}
