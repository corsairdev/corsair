import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Polymarket is eight HTTP APIs on their own hosts. Market data (Gamma, Data,
 * CLOB prices and books, Perps info, Bridge) is public; the rest needs one of
 * these credentials:
 *
 * - `clob`: a CLOB API key set (key, secret, passphrase, wallet address). Each
 *   request carries POLY_ADDRESS, POLY_API_KEY, POLY_PASSPHRASE,
 *   POLY_TIMESTAMP and POLY_SIGNATURE = base64url(HMAC-SHA256(base64url-decoded
 *   secret, timestamp + method + path + body)).
 * - `clobL1`: a wallet's EIP-712 signature the caller passes as inputs (the
 *   plugin never holds a private key).
 * - `perps`: POLYMARKET-PROXY + POLYMARKET-SECRET headers.
 * - `rfq`: RFQ-Key-Id, RFQ-Timestamp, RFQ-Signature = base64url(HMAC-SHA256(
 *   secret, timestamp + method + path + body)), padded.
 * - `relayer`: RELAYER_API_KEY + RELAYER_API_KEY_ADDRESS, or builder
 *   credentials signed like the CLOB's (POLY_BUILDER_*).
 */
export const POLYMARKET_HOSTS = {
	gamma: 'https://gamma-api.polymarket.com',
	data: 'https://data-api.polymarket.com',
	clob: 'https://clob.polymarket.com',
	bridge: 'https://bridge.polymarket.com',
	relayer: 'https://relayer-v2.polymarket.com',
	rfq: 'https://external-rfq-partner.polymarket.com',
	combos: 'https://combos-rfq-api.polymarket.com',
	perps: 'https://api.perpetuals.polymarket.com',
} as const;

export type PolymarketHost = keyof typeof POLYMARKET_HOSTS;
export type PolymarketAuthKind =
	| 'none'
	| 'clob'
	| 'clobL1'
	| 'perps'
	| 'rfq'
	| 'relayer';

export const POLYMARKET_DEFAULT_TIMEOUT_MS = 30_000;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes credentials in plugin options or only reads public data. Anything
 * else thrown is a real failure and propagates.
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

/** What the key builder hands each call (serialized as the call's key). */
export type PolymarketCredentials = {
	clob?: {
		apiKey: string;
		secret: string;
		passphrase: string;
		address: string;
	};
	perps?: { proxy: string; secret: string };
	rfq?: { keyId: string; secret: string };
	relayer?: {
		apiKey?: string;
		address?: string;
		builder?: { apiKey: string; secret: string; passphrase: string };
	};
};

export function serializePolymarketCredentials(
	credentials: PolymarketCredentials,
): string {
	return JSON.stringify(credentials);
}

function parseCredentials(key: string | undefined): PolymarketCredentials {
	if (!key) return {};
	try {
		const parsed: unknown = JSON.parse(key);
		return typeof parsed === 'object' && parsed !== null
			? (parsed as PolymarketCredentials)
			: {};
	} catch {
		return {};
	}
}

/** What a call needs from the endpoint context. */
export type PolymarketCallContext = {
	/** Serialized PolymarketCredentials (the key builder's), or '' when none are set. */
	key?: string;
};

/** One path value, encoded. */
export function encodePolymarketPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Polymarket path value');
	}
	return encodeURIComponent(value);
}

