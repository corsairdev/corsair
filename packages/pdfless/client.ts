import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const PDFLESS_API_BASE = 'https://api.pdfless.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function pdflessGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | number | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: PDFLESS_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			apikey: apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url,
		query,
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
