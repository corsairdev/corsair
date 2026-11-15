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

// Core's ApiError keeps the request's query, body and full URL. For LiveSession
// those can hold a visitor's email (sessions.list filters) or a webhook URL with
// its own credentials, so the error is rebuilt without them. Status, provider
// body, message, Retry-After and rate-limit headers are kept for the handlers.
function withoutRequestData(error: ApiError): ApiError {
	const url = new URL(error.url, LIVESESSION_API_BASE);
	url.search = '';
	const rebuilt = new ApiError(
		{
			...error.request,
			url: error.request.url.split('?')[0] ?? error.request.url,
			body: undefined,
			formData: undefined,
			query: undefined,
		},
		{
			url: url.toString(),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
	// Same message, so the original stack carries no sent data.
	if (error.stack) rebuilt.stack = error.stack;
	return rebuilt;
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
		// matches on, so it stays an ApiError; only the sent data is removed.
		if (error instanceof ApiError) throw withoutRequestData(error);
		if (error instanceof Error) {
			throw new LiveSessionAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new LiveSessionAPIError('Unknown LiveSession API error', { method });
	}
}
