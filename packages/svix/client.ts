import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export const SVIX_REGIONS = ['us', 'eu', 'in', 'ca', 'au'] as const;
export type SvixRegion = (typeof SVIX_REGIONS)[number];

function isSvixRegion(value: string | undefined): value is SvixRegion {
	return SVIX_REGIONS.includes(value as SvixRegion);
}

/**
 * Svix API keys end in their region (`….us`, `….eu`, …), the same rule the
 * official SDKs use to pick the host. An explicit `region` option wins; a key
 * without a region suffix uses the global host.
 */
export function svixBaseUrl(apiKey: string, region?: SvixRegion): string {
	if (region !== undefined) {
		if (!isSvixRegion(region)) throw new Error('Invalid Svix region');
		return `https://api.${region}.svix.com`;
	}
	const suffix = apiKey.split('.')[1];
	return isSvixRegion(suffix)
		? `https://api.${suffix}.svix.com`
		: 'https://api.svix.com';
}

export async function makeSvixRequest(
	region: SvixRegion | undefined,
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
	const config: OpenAPIConfig = {
		BASE: svixBaseUrl(apiKey, region),
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
	// Core's ApiError passes through unchanged so its status and retryAfter
	// reach the error handlers. The endpoint-specific output schema, not this
	// shared transport, determines the response type.
	return request<unknown>(config, requestOptions, { rateLimitConfig });
}
