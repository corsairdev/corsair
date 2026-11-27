import { createHmac, randomBytes } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The WooCommerce REST API v3 of one store. The base URL is per account:
 * `<site>/wp-json`, where the site is the store's WordPress address
 * (`https://shop.example.com`, a subdirectory install such as
 * `https://example.com/shop`). Calls authenticate with a REST API key pair
 * (WooCommerce → Settings → Advanced → REST API): the consumer key is account
 * config, the consumer secret is the key. A WordPress username with an
 * application password works the same way.
 */
export const WOOCOMMERCE_DEFAULT_TIMEOUT_MS = 30_000;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the secret, site URL and consumer key in plugin options. Anything
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

/**
 * Loopback hosts only: `localhost`, `127.x.x.x` and `::1`. A `.local` or
 * `.test` name can resolve to another machine (mDNS, local DNS, a hosts
 * file), so it does not count, and plain HTTP to it would carry the
 * password across the network.
 */
export function isLocalHost(hostname: string): boolean {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
	return (
		host === 'localhost' || host === '::1' || /^127(\.\d{1,3}){3}$/.test(host)
	);
}

/**
 * The REST root for a store URL. The account may store the site address
 * (`https://shop.example.com`) or the REST root (`.../wp-json`); both land on
 * `<site>/wp-json`.
 */
export function normalizeSiteUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) {
		throw new Error('[woocommerce] site URL is required');
	}
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[woocommerce] site URL must be an absolute http(s) URL, for example https://shop.example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[woocommerce] site URL must use http or https');
	}
	if (!parsed.hostname) {
		throw new Error('[woocommerce] site URL must include a host');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[woocommerce] site URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			'[woocommerce] site URL must not include a query or fragment',
		);
	}
	let path = parsed.pathname;
	// A loop rather than /\/+$/, which CodeQL flags as ReDoS on long slash runs.
	while (path.endsWith('/')) {
		path = path.slice(0, -1);
	}
	if (path.endsWith('/wp-json')) {
		path = path.slice(0, -'/wp-json'.length);
	}
	return `${parsed.origin}${path}/wp-json`;
}

/** What a call needs from the endpoint context. */
export type WoocommerceCallContext = {
	/** The consumer secret (or a WordPress application password). */
	key: string;
	options: { siteUrl?: string; consumerKey?: string };
	keys?: {
		get_site_url?: () => Promise<string | null | undefined>;
		get_consumer_key?: () => Promise<string | null | undefined>;
	};
};

/**
 * The store REST root and consumer key for one call: the `siteUrl` and
 * `consumerKey` plugin options when set, otherwise the account's stored
 * `site_url` and `consumer_key`. Without either the call has nowhere to go,
 * so it asks the tenant to connect.
 */
export async function resolveWoocommerceStore(
	ctx: Pick<WoocommerceCallContext, 'options' | 'keys'>,
): Promise<{ base: string; consumerKey: string }> {
	const siteFromOptions = ctx.options?.siteUrl?.trim();
	const siteGetter = ctx.keys?.get_site_url;
	const site =
		siteFromOptions ||
		(siteGetter ? (await tryGetStoredKey(siteGetter))?.trim() : '');
	if (!site) {
		throw new AuthMissingError(
			'woocommerce',
			'api_key',
			"[woocommerce] site URL is not set: connect the account with the store's address (for example https://shop.example.com)",
		);
	}
	const keyFromOptions = ctx.options?.consumerKey?.trim();
	const keyGetter = ctx.keys?.get_consumer_key;
	const consumerKey =
		keyFromOptions ||
		(keyGetter ? (await tryGetStoredKey(keyGetter))?.trim() : '');
	if (!consumerKey) {
		throw new AuthMissingError(
			'woocommerce',
			'api_key',
			'[woocommerce] consumer key is not set: connect the account with the REST API consumer key (ck_...) next to its secret',
		);
	}
	return { base: normalizeSiteUrl(site), consumerKey };
}

/**
 * One path value, encoded. A `.` or `..` would reach another route than the
 * one whose permission was checked, so it is refused.
 */
export function encodeWoocommercePathValue(value: string): string {
	if (value === '' || value === '.' || value === '..' || value.includes('/')) {
		throw new Error('Invalid WooCommerce path value');
	}
	return encodeURIComponent(value);
}

export type WoocommerceHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type WoocommerceRequest = {
	method: WoocommerceHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeWoocommercePathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	body?: Record<string, unknown>;
	timeoutMs?: number;
};

