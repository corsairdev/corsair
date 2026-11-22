import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Tailscale's REST API. Every route takes `Authorization: Bearer <token>`.
 * Reference: https://tailscale.com/api and
 * https://api.tailscale.com/api/v2?outputOpenapiSchema=true.
 */
export const TAILSCALE_API_BASE = 'https://api.tailscale.com/api/v2';

/** Where an OAuth client's ID and secret are exchanged for an access token. */
export const TAILSCALE_TOKEN_URL = `${TAILSCALE_API_BASE}/oauth/token`;

export const TAILSCALE_DEFAULT_TIMEOUT_MS = 30_000;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads the stored API key. `ctx.keys.get_api_key()` throws, rather than
 * returning null, when the account has no DEK at all: a valid state for an
 * account that passes the key in plugin options. Anything else thrown is a
 * real failure and propagates.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

// ── Credentials ─────────────────────────────────────────────────────────────

const OAUTH_CLIENT_SECRET = /^tskey-client-([A-Za-z0-9]+)-[A-Za-z0-9]+$/;

/**
 * The key is either an API access token (`tskey-api-…`, sent as is) or an
 * OAuth client secret (`tskey-client-<client id>-…`). Tailscale writes the
 * client ID into the secret, so the secret alone is enough to get a token.
 */
export function oauthClientIdFrom(key: string): string | undefined {
	return OAUTH_CLIENT_SECRET.exec(key)?.[1];
}

type CachedToken = { token: string; expiresAt: number };

/** Access tokens from OAuth client secrets, by a hash of the secret. */
const tokenCache = new Map<string, CachedToken>();

/** At most this many tenants' tokens are kept; the oldest goes first. */
export const TOKEN_CACHE_LIMIT = 500;

/** Stores a token, dropping expired ones and the oldest past the limit. */
function remember(cacheKey: string, value: CachedToken): void {
	const now = Date.now();
	for (const [key, entry] of tokenCache) {
		if (entry.expiresAt <= now) tokenCache.delete(key);
	}
	// Re-inserting moves the key to the end, so insertion order is age order.
	tokenCache.delete(cacheKey);
	tokenCache.set(cacheKey, value);
	while (tokenCache.size > TOKEN_CACHE_LIMIT) {
		const oldest = tokenCache.keys().next().value;
		if (oldest === undefined) break;
		tokenCache.delete(oldest);
	}
}

/** For tests: how many tokens are cached. */
export function tailscaleTokenCacheSize(): number {
	return tokenCache.size;
}
const pendingTokens = new Map<string, Promise<CachedToken>>();

/** Fetch a new token this long before the cached one runs out. */
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000;

async function cacheKeyFor(secret: string): Promise<string> {
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(secret),
	);
	return Array.from(new Uint8Array(digest), (byte) =>
		byte.toString(16).padStart(2, '0'),
	).join('');
}

async function exchangeClientSecret(
	clientId: string,
	clientSecret: string,
): Promise<CachedToken> {
	const response = await fetch(TAILSCALE_TOKEN_URL, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'client_credentials',
		}).toString(),
		signal: AbortSignal.timeout(TAILSCALE_DEFAULT_TIMEOUT_MS),
	});
	const text = await response.text().catch(() => '');
	// `unknown` because the token response is untrusted JSON until checked below.
	let body: unknown;
	try {
		body = JSON.parse(text);
	} catch {
		body = undefined;
	}
	if (!response.ok) {
		// Never the secret: only the status and Tailscale's own reason.
		throw new ApiError(
			{ method: 'POST', url: '/oauth/token' },
			{
				url: TAILSCALE_TOKEN_URL,
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: withoutEchoedValues(body),
			},
			`Tailscale OAuth client exchange failed: ${tailscaleErrorMessage(
				response.status,
				response.statusText,
				withoutEchoedValues(body),
			)}`,
		);
	}
	const fields =
		typeof body === 'object' && body !== null
			? (body as { access_token?: unknown; expires_in?: unknown })
			: {};
	if (typeof fields.access_token !== 'string' || !fields.access_token) {
		throw new Error('Tailscale OAuth client exchange returned no access token');
	}
	const lifetimeSeconds =
		typeof fields.expires_in === 'number' && fields.expires_in > 0
			? fields.expires_in
			: 3600;
	return {
		token: fields.access_token,
		expiresAt: Date.now() + lifetimeSeconds * 1000,
	};
}

