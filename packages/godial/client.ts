import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const GODIAL_API_BASE = 'https://enterprise.godial.cc';

const GODIAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'Retry-After' },
};

export type GoDialRequestOptions = {
	method: 'GET' | 'POST';
	apiKey: string;
	body?: Record<string, string>;
};

/** GoDial requires access_token in the query string on every API request. */
// unknown because GoDial's response shapes are not available in the published API overview.
export async function makeGoDialRequest(
	path: string,
	options: GoDialRequestOptions,
): Promise<unknown> {
	if (options.apiKey.length === 0) {
		throw new AuthMissingError('godial', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: GODIAL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// GoDial uses a query token, not an Authorization header.
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: { access_token: options.apiKey },
		body: options.body,
		mediaType: options.body ? 'application/json; charset=utf-8' : undefined,
	};

	// unknown because the shared transport returns untrusted provider JSON before endpoint validation.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: GODIAL_RATE_LIMIT_CONFIG,
	});
}
