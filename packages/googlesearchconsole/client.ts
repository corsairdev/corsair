import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Two hosts, one per API this plugin uses. The Search Analytics, sites and
 * sitemaps methods live under `webmasters/v3`; URL inspection lives under `v1`.
 */
export const GOOGLE_SEARCH_CONSOLE_WEBMASTERS_BASE =
	'https://searchconsole.googleapis.com/webmasters/v3';
export const GOOGLE_SEARCH_CONSOLE_V1_BASE =
	'https://searchconsole.googleapis.com/v1';

/**
 * Limits: https://developers.google.com/webmaster-tools/limits documents a
 * per-site 1,200 QPM, and a load quota that needs 15 minutes of waiting. No
 * Retry-After is documented, so the delay comes from the retry strategy.
 */
const GOOGLE_SEARCH_CONSOLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Retries belong to error-handlers.ts.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type GoogleSearchConsoleRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** The full path including the version segment, e.g. `/webmasters/v3/sites`. */
	path: string;
	/** Only `sitemaps.list` takes a query parameter, and only one. */
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: each endpoint builds this from a zod-parsed input.
	body?: unknown; // unknown: each endpoint builds this from a zod-parsed input.
};

/**
 * A failure that never reached Google. It carries whether the request only
 * read, so the handlers can replay a read and leave a write alone.
 */
export class GoogleSearchConsoleTransportError extends Error {
	readonly isRead: boolean;

	constructor(message: string, isRead: boolean, cause: Error) {
		super(message, { cause });
		this.name = 'GoogleSearchConsoleTransportError';
		this.isRead = isRead;
	}
}

/**
 * Sends one Search Console request.
 *
 * core's ApiError is rethrown untouched (R8) so a 401 keeps its status for the
 * OAuth refresh and a 429 keeps its retry information.
 *
 * unknown: callers parse the body with the endpoint's zod output schema. It is
 * undefined for the bodyless successes: sites.add, sites.delete, sitemaps.submit
 * and sitemaps.delete all answer 200 with no body.
 */
export async function makeGoogleSearchConsoleRequest(
	token: string,
	{ method, path, query, body }: GoogleSearchConsoleRequest,
): Promise<unknown> {
	// unknown: parsed by the caller's output schema.
	const config: OpenAPIConfig = {
		BASE: 'https://searchconsole.googleapis.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType:
			method === 'GET' || method === 'DELETE' ? undefined : 'application/json',
	};

	try {
		// unknown: the response body is checked by the caller's output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GOOGLE_SEARCH_CONSOLE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		// DOMException (a timeout or abort) can fail `instanceof Error` across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GoogleSearchConsoleTransportError(
				error.message,
				method === 'GET',
				error,
			);
		}
		throw new GoogleSearchConsoleTransportError(
			'Unknown transport failure',
			method === 'GET',
			new Error('Unknown'),
		);
	}
}

/**
 * Search Console puts the property URL in the path and expects it encoded,
 * `sc-domain:example.com` included. The colon survives encoding, so a sc-domain
 * property round-trips unchanged.
 */
export function siteSegment(siteUrl: string): string {
	return encodeURIComponent(siteUrl);
}

/**
 * The feed path of a sitemap is a full URL and travel as one encoded segment,
 * e.g. `https%3A%2F%2Fexample.com%2Fsitemap.xml`.
 */
export function feedSegment(feedPath: string): string {
	return encodeURIComponent(feedPath);
}
