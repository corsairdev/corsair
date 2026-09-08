import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RootlyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: string | number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'RootlyAPIError';

		// Preserve ApiError properties so error handlers can inspect status codes
		// and rate-limit headers without needing instanceof ApiError checks.
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}

	public isRateLimitError(): boolean {
		return this.status === 429;
	}
}

const ROOTLY_API_BASE = 'https://api.rootly.com/v1';

export async function makeRootlyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ROOTLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/vnd.api+json',
			Accept: 'application/vnd.api+json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/vnd.api+json',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T | string>(config, requestOptions);

		// When the shared request() parser doesn't recognize JSON:API media type
		// (e.g. application/vnd.api+json), it returns a raw string. Parse to object.
		if (typeof response === 'string') {
			try {
				return JSON.parse(response) as T;
			} catch {
				return response as unknown as T;
			}
		}

		return response as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RootlyAPIError(error.message, error.status, {
				cause: error,
			});
		}

		if (error instanceof Error) {
			throw new RootlyAPIError(error.message, undefined, { cause: error });
		}

		throw new RootlyAPIError('Unknown error');
	}
}
