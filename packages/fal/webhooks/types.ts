import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ── Payload ─────────────────────────────────────────────────────────────────

/** What fal POSTs to a request's webhook URL when the request completes. */
export const RequestCompletedEventSchema = z
	.object({
		request_id: z.string(),
		gateway_request_id: z
			.string()
			.nullish()
			.describe(
				'The last attempt’s id; differs from request_id when fal retried.',
			),
		status: z
			.enum(['OK', 'ERROR'])
			.describe(
				'OK: payload is the model output. ERROR: payload is the error body.',
			),
		// unknown: the model output (status OK) or the error body (ERROR), both model-specific.
		payload: z.record(z.string(), z.unknown()).nullable(),
		error: z.string().nullish(),
		payload_error: z
			.string()
			.nullish()
			.describe(
				'Set when fal could not include the output; read it with queue.result.',
			),
	})
	.loose();

export type RequestCompletedEvent = z.infer<typeof RequestCompletedEventSchema>;

export type FalWebhookOutputs = {
	requestCompleted: RequestCompletedEvent;
};

// ── Matching ────────────────────────────────────────────────────────────────

export const FAL_WEBHOOK_HEADERS = {
	requestId: 'x-fal-webhook-request-id',
	userId: 'x-fal-webhook-user-id',
	timestamp: 'x-fal-webhook-timestamp',
	signature: 'x-fal-webhook-signature',
} as const;

