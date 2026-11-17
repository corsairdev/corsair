import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type { InsightsGetInput } from './endpoints/types';

export const MICROSOFT_CLARITY_API_BASE = 'https://www.clarity.ms';
// A 429 means the project has exhausted its daily quota, so do not retry.
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};
// The provider response is untrusted until the endpoint validates it against
// InsightsGetResponseSchema, so a narrower return type would be premature.
export async function getInsights(
	token: string,
	query: InsightsGetInput,
): Promise<unknown> {
	const normalized = token.trim();
	if (!normalized) throw new Error('Microsoft Clarity API token is required');
	if (/[\s\x00-\x1f\x7f]/.test(normalized))
		throw new Error(
			'Microsoft Clarity API token contains whitespace or control characters',
		);
	const config: OpenAPIConfig = {
		BASE: MICROSOFT_CLARITY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: normalized,
		HEADERS: { Accept: 'application/json' },
	};
	// The HTTP boundary has not validated the response body yet.
	return request<unknown>(
		config,
		{ method: 'GET', url: '/export-data/api/v1/project-live-insights', query },
		{ rateLimitConfig },
	);
}
