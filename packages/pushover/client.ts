import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export const PUSHOVER_API_BASE = 'https://api.pushover.net/1';

export async function makePushoverRequest<T>(
	key: string,
	method: 'GET' | 'POST',
	url: string,
	parameters: Record<string, string | number | undefined>,
	schema: ZodType<T>,
): Promise<T> {
	if (!key || !key.trim()) throw new AuthMissingError('pushover', 'api_key');
	// HTTP data is untrusted until validated; the shared transport cannot assume a response type.
	try {
		const response = await request<unknown>(
			{
				BASE: PUSHOVER_API_BASE,
				VERSION: '1',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
			},
			{
				method,
				url,
				...(method === 'GET'
					? { query: { ...parameters, token: key } }
					: {
							body: { ...parameters, token: key },
							mediaType: 'application/json',
						}),
			},
			// Pushover's 429 may mean a monthly quota is exhausted; do not replay.
			{
				rateLimitConfig: {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: 5000,
					backoffMultiplier: 2,
					headerNames: { retryAfter: 'retry-after' },
				},
			},
		);
		return schema.parse(response);
	} catch (error) {
		if (error instanceof ApiError && method === 'POST') {
			// Retained request bodies can contain credentials and private data.
			Object.assign(error.request, { body: '[REDACTED]' });
		}
		throw error;
	}
}
