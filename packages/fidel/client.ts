import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FidelAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'FidelAPIError';
	}
}

const FIDEL_API_BASE = 'https://api.fidel.uk';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Single retry owner: the plugin error handler owns the 429 retry policy,
	// so the transport stays single-attempt (maxRetries 0). Keeping enabled
	// true makes the shared transport read the Retry-After/reset headers and
	// attach them to the thrown error without ever retrying on its own.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeFidelRequest<T>(
	ctx: { key: string },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: Fidel request bodies differ by operation and are validated by
		// the corresponding endpoint schema before reaching this boundary.
		// unknown: the endpoint schemas validate each provider-specific body.
		body?: Record<string, unknown>;
		// unknown: Fidel documents limit/start pagination cursors as scalar
		// query parameters and some filters as repeated (multi-value) string
		// arrays; the shared transport serializes both.
		query?: Record<string, string | string[] | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: FIDEL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Fidel authenticates with its own secret-key header, not a Bearer
			// scheme; the provider's header name is sent unchanged.
			'Fidel-Key': ctx.key,
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
		// Documented query parameters apply to writes as well; the shared
		// transport serializes them into the URL for every method.
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Fidel errors carry { error: { code, message } } in the body; the
			// shared transport message loses the provider explanation.
			// unknown: the provider error body is documented only for known
			// failure modes, so the shape is read structurally.
			const body = error.body as
				| { error?: { code?: string; message?: string } }
				| undefined;
			throw new FidelAPIError(
				body?.error?.message || error.message,
				error.status,
				body?.error?.code,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new FidelAPIError(error.message);
		}
		throw new FidelAPIError('Unknown Fidel API error');
	}
}
