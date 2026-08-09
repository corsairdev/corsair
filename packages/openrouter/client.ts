import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OpenRouterAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'OpenRouterAPIError';
	}
}

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

/**
 * Performs a request against the OpenRouter API.
 * Auth: API key via Bearer token (the only supported auth type).
 * Query parameters are forwarded unconditionally regardless of HTTP method.
 */
export async function makeOpenRouterRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// body shape varies per endpoint and is validated by callers via typed Zod input schemas before being passed here
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: OPENROUTER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
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
		// Re-thrown as-is: ApiError already carries the HTTP status code and
		// Retry-After info that error-handlers.ts inspects. Wrapping it here
		// would hide those fields behind a message string.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new OpenRouterAPIError(error.message);
		}
		throw new OpenRouterAPIError('Unknown error');
	}
}
