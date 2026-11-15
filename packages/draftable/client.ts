import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const DRAFTABLE_API_BASE = 'https://api.draftable.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeDraftableRequest<T>(
	apiKey: string,
	query: Record<string, string | number | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: DRAFTABLE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/v1/comparisons',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
