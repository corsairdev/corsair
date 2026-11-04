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
	method?: 'GET' | 'POST' | 'DELETE';
	// unknown: bodies are endpoint-specific JSON (amounts, EINs, notes) built
	// from zod-validated inputs at each call site, so per-key values vary.
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
	// No transport retries on state-changing requests: a 429 POST/DELETE is
	// surfaced immediately so the plugin error policy is the only policy that
	// ever sees it (replaying a create could duplicate it; error semantics for
	// cancel are undocumented). Reads keep the default retries — GETs are idempotent.
	return await request<T>(config, requestOptions, {
		rateLimitConfig:
			method === 'GET'
				? DAFFY_RATE_LIMIT_CONFIG
				: { ...DAFFY_RATE_LIMIT_CONFIG, enabled: false, maxRetries: 0 },
	});
}
