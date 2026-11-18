import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export type QuickBooksEnvironment = 'production' | 'sandbox';

const API_HOSTS: Record<QuickBooksEnvironment, string> = {
	production: 'https://quickbooks.api.intuit.com',
	sandbox: 'https://sandbox-quickbooks.api.intuit.com',
};

export const QUICKBOOKS_RATE_LIMIT_CONFIG = {
	enabled: true,
	maxRetries: 1,
	initialRetryDelay: 60_000,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
} satisfies RateLimitConfig;

export type QuickBooksRequestOptions = {
	method?: 'GET' | 'POST';
	// unknown values let the request's Zod-validated endpoint body retain its exact fields.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export function quickBooksApiBase(
	environment: QuickBooksEnvironment = 'production',
): string {
	return `${API_HOSTS[environment]}/v3`;
}

/**
 * Sends one authenticated JSON request to the QBO Accounting REST API.
 * OAuth access tokens are supplied by Corsair's OAuth key builder and refresh
 * path; this client never logs the token or request body.
 */
export async function makeQuickBooksRequest<T>(
	path: string,
	accessToken: string,
	options: QuickBooksRequestOptions = {},
	environment?: QuickBooksEnvironment,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: quickBooksApiBase(environment),
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
		...(options.query ? { query: options.query } : {}),
		...(options.body
			? { body: options.body, mediaType: 'application/json' }
			: {}),
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: QUICKBOOKS_RATE_LIMIT_CONFIG,
	});
}
