import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const CLORO_API_BASE = 'https://api.cloro.dev';

// cloro stops starting new attempts after 5 minutes and asks for a client
// timeout of at least 300s: https://cloro.dev/docs/guides/error-handling
const CLORO_TIMEOUT_MS = 310_000;

// error-handlers.ts owns retries, so the client makes one attempt. 503 is
// listed so the client still reads its Retry-After into the error.
const CLORO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 503,
};

export class CloroAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly retryAfter?: number;
	// unknown: error bodies follow { success, error } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'CloroAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.code = readError(cause.body)?.code;
		}
	}
}

// unknown: error body shape is not guaranteed.
function readError(
	body: unknown,
): { code?: string; message?: string } | undefined {
	if (!body || typeof body !== 'object' || !('error' in body)) return undefined;
	const error = (body as { error: unknown }).error;
	if (!error || typeof error !== 'object') return undefined;
	const { code, message } = error as Record<string, unknown>;
	return {
		code: typeof code === 'string' ? code : undefined,
		message: typeof message === 'string' ? message : undefined,
	};
}

function describe(error: ApiError): string {
	const detail = readError(error.body);
	if (detail?.code || detail?.message) {
		return `${error.status} ${[detail.code, detail.message].filter(Boolean).join(': ')}`;
	}
	return error.message;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeCloroRequest(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		body?: object;
		query?: Record<string, string | undefined>;
	} = {},
): Promise<unknown> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CLORO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: CLORO_TIMEOUT_MS,
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
			rateLimitConfig: CLORO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CloroAPIError(describe(error), error);
		}
		if (error instanceof Error) {
			throw new CloroAPIError(error.message, error);
		}
		throw new CloroAPIError('Unknown cloro API error');
	}
}
