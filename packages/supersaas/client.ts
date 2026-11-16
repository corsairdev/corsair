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
 * are not wrapped: core's `ApiError` passes through (see `withoutRequestData`), so
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
 * Query values that carry a person's details: `user` is a login name (often an
 * email) on the agenda read and booking filters.
 */
const PERSONAL_QUERY = new Set(['user']);
const REDACTED = '[REDACTED]';

function maskUrl(value: string): string {
	// A user id in the path may be your own key, and nothing stops it being an
	// email address, so it is masked too.
	const masked = value.replace(
		/(\/users\/)[^/?#]+?(\.json)?(?=$|[?#])/,
		`$1${REDACTED}$2`,
	);
	return maskQuery(masked);
}

function maskQuery(value: string): string {
	const at = value.indexOf('?');
	if (at === -1) return value;
	const params = value
		.slice(at + 1)
		.split('&')
		.map((pair) => {
			const raw = pair.split('=')[0] ?? '';
			return PERSONAL_QUERY.has(raw) ? `${raw}=${REDACTED}` : pair;
		});
	return `${value.slice(0, at)}?${params.join('&')}`;
}

/**
 * Core's ApiError passes through unchanged unless the request carried personal
 * data: a sent body (users and bookings hold names, emails, addresses,
 * passwords), a `user` query value or a user id in the path. Only then is it
 * rebuilt, with the body dropped and those values masked in `request.query`
 * and both URLs; status, message, response body and rate-limit fields are
 * kept. This is the one rebuild the plugin rules allow: stripping echoed
 * request data.
 */
function withoutRequestData(error: ApiError): ApiError {
	const { body: sentBody, query, ...request } = error.request;
	const personalQuery = Object.keys(query ?? {}).some((key) =>
		PERSONAL_QUERY.has(key),
	);
	const userPath = /\/users\/[^/?#]+/.test(error.request.url);
	if (sentBody === undefined && !personalQuery && !userPath) return error;
	const maskedQuery = query
		? Object.fromEntries(
				Object.entries(query).map(([key, value]) => [
					key,
					PERSONAL_QUERY.has(key) ? REDACTED : value,
				]),
			)
		: undefined;
	return new ApiError(
		{
			...request,
			url: maskUrl(error.request.url),
			...(maskedQuery ? { query: maskedQuery } : {}),
		},
		{
			url: maskUrl(error.url),
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
		if (error instanceof ApiError) throw withoutRequestData(error);
		if (error instanceof Error || error instanceof DOMException) {
			throw new SupersaasAPIError(error.message, { cause: error, method });
		}
		throw new SupersaasAPIError('Unknown SuperSaaS error', { method });
	}
}
