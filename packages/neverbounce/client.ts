import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import type { CheckInput } from './endpoints/types';

export class NeverBounceAPIError extends Error {
	constructor(
		public readonly status: string,
		message: string,
	) {
		super(message);
		this.name = 'NeverBounceAPIError';
	}
}

// HTTP responses are untrusted; the endpoint validates success data with Zod,
// so assigning a more specific return type here would assume that validation.
export async function makeNeverBounceRequest(
	apiKey: string,
	query: CheckInput,
): Promise<unknown> {
	if (!apiKey) throw new AuthMissingError('neverbounce', 'api_key');
	// Keep the raw response unknown until the endpoint's Zod schema validates it.
	const result: unknown = await request(
		{
			BASE: 'https://api.neverbounce.com/v4.2',
			VERSION: '4.2',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		},
		{ method: 'GET', url: '/single/check', query: { ...query, key: apiKey } },
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
	if (typeof result === 'object' && result !== null && 'status' in result) {
		const status = result.status;
		if (typeof status === 'string' && status !== 'success') {
			throw new NeverBounceAPIError(status, 'NeverBounce returned an error');
		}
	}
	return result;
}
