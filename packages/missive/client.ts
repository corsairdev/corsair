import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MISSIVE_BASE_URL = 'https://public.missiveapp.com/v1';

export type MissiveMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export class MissiveAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` is intentional here: the body is whatever Missive returned
	// (a JSON error object per the docs, sometimes plain text), so no
	// narrower type can be guaranteed and callers must narrow it themselves.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'MissiveAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

// Missive answers 429 with a Retry-After header (seconds) and X-RateLimit-*
// metadata. Retrying belongs to the endpoint-level error handlers, which can
// tell reads from writes, so the transport never replays a request here.
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type MissiveRequestOptions = {
	method?: MissiveMethod;
	// `unknown` is intentional here: bodies are provider-defined payloads
	// (objects, arrays for batch updates, or undefined) validated by each
	// operation's input schema before they reach this transport.
	body?: unknown;
	// `unknown` is intentional here: query values are provider-defined filter,
	// search, and pagination inputs forwarded as-is to the Missive API.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	mediaType?: string;
};

export async function makeMissiveRequest<T>(
	endpoint: string,
	key: string,
	options: MissiveRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType } = options;

	const config: OpenAPIConfig = {
		BASE: MISSIVE_BASE_URL,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		TIMEOUT: 60_000,
		CREDENTIALS: 'omit',
		// The shared client turns TOKEN into `Authorization: Bearer <token>`,
		// which is exactly how Missive documents personal API tokens.
		TOKEN: key,
		HEADERS: {
			Accept: 'application/json',
			...headers,
		},
	};

	const hasBody = body !== undefined && method !== 'GET';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: hasBody ? (mediaType ?? 'application/json') : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof MissiveAPIError) throw error;
		if (error instanceof Error) {
			throw new MissiveAPIError(error.message, { cause: error });
		}
		throw new MissiveAPIError('Unknown Missive API error');
	}
}