/**
 * The bearer token for a call. An API access token is used as is; an OAuth
 * client secret is exchanged for a one-hour access token (cached in memory and
 * refreshed five minutes before it runs out). Concurrent calls share one
 * exchange.
 */
export async function tailscaleBearer(key: string): Promise<string> {
	if (key.length === 0) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('tailscale', 'api_key');
	}
	const clientId = oauthClientIdFrom(key);
	if (!clientId) return key;
	const cacheKey = await cacheKeyFor(key);
	const cached = tokenCache.get(cacheKey);
	if (cached && cached.expiresAt - TOKEN_REFRESH_MARGIN_MS > Date.now()) {
		return cached.token;
	}
	let pending = pendingTokens.get(cacheKey);
	if (!pending) {
		pending = exchangeClientSecret(clientId, key).finally(() => {
			pendingTokens.delete(cacheKey);
		});
		pendingTokens.set(cacheKey, pending);
	}
	const fresh = await pending;
	remember(cacheKey, fresh);
	return fresh.token;
}

/**
 * Drops the cached token for this key after a 401 (the client was revoked or
 * rescoped), but only if it is still the token that failed: a slow call that
 * used an older token must not throw away a newer one.
 */
export async function forgetTailscaleToken(
	key: string,
	failedToken: string,
): Promise<void> {
	if (!oauthClientIdFrom(key)) return;
	const cacheKey = await cacheKeyFor(key);
	if (tokenCache.get(cacheKey)?.token === failedToken) {
		tokenCache.delete(cacheKey);
	}
}

/** For tests: forget every cached token. */
export function clearTailscaleTokenCache(): void {
	tokenCache.clear();
	pendingTokens.clear();
}

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are ids and names (a device id, `svc:web`, a tailnet ID). Core's
 * default encodeURI keeps `/` and `..`, so `../keys/x` would reach a different
 * route than the one whose permission was checked.
 */
export function encodeTailscalePathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Tailscale path value');
	}
	return encodeURIComponent(value);
}

export type TailscaleHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TailscaleRequest = {
	/** The bearer token: an API access token, or one exchanged from an OAuth client. */
	token: string;
	method: TailscaleHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars or arrays, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** A JSON value, or HuJSON text for the policy file routes; validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: unknown;
	timeoutMs?: number;
};

function configFor(token: string, timeoutMs: number | undefined) {
	return {
		BASE: TAILSCALE_API_BASE,
		VERSION: '0.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeTailscalePathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? TAILSCALE_DEFAULT_TIMEOUT_MS),
		HEADERS: { Authorization: `Bearer ${token}` },
	} satisfies OpenAPIConfig;
}

/** HuJSON text goes as application/hujson; everything else as JSON. */
export function mediaTypeFor(body: unknown): string | undefined {
	if (body === undefined) return undefined;
	if (typeof body === 'string') return 'application/hujson';
	return 'application/json; charset=utf-8';
}

/**
 * Sends one Tailscale call through core's transport, which retries a 429
 * three times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON until the operation's output schema parses it.
export async function makeTailscaleRequest(
	options: TailscaleRequest,
): Promise<unknown> {
	const config = configFor(options.token, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options.body),
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}
}

export type TailscaleRawResponse = {
	text: string;
	headers: Headers;
};

const MAX_RATE_LIMIT_RETRIES = 3;

/**
 * For the policy file routes, which answer HuJSON text and put the file's
 * version in the ETag header. Core's `request()` returns the body only, so
 * this sends the call with `fetch` and keeps the headers. It mirrors core's
 * behaviour: the same URL building, a 429 retried three times honouring
 * Retry-After, and an `ApiError` carrying the status otherwise.
 */
