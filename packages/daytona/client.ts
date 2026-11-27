import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Daytona's REST API (https://www.daytona.io/docs/en/tools/api.md, OpenAPI
 * spec at https://www.daytona.io/docs/openapi.json) at
 * `https://app.daytona.io/api`, or a self-hosted Daytona's `/api`. Every
 * route takes `Authorization: Bearer <api key>`.
 *
 * Two more APIs take the same key on other hosts:
 * - the Toolbox API (files, processes, git, LSP, computer use) inside one
 *   sandbox, at `<toolbox proxy URL>/<sandbox id>`, where the proxy URL comes
 *   from `GET /sandbox/{id}/toolbox-proxy-url`;
 * - the Analytics API (telemetry and usage), at the `analyticsApiUrl` that
 *   `GET /config` names.
 */
export const DAYTONA_API_BASE = 'https://app.daytona.io/api';

/** Used when `GET /config` names no analytics host. */
export const DAYTONA_ANALYTICS_BASE = 'https://analytics.app.daytona.io';

export const DAYTONA_DEFAULT_TIMEOUT_MS = 60_000;

/** Largest file the upload routes send. */
export const DAYTONA_UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else
 * thrown is a real failure and propagates.
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
export type DaytonaCallContext = {
	key: string;
	options?: { apiUrl?: string; organizationId?: string };
};

/** The API base: the apiUrl option (self-hosted Daytona) or Daytona Cloud. */
export function apiBaseOf(ctx: DaytonaCallContext): string {
	const configured = ctx.options?.apiUrl?.trim();
	if (!configured) return DAYTONA_API_BASE;
	const url = new URL(configured);
	if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
		throw new Error('Daytona apiUrl must be https');
	}
	return configured.replace(/\/+$/, '');
}