export function headerValue(
	headers: Record<string, string | string[] | undefined> | undefined,
	name: string,
): string | undefined {
	if (!headers) return undefined;
	const direct = headers[name] ?? headers[name.toLowerCase()];
	const found =
		direct ??
		Object.entries(headers).find(
			([key]) => key.toLowerCase() === name.toLowerCase(),
		)?.[1];
	const value = Array.isArray(found) ? found[0] : found;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: a webhook body arrives as a string or already-parsed JSON of any shape.
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
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

/** A fal webhook carries the four signature headers. */
export function isFalWebhook(request: RawWebhookRequest): boolean {
	const headers = request.headers as Record<
		string,
		string | string[] | undefined
	>;
	return Boolean(
		headerValue(headers, FAL_WEBHOOK_HEADERS.signature) &&
			headerValue(headers, FAL_WEBHOOK_HEADERS.requestId),
	);
}

export const matchRequestCompleted: CorsairWebhookMatcher = (request) => {
	if (!isFalWebhook(request)) return false;
	const body = parseBody(request.body);
	return (
		body !== null &&
		typeof body.request_id === 'string' &&
		(body.status === 'OK' || body.status === 'ERROR')
	);
};

// ── Signature verification ──────────────────────────────────────────────────

export const FAL_JWKS_URL = 'https://rest.fal.ai/.well-known/jwks.json';

/** fal: cache the key set, but not past 24 hours; keys rotate. */
const JWKS_CACHE_MS = 24 * 60 * 60 * 1000;
const TIMESTAMP_LEEWAY_SECONDS = 300;

export type FalJwk = { kty?: string; crv?: string; kid?: string; x?: string };

/**
 * At most one fetch of fal's keys a minute, failed ones included: a signature
 * miss asks for a refetch (fal may have rotated), and a burst of misses or an
 * outage must not turn into a request per delivery.
 */
const JWKS_FETCH_MIN_INTERVAL_MS = 60 * 1000;

let jwksCache: { keys: FalJwk[]; fetchedAt: number } | null = null;
let lastFetchAttemptAt = Number.NEGATIVE_INFINITY;
let lastFetchFailed = false;
// Deliveries that need the keys while a fetch is under way share it.
let pendingFetch: Promise<FalJwk[]> | null = null;

async function loadFalJwks(now: number): Promise<FalJwk[]> {
	try {
		const response = await fetch(FAL_JWKS_URL, {
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) {
			throw new Error(`fal JWKS fetch failed with HTTP ${response.status}`);
		}
		const body = (await response.json()) as { keys?: FalJwk[] };
		const keys = Array.isArray(body.keys) ? body.keys : [];
		// A set with no usable key can verify nothing: a failed load, not keys
		// to hold on to, so deliveries are retried instead of refused.
		if (!keys.some((jwk) => ed25519KeyFromJwk(jwk) !== null)) {
			throw new Error('fal JWKS answered without a usable Ed25519 key');
		}
		jwksCache = { keys, fetchedAt: now };
		lastFetchFailed = false;
		return keys;
	} catch (error) {
		lastFetchFailed = true;
		throw error;
	}
}

/**
 * fal's signing keys. A plain read answers from a fresh cache without waiting
 * on anything; `refresh` (after a signature miss) fetches again, at most once
 * a minute. When it can't fetch again yet it throws, so a miss is reported as
 * "try later" rather than as a bad signature: a key fal rotated in since the
 * last load still gets its delivery verified on the retry.
 */
export async function fetchFalJwks(
	now = Date.now(),
	options: { refresh?: boolean } = {},
): Promise<FalJwk[]> {
	const fresh = jwksCache !== null && now - jwksCache.fetchedAt < JWKS_CACHE_MS;
	if (jwksCache && fresh && !options.refresh) return jwksCache.keys;
	if (pendingFetch) return pendingFetch;

	if (now - lastFetchAttemptAt < JWKS_FETCH_MIN_INTERVAL_MS) {
		// Can't load again yet, so the keys can't be confirmed current: the
		// last attempt failed, or fal may have rotated since the last load.
		// Either way the caller is told to try later, not that it's forged.
		throw new Error(
			lastFetchFailed
				? 'fal JWKS fetch failed under a minute ago'
				: 'fal JWKS was loaded under a minute ago; try again later',
		);
	}

	lastFetchAttemptAt = now;
	pendingFetch = loadFalJwks(now).finally(() => {
		pendingFetch = null;
	});
	return pendingFetch;
}

/** Clears the cached key set and fetch limits (tests, or after a rotation). */
export function resetFalJwksCache(): void {
	jwksCache = null;
	lastFetchAttemptAt = Number.NEGATIVE_INFINITY;
	lastFetchFailed = false;
	pendingFetch = null;
}

// DER prefix that wraps a raw 32-byte Ed25519 key as SubjectPublicKeyInfo.
const ED25519_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

function ed25519KeyFromJwk(jwk: FalJwk): crypto.KeyObject | null {
	// An X25519 key is OKP with a 32-byte x too; only Ed25519 signs.
	if (jwk.kty !== 'OKP' || jwk.crv !== 'Ed25519') return null;
	if (typeof jwk.x !== 'string') return null;
	// fal's x is base64 with padding; accept base64url too.
	const raw = Buffer.from(
		jwk.x.replace(/-/g, '+').replace(/_/g, '/'),
		'base64',
	);
	if (raw.length !== 32) return null;
	return crypto.createPublicKey({
		key: Buffer.concat([ED25519_SPKI_PREFIX, raw]),
		format: 'der',
		type: 'spki',
	});
}

export type FalVerifyOptions = {
	/** Keys to check against instead of fetching fal's JWKS. */
	jwks?: FalJwk[];
	/** Current time in ms, for the ±5 minute timestamp window. */
	now?: number;
};

/**
 * Best effort only; pass the raw body text whenever you can.
 *
 * fal serialises webhook bodies with Python's `json.dumps(body, sort_keys=True)`:
 * sorted keys, `", "` and `": "` separators, non-ASCII escaped. When a caller
 * hands processWebhook parsed JSON, the raw body Corsair sees is JS's compact
 * re-serialisation, which never hashes the same; rebuilding fal's form lets
 * most of those deliveries verify. Parsing loses what cannot come back: a
 * whole-number float (`5.0` parses to `5`) or an integer past 2^53 (returns
 * null here). Those deliveries verify only from the raw body.
 */
// unknown: any JSON value, walked recursively.
export function falJsonDumps(value: unknown): string | null {
	if (value === null) return 'null';
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	if (typeof value === 'number') {
		return Number.isFinite(value) &&
			(!Number.isInteger(value) || Number.isSafeInteger(value))
			? JSON.stringify(value)
			: null;
	}
	if (typeof value === 'string') {
		return JSON.stringify(value).replace(
			/[\u0080-\uffff]/g,
			(char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
		);
	}
	if (Array.isArray(value)) {
		const items = value.map(falJsonDumps);
		return items.includes(null) ? null : `[${items.join(', ')}]`;
	}
	if (typeof value === 'object') {
		const entries = Object.keys(value)
			.sort()
			.map((key) => {
				const item = falJsonDumps((value as Record<string, unknown>)[key]);
				return item === null ? null : `${falJsonDumps(key)}: ${item}`;
			});
		return entries.includes(null) ? null : `{${entries.join(', ')}}`;
	}
	return null;
}

/** The bodies that may be the one fal signed: the raw body, then fal's form of it. */
function candidateBodies(rawBody: string): string[] {
	try {
		const rebuilt = falJsonDumps(JSON.parse(rawBody));
		return rebuilt && rebuilt !== rawBody ? [rawBody, rebuilt] : [rawBody];
	} catch {
		return [rawBody];
	}
}

/**
 * fal signs `request id \n user id \n timestamp \n sha256(body)` with
 * Ed25519; any key in its JWKS may have signed it. Pass the body text as
 * received (`await req.text()`); parsed JSON is rebuilt in fal's form.
 */
export async function verifyFalWebhookSignature(
	// unknown: only the headers and raw body are read, never the parsed payload.
	request: Pick<WebhookRequest<unknown>, 'headers' | 'rawBody' | 'hubVerified'>,
	options: FalVerifyOptions = {},
): Promise<{
	valid: boolean;
	error?: string;
	/** True when the check could not run (fal's keys did not load); retry later. */
	retryable?: boolean;
}> {
	// Hub checked the signature before forwarding the delivery.
	if (request.hubVerified) return { valid: true };

	const headers = request.headers as Record<
		string,
		string | string[] | undefined
	>;
	const requestId = headerValue(headers, FAL_WEBHOOK_HEADERS.requestId);
	const userId = headerValue(headers, FAL_WEBHOOK_HEADERS.userId);
	const timestamp = headerValue(headers, FAL_WEBHOOK_HEADERS.timestamp);
	const signature = headerValue(headers, FAL_WEBHOOK_HEADERS.signature);

	if (!requestId || !userId || !timestamp || !signature) {
		return { valid: false, error: 'Missing fal webhook signature headers' };
	}
	if (!request.rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for fal signature verification',
		};
	}

	const now = options.now ?? Date.now();
	const sentAt = Number(timestamp);
	if (
		!Number.isFinite(sentAt) ||
		Math.abs(Math.floor(now / 1000) - sentAt) > TIMESTAMP_LEEWAY_SECONDS
	) {
		return {
			valid: false,
			error: 'fal webhook timestamp is outside the 5 minute window',
		};
	}

	if (!/^[0-9a-f]+$/i.test(signature) || signature.length !== 128) {
		return { valid: false, error: 'fal webhook signature is not hex Ed25519' };
	}

	const messages = candidateBodies(request.rawBody).map((body) =>
		Buffer.from(
			[
				requestId,
				userId,
				timestamp,
				crypto.createHash('sha256').update(body, 'utf8').digest('hex'),
			].join('\n'),
			'utf8',
		),
	);
	const signatureBytes = Buffer.from(signature, 'hex');

	const signedByOneOf = (keys: FalJwk[]) =>
		keys.some((jwk) => {
			const key = ed25519KeyFromJwk(jwk);
			return (
				key !== null &&
				messages.some((message) =>
					crypto.verify(null, message, key, signatureBytes),
				)
			);
		});

	try {
		if (options.jwks) {
			return signedByOneOf(options.jwks)
				? { valid: true }
				: { valid: false, error: 'Invalid fal webhook signature' };
		}
		if (signedByOneOf(await fetchFalJwks(now))) return { valid: true };
		// Keys cached before a rotation miss a new key; look once more.
		if (signedByOneOf(await fetchFalJwks(now, { refresh: true }))) {
			return { valid: true };
		}
	} catch (error) {
		return {
			valid: false,
			retryable: true,
			error: `Could not load fal's signing keys: ${error instanceof Error ? error.message : 'unknown error'}`,
		};
	}
	return { valid: false, error: 'Invalid fal webhook signature' };
}
