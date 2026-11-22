import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Amika's hosted REST API. Every route takes `Authorization: Bearer <api key>`
 * (a user- or organization-scoped key from app.amika.dev → Settings → API Keys,
 * or `amika auth api-key create`). Without the header the API answers a 307
 * to its sign-in page, so a request never goes out keyless.
 * Reference: https://docs.amika.dev/reference/http-api-overview and
 * https://app.amika.dev/api/v0beta1/openapi.json.
 */
export const AMIKA_API_BASE = 'https://app.amika.dev/api/v0beta1';

export const AMIKA_DEFAULT_TIMEOUT_MS = 30_000;

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts). No dedicated error class exists
// for this state, so the message is the only handle; kept narrow so it can't
// swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads the stored API key. `ctx.keys.get_api_key()` throws, rather than
 * returning null, when the account has no DEK at all: a valid state for an
 * account that passes the key in plugin options. Anything else thrown is a
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

// ── Transport ───────────────────────────────────────────────────────────────

/**
 * Path values are rig, job and snapshot ids or names. Core's default encodeURI
 * keeps `/` and `..`, so `../api-keys/x` would reach a different route than
 * the one whose permission was checked.
 */
export function encodeAmikaPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Amika path value');
	}
	return encodeURIComponent(value);
}

export type AmikaHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AmikaRequest = {
	/** The Amika API key. */
	key: string;
	method: AmikaHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: unknown;
	timeoutMs?: number;
};

function configFor(key: string, timeoutMs: number | undefined) {
	return {
		BASE: AMIKA_API_BASE,
		VERSION: '0.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeAmikaPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? AMIKA_DEFAULT_TIMEOUT_MS),
		HEADERS: { Authorization: `Bearer ${key}` },
	} satisfies OpenAPIConfig;
}

/**
 * Sends one Amika call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
// `unknown` because the response is untrusted JSON until the operation's output schema parses it.
export async function makeAmikaRequest(
	options: AmikaRequest,
): Promise<unknown> {
	if (options.key.length === 0) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('amika', 'api_key');
	}
	const config = configFor(options.key, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType:
			options.body === undefined
				? undefined
				: 'application/json; charset=utf-8',
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
 * Core keeps the sent body on `ApiError.request`. An Amika body can hold secret
 * values, Claude and Codex tokens, cloud account API keys, env vars and shell
 * commands, so the error is rebuilt without it (and without request headers,
 * which carry the API key), keeping the status and rate-limit fields the
 * error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Amika's reason. The message is rebuilt from Amika's error body
 * (`{ type, error_code, message, trace_id }`, or `{ error }` for a bad key).
 */
export function withoutRequestData(error: ApiError): ApiError {
	const sent = sentStrings(error.request);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = amikaErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Query values can be rig and job names: keep the keys only.
			query: redactedValues(error.request.query),
		},
		{
			url: withoutQuery(error.url),
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

// `unknown` because an error body is whatever JSON (or text) Amika sent.
export function amikaErrorMessage(
	status: number,
	statusText: string,
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? (body as {
					message?: unknown;
					error?: unknown;
					error_code?: unknown;
					trace_id?: unknown;
				})
			: {};
	const reason =
		typeof fields.message === 'string' && fields.message.length > 0
			? fields.message
			: typeof fields.error === 'string' && fields.error.length > 0
				? fields.error
				: typeof body === 'string' && body.trim().length > 0
					? body.trim()
					: statusText || 'request failed';
	const code =
		typeof fields.error_code === 'string' && fields.error_code.length > 0
			? ` ${fields.error_code}`
			: '';
	// The trace id is what Amika support asks for; it holds no request data.
	const trace =
		typeof fields.trace_id === 'string' && fields.trace_id.length > 0
			? ` (trace ${fields.trace_id})`
			: '';
	const text = `Amika ${status}${code}: ${reason}${trace}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Shorter strings are ids, enum values and flags, not secrets worth hiding... */
const MIN_SCRUBBED_LENGTH = 6;
/** ...unless they sit under a key like these (a secret value, a cloud account key). */
const SECRET_KEY = /pass|secret|token|credential|key$|value$/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, query values), longest first, so an
 * Amika message that quotes one back loses it while keeping its reason.
 * Values under a secret-looking key count at any length and are matched as
 * whole words, so a short one can't take out digits elsewhere in the text.
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
		if (Array.isArray(value)) {
			for (const item of value) visit(item, depth + 1, secret);
			return;
		}
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
			}
		}
	};
	visit(request.body, 0, false);
	visit(request.query, 0, false);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Amika sent.
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

// `unknown` because query values are scalars.
function redactedValues(
	query: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (query === undefined) return undefined;
	return Object.fromEntries(Object.keys(query).map((key) => [key, REDACTED]));
}

/** `https://…/command-runs?rig=my-rig` → `https://…/command-runs?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

const ECHO_KEYS = new Set(['value', 'values', 'input', 'received']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Amika sent.
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
