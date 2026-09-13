import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ReplyioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'ReplyioAPIError';
	}
}

const REPLY_IO_API_BASE = 'https://api.reply.io/v3';

// Reply.io allows 100 requests per minute and 3,000 requests per hour per
// user, signalling exhaustion with 429 + Retry-After. Retry briefly at the
// HTTP layer; the plugin error-handlers.ts policy owns further retries.
const REPLY_IO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

// Justification for `unknown` below: every Reply.io endpoint takes a
// different JSON body shape, and each caller passes its own zod-inferred
// input type. `unknown` is the only honest shared parameter type; it is
// never inspected, narrowed, or asserted on inside this function — it is
// forwarded verbatim to the HTTP layer.
export async function makeReplyioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: REPLY_IO_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		// Query parameters are forwarded for every method: list endpoints use
		// GET, while filter endpoints (e.g. POST /email-accounts/filter) carry
		// pagination in the query string alongside a JSON body.
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: REPLY_IO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ReplyioAPIError(
				error.message,
				readProblemCode(error.body),
				error.status,
			);
		}
		if (error instanceof Error) {
			throw new ReplyioAPIError(error.message);
		}
		throw new ReplyioAPIError('Unknown error');
	}
}

// Justification for `unknown` below: the Reply.io error envelope
// (application/problem+json) is parsed by the shared HTTP layer into an
// untyped body. We read only the documented string `code` field
// (e.g. "sequence.notFound") via structural checks, without asserting its
// overall shape.
function readProblemCode(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null) {
		return undefined;
	}
	if (!('code' in body)) {
		return undefined;
	}
	const code: unknown = body.code;
	return typeof code === 'string' ? code : undefined;
}
