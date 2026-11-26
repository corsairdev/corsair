import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Moneybird's REST API v2 (https://developer.moneybird.com, OpenAPI spec at
 * https://github.com/moneybird/openapi). Every route except
 * `GET /administrations` sits under one administration,
 * `https://moneybird.com/api/v2/{administration_id}/...`, and takes
 * `Authorization: Bearer <token>`: a personal API token or an OAuth access
 * token.
 */
export const MONEYBIRD_API_BASE = 'https://moneybird.com/api/v2';

export const MONEYBIRD_DEFAULT_TIMEOUT_MS = 30_000;

/**
 * The page size the plugin asks for when a paged list's `per_page` is left
 * out. Moneybird's own default differs per route (50 in the introduction, 30
 * for task lists), so the plugin always sends one: `next_page` is only exact
 * when it knows the size it asked for. 100 is Moneybird's maximum and what
 * its docs recommend.
 */
export const MONEYBIRD_PAGE_SIZE = 100;

/** Largest file the attachment and upload routes send. */
export const MONEYBIRD_UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key and administration id in plugin options. Anything else
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

// ── Administration ──────────────────────────────────────────────────────────

/** What a call needs from the endpoint context. */
export type MoneybirdCallContext = {
	key: string;
	options: { administrationId?: string };
	keys: {
		get_administration_id?: () => Promise<string | null | undefined>;
	};
};

const ADMINISTRATION_ID = /^\d+$/;

/**
 * The administration a call acts on: the call's own `administration_id`, else
 * the plugin option, else the one saved on the connected account. Moneybird
 * ids are digit strings, so a value can only ever name one path segment.
 */
export async function resolveAdministrationId(
	ctx: MoneybirdCallContext,
	fromInput?: string,
): Promise<string> {
	const value = (
		fromInput ??
		ctx.options.administrationId ??
		(ctx.keys.get_administration_id
			? await tryGetStoredKey(ctx.keys.get_administration_id)
			: undefined) ??
		''
	).trim();
	if (value.length === 0) {
		throw new Error(
			'Moneybird administration id is required: pass administration_id, set administrationId in the plugin options, or save administration_id on the account (administrations.list shows the ids the token can reach).',
		);
	}
	if (!ADMINISTRATION_ID.test(value)) {
		throw new Error('Moneybird administration id must be a digit string.');
	}
	return value;
}

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are ids and record types. Core's default encodeURI keeps `/`
 * and `..`, so a value like `../users` would reach a different route than the
 * one whose permission was checked.
 */
export function encodeMoneybirdPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Moneybird path value');
	}
	return encodeURIComponent(value);
}

export type MoneybirdHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type MoneybirdRequest = {
	method: MoneybirdHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, lists or maps, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object or multipart form; validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a PDF, UBL or attachment). */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(key: string, timeoutMs?: number) {
	return {
		BASE: MONEYBIRD_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeMoneybirdPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? MONEYBIRD_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
		},
	} satisfies OpenAPIConfig;
}

/**
 * Moneybird's spec documents the 429's `Retry-After` as "the time at which
 * the current rate limit window resets in UTC epoch seconds", while core reads
 * `Retry-After` as a number of seconds to wait (an epoch would be a wait of
 * decades). Read it as a reset time instead: core waits until an epoch that
 * lies ahead, and a value that turns out to be a short delay (in the past as
 * an epoch) falls back to core's backoff of 1, 2 and 4 seconds. Core still
 * makes the three retries.
 */
export const MONEYBIRD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		resetTime: 'retry-after',
		remaining: 'ratelimit-requestsremaining',
		limit: 'ratelimit-limit',
	},
};

function mediaTypeFor(request: MoneybirdRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		// fetch writes the multipart boundary itself.
		return undefined;
	}
	return 'application/json';
}

