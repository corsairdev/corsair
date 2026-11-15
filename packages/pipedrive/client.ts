import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const PIPEDRIVE_API_BASE = 'https://api.pipedrive.com/api/v2';
export const PIPEDRIVE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Error handlers own 429 retries so daily-budget exhaustion is not replayed.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		// Pipedrive documents this as the remaining burst-window reset duration.
		retryAfter: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

type PipedriveAuthType = 'api_key' | 'oauth_2';

export async function makePipedriveRequest<T>(
	endpoint: string,
	apiKey: string,
	authType: PipedriveAuthType,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because endpoint-specific bodies are Zod-validated before transport.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiKey) throw new AuthMissingError('pipedrive', authType);

	const { method = 'GET', body, query } = options;
	const config: OpenAPIConfig = {
		BASE: PIPEDRIVE_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		...(authType === 'oauth_2' ? { TOKEN: apiKey } : {}),
		HEADERS: {
			'Content-Type': 'application/json',
			...(authType === 'api_key' ? { 'x-api-token': apiKey } : {}),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	return request<T>(config, requestOptions, {
		rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG,
	});
}
