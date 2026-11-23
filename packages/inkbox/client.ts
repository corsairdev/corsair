import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Inkbox's REST API. Every route takes `X-API-Key: <api key>`: an
 * organization admin key, or a key scoped to one agent identity, from
 * inkbox.ai/console → API keys (or apiKeys.create with an admin key).
 * Reference: https://inkbox.ai/docs/api and https://inkbox.ai/api/openapi.json.
 * Routes carry their own `/api/v1` prefix (whoami is `/api/whoami`).
 */
export const INKBOX_API_BASE = 'https://inkbox.ai';

export const INKBOX_DEFAULT_TIMEOUT_MS = 30_000;

/** Largest file the plugin uploads (an avatar, iMessage or WhatsApp media, opt-in evidence). */
export const INKBOX_UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored key. `ctx.keys.get_api_key()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else thrown is a real failure and
 * propagates.
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

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are handles, email addresses, phone numbers and ids. Core's
 * default encodeURI keeps `/` and `..`, so `../api-keys/self` would reach a
 * different route than the one whose permission was checked.
 */
export function encodeInkboxPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Inkbox path value');
	}
	return encodeURIComponent(value);
}

export type InkboxHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type InkboxRequest = {
	/** The Inkbox API key. */
	key: string;
	method: InkboxHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars or lists, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object, multipart form, or raw text (`mediaType`); validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData | string;
	/** The Content-Type of a raw text body. */
	mediaType?: string;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(key: string, timeoutMs: number | undefined) {
	return {
		BASE: INKBOX_API_BASE,
		VERSION: '0.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeInkboxPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? INKBOX_DEFAULT_TIMEOUT_MS),
		HEADERS: { 'X-API-Key': key },
	} satisfies OpenAPIConfig;
}

function mediaTypeFor(request: InkboxRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof body === 'string')
		return request.mediaType ?? 'text/plain; charset=utf-8';
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		// fetch writes the multipart boundary itself.
		return undefined;
	}
	return 'application/json; charset=utf-8';
}

/**
 * Sends one Inkbox call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeInkboxRequest(
	options: InkboxRequest,
): Promise<unknown> {
	if (options.key.length === 0) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('inkbox', 'api_key');
	}
	const config = configFor(options.key, options.timeoutMs);
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
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}
}

// ── Errors ──────────────────────────────────────────────────────────────────

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request`. An Inkbox body can hold
 * email and text content, phone numbers, contact details, vault ciphertext and
 * uploaded files, so the error is rebuilt without it (and without request
 * headers, which carry the API key), keeping the status and rate-limit fields
 * the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Inkbox's reason. The message is rebuilt from Inkbox's error body
 * (`{ detail }`, where `detail` is a string or FastAPI's list of
 * `{ loc, msg }` validation issues).
 */
export function withoutRequestData(error: ApiError): ApiError {
	const sent = sentStrings(error.request);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = inkboxErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are handles, email addresses and phone numbers: keep the keys only.
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

// `unknown` because an error detail item has no fixed shape.
function issueText(item: unknown): string | undefined {
	if (typeof item === 'string') return item;
	if (typeof item !== 'object' || item === null) return undefined;
	const record = item as { loc?: unknown; msg?: unknown; message?: unknown };
	const text =
		typeof record.msg === 'string'
			? record.msg
			: typeof record.message === 'string'
				? record.message
				: undefined;
	if (!text) return undefined;
	const where = Array.isArray(record.loc)
		? record.loc
				.filter(
					(part): part is string | number =>
						typeof part === 'string' || typeof part === 'number',
				)
				// `body`, `query`, `path`: where FastAPI found it, not the field.
				.filter(
					(part, index) =>
						index > 0 ||
						typeof part !== 'string' ||
						!['body', 'query', 'path', 'header'].includes(part),
				)
				.join('.')
		: '';
	return where ? `${where}: ${text}` : text;
}

// `unknown` because an error body is whatever JSON (or text) Inkbox sent.
export function inkboxErrorMessage(
	status: number,
	statusText: string,
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? (body as { detail?: unknown; message?: unknown; error?: unknown })
			: {};
	let reason: string | undefined;
	if (typeof fields.detail === 'string' && fields.detail.length > 0) {
		reason = fields.detail;
	} else if (Array.isArray(fields.detail)) {
		reason = fields.detail
			.map(issueText)
			.filter((text): text is string => Boolean(text))
			.slice(0, 5)
			.join('; ');
	} else if (
		typeof fields.detail === 'object' &&
		fields.detail !== null &&
		!Array.isArray(fields.detail)
	) {
		reason = issueText(fields.detail);
	}
	if (!reason && typeof fields.message === 'string') reason = fields.message;
	if (!reason && typeof fields.error === 'string') reason = fields.error;
	if (!reason && typeof body === 'string' && body.trim().length > 0) {
		reason = body.trim();
	}
	const text = `Inkbox ${status}: ${reason || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Shorter strings are ids, enum values and flags, not secrets worth hiding... */
const MIN_SCRUBBED_LENGTH = 6;
/** ...unless they sit under a key like these (a password, a token, a phone number). */
const SECRET_KEY =
	/pass|secret|token|credential|key$|otp|code$|phone|number|email|address|to$|from$/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values, path values), longest
 * first, so an Inkbox message that quotes one back loses it while keeping its
 * reason. Values under a secret-looking key count at any length and are
 * matched as whole words, so a short one can't take out digits elsewhere.
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
	// A handle, an email address or a phone number in the path, at any length:
	// Inkbox's 404 can quote it back.
	visit(request.path, 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Inkbox sent.
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
 * `https://inkbox.ai/api/v1/mail/mailboxes/agent%40…/messages?limit=5` →
 * `https://inkbox.ai/api/v1/mail/mailboxes/{email_address}/messages?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${INKBOX_API_BASE}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts/lookup?email=…` → `https://…/contacts/lookup?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/**
 * Fields an error body uses to echo back what was sent (FastAPI's validation
 * issues carry `input` and `ctx`), plus Inkbox's long `agent_support` note,
 * which says nothing about this call.
 */
const ECHO_KEYS = new Set([
	'value',
	'values',
	'input',
	'received',
	'ctx',
	'agent_support',
]);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Inkbox sent.
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
