import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * X API v2. Every route sits under /2 on api.x.com (api.twitter.com is the old
 * host). A user-context route takes an OAuth 2.0 user access token; app-only
 * routes (compliance, usage, filtered-stream rules, full-archive counts) take
 * the app's Bearer token. Both go in `Authorization: Bearer <token>`.
 * Reference: https://docs.x.com/x-api/introduction and
 * https://api.x.com/2/openapi.json.
 */
export const X_API_BASE = 'https://api.x.com';

/** OAuth 2.0 endpoints for the Authorization Code flow with PKCE. */
export const X_AUTHORIZE_URL = 'https://x.com/i/oauth2/authorize';
export const X_TOKEN_URL = 'https://api.x.com/2/oauth2/token';

export const X_DEFAULT_TIMEOUT_MS = 30_000;

/** Largest file the plugin reads into one upload call (a media segment, a compliance ID list). */
export const X_UPLOAD_MAX_BYTES = 512 * 1024 * 1024;

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are IDs and usernames. Core's default encodeURI keeps `/` and
 * `..`, so `../users/me` would reach a different route than the one whose
 * permission was checked.
 */
export function encodeXPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid X path value');
	}
	return encodeURIComponent(value);
}

export type XHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type XRequest = {
	/** An OAuth 2.0 user access token or the app's Bearer token. */
	key: string;
	method: XHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars or lists, validated before transport.
	query?: Record<string, unknown>;
	/** JSON object or raw bytes (`mediaType`); validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | Blob;
	/** The Content-Type of a raw body. */
	mediaType?: string;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(key: string, timeoutMs: number | undefined) {
	return {
		BASE: X_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeXPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? X_DEFAULT_TIMEOUT_MS),
		HEADERS: { Authorization: `Bearer ${key}` },
	} satisfies OpenAPIConfig;
}

/**
 * X takes list parameters as one comma-separated value
 * (`tweet.fields=created_at,public_metrics`); core's query writer would repeat
 * the key instead.
 */
// `unknown` because query values are validated scalars or lists.
export function xQuery(
	query: Record<string, unknown> | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [name, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			out[name] = value.map(String).join(',');
		} else if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			out[name] = value;
		} else {
			out[name] = JSON.stringify(value);
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

function mediaTypeFor(request: XRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof Blob !== 'undefined' && body instanceof Blob) {
		return request.mediaType ?? 'application/octet-stream';
	}
	return 'application/json';
}

/**
 * X's rate-limit headers (`x-rate-limit-reset` is epoch seconds). Core's
 * transport doesn't retry here: X's windows are 15 minutes or 24 hours (the
 * DM cap), and core would sleep until the reset. The 429 comes back at once
 * with `retryAfter` set, and RATE_LIMIT_ERROR retries only a short wait.
 */
export const X_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-rate-limit-reset',
		remaining: 'x-rate-limit-remaining',
		limit: 'x-rate-limit-limit',
	},
};

/**
 * Sends one X call through core's transport and raises `ApiError` with the
 * status and X's rate-limit fields. The `ApiError` is rebuilt without the request data and with
 * X's own reason (see withoutRequestData), keeping its status and rate-limit
 * fields for the error handlers and core's 401 refresh.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeXRequest(options: XRequest): Promise<unknown> {
	if (options.key.length === 0) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('twitter', 'oauth_2');
	}
	const config = configFor(options.key, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: xQuery(options.query),
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: X_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request`. An X body can hold post and
 * DM text, and the request headers carry the token, so the error is rebuilt
 * without them, keeping the status and rate-limit fields the error handlers
 * and core's retries read.
 *
 * Core also writes a bare status text ("Forbidden") for the common statuses,
 * which hides X's reason. The message is rebuilt from X's problem body
 * (`{ title, detail, type }`, or `{ errors: [{ message }] }` on v2 and
 * `{ error, error_description }` on the OAuth routes).
 */
export function withoutRequestData(error: ApiError): ApiError {
	const sent = sentStrings(error.request);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = xErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are IDs, usernames and search terms: keep the keys only.
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

// `unknown` because an error item has no fixed shape.
function issueText(item: unknown): string | undefined {
	if (typeof item === 'string') return item;
	if (typeof item !== 'object' || item === null) return undefined;
	// `unknown` because an error item's fields are narrowed one by one below.
	const record = item as {
		message?: unknown;
		detail?: unknown;
		title?: unknown;
		parameter?: unknown;
	};
	const text =
		typeof record.message === 'string'
			? record.message
			: typeof record.detail === 'string'
				? record.detail
				: typeof record.title === 'string'
					? record.title
					: undefined;
	if (!text) return undefined;
	return typeof record.parameter === 'string' &&
		!text.includes(record.parameter)
		? `${record.parameter}: ${text}`
		: text;
}

export function xErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) X sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as {
					detail?: unknown;
					title?: unknown;
					errors?: unknown;
					error?: unknown;
					error_description?: unknown;
					reason?: unknown;
				})
			: {};
	let reason: string | undefined;
	if (Array.isArray(fields.errors) && fields.errors.length > 0) {
		reason = fields.errors
			.map(issueText)
			.filter((text): text is string => Boolean(text))
			.slice(0, 5)
			.join('; ');
	}
	if (!reason && typeof fields.detail === 'string' && fields.detail) {
		reason = fields.detail;
	}
	if (!reason && typeof fields.error_description === 'string') {
		reason = fields.error_description;
	}
	if (!reason && typeof fields.title === 'string') reason = fields.title;
	if (!reason && typeof fields.error === 'string') reason = fields.error;
	if (!reason && typeof body === 'string' && body.trim().length > 0) {
		reason = body.trim();
	}
	// X names the missing access tier or setting here (`client-not-enrolled`).
	if (
		typeof fields.reason === 'string' &&
		reason &&
		!reason.includes(fields.reason)
	) {
		reason = `${reason} (${fields.reason})`;
	}
	const text = `X ${status}: ${reason || statusText || 'request failed'}`;
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
 * first, so an X message that quotes one back loses it while keeping its
 * reason. Any of them can be private text (a name like "Ada", a DM), so
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
	// An ID or a username in the path, at any length: X's 404 can quote it back.
	visit(request.path, 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) X sent.
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

// `unknown` because query and path values are scalars.
function redactedValues(
	values: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (values === undefined) return undefined;
	return Object.fromEntries(Object.keys(values).map((key) => [key, REDACTED]));
}

/**
 * The route the call took, without the caller's values:
 * `https://api.x.com/2/users/by/username/jack?user.fields=…` →
 * `https://api.x.com/2/users/by/username/{username}?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${X_API_BASE}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/2/users/search?query=…` → `https://…/2/users/search?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/**
 * Fields an error body uses to echo back what was sent: X's v2 errors carry
 * the offending `value`, and its validation errors list `parameters` with the
 * values given.
 */
const ECHO_KEYS = new Set([
	'value',
	'values',
	'input',
	'received',
	'ctx',
	'parameters',
]);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) X sent.
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
