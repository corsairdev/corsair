import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GeminiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GeminiAPIError';
	}
}

export const GEMINI_API_BASE =
	'https://generativelanguage.googleapis.com/v1beta';

/**
 * Performs a request against the Gemini API.
 *
 * Auth: the API key is sent as the `x-goog-api-key` header (Google's documented
 * method), forwarded unconditionally on every HTTP method alongside any caller
 * supplied query params/headers — Gemini's long-running-operation endpoints are
 * GET while generation endpoints are POST, so neither can be dropped by method.
 */
export async function makeGeminiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;

	const config: OpenAPIConfig = {
		BASE: GEMINI_API_BASE,
		VERSION: 'v1beta',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'x-goog-api-key': apiKey,
			...headers,
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
		// Preserve ApiError as-is so status codes and Retry-After values remain
		// intact for error-handlers.ts — wrapping/rethrowing a new error type
		// here would silently drop retry/rate-limit information.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new GeminiAPIError(error.message);
		}
		throw new GeminiAPIError('Unknown error');
	}
}
