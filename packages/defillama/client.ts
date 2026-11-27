import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * DefiLlama serves its data two ways:
 *
 * - Free, no key: api.llama.fi, coins.llama.fi, stablecoins.llama.fi and
 *   yields.llama.fi (73 of the routes; bridges.llama.fi now answers 402).
 * - Pro: every route at https://pro-api.llama.fi/<key>/<route>, the key in the
 *   path (DefiLlama takes it nowhere else). Pro-only routes need it.
 *
 * With a key every call goes to Pro (higher limits); without one, free
 * routes go to their free host and Pro-only ones raise AuthMissingError.
 */
export const DEFILLAMA_PRO_URL = 'https://pro-api.llama.fi';
export const DEFILLAMA_DEFAULT_TIMEOUT_MS = 60_000;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account
 * that only reads free data. Anything else thrown is a real failure and
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

/** What a call needs from the endpoint context. */
export type DefillamaCallContext = {
	/** The Pro API key, or '' when none is set. */
	key?: string;
};

/** One path value, encoded (`ethereum:0xabc,coingecko:ethereum` keeps its `:` and `,`). */
export function encodeDefillamaPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid DefiLlama path value');
	}
	return encodeURIComponent(value).replace(/%3A/gi, ':').replace(/%2C/gi, ',');
}

export type DefillamaRequest = {
	/** The Pro route with `{api_key}` and the route's `{name}` placeholders. */
	path: string;
	/** The free host and route, when DefiLlama serves it without a key. */
	free?: { base: string; path: string };
	/** Already encoded (see encodeDefillamaPathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	timeoutMs?: number;
};

/**
 * The free API allows about 10-200 calls a minute per route family and
 * answers 429 past that. Core retries three times, honouring Retry-After.
 */
export const DEFILLAMA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one DefiLlama call through core's transport, which retries a 429
 * three times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeDefillamaRequest(
	ctx: DefillamaCallContext,
	options: DefillamaRequest,
): Promise<unknown> {
	const key = ctx.key?.trim() ?? '';
	let base: string;
	let url: string;
	let path = options.pathParameters ?? {};
	if (key) {
		base = DEFILLAMA_PRO_URL;
		url = options.path;
		// The key is a path value, so the route template core keeps on errors
		// shows `{api_key}`, never the key.
		path = { ...path, api_key: encodeURIComponent(key) };
	} else if (options.free) {
		base = options.free.base;
		url = options.free.path;
	} else {
		throw new AuthMissingError(
			'defillama',
			'api_key',
			'[defillama] this route needs a DefiLlama Pro API key (defillama.com/subscription); the free routes work without one',
		);
	}
	const config = {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(options.timeoutMs ?? DEFILLAMA_DEFAULT_TIMEOUT_MS),
		HEADERS: { Accept: 'application/json' },
	} satisfies OpenAPIConfig;
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url,
		path,
		query: options.query,
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DEFILLAMA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, key ? [key] : []);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. DefiLlama calls carry
 * no body, but the Pro key sits in the URL path, so the error is rebuilt without it
 * (and without request headers, which carry the key, and query values),
 * keeping the status and rate-limit fields the error handlers and core's
 * retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides DefiLlama's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	secrets: readonly string[] = [],
): ApiError {
	// The key travels in the transport config: add it, so a body that echoes
	// it loses it too.
	const sent = [
		...secrets
			.filter((text) => text.length >= 2)
			.map((text) => ({ text, wholeWord: text.length < WHOLE_WORD_BELOW })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = defillamaErrorMessage(error.status, error.statusText, body);
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
 * Error bodies: `{ "message": "..." }` or `{ "error": "..." }`, or plain text
 * ("Not found", "Pro-only endpoint") from the free hosts.
 */
export function defillamaErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) the server sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const parts: string[] = [];
	const head = [fields.type, fields.error, fields.message, fields.msg]
		.filter((part) => typeof part === 'string' && part.length > 0)
		.join(': ');
	if (head) parts.push(head);
	if (typeof fields.detail === 'string') parts.push(fields.detail);
	const list = Array.isArray(fields.detail)
		? fields.detail
		: Array.isArray(fields.details)
			? fields.details
			: [];
	for (const item of list.slice(0, 3)) {
		if (typeof item !== 'object' || item === null) continue;
		// `unknown` because detail items have no fixed shape.
		const detail = item as Record<string, unknown>;
		const where = Array.isArray(detail.loc) ? detail.loc.join('.') : '';
		const what = [detail.msg, detail.problem].find(
			(part) => typeof part === 'string',
		);
		if (what) parts.push(where ? `${where}: ${what}` : String(what));
	}
	if (
		typeof fields.details === 'object' &&
		fields.details !== null &&
		!Array.isArray(fields.details) &&
		typeof (fields.details as Record<string, unknown>).reason === 'string'
	) {
		parts.push(String((fields.details as Record<string, unknown>).reason));
	}
	for (const id of ['request_id', 'correlation_id']) {
		if (typeof fields[id] === 'string') parts.push(`${id} ${fields[id]}`);
	}
	if (
		parts.length === 0 &&
		typeof body === 'string' &&
		body.trim().length > 0
	) {
		const text = body.trim();
		if (!text.startsWith('<')) parts.push(text);
	}
	const text = `DefiLlama ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a DefiLlama message that quotes one back loses it while keeping its
 * reason. Any of them can be private (an email address, a URL), so
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
	// The path values were sent encoded (`a%40b`); DefiLlama quotes them back
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
// `unknown` because an error body is whatever JSON (or text) the site sent.
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
	if (typeof value === 'number') {
		// A number the call sent under a sensitive key (a phone number, a
		// code), echoed back as a number.
		const text = String(value);
		if (sent.some((item) => item.text === text)) return REDACTED;
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
 * `https://api.defillama.com/tools/jobs/j_123/results?after=500` →
 * `https://api.defillama.com/tools/jobs/{job_id}/results?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	let origin: string;
	try {
		origin = new URL(url).origin;
	} catch {
		return withoutQuery(url);
	}
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${origin}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/**
 * Fields an error body may use to echo back what was sent. DefiLlama's own
 * `data.params` (field → reason) is kept: it names what was wrong, and any
 * sent value quoted in it is scrubbed like the rest.
 */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) the site sent.
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
