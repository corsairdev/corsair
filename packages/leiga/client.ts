import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LEIGA_API_BASE = 'https://app.leiga.com/openapi/api';

/**
 * Leiga answers **every** error with HTTP 200 and a body like
 * `{ "code": "15", "msg": "accessToken error" }`. The status is therefore
 * useless for error handling: `corsair/http` never throws, so the envelope has
 * to be checked here or a failed call parses as a successful empty result.
 *
 * `code` is a *string*, not a number, and `"0"` is the only success value.
 * Codes seen live:
 *
 * - `0` success
 * - `15` `accessToken error` (missing, expired or not a real token)
 * - `18` `client_id error` (the access-token exchange rejected the client id)
 * - `100` a required body field was missing, e.g. `secretKey should not be null`
 */
export const LEIGA_SUCCESS_CODE = '0';

/** Seconds in 30 days, Leiga's default token lifetime. */
const DEFAULT_TOKEN_TTL_SECONDS = 2_592_000;

/**
 * Pulls the string `code` out of an envelope.
 * unknown: the body is untyped until both guards here narrow it.
 */
function envelopeCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const code = record?.code;
	if (typeof code === 'string') return code;
	// A number would be a provider change; compare it as text rather than
	// failing every call, since `0` is still success either way.
	if (typeof code === 'number') return String(code);
	return undefined;
}

/**
 * Pulls the message out of an envelope.
 * unknown: the body is untyped until the guard here narrows it.
 */
function envelopeMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const msg = record?.msg ?? record?.message;
	return typeof msg === 'string' && msg.length > 0 ? msg : undefined;
}

/**
 * Leiga error bodies are `{ code, msg }` on an HTTP 200. `status` is kept so a
 * gateway that does answer a real 5xx still reaches the retry handlers.
 */
export class LeigaAPIError extends Error {
	readonly code?: string;
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Leiga sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, used to decide replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			code?: string;
			status?: number;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LeigaAPIError';
		this.code = options.code;
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	/** `15` is an expired or unknown token, `18` a rejected client id. */
	get isAuthError(): boolean {
		return this.code === '15' || this.code === '18' || this.status === 401;
	}
}

/**
 * Reads the success envelope `{ code: "0", data }` and returns `data`.
 * Throws on any other code, which is the only way a Leiga failure is visible.
 */
export function unwrapEnvelope(body: unknown, label: string): unknown {
	const record = asRecord(body);
	if (!record) {
		throw new LeigaAPIError(`Leiga returned a non-object body for ${label}`);
	}
	const code = envelopeCode(record);
	if (code === undefined) {
		throw new LeigaAPIError(
			`Leiga returned no code for ${label}: ${JSON.stringify(record).slice(0, 200)}`,
		);
	}
	if (code !== LEIGA_SUCCESS_CODE) {
		throw new LeigaAPIError(
			`Leiga ${label} failed with code ${code}: ${envelopeMessage(record) ?? 'no message'}`,
			{ code },
		);
	}
	return record.data;
}

export type LeigaRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	/** unknown: the endpoint's input schema has already validated the body. */
	body?: unknown;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// `corsair/http` replaces the default rate-limit config wholesale, so every
// field is spelled out. Leiga documents no limit and no Retry-After header,
// but leaving `headerNames` out throws on the first 429 and dropping it would
// discard the header if one ever appears.
const LEIGA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function configWith(token: string): OpenAPIConfig {
	return {
		BASE: LEIGA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			// Leiga names the header `accessToken`, not `Authorization`.
			accessToken: token,
		},
	};
}

async function send(
	token: string,
	{ method, path, query, body }: LeigaRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(configWith(token), requestOptions, {
			rateLimitConfig: LEIGA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof LeigaAPIError) throw error;
		if (error instanceof ApiError) {
			throw new LeigaAPIError(
				`Leiga ${method} ${path} answered ${error.status}: ${envelopeMessage(error.body) ?? error.message}`,
				{
					cause: error,
					status: error.status,
					retryAfter: error.retryAfter,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LeigaAPIError(error.message, { cause: error, method });
		}
		throw new LeigaAPIError('Unknown Leiga error', { method });
	}
}

export type LeigaTokenResponse = {
	accessToken: string;
	/** Epoch milliseconds at which the token stops working. */
	expiresAt: number;
};

/**
 * Exchanges a client id and secret for an access token. Leiga also answers
 * this on HTTP 200 for bad credentials (`{"code":"18","msg":"client_id
 * error"}`), so the envelope is the only failure signal.
 */
export async function requestLeigaToken(
	clientId: string,
	secretKey: string,
	now: number = Date.now(),
): Promise<LeigaTokenResponse> {
	const body = await send('', {
		method: 'POST',
		path: '/authorize/access-token',
		body: { clientId, secretKey },
	});
	const data = asRecord(unwrapEnvelope(body, 'token exchange'));
	const accessToken = data?.accessToken;
	if (typeof accessToken !== 'string' || accessToken.length === 0) {
		throw new LeigaAPIError('Leiga token exchange returned no accessToken');
	}
	const expireIn =
		typeof data?.expireIn === 'number' ? data.expireIn : undefined;
	const ttlSeconds =
		expireIn !== undefined && expireIn > 0
			? expireIn
			: DEFAULT_TOKEN_TTL_SECONDS;
	return { accessToken, expiresAt: now + ttlSeconds * 1000 };
}

type CacheEntry = { token: LeigaTokenResponse; key: string };

/** Tokens are per client pair, so one module-level cache keyed by credentials. */
let tokenCache: CacheEntry | undefined;

/** Refreshes a minute early, so a token cannot expire mid-flight. */
const EXPIRY_SKEW_MS = 60_000;

/**
 * Resolves a usable token for the credentials, reusing a cached one until it is
 * close to expiry. Returns the token **and** its expiry, because the caller
 * persists both: storing the token alone leaves the next process unable to tell
 * a live token from an expired one.
 */
export async function resolveLeigaToken(
	clientId: string,
	secretKey: string,
	now: number = Date.now(),
): Promise<LeigaTokenResponse> {
	const key = `${clientId}\u0000${secretKey}`;
	if (
		tokenCache?.key === key &&
		tokenCache.token.expiresAt - EXPIRY_SKEW_MS > now
	) {
		return tokenCache.token;
	}
	const token = await requestLeigaToken(clientId, secretKey, now);
	tokenCache = { token, key };
	return token;
}

/** Clears the cached token. Tests use it; a caller needs it only after an auth error. */
export function clearLeigaTokenCache(): void {
	tokenCache = undefined;
}

/**
 * Sends one operation with a token and returns the envelope's `data`. Kept
 * separate from token resolution so endpoint tests can drive the wire shape
 * without a token exchange.
 */
export async function makeLeigaRequest(
	token: string,
	requestOptions: LeigaRequest,
	label: string,
): Promise<unknown> {
	return unwrapEnvelope(await send(token, requestOptions), label);
}
