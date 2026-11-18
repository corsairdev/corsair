import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const CLAY_API_BASE = 'https://api.clay.com/public/v0';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const CLAY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class ClayAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	// unknown: Clay error bodies are { message } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'ClayAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

// unknown: error body shape is not guaranteed.
function readMessage(body: unknown): string | undefined {
	if (body && typeof body === 'object' && 'message' in body) {
		const { message } = body as { message: unknown };
		return typeof message === 'string' ? message : undefined;
	}
	return undefined;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeClayRequest(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		path?: Record<string, string>;
		query?: Record<string, string | number | undefined>;
		body?: object;
	} = {},
): Promise<unknown> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CLAY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'clay-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: options.path,
		query,
		body,
		mediaType: body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: CLAY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const message = readMessage(error.body);
			throw new ClayAPIError(
				message ? `${error.status} ${message}` : error.message,
				error,
			);
		}
		if (error instanceof Error) {
			throw new ClayAPIError(error.message, error);
		}
		throw new ClayAPIError('Unknown Clay API error');
	}
}
