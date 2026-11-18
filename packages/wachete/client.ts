import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const WACHETE_API_BASE = 'https://api.wachete.com';

/**
 * Wachete hands out a bearer token rather than accepting the userId/apiKey pair
 * on every call. `token` is a *source* on the config: corsair/http resolves it
 * once per request from this plugin's key.
 */
export type WacheteToken = {
	token: string;
	/** Seconds the token stays valid, as the login answered it. */
	expiresInSec?: number;
};

const WACHETE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Wachete answers a failure as `{ message, code }`, where `code` is a short
 * name such as `Unauthorized`. A missing header and a bad token both answer
 * 401 with the same code, so the message is what distinguishes them — and both
 * mean the credential needs fixing.
 */
export class WacheteAPIError extends Error {
	readonly status?: number;
	/** The short code, e.g. `Unauthorized`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Wachete sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
	// with HTML or text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'WacheteAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		this.code = readString(asRecord(this.body), 'code');
	}

	/** True for a missing or invalid token, or a rejected userId/apiKey pair. */
	get isAuthError(): boolean {
		if (this.status === 401) return true;
		return this.code === 'Unauthorized' || this.code === 'Forbidden';
	}

	/**
	 * True when the token expired. Wachete does not send an expiry code, so the
	 * message is the only signal; the plugin asks the caller to re-run the login
	 * rather than retrying with the same token.
	 */
	get isTokenExpired(): boolean {
		return (
			readString(asRecord(this.body), 'message') === 'Invalid token' &&
			this.status === 401
		);
	}
}

// unknown: see WacheteAPIError.
export function describeWacheteError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'message') ?? fallback;
	const code = readString(record, 'code');
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Wachete ${label}: ${text}` : text;
}

export type WacheteQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type WacheteRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: WacheteQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/** Encodes one path segment; ids come from the caller. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeWacheteRequest(
	token: string,
	{ method, path, query, body }: WacheteRequest,
): Promise<unknown> {
	// A packed `userId\napiKey` key is exchanged for a bearer token first; a
	// bare token passes through unchanged.
	const bearer = parseWacheteKey(token)
		? await resolveWacheteToken(token)
		: token;
	const config: OpenAPIConfig = {
		BASE: WACHETE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `bearer ${bearer}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WACHETE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// A rejected token is dropped so the next call logs in again rather than
			// resending it until the recorded expiry, which Wachete may ignore when it
			// revokes early.
			if (error.status === 401 && parseWacheteKey(token)) {
				evictWacheteToken(token);
			}
			throw new WacheteAPIError(
				describeWacheteError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WacheteAPIError(error.message, { cause: error, method });
		}
		throw new WacheteAPIError('Unknown Wachete error', { method });
	}
}

/**
 * Logs in with the userId/apiKey pair from the Wachete profile and returns the
 * bearer token every other call needs.
 *
 * The key slot holds the pair because one Corsair key must carry both: the
 * plugin packs them as `<userId>\n<apiKey>`.
 */
export async function login(
	userId: string,
	apiKey: string,
): Promise<WacheteToken> {
	const config: OpenAPIConfig = {
		BASE: WACHETE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	try {
		const raw = await request<unknown>(
			config,
			{
				method: 'POST',
				url: '/thirdparty/v1/user/apilogin',
				body: { userId, apiKey },
				mediaType: 'application/json',
			},
			{ rateLimitConfig: WACHETE_RATE_LIMIT_CONFIG },
		);
		const record = asRecord(raw);
		const token = readString(record, 'token');
		if (!token) {
			throw new WacheteAPIError(
				'Wachete accepted the login but returned no token',
			);
		}
		const expires = record?.expiresInSec;
		return {
			token,
			expiresInSec: typeof expires === 'number' ? expires : undefined,
		};
	} catch (error) {
		if (error instanceof WacheteAPIError) throw error;
		if (error instanceof ApiError) {
			throw new WacheteAPIError(
				describeWacheteError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new WacheteAPIError(error.message, { cause: error });
		}
		throw new WacheteAPIError('Unknown Wachete login error');
	}
}

/** Narrows a caught value to this plugin's error. */
export function isWacheteFailure(error: unknown): error is WacheteAPIError {
	return error instanceof WacheteAPIError;
}

/** Split the packed key into its pair, or undefined if it is a bare token. */
export function parseWacheteKey(
	key: string,
): { userId: string; apiKey: string } | undefined {
	const [userId, apiKey, ...rest] = key.split('\n');
	if (rest.length > 0) return undefined;
	if (!userId?.trim() || !apiKey?.trim()) return undefined;
	return { userId: userId.trim(), apiKey: apiKey.trim() };
}

/**
 * Tokens are cached per packed key so one login serves every later call.
 *
 * Wachete's token is long-lived (`expiresInSec` is returned at login), but the
 * cache also records when it was issued, so a token older than its lifetime is
 * refreshed rather than sent and rejected.
 */
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

/**
 * Logins in flight, keyed by packed key. Two requests that miss the same entry
 * would otherwise both call `login()`, so the second waits on the first.
 */
const inFlightLogins = new Map<string, Promise<string>>();

/** Removes cache entries that are past their lifetime, and caps the cache size. */
const MAX_CACHED_TOKENS = 500;

function pruneTokenCache(nowMs: number): void {
	for (const [key, entry] of tokenCache) {
		if (entry.expiresAt <= nowMs) tokenCache.delete(key);
	}
	// A long-running server with many rotated keys would otherwise keep every entry
	// for the life of the process; the oldest go first.
	while (tokenCache.size > MAX_CACHED_TOKENS) {
		const oldest = tokenCache.keys().next().value;
		if (oldest === undefined) break;
		tokenCache.delete(oldest);
	}
}

/**
 * Forgets a cached token. Called when Wachete rejects one before its stated
 * expiry, so the next request logs in again instead of resending it until the
 * clock runs out.
 */
export function evictWacheteToken(key: string): void {
	tokenCache.delete(key);
}

/**
 * The token for a key slot. A key holding `userId\napiKey` logs in once and
 * reuses the token; anything else is taken as a token already.
 *
 * `now` is injectable so the expiry can be tested without waiting an hour, and
 * it is used for both the write and the read so the cache stays consistent.
 */
export async function resolveWacheteToken(
	key: string,
	now: () => number = Date.now,
): Promise<string> {
	const pair = parseWacheteKey(key);
	if (!pair) return key;

	const cached = tokenCache.get(key);
	if (cached && cached.expiresAt > now()) return cached.token;

	const pending = inFlightLogins.get(key);
	if (pending) return pending;

	const loginOnce = (async () => {
		try {
			const result = await login(pair.userId, pair.apiKey);
			// A token with no stated lifetime is cached for an hour, which is the
			// shortest lifetime Wachete documents.
			const lifetimeMs = (result.expiresInSec ?? 3600) * 1000;
			pruneTokenCache(now());
			tokenCache.set(key, {
				token: result.token,
				expiresAt: now() + lifetimeMs,
			});
			return result.token;
		} finally {
			inFlightLogins.delete(key);
		}
	})();

	inFlightLogins.set(key, loginOnce);
	return loginOnce;
}

/** Clears the cache, so a test starts from a clean login. */
export function clearWacheteTokenCache(): void {
	tokenCache.clear();
}
