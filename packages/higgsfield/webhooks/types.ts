import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/** Deliveries signed further from now than this are refused (Standard Webhooks' tolerance). */
export const HIGGSFIELD_WEBHOOK_TOLERANCE_SECONDS = 5 * 60;

export const HIGGSFIELD_WEBHOOK_HEADERS = {
	id: 'webhook-id',
	timestamp: 'webhook-timestamp',
	signature: 'webhook-signature',
} as const;

/** Every status a delivery can carry, with canceled kept in case that changes. */
export const WEBHOOK_STATUSES = [
	'completed',
	'failed',
	'nsfw',
	'canceled',
] as const;

/** The statuses with no output, where a delivery may leave `payload` out. */
const NO_OUTPUT_STATUSES: readonly string[] = ['failed', 'nsfw', 'canceled'];

const WebhookMediaSchema = z
	.object({
		url: z.string().nullish(),
		content_type: z.string().nullish(),
	})
	.loose();

export const RequestCompletedPayloadSchema = z
	.object({
		request_id: z.string(),
		status: z
			.string()
			.describe(
				'completed: the output is in payload. failed: see error. nsfw: moderation rejected the input or output. Failed and nsfw requests are not charged.',
			),
		// unknown: documented as text; an object form must not lose a delivery.
		error: z.union([z.string(), z.record(z.string(), z.unknown())]).nullish(),
		expires_at: z
			.string()
			.nullish()
			.describe(
				'When the files in payload are deleted and their URLs stop working: 7 days after the request finished by default. Download them before then.',
			),
		payload: z
			.object({
				images: z.array(WebhookMediaSchema).nullish(),
				video: WebhookMediaSchema.nullish(),
				audio: WebhookMediaSchema.nullish(),
				audios: z.array(WebhookMediaSchema).nullish(),
			})
			.loose()
			.nullish()
			.describe(
				'The output, present when status is completed. Some video and 3D operations add artifacts such as zip, mov, jsx, fbx or ply.',
			),
	})
	.loose();

export type RequestCompletedPayload = z.infer<
	typeof RequestCompletedPayloadSchema
>;

export const RequestCompletedEventSchema = RequestCompletedPayloadSchema.extend(
	{
		webhook_id: z
			.string()
			.nullish()
			.describe(
				'The delivery’s webhook-id. Retries of one event share it, and duplicates are possible, so deduplicate by it.',
			),
	},
);

export type RequestCompletedEvent = z.infer<typeof RequestCompletedEventSchema>;

export type HiggsfieldWebhookOutputs = {
	requestCompleted: RequestCompletedEvent;
};

// unknown: a transport may hand the body over as text or already parsed.
function parseBody(body: unknown): Record<string, unknown> | null {
	// unknown: JSON.parse's result, narrowed just below.
	let value: unknown = body;
	if (typeof body === 'string') {
		try {
			value = JSON.parse(body);
		} catch {
			return null;
		}
	}
	return value && typeof value === 'object' && !Array.isArray(value)
		? // unknown: any JSON object; the caller checks the fields it reads.
			(value as Record<string, unknown>)
		: null;
}

/**
 * Deliveries are told apart by their envelope, because headers can't do it: the
 * webhook-* headers are the Standard Webhooks ones any provider may use, and an
 * unsigned delivery has none. The lower-case terminal status keeps fal's
 * similar envelope (status OK or ERROR) out. A failure with no `payload` key has
 * too little to go on by itself, so that form must also carry a signature.
 */
export const isHiggsfieldWebhook: CorsairWebhookMatcher = (
	request: RawWebhookRequest,
) => {
	const body = parseBody(request.body);
	if (
		body === null ||
		typeof body.request_id !== 'string' ||
		typeof body.status !== 'string' ||
		!(WEBHOOK_STATUSES as readonly string[]).includes(body.status)
	) {
		return false;
	}
	if ('payload' in body) return true;
	return (
		NO_OUTPUT_STATUSES.includes(body.status) &&
		Boolean(
			headerValue(request.headers, HIGGSFIELD_WEBHOOK_HEADERS.id) &&
				headerValue(request.headers, HIGGSFIELD_WEBHOOK_HEADERS.signature),
		)
	);
};

export const matchRequestCompleted = isHiggsfieldWebhook;

function headerValue(
	// unknown: the payload type plays no part in reading headers.
	headers: WebhookRequest<unknown>['headers'],
	name: string,
): string | undefined {
	const direct = headers[name];
	if (direct !== undefined) return Array.isArray(direct) ? direct[0] : direct;
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

// unknown: the payload type plays no part in reading headers.
export const webhookIdOf = (request: WebhookRequest<unknown>) =>
	headerValue(request.headers, HIGGSFIELD_WEBHOOK_HEADERS.id);

const STRICT_BASE64_RE =
	/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function decodeStrictBase64(value: string): Buffer | null {
	return value && STRICT_BASE64_RE.test(value)
		? Buffer.from(value, 'base64')
		: null;
}

export type HiggsfieldVerifyOptions = {
	/** The current time in milliseconds, for tests. */
	now?: number;
};

/**
 * Standard Webhooks, implemented with node:crypto instead of the
 * `standardwebhooks` package: this is all of it, and a plugin stays free of a
 * dependency (and its base64 helper) for about thirty lines. HMAC-SHA256 over
 * `id.timestamp.rawBody`, keyed with the base64 after `whsec_`; any of the
 * space-separated `v1,` signatures may match, since two are sent while a secret
 * rotates. Without a secret nothing verifies.
 */
export function verifyHiggsfieldWebhookSignature(
	// unknown: only the raw body is verified, never the parsed payload.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
	options: HiggsfieldVerifyOptions = {},
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: 'Missing webhook secret' };
	const key = secret.startsWith('whsec_')
		? decodeStrictBase64(secret.slice('whsec_'.length))
		: null;
	if (!key || key.length === 0) {
		return {
			valid: false,
			error: 'The webhook secret is malformed: it should start with whsec_',
		};
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return { valid: false, error: 'Missing raw body' };
	}

	const id = headerValue(request.headers, HIGGSFIELD_WEBHOOK_HEADERS.id);
	const timestamp = headerValue(
		request.headers,
		HIGGSFIELD_WEBHOOK_HEADERS.timestamp,
	);
	const signatures = headerValue(
		request.headers,
		HIGGSFIELD_WEBHOOK_HEADERS.signature,
	);
	if (!id || !timestamp || !signatures) {
		return { valid: false, error: 'The delivery is not signed' };
	}

	if (!/^\d{1,12}$/.test(timestamp)) {
		return { valid: false, error: 'Malformed webhook-timestamp' };
	}
	const now = options.now ?? Date.now();
	if (
		Math.abs(now / 1000 - Number(timestamp)) >
		HIGGSFIELD_WEBHOOK_TOLERANCE_SECONDS
	) {
		return { valid: false, error: 'The webhook timestamp is out of range' };
	}

	const expected = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest();
	const matched = signatures
		.split(/\s+/)
		.filter(Boolean)
		.some((entry) => {
			const comma = entry.indexOf(',');
			if (comma === -1 || entry.slice(0, comma) !== 'v1') return false;
			const candidate = decodeStrictBase64(entry.slice(comma + 1));
			return (
				candidate !== null &&
				candidate.length === expected.length &&
				timingSafeEqual(candidate, expected)
			);
		});
	return matched
		? { valid: true }
		: {
				valid: false,
				error:
					'The signature does not match. Hand processWebhook the raw body text: a parsed body cannot verify.',
			};
}
