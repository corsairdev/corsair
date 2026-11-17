import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const ECOLOGI_API_BASE = 'https://public.ecologi.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function ecologiGet<T>(url: string): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ECOLOGI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url };
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

/**
 * POST to the Impact API with the account's key as a Bearer token. These calls
 * buy trees, carbon or habitat and are billed monthly, unless `test` is true.
 * https://docs.ecologi.com/
 */
export async function ecologiPurchase<T>(
	apiKey: string,
	url: string,
	// JSON body built by the endpoint from its parsed zod input.
	body: Record<string, unknown>,
	idempotencyKey?: string,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ECOLOGI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		body,
		mediaType: 'application/json',
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
