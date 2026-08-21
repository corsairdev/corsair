import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class AccredibleCertificatesAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AccredibleCertificatesAPIError';
	}
}

/**
 * Production host from the official OpenAPI document
 * (`https://github.com/accredible/api-documentation`, `openapi.json`), which
 * lists `https://api.accredible.com/` alongside the EU and sandbox hosts. Paths
 * in that document are version-prefixed, so the version lives here.
 */
const ACCREDIBLECERTIFICATES_API_BASE = 'https://api.accredible.com/v1';

export async function makeAccredibleCertificatesRequest<T>(
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
		BASE: ACCREDIBLECERTIFICATES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Scheme documented by the official spec's `ApiKeyAuth`:
			// "Use the format: Token token=YOUR_API_KEY".
			Authorization: `Token token=${apiKey}`,
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
			throw new AccredibleCertificatesAPIError(error.message);
		}
		throw new AccredibleCertificatesAPIError('Unknown error');
	}
}
