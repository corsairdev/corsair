import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const MINERSTAT_API_BASE = 'https://api.minerstat.com';

// The transport serves multiple routes and cannot verify a route-specific shape;
// callers must validate the untrusted response with their endpoint output schema.
export async function makeMinerstatRequest(
	key: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('minerstat', 'api_key');
	const config: OpenAPIConfig = {
		BASE: MINERSTAT_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeURIComponent,
	};
	// Keep the HTTP result unchecked until the endpoint's Zod parser validates it.
	return request<unknown>(
		config,
		{ ...options, headers: { ...options.headers, 'X-Api-Key': key } },
		{
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 1000,
				backoffMultiplier: 2,
				headerNames: { retryAfter: 'retry-after' },
			},
		},
	);
}
