import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MixmaxAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'MixmaxAPIError';
	}
}

const MIXMAX_API_BASE = 'https://api.mixmax.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Single retry owner: the plugin error handler owns the 429 retry policy,
	// so the transport stays single-attempt (maxRetries 0). Keeping enabled
	// true makes the shared transport read the Retry-After header and attach
	// it to the thrown error without ever retrying on its own.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeMixmaxRequest<T>(
	ctx: { key: string },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Mixmax request bodies differ by operation and are validated by the
		// corresponding endpoint schema before reaching this transport
		// boundary. unknown: each endpoint schema declares its own body shape.
		body?: Record<string, unknown>;
		// unknown: Mixmax documents query parameters on several write
		// endpoints too (e.g. isInline on POST /v1/snippettags), and array
		// values such as messageIds on GET /v1/livefeed serialize as repeated
		// query keys, so scalars and arrays of scalars are both part of the
		// contract and query values are forwarded for every method.
		query?: Record<
			string,
			string | number | boolean | (string | number | boolean)[] | undefined
		>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: MIXMAX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: ctx.key,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Mixmax authenticates every REST call with a personal token in the
			// X-API-Token header (developer.mixmax.com, security scheme sec0).
			'X-API-Token': ctx.key,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// DELETE bodies are part of the documented Mixmax contract (e.g.
		// DELETE /v1/unsubscribes takes { email }), so every non-GET method
		// forwards the validated body.
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Preserve the status and Retry-After metadata so the plugin error
			// handler can honor the provider's rate-limit contract.
			throw new MixmaxAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new MixmaxAPIError(error.message);
		}
		throw new MixmaxAPIError('Unknown Mixmax API error');
	}
}
