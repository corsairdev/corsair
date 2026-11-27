import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * PayPal's REST APIs. An app's client id and secret are exchanged for an
 * access token (OAuth 2.0 client credentials, POST /v1/oauth2/token) and the
 * token goes as `Authorization: Bearer`. Sandbox and live are separate hosts
 * with separate apps: api-m.sandbox.paypal.com and api-m.paypal.com.
 */
export const PAYPAL_DEFAULT_TIMEOUT_MS = 60_000;
export const PAYPAL_HOSTS = {
	live: 'https://api-m.paypal.com',
	sandbox: 'https://api-m.sandbox.paypal.com',
} as const;
export type PaypalEnvironment = keyof typeof PAYPAL_HOSTS;

/** Largest file the dispute routes send (PayPal allows 10 MB per file, 50 MB per request). */
export const PAYPAL_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the secret and client id in plugin options. Anything else thrown is
 * a real failure and propagates.
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

/** What a call needs from the endpoint context. */
export type PaypalCallContext = {
	/** The app's client secret. */
	key: string;
	options: { clientId?: string; environment?: PaypalEnvironment };
	keys?: {
		get_client_id?: () => Promise<string | null | undefined>;
		get_environment?: () => Promise<string | null | undefined>;
	};
};

/** `live` / `sandbox` (also `production`), or undefined when unset. */
export function parseEnvironment(
	raw: string | null | undefined,
): PaypalEnvironment | undefined {
	const value = (raw ?? '').trim().toLowerCase();
	if (!value) return undefined;
	if (value === 'live' || value === 'production') return 'live';
	if (value === 'sandbox') return 'sandbox';
	throw new Error('[paypal] environment must be live or sandbox');
}

/**
 * The client id and environment for one call: the plugin options when set,
 * otherwise the account's stored `client_id` and `environment`.
 */
export async function resolvePaypalApp(
	ctx: Pick<PaypalCallContext, 'options' | 'keys'>,
): Promise<{ clientId: string; environment?: PaypalEnvironment }> {
	const idGetter = ctx.keys?.get_client_id;
	const clientId =
		ctx.options?.clientId?.trim() ||
		(idGetter ? (await tryGetStoredKey(idGetter))?.trim() : '');
	if (!clientId) {
		throw new AuthMissingError(
			'paypal',
			'api_key',
			"[paypal] client id is not set: connect the account with the app's client id next to its secret",
		);
	}
	const envGetter = ctx.keys?.get_environment;
	const environment =
		ctx.options?.environment ??
		parseEnvironment(envGetter ? await tryGetStoredKey(envGetter) : undefined);
	return { clientId, environment };
}

type CachedToken = {
	token: string;
	environment: PaypalEnvironment;
	expiresAt: number;
};

/** Access tokens by client id and environment (PayPal's last about 9 hours). */
const tokenCache = new Map<string, CachedToken>();
/** Which environment a client id belongs to, once a token request proved it. */
const environmentOf = new Map<string, PaypalEnvironment>();

/** Forget cached tokens (tests, or after PayPal answers 401 to a token). */
export function clearPaypalTokens(): void {
	tokenCache.clear();
	environmentOf.clear();
}

async function fetchToken(
	environment: PaypalEnvironment,
	clientId: string,
	secret: string,
): Promise<CachedToken> {
	const basic = Buffer.from(`${clientId}:${secret}`, 'utf8').toString('base64');
	const response = await request<{
		access_token?: string;
		expires_in?: number;
	}>(
		{
			BASE: PAYPAL_HOSTS[environment],
			VERSION: '1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TIMEOUT: PAYPAL_DEFAULT_TIMEOUT_MS,
			HEADERS: { Accept: 'application/json', Authorization: `Basic ${basic}` },
		},
		{
			method: 'POST',
			url: '/v1/oauth2/token',
			body: 'grant_type=client_credentials',
			mediaType: 'application/x-www-form-urlencoded',
		},
		{ rateLimitConfig: PAYPAL_RATE_LIMIT_CONFIG },
	);
	if (!response?.access_token) {
		throw new Error(
			'[paypal] the token endpoint answered without an access token',
		);
	}
	const ttl = (response.expires_in ?? 3600) * 1000;
	// Renew a minute early, so a call never starts with a token about to lapse.
	return {
		token: response.access_token,
		environment,
		expiresAt: Date.now() + Math.max(ttl - 60_000, 0),
	};
}

/**
 * An access token for the app. With no environment set, live is tried first
 * and sandbox on `invalid_client` (a sandbox app's credentials don't exist on
 * live); the environment that answered is remembered for the client id.
 */
