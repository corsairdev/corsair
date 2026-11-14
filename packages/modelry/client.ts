import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export async function makeModelryRequest(
	key: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('modelry', 'api_key');
	const config: OpenAPIConfig = {
		BASE: 'https://api.modelry.ai/api',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeURIComponent,
		HEADERS: { Authorization: key },
	};
	return request<unknown>(config, options, {
		rateLimitConfig: {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 1000,
			backoffMultiplier: 2,
			headerNames: { retryAfter: 'retry-after' },
		},
	});
}
