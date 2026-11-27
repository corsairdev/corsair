import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Netlify's REST API (https://api.netlify.com/api/v1, documented at
 * open-api.netlify.com). Calls take `Authorization: Bearer <token>`: a
 * personal access token (User settings > Applications) or an OAuth access
 * token from a Netlify OAuth app.
 */
export const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

export const NETLIFY_DEFAULT_TIMEOUT_MS = 30_000;

/** Uploads (deploy files and bundles) get longer. */
export const NETLIFY_UPLOAD_TIMEOUT_MS = 120_000;

/**
 * The page size the plugin asks for when a paged list's `per_page` is left
 * out. Netlify's own default is 100 for most lists, but not all; asking for
 * 100 makes every list page the same size.
 */
export const NETLIFY_PAGE_SIZE = 100;

/** Largest file the upload routes send (a deploy file or a function zip). */
export const NETLIFY_UPLOAD_MAX_BYTES = 200 * 1024 * 1024;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else thrown is a real failure
 * and propagates.
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
export type NetlifyCallContext = {
	key: string;
};

/**
 * One path value, encoded. `slashes` keeps `/` between segments for a file
 * path (`assets/app.js`); each segment is still encoded on its own. A `.` or
 * `..` segment would reach another route than the one whose permission was
 * checked, so it is refused.
 */
export function encodeNetlifyPathValue(value: string, slashes = false): string {
	const parts = slashes ? value.replace(/^\/+/, '').split('/') : [value];
	if (parts.some((part) => part === '' || part === '.' || part === '..')) {
		throw new Error('Invalid Netlify path value');
	}
	return parts.map((part) => encodeURIComponent(part)).join('/');
}

export type NetlifyHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type NetlifyRequest = {
	method: NetlifyHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeNetlifyPathValue). */
	pathParameters?: Record<string, string>;
	// `unknown` because query values are validated scalars and lists.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON value, multipart form, or raw bytes (a Blob) for the upload routes. */
	// `unknown` because a JSON body is an object or a list, validated per operation.
	body?: Record<string, unknown> | unknown[] | FormData | Blob;
	/** `binary`: the success comes back as `{ bytes, contentType }` (an empty body). */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(key: string, timeoutMs?: number) {
	return {
		BASE: NETLIFY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Values arrive encoded (encodeNetlifyPathValue), file paths with their `/` kept.
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(timeoutMs ?? NETLIFY_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
		},
	} satisfies OpenAPIConfig;
}

/**
 * Netlify allows 500 requests a minute (and 3 deploys a minute, 100 a day)
 * and answers 429 with X-RateLimit-Reset (epoch seconds); core retries three
 * times, waiting for the reset.
 */
export const NETLIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

function mediaTypeFor(request: NetlifyRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		return undefined;
	}
	if (typeof Blob !== 'undefined' && body instanceof Blob) {
		return body.type || 'application/octet-stream';
	}
	return 'application/json';
}

/**
 * Sends one Netlify call through core's transport, which retries a 429 three
 * times (waiting for X-RateLimit-Reset) and raises `ApiError` with the status.
 */
export async function makeNetlifyRequest(
	ctx: NetlifyCallContext,
	options: NetlifyRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('netlify', 'api_key');
	}
	const config = configFor(ctx.key, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NETLIFY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Core may already have masked sensitive query values on
			// error.request (the TLS `key` on sites.ssl.provision), so the
			// values this call really sent are scrubbed from the body too.
			throw withoutRequestData(error, ctx.key, {
				query: options.query,
				path: options.pathParameters,
				body:
					options.body instanceof Blob || options.body instanceof FormData
						? undefined
						: options.body,
			});
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Netlify body can hold
 * environment variable values, uploaded site files and function code, form
 * submissions and member emails, so the error is rebuilt without it (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Netlify's reason. The message is rebuilt from Netlify's error body.
 */
export function withoutRequestData(
	error: ApiError,
	key?: string,
	// `unknown` because the original values are whatever the call validated.
	original?: { query?: unknown; path?: unknown; body?: unknown },
): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
		...(original
			? sentStrings({
					...error.request,
					query: original.query as Record<string, unknown> | undefined,
					path: original.path as Record<string, unknown> | undefined,
					body: original.body,
				})
			: []),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = netlifyErrorMessage(error.status, error.statusText, body);
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
 * Netlify's error body (the swagger's `error` definition):
 * `{ "code": 404, "message": "Not Found" }`; validation errors may add
 * `errors`, a list of strings or a map of field -> messages. A plain-text
 * body is kept as it is.
 */
export function netlifyErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Netlify sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const parts: string[] = [];
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		parts.push(fields.message);
	}
	const errors = Array.isArray(fields.errors)
		? fields.errors
		: typeof fields.errors === 'object' && fields.errors !== null
			? Object.entries(fields.errors).flatMap(([field, messages]) =>
					(Array.isArray(messages) ? messages : [messages]).map((message) =>
						typeof message === 'string' ? `${field} ${message}` : undefined,
					),
				)
			: [];
	if (errors.length > 0) {
		for (const item of errors.slice(0, 5)) {
			if (
				typeof item === 'string' &&
				item.length > 0 &&
				!parts.includes(item)
			) {
				parts.push(item);
			}
		}
	}
	if (
		parts.length === 0 &&
		typeof body === 'string' &&
		body.trim().length > 0
	) {
		// An HTML error page (a proxy, a login page) says nothing useful.
		const text = body.trim();
		if (!text.startsWith('<')) parts.push(text);
	}
	const text = `Netlify ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a Netlify message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a user name like "ada", an issue title), so
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
	// The path values were sent encoded (`a%40b.md`); Netlify quotes them back
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
// `unknown` because an error body is whatever JSON (or text) Netlify sent.
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
 * `https://api.netlify.com/api/v1/sites/3b1c.../deploys?page=2` →
 * `https://api.netlify.com/api/v1/sites/{site_id}/deploys?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	const mark = url.indexOf('/api/v1/');
	if (typeof route !== 'string' || !route.startsWith('/') || mark === -1) {
		return withoutQuery(url);
	}
	const base = url.slice(0, mark + '/api/v1'.length);
	return `${base}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Netlify sent.
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
