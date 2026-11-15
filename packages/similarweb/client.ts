import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { UnknownJson } from './json';

/**
 * The REST API lives on one host, but its routes are split across three
 * documented bases: `/v1/website` for domain ranks, `/v1/app` for app ranks and
 * `/v1/similar-rank` for the top-sites list. `path` carries the full route from
 * the origin, so BASE is the origin alone.
 */
export const SIMILARWEB_API_BASE = 'https://api.similarweb.com';

/**
 * Similarweb allows 10 requests per second per account and answers 429 past
 * that. Retries live in error-handlers.ts, so the client makes one attempt.
 */
const SIMILARWEB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Similarweb's errors are **plain text, not JSON**: a 401 answers the literal
 * `invalid API key`, a 403 covers either a bad key or an exhausted credit
 * balance, and a 404 is "Data not found" for a domain with no data. So the body
 * is not parsed, and the status plus the text is all a caller can match on.
 *
 * https://developers.similarweb.com/docs/error-codes-rest
 */
export class SimilarwebAPIError extends Error {
	readonly status?: number;
	/** The provider's plain-text reason, when it sent one. */
	readonly reason?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// The body is plain text, but a proxy can answer HTML or nothing at all.
	readonly body?: UnknownJson; // unknown: see the note above

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			body?: UnknownJson; // unknown: same open error body as the field above
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SimilarwebAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.reason =
			typeof this.body === 'string' && this.body.length > 0
				? this.body.trim().slice(0, 300)
				: undefined;
	}

	/**
	 * 401 always means the key is missing or invalid. A 403 means either a bad
	 * key or no credits left, and Similarweb documents no way to tell them
	 * apart from the response, so both read as an account problem rather than a
	 * transient one.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** True when the domain or app has no data, which is not an auth problem. */
	get isDataNotFound(): boolean {
		return this.status === 404 || this.reason === 'Data not found';
	}
}

export function describeSimilarwebError(
	status: number | undefined,
	body: UnknownJson, // unknown: an error body can be text, HTML or empty
	fallback: string,
): string {
	// Similarweb sends a bare sentence, so the text is the whole message.
	const text =
		typeof body === 'string' && body.trim().length > 0
			? body.trim().slice(0, 300)
			: fallback;
	return status === undefined ? text : `Similarweb ${status}: ${text}`;
}

export type SimilarwebQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SimilarwebRequest = {
	method: 'GET';
	path: string;
	query?: SimilarwebQuery;
	/** Overrides the default JSON Accept, e.g. for the XML answer. */
	accept?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// unknown: callers parse the body with the endpoint's zod output schema, and
// the shape differs per route, which is what that schema is for.
export async function makeSimilarwebRequest(
	apiKey: string,
	{ method, path, query, accept }: SimilarwebRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMILARWEB_API_BASE,
		VERSION: '4.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: accept ?? 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// The key travels as a query parameter; `api_key` is one of the names
		// core's ApiError redacts, so it stays out of a logged error.
		query: { ...query, api_key: apiKey },
	};

	try {
		// unknown: see the note on makeSimilarwebRequest.
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SIMILARWEB_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including the api_key query parameter, so `util.inspect(error)` on a
			// wrapped cause would print the key.
			throw new SimilarwebAPIError(
				describeSimilarwebError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// A transport failure never held a body or query, so its cause is safe to
		// keep, and it is what tells a retry that nothing reached Similarweb.
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SimilarwebAPIError(error.message, { cause: error, method });
		}
		throw new SimilarwebAPIError('Unknown Similarweb error', { method });
	}
}
