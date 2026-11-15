import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';

// StackGo has not published field-level request or response schemas, so the
// body must remain open and the response unknown until the endpoint validates it.
export async function makeIdentityCheckRequest(
	method: 'GET' | 'POST',
	url: string,
	key: string,
	body?: Record<string, unknown>,
): Promise<unknown> {
	if (!key.trim()) throw new AuthMissingError('identitycheck', 'api_key');
	return request(
		{
			BASE: 'https://identity.stackgo.io',
			VERSION: '1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: { Authorization: `Basic ${key}` },
		},
		{
			method,
			url,
			...(body === undefined ? {} : { body, mediaType: 'application/json' }),
		},
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