export async function paypalAccessToken(
	clientId: string,
	secret: string,
	environment?: PaypalEnvironment,
): Promise<CachedToken> {
	const known = environment ?? environmentOf.get(clientId);
	const candidates: PaypalEnvironment[] = known ? [known] : ['live', 'sandbox'];
	let lastError: unknown;
	for (const env of candidates) {
		const cacheKey = `${env}:${clientId}`;
		const cached = tokenCache.get(cacheKey);
		if (cached && cached.expiresAt > Date.now()) return cached;
		try {
			const fresh = await fetchToken(env, clientId, secret);
			tokenCache.set(cacheKey, fresh);
			environmentOf.set(clientId, env);
			return fresh;
		} catch (error) {
			if (error instanceof ApiError) {
				lastError = withoutRequestData(error, [secret, clientId]);
				// Only a wrong environment is worth a second try.
				if (error.status === 401 && !known) continue;
				throw lastError;
			}
			throw error;
		}
	}
	throw lastError;
}

/** One path value, encoded. */
export function encodePaypalPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..' || value.includes('/')) {
		throw new Error('Invalid PayPal path value');
	}
	return encodeURIComponent(value);
}

export type PaypalHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type PaypalRequest = {
	method: PaypalHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodePaypalPathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** A JSON object or array (JSON Patch), or a multipart form. */
	body?: Record<string, unknown> | unknown[] | FormData;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

/**
 * PayPal answers 429 when an app sends too many requests; core retries three
 * times, honouring Retry-After.
 */
export const PAYPAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one PayPal call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status. A 401
 * with a cached token drops the token and tries once with a new one (PayPal
 * revokes tokens when an app's credentials change).
 */
export async function makePaypalRequest(
	ctx: PaypalCallContext,
	options: PaypalRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('paypal', 'api_key');
	}
	const { clientId, environment } = await resolvePaypalApp(ctx);
	const send = async (token: CachedToken) => {
		const config = {
			BASE: PAYPAL_HOSTS[token.environment],
			VERSION: '1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			ENCODE_PATH: (value: string) => value,
			TIMEOUT: Math.ceil(options.timeoutMs ?? PAYPAL_DEFAULT_TIMEOUT_MS),
			HEADERS: {
				Accept: 'application/json',
				Authorization: `Bearer ${token.token}`,
			},
		} satisfies OpenAPIConfig;
		const isForm =
			typeof FormData !== 'undefined' && options.body instanceof FormData;
		const requestOptions: ApiRequestOptions = {
			method: options.method,
			url: options.path,
			path: options.pathParameters,
			query: options.query,
			headers: options.headers,
			body: options.body,
			mediaType:
				options.body === undefined || isForm ? undefined : 'application/json',
			...(options.responseType ? { responseType: options.responseType } : {}),
		};
		return request<unknown>(config, requestOptions, {
			rateLimitConfig: PAYPAL_RATE_LIMIT_CONFIG,
		});
	};
	let token = await paypalAccessToken(clientId, ctx.key, environment);
	try {
		try {
			return await send(token);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				tokenCache.delete(`${token.environment}:${clientId}`);
				token = await paypalAccessToken(clientId, ctx.key, token.environment);
				return await send(token);
			}
			throw error;
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, [ctx.key, clientId, token.token]);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A PayPal body can hold
 * payers' names, emails, addresses and phone numbers, card and bank details
 * (vault, payment sources) and payout recipients, so the error is rebuilt
 * without it (and without request headers, which carry the access token, and
 * query values), keeping the status and rate-limit fields the error handlers
 * and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides PayPal's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	secrets: readonly string[] = [],
): ApiError {
	// The secret, client id and token travel in the transport config: add
	// them, so a body that echoes one loses it too.
	const sent = [
		...secrets
			.filter((text) => text.length >= 2)
			.map((text) => ({ text, wholeWord: text.length < WHOLE_WORD_BELOW })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = paypalErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are ids, names and search terms: keep the keys only.
			path: redactedValues(error.request.path),
			query: redactedValues(error.request.query),
		},
		{
			url: routeUrl(error.url, error.request.url),
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

/**
 * PayPal error bodies: `{ "name": "UNPROCESSABLE_ENTITY", "message": "The
 * requested action could not be performed...", "debug_id": "8a1b...",
 * "details": [{ "field": "/purchase_units/0/amount", "issue":
 * "AMOUNT_MISMATCH", "description": "..." }] }`, and from the token endpoint
 * `{ "error": "invalid_client", "error_description": "Client
 * Authentication failed" }`. The name, the first issues and the debug_id
 * (what PayPal support asks for) make the message.
 */
export function paypalErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) PayPal sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const parts: string[] = [];
	const name =
		typeof fields.name === 'string'
			? fields.name
			: typeof fields.error === 'string'
				? fields.error
				: '';
	const message =
		typeof fields.message === 'string'
			? fields.message
			: typeof fields.error_description === 'string'
				? fields.error_description
				: '';
	if (name || message) parts.push([name, message].filter(Boolean).join(': '));
	if (Array.isArray(fields.details)) {
		for (const item of fields.details.slice(0, 3)) {
			if (typeof item !== 'object' || item === null) continue;
			// `unknown` because detail items have no fixed shape.
			const detail = item as Record<string, unknown>;
			const text = [detail.field, detail.issue, detail.description]
				.filter((part) => typeof part === 'string' && part.length > 0)
				.join(' ');
			if (text) parts.push(text);
		}
	}
	if (typeof fields.debug_id === 'string') {
		parts.push(`debug_id ${fields.debug_id}`);
	}
	if (
		parts.length === 0 &&
		typeof body === 'string' &&
		body.trim().length > 0
	) {
		const text = body.trim();
		if (!text.startsWith('<')) parts.push(text);
	}
	const text = `PayPal ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Strings shorter than this are matched as whole words only... */
const WHOLE_WORD_BELOW = 6;
/**
 * ...and one-character strings are left alone, unless they sit under a key
 * like these (a password, a token, a code, a phone number), where every
 * length counts.
 */
const SECRET_KEY =
	/pass|secret|token|credential|key$|otp|code$|phone|number|email|address|to$|from$/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values, path values), longest
 * first, so a PayPal message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a payer name like "ada", an invoice number), so
 * length doesn't exempt one; short ones are matched as whole words, so they
 * can't take out letters or digits inside other words.
 */
function sentStrings(request: ApiError['request']): SentString[] {
	const found = new Map<string, boolean>();
	// `unknown` because a sent value is any JSON value.
	const visit = (value: unknown, depth: number, secret: boolean) => {
		if (depth > 8 || value === undefined || value === null) return;
		if (typeof value === 'string') {
			if (value.length >= (secret ? 1 : 2) && !found.has(value)) {
				found.set(value, value.length < WHOLE_WORD_BELOW);
			}
			return;
		}
		if (typeof value === 'number' && secret) {
			const text = String(value);
			if (!found.has(text)) found.set(text, true);
			return;
		}
		if (Array.isArray(value)) {
			for (const item of value) visit(item, depth + 1, secret);
			return;
		}
		if (typeof FormData !== 'undefined' && value instanceof FormData) return;
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
			}
		}
	};
	visit(request.body, 0, false);
	visit(request.query, 0, false);
	// An id or record type in the path, at any length:
	// a 404 can quote it back.
	visit(request.path, 0, true);
	// The path values were sent encoded (`a%40b`); PayPal quotes them back
	// decoded, so the decoded form is scrubbed too.
	visit(decodedValues(request.path), 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

// `unknown` because path values are validated scalars.
function decodedValues(
	values: Record<string, unknown> | undefined,
): Record<string, string> {
	const decoded: Record<string, string> = {};
	for (const [key, value] of Object.entries(values ?? {})) {
		if (typeof value !== 'string') continue;
		try {
			decoded[key] = decodeURIComponent(value);
		} catch {
			// Not percent-encoded after all: the raw value is already collected.
		}
	}
	return decoded;
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) the site sent.
function scrubSent(value: unknown, sent: SentString[], depth = 0): unknown {
	if (sent.length === 0) return value;
	// A sent value echoed deeper than this is dropped with its subtree.
	if (depth > MAX_ERROR_DEPTH) return REDACTED;
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
	if (typeof value === 'number') {
		// A number the call sent under a sensitive key (a phone number, a
		// code), echoed back as a number.
		const text = String(value);
		if (sent.some((item) => item.text === text)) return REDACTED;
	}
	return value;
}

// `unknown` because query and path values are scalars.
function redactedValues(
	values: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (values === undefined) return undefined;
	return Object.fromEntries(Object.keys(values).map((key) => [key, REDACTED]));
}

/**
 * The route the call took, without the caller's values:
 * `https://api-m.paypal.com/v2/checkout/orders/5O190127TN364715T?fields=x` →
 * `https://api-m.paypal.com/v2/checkout/orders/{id}?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	let origin: string;
	try {
		origin = new URL(url).origin;
	} catch {
		return withoutQuery(url);
	}
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${origin}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/**
 * Fields an error body may use to echo back what was sent. PayPal's own
 * `data.params` (field → reason) is kept: it names what was wrong, and any
 * sent value quoted in it is scrubbed like the rest.
 */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) the site sent.
function withoutEchoedValues(body: unknown, depth = 0): unknown {
	if (typeof body !== 'object' || body === null) return body;
	// Deeper than the scrub below reaches: nothing of it is kept.
	if (depth > MAX_ERROR_DEPTH) return REDACTED;
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
