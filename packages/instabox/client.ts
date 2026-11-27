import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * InstaBox's REST API (https://instabox.sh/docs/api.md, OpenAPI spec at
 * https://instabox.sh/openapi.json). Every route takes an API key (`ibk_...`)
 * as `Authorization: Bearer`. A key's scopes (machines:read, machines:write,
 * ...) decide which operations work; member, invite and workspace-secret
 * changes need a workspace key with workspace:admin. Routes that refuse every
 * API key (billing, key management, Vault, sessions, support) are left out.
 */
export const INSTABOX_API_BASE = 'https://api.instabox.sh';

export const INSTABOX_DEFAULT_TIMEOUT_MS = 60_000;

/** Largest file the write route sends. */
export const INSTABOX_UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

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
export type InstaboxCallContext = {
	key: string;
};

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are ids and names. Core's default encodeURI keeps `/`
 * and `..`, so a value like `../users` would reach a different route than the
 * one whose permission was checked.
 */
export function encodeInstaboxPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid InstaBox path value');
	}
	return encodeURIComponent(value);
}

export type InstaboxHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type InstaboxRequest = {
	method: InstaboxHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, lists or maps, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object, multipart form, or raw bytes (a file write); validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData | Blob;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a file, a screenshot). */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(options: InstaboxRequest, key: string) {
	return {
		BASE: INSTABOX_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeInstaboxPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(options.timeoutMs ?? INSTABOX_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
		} as Record<string, string>,
	} satisfies OpenAPIConfig;
}

/**
 * InstaBox answers a 429 for two things. `rate_limited` is a short burst
 * limit and carries `Retry-After` in seconds, which core reads and retries
 * three times, except when its `reason` is a daily or hourly create/start
 * quota (`creates_per_day`, `starts_per_day`, `starts_per_hour`), which
 * resets far later. `quota_exceeded` is a plan limit (sandboxes, snapshots,
 * stored data): waiting doesn't help, so it is retried only when InstaBox
 * marks it `retryable` (a concurrency limit).
 */
export const INSTABOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
	// `unknown` because the error body is untrusted JSON.
	isRateLimitError: (status: number, body: unknown) =>
		status === 429 && isRetryable429(body),
};

/** Quotas that reset hours away: retrying after `Retry-After` can't help. */
const LONG_QUOTA_REASONS = new Set([
	'creates_per_day',
	'starts_per_day',
	'starts_per_hour',
]);

// `unknown` because the error body is untrusted JSON.
export function isRetryable429(body: unknown): boolean {
	const error = asFields(asFields(body).error);
	if (
		typeof error.reason === 'string' &&
		LONG_QUOTA_REASONS.has(error.reason)
	) {
		return false;
	}
	if (errorCodeOf(body) === 'quota_exceeded') return error.retryable === true;
	return true;
}

/** The `error.code` of an InstaBox error body, if it has one. */
// `unknown` because the error body is untrusted JSON.
export function errorCodeOf(body: unknown): string | undefined {
	const error = asFields(body).error;
	const code = asFields(error).code;
	return typeof code === 'string' ? code : undefined;
}

function mediaTypeFor(request: InstaboxRequest): string | undefined {
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
 * Sends one InstaBox call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeInstaboxRequest(
	ctx: InstaboxCallContext,
	options: InstaboxRequest,
): Promise<unknown> {
	if (!ctx.key) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('instabox', 'api_key');
	}
	// Core's ApiError keeps a redacted copy of the request, so values sent in
	// the query and path are gathered here, before the call, to scrub them
	// from an error body that echoes one back.
	const secrets = [ctx.key, ...sentValues(options)];
	const config = configFor(options, ctx.key);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: { ...options.pathParameters },
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: INSTABOX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, secrets);
		}
		throw error;
	}
}

/**
 * Strings this call sends (query and path values, and every string in a JSON
 * body), for scrubbing an error that echoes one. Core's ApiError keeps only a
 * redacted copy of the request, so they are gathered from the request itself.
 */
function sentValues(options: InstaboxRequest): string[] {
	const values: string[] = [];
	// `unknown` because query, path and body values are any validated JSON.
	const visit = (value: unknown, depth: number) => {
		if (depth > 8 || value === null || value === undefined) return;
		if (typeof value === 'string') {
			if (value.length >= 4) values.push(value);
			return;
		}
		if (typeof Blob !== 'undefined' && value instanceof Blob) return;
		if (typeof FormData !== 'undefined' && value instanceof FormData) return;
		if (Array.isArray(value)) {
			for (const item of value) visit(item, depth + 1);
			return;
		}
		if (typeof value === 'object') {
			for (const inner of Object.values(value)) visit(inner, depth + 1);
		}
	};
	visit(options.query, 0);
	visit(options.pathParameters, 0);
	visit(options.body, 0);
	return values;
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. An InstaBox body can hold
 * commands, file contents, environment values and secrets, so the error is
 * rebuilt without it (and without request headers, which carry the key),
 * keeping the status and rate-limit fields the error handlers and core's
 * retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Instabox's reason. The message is rebuilt from Instabox's error body.
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
	const message = instaboxErrorMessage(error.status, error.statusText, body);
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
 * InstaBox's error body (spec component `ErrorBody`): `{ "error": { "code":
 * "quota_exceeded", "message": "sandbox limit reached ...", "hint": "...",
 * "retryable": true } }`. OAuth-style bodies (`{ error, error_description }`)
 * are read too.
 */
export function instaboxErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) InstaBox sent.
	body: unknown,
): string {
	const fields = asFields(body);
	const error = asFields(fields.error);
	let code = typeof error.code === 'string' ? error.code : undefined;
	let reason: string | undefined;
	if (typeof error.message === 'string' && error.message.length > 0) {
		reason = error.message;
		if (typeof error.hint === 'string' && error.hint.length > 0) {
			reason += ` ${error.hint}`;
		}
	} else if (typeof fields.error === 'string') {
		code = fields.error;
		if (typeof fields.error_description === 'string') {
			reason = fields.error_description;
		}
	} else if (typeof fields.message === 'string' && fields.message.length > 0) {
		reason = fields.message;
	} else if (typeof body === 'string' && body.trim().length > 0) {
		// An HTML error page says nothing useful; keep only short plain text.
		const text = body.trim();
		if (!text.startsWith('<')) reason = text;
	}
	const prefix = code && reason && !reason.includes(code) ? `${code}: ` : '';
	const text = `InstaBox ${status}: ${prefix}${reason || code || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

// `unknown` because an error body is whatever JSON InstaBox sent.
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
 * first, so a InstaBox message that quotes one back loses it while keeping its
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
// `unknown` because an error body is whatever JSON (or text) InstaBox sent.
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
			// A sent value used as a key (a details map) is scrubbed too.
			const safeKey = scrubSent(key, sent, depth + 1);
			result[typeof safeKey === 'string' ? safeKey : REDACTED] = scrubSent(
				inner,
				sent,
				depth + 1,
			);
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
 * `https://api.instabox.sh/v1/machines/m_1/files?path=/data` →
 * `https://api.instabox.sh/v1/machines/{id}/files?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${INSTABOX_API_BASE}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/files/list?path=…` → `https://…/files/list?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) InstaBox sent.
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
