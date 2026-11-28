import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AzureDevopsAuthOptions, AzureDevopsStoredKeys } from './auth';
import { resolveAzureDevopsTarget } from './auth';

/**
 * AzureDevops's HTTP API (https://learn.microsoft.com/rest/api/azure/devops/). Every route takes a personal access token as HTTP Basic auth with an empty user name. The API base and the
 * credential headers come from `resolveAzureDevopsTarget` (auth.ts).
 */

export const AZUREDEVOPS_DEFAULT_TIMEOUT_MS = 60_000;

/** Largest file the upload routes send. */
export const AZUREDEVOPS_UPLOAD_MAX_BYTES = 50 * 1024 * 1024;

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
export type AzureDevopsCallContext = {
	key: string;
	options: AzureDevopsAuthOptions;
	keys?: AzureDevopsStoredKeys;
};

/**
 * Path values are ids and names. Core's default encodeURI keeps `/` and `..`,
 * so a value like `../keys` would reach a different route than the one whose
 * permission was checked.
 */
export function encodeAzureDevopsPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Azure DevOps path value');
	}
	return encodeURIComponent(value);
}

export type AzureDevopsHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AzureDevopsRequest = {
	method: AzureDevopsHttpMethod;
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
	/**
	 * Path values the operation already encoded itself (a file path whose
	 * slashes stay): sent as they are, while the route keeps its placeholder,
	 * so error URLs never show them.
	 */
	rawPathValues?: Set<string>;
	/** The API host this route lives on, where the vendor splits routes across hosts. */
	host?: string;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
	/**
	 * One attempt only, even on a 429: a route whose 429 means a daily quota
	 * is spent (R8), where waiting out Retry-After would hold the call for hours.
	 */
	singleAttempt?: boolean;
	/**
	 * Caller strings that aren't values the transport can see: map keys
	 * (metadata keys) and file names. Scrubbed from error bodies like the
	 * values sent.
	 */
	sensitive?: string[];
};

function configFor(
	base: string,
	authHeaders: Record<string, string>,
	timeoutMs?: number,
	rawPathValues?: Set<string>,
) {
	return {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: (value: string) =>
			rawPathValues?.has(value) ? value : encodeAzureDevopsPathValue(value),
		TIMEOUT: Math.ceil(timeoutMs ?? AZUREDEVOPS_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			...authHeaders,
		},
	} satisfies OpenAPIConfig;
}

/**
 * Core retries a 429 three times, honouring `Retry-After` (seconds or an
 * HTTP date), with a backoff of 1, 2 and 4 seconds when the header is missing.
 */
