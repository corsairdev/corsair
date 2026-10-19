import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class MagicHourAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MagicHourAPIError';
	}
}

// Magic Hour serves every documented operation from this origin; each path is
// prefixed with `/v1` (https://docs.magichour.ai/api-reference/overview).
export const MAGIC_HOUR_API_BASE = 'https://api.magichour.ai';

export async function makeMagicHourRequest<T>(
	endpoint: string,
	apiKey?: string,
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

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Every Magic Hour operation is
	// scoped to the account that owns the API key, so fail fast with
	// Corsair's missing-auth error instead of sending a keyless request the
	// provider would answer with 401.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('magichour', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: MAGIC_HOUR_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			// Docs: "All API requests must be authenticated by including your
			// API key in the Authorization header: Authorization: Bearer ...".
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
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
		// Provider failures already arrive as ApiError (with status/retryAfter
		// preserved for the error handlers); only non-Error throws need
		// wrapping.
		if (error instanceof Error) {
			throw error;
		}
		throw new MagicHourAPIError('Unknown error');
	}
}
