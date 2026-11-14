import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ENDORSAL_API_BASE = 'https://api.endorsal.io';

// Let the error handlers own retries so non-idempotent writes are never
// replayed by the shared transport. Extraction remains enabled for Retry-After.
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type EndorsalRequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeEndorsalRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: EndorsalRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	// Endorsal answers 401 to every route without a key, GETs included.
	if (!apiKey) {
		throw new AuthMissingError('endorsal', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: ENDORSAL_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Contact and testimonial values can contain personal data, and a query
			// can carry a campaign or a render flag. Keep the status and retry
			// metadata but never propagate request/response bodies or the query.
			const { query: _query, ...sentRequest } = error.request;
			const sanitized = new ApiError(
				{
					...sentRequest,
					url: sentRequest.url.split('?')[0] ?? sentRequest.url,
					body:
						error.request.body === undefined ? undefined : { redacted: true },
				},
				{
					url: error.url.split('?')[0] ?? error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: { redacted: true },
				},
				`Endorsal API request failed (${error.status})`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
			// Keep the frames of the request that failed under the new message
			// line. The original stack starts with `<name>: message`, and the message
			// can span several lines (core pretty-prints the response body for
			// unmapped statuses), so that exact prefix is cut off. If the stack
			// does not start with it, the new stack is kept as is.
			const header = `: ${error.message}\n`;
			const end = error.stack?.indexOf(header) ?? -1;
			const prefix = end >= 0 ? (error.stack?.slice(0, end) ?? '') : '';
			if (
				end >= 0 &&
				!prefix.includes('\n') &&
				error.stack &&
				sanitized.stack
			) {
				const [headline] = sanitized.stack.split('\n');
				const frames = error.stack.slice(end + header.length);
				sanitized.stack = `${headline}\n${frames}`;
			}
			throw sanitized;
		}
		throw error;
	}
}
