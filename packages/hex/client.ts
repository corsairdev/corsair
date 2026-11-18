import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HexAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HexAPIError';
	}
}

/**
 * Base URL for the Hex REST API.
 * From OpenAPI servers entry: https://app.hex.tech/api
 * Endpoints are rooted under /v1/... (or /v2/... for suggestions v2).
 */
export const HEX_API_BASE = 'https://app.hex.tech/api';

/**
 * Corsair's endpoint error handlers own retry policy; keep the HTTP transport
 * to zero retries while extracting Retry-After for the RATE_LIMIT_ERROR handler.
 */
export const HEX_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

/** A query value the transport can serialise (arrays, primitives, null, or undefined). */
export type HexQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number | boolean)[]
	| null
	| undefined;

export type HexRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// unknown because request body payloads are validated at runtime by endpoint Zod schemas.
	body?: Record<string, unknown>;
	query?: Record<string, HexQueryValue>;
	headers?: Record<string, string | undefined>;
};

/**
 * Drops undefined and null query parameters so omitted/null fields are not sent in query strings.
 */
export function compactQuery(
	query?: Record<string, HexQueryValue>,
): Record<string, HexQueryValue> | undefined {
	if (!query) return undefined;
	const defined: Record<string, HexQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null) {
			defined[key] = value;
		}
	}
	return Object.keys(defined).length > 0 ? defined : undefined;
}

export async function makeHexRequest<T>(
	endpoint: string,
	apiKey: string,
	options: HexRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers: extraHeaders } = options;

	// Hex requires authentication on every REST endpoint. Fail fast with
	// AuthMissingError if key is empty so Corsair can initiate connect flow.
	if (!apiKey || apiKey.trim().length === 0) {
		throw new AuthMissingError('hex', 'api_key');
	}

	const definedHeaders: Record<string, string> = {};
	if (extraHeaders) {
		for (const [k, v] of Object.entries(extraHeaders)) {
			if (v !== undefined) {
				definedHeaders[k] = v;
			}
		}
	}

	const config: OpenAPIConfig = {
		BASE: HEX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...definedHeaders,
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
		query: compactQuery(query),
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: HEX_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		// Re-throw core's ApiError as is: its status and retryAfter are what the
		// error handlers match and what core reads. Wrapping it loses both.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) throw error;
		throw new HexAPIError('Unknown error');
	}
}
