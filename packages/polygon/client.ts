import { createHash } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * OMS runs two hosts that differ only in the environment. The sandbox issues
 * `sk_sdbx_` keys and simulates every transfer, so a caller points at it with
 * `environment: 'sandbox'` and the same plugin code works against both.
 */
export const POLYGON_HOSTS = {
	sandbox: 'https://sandbox-api.polygon.technology/v0.13',
	live: 'https://api.polygon.technology/v0.13',
} as const;

export type PolygonEnvironment = keyof typeof POLYGON_HOSTS;

/** OMS documents 60 minutes; the response's own `expiresIn` wins when present. */
const DEFAULT_TOKEN_LIFETIME_MS = 60 * 60 * 1000;
/** Refresh this long before expiry, so a call does not race it. */
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

/**
 * OMS documents `Retry-After` in seconds on a 429 and asks the caller to wait
 * that interval. Handlers own the retries, so this config only reads it.
 */
const POLYGON_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. One alias keeps the reason
 * in one place rather than repeating it at every signature. */
type Untyped = unknown; // unknown: see the note above.

/**
 * OMS errors are `{ error, code, msg, cause?, status }`, where `error` and `code`
 * are stable identifiers and `msg` is the human sentence. Reads here narrow the
 * body once so the handlers can match on `code` rather than on prose.
 */
export class PolygonAPIError extends Error {
	readonly status?: number;
	/** Stable OMS error name, e.g. `InvalidCredentials`. */
	readonly code?: string;
	/** Stable numeric OMS code, e.g. `1003`. */
	readonly errorNumber?: number;
	/** Milliseconds from a Retry-After header, when OMS sent one. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached OMS (DNS, reset, abort). */
	readonly transport: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			errorNumber?: number;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PolygonAPIError';
		this.status = options.status;
		this.code = options.code;
		this.errorNumber = options.errorNumber;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
	}
}

// Error bodies are untrusted JSON until narrowed one field at a time, so the
// guard takes an untyped value and returns a record whose members stay untyped.
function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(
	record: Record<string, Untyped> | undefined,
	key: string,
): number | undefined {
	const value = record?.[key];
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

/** The OMS error name, such as `InvalidCredentials`. */
export function readErrorCode(body: Untyped): string | undefined {
	return readString(asRecord(body), 'error');
}

/** The stable numeric OMS error code, such as `1003`. */
export function readErrorNumber(body: Untyped): number | undefined {
	return readNumber(asRecord(body), 'code');
}

/**
 * Builds the message from OMS's `msg`, which is documented as stable across
 * releases, and falls back to the HTTP status text when the body is not OMS's.
 */
export function describePolygonError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const error = readErrorCode(body);
	const message = readString(asRecord(body), 'msg') ?? fallback;
	const label = [status, error].filter((part) => part !== undefined).join(' ');
	return label ? `Polygon ${label}: ${message}` : message;
}

export type PolygonCredentials = {
	apiKey: string;
	apiSecret: string;
};

/** One cached bearer token per credential pair and host, within the process. */
type CachedToken = { accessToken: string; expiresAt: number };
const tokenCache = new Map<string, CachedToken>();
/** In-flight token requests, so parallel calls mint one token, not one each. */
const inFlightTokens = new Map<string, Promise<string>>();

/** Identifies a cached token by host and the complete credential pair. The secret
 * is part of the identity but not part of the key that is stored: it goes
 * through SHA-256 so the cache holds no credential in readable form. Keeping it
 * out of the key was a real bug: a second caller presenting the same key with a
 * different secret used to receive the first caller's token.
 *
 * Exported so a test can assert that neither credential appears in the key.
 */
export function tokenCacheKey(
	environment: PolygonEnvironment,
	credentials: PolygonCredentials,
): string {
	const fingerprint = createHash('sha256')
		.update(credentials.apiKey)
		.update('\0')
		.update(credentials.apiSecret)
		.digest('hex');
	return `${environment}:${fingerprint}`;
}

/** Clears the cached token, which a test uses to pin the refresh path. */
export function resetPolygonTokenCache(): void {
	tokenCache.clear();
	inFlightTokens.clear();
}

/**
 * Drops one cached token. A 401 means OMS rejected it, so keeping it would only
 * fail every later call with the same dead token.
 */
export function invalidatePolygonToken(
	environment: PolygonEnvironment,
	credentials: PolygonCredentials,
): void {
	tokenCache.delete(tokenCacheKey(environment, credentials));
}

