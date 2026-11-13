import { createHash } from 'node:crypto';
import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GAGELIST_API_BASE = 'https://gagelist.net';

/**
 * GageList issues a bearer token from a client id and secret:
 *
 * ```
 * POST https://gagelist.net/api/token
 * Content-Type: application/x-www-form-urlencoded
 * grant_type=password&client_id=...&client_secret=...
 * ```
 *
 * The token lasts an hour and there is no refresh flow, so it is minted on
 * demand and cached until it is nearly expired.
 */
export const GAGELIST_TOKEN_PATH = '/api/token';

// A token lives about an hour; renewing two minutes early avoids a request
// that would otherwise arrive after expiry.
const TOKEN_SAFETY_WINDOW_MS = 2 * 60 * 1000;
const ASSUMED_TOKEN_LIFETIME_MS = 60 * 1000 * 60;

// A calibration certificate is rendered as a PDF, and a large record can take
// longer than the 20 second default in corsair/http.
const GAGELIST_TIMEOUT_MS = 60_000;

export type GagelistCredentials = {
	clientId: string;
	clientSecret: string;
};

/**
 * Failure envelopes, all three verified live:
 *
 * - The token endpoint answers `{ "error": "invalid_client" }` with a 400.
 * - A protected route with no token answers
 *   `{ "Message": "Authorization has been denied for this request." }` with a 401.
 *   The capital `M` is ASP.NET's, not a typo.
 * - A route-level failure answers `{ success: false, message }`.
 */
// unknown: the body is an untyped error body until asRecord narrows it.
export function readFailure(body: unknown): {
	message?: string;
	error?: string;
	success?: boolean;
} {
	const record = asRecord(body);
	const read = (key: string) => {
		const value = record?.[key];
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};
	const success = record?.success;
	return {
		// ASP.NET writes `Message`, the newer routes `message`.
		message: read('message') ?? read('Message'),
		error: read('error'),
		success: typeof success === 'boolean' ? success : undefined,
	};
}

const GAGELIST_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A GageList failure.
 *
 * The cause is dropped on a provider failure. A create echoes the submitted
 * record back in its validation message, and that record carries the serial
 * number and the assigned user.
 */
export class GagelistAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when GageList sent one. */
	readonly retryAfter?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;
	/** A read, safe to send again: any GET, and the list routes sent as POST. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GagelistAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
		this.replayable = options.replayable ?? options.method === 'GET';
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** No token, or one the API refused. Both read as "authenticate again". */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The client can do this, but not to this record. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** An unknown record ID. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A field GageList refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

/** The message GageList sent, with the status in front. */
// unknown: an error body is untyped: one of the three envelopes above, or an
// HTML page from the front end.
export function describeGagelistError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readFailure(body);
	const text = fields.message ?? fields.error ?? fallback;
	return status === undefined ? text : `GageList ${status}: ${text}`;
}

export type GagelistQueryValue = string | number | boolean;

export type GagelistRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: Record<string, GagelistQueryValue | undefined>;
	// unknown: the endpoint's input schema has already validated the body, which
	// is an object on most routes and a bare array on the custom-value route.
	body?: unknown;
	/**
	 * The route answers a file (the certificate PDF). corsair/http reads any
	 * non-JSON body with `text()`, which corrupts binary bytes, so such a route
	 * is fetched directly and its bytes come back base64-encoded.
	 */
	binary?: boolean;
	/** A read sent as POST (the list routes), so a failure may be retried. */
	replayable?: boolean;
};

