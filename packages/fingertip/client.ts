import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const FINGERTIP_API_BASE = 'https://api.fingertip.com';

// The HTTP transport extracts Retry-After but leaves retry ownership to the
// endpoint error handler, avoiding nested retries.
export const FINGERTIP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

// Returns unknown because the provider response is untrusted until endpoint validation.
export async function makeFingertipPingRequest(
	apiKey?: string,
): Promise<unknown> {
	if (!apiKey) {
		throw new AuthMissingError('fingertip', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: FINGERTIP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/v1/ping',
	};

	// The transport result remains unknown until the endpoint output schema parses it.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: FINGERTIP_RATE_LIMIT_CONFIG,
	});
}