/** A base URL Daytona's own answer named (toolbox proxy, analytics): https only. */
export function checkedBase(value: unknown, what: string): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Daytona returned no ${what} URL`);
	}
	const url = new URL(value);
	if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
		throw new Error(`Daytona returned a ${what} URL that is not https`);
	}
	return value.replace(/\/+$/, '');
}

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are ids and names. Core's default encodeURI keeps `/`
 * and `..`, so a value like `../users` would reach a different route than the
 * one whose permission was checked.
 */
export function encodeDaytonaPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Daytona path value');
	}
	return encodeURIComponent(value);
}

export type DaytonaHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type DaytonaRequest = {
	method: DaytonaHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, lists or maps, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object, multipart form, or raw bytes (a file write); validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData | Blob;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a file, a recording). */
	responseType?: 'binary';
	timeoutMs?: number;
	/** Another host the call goes to (a sandbox's toolbox, the analytics API). */
	base?: string;
};

function configFor(options: DaytonaRequest, key: string, base: string) {
	return {
		BASE: options.base ?? base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeDaytonaPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(options.timeoutMs ?? DAYTONA_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
		} as Record<string, string>,
	} satisfies OpenAPIConfig;
}

/**
 * Daytona answers a 429 when a tier's rate limit (general, sandbox creation
 * or lifecycle requests per minute) is hit, with `Retry-After` in seconds
 * (and `X-RateLimit-*` headers), which core reads and retries three times.
 */
export const DAYTONA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

function mediaTypeFor(request: DaytonaRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		// fetch writes the multipart boundary itself.
		return undefined;
	}
	if (typeof Blob !== 'undefined' && body instanceof Blob) {
		return 'application/octet-stream';
	}
	return 'application/json';
}

/**
 * Sends one Daytona call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeDaytonaRequest(
	ctx: DaytonaCallContext,
	options: DaytonaRequest,
): Promise<unknown> {
	if (!ctx.key) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('daytona', 'api_key');
	}
	// Core's ApiError keeps a redacted copy of the request, so values sent in
	// the query and path are gathered here, before the call, to scrub them
	// from an error body that echoes one back.
	const secrets = [ctx.key, ...sentValues(options)];
	const headers = { ...options.headers };
	const organization = ctx.options?.organizationId;
	if (organization && headers['X-Daytona-Organization-ID'] === undefined) {
		headers['X-Daytona-Organization-ID'] = organization;
	}
	const config = configFor(options, ctx.key, apiBaseOf(ctx));
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: { ...options.pathParameters },
		query: options.query,
		headers,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DAYTONA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, secrets);
		}
		throw error;
	}
}

/** String query and path values of a request, for scrubbing an error that echoes one. */
function sentValues(options: DaytonaRequest): string[] {
	const values: string[] = [];
	for (const record of [options.query, options.pathParameters]) {
		for (const value of Object.values(record ?? {})) {
			if (typeof value === 'string' && value.length >= 6) values.push(value);
		}
	}
	return values;
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. An Daytona body can hold
 * commands, file contents, environment values and secrets, so the error is
 * rebuilt without it (and without request headers, which carry the key),
 * keeping the status and rate-limit fields the error handlers and core's
 * retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Daytona's reason. The message is rebuilt from Daytona's error body.
 */
export function withoutRequestData(
	error: ApiError,
	secrets: readonly string[] = [],
): ApiError {
	// The key travels in the transport config, not on error.request: add
	// it, so a body that echoes it loses it too.
	const sent = [
		...secrets.map((text) => ({ text, wholeWord: false })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = daytonaErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are ids, names, paths and search terms: keep the keys only.
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
 * Daytona's error bodies: the API (NestJS) answers `{ "statusCode": 404,
 * "message": "Sandbox not found", "error": "Not Found" }`, where `message`
 * can be a list of validation messages; the toolbox answers `{ "message":
 * "...", "code": "..." }` or `{ "error": "..." }`.
 */
export function daytonaErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Daytona sent.
	body: unknown,
): string {
	const fields = asFields(body);
	let reason: string | undefined;
	const code = typeof fields.code === 'string' ? fields.code : undefined;
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		reason = fields.message;
	} else if (Array.isArray(fields.message)) {
		reason = fields.message
			.filter((item): item is string => typeof item === 'string')
			.slice(0, 5)
			.join('; ');
	} else if (typeof fields.error === 'string' && fields.error.length > 0) {
		reason = fields.error;
	} else if (typeof body === 'string' && body.trim().length > 0) {
		// An HTML error page says nothing useful; keep only short plain text.
		const text = body.trim();
		if (!text.startsWith('<')) reason = text;
	}
	const prefix = code && reason && !reason.includes(code) ? `${code}: ` : '';
	const text = `Daytona ${status}: ${prefix}${reason || code || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

// `unknown` because an error body is whatever JSON Daytona sent.
function asFields(body: unknown): Record<string, unknown> {
	return typeof body === 'object' && body !== null && !Array.isArray(body)
		? // `unknown` because each field is narrowed where it's read.
			(body as Record<string, unknown>)
		: {};
}

/** Strings shorter than this are matched as whole words only... */
const WHOLE_WORD_BELOW = 6;
/**
 * ...and one-character strings are left alone, unless they sit under a key
 * like these (a password, a token, a code, a phone number), where every
 * length counts.
 */
const SECRET_KEY =
	/pass|secret|token|credential|key$|otp|code$|phone|number|email|address|value|content|message|context/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values, path values), longest
 * first, so a Daytona message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a name like "Ada", a file path), so
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
	// An id or name in the path, at any length:
	// a 404 can quote it back.
	visit(request.path, 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Daytona sent.
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
 * `https://app.daytona.io/api/sandbox/s_1?verbose=true` →
 * `https://app.daytona.io/api/sandbox/{sandboxIdOrName}?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	// The host the call went to, without the sandbox segment of a toolbox URL.
	let origin = DAYTONA_API_BASE;
	try {
		const parsed = new URL(url);
		origin = parsed.pathname.startsWith('/api/')
			? `${parsed.origin}/api`
			: parsed.origin;
	} catch {
		// Keep the cloud API host.
	}
	return `${origin}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/files/list?path=…` → `https://…/files/list?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Daytona sent.
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
