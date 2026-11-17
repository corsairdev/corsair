import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const PLATE_API_BASE = 'https://api.platerecognizer.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

function config(apiKey: string, timeoutMs?: number): OpenAPIConfig {
	return {
		BASE: PLATE_API_BASE,
		...(timeoutMs ? { TIMEOUT: timeoutMs } : {}),
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token ${apiKey}`,
		},
	};
}

export async function plateGet<T>(apiKey: string, url: string): Promise<T> {
	const requestOptions: ApiRequestOptions = { method: 'GET', url };
	return await request<T>(config(apiKey), requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export async function platePostForm<T>(
	apiKey: string,
	url: string,
	formData: Record<string, string | string[] | undefined>,
	/** Override core's 20 s default; the OCR reader takes 20 to 30 s per image. */
	timeoutMs?: number,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		formData,
	};
	return await request<T>(config(apiKey, timeoutMs), requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
