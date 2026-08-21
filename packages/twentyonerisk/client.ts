import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class TwentyOneRiskAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TwentyOneRiskAPIError';
	}
}

/**
 * Canonical OData host.
 *
 * `www.21risk.com` must not be used: it answers every OData request with a 307
 * to this host, and because that is a cross-origin redirect the fetch spec
 * requires the `Authorization` header to be dropped. The retried request then
 * arrives unauthenticated, and the API answers an unauthenticated request with
 * 404 rather than 401 — so the failure surfaces as a confusing "not found"
 * instead of an auth error.
 */
const TWENTYONERISK_API_BASE = 'https://21risk.com/odata/v5';

export async function makeTwentyOneRiskRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		/** When set, provider JSON is validated before it is returned. */
		schema?: ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, schema } = options;

	const config: OpenAPIConfig = {
		BASE: TWENTYONERISK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// The API states the accepted forms itself on a malformed header:
			// `Bearer <api-key>` or `Basic base64(user:<api-key>)`.
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		const data = await request<unknown>(config, requestOptions);
		return schema ? schema.parse(data) : (data as T);
	} catch (error) {
		// `ApiError` is rethrown untouched: it carries `status`, `retryAfter` and
		// the rate-limit headers that `error-handlers.ts` matches on. Wrapping it
		// would strip those and leave every status-based handler dead, since the
		// transport's 429 message is "Too Many Requests" — text that matches
		// neither "429" nor "rate_limited".
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new TwentyOneRiskAPIError(error.message);
		}
		throw new TwentyOneRiskAPIError('Unknown error');
	}
}
