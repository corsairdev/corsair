import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { UnknownJson } from './json';

export const SUPERSAAS_API_BASE = 'https://www.supersaas.com/api';

/**
 * SuperSaaS documents no rate limit and sends no rate-limit headers, so a 429
 * here comes from a gateway. Core retries it three times, honouring
 * Retry-After (R8); the plugin's handler does not add more.
 */
const SUPERSAAS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A request that never reached SuperSaaS (DNS, reset, timeout). HTTP failures
 * are not wrapped: core's `ApiError` passes through (see `withoutSentBody`), so
 * its `status`, `retryAfter`, `request` and `body` reach core and the caller.
 *
 * SuperSaaS authenticates with **HTTP Basic**, where the username is the account
 * name and the password is the API key; both live in the request config, which
 * core never copies onto an error.
 */
export class SupersaasAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SupersaasAPIError';
		this.method = options.method;
	}
}

/**
 * Core's ApiError keeps the request it was built from, body included, and a
 * SuperSaaS body is a user or booking: names, emails, addresses, passwords.
 * This rebuilds the same ApiError without the sent body; status, method, URL,
 * response body and rate-limit fields are kept.
 */
function withoutSentBody(error: ApiError): ApiError {
	if (error.request.body === undefined) return error;
	const { body: _sentBody, ...request } = error.request;
	return new ApiError(
		request,
		{
			url: error.url,
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

export type SupersaasQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SupersaasRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: SupersaasQuery;
	/**
	 * A JSON body, serialized with the JSON media type. SuperSaaS wraps every
	 * document in an object named after the thing, `user`, `booking` or `slot`,
	 * so the endpoints build that wrapper rather than sending a bare object.
	 */
	body?: UnknownJson; // unknown: the endpoint's input schema validated it
	/**
	 * A create answers 201 with an empty body and the new record's URL in
	 * `Location`; naming the header makes that URL the result.
	 */
	responseHeader?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Every route carries `.json`, which selects the response format. Without it
 * SuperSaaS answers XML, so the suffix is applied here and no endpoint has to
 * remember it.
 */
export function jsonPath(path: string): string {
	return path.endsWith('.json') ? path : `${path}.json`;
}

// unknown: callers parse the body with the endpoint's zod output schema, and the
// shape differs per route, which is what that schema is for.
export async function makeSupersaasRequest(
	credentials: { accountName: string; apiKey: string },
	{ method, path, query, body, responseHeader }: SupersaasRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SUPERSAAS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// HTTP Basic needs both non-empty: the account name is the username and
		// the API key the password. A key-as-username form would need a literal
		// header instead.
		USERNAME: credentials.accountName,
		PASSWORD: credentials.apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: jsonPath(path),
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
		responseHeader,
	};

	try {
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SUPERSAAS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutSentBody(error);
		if (error instanceof Error || error instanceof DOMException) {
			throw new SupersaasAPIError(error.message, { cause: error, method });
		}
		throw new SupersaasAPIError('Unknown SuperSaaS error', { method });
	}
}
