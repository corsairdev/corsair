import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class KlipfolioAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'KlipfolioAPIError';
	}
}

const KLIPFOLIO_API_BASE = 'https://app.klipfolio.com/api/1.0';

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

export async function makeKlipfolioRequest<T>(
	ctx: { key: string },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		// unknown: Klipfolio request bodies differ by operation and are
		// validated by the corresponding endpoint schema before this boundary.
		body?: Record<string, unknown>;
		// unknown: Klipfolio documents offset-based list pagination with
		// scalar query parameters.
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: KLIPFOLIO_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Klipfolio authenticates with its own API-key header, not a Bearer
			// scheme; the provider's header name is sent unchanged.
			'kf-api-key': ctx.key,
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
			// Klipfolio failures explain themselves in the body (error code and
			// message); the shared transport message loses that provider text.
			// unknown: the provider error body is documented only for known
			// failure modes, so the shape is read structurally.
			const provider = error.body as
				| { error?: { code?: string; message?: string } }
				| undefined;
			throw new KlipfolioAPIError(
				provider?.error?.message || error.message,
				error.status,
				provider?.error?.code,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new KlipfolioAPIError(error.message);
		}
		throw new KlipfolioAPIError('Unknown Klipfolio API error');
	}
}