export async function makeTailscaleRawRequest(
	options: TailscaleRequest,
): Promise<TailscaleRawResponse> {
	const config = configFor(options.token, options.timeoutMs);
	const url = buildUrl(options);
	const mediaType = mediaTypeFor(options.body);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		body: options.body,
		mediaType,
	};
	const body =
		options.body === undefined
			? undefined
			: typeof options.body === 'string'
				? options.body
				: JSON.stringify(options.body);
	for (let attempt = 1; ; attempt++) {
		const response = await fetch(url, {
			method: options.method,
			// No default Accept: with details=true Tailscale wants none, and
			// otherwise the caller picks JSON or HuJSON.
			headers: {
				...config.HEADERS,
				...(mediaType ? { 'Content-Type': mediaType } : {}),
				...options.headers,
			},
			body,
			credentials: 'omit',
			signal: AbortSignal.timeout(config.TIMEOUT),
		});
		const retryAfter = retryAfterMs(response.headers.get('retry-after'));
		if (response.status === 429 && attempt <= MAX_RATE_LIMIT_RETRIES) {
			await response.body?.cancel().catch(() => undefined);
			await new Promise((done) =>
				setTimeout(
					done,
					retryAfter ?? Math.min(1000 * 2 ** (attempt - 1), 60_000),
				),
			);
			continue;
		}
		if (!response.ok) {
			// An error body that can't be read still leaves the status to report.
			const text = await response.text().catch(() => '');
			// `unknown` because an error body is whatever JSON (or text) Tailscale sent.
			let errorBody: unknown = text;
			try {
				errorBody = JSON.parse(text);
			} catch {
				// Not JSON: keep the text.
			}
			throw withoutRequestData(
				new ApiError(
					requestOptions,
					{
						url,
						ok: false,
						status: response.status,
						statusText: response.statusText,
						body: errorBody,
					},
					response.statusText || `HTTP ${response.status}`,
					retryAfter === undefined ? undefined : { retryAfter },
				),
			);
		}
		// A body that fails to arrive throws: an empty string here would read as
		// an empty policy file or a passed validation.
		const text = await response.text();
		return { text, headers: response.headers };
	}
}

/** Retry-After as delay-seconds or an HTTP-date (RFC 9110 §10.2.3). */
export function retryAfterMs(
	value: string | null,
	now: number = Date.now(),
): number | undefined {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10) * 1000;
	const date = Date.parse(trimmed);
	return Number.isNaN(date) ? undefined : Math.max(0, date - now);
}

