import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Quaderno has **no shared host**. Every account answers on its own subdomain,
 * `https://<account>.quadernoapp.com/api`, and the same key is refused on the
 * wrong one. The account name is therefore an input, not a constant, which is
 * why this plugin takes `account` beside the key.
 *
 * `GET /authorization` on the bare `quadernoapp.com` host returns the account's
 * own `href`, so a caller who only has a key can discover its name once.
 */
export const QUADERNO_ROOT_HOST = 'https://quadernoapp.com';

/** The base URL for an account, with `/api` already included. */
export function accountBaseUrl(account: string): string {
	const name = account.trim();
	if (!/^[a-z0-9][a-z0-9-]*$/i.test(name)) {
		throw new QuadernoError(
			'The Quaderno account name must be the subdomain only, such as `assur-224963`. Call GET /authorization to find it.',
			'invalid_account',
		);
	}
	return `https://${name}.quadernoapp.com/api`;
}

// Quaderno documents a 100-call window per 15 seconds. A list page can carry 100
// objects, so the 20s default is left alone rather than shortened.
const QUADERNO_TIMEOUT_MS = 30_000;

export type QuadernoErrorCode =
	| 'unauthorized'
	| 'not_found_or_denied'
	| 'invalid_input'
	| 'rate_limited'
	| 'conflict'
	| 'server'
	| 'network'
	| 'timeout'
	| 'invalid_account'
	| 'bad_response';

/**
 * Quaderno answers an error with **`{"error": "..."}`** in most cases, and with
 * **`{"errors": {"field": ["message"]}}`** when a request body fails
 * validation. Two shapes, and a validator failure arrives as 422.
 *
 * A plain HTML body means nginx rejected the request before Quaderno saw it,
 * which in practice is a missing or wrong `Content-Type`.
 */
export function describeQuadernoError(
	status: number | undefined,
	// unknown: an untyped error body; read one field at a time.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	if (!record) {
		return status === undefined ? fallback : `Quaderno ${status}: ${fallback}`;
	}

	const single = record.error;
	if (typeof single === 'string' && single.length > 0) {
		return status === undefined ? single : `Quaderno ${status}: ${single}`;
	}

	const fields = asRecord(record.errors);
	if (fields) {
		const parts: string[] = [];
		for (const [field, value] of Object.entries(fields)) {
			const messages = Array.isArray(value)
				? value.filter((entry): entry is string => typeof entry === 'string')
				: typeof value === 'string'
					? [value]
					: [];
			if (messages.length > 0) parts.push(`${field}: ${messages.join(', ')}`);
		}
		const text = parts.join('; ');
		if (text)
			return status === undefined ? text : `Quaderno ${status}: ${text}`;
	}

	return status === undefined ? fallback : `Quaderno ${status}: ${fallback}`;
}

/**
 * A missing record answers **401**, not 404, with
 * `Unauthorized access or contact does not exist.` A wrong key answers 401 too,
 * with `Wrong API key or the user does not exist.` The status cannot separate
 * them, so the message decides. Getting this wrong would report a bad id as an
 * auth failure, or a bad key as a missing record.
 *
 * Order matters: both messages contain "does not exist", so the key check runs
 * first or every bad key would be classified as a missing record.
 */
function isBadKey(status: number | undefined, message: string): boolean {
	return status === 401 && /Wrong API key|user does not exist/i.test(message);
}

function isMissingRecord(status: number | undefined, message: string): boolean {
	if (status !== 401) return false;
	if (isBadKey(status, message)) return false;
	return /does not exist|not exist|Unauthorized access/i.test(message);
}

// Quaderno's own headers are `X-RateLimit-*`, and the reset is a UTC epoch.
// `corsair/http` maps `resetTime` onto `retryAfter`, which is what a retry uses.
const QUADERNO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export class QuadernoError extends Error {
	readonly code: QuadernoErrorCode;

	constructor(message: string, code: QuadernoErrorCode) {
		super(message);
		this.name = 'QuadernoError';
		this.code = code;
	}
}

export class QuadernoAPIError extends Error {
	readonly status?: number;
	readonly method?: string;
	readonly retryAfter?: number;
	readonly kind?: QuadernoErrorCode;

	constructor(
		message: string,
		options: {
			status?: number;
			method?: string;
			retryAfter?: number;
			kind?: QuadernoErrorCode;
		} = {},
	) {
		super(message);
		this.name = 'QuadernoAPIError';
		this.status = options.status;
		this.method = options.method;
		this.retryAfter = options.retryAfter;
		this.kind = options.kind;
	}
}

/** A failure that never reached Quaderno, so it carries no response body. */
export class QuadernoTransportError extends Error {
	readonly kind: 'network' | 'timeout';
	readonly method?: string;

	constructor(message: string, kind: 'network' | 'timeout', method?: string) {
		super(message);
		this.name = 'QuadernoTransportError';
		this.kind = kind;
		this.method = method;
	}
}

export type QuadernoQueryValue = string | number | boolean | undefined;

export type QuadernoRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path under `/api`, with a leading slash. */
	path: string;
	query?: Record<string, QuadernoQueryValue>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * HTTP Basic with the key as the username and an **empty password**, which is
 * what Quaderno documents. Built by hand because `corsair/http` refuses Basic
 * auth when the password is empty.
 */
export function basicAuthHeader(apiKey: string): string {
	const key = apiKey.trim();
	if (!key) {
		throw new QuadernoError('A Quaderno API key is required.', 'unauthorized');
	}
	return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
}

function kindFor(
	status: number | undefined,
	message: string,
): QuadernoErrorCode {
	if (isMissingRecord(status, message)) return 'not_found_or_denied';
	if (isBadKey(status, message)) return 'unauthorized';
	if (status === 401 || status === 403) return 'unauthorized';
	if (status === 422 || status === 406 || status === 400)
		return 'invalid_input';
	if (status === 405 || status === 409 || status === 410) return 'conflict';
	if (status === 429) return 'rate_limited';
	if (status !== undefined && status >= 500) return 'server';
	return 'invalid_input';
}

// unknown: callers parse the body with the endpoint's zod output schema. A
// DELETE answers 204 with no body, so undefined is a normal result.
export async function makeQuadernoRequest(
	apiKey: string,
	account: string,
	{ method, path, query, body }: QuadernoRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: accountBaseUrl(account),
		VERSION: '20241028',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: QUADERNO_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: basicAuthHeader(apiKey),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: QUADERNO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const text = describeQuadernoError(
				error.status,
				error.body,
				error.message,
			);
			throw new QuadernoAPIError(text, {
				status: error.status,
				method,
				retryAfter: error.retryAfter,
				kind: kindFor(error.status, text),
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof DOMException) {
			const timedOut = error.name === 'TimeoutError';
			throw new QuadernoTransportError(
				timedOut
					? `Quaderno did not answer ${method} ${path} in time.`
					: `Could not reach Quaderno for ${method} ${path}.`,
				timedOut ? 'timeout' : 'network',
				method,
			);
		}
		if (error instanceof Error) {
			throw new QuadernoTransportError(
				`Could not reach Quaderno for ${method} ${path}: ${error.message}`,
				'network',
				method,
			);
		}
		throw new QuadernoTransportError(
			`Could not reach Quaderno for ${method} ${path}.`,
			'network',
			method,
		);
	}
}
