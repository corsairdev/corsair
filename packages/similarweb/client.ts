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
 * that. Core's request() retries a 429 three times with backoff, so the 429
 * handler in error-handlers.ts does not retry again. No reset header is
 * documented, so only Retry-After is read.
 */
const SIMILARWEB_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Similarweb's errors are **plain text, not JSON**. A 401 is either the literal
 * `invalid API key` (no key or a wrong one, seen on 11-16) or `Data not found`
 * (a domain it has no data for, or one written in capitals), a 403 is a bad
 * key or an exhausted credit balance, and an unknown route is an empty 404.
 * Errors are core's ApiError, passed through unchanged; this returns its
 * plain-text body, trimmed, or undefined.
 *
 * https://developers.similarweb.com/docs/error-codes-rest
 */
export function similarwebErrorText(
	// unknown: any thrown value; only core's ApiError carries a body.
	error: unknown,
): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body: UnknownJson = error.body;
	return typeof body === 'string' && body.trim().length > 0
		? body.trim().slice(0, 300)
		: undefined;
}

/** True for Similarweb's "Data not found" answer, which is not an auth problem. */
export function isSimilarwebDataNotFound(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	return (
		error.status === 404 ||
		/^data not found/i.test(similarwebErrorText(error) ?? '')
	);
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

	// Core's ApiError goes through unchanged (plugin rules R8). It already
	// replaces the api_key query value with [REDACTED] in its url and request.
	// unknown: see the note on makeSimilarwebRequest.
	return request<UnknownJson>(config, requestOptions, {
		rateLimitConfig: SIMILARWEB_RATE_LIMIT_CONFIG,
	});
}
