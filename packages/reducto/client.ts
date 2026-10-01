import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ReductoAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error; body?: unknown }) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'ReductoAPIError';
		this.body = options?.body;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

// https://docs.reducto.ai/agent-guide — Bearer auth, JSON except /upload.
export const REDUCTO_API_BASE = 'https://platform.reducto.ai';

// Sync parse/extract of a multi-page file regularly outlives the shared default.
const REDUCTO_TIMEOUT_MS = 120_000;

const REDUCTO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'X-RateLimit-Limit',
		remaining: 'X-RateLimit-Remaining',
		resetTime: 'X-RateLimit-Reset',
	},
};

export type ReductoQueryValue = string | number | boolean | undefined;

export type ReductoRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, ReductoQueryValue>;
	path?: Record<string, string>;
	formData?: Record<string, unknown>;
	baseUrl?: string;
};

function buildConfig(baseUrl: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: REDUCTO_TIMEOUT_MS,
		TOKEN: apiKey,
		// File ids are `reducto://…`. The deletion docs interpolate that string
		// into the path as-is. encodeURIComponent would turn the scheme into
		// one segment and the server rejects it.
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

export async function makeReductoRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ReductoRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, path, formData } = options;
	const config = buildConfig(options.baseUrl ?? REDUCTO_API_BASE, apiKey);
	const hasForm = formData !== undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		formData: hasForm ? formData : undefined,
		body: !hasForm && body !== undefined ? body : undefined,
		// A JSON content type on a multipart upload drops the boundary and
		// Reducto rejects the file. Only JSON calls set mediaType.
		mediaType:
			!hasForm && body !== undefined
				? 'application/json; charset=utf-8'
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: REDUCTO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const detail =
				typeof error.body === 'string'
					? error.body
					: JSON.stringify(error.body);
			const message =
				error.message && error.message !== '[object Object]'
					? `${error.message}: ${detail}`
					: detail;
			throw new ReductoAPIError(message, { cause: error, body: error.body });
		}
		if (error instanceof Error) {
			throw new ReductoAPIError(error.message, { cause: error });
		}
		throw new ReductoAPIError('Unknown Reducto API error');
	}
}