/** RFC 3986 encoding, as OAuth 1.0a and PHP's rawurlencode use. */
export function rfc3986(value: string): string {
	return encodeURIComponent(value).replace(
		/[!'()*]/g,
		(char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
	);
}

/**
 * The parameter string WooCommerce signs (WC_REST_Authentication::
 * check_oauth_signature): top-level keys sorted with strcmp, each pair
 * written `rfc3986(rfc3986(key) + '=' + rfc3986(value))` (so the value is
 * encoded twice), nested keys as `key%5Bsub%5D` in the order sent, joined
 * with `%26`.
 */
// `unknown` because query values are validated scalars, lists and objects.
export function oauthParamString(params: Record<string, unknown>): string {
	const out: string[] = [];
	// `unknown` because the walk covers nested objects of any value.
	const walk = (key: string, value: unknown) => {
		if (value === undefined || value === null) return;
		if (typeof value === 'object') {
			const entries = Array.isArray(value)
				? value.map((item, index) => [String(index), item] as const)
				: Object.entries(value);
			for (const [inner, item] of entries) walk(`${key}%5B${inner}%5D`, item);
			return;
		}
		out.push(rfc3986(`${key}=${rfc3986(String(value))}`));
	};
	const keys = Object.keys(params).sort((a, b) => {
		const left = Buffer.from(a);
		const right = Buffer.from(b);
		return Buffer.compare(left, right);
	});
	for (const key of keys) walk(rfc3986(key), params[key]);
	return out.join('%26');
}

/**
 * OAuth 1.0a "one-legged" signing, which WooCommerce requires for a consumer
 * key over plain HTTP (it refuses Basic auth there): the oauth_* parameters
 * go in the query string with an HMAC-SHA256 signature over the method, the
 * URL and every query parameter, keyed by `<consumer secret>&`.
 * https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication-over-http
 */
export function oauthQuery(
	method: string,
	url: string,
	query: Record<string, unknown>,
	consumerKey: string,
	consumerSecret: string,
	now = Date.now(),
	nonce = randomBytes(16).toString('hex'),
): Record<string, string> {
	const oauth: Record<string, string> = {
		oauth_consumer_key: consumerKey,
		oauth_nonce: nonce,
		oauth_signature_method: 'HMAC-SHA256',
		oauth_timestamp: String(Math.floor(now / 1000)),
	};
	const base = `${method.toUpperCase()}&${rfc3986(url)}&${oauthParamString({ ...query, ...oauth })}`;
	const signature = createHmac('sha256', `${consumerSecret}&`)
		.update(base)
		.digest('base64');
	return { ...oauth, oauth_signature: signature };
}

/** WooCommerce consumer keys start with `ck_`; anything else is a WordPress login. */
export function isConsumerKey(value: string): boolean {
	return value.startsWith('ck_');
}

function basic(user: string, password: string): string {
	return `Basic ${Buffer.from(`${user}:${password}`, 'utf8').toString('base64')}`;
}

/**
 * WooCommerce itself has no rate limit; a host or security plugin may answer
 * 429, and then core retries three times, honouring Retry-After.
 */
export const WOOCOMMERCE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Fills `{name}` placeholders with already-encoded values. */
function fillPath(path: string, values: Record<string, string> = {}): string {
	return path.replace(/{([^}]+)}/g, (_, name: string) => values[name] ?? '');
}

/**
 * Sends one WooCommerce call through core's transport, which retries a 429
 * three times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeWoocommerceRequest(
	ctx: WoocommerceCallContext,
	options: WoocommerceRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('woocommerce', 'api_key');
	}
	const { base, consumerKey } = await resolveWoocommerceStore(ctx);
	// Application passwords are shown with spaces; consumer secrets have none.
	const secret = ctx.key.replace(/\s+/g, '');
	const overHttp = base.startsWith('http://');
	const signed = overHttp && isConsumerKey(consumerKey);
	if (overHttp && !signed && !isLocalHost(new URL(base).hostname)) {
		// A WordPress login with an application password goes as Basic auth,
		// which plain HTTP would carry in the clear. Consumer keys are signed
		// instead, so the secret never travels.
		throw new AuthMissingError(
			'woocommerce',
			'api_key',
			'[woocommerce] an application password needs an https store URL (plain http only for loopback hosts: localhost, 127.0.0.1, [::1]); use a REST API key pair (ck_/cs_) for an http store',
		);
	}
	let query = options.query ?? {};
	const headers: Record<string, string> = { Accept: 'application/json' };
	if (signed) {
		const url = `${base}${fillPath(options.path, options.pathParameters)}`;
		query = {
			...query,
			...oauthQuery(options.method, url, query, consumerKey, secret),
		};
	} else {
		headers.Authorization = basic(consumerKey, secret);
	}
	const config = {
		BASE: base,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Values arrive encoded (encodeWoocommercePathValue).
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(options.timeoutMs ?? WOOCOMMERCE_DEFAULT_TIMEOUT_MS),
		HEADERS: headers,
	} satisfies OpenAPIConfig;
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WOOCOMMERCE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, [ctx.key, secret, consumerKey]);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/**
 * WooCommerce's error `code` (`woocommerce_rest_invalid_page_number`) is an
 * identifier, not request data, and the past-last-page check reads it: a
 * filter value such as `number` must not rewrite it. Put the sent code back
 * when it is identifier-shaped.
 */
// `unknown` because error bodies are untrusted.
function keepErrorCode(original: unknown, scrubbed: unknown): unknown {
	if (
		typeof original !== 'object' ||
		original === null ||
		typeof scrubbed !== 'object' ||
		scrubbed === null ||
		Array.isArray(scrubbed)
	) {
		return scrubbed;
	}
	const code = (original as { code?: unknown }).code;
	if (typeof code !== 'string' || !/^[a-z0-9_.-]{1,100}$/i.test(code)) {
		return scrubbed;
	}
	return { ...(scrubbed as Record<string, unknown>), code };
}

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A WooCommerce body can hold
 * customers' names, emails, addresses and phone numbers, order contents and
 * customer passwords (customers.create), so the error is rebuilt without it
 * (and without request headers and query values, which carry the key or the
 * OAuth signature), keeping the status and rate-limit fields the error
 * handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides WooCommerce's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	secrets: readonly string[] = [],
): ApiError {
	// The secret and consumer key travel in the transport config or the
	// signed query: add them, so a body that echoes one loses it too.
	const sent = [
		...secrets
			.filter((text) => text.length >= 2)
			.map((text) => ({ text, wholeWord: text.length < WHOLE_WORD_BELOW })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = keepErrorCode(
		error.body,
		scrubSent(withoutEchoedValues(error.body), sent),
	);
	const message = woocommerceErrorMessage(error.status, error.statusText, body);
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
 * WooCommerce error bodies (WP_Error as JSON):
 * `{ "code": "woocommerce_rest_shop_order_invalid_id", "message": "Invalid ID.", "data": { "status": 404 } }`,
 * and for a validation error `data.params` (the field and why) and
 * `data.details`. The code says what happened in a stable way, so it is kept
 * in front of the message. A host error page or a blocked request (a firewall,
 * a login redirect) comes back as HTML, which says nothing useful.
 */
export function woocommerceErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) the site sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const parts: string[] = [];
	const code = typeof fields.code === 'string' ? fields.code : '';
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		parts.push(code ? `${code}: ${fields.message}` : fields.message);
	} else if (code) {
		parts.push(code);
	}
	const data =
		typeof fields.data === 'object' &&
		fields.data !== null &&
		!Array.isArray(fields.data)
			? // `unknown` because WP_Error data has no fixed shape.
				(fields.data as Record<string, unknown>)
			: {};
	const params =
		typeof data.params === 'object' && data.params !== null
			? // `unknown` because WP_Error data has no fixed shape.
				Object.values(data.params as Record<string, unknown>)
			: [];
	for (const item of params.slice(0, 5)) {
		if (typeof item === 'string' && item.length > 0 && !parts.includes(item)) {
			parts.push(item);
		}
	}
	if (
		parts.length === 0 &&
		typeof body === 'string' &&
		body.trim().length > 0
	) {
		const text = body.trim();
		if (!text.startsWith('<')) parts.push(text);
	}
	const text = `WooCommerce ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a WooCommerce message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a customer name like "ada", a coupon code), so
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
	// The path values were sent encoded (`a%40b`); WooCommerce quotes them back
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
 * `https://example.com/wp-json/wp/v2/posts/12?context=edit` →
 * `https://example.com/wp-json/wp/v2/posts/{id}?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	const mark = url.indexOf('/wp-json/');
	if (typeof route !== 'string' || !route.startsWith('/') || mark === -1) {
		return withoutQuery(url);
	}
	const base = url.slice(0, mark + '/wp-json'.length);
	return `${base}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/**
 * Fields an error body may use to echo back what was sent. WooCommerce's own
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
