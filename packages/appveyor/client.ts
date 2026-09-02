import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const APPVEYOR_API_BASE = 'https://ci.appveyor.com/api';

// Disable the shared HTTP client's built-in 429 retry so the plugin's
// error-handlers.ts RATE_LIMIT_ERROR (maxRetries:5 + Retry-After) is the
// single source of retry truth. Otherwise each endpoint-level retry would
// re-enter the client's 3-retry loop and compound to ~24 requests.
const APPVEYOR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type AppVeyorRequestOptions = {
	method?: ApiRequestOptions['method'];
	path?: Record<string, string | number>;
	query?: Record<string, string | number | boolean | undefined>;
	body?: unknown;
	responseType?: 'json' | 'text';
};

function encodePath(
	path: Record<string, string | number> | undefined,
): Record<string, string> | undefined {
	if (!path) return undefined;
	return Object.fromEntries(
		Object.entries(path).map(([key, value]) => [
			key,
			encodeURIComponent(String(value)),
		]),
	);
}

export async function makeAppVeyorRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AppVeyorRequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const config: OpenAPIConfig = {
		BASE: APPVEYOR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept:
				options.responseType === 'text' ? 'text/plain' : 'application/json',
			'Content-Type': 'application/json',
		},
	};
	const result = await request<T>(
		config,
		{
			method,
			url: endpoint,
			path: encodePath(options.path),
			query: options.query,
			body: method === 'GET' || method === 'DELETE' ? undefined : options.body,
			mediaType:
				method === 'GET' || method === 'DELETE'
					? undefined
					: 'application/json',
		},
		{ rateLimitConfig: APPVEYOR_RATE_LIMIT_CONFIG },
	);
	return result;
}

export async function makeAppVeyorTextRequest(
	endpoint: string,
	apiKey: string,
): Promise<string> {
	return makeAppVeyorRequest<string>(endpoint, apiKey, {
		responseType: 'text',
	});
}
