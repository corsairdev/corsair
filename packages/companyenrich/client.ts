import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class CompanyEnrichAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CompanyEnrichAPIError';
	}
}

/**
 * Base URL from the `servers` entry of the v2 OpenAPI document published on
 * every reference page, e.g.
 * https://docs.companyenrich.com/reference/get_v2-companies-enrich.md
 */
export const COMPANYENRICH_API_BASE = 'https://api.companyenrich.com';

// Corsair's endpoint error handlers own retry policy; keep the HTTP transport
// to one attempt while still parsing Retry-After for the 429 handler.
const COMPANYENRICH_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

/** A query value the transport can serialise (arrays become repeated params). */
export type CompanyEnrichQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

export type CompanyEnrichRequestOptions = {
	method?: 'GET' | 'POST';
	/**
	 * Request bodies are the JSON objects described by each endpoint page and
	 * are already validated by that endpoint's zod input schema, so the shared
	 * transport accepts an object without restating every documented request
	 * body.
	 */
	body?: object;
	query?: Record<string, CompanyEnrichQueryValue>;
};

/**
 * Drops `undefined` values so an omitted optional parameter is never sent as
 * an empty query string entry.
 */
export function compactQuery(
	query: Record<string, CompanyEnrichQueryValue>,
): Record<string, CompanyEnrichQueryValue> {
	const defined: Record<string, CompanyEnrichQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return defined;
}

export async function makeCompanyEnrichRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CompanyEnrichRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Every v2 route is authenticated: the OpenAPI document declares a single
	// `Bearer` security scheme and applies it to every path, so an empty key
	// fails fast instead of sending an anonymous request.
	if (apiKey.length === 0) {
		throw new AuthMissingError('companyenrich', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: COMPANYENRICH_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: COMPANYENRICH_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new CompanyEnrichAPIError('Unknown error');
	}
}
