import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export async function makeParmaRequest(
	token: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!token.trim()) throw new Error('Parma API token is required');
	const config: OpenAPIConfig = {
		BASE: 'https://app.parma.ai',
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
	};
	return request(config, options, {
		rateLimitConfig: {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 1000,
			backoffMultiplier: 2,
			headerNames: { retryAfter: 'retry-after' },
		},
	});
}