/** A file route's answer: base64 bytes, or the JSON it sent instead. */
export type GagelistDocument = {
	contentType: string;
	base64?: string;
	byteLength?: number;
	// unknown: a JSON answer from a file route has no documented shape.
	json?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

type CachedToken = {
	token: string;
	expiresAt: number;
};

// One cache entry per client pair, so two accounts in one process do not share
// a token, and a caller with the right client id but the wrong secret cannot
// reuse a token another tenant minted.
const tokens = new Map<string, CachedToken>();

// The secret is hashed so the key never holds it in the clear.
function cacheKey(credentials: GagelistCredentials): string {
	const secretHash = createHash('sha256')
		.update(credentials.clientSecret)
		.digest('hex');
	return `${credentials.clientId}:${secretHash}`;
}

/** Clears the cached token, so the next call mints a new one. */
export function clearGagelistToken(credentials: GagelistCredentials): void {
	tokens.delete(cacheKey(credentials));
}

/**
 * Mints a bearer token from the client pair. GageList documents no `expires_in`,
 * so the lifetime is the one it advertises, an hour.
 */
async function mintToken(
	credentials: GagelistCredentials,
): Promise<CachedToken> {
	const config: OpenAPIConfig = {
		BASE: GAGELIST_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: GAGELIST_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json' },
	};

	try {
		// unknown: the token response is parsed field by field below, because
		// `access_token` is the only part with a guaranteed shape.
		const body = await request<unknown>(
			config,
			{
				method: 'POST',
				url: GAGELIST_TOKEN_PATH,
				// The documented body is form-encoded, not JSON.
				body: new URLSearchParams({
					grant_type: 'password',
					client_id: credentials.clientId,
					client_secret: credentials.clientSecret,
				}).toString(),
				mediaType: 'application/x-www-form-urlencoded',
			},
			{ rateLimitConfig: GAGELIST_RATE_LIMIT_CONFIG },
		);

		const record = asRecord(body);
		const token =
			typeof record?.access_token === 'string'
				? record.access_token
				: undefined;
		if (!token) {
			throw new GagelistAPIError(
				'GageList returned no access_token for the client credentials',
				{ method: 'POST' },
			);
		}
		const expiresIn =
			typeof record?.expires_in === 'number'
				? record.expires_in * 1000
				: ASSUMED_TOKEN_LIFETIME_MS;
		return {
			token,
			expiresAt: Date.now() + expiresIn - TOKEN_SAFETY_WINDOW_MS,
		};
	} catch (error) {
		if (error instanceof GagelistAPIError) throw error;
		if (error instanceof ApiError) {
			// The token body carries the client secret, so no cause is kept.
			throw new GagelistAPIError(
				describeGagelistError(error.status, error.body, error.message),
				{ status: error.status, retryAfter: error.retryAfter, method: 'POST' },
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new GagelistAPIError(error.message, {
				cause: error,
				method: 'POST',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GagelistAPIError('Unknown GageList error', {
			method: 'POST',
			transport: true,
		});
	}
}

async function tokenFor(credentials: GagelistCredentials): Promise<string> {
	const key = cacheKey(credentials);
	const cached = tokens.get(key);
	if (cached && cached.expiresAt > Date.now()) return cached.token;

	const fresh = await mintToken(credentials);
	tokens.set(key, fresh);
	return fresh.token;
}

/** Fetches a file route directly so its bytes survive. */
async function fetchDocument(
	credentials: GagelistCredentials,
	token: string,
	path: string,
): Promise<GagelistDocument> {
	let response: Response;
	try {
		response = await fetch(`${GAGELIST_API_BASE}${path}`, {
			method: 'GET',
			headers: {
				Accept: 'application/pdf, application/json',
				Authorization: `Bearer ${token}`,
			},
			signal: AbortSignal.timeout(GAGELIST_TIMEOUT_MS),
		});
	} catch (error) {
		// A transport failure never had a response body, so its cause is safe.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GagelistAPIError(error.message, {
				cause: error,
				method: 'GET',
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GagelistAPIError('Unknown GageList error', {
			method: 'GET',
			transport: true,
		});
	}

	const contentType =
		response.headers.get('Content-Type')?.split(';')[0]?.trim() ??
		'application/octet-stream';
	const isJson = contentType.toLowerCase().includes('json');

	if (!response.ok) {
		if (response.status === 401) clearGagelistToken(credentials);
		// unknown: an error body is one of the envelopes readFailure handles.
		const errorBody: unknown = isJson
			? await response.json().catch(() => undefined)
			: undefined;
		throw new GagelistAPIError(
			describeGagelistError(
				response.status,
				errorBody,
				response.statusText || 'Request failed',
			),
			{ status: response.status, method: 'GET' },
		);
	}

	if (isJson) return { contentType, json: await response.json() };
	const bytes = await response.arrayBuffer();
	return {
		contentType,
		base64: Buffer.from(bytes).toString('base64'),
		byteLength: bytes.byteLength,
	};
}

// unknown: callers parse the body with the endpoint's zod output schema. A
// `binary` route answers a GagelistDocument instead.
export async function makeGagelistRequest(
	credentials: GagelistCredentials,
	{ method, path, query, body, binary, replayable }: GagelistRequest,
	// unknown: see the note above the signature.
): Promise<unknown> {
	const token = await tokenFor(credentials);
	if (binary) return fetchDocument(credentials, token, path);

	const config: OpenAPIConfig = {
		BASE: GAGELIST_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: GAGELIST_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${token}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GAGELIST_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// A 401 can also mean the token was revoked early, so the cache is
			// cleared and the next call mints a fresh one.
			if (error.status === 401) clearGagelistToken(credentials);
			throw new GagelistAPIError(
				describeGagelistError(error.status, error.body, error.message),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A transport failure never had a response body, so its cause is safe.
			throw new GagelistAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
				replayable,
			});
		}
		throw new GagelistAPIError('Unknown GageList error', {
			method,
			transport: true,
			replayable,
		});
	}
}

/** Drops the keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GagelistQueryValue | undefined>,
): Record<string, GagelistQueryValue> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GagelistQueryValue] => entry[1] !== undefined,
		),
	);
}
