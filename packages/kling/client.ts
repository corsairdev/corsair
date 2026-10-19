import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class KlingAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'KlingAPIError';
	}
}

// Kling AI open platform (international / non-China) host. The docs moved the
// endpoint from https://api.klingai.com to this Singapore host; it is the
// documented base for servers outside China.
// https://kling.ai/document-api/api/get-started/authentication
export const KLING_API_BASE = 'https://api-singapore.klingai.com';

export async function makeKlingRequest<T>(
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

	// Every Kling endpoint requires the API key, so an explicitly empty key
	// means no credentials are configured (the keyBuilder resolves that case
	// to ''). Fail fast with Corsair's missing-auth error instead of sending a
	// request the provider answers with 401 (docs error code 1001).
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('kling', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: KLING_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Task creation returns quickly, but a few synchronous endpoints
		// (such as face recognition) can exceed the shared 20s default.
		TIMEOUT: 30_000,
		HEADERS: {
			'Content-Type': 'application/json',
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new KlingAPIError('Unknown error');
	}
}
