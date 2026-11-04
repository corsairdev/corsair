import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const CONTEXTDEV_API_BASE = 'https://api.context.dev/v1';

// Crawl, extract and answers accept server deadlines up to 300s.
const CONTEXTDEV_TIMEOUT_MS = 310_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const CONTEXTDEV_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type ContextDevQuery = Record<
	string,
	// unknown: nested query objects are serialized as key[sub]=value and each
	// endpoint's input schema has already typed them.
	string | number | boolean | string[] | Record<string, unknown> | undefined
>;

export class ContextDevAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly requestId?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are { message, error_code, request_id } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'ContextDevAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.code = readString(cause.body, 'error_code');
			this.requestId = readString(cause.body, 'request_id');
		}
	}
}

// unknown: error body shape is not guaranteed.
function readString(body: unknown, key: string): string | undefined {
	if (body && typeof body === 'object' && key in body) {
		const value = (body as Record<string, unknown>)[key];
		return typeof value === 'string' ? value : undefined;
	}
	return undefined;
}

function describe(error: ApiError): string {
	const code = readString(error.body, 'error_code');
	const message = readString(error.body, 'message');
	if (code || message) {
		return `${error.status} ${[code, message].filter(Boolean).join(': ')}`;
	}
	return error.message;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeContextDevRequest(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: ContextDevQuery;
		body?: object;
	} = {},
): Promise<unknown> {
	const { method = 'GET', query, body } = options;

	const config: OpenAPIConfig = {
		BASE: CONTEXTDEV_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: CONTEXTDEV_TIMEOUT_MS,
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: CONTEXTDEV_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ContextDevAPIError(describe(error), error);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new ContextDevAPIError((error as Error).message, error as Error);
		}
		throw new ContextDevAPIError('Unknown Context.dev API error');
	}
}
