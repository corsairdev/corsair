import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const MEMBERSTACK_API_BASE = 'https://admin.memberstack.com';

// Do not replay writes. Still extract Retry-After for the error handler.
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// The shared transport receives unchecked responses of different shapes; each
// endpoint parses the result against its own output schema before returning it.
export async function memberstackRequest(
	key: string,
	options: ApiRequestOptions,
): Promise<unknown> {
	if (!key || !key.trim()) throw new AuthMissingError('memberstack', 'api_key');
	const config: OpenAPIConfig = {
		BASE: MEMBERSTACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'X-API-KEY': key, Accept: 'application/json' },
	};
	// The transport cannot know the endpoint-specific response shape here.
	return request<unknown>(config, options, { rateLimitConfig });
}
