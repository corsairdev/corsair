import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BenzingaAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BenzingaAPIError';
	}
}

const BENZINGA_API_BASE = 'https://api.benzinga.com';

/**
 * Authenticated request to the Benzinga API.
 *
 * Auth (https://docs.benzinga.com/api-reference/authentication): the API key
 * is sent as the `token` query parameter. The docs also describe an
 * `Authorization: token <KEY>` header, but live requests carrying that header
 * are rejected as anonymous, so only the query parameter is sent.
 * `Accept: application/json` is required, otherwise the API defaults to XML.
 *
 * `ApiError` from `corsair/http` is rethrown untouched so `status` and
 * `retryAfter` survive for the 429 handler in `./error-handlers`.
 */
export async function makeBenzingaRequest<T>(
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
		BASE: BENZINGA_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// NOTE: TOKEN is intentionally unset. corsair/http turns
		// config.TOKEN into an `Authorization: Bearer` header, which the
		// Benzinga API rejects as anonymous. Auth travels only via `token`.
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
		query: {
			...query,
			token: apiKey,
		},
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BenzingaAPIError(error.message);
		}
		// `unknown` is narrowed above; this documents the unreachable fallback.
		throw new BenzingaAPIError('Unknown error');
	}
}