/**
 * Sends one Moneybird call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeMoneybirdRequest(
	ctx: MoneybirdCallContext,
	options: MoneybirdRequest,
): Promise<unknown> {
	if (!ctx.key) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('moneybird', 'api_key');
	}
	const pathParameters = { ...options.pathParameters };
	if (options.path.includes('{administration_id}')) {
		pathParameters.administration_id = await resolveAdministrationId(
			ctx,
			pathParameters.administration_id,
		);
	}
	const config = configFor(ctx.key, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: MONEYBIRD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, ctx.key);
		}
		throw error;
	}
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Moneybird body can hold
 * customer, contact and bank details (an IBAN, an address, invoice lines)
 * and uploaded documents, so the error is rebuilt without it (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Moneybird's reason. The message is rebuilt from Moneybird's error body.
 */
export function withoutRequestData(error: ApiError, key?: string): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = moneybirdErrorMessage(error.status, error.statusText, body);
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
 * Moneybird's error bodies (spec components `symbolic_error` and
 * `non_symbolic_error`): `{ "error": "Contact is required", "symbolic":
 * {...} }` for 400/401/402/403/404, and for a 422 `{ "error": { field:
 * [messages] }, "details": {...} }`. A 429 answers a bare string ("Retry
 * later").
 */
export function moneybirdErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Moneybird sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	let reason: string | undefined;
	if (typeof fields.error === 'string' && fields.error.length > 0) {
		reason = fields.error;
	} else if (typeof fields.error === 'object' && fields.error !== null) {
		reason = Array.isArray(fields.error)
			? fields.error
					.map(listedError)
					.filter((item): item is string => item !== undefined)
					.slice(0, 5)
					.join('; ')
			: // `unknown` because the field map's values are narrowed in fieldErrors.
				fieldErrors(fields.error as Record<string, unknown>);
	} else if (typeof fields.message === 'string' && fields.message.length > 0) {
		reason = fields.message;
	} else if (typeof fields.errors === 'object' && fields.errors !== null) {
		// `unknown` because the field map's values are narrowed in fieldErrors.
		reason = fieldErrors(fields.errors as Record<string, unknown>);
	} else if (typeof body === 'string' && body.trim().length > 0) {
		// An HTML error page says nothing useful; keep only short plain text.
		const text = body.trim();
		if (!text.startsWith('<')) reason = text;
	}
	const text = `Moneybird ${status}: ${reason || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** One entry of an `errors` list: a message, or `{ error_message, field_name }`. */
// `unknown` because a list entry is whatever JSON Moneybird sent.
function listedError(item: unknown): string | undefined {
	if (typeof item === 'string') return item;
	if (typeof item !== 'object' || item === null) return undefined;
	// `unknown` because the entry's fields are narrowed below.
	const entry = item as { error_message?: unknown; field_name?: unknown };
	if (typeof entry.error_message !== 'string') return undefined;
	return typeof entry.field_name === 'string' && entry.field_name !== 'base'
		? `${entry.field_name}: ${entry.error_message}`
		: entry.error_message;
}

/** `{ field: [messages] }` as `field: a, b; other: c`; only string messages count. */
// `unknown` because the field map's values are whatever JSON Moneybird sent.
function fieldErrors(map: Record<string, unknown>): string | undefined {
	const parts = Object.entries(map)
		.map(([field, messages]) => {
			const list = Array.isArray(messages)
				? messages.filter((item) => typeof item === 'string').join(', ')
				: typeof messages === 'string'
					? messages
					: '';
			return list ? `${field}: ${list}` : undefined;
		})
		.filter((part): part is string => part !== undefined)
		.slice(0, 5);
	return parts.length > 0 ? parts.join('; ') : undefined;
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
 * first, so an Moneybird message that quotes one back loses it while keeping its
 * reason. Any of them can be customer data (a name like "Ada", a subject), so
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
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Moneybird sent.
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
 * `https://moneybird.com/api/v2/123/contacts/456.json?page=2` →
 * `https://moneybird.com/api/v2/{administration_id}/contacts/{id}.json?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${MONEYBIRD_API_BASE}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Moneybird sent.
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
