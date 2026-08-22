import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const CLOCKIFY_API_BASE = 'https://api.clockify.me/api/v1';

const NO_RETRY: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export function clockifyQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> | undefined {
	const defined = Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	);
	return Object.keys(defined).length > 0 ? defined : undefined;
}

export async function makeClockifyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		retries?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, retries = true } = options;

	const config: OpenAPIConfig = {
		BASE: CLOCKIFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey,
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
		query: method === 'GET' ? query : undefined,
	};

	return await request<T>(
		config,
		requestOptions,
		retries ? undefined : { rateLimitConfig: NO_RETRY },
	);
}
