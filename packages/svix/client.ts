import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SvixAPIError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly retryAfter?: number,
		// HTTP error bodies can be arbitrary JSON, text, or empty, so no fixed shape is safe.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'SvixAPIError';
	}
}

const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type SvixRegion = 'eu' | 'us' | 'ca' | 'au';

export async function makeSvixRequest(
	region: SvixRegion,
	path: string,
	apiKey: string,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		// This transport handles all operation-specific bodies and query types;
		// their schemas validate them before dispatch, so a single shape is not viable.
		body?: unknown;
		query?: Record<string, unknown>;
		idempotencyKey?: string;
	},
	// The response is untrusted and varies by operation; the caller validates it.
): Promise<unknown> {
	if (!apiKey.trim()) throw new AuthMissingError('svix', 'api_key');
	if (!['eu', 'us', 'ca', 'au'].includes(region))
		throw new Error('Invalid Svix region');
	const config: OpenAPIConfig = {
		BASE: `https://api.${region}.svix.com`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
		headers:
			options.idempotencyKey === undefined
				? undefined
				: { 'Idempotency-Key': options.idempotencyKey },
	};
	try {
		// The endpoint-specific output schema, not this shared transport, determines the response type.
		return await request<unknown>(config, requestOptions, { rateLimitConfig });
	} catch (error) {
		if (error instanceof ApiError) {
			// Provider error bodies may be non-objects; inspect detail only after narrowing.
			const body: unknown = error.body;
			const data =
				body && typeof body === 'object'
					? (body as Record<string, unknown>)
					: undefined;
			throw new SvixAPIError(
				typeof data?.detail === 'string' ? data.detail : error.message,
				error.status,
				error.retryAfter,
				body,
			);
		}
		throw error;
	}
}
