import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const FINDYMAIL_API_BASE = 'https://app.findymail.com';

// The HTTP response is untrusted JSON, so no narrower type is sound until an
// endpoint's Zod output schema validates it.
export async function makeFindymailRequest(
	key: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('findymail', 'api_key');
	const config: OpenAPIConfig = {
		BASE: FINDYMAIL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: key,
		ENCODE_PATH: encodeURIComponent,
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
