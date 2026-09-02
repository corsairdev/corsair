import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const BOTBABA_API_BASE = 'https://api.botsbaba.com';

/**
 * Botbaba does not publish rate-limit budgets. The retry loop reacts to 429
 * responses rather than pacing proactively.
 */
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
};

/**
 * Issues a Botbaba API request with Bearer auth and rate-limit retries.
 *
 * All operations live on the single `api.botsbaba.com` host. Authentication
 * uses a Bearer token obtained from the Botbaba dashboard.
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

	const { method = 'GET', body, query } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	const config: OpenAPIConfig = {
		BASE: BOTBABA_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
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
