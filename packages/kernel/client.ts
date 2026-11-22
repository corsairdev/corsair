import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	BinaryResponse,
	OpenAPIConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Kernel's REST API. Every route takes `Authorization: Bearer <key>`.
 * Reference: https://www.kernel.sh/docs/api-reference and
 * https://api.onkernel.com/openapi.json.
 */
export const KERNEL_API_BASE = 'https://api.onkernel.com';

/** Core's own default; most Kernel calls answer in well under a second. */
export const KERNEL_DEFAULT_TIMEOUT_MS = 30_000;

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

/**
 * Path values are ids and names (`id_or_name`, a vault item `key`). Core's
 * default encodeURI keeps `/` and `..`, so `../profiles/x` would reach a
 * different route than the one whose permission was checked.
 */
export function encodeKernelPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Kernel path value');
	}
	return encodeURIComponent(value);
}

export type KernelHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type KernelRequest = {
	apiKey: string;
	method: KernelHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because each operation's query values are scalars, arrays or a tags map, validated before transport.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** JSON object, multipart form, or raw bytes; validated before transport. */
	// `unknown` because the JSON body differs per operation and was validated by its input schema.
	body?: Record<string, unknown> | FormData | Blob;
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(apiKey: string, timeoutMs: number | undefined) {
	if (apiKey.length === 0) {
		// keyBuilder already throws this before an empty key gets here; checked
		// again so a keyless request never goes out.
		throw new AuthMissingError('kernel', 'api_key');
	}
	return {
		BASE: KERNEL_API_BASE,
		VERSION: '0.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeKernelPathValue,
		// AbortSignal.timeout rejects a fractional delay.
		TIMEOUT: Math.ceil(timeoutMs ?? KERNEL_DEFAULT_TIMEOUT_MS),
		HEADERS: { Authorization: `Bearer ${apiKey}` },
	} satisfies OpenAPIConfig;
}

function mediaTypeFor(body: KernelRequest['body']): string | undefined {
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		// fetch writes the multipart boundary itself.
		return undefined;
	}
	if (typeof Blob !== 'undefined' && body instanceof Blob) {
		return 'application/octet-stream';
	}
	return 'application/json; charset=utf-8';
}

/**
 * Sends one Kernel call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status. With
 * `responseType: 'binary'` a success comes back as `{ bytes, contentType }`.
 */
// `unknown` because the response is untrusted JSON (or bytes) until the operation's output schema parses it.
export async function makeKernelRequest(
	options: KernelRequest,
): Promise<unknown> {
	const config = configFor(options.apiKey, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options.body),
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

export type KernelPagedResponse = {
	// `unknown` because the page body is validated by the operation's output schema.
	body: unknown;
	headers: Headers;
};

const MAX_RATE_LIMIT_RETRIES = 3;

/**
 * GET for the list routes that page through response headers (X-Has-More,
 * X-Next-Offset, X-Next-Page-Token, X-Next-Cursor). Core's `request()` returns
 * the body only, so this sends the call with `fetch` and keeps the headers. It
 * mirrors core's behaviour: the same URL building, a 429 retried three times
 * honouring Retry-After, and an `ApiError` carrying the status otherwise.
 */
export async function makeKernelPagedRequest(
	options: KernelRequest,
): Promise<KernelPagedResponse> {
	const config = configFor(options.apiKey, options.timeoutMs);
	const url = buildUrl(options);
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: options.path,
		path: options.pathParameters,
		query: options.query,
	};
	for (let attempt = 1; ; attempt++) {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...config.HEADERS,
				Accept: options.responseType === 'binary' ? '*/*' : 'application/json',
				...options.headers,
			},
			credentials: 'omit',
			signal: AbortSignal.timeout(config.TIMEOUT),
		});
		const retryAfter = retryAfterMs(response.headers.get('retry-after'));
		if (response.status === 429 && attempt <= MAX_RATE_LIMIT_RETRIES) {
			await response.body?.cancel().catch(() => undefined);
			await new Promise((done) =>
				setTimeout(
					done,
					retryAfter ?? Math.min(1000 * 2 ** (attempt - 1), 60_000),
				),
			);
			continue;
		}
		if (!response.ok) {
			const text = await response.text().catch(() => '');
			let errorBody: unknown = text;
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
			);
		}
		if (options.responseType === 'binary') {
			const binary: BinaryResponse = {
				bytes: new Uint8Array(await response.arrayBuffer()),
				contentType: response.headers.get('content-type'),
			};
			return { body: binary, headers: response.headers };
		}
		const text = await response.text();
		return {
			body: text.length === 0 ? undefined : JSON.parse(text),
			headers: response.headers,
		};
	}
}

