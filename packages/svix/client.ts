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
		body?: unknown;
		query?: Record<string, unknown>;
		idempotencyKey?: string;
	},
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
		return await request<unknown>(config, requestOptions, { rateLimitConfig });
	} catch (error) {
		if (error instanceof ApiError) {
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
