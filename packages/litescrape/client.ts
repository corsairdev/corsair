import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class LitescrapeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LitescrapeAPIError';
	}
}

/**
 * LiteScrape REST gateway. Every endpoint is a `GET` under `/api` and takes
 * `Authorization: Bearer <key>` (keys look like `ls_live_...`). Reference:
 * https://litescrape.com/docs/reference and https://litescrape.com/docs.
 */
export const LITESCRAPE_API_BASE = 'https://api.litescrape.com';

export async function makeLitescrapeRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic
		// over a JSON record instead of a closed per-endpoint union.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// LiteScrape authenticates every public endpoint with a bearer key
	// (https://litescrape.com/docs/reference). An empty key means no
	// credentials are configured (the keyBuilder resolves that case to ''),
	// so fail fast with Corsair's missing-auth error instead of sending a
	// keyless request that the provider answers with `401 missing_api_key`.
	if (apiKey.length === 0) {
		throw new AuthMissingError('litescrape', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: LITESCRAPE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// ApiError carries the provider status and retryAfter the error
		// handlers route on, so it must reach them untouched.
		if (error instanceof Error) {
			throw error;
		}
		throw new LitescrapeAPIError('Unknown error');
	}
}
