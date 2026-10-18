import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ORBIT_API_BASE = 'https://api.orbitsearch.com';

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

export type OrbitRequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string>;
	headers?: Record<string, string>;
	formData?: Record<string, Blob | string>;
	baseUrl?: string;
};

type ErrorFields = { code?: string; message?: string };

function errorFields(body: unknown): ErrorFields {
	// Orbit puts { code, message } on body.error. The shared client stringifies that object.
	if (!body || typeof body !== 'object') return {};
	const envelope = body as { error?: { code?: unknown; message?: unknown } };
	const error = envelope.error;
	if (!error || typeof error !== 'object') return {};
	return {
		code: typeof error.code === 'string' ? error.code : undefined,
		message: typeof error.message === 'string' ? error.message : undefined,
	};
}

export class OrbitAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly retryAfter?: number;
	readonly method?: OrbitRequestOptions['method'];
	readonly hasIdempotency: boolean;
	// Orbit error bodies are the documented envelope, a string, or omitted.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: OrbitRequestOptions['method'];
			hasIdempotency?: boolean;
			body?: unknown;
		},
	) {
		super(message);
		this.name = 'OrbitAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.hasIdempotency = options.hasIdempotency ?? false;
		this.body = options.body;
	}
}

export async function makeOrbitRequest<T>(
	endpoint: string,
	apiKey: string,
	options: OrbitRequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const hasForm = options.formData !== undefined;
	const config: OpenAPIConfig = {
		BASE: options.baseUrl ?? ORBIT_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json', ...options.headers },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path: options.path,
		query: options.query,
		body: !hasForm ? options.body : undefined,
		formData: options.formData,
		mediaType:
			!hasForm && options.body !== undefined ? 'application/json' : undefined,
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
		throw new OrbitAPIError(fields.message ?? error.message, {
			status: error.status,
			code: fields.code,
			retryAfter,
			method,
			hasIdempotency: Boolean(options.headers?.['Idempotency-Key']),
			body: error.body,
		});
	}
}
