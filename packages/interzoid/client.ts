import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class InterzoidAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'InterzoidAPIError';
	}
}

export const INTERZOID_API_BASE = 'https://api.interzoid.com';

export const INTERZOID_TIMEOUT_MS = 90_000;

export async function makeInterzoidRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST';
		// `unknown` because request body can be any JSON-serializable record.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Fail fast on missing credentials before sending keyless requests.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('interzoid', 'api_key');
	}
	if (!apiKey) {
		throw new AuthMissingError('interzoid', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: INTERZOID_API_BASE,
		// Premium lookups (web-search AI models, 10 to 25 credits) can take longer
		// than core's 20 s default, and an aborted call may still be billed.
		TIMEOUT: INTERZOID_TIMEOUT_MS,
		VERSION: '1.0.0',
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
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutLookupValues(error, method, endpoint);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new InterzoidAPIError('Unknown error');
	}
}

/**
 * Every lookup travels in the query string (an email, a phone number, a
 * person's name), and core's `ApiError` keeps it in `url` and `request.query`.
 * The error is rebuilt with the path only, keeping status, message, body and
 * the rate-limit fields core and the handlers read.
 */
function withoutLookupValues(
	error: ApiError,
	method: 'GET' | 'POST',
	endpoint: string,
): ApiError {
	return new ApiError(
		{ method, url: endpoint },
		{
			url: `${INTERZOID_API_BASE}${endpoint}`,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
