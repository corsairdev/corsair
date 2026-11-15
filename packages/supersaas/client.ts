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
 * here comes from a gateway. Retries live in error-handlers.ts.
 */
const SUPERSAAS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * SuperSaaS authenticates with **HTTP Basic**, where the username is the account
 * name and the password is the API key. It can also take `account` and
 * `api_key` as query parameters, and a checksum instead of the key, but Basic is
 * the documented server-side form and it keeps both values out of the URL.
 *
 * Every failure is **plain text**, not JSON: a bad key answers the literal
 * `HTTP Basic: Access denied.` with a 401.
 */
export class SupersaasAPIError extends Error {
	readonly status?: number;
	/** The provider's plain-text reason, when it sent one. */
	readonly reason?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: the body is plain text, but a proxy can answer HTML or empty.
	readonly body?: UnknownJson;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: UnknownJson;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'SupersaasAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.reason =
			typeof this.body === 'string' && this.body.trim().length > 0
				? this.body.trim().slice(0, 300)
				: undefined;
	}

	/** True when the account name or API key was rejected. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** True when the user, booking, slot or schedule was not found. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

// unknown: see SupersaasAPIError.
export function describeSupersaasError(
	status: number | undefined,
	body: UnknownJson,
	fallback: string,
): string {
	// SuperSaaS writes a bare sentence, so the text is the whole message.
	const text =
		typeof body === 'string' && body.trim().length > 0
			? body.trim().slice(0, 300)
			: fallback;
	return status === undefined ? text : `SuperSaaS ${status}: ${text}`;
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
	{ method, path, query, body }: SupersaasRequest,
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
	};

	try {
		return await request<UnknownJson>(config, requestOptions, {
			rateLimitConfig: SUPERSAAS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause is deliberately not attached: it carries the request,
			// including the Basic credentials header, so `util.inspect(error)`
			// would print them.
			throw new SupersaasAPIError(
				describeSupersaasError(error.status, error.body, error.message),
				{
					status: error.status,
					body: error.body,
					retryAfter: error.retryAfter,
					method: error.request.method,
				},
			);
		}
		// A transport failure never held a body or headers, so its cause is safe to
		// keep. DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new SupersaasAPIError(error.message, { cause: error, method });
		}
		throw new SupersaasAPIError('Unknown SuperSaaS error', { method });
	}
}