// unknown: the token response is untrusted until the fields below are read.
function readTokenResponse(body: Untyped): {
	accessToken: string;
	expiresInSeconds: number | undefined;
} {
	const record = asRecord(body);
	const accessToken = readString(record, 'accessToken');
	if (!accessToken) {
		throw new PolygonAPIError('Polygon did not return an access token');
	}
	return {
		accessToken,
		// OMS documents `expiresIn` in seconds; the cache uses it when present.
		expiresInSeconds: readNumber(record, 'expiresIn'),
	};
}

/**
 * Exchanges the key and secret for a bearer token. OMS mints one for 60 minutes
 * and asks callers to present it on every other endpoint, so this is the only
 * call that carries the secret; it is cached and refreshed before it expires.
 */
export async function mintPolygonToken(
	environment: PolygonEnvironment,
	credentials: PolygonCredentials,
): Promise<{ accessToken: string; expiresInSeconds: number | undefined }> {
	const config: OpenAPIConfig = {
		BASE: POLYGON_HOSTS[environment],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'Content-Type': 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/auth/token',
		body: { apiKey: credentials.apiKey, apiSecret: credentials.apiSecret },
		mediaType: 'application/json',
	};

	try {
		// readTokenResponse narrows the token body field by field.
		const body = await request<Untyped>(config, requestOptions, {
			rateLimitConfig: POLYGON_RATE_LIMIT_CONFIG,
		});
		return readTokenResponse(body);
	} catch (error) {
		// Core's ApiError goes through (R8) so status, retryAfter and
		// isRateLimitError() keep working. This is the one call that carries the
		// secret, and ApiError retains the request it was built from, so the
		// request body is dropped when the error is rebuilt. Only the body held
		// the credential: the headers stay, and none of them is the secret.
		if (error instanceof ApiError) {
			throw new ApiError(
				{ ...requestOptions, body: undefined, query: undefined },
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
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PolygonAPIError(error.message, {
				cause: error,
				method: 'POST',
				transport: true,
			});
		}
		throw new PolygonAPIError('Unknown Polygon token error', {
			method: 'POST',
			transport: true,
		});
	}
}

/** Returns a token, minting at most one per credential pair even under load. */
export async function resolvePolygonToken(
	environment: PolygonEnvironment,
	credentials: PolygonCredentials,
): Promise<string> {
	if (!credentials.apiKey.trim() || !credentials.apiSecret.trim()) {
		throw new AuthMissingError('polygon', 'api_key');
	}

	const key = tokenCacheKey(environment, credentials);
	const cached = tokenCache.get(key);
	if (cached && cached.expiresAt - TOKEN_REFRESH_MARGIN_MS > Date.now()) {
		return cached.accessToken;
	}

	const pending = inFlightTokens.get(key);
	if (pending) return pending;

	const attempt = (async () => {
		const { accessToken, expiresInSeconds } = await mintPolygonToken(
			environment,
			credentials,
		);
		tokenCache.set(key, {
			accessToken,
			expiresAt:
				Date.now() +
				(expiresInSeconds !== undefined && expiresInSeconds > 0
					? expiresInSeconds * 1000
					: DEFAULT_TOKEN_LIFETIME_MS),
		});
		return accessToken;
	})();

	inFlightTokens.set(key, attempt);
	try {
		return await attempt;
	} finally {
		inFlightTokens.delete(key);
	}
}

export type PolygonQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type PolygonRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	path: string;
	query?: PolygonQuery;
	body?: Untyped;
	/** Sent as `Idempotency-Key`, which every non-auth POST requires. */
	idempotencyKey?: string;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Exchanges a caller-supplied idempotency key for the header value OMS expects.
 * OMS requires the header on all non-auth POSTs and rejects a missing one, so
 * the endpoints generate one when the caller does not.
 */
export function idempotencyHeader(key: string): Record<string, string> {
	return { 'Idempotency-Key': key };
}

/** The query string form OMS documents for repeated values: `status=a&status=b`. */
export function queryArray(
	values: readonly string[] | undefined,
): string[] | undefined {
	return values === undefined || values.length === 0 ? undefined : [...values];
}

// The body is returned untyped because the caller's output schema is the only
// thing that knows its shape.
export async function makePolygonRequest(
	environment: PolygonEnvironment,
	accessToken: string,
	{ method, path, query, body, idempotencyKey }: PolygonRequest,
): Promise<Untyped> {
	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Bearer ${accessToken}`,
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (idempotencyKey !== undefined) {
		Object.assign(headers, idempotencyHeader(idempotencyKey));
	}

	const config: OpenAPIConfig = {
		BASE: POLYGON_HOSTS[environment],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: POLYGON_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// A real HTTP failure keeps core's ApiError (see mintPolygonToken).
		if (error instanceof ApiError) throw error;
		if (error instanceof Error || error instanceof DOMException) {
			throw new PolygonAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PolygonAPIError('Unknown Polygon API error', {
			method,
			transport: true,
		});
	}
}
