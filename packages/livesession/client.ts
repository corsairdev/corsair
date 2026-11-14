/**
 * LiveSession REST API client.
 * Official docs: https://livesession.dev/docs/api/rest
 * Authentication: Personal Access Token sent as `Authorization: Bearer <token>`.
 * Rate limit: 2 requests per second per token.
 */
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LIVESESSION_API_BASE = 'https://api.livesession.io/v1';

export type LiveSessionHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class LiveSessionAPIError extends Error {
	public readonly method?: LiveSessionHttpMethod;

	// unknown is necessary because LiveSession error bodies are provider-defined
	// JSON objects; a closed error body union is not published for failures.
	constructor(
		message: string,
		options?: { cause?: Error; method?: LiveSessionHttpMethod },
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'LiveSessionAPIError';
		this.method = options?.method;
	}
}

export type LiveSessionRequestOptions = {
	method?: LiveSessionHttpMethod;
	// unknown is necessary because write bodies are operation-specific JSON bags;
	// a closed union of eleven payload shapes is impractical for a shared transport.
	body?: unknown;
	// unknown is necessary because query values differ per operation; a closed
	// query-value union would duplicate every input schema.
	query?: Record<string, unknown>;
};

// corsair/http retries 429 responses on its own. Reads may be replayed safely,
// but a write must never be replayed by the transport: the server may already
// have applied it before returning 429.
const READ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

const WRITE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function config(apiKey: string): OpenAPIConfig {
	return {
		BASE: LIVESESSION_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown is necessary because the provider error body is arbitrary JSON; it is
// narrowed with `in` checks before any field is read.
export async function makeLiveSessionRequest<T>(
	endpoint: string,
	apiKey: string,
	options: LiveSessionRequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const normalizedKey = apiKey.trim();
	if (!normalizedKey) {
		throw new LiveSessionAPIError('LiveSession API token is required', {
			method,
		});
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' || method === 'DELETE' ? undefined : options.body,
		query: options.query,
		mediaType:
			options.body === undefined
				? undefined
				: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config(normalizedKey), requestOptions, {
			rateLimitConfig:
				method === 'GET' ? READ_RATE_LIMIT_CONFIG : WRITE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError carries the status and Retry-After the 429 handler
		// matches on, so it must reach core unchanged; wrapping it would hide
		// both from the handler.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new LiveSessionAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new LiveSessionAPIError('Unknown LiveSession API error', { method });
	}
}
