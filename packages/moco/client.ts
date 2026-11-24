import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * MOCO's REST API (https://docs.mocoapp.com/api/docs/v1). Every account has
 * its own host, `https://{subdomain}.mocoapp.com/api/v1`, and every route takes
 * `Authorization: Token token=<key>`: a user API key (profile > Integrations)
 * or an account API key (Settings > Extensions > API & Webhooks).
 */
export const MOCO_DEFAULT_TIMEOUT_MS = 30_000;

/** MOCO's page size when `per_page` is left out (it allows 1 to 100). */
export const MOCO_DEFAULT_PAGE_SIZE = 100;

/** Largest document purchases.storeDocument uploads. */
export const MOCO_UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key and subdomain in plugin options. Anything else thrown is a
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

// ── Account host ────────────────────────────────────────────────────────────

/** What a call needs from the endpoint context. */
export type MocoCallContext = {
	key: string;
	options: { subdomain?: string };
	keys: { get_subdomain?: () => Promise<string | null | undefined> };
};

const SUBDOMAIN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * The account's subdomain (`acme` for acme.mocoapp.com), from the plugin
 * options or the connected account. It must be one DNS label, so the host can
 * only ever be a mocoapp.com subdomain.
 */
export async function resolveSubdomain(ctx: MocoCallContext): Promise<string> {
	const stored =
		ctx.options.subdomain ??
		(ctx.keys.get_subdomain
			? await tryGetStoredKey(ctx.keys.get_subdomain)
			: undefined);
	const value = (stored ?? '').trim().toLowerCase();
	if (value.length === 0) {
		throw new Error(
			'MOCO subdomain is required: pass subdomain in the plugin options or save it on the account (acme for acme.mocoapp.com).',
		);
	}
	if (!SUBDOMAIN.test(value)) {
		throw new Error(
			'MOCO subdomain must be one DNS label (letters, digits and hyphens), like acme for acme.mocoapp.com.',
		);
	}
	return value;
}

export function mocoBase(subdomain: string): string {
	return `https://${subdomain}.mocoapp.com/api/v1`;
}

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are ids and record types. Core's default encodeURI keeps `/`
 * and `..`, so a value like `../users` would reach a different route than the
 * one whose permission was checked.
 */
export function encodeMocoPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid MOCO path value');
	}
	return encodeURIComponent(value);
}

export type MocoHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type MocoRequest = {
	method: MocoHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, lists or maps, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object or multipart form; validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a PDF). */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(subdomain: string, key: string, timeoutMs?: number) {
	return {
		BASE: mocoBase(subdomain),
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeMocoPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? MOCO_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token token=${key}`,
		},
	} satisfies OpenAPIConfig;
}

function mediaTypeFor(request: MocoRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		// fetch writes the multipart boundary itself.
		return undefined;
	}
	return 'application/json';
}

/**
 * Sends one MOCO call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeMocoRequest(
	ctx: MocoCallContext,
	options: MocoRequest,
): Promise<unknown> {
	if (!ctx.key) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('moco', 'api_key');
	}
	const subdomain = await resolveSubdomain(ctx);
	const config = configFor(subdomain, ctx.key, options.timeoutMs);
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
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, subdomain, ctx.key);
		}
		throw error;
	}
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request`. A MOCO body can hold
 * customer, contact, payroll and bank details (an IBAN, a salary, an address)
 * and uploaded documents, so the error is rebuilt without it (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides MOCO's reason. The message is rebuilt from MOCO's error body.
 */
export function withoutRequestData(
	error: ApiError,
	subdomain: string,
	key?: string,
): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = mocoErrorMessage(error.status, error.statusText, body);
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
			url: routeUrl(error.url, error.request.url, subdomain),
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
 * MOCO's error bodies: `{ "message": "..." }` for 401/403/404 and most
 * refusals, `{ "errors": { field: [messages] } }` or `{ "errors": [messages] }`
 * for a 422 (common.json's MessageError and ErrorList).
 */
export function mocoErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) MOCO sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as { message?: unknown; errors?: unknown; error?: unknown })
			: {};
	let reason: string | undefined;
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		reason = fields.message;
	} else if (Array.isArray(fields.errors)) {
		reason = fields.errors
			.filter((item): item is string => typeof item === 'string')
			.slice(0, 5)
			.join('; ');
	} else if (typeof fields.errors === 'object' && fields.errors !== null) {
		reason = Object.entries(fields.errors)
			.slice(0, 5)
			.map(([field, messages]) => {
				const list = Array.isArray(messages)
					? messages.filter((item) => typeof item === 'string').join(', ')
					: typeof messages === 'string'
						? messages
						: '';
				return list ? `${field}: ${list}` : field;
			})
			.join('; ');
	} else if (typeof fields.error === 'string') {
		reason = fields.error;
	} else if (typeof body === 'string' && body.trim().length > 0) {
		// An HTML error page says nothing useful; keep only short plain text.
		const text = body.trim();
		if (!text.startsWith('<')) reason = text;
	}
	const text = `MOCO ${status}: ${reason || statusText || 'request failed'}`;
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
 * first, so an MOCO message that quotes one back loses it while keeping its
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
// `unknown` because an error body is whatever JSON (or text) MOCO sent.
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
 * `https://acme.mocoapp.com/api/v1/projects/123/tasks?page=2` →
 * `https://acme.mocoapp.com/api/v1/projects/{project_id}/tasks?[REDACTED]`.
 */
export function routeUrl(
	url: string,
	route: string | undefined,
	subdomain: string,
): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${mocoBase(subdomain)}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts/lookup?email=…` → `https://…/contacts/lookup?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) MOCO sent.
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