export type PolymarketHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type PolymarketRequest = {
	host: PolymarketHost;
	auth: PolymarketAuthKind;
	method: PolymarketHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodePolymarketPathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	// `unknown` because a body is an object or, for list routes, an array.
	body?: unknown;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

/**
 * Gamma and the CLOB rate-limit per route (Cloudflare 429s). Core retries
 * three times, honouring Retry-After.
 */
export const POLYMARKET_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * base64url(HMAC-SHA256(secret, timestamp + method + path + body)), as the
 * CLOB, builder and RFQ partner APIs sign requests. `decodeSecret`: the CLOB
 * and builder secrets are base64url and are decoded first; the RFQ secret is
 * used as given. The output keeps its `=` padding.
 */
export function polymarketHmacSignature(
	secret: string,
	timestamp: string,
	method: string,
	path: string,
	body: string,
	decodeSecret = true,
): string {
	const key = decodeSecret
		? Buffer.from(secret.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
		: Buffer.from(secret, 'utf8');
	return createHmac('sha256', key)
		.update(`${timestamp}${method}${path}${body}`)
		.digest('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function fillPath(path: string, values: Record<string, string> = {}): string {
	return path.replace(
		/\{([^}]+)\}/g,
		(_match, name: string) => values[name] ?? '',
	);
}

/** The auth headers one call needs; throws AuthMissingError when they're not set. */
export function polymarketAuthHeaders(
	ctx: PolymarketCallContext,
	options: PolymarketRequest,
	now: () => number = Date.now,
): { headers: Record<string, string>; secrets: string[] } {
	const method = options.method;
	const path = fillPath(options.path, options.pathParameters);
	const body = options.body === undefined ? '' : JSON.stringify(options.body);
	const seconds = String(Math.floor(now() / 1000));
	const credentials = parseCredentials(ctx.key);
	switch (options.auth) {
		case 'none':
		case 'clobL1':
			return { headers: {}, secrets: [] };
		case 'clob': {
			const clob = credentials.clob;
			if (!clob?.apiKey || !clob.secret || !clob.passphrase || !clob.address) {
				throw new AuthMissingError(
					'polymarket',
					'api_key',
					'[polymarket] this operation needs a CLOB API key set: connect the account with the API key, secret, passphrase and wallet address (clob.apiKeys.create or clob.apiKeys.derive makes one)',
				);
			}
			return {
				headers: {
					POLY_ADDRESS: clob.address,
					POLY_API_KEY: clob.apiKey,
					POLY_PASSPHRASE: clob.passphrase,
					POLY_TIMESTAMP: seconds,
					POLY_SIGNATURE: polymarketHmacSignature(
						clob.secret,
						seconds,
						method,
						path,
						body,
					),
				},
				secrets: [clob.apiKey, clob.secret, clob.passphrase, clob.address],
			};
		}
		case 'perps': {
			const perps = credentials.perps;
			if (!perps?.proxy || !perps.secret) {
				throw new AuthMissingError(
					'polymarket',
					'api_key',
					'[polymarket] perps.account operations need the perps option: { proxy, secret } from perps.proxy.create',
				);
			}
			return {
				headers: {
					'POLYMARKET-PROXY': perps.proxy,
					'POLYMARKET-SECRET': perps.secret,
				},
				secrets: [perps.proxy, perps.secret],
			};
		}
		case 'rfq': {
			const rfq = credentials.rfq;
			if (!rfq?.keyId || !rfq.secret) {
				throw new AuthMissingError(
					'polymarket',
					'api_key',
					'[polymarket] rfq operations need the rfq option: { keyId, secret } (an RFQ partner key)',
				);
			}
			return {
				headers: {
					'RFQ-Key-Id': rfq.keyId,
					'RFQ-Timestamp': seconds,
					'RFQ-Signature': polymarketHmacSignature(
						rfq.secret,
						seconds,
						method,
						path,
						body,
						false,
					),
				},
				secrets: [rfq.keyId, rfq.secret],
			};
		}
		case 'relayer': {
			const relayer = credentials.relayer;
			if (relayer?.apiKey && relayer.address) {
				return {
					headers: {
						RELAYER_API_KEY: relayer.apiKey,
						RELAYER_API_KEY_ADDRESS: relayer.address,
					},
					secrets: [relayer.apiKey, relayer.address],
				};
			}
			const builder = relayer?.builder;
			if (builder?.apiKey && builder.secret && builder.passphrase) {
				return {
					headers: {
						POLY_BUILDER_API_KEY: builder.apiKey,
						POLY_BUILDER_PASSPHRASE: builder.passphrase,
						POLY_BUILDER_TIMESTAMP: seconds,
						POLY_BUILDER_SIGNATURE: polymarketHmacSignature(
							builder.secret,
							seconds,
							method,
							path,
							body,
						),
					},
					secrets: [builder.apiKey, builder.secret, builder.passphrase],
				};
			}
			throw new AuthMissingError(
				'polymarket',
				'api_key',
				'[polymarket] relayer operations need the relayer option: { apiKey, address } or { builder: { apiKey, secret, passphrase } }',
			);
		}
	}
}

/**
 * Sends one Polymarket call through core's transport, which retries a 429
 * three times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makePolymarketRequest(
	ctx: PolymarketCallContext,
	options: PolymarketRequest,
): Promise<unknown> {
	const auth = polymarketAuthHeaders(ctx, options);
	const config = {
		BASE: POLYMARKET_HOSTS[options.host],
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(options.timeoutMs ?? POLYMARKET_DEFAULT_TIMEOUT_MS),
		HEADERS: { Accept: 'application/json', ...auth.headers },
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
			rateLimitConfig: POLYMARKET_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Header values (the CLOB L1 wallet signature and address, every
			// auth header) are scrubbed too: an error body can echo them.
			throw withoutRequestData(error, [
				...auth.secrets,
				...Object.values(auth.headers),
				...Object.values(options.headers ?? {}),
			]);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Polymarket body can hold
 * signed orders, wallet addresses and signatures, so the error is rebuilt without it
 * (and without request headers, which carry the key, and query values),
 * keeping the status and rate-limit fields the error handlers and core's
 * retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Polymarket's reason. The message is rebuilt from the error body.
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
	const message = polymarketErrorMessage(error.status, error.statusText, body);
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
 * Error bodies differ per API: the CLOB and Data API send `{ "error": "..." }`,
 * Gamma `{ "type": "...", "error": "..." }`, the RFQ APIs
 * `{ "error": "...", "message": "...", "details": { "reason": "..." } }`,
 * Perps `{ "code": ..., "msg": "..." }`, and validation errors FastAPI-style
 * `{ "detail": [{ "loc": [...], "msg": "..." }] }`.
 */
export function polymarketErrorMessage(
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
	const text = `Polymarket ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a Polymarket message that quotes one back loses it while keeping its
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
	// The path values were sent encoded (`a%40b`); Polymarket quotes them back
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
 * `https://api.polymarket.com/tools/jobs/j_123/results?after=500` →
 * `https://api.polymarket.com/tools/jobs/{job_id}/results?[REDACTED]`.
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
 * Fields an error body may use to echo back what was sent. Polymarket's own
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
