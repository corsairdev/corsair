import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ComposioAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ComposioAPIError';
	}
}

/** Composio v3 API root. v1/v2 return 410. */
export const COMPOSIO_API_BASE = 'https://backend.composio.dev/api';

/**
 * Drop undefined entries from a query object so they are not sent upstream.
 * Shared by all endpoint modules.
 */
export function omitUndefined(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(query).filter(([, v]) => v !== undefined),
	);
}

export async function makeComposioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: COMPOSIO_API_BASE,
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
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
		// Preserve status + retryAfter (ms) from ApiError so error handlers can
		// match on structured fields and honor Retry-After delays.
		if (error instanceof ApiError) {
			throw new ComposioAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new ComposioAPIError(error.message);
		}
		throw new ComposioAPIError('Unknown error');
	}
}
