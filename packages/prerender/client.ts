import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PRERENDER_API_BASE = 'https://api.prerender.io';

/**
 * Prerender's own limit is documented only on the search route, at 50 requests
 * a minute, and it answers 429 past that with no Retry-After. Handlers own the
 * retries.
 */
const PRERENDER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Prerender does not answer a JSON error envelope. Every problem probed on every
 * route is a **plain-text** body with a 400: `Invalid prerenderToken` for a bad
 * token, and `403` for a cache clear that is already running. `ApiError.body`
 * therefore holds a string here, and the check below reads it as one.
 */
export class PrerenderAPIError extends Error {
	readonly status?: number;
	/** The plain-text reason Prerender sent, such as `Invalid prerenderToken`. */
	readonly reason?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Prerender (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when Prerender rejected the token rather than the request. */
	readonly credentialsRejected: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			reason?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PrerenderAPIError';
		this.status = options.status;
		this.reason = options.reason;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
	}
}

/** Unparsed bodies: a response before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

const INVALID_TOKEN = /invalid prerendertoken/i;

/**
 * Reads the plain-text reason. Prerender answers text on a rejection, but a
 * proxy in front of it can answer JSON or HTML, so anything that is not a string
 * yields undefined rather than being stringified into a misleading message.
 */
// unknown: the rejection body before it is narrowed to text.
export function readReason(body: Untyped): string | undefined {
	if (typeof body !== 'string') return undefined;
	const text = body.trim();
	return text.length > 0 && text.length <= 300 ? text : undefined;
}

/**
 * A 400 whose body names the token is the credential failure. A 403 is the
 * documented "cache clear already in progress" on that route, so it is not one.
 */
// unknown: same rejection body as readReason.
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status !== 400 && status !== 401) return false;
	const reason = readReason(body);
	return reason !== undefined && INVALID_TOKEN.test(reason);
}

// unknown: same rejection body as readReason.
export function describePrerenderError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const reason = readReason(body) ?? fallback;
	return status !== undefined ? `Prerender ${status}: ${reason}` : reason;
}

export type PrerenderRequest = {
	method: 'GET' | 'POST';
	path: string;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makePrerenderRequest(
	token: string,
	{ method, path, body }: PrerenderRequest,
): Promise<Untyped> {
	if (!token.trim()) {
		throw new AuthMissingError('prerender', 'api_key');
	}
	if (/[\r\n]/.test(token)) {
		throw new PrerenderAPIError('The token must not contain newlines');
	}

	const config: OpenAPIConfig = {
		BASE: PRERENDER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	// The token travels in the JSON body on every route that takes one, and in the
	// path on the status route, which documents it that way.
	const bodyWithToken =
		method === 'POST' && body !== undefined && typeof body === 'object'
			? { ...(body as Record<string, Untyped>), prerenderToken: token }
			: body;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: bodyWithToken,
		mediaType: bodyWithToken === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: PRERENDER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new PrerenderAPIError(
				describePrerenderError(error.status, error.body, error.statusText),
				{
					status: error.status,
					reason: readReason(error.body),
					retryAfter: error.retryAfter,
					method,
					credentialsRejected: isCredentialRejection(error.status, error.body),
				},
			);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PrerenderAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PrerenderAPIError('Unknown Prerender error', {
			method,
			transport: true,
		});
	}
}
