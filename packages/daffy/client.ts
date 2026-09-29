import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const DAFFY_API_BASE = 'https://public.daffy.org/v1';

const DAFFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type DaffyRequestOptions = {
	method?: 'GET' | 'POST';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | undefined>;
};

export async function makeDaffyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DaffyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: DAFFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'X-Api-Key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
		query,
	};
	// Gift creation is a non-idempotent POST. Disable transport retries so a
	// 429 is surfaced once; error-handlers.ts decides whether to replay reads.
	return await request<T>(config, requestOptions, {
		rateLimitConfig:
			method === 'POST'
				? { ...DAFFY_RATE_LIMIT_CONFIG, enabled: false, maxRetries: 0 }
				: DAFFY_RATE_LIMIT_CONFIG,
	});
}
