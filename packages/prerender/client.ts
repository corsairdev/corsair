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
 * A request that never reached Prerender (DNS, reset, abort), or a token the
 * client refused to send. HTTP failures are not wrapped: core's `ApiError`
 * passes through so its `status`, `retryAfter` and `body` reach core and the
 * caller unchanged. Prerender answers a **plain-text** body on every rejection
 * (`Invalid prerenderToken` with a 400, for one), so `ApiError.body` holds a
 * string here.
 */
export class PrerenderAPIError extends Error {
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Prerender (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when repeating the request cannot change anything twice. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			method?: string;
			transport?: boolean;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PrerenderAPIError';
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.replayable = options.replayable ?? false;
	}
}

/**
 * Routes a lost reply or a 5xx may repeat. Search and the clear status only
 * read, and a speed change sets one value. A recache or a sitemap submit spends
 * renders and a cache clear deletes pages cached since the first attempt, so a
 * repeat is not harmless and those routes are left out.
 */
const REPLAYABLE_PATHS = [
	'/search',
	'/cache-clear-status/',
	'/change-recache-speed',
] as const;

export function isReplayablePath(path: string | undefined): boolean {
	if (!path) return false;
	const pathname = path.startsWith(PRERENDER_API_BASE)
		? path.slice(PRERENDER_API_BASE.length)
		: path;
	return REPLAYABLE_PATHS.some((prefix) =>
		prefix.endsWith('/') ? pathname.startsWith(prefix) : pathname === prefix,
	);
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

/**
 * The status route carries the token in its path, so an `ApiError` from it would
 * repeat the token in `url` and `request.url`. This rebuilds the same error with
 * the token masked; every other field is kept.
 */
function withoutToken(error: ApiError, token: string): ApiError {
	const encoded = segment(token);
	const mask = (value: string) =>
		value.split(encoded).join('[REDACTED]').split(token).join('[REDACTED]');
	if (!error.url.includes(encoded) && !error.request.url.includes(encoded)) {
		return error;
	}
	return new ApiError(
		{ ...error.request, url: mask(error.request.url) },
		{
			url: mask(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
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

	// The token travels in the `X-Prerender-Token` header, which every route
	// accepts in place of the `prerenderToken` body field. Core keeps the request
	// options on an `ApiError` but not the config headers, so the token never
	// lands on an error. The status route also needs it in the path.
	const config: OpenAPIConfig = {
		BASE: PRERENDER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Prerender-Token': token,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: PRERENDER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutToken(error, token);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PrerenderAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				replayable: isReplayablePath(path),
			});
		}
		throw new PrerenderAPIError('Unknown Prerender error', {
			method,
			transport: true,
			replayable: isReplayablePath(path),
		});
	}
}
