import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class KeenableAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'KeenableAPIError';
	}
}

export const KEENABLE_API_BASE = 'https://api.keenable.ai';

export async function makeKeenableRequest<T>(
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
	// keyBuilder resolves that case to ''). Public callers pass undefined
	// instead, so only keyed requests hit this gate — they fail fast with
	// Corsair's missing-auth error instead of sending a keyless request.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('keenable', 'api_key');
	}

	// The API key goes in X-API-Key; the docs also accept an
	// `Authorization: Bearer keen_...` header, and X-API-Key wins if both are
	// sent (docs /authentication).
	const authHeaders: Record<string, string> = apiKey
		? { 'X-API-Key': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: KEENABLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
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
		// ApiError carries status/retryAfter for the error handlers, so it is
		// rethrown untouched; only non-Error throwables get wrapped.
		if (error instanceof Error) {
			throw error;
		}
		throw new KeenableAPIError('Unknown error');
	}
}