function retryAfterMs(value: string | null): number | undefined {
	if (!value) return undefined;
	const seconds = Number.parseInt(value, 10);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

/** The same URL core builds: encoded path values, repeated array keys, `tags[key]=value`. */
export function buildUrl(options: KernelRequest): string {
	const path = options.path.replace(/\{([^}]+)\}/g, (match, name: string) => {
		const value = options.pathParameters?.[name];
		return value === undefined ? match : encodeKernelPathValue(value);
	});
	const parts: string[] = [];
	// `unknown` because query values are scalars, arrays or a string map, validated before transport.
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
	return `${KERNEL_API_BASE}${path}${parts.length > 0 ? `?${parts.join('&')}` : ''}`;
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request`. A Kernel body can hold
 * credential values, vault items, login field values, Playwright code and
 * uploaded files, so the error is rebuilt without it (and without request
 * headers), keeping the status and rate-limit fields the error handlers and
 * core's retries read.
 *
 * Core also writes a bare status text ("Bad Request") for the common statuses,
 * which hides Kernel's reason. The message is rebuilt from Kernel's error body
 * (`{ code, message }`) instead; the serialized body never goes in.
 */
export function withoutRequestData(error: ApiError): ApiError {
	const sent = sentStrings(error.request);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	// Built from the scrubbed body, so the reason is clean and the "Kernel 400" prefix is never touched.
	const message = kernelErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Query values can be search terms (an email in auditLogs.list): keep the keys only.
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

// `unknown` because an error body is whatever JSON (or text) Kernel sent.
export function kernelErrorMessage(
	status: number,
	statusText: string,
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? (body as {
					code?: unknown;
					message?: unknown;
					title?: unknown;
					detail?: unknown;
				})
			: {};
	const reason =
		typeof fields.message === 'string'
			? fields.message
			: typeof fields.detail === 'string'
				? fields.detail
				: typeof fields.title === 'string'
					? fields.title
					: statusText || 'request failed';
	const code =
		typeof fields.code === 'string' && !reason.includes(fields.code)
			? ` (${fields.code})`
			: '';
	const text = `Kernel ${status}: ${reason}${code}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** Shorter strings are ids, enum values and flags, not secrets worth hiding... */
const MIN_SCRUBBED_LENGTH = 6;
/** ...unless they sit under a key like these (a 4-digit password, a PIN, a one-time code). */
const SECRET_KEY =
	/pass|secret|token|totp|otp|code|cvc|cvv|pin|credential|values?$|key$/i;

type SentString = { text: string; wholeWord: boolean };

/**
 * Every string this call sent (JSON body, form fields, query values), longest
 * first, so a Kernel message that quotes one back ("invalid password '1234'")
 * loses it while keeping its reason. Values under a secret-looking key count at
 * any length and are matched as whole words, so a short one can't take out
 * digits elsewhere in the text.
 */
function sentStrings(request: ApiError['request']): SentString[] {
	const found = new Map<string, boolean>();
	// `unknown` because a sent value is any JSON value, form entry or file.
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
		if (typeof Blob !== 'undefined' && value instanceof Blob) return;
		if (typeof FormData !== 'undefined' && value instanceof FormData) {
			for (const [key, entry] of value.entries()) {
				visit(entry, depth + 1, secret || SECRET_KEY.test(key));
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
	visit(request.formData, 0, false);
	visit(request.query, 0, false);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because an error body is whatever JSON (or text) Kernel sent.
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

// `unknown` because query values are scalars, arrays or a string map.
function redactedValues(
	query: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (query === undefined) return undefined;
	return Object.fromEntries(Object.keys(query).map((key) => [key, REDACTED]));
}

/**
 * `https://…/browsers?tags%5Bperson%40x.com%5D=1` → `https://…/browsers?[REDACTED]`.
 * Parameter names go too: a tag map puts the caller's keys in them.
 */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

const ECHO_KEYS = new Set(['value', 'values', 'input', 'received']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Kernel sent.
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
