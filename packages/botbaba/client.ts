import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Official host from Botbaba KB:
 * https://kb.botbaba.io/docs/how-to-connect-your-shopify-store-with-botbaba/
 * https://kb.botbaba.io/docs/how-to-forward-a-template-message-with-custom-data-using-botbabas-api-and-postman-runner/
 */
export const BOTBABA_API_BASE = 'https://app.botbaba.io';

const BOTBABA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type BotbabaRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<
		string,
		string | number | boolean | string[] | Record<string, string> | undefined
	>;
	headers?: Record<string, string>;
};

/**
 * Official auth is the profile auth token sent as the Authorization value
 * (Postman: header key Authorization, value = token from Edit Profile).
 * https://kb.botbaba.io/docs/how-to-obtain-auth-token-or-api-key/
 */
export async function makeBotbabaRequest<T>(
	path: string,
	apiKey: string,
	options: BotbabaRequestOptions = {},
): Promise<T> {
	const token = apiKey.trim();
	if (!token) {
		throw new AuthMissingError('botbaba', 'api_key');
	}

	const { method = 'POST', body, query, headers } = options;

	const config: OpenAPIConfig = {
		BASE: BOTBABA_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: token,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: BOTBABA_RATE_LIMIT_CONFIG,
	});
}
