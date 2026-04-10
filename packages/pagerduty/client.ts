import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class PagerdutyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'PagerdutyAPIError';
	}
}

const PAGERDUTY_API_BASE = 'https://api.pagerduty.com';

const PAGERDUTY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makePagerdutyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		from?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, from } = options;

	const config: OpenAPIConfig = {
		BASE: PAGERDUTY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/vnd.pagerduty+json;version=2',
			Authorization: `Token token=${apiKey}`,
			...(from && { From: from }),
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

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: PAGERDUTY_RATE_LIMIT_CONFIG,
	});

	return response;
}
