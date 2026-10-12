import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

export class ComposioAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ComposioAPIError';
	}
}

export const COMPOSIO_API_BASE = 'https://backend.composio.dev/api/v3.1';

// The plugin's RATE_LIMIT_ERROR handler owns retries. A transport retry on top
// of it would multiply attempts. maxRetries 0 still reads Retry-After into the
// error so the handler can honor it.
const COMPOSIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

type QueryValue = string | number | boolean | string[] | undefined;

export async function makeComposioRequest<S extends z.ZodType>(
	endpoint: string,
	apiKey: string,
	responseSchema: S,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		// Validated endpoint inputs are specific objects. An index signature
		// would force a cast at every call.
		body?: object;
		query?: Record<string, QueryValue>;
		timeoutMs?: number;
	} = {},
): Promise<z.infer<S>> {
	const { method = 'GET', body, query, timeoutMs } = options;

	const config: OpenAPIConfig = {
		BASE: COMPOSIO_API_BASE,
		VERSION: '3.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs,
		HEADERS: { 'x-api-key': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
		query,
	};

	let raw: z.input<S>;
	try {
		raw = await request(config, requestOptions, {
			rateLimitConfig: COMPOSIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ComposioAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new ComposioAPIError(error.message);
		}
		throw new ComposioAPIError('Unknown error');
	}
	return responseSchema.parse(raw);
}
