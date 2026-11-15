import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Geoapify splits its APIs across two versions on one host:
 *
 * - `https://api.geoapify.com/v1` — geocoding, routing, isolines, route
 *   matrix, postcodes, boundaries, elevation, IP geolocation and timezones.
 * - `https://api.geoapify.com/v2` — places, place details and place info.
 *
 * Every operation therefore carries its own version, which is appended to the
 * host here rather than baked into one base.
 *
 * An EU-only host exists at `api-eu.geoapify.com`, where processing stays in
 * the European Union; `region: 'eu'` selects it.
 */
export const GEOAPIFY_BASE = 'https://api.geoapify.com';
export const GEOAPIFY_EU_BASE = 'https://api-eu.geoapify.com';

/**
 * The key travels as the `apiKey` query parameter, or as `X-Api-Key` in a
 * header. The plugin uses the header (a live call with only the header answered
 * 200), so the key stays out of URLs that proxies and logs record.
 */
export type GeoapifyCredentials = {
	apiKey?: string;
};

/**
 * Every failure is one small envelope, the same across all the APIs:
 *
 * ```json
 * {"statusCode":401,"error":"Unauthorized","message":"Invalid apiKey"}
 * ```
 *
 * A live probe with a bad key answered exactly that with HTTP 401, so the
 * status and the body agree here; the body adds the human-readable `message`.
 */
// unknown: the body is an untyped envelope until asRecord narrows it.
export function readGatewayError(body: unknown): {
	statusCode?: number;
	error?: string;
	message?: string;
} {
	const record = asRecord(body);
	const statusCode = record?.statusCode;
	const error = record?.error;
	const message = record?.message;
	return {
		statusCode: typeof statusCode === 'number' ? statusCode : undefined,
		error: typeof error === 'string' ? error : undefined,
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
	};
}

export class GeoapifyAPIError extends Error {
	readonly status?: number;
	/** The gateway's short name, such as `Unauthorized` or `Too Many Requests`. */
	readonly reason?: string;
	/** Milliseconds from `Retry-After`, when Geoapify sent one. */
	readonly retryAfter?: number;
	readonly method?: string;
	readonly transport: boolean;
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			reason?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GeoapifyAPIError';
		this.status = options.status;
		this.reason = options.reason;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/**
	 * 429 covers both the rate limit and an exhausted quota. The spec documents
	 * `Quota exceeded` for the same status, so a retry may not help; the handler
	 * still honours Retry-After.
	 */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/**
	 * A 429 whose message names the quota: the daily or monthly credits are used
	 * up, and a retry before the reset only fails again.
	 */
	get isQuotaExceeded(): boolean {
		return this.status === 429 && /quota/i.test(this.message);
	}

	/** A missing or invalid key. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** A parameter the gateway refused, such as a limit above the maximum. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}

	/** The route or place does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

/**
 * The Geoapify fields of a thrown error. An HTTP failure reaches callers as
 * core's ApiError (R8); this reads its gateway envelope into the same shape a
 * transport failure has, so the handlers treat both alike.
 */
// unknown: a caught rejection has no static type.
export function geoapifyErrorInfo(
	error: unknown,
): GeoapifyAPIError | undefined {
	if (error instanceof GeoapifyAPIError) return error;
	if (!(error instanceof ApiError)) return undefined;
	return new GeoapifyAPIError(error.message, {
		status: error.status,
		reason: readGatewayError(error.body).error,
		retryAfter: error.retryAfter,
		method: error.request.method,
	});
}

/** The gateway message, with the status and its short name in front. */
// unknown: an error body is untyped: the gateway envelope, or text from a proxy
// that never reached Geoapify.
export function describeGeoapifyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const fields = readGatewayError(body);
	const text = fields.message ?? fallback;
	const label = [status, fields.error].filter(Boolean).join(' ');
	return label ? `Geoapify ${label}: ${text}` : text;
}

export type GeoapifyQueryValue = string | number | boolean;

export type GeoapifyRequest = {
	method: 'GET' | 'POST';
	/** `v1` or `v2`, which decides the base path. */
	version: 'v1' | 'v2';
	/** The path after the version, such as `/geocode/search`. */
	path: string;
	/**
	 * Repeated parameters travel as an array, which the query builder expands
	 * into one `key=value` per entry.
	 */
	query?: Record<string, GeoapifyQueryValue | GeoapifyQueryValue[] | undefined>;
	// unknown: the endpoint's input schema has already validated the body, and
	// each route has its own shape.
	body?: unknown;
};

/**
 * The rate limit is per plan and the spec documents 429 for both a burst and a
 * used-up quota. The client does not retry on its own, because a quota failure
 * would only spend another request; the handler decides.
 */
const GEOAPIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeGeoapifyRequest(
	credentials: GeoapifyCredentials,
	region: 'global' | 'eu',
	{ method, version, path, query, body }: GeoapifyRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: region === 'eu' ? GEOAPIFY_EU_BASE : GEOAPIFY_BASE,
		VERSION: version,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: 30_000,
		HEADERS: {
			Accept: 'application/json',
			...(credentials.apiKey ? { 'X-Api-Key': credentials.apiKey } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		// `{api-version}` is replaced from VERSION above, so one config serves both.
		url: `/{api-version}${path}`,
		query: method === 'GET' ? query : undefined,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GEOAPIFY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Core's ApiError goes through (R8), minus the addresses, coordinates
			// and IPs that were sent in the query or body. Only the gateway
			// envelope's fixed fields are kept from the response.
			const fields = readGatewayError(error.body);
			const safeBody = {
				statusCode: fields.statusCode,
				error: fields.error,
				message: fields.message,
			};
			const url = new URL(error.url);
			url.search = '';
			throw new ApiError(
				{ ...error.request, query: undefined, body: undefined },
				{
					url: url.toString(),
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: safeBody,
				},
				describeGeoapifyError(error.status, safeBody, `HTTP ${error.status}`),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GeoapifyAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError',
			});
		}
		throw new GeoapifyAPIError('Unknown Geoapify error', {
			method,
			transport: true,
		});
	}
}

/** Drops keys whose value is undefined, so a query carries only what was asked for. */
export function definedQuery(
	query: Record<string, GeoapifyQueryValue | GeoapifyQueryValue[] | undefined>,
): Record<string, GeoapifyQueryValue | GeoapifyQueryValue[]> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, GeoapifyQueryValue | GeoapifyQueryValue[]] =>
				entry[1] !== undefined,
		),
	);
}
