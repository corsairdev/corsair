import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const APOLLO_API_BASE = 'https://api.apollo.io/api/v1';

type QueryValue = string | number | boolean | undefined;

export type ApolloQuery = Record<
	string,
	QueryValue | QueryValue[] | Record<string, QueryValue>
>;

export class ApolloAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are { error, error_code, error_details } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'ApolloAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.code = readString(cause.body, 'error_code');
		}
	}
}

// unknown: error body shape is not guaranteed.
function readString(body: unknown, key: string): string | undefined {
	if (body && typeof body === 'object' && key in body) {
		const value = (body as Record<string, unknown>)[key];
		return typeof value === 'string' ? value : undefined;
	}
	return undefined;
}

/**
 * Apollo reads list filters as repeated `name[]` query keys and ranges as
 * `name[min]` / `name[max]`. The shared client serializes nested objects in
 * that bracket form already; arrays only need the `[]` suffix on the key.
 */
export function toApolloQuery(params: object): ApolloQuery {
	const query: ApolloQuery = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined) continue;
		query[Array.isArray(value) ? `${key}[]` : key] = value;
	}
	return query;
}

export async function makeApolloRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		path?: Record<string, string>;
		query?: ApolloQuery;
	} = {},
): Promise<T> {
	const { method = 'GET', query } = options;

	const config: OpenAPIConfig = {
		BASE: APOLLO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Cache-Control': 'no-cache',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: options.path,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const message = readString(error.body, 'error');
			throw new ApolloAPIError(
				message ? `${error.status} ${message}` : error.message,
				error,
			);
		}
		if (error instanceof Error) {
			throw new ApolloAPIError(error.message, error);
		}
		throw new ApolloAPIError('Unknown Apollo API error');
	}
}