export const AZUREDEVOPS_RATE_LIMIT_CONFIG: RateLimitConfig = {
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

function mediaTypeFor(options: AzureDevopsRequest): string | undefined {
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
 * Sends one Azure DevOps call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeAzureDevopsRequest(
	ctx: AzureDevopsCallContext,
	options: AzureDevopsRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('azuredevops', 'api_key');
	}
	const target = await resolveAzureDevopsTarget(ctx, options.host);
	const base = target.base;
	const config = configFor(
		base,
		target.headers,
		options.timeoutMs,
		options.rawPathValues,
	);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: { ...options.query, ...target.query },
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: options.singleAttempt
				? { ...AZUREDEVOPS_RATE_LIMIT_CONFIG, maxRetries: 0 }
				: AZUREDEVOPS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, ctx.key, base, [
				...(options.sensitive ?? []),
				...target.secrets,
			]);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. An Azure DevOps body can hold source code, work item text, pipeline variables and secrets, service connection credentials and user emails, so the error
 * is rebuilt without it (and without request headers, which carry the API
 * key), keeping the status and rate-limit fields the error handlers and
 * core's retries read. Strings the call sent are also scrubbed from the error
 * body, in case Azure DevOps quotes them back.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides AzureDevops's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	key: string | undefined,
	base: string,
	sensitive: readonly string[] = [],
): ApiError {
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sensitive
			.filter((text) => text.length >= 2)
			.map((text) => ({ text, wholeWord: text.length < WHOLE_WORD_BELOW })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(unwrapped(error.body)), sent);
	const message = azuredevopsErrorMessage(error.status, error.statusText, body);
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
		return (
			textOf(inner.message) ??
			textOf(inner.Message) ??
			textOf(inner.msg) ??
			textOf(inner.detail)
		);
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
 * The reason in a Azure DevOps error body: `message`, `error` (a string or an object
 * with a message), `detail` (a string or a list of validation entries) or
 * `errors`. A bare text body counts unless it is an HTML page.
 */
// `unknown` because the body is untrusted provider JSON or text.
export function azuredevopsErrorMessage(
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
		textOf(fields.details) ??
		textOf(fields.Message);
	if (!reason && typeof body === 'string') {
		const text = body.trim();
		if (text.length > 0 && !text.startsWith('<')) reason = text;
	}
	const text = `Azure DevOps ${status}: ${reason || statusText || 'request failed'}`;
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

/** Body fields that carry env-file text (`envContents`, a secret file's `contents`). */
const ENV_TEXT_KEY = /^(envContents|contents)$/;

/** The non-empty lines of env-file text and the value after each `KEY=`. */
export function envTextParts(text: string): string[] {
	const parts: string[] = [];
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		parts.push(line);
		const equals = line.indexOf('=');
		if (equals > 0) {
			const value = line
				.slice(equals + 1)
				.trim()
				.replace(/^(['"])(.*)\1$/, '$2');
			if (value) parts.push(value);
		}
	}
	return parts;
}

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
		// Deep enough for any request body a route takes; still bounded.
		if (depth > 64 || value === undefined || value === null) return;
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
		if (typeof FormData !== 'undefined' && value instanceof FormData) {
			// Text fields and file names; file contents are never read.
			value.forEach((entry) => {
				if (typeof entry === 'string') visit(entry, depth + 1, secret);
				else if (typeof File !== 'undefined' && entry instanceof File) {
					visit(entry.name, depth + 1, secret);
				}
			});
			return;
		}
		if (value instanceof Uint8Array || value instanceof ArrayBuffer) return;
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
				// Env-file text (`KEY=value` lines): an error can quote one value
				// back, so each line and each value counts as sent on its own.
				if (ENV_TEXT_KEY.test(key) && typeof inner === 'string') {
					for (const part of envTextParts(inner)) visit(part, depth + 1, true);
				}
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
			// A key can be caller data too (a field error keyed by an email).
			const name = scrubSent(key, sent, depth + 1) as string;
			result[name === key ? key : `${REDACTED}#${Object.keys(result).length}`] =
				scrubSent(inner, sent, depth + 1);
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
	base: string,
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

/**
 * Some .NET services send an error inside a collection wrapper,
 * `{ count: 1, value: { Message } }`. The wrapper goes before echoed values
 * are dropped, or the reason would go with it.
 */
// `unknown` because the error body is untrusted provider JSON.
function unwrapped(body: unknown): unknown {
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return body;
	}
	const fields = body as Record<string, unknown>;
	const inner = fields.value;
	return typeof fields.count === 'number' &&
		typeof inner === 'object' &&
		inner !== null &&
		!Array.isArray(inner)
		? inner
		: body;
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

/** A page from a route that sends its next-page token in a response header. */
export type AzureDevopsHeaderPage = {
	// `unknown` because the page body is validated by the operation's output schema.
	body: unknown;
	/** The header's value as sent, or null when the response had none. */
	header: string | null;
};

/** The longest backoff when a 429 has no Retry-After, as in core. */
const MAX_RETRY_DELAY_MS = 60_000;

/**
 * The URL core's `request()` builds for the same options: path values through
 * the same encoder, lists as repeated keys, maps as `name[key]=value`.
 */
export function azuredevopsRequestUrl(
	base: string,
	options: AzureDevopsRequest,
): string {
	const path = options.path.replace(/\{([^}]+)\}/g, (match, name: string) => {
		const value = options.pathParameters?.[name];
		if (value === undefined) return match;
		return options.rawPathValues?.has(value)
			? value
			: encodeAzureDevopsPathValue(value);
	});
	const parts: string[] = [];
	// `unknown` because query values are validated scalars, lists or maps.
	const add = (key: string, value: unknown) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			for (const item of value) add(key, item);
		} else if (typeof value === 'object') {
			for (const [inner, innerValue] of Object.entries(value)) {
				add(`${key}[${inner}]`, innerValue);
			}
		} else {
			parts.push(
				`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
			);
		}
	};
	for (const [key, value] of Object.entries(options.query ?? {})) {
		add(key, value);
	}
	return `${base}/${path.replace(/^\/+/, '')}${parts.length > 0 ? `?${parts.join('&')}` : ''}`;
}

function retryAfterMs(value: string | null): number | undefined {
	if (!value) return undefined;
	const seconds = Number.parseInt(value, 10);
	// An explicit wait is kept as sent, as core does; only the fallback is capped.
	return Number.isNaN(seconds) ? undefined : Math.max(seconds, 0) * 1000;
}

/**
 * A GET whose next-page token comes back in a response header (the
 * `headerCursor` routes, such as a `Next-Cursor` header). Core's `request()` returns the body or
 * one header, never both, so this sends the call with `fetch` and keeps the
 * header. Everything else matches `makeAzureDevopsRequest`: the same URL, API key
 * header and timeout, a 429 retried three times (Retry-After in seconds, else
 * 1, 2 and 4 s), and failures raised as the same scrubbed `ApiError`.
 */
export async function makeAzureDevopsHeaderPagedRequest(
	ctx: AzureDevopsCallContext,
	options: AzureDevopsRequest,
	header: string,
): Promise<AzureDevopsHeaderPage> {
	if (options.method !== 'GET' || options.body !== undefined) {
		throw new Error('Azure DevOps header paging is for GET routes only');
	}
	return makeAzureDevopsHeaderRequest(ctx, options, header);
}

/**
 * A call whose answer is the body plus one response header (an `ETag` that
 * the next write sends back as `If-Match`). Sent like the header-paged GET
 * above, with a JSON body when the route takes one.
 */
export async function makeAzureDevopsHeaderRequest(
	ctx: AzureDevopsCallContext,
	options: AzureDevopsRequest,
	header: string,
): Promise<AzureDevopsHeaderPage> {
	if (!ctx.key) {
		throw new AuthMissingError('azuredevops', 'api_key');
	}
	const sent = options.body;
	if (
		sent !== undefined &&
		(sent instanceof Uint8Array ||
			(typeof Blob !== 'undefined' && sent instanceof Blob) ||
			(typeof FormData !== 'undefined' && sent instanceof FormData))
	) {
		throw new Error('Azure DevOps header calls send JSON bodies only');
	}
	const target = await resolveAzureDevopsTarget(ctx, options.host);
	const base = target.base;
	const config = configFor(
		base,
		target.headers,
		options.timeoutMs,
		options.rawPathValues,
	);
	const url = azuredevopsRequestUrl(base, {
		...options,
		query: { ...options.query, ...target.query },
	});
	// The sent body is here so an error that quotes it back is scrubbed;
	// the rebuilt error replaces it with a placeholder.
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: sent,
	};
	const maxRetries = options.singleAttempt
		? 0
		: AZUREDEVOPS_RATE_LIMIT_CONFIG.maxRetries;
	for (let attempt = 1; ; attempt++) {
		const response = await fetch(url, {
			method: options.method,
			headers: {
				...config.HEADERS,
				...(sent === undefined
					? {}
					: { 'Content-Type': mediaTypeFor(options) ?? 'application/json' }),
				...options.headers,
			},
			...(sent === undefined ? {} : { body: JSON.stringify(sent) }),
			signal: AbortSignal.timeout(config.TIMEOUT),
		});
		const retryAfter = retryAfterMs(response.headers.get('retry-after'));
		if (response.status === 429 && attempt <= maxRetries) {
			await response.body?.cancel().catch(() => undefined);
			await new Promise((done) =>
				setTimeout(
					done,
					retryAfter ??
						Math.min(
							AZUREDEVOPS_RATE_LIMIT_CONFIG.initialRetryDelay *
								AZUREDEVOPS_RATE_LIMIT_CONFIG.backoffMultiplier **
									(attempt - 1),
							MAX_RETRY_DELAY_MS,
						),
				),
			);
			continue;
		}
		const text = await response.text();
		if (!response.ok) {
			// `unknown` because an error body is untrusted provider JSON or text.
			let errorBody: unknown = text.length === 0 ? undefined : text;
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
				ctx.key,
				base,
				[...(options.sensitive ?? []), ...target.secrets],
			);
		}
		// `unknown` because the page body is validated by the operation's output schema.
		let body: unknown;
		if (text.trim().length > 0) {
			try {
				body = JSON.parse(text);
			} catch {
				// The body itself stays out of the message: it can hold page content.
				throw new Error('Azure DevOps answered with a body that is not JSON');
			}
		}
		return { body, header: response.headers.get(header) };
	}
}
