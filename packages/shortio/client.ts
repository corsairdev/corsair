import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ShortioAPIError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly retryAfter?: number,
		// Error bodies may be JSON, text, or empty and have no shared schema.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'ShortioAPIError';
	}
}

const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

// The untrusted response varies by endpoint and is parsed by its output schema.
export async function makeShortioRequest(
	path: string,
	apiKey: string,
	options: {
		method: 'GET' | 'POST' | 'DELETE';
		// Each operation validates a different query and body before dispatch.
		query?: Record<string, unknown>;
		body?: unknown;
	},
): Promise<unknown> {
	if (!apiKey?.trim()) throw new AuthMissingError('shortio', 'api_key');
	const config: OpenAPIConfig = {
		BASE: 'https://api.short.io',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: apiKey },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		// Endpoint-specific response schemas narrow the untrusted payload.
		return await request<unknown>(config, requestOptions, { rateLimitConfig });
	} catch (error) {
		if (error instanceof ApiError)
			throw new ShortioAPIError(
				error.message,
				error.status,
				error.retryAfter,
				error.body,
			);
		throw error;
	}
}
