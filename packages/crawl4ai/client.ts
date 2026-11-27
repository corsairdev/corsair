import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Crawl4AI comes two ways, and the plugin speaks to both with one key:
 *
 * - `server.*`: a self-hosted Crawl4AI server (the unclecode/crawl4ai Docker
 *   image) at the account's `server_url`, with the server's
 *   CRAWL4AI_API_TOKEN as the key.
 * - `cloud.*`: Crawl4AI Cloud at https://api.crawl4ai.com with a Cloud API
 *   key (sk_live_...).
 *
 * Both take `Authorization: Bearer <key>`.
 */
export const CRAWL4AI_CLOUD_URL = 'https://api.crawl4ai.com';
/** Crawls can take a while: a browser page up to 90 s, the server's wall clock is 300 s. */
export const CRAWL4AI_DEFAULT_TIMEOUT_MS = 180_000;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key and server URL in plugin options. Anything else thrown is a
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
 * Loopback hosts only: `localhost`, `127.x.x.x` and `::1`. A `.local` or
 * `.test` name can resolve to another machine (mDNS, local DNS, a hosts
 * file), so it does not count, and plain HTTP to it would carry the token
 * across the network.
 */
export function isLocalHost(hostname: string): boolean {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
	return (
		host === 'localhost' || host === '::1' || /^127(\.\d{1,3}){3}$/.test(host)
	);
}

/**
 * The base URL of a self-hosted server: an absolute https URL (plain http
 * only on loopback hosts, since the token travels as a Bearer header), without a
 * query, fragment or credentials. A path prefix (a server behind a reverse
 * proxy at /crawl4ai) is kept.
 */
export function normalizeServerUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) throw new Error('[crawl4ai] server URL is required');
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[crawl4ai] server URL must be an absolute http(s) URL, for example https://crawl.example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[crawl4ai] server URL must use http or https');
	}
	if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
		throw new Error(
			'[crawl4ai] server URL must use https (plain http is allowed only for loopback hosts: localhost, 127.0.0.1, [::1])',
		);
	}
	if (parsed.username || parsed.password) {
		throw new Error('[crawl4ai] server URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			'[crawl4ai] server URL must not include a query or fragment',
		);
	}
	let path = parsed.pathname;
	while (path.endsWith('/')) path = path.slice(0, -1);
	return `${parsed.origin}${path}`;
}

/** What a call needs from the endpoint context. */
export type Crawl4aiCallContext = {
	/** The server's API token or the Cloud API key. */
	key: string;
	options: { serverUrl?: string };
	keys?: {
		get_server_url?: () => Promise<string | null | undefined>;
	};
};

/** The base URL for a `server.*` call: the serverUrl option, else the account's server_url. */
export async function resolveServerUrl(
	ctx: Pick<Crawl4aiCallContext, 'options' | 'keys'>,
): Promise<string> {
	const getter = ctx.keys?.get_server_url;
	const url =
		ctx.options?.serverUrl?.trim() ||
		(getter ? (await tryGetStoredKey(getter))?.trim() : '');
	if (!url) {
		throw new AuthMissingError(
			'crawl4ai',
			'api_key',
			'[crawl4ai] server.* operations need a self-hosted server: connect the account with its server_url (cloud.* operations use Crawl4AI Cloud)',
		);
	}
	return normalizeServerUrl(url);
}

/**
 * The Cloud URL, when the call's key is a Cloud key. An account with a
 * server_url (or a serverUrl option) holds its server's token, which must
 * never go to the Cloud: such an account needs its own Cloud connection.
 */
async function cloudUrlFor(ctx: Crawl4aiCallContext): Promise<string> {
	const getter = ctx.keys?.get_server_url;
	const server =
		ctx.options?.serverUrl?.trim() ||
		(getter ? (await tryGetStoredKey(getter))?.trim() : '');
	if (server) {
		throw new AuthMissingError(
			'crawl4ai',
			'api_key',
			'[crawl4ai] this account holds a self-hosted server token, which is not sent to Crawl4AI Cloud: connect a Cloud API key (an account without server_url) for cloud.* operations',
		);
	}
	return CRAWL4AI_CLOUD_URL;
}

/** One path value, encoded (a page URL in /llm/{url} included). */
export function encodeCrawl4aiPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Crawl4AI path value');
	}
	return encodeURIComponent(value);
}

export type Crawl4aiHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Crawl4aiRequest = {
	host: 'server' | 'cloud';
	method: Crawl4aiHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeCrawl4aiPathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	body?: Record<string, unknown>;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

/**
 * The Cloud answers 429 per plan (10 a minute on the free plan); the server
 * rate-limits too (1000 a minute by default). Core retries three times,
 * honouring Retry-After.
 */
export const CRAWL4AI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one Crawl4AI call through core's transport, which retries a 429
 * three times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeCrawl4aiRequest(
	ctx: Crawl4aiCallContext,
	options: Crawl4aiRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('crawl4ai', 'api_key');
	}
	const base =
		options.host === 'server'
			? await resolveServerUrl(ctx)
			: await cloudUrlFor(ctx);
	const config = {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(options.timeoutMs ?? CRAWL4AI_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${ctx.key}`,
		},
	} satisfies OpenAPIConfig;
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: CRAWL4AI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, [ctx.key]);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Crawl4AI body can hold
 * page content you sent for extraction, JavaScript, LLM prompts, email
 * addresses to verify and webhook headers, so the error is rebuilt without it
 * (and without request headers, which carry the key, and query values),
 * keeping the status and rate-limit fields the error handlers and core's
 * retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Crawl4AI's reason. The message is rebuilt from the error body.
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
	const message = crawl4aiErrorMessage(error.status, error.statusText, body);
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
 * Error bodies. The Cloud: `{ "error": "no_credit", "message": "...",
 * "tool": "scrape", "request_id": "req_...", "details": [{ "problem": "..." }] }`.
 * The server: FastAPI's `{ "detail": "..." }` or, for a validation error,
 * `{ "detail": [{ "loc": [...], "msg": "...", "type": "..." }] }`, and
 * `{ "error": "Internal server error", "correlation_id": "..." }` for a 500.
 */
export function crawl4aiErrorMessage(
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
	const head = [fields.error, fields.message]
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
	const text = `Crawl4AI ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a Crawl4AI message that quotes one back loses it while keeping its
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
	// The path values were sent encoded (`a%40b`); Crawl4AI quotes them back
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
 * `https://api.crawl4ai.com/tools/jobs/j_123/results?after=500` →
 * `https://api.crawl4ai.com/tools/jobs/{job_id}/results?[REDACTED]`.
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
 * Fields an error body may use to echo back what was sent. Crawl4AI's own
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
