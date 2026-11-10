import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The one host the API key is ever sent to. */
export const OPENSEA_API_BASE = 'https://api.opensea.io';
export const OPENSEA_API_PREFIX = '/api/v2';

// Order fulfilment and cross-chain routes do real work upstream and can take
// longer than corsair/http's 20s default.
const OPENSEA_TIMEOUT_MS = 30_000;

/**
 * OpenSea reports a failure in one of two envelopes, and which one arrives
 * depends on the route, not the status:
 *
 * - `{ "errors": ["Missing an API Key, which is required for this request."] }`
 *   for auth on the marketplace routes. An array of strings.
 * - `{ "error": { "message": "Not Found", "status": "NOT_FOUND", "code": 404 } }`
 *   for the router's own 404 and 405. An object with a stable `status`.
 *
 * A third shape, `{ code, errors }`, appears on V1 wrapper routes. All three are
 * read here so the text a caller sees is the provider's, not a generic message.
 */
export type OpenseaErrorCode =
	| 'unauthorized'
	| 'not_found'
	| 'invalid_input'
	| 'rate_limited'
	| 'server'
	| 'network'
	| 'timeout'
	| 'bad_response';

// unknown: an untyped error body until asRecord narrows it.
function readError(body: unknown): { text?: string; code?: string } {
	const record = asRecord(body);
	if (!record) return {};

	// `{ errors: [string, ...] }`
	const errors = record.errors;
	if (Array.isArray(errors)) {
		const parts = errors.filter(
			(entry): entry is string => typeof entry === 'string',
		);
		const code = record.code;
		return {
			text: parts.join('; ') || undefined,
			code: typeof code === 'string' ? code : undefined,
		};
	}

	// `{ error: { message, status, code } }`
	const nested = asRecord(record.error);
	if (nested) {
		const message = nested.message;
		const status = nested.status;
		return {
			text: typeof message === 'string' ? message : undefined,
			code: typeof status === 'string' ? status : undefined,
		};
	}

	const message = record.message;
	return { text: typeof message === 'string' ? message : undefined };
}

/** The provider's text, prefixed with the status and any stable code. */
export function describeOpenseaError(
	status: number | undefined,
	// unknown: an untyped error body; read one field at a time.
	body: unknown,
	fallback: string,
): string {
	const { text, code } = readError(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const summary = text ?? fallback;
	return label ? `OpenSea ${label}: ${summary}` : summary;
}

/**
 * OpenSea publishes a rate limit but no numbers: the docs say only that "the
 * API is rate-limited". The live response carries the real contract in
 * headers, `x-ratelimit-limit: 120` and `x-ratelimit-reset` as a unix
 * timestamp. `corsair/http` reads `resetTime` itself and converts it into
 * `retryAfter`, so a 429 with no `Retry-After` still waits until the window
 * actually resets rather than retrying into the same exhausted window. Omitting
 * `resetTime` here was a real defect: every retry fell back to one second.
 *
 * Note the precedence: when both headers are present `corsair/http` lets
 * `resetTime` overwrite `Retry-After`, which is the safer of the two for a
 * window-based limit.
 */
const OPENSEA_RATE_LIMIT_CONFIG: RateLimitConfig = {
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

export class OpenseaAPIError extends Error {
	readonly status?: number;
	/** HTTP method of the failed request; decides whether it may be replayed. */
	readonly method?: string;
	/** Milliseconds to wait, from Retry-After or x-ratelimit-reset. */
	readonly retryAfter?: number;
	/** The provider's stable code, e.g. `NOT_FOUND` or `MINTER_NOT_ELIGIBLE`. */
	readonly code?: string;
	readonly kind?: OpenseaErrorCode;

	constructor(
		message: string,
		options: {
			status?: number;
			method?: string;
			retryAfter?: number;
			code?: string;
			kind?: OpenseaErrorCode;
		} = {},
	) {
		super(message);
		this.name = 'OpenseaAPIError';
		this.status = options.status;
		this.method = options.method;
		this.retryAfter = options.retryAfter;
		this.code = options.code;
		this.kind = options.kind;
	}
}

/**
 * A failure that never reached OpenSea. Kept apart from OpenseaAPIError so a
 * transport problem carries no response body, and so the key cannot ride along
 * in a cause. This API takes the key in a header, never in the query.
 */
export class OpenseaTransportError extends Error {
	readonly kind: 'network' | 'timeout';
	readonly method?: string;

	constructor(message: string, kind: 'network' | 'timeout', method?: string) {
		super(message);
		this.name = 'OpenseaTransportError';
		this.kind = kind;
		this.method = method;
	}
}

export type OpenseaQueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| undefined;

export type OpenseaRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: Record<string, OpenseaQueryValue>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/**
 * Encodes one path segment. A slug or address may contain no slash.
 * `encodeURIComponent` leaves `.` and `..` as they are and the URL parser then
 * resolves them away (also as `%2e`), so `/collections/../stats` would be sent
 * as `/stats`. Those two values are refused before any request.
 */
export function segment(value: string | number): string {
	const text = String(value);
	if (text === '.' || text === '..') {
		throw new OpenseaAPIError(`"${text}" is not a valid path value.`, {
			kind: 'invalid_input',
		});
	}
	return encodeURIComponent(text);
}

function kindFor(status: number | undefined): OpenseaErrorCode {
	if (status === 401 || status === 403) return 'unauthorized';
	if (status === 404) return 'not_found';
	if (status === 429) return 'rate_limited';
	if (status !== undefined && status >= 500) return 'server';
	return 'invalid_input';
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeOpenseaRequest(
	apiKey: string,
	{ method, path, query, body }: OpenseaRequest,
): Promise<unknown> {
	// unknown: the response body is untyped; the endpoint's output schema is what
	// validates it.
	const config: OpenAPIConfig = {
		BASE: OPENSEA_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: OPENSEA_TIMEOUT_MS,
		// The key travels in this header and nowhere else.
		HEADERS: { Accept: 'application/json', 'x-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `${OPENSEA_API_PREFIX}${path}`,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: OPENSEA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const status = error.status;
			throw new OpenseaAPIError(
				describeOpenseaError(status, error.body, error.message),
				{
					status,
					method,
					// `corsair/http` folds both headers into this one value, and
					// `resetTime` wins when the response carries both. See
					// OPENSEA_RATE_LIMIT_CONFIG.
					retryAfter: error.retryAfter,
					code: readError(error.body).code,
					kind: kindFor(status),
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof DOMException) {
			const timedOut = error.name === 'TimeoutError';
			throw new OpenseaTransportError(
				timedOut
					? `OpenSea did not answer ${method} ${path} in time.`
					: `Could not reach OpenSea for ${method} ${path}.`,
				timedOut ? 'timeout' : 'network',
				method,
			);
		}
		if (error instanceof Error) {
			throw new OpenseaTransportError(
				`Could not reach OpenSea for ${method} ${path}: ${error.message}`,
				'network',
				method,
			);
		}
		throw new OpenseaTransportError(
			`Could not reach OpenSea for ${method} ${path}.`,
			'network',
			method,
		);
	}
}
