import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SURF_API_BASE = 'https://api.asksurf.ai';

const RATE_LIMIT: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'X-RateLimit-Limit',
		remaining: 'X-RateLimit-Remaining',
		resetTime: 'X-RateLimit-Reset',
	},
};

export type SurfRequestOptions = {
	method?: 'GET' | 'POST' | 'DELETE';
	body?: object;
	query?: Record<string, string | number | boolean | null | undefined>;
	path?: Record<string, string>;
	baseUrl?: string;
};

type ErrorFields = { code?: string; message?: string };

function errorFields(body: unknown): ErrorFields {
	// The shared client leaves the body untyped. Surf puts { code, message } on body.error.
	if (!body || typeof body !== 'object') return {};
	const envelope = body as { error?: { code?: unknown; message?: unknown } };
	const error = envelope.error;
	if (!error || typeof error !== 'object') return {};
	return {
		code: typeof error.code === 'string' ? error.code : undefined,
		message: typeof error.message === 'string' ? error.message : undefined,
	};
}

export class SurfAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly retryAfter?: number;
	readonly method?: SurfRequestOptions['method'];
	// Surf error bodies are the documented envelope, a string, or omitted.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: SurfRequestOptions['method'];
			body?: unknown;
		},
	) {
		super(message);
		this.name = 'SurfAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.body = options.body;
	}
}

export async function makeSurfRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SurfRequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const config: OpenAPIConfig = {
		BASE: options.baseUrl ?? SURF_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path: options.path,
		query: options.query,
		body: options.body,
		mediaType: options.body !== undefined ? 'application/json' : undefined,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT,
		});
	} catch (error) {
		if (!(error instanceof ApiError)) throw error;
		const fields = errorFields(error.body);
		const retryAfter =
			error.status === 429 && error.retryAfter !== undefined
				? error.retryAfter
				: undefined;
		throw new SurfAPIError(fields.message ?? error.message, {
			status: error.status,
			code: fields.code,
			retryAfter,
			method,
			body: error.body,
		});
	}
}
