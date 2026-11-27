import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Zep's HTTP API (https://help.getzep.com/v4). Every route takes the account's API key in
 * the `Authorization` header (`Api-Key <key>`): a project API key.
 */
export const ZEP_API_BASE = 'https://api.getzep.com/api/v4';

export const ZEP_DEFAULT_TIMEOUT_MS = 60_000;

/** Largest file the upload routes send. */
export const ZEP_UPLOAD_MAX_BYTES = 50 * 1024 * 1024;

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
export type ZepCallContext = {
	key: string;
	options: { baseUrl?: string };
};

/**
 * Path values are ids and names. Core's default encodeURI keeps `/` and `..`,
 * so a value like `../keys` would reach a different route than the one whose
 * permission was checked.
 */
export function encodeZepPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Zep path value');
	}
	return encodeURIComponent(value);
}

export type ZepHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ZepRequest = {
	method: ZepHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because query values are validated scalars or lists.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** A JSON value, a multipart or URL-encoded form, or raw bytes. */
	// `unknown` because a JSON body is any validated value (an object or a list).
	body?: unknown;
	/** The content type of a raw body. */
	mediaType?: string;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

/** The API base: the plugin's `baseUrl` option (a self-hosted server or a proxy), else Zep's own. */
export function baseUrlOf(ctx: ZepCallContext): string {
	const configured = ctx.options.baseUrl?.trim();
	if (!configured) return ZEP_API_BASE;
	const url = new URL(configured);
	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		throw new Error('Zep baseUrl must be an http(s) URL');
	}
	return configured.replace(/\/+$/, '');
}

function configFor(base: string, key: string, timeoutMs?: number) {
	return {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeZepPathValue,
		TIMEOUT: Math.ceil(timeoutMs ?? ZEP_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Api-Key ${key}`,
		},
	} satisfies OpenAPIConfig;
}

/**
 * Core retries a 429 three times, honouring `Retry-After` (seconds or an
 * HTTP date), with a backoff of 1, 2 and 4 seconds when the header is missing.
 */
export const ZEP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
		resetTime: 'x-ratelimit-reset',
	},
};

function mediaTypeFor(options: ZepRequest): string | undefined {
	if (options.mediaType) return options.mediaType;
	const body = options.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		return undefined;
	}
	if (
		typeof URLSearchParams !== 'undefined' &&
		body instanceof URLSearchParams
	) {
		return 'application/x-www-form-urlencoded';
	}
	return 'application/json';
}

/**
 * Sends one Zep call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeZepRequest(
	ctx: ZepCallContext,
	options: ZepRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('zep', 'api_key');
	}
	const base = baseUrlOf(ctx);
	const config = configFor(base, ctx.key, options.timeoutMs);
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
			rateLimitConfig: ZEP_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, ctx.key, base);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Zep body is the user's own context: chat messages, facts, graph episodes and user details, so the error
 * is rebuilt without it (and without request headers, which carry the API
 * key), keeping the status and rate-limit fields the error handlers and
 * core's retries read. Strings the call sent are also scrubbed from the error
 * body, in case Zep quotes them back.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Zep's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	key?: string,
	base: string = ZEP_API_BASE,
): ApiError {
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = zepErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			path: redactedValues(error.request.path),
			query: redactedValues(error.request.query),
		},
		{
			url: routeUrl(error.url, error.request.url, base),
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

// `unknown` because error bodies are untrusted provider JSON, narrowed below.
function textOf(value: unknown): string | undefined {
	if (typeof value === 'string' && value.trim().length > 0) return value.trim();
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		// `unknown` because the nested error object's fields are narrowed one by one.
		const inner = value as Record<string, unknown>;
		return textOf(inner.message) ?? textOf(inner.msg) ?? textOf(inner.detail);
	}
	if (Array.isArray(value)) {
		const parts = value
			.map((item) => {
				if (typeof item === 'string') return item;
				if (typeof item !== 'object' || item === null) return undefined;
				// `unknown` because a validation entry's fields are narrowed one by one.
				const entry = item as Record<string, unknown>;
				const text = textOf(entry.msg) ?? textOf(entry.message);
				const where = Array.isArray(entry.loc)
					? entry.loc.filter((part) => part !== 'body').join('.')
					: typeof entry.path === 'string'
						? entry.path
						: Array.isArray(entry.path)
							? entry.path.join('.')
							: undefined;
				return text && where ? `${where}: ${text}` : text;
			})
			.filter((part): part is string => typeof part === 'string')
			.slice(0, 5);
		return parts.length > 0 ? parts.join('; ') : undefined;
	}
	return undefined;
}

/**
 * The reason in a Zep error body: `message`, `error` (a string or an object
 * with a message), `detail` (a string or a list of validation entries) or
 * `errors`. A bare text body counts unless it is an HTML page.
 */
// `unknown` because the body is untrusted provider JSON or text.
export function zepErrorMessage(
	status: number,
	statusText: string,
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	let reason =
		textOf(fields.message) ??
		textOf(fields.error) ??
		textOf(fields.detail) ??
		textOf(fields.errors) ??
		textOf(fields.details);
	if (!reason && typeof body === 'string') {
		const text = body.trim();
		if (text.length > 0 && !text.startsWith('<')) reason = text;
	}
	const text = `Zep ${status}: ${reason || statusText || 'request failed'}`;
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
 * first, so a message that quotes one back loses it while keeping its reason.
 * Any of them can be user data (a memory, a name), so length doesn't exempt
 * one; short ones are matched as whole words, so they can't take out letters
 * or digits inside other words.
 */
function sentStrings(request: ApiError['request']): SentString[] {
	const found = new Map<string, boolean>();
	// `unknown` because the sent values are any validated JSON.
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
		if (value instanceof Uint8Array || value instanceof ArrayBuffer) return;
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
			}
		}
	};
	visit(request.body, 0, false);
	visit(request.query, 0, false);
	visit(request.path, 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because the error body is untrusted provider JSON.
function scrubSent(value: unknown, sent: SentString[], depth = 0): unknown {
	if (sent.length === 0) return value;
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
		// `unknown` because each field is scrubbed by its own type.
		const result: Record<string, unknown> = {};
		for (const [key, inner] of Object.entries(value)) {
			result[key] = scrubSent(inner, sent, depth + 1);
		}
		return result;
	}
	return value;
}

function redactedValues(
	// `unknown` because path and query values are validated scalars or lists.
	values: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (values === undefined) return undefined;
	return Object.fromEntries(Object.keys(values).map((key) => [key, REDACTED]));
}

/**
 * The route the call took, without the caller's values:
 * `<base>/things/abc?limit=5` → `<base>/things/{id}?[REDACTED]`.
 */
export function routeUrl(
	url: string,
	route: string | undefined,
	base: string = ZEP_API_BASE,
): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${base}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/things?query=…` → `https://…/things?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because the error body is untrusted provider JSON.
function withoutEchoedValues(body: unknown, depth = 0): unknown {
	if (typeof body !== 'object' || body === null) return body;
	if (depth > MAX_ERROR_DEPTH) return REDACTED;
	if (Array.isArray(body)) {
		return body.map((item) => withoutEchoedValues(item, depth + 1));
	}
	// `unknown` because each field keeps its own type.
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (ECHO_KEYS.has(key)) continue;
		result[key] = withoutEchoedValues(value, depth + 1);
	}
	return result;
}
