import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class RocketlaneAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'RocketlaneAPIError';
	}
}

/** Official Rocketlane API origin. All documented resources are versioned under /1.0. */
export const ROCKETLANE_API_BASE = 'https://api.rocketlane.com/api';

export async function makeRocketlaneRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// The shared transport accepts each endpoint's independently validated body shape.
		body?: unknown;
		query?: Record<
			string,
			string | number | boolean | readonly string[] | undefined
		>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ROCKETLANE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			// Rocketlane documents API-key authentication using this exact header.
			'api-key': apiKey,
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
		// Rocketlane documents includeFields as a comma-separated query parameter.
		query: query && {
			...query,
			...(Array.isArray(query.includeFields) && {
				includeFields: query.includeFields.join(','),
			}),
		},
	};

	try {
		return await request<T>(config, requestOptions, {
			// Rocketlane does not document idempotency keys; never replay writes.
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 1000,
				backoffMultiplier: 2,
				headerNames: {
					retryAfter: 'retry-after',
					resetTime: 'x-ratelimit-reset',
					remaining: 'x-ratelimit-remaining',
					limit: 'x-ratelimit-limit',
				},
			},
		});
	} catch (error) {
		// Preserve ApiError so Corsair's provider error handlers can inspect its
		// status and Retry-After metadata.
		throw error;
	}
}
