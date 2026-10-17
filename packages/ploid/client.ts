import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class PloidAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown: Ploid error bodies are documented as a JSON `error` object, but
	// the envelope is additionalProperties: true and can also be omitted.
	public readonly body?: unknown;
	public readonly code?: string;
	public readonly retryAfter?: number;
	public readonly method?: PloidRequestOptions['method'];

	constructor(
		message: string,
		options?: {
			cause?: Error;
			body?: unknown;
			code?: string;
			method?: PloidRequestOptions['method'];
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'PloidAPIError';
		this.body = options?.body;
		this.code = options?.code;
		this.method = options?.method;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.code = this.code ?? providerErrorCode(options.cause.body);
		}
	}
}

// https://ploid.com/documentation — Bearer auth, JSON in and out.
export const PLOID_API_BASE = 'https://api.ploid.com';

// Deep synchronous searches run research under one request; the shared
// default timeout is too short for them.
const PLOID_TIMEOUT_MS = 120_000;

// One attempt per call: the plugin error handlers own every retry so 429
// waits and 5xx backoff stay visible to the caller. `enabled: true` still
// parses Retry-After onto the ApiError; `enabled: false` would drop it.
const PLOID_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'RateLimit-Limit',
		remaining: 'RateLimit-Remaining',
		resetTime: 'RateLimit-Reset',
	},
};

export type PloidQueryValue = string | number | boolean | undefined;

export type PloidRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Validated endpoint inputs are specific objects. An index signature would
	// force a cast at every call.
	body?: object;
	query?: Record<string, PloidQueryValue>;
	path?: Record<string, string>;
	baseUrl?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// The documented error body is { error: { code, message, request_id } }.
function providerErrorCode(body: unknown): string | undefined {
	if (!isRecord(body) || !isRecord(body.error)) return undefined;
	const code = body.error.code;
	return typeof code === 'string' ? code : undefined;
}

// For statuses the shared client does not map itself it stringifies
// body.error into ApiError.message, which renders as "[object Object]";
// the provider's own error.message is the readable detail.
function providerErrorMessage(body: unknown): string | undefined {
	if (!isRecord(body) || !isRecord(body.error)) return undefined;
	const message = body.error.message;
	return typeof message === 'string' && message !== '' ? message : undefined;
}

function buildConfig(baseUrl: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: PLOID_TIMEOUT_MS,
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

export async function makePloidRequest<T>(
	endpoint: string,
	apiKey: string,
	options: PloidRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, path } = options;
	const config = buildConfig(options.baseUrl ?? PLOID_API_BASE, apiKey);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		body,
		mediaType:
			body !== undefined ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: PLOID_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const code = providerErrorCode(error.body);
			const providerMessage = providerErrorMessage(error.body);
			const detail =
				providerMessage ??
				(typeof error.body === 'string'
					? error.body
					: JSON.stringify(error.body));
			const message =
				code !== undefined
					? `${code}: ${detail}`
					: error.message !== '[object Object]'
						? `${error.message}: ${detail}`
						: detail;
			throw new PloidAPIError(message, {
				cause: error,
				body: error.body,
				code,
				method,
			});
		}
		if (error instanceof Error) {
			throw new PloidAPIError(error.message, { cause: error, method });
		}
		throw new PloidAPIError('Unknown Ploid API error', { method });
	}
}