/** The same URL core builds: encoded path values, repeated keys for arrays. */
export function buildUrl(options: TailscaleRequest): string {
	const path = options.path.replace(/\{([^}]+)\}/g, (match, name: string) => {
		const value = options.pathParameters?.[name];
		return value === undefined ? match : encodeTailscalePathValue(value);
	});
	const parts: string[] = [];
	// `unknown` because query values are scalars or arrays, validated before transport.
	const add = (key: string, value: unknown) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			for (const item of value) add(key, item);
		} else {
			parts.push(
				`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
			);
		}
	};
	for (const [key, value] of Object.entries(options.query ?? {})) {
		add(key, value);
	}
	return `${TAILSCALE_API_BASE}${path}${parts.length > 0 ? `?${parts.join('&')}` : ''}`;
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request`. A Tailscale body can hold a
 * whole policy file, invite emails, log-streaming tokens and posture provider
 * secrets, so the error is rebuilt without it (and without request headers),
 * keeping the status and rate-limit fields the error handlers and core's
 * retries read.
 *
 * Core also writes a bare status text ("Bad Request") for the common statuses,
 * which hides Tailscale's reason. The message is rebuilt from Tailscale's error
 * body (`{ message }`) instead; the serialized body never goes in.
 */
export function withoutRequestData(error: ApiError): ApiError {
	const sent = sentStrings(error.request);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = tailscaleErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Query values can be emails and hostnames (a device filter, an audit-log actor): keep the keys only.
			query: redactedValues(error.request.query),
		},
		{
			url: withoutQuery(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// `unknown` because an error body is whatever JSON (or text) Tailscale sent.
export function tailscaleErrorMessage(
	status: number,
	statusText: string,
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? (body as { message?: unknown; error?: unknown; data?: unknown })
			: {};
	const reason =
		typeof fields.message === 'string' && fields.message.length > 0
			? fields.message
			: typeof fields.error === 'string' && fields.error.length > 0
				? fields.error
				: typeof body === 'string' && body.trim().length > 0
					? body.trim()
					: statusText || 'request failed';
	// Policy validation answers { message: "test(s) failed", data: [{ user, errors }] }.
	const details = Array.isArray(fields.data)
		? fields.data
				.flatMap((item) =>
					typeof item === 'object' && item !== null && 'errors' in item
						? (item as { errors?: unknown }).errors
						: [],
				)
				.filter((item): item is string => typeof item === 'string')
				.slice(0, 5)
		: [];
	const text = `Tailscale ${status}: ${reason}${
		details.length > 0 ? ` (${details.join('; ')})` : ''
	}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Shorter strings are ids, enum values and flags, not secrets worth hiding... */
const MIN_SCRUBBED_LENGTH = 6;
/** ...unless they sit under a key like these (a log-streaming token, a posture provider secret). */
const SECRET_KEY = /pass|secret|token|credential|key$/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values), longest first, so a
 * Tailscale message that quotes one back loses it while keeping its reason.
 * Values under a secret-looking key count at any length and are matched as
 * whole words, so a short one can't take out digits elsewhere in the text.
 */
function sentStrings(request: ApiError['request']): SentString[] {
	const found = new Map<string, boolean>();
	// `unknown` because a sent value is any JSON value.
	const visit = (value: unknown, depth: number, secret: boolean) => {
		if (depth > 8 || value === undefined || value === null) return;
		if (typeof value === 'string') {
			if (secret && value.length > 0) {
				if (!found.has(value))
					found.set(value, value.length < MIN_SCRUBBED_LENGTH);
			} else if (value.length >= MIN_SCRUBBED_LENGTH) {
				found.set(value, false);
			}
			return;
		}
		if (Array.isArray(value)) {
			for (const item of value) visit(item, depth + 1, secret);
			return;
		}
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
			}
		}
	};
	// A whole HuJSON policy file is one long string: quoting it back is the
	// only way it could reach a message, and it is never shorter than a reason.
	visit(request.body, 0, false);
	visit(request.query, 0, false);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Tailscale sent.
function scrubSent(value: unknown, sent: SentString[], depth = 0): unknown {
	if (sent.length === 0 || depth > 6) return value;
	if (typeof value === 'string') {
		let text = value;
		for (const item of sent) {
			text = item.wholeWord
				? text.replace(
						new RegExp(
							`(?<![A-Za-z0-9])${escapeRegExp(item.text)}(?![A-Za-z0-9])`,
							'g',
						),
						REDACTED,
					)
				: text.split(item.text).join(REDACTED);
		}
		return text;
	}
	if (Array.isArray(value)) {
		return value.map((item) => scrubSent(item, sent, depth + 1));
	}
	if (typeof value === 'object' && value !== null) {
		// `unknown` because error detail items have no fixed shape.
		const result: Record<string, unknown> = {};
		for (const [key, inner] of Object.entries(value)) {
			result[key] = scrubSent(inner, sent, depth + 1);
		}
		return result;
	}
	return value;
}

// `unknown` because query values are scalars or arrays.
function redactedValues(
	query: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (query === undefined) return undefined;
	return Object.fromEntries(Object.keys(query).map((key) => [key, REDACTED]));
}

/**
 * `https://…/devices?hostname=dave-laptop` → `https://…/devices?[REDACTED]`.
 * Parameter names go too: a device filter puts the caller's field names in them.
 */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

const ECHO_KEYS = new Set(['value', 'values', 'input', 'received']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Tailscale sent.
function withoutEchoedValues(body: unknown, depth = 0): unknown {
	if (depth > 4 || typeof body !== 'object' || body === null) return body;
	if (Array.isArray(body)) {
		return body.map((item) => withoutEchoedValues(item, depth + 1));
	}
	// `unknown` because error detail items have no fixed shape.
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (ECHO_KEYS.has(key)) continue;
		result[key] = withoutEchoedValues(value, depth + 1);
	}
	return result;
}
