import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RemoetAPIError extends Error {
	public readonly status?: number;
	// unknown is used here because the provider error payload is untyped wire
	// JSON; it is only stored for inspection and read through type guards.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'RemoetAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const REMOET_API_BASE = 'https://api.remoet.dev';

/**
 * Transport-level retries are off: a 429 from Remoet is either the per-minute
 * limit or the daily cap, and only the first is worth retrying. That decision
 * needs the response body, so it lives in error-handlers.ts. On a per-minute
 * 429 Remoet sends `X-RateLimit-Reset` as the number of seconds until the
 * window resets, which is exactly how the transport parses a retry-after
 * header, so it is read into `retryAfter` for the error handler to wait on.
 */
const REMOET_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'x-ratelimit-reset' },
};

/**
 * The transport replaces the message of common statuses (400, 401, 404, 429
 * and so on) with a fixed string, which hides Remoet's explanation, e.g.
 * whether a 429 is the per-minute limit or the daily cap. Prefer the body.
 */
function messageOf(error: ApiError): string {
	const body = error.body;
	if (typeof body === 'object' && body !== null && 'message' in body) {
		const message = body.message;
		if (typeof message === 'string' && message) return message;
	}
	return error.message;
}

/** Sends an authenticated request to the Remoet API. */
export async function makeRemoetRequest(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH';
		// unknown is used here because request bodies carry arbitrary
		// provider JSON; values are serialized as-is and never cast.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<unknown> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: REMOET_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: REMOET_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RemoetAPIError(messageOf(error), { cause: error });
		}
		if (error instanceof Error) {
			throw new RemoetAPIError(error.message, { cause: error });
		}
		throw new RemoetAPIError('Unknown Remoet API error');
	}
}
