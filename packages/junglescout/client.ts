import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const JUNGLESCOUT_API_BASE = 'https://developer.junglescout.com';

/**
 * Jungle Scout rate limits allow up to 300 requests per minute with a burst limit
 * of 15 requests per second. The client delegates retry backoff to error handlers
 * while extracting Retry-After headers from 429 responses.
 */
export const JUNGLESCOUT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export class JungleScoutAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'JungleScoutAPIError';
	}
}

export type JungleScoutRequestOptions = {
	method?: 'GET' | 'POST';
	// `unknown` because request bodies vary per endpoint schema and are narrowed before sending.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	apiType?: 'junglescout' | 'cobalt';
};

export function parseJungleScoutResponse(response: unknown): unknown {
	if (typeof response !== 'string') return response;

	// `unknown` because the shared transport returns vendor JSON MIME bodies as text; endpoint Zod schemas validate it.
	const parsedBody: unknown = JSON.parse(response);
	return parsedBody;
}

/**
 * Keeps the generic parts of a JSON:API error (`status`, `code`, `title`) so a
 * caller can tell a bad filter from a bad key. `detail` and `source` are dropped
 * because they can echo the searched keyword or ASIN.
 */
// `unknown`: the provider's error body is untrusted JSON of any shape.
export function errorSummary(body: unknown): {
	errors?: Array<{ status?: string; code?: string; title?: string }>;
} {
	if (typeof body !== 'object' || body === null || !('errors' in body)) {
		return {};
	}
	const { errors } = body;
	if (!Array.isArray(errors)) return {};
	return {
		errors: errors.map((entry: unknown) => {
			// `unknown`: each entry is checked field by field below.
			const item =
				typeof entry === 'object' && entry !== null
					? (entry as Record<string, unknown>)
					: {};
			const pick = (key: string) =>
				typeof item[key] === 'string' || typeof item[key] === 'number'
					? String(item[key])
					: undefined;
			return {
				status: pick('status'),
				code: pick('code'),
				title: pick('title'),
			};
		}),
	};
}

export async function makeJungleScoutRequest(
	endpoint: string,
	apiKey?: string,
	options: JungleScoutRequestOptions = {},
): Promise<unknown> {
	const { method = 'GET', body, query, apiType = 'junglescout' } = options;

	// The official API requires its combined `KEY_NAME:API_KEY` authorization value.
	if (apiKey === undefined || apiKey.trim().length === 0) {
		throw new AuthMissingError('junglescout', 'api_key');
	}

	const authHeaders: Record<string, string> = { Authorization: apiKey };

	const config: OpenAPIConfig = {
		BASE: JUNGLESCOUT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/vnd.junglescout.v1+json',
			'Content-Type': 'application/vnd.api+json',
			'X-API-Type': apiType,
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/vnd.api+json',
		query,
	};

	try {
		const response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: JUNGLESCOUT_RATE_LIMIT_CONFIG,
		});
		return parseJungleScoutResponse(response);
	} catch (error: unknown) {
		// Provider/network errors can contain request data; retain only safe HTTP metadata.
		// Drop inputs and provider payloads because errors can echo searched terms or ASINs.
		if (error instanceof ApiError) {
			throw new ApiError(
				{ method, url: endpoint },
				{
					url: `${JUNGLESCOUT_API_BASE}${endpoint}`,
					ok: false,
					status: error.status,
					statusText: 'Request failed',
					body: errorSummary(error.body),
				},
				`Jungle Scout API request failed with status ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// `error` may contain an input-bearing request URL or provider response text.
		throw new JungleScoutAPIError('Jungle Scout request failed');
	}
}
