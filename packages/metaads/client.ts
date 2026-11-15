import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const METAADS_API_BASE = 'https://graph.facebook.com';
export const METAADS_API_VERSION = 'v27.0';

// Request payloads stay generic because each strict endpoint schema defines its own JSON/form fields.
// `unknown` is returned because Graph responses are untrusted until the operation output schema validates them.
export async function makeMetaAdsRequest(
	endpoint: string,
	apiKey: string | undefined,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` is needed for provider-defined nested form values such as targeting.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		idempotencyKey?: string;
	} = {},
): Promise<unknown> {
	const { method = 'GET', body, query } = options;
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('metaads', 'oauth_2');
	}
	if (!apiKey) throw new AuthMissingError('metaads', 'oauth_2');

	const config: OpenAPIConfig = {
		BASE: METAADS_API_BASE,
		VERSION: METAADS_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${METAADS_API_VERSION}${endpoint}`,
		formData:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		query: { ...query, access_token: apiKey },
		headers: options.idempotencyKey
			? { 'X-Client-Idempotent-Key': options.idempotencyKey }
			: undefined,
	};

	// `unknown` because Graph API JSON is untrusted until the operation output schema validates it.
	return await request<unknown>(config, requestOptions, {
		// Meta documents many distinct quotas, including exhausted quotas;
		// mutations are never retried automatically by this adapter.
		rateLimitConfig: {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		},
	});
}
