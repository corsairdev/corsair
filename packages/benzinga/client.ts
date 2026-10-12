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
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: BENZINGA_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// NOTE: TOKEN is intentionally unset. corsair/http turns
		// config.TOKEN into an `Authorization: Bearer` header, which the
		// Benzinga API rejects as anonymous. Auth travels only via `token`.
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
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
		throw new BenzingaAPIError('Unknown error');
	}
}
