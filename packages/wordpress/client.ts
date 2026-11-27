import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The WordPress REST API of one self-hosted site (or a WordPress.com Business
 * site, which serves the same API). The base URL is per account:
 * `<site>/wp-json`, where the site is the WordPress address
 * (`https://example.com`, a subdirectory install such as
 * `https://example.com/blog`). Calls authenticate with an application
 * password (Users → Profile → Application Passwords), sent as HTTP Basic auth
 * with the user's login name.
 */
export const WORDPRESS_DEFAULT_TIMEOUT_MS = 30_000;

/** Largest file media.create and media.sideload send. */
export const WORDPRESS_UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the password, site URL and username in plugin options. Anything else
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
 * The REST root for a site URL. The account may store the site address
 * (`https://example.com`) or the REST root (`https://example.com/wp-json`);
 * both land on `<site>/wp-json`.
 */
export function normalizeSiteUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) {
		throw new Error('[wordpress] site URL is required');
	}
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[wordpress] site URL must be an absolute http(s) URL, for example https://example.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[wordpress] site URL must use http or https');
	}
	if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
		// The application password goes in a Basic auth header, which plain
		// HTTP would carry in the clear. WordPress itself only allows
		// application passwords over HTTP on a local environment.
		throw new Error(
			'[wordpress] site URL must use https (plain http is allowed only for loopback hosts: localhost, 127.0.0.1, [::1])',
		);
	}
	if (!parsed.hostname) {
		throw new Error('[wordpress] site URL must include a host');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[wordpress] site URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			'[wordpress] site URL must not include a query or fragment',
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
export type WordpressCallContext = {
	/** The application password. */
	key: string;
	options: { siteUrl?: string; username?: string };
	keys?: {
		get_site_url?: () => Promise<string | null | undefined>;
		get_username?: () => Promise<string | null | undefined>;
	};
};

/**
 * The site REST root and login for one call: the `siteUrl` and `username`
 * plugin options when set, otherwise the connected account's stored
 * `site_url` and `username`. Without either the call has nowhere to go, so it
 * asks the tenant to connect.
 */
export async function resolveWordpressSite(
	ctx: Pick<WordpressCallContext, 'options' | 'keys'>,
): Promise<{ base: string; username: string }> {
	const siteFromOptions = ctx.options?.siteUrl?.trim();
	const siteGetter = ctx.keys?.get_site_url;
	const site =
		siteFromOptions ||
		(siteGetter ? (await tryGetStoredKey(siteGetter))?.trim() : '');
	if (!site) {
		throw new AuthMissingError(
			'wordpress',
			'api_key',
			'[wordpress] site URL is not set: connect the account with its WordPress address (for example https://example.com)',
		);
	}
	const userFromOptions = ctx.options?.username?.trim();
	const userGetter = ctx.keys?.get_username;
	const username =
		userFromOptions ||
		(userGetter ? (await tryGetStoredKey(userGetter))?.trim() : '');
	if (!username) {
		throw new AuthMissingError(
			'wordpress',
			'api_key',
			'[wordpress] username is not set: connect the account with the login name the application password belongs to',
		);
	}
	return { base: normalizeSiteUrl(site), username };
}

/**
 * One path value, encoded. `slashes` keeps `/` between segments for values
 * WordPress routes with a slash inside (a theme `twentytwentyfive`, a plugin
 * `akismet/akismet`, a template `twentytwentyfive//home`, a route under
 * rest.get); each segment is still encoded on its own. A `.` or `..` segment
 * would reach another route than the one whose permission was checked, so it
 * is refused. An empty segment is kept only inside a template id (`theme//slug`).
 */
export function encodeWordpressPathValue(
	value: string,
	slashes = false,
): string {
	const parts = slashes ? value.split('/') : [value];
	if (
		parts.some((part) => part === '.' || part === '..') ||
		parts[0] === '' ||
		parts[parts.length - 1] === ''
	) {
		throw new Error('Invalid WordPress path value');
	}
	return parts.map((part) => encodeURIComponent(part)).join('/');
}

export type WordpressHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type WordpressRequest = {
	method: WordpressHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeWordpressPathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	/** A JSON object, or the file itself (media uploads). */
	body?: Record<string, unknown> | Blob;
	/** Extra headers (Content-Disposition on an upload). */
	headers?: Record<string, string>;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a zip). */
	responseType?: 'binary';
	timeoutMs?: number;
};

function basic(username: string, password: string): string {
	return `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;
}

function configFor(
	base: string,
	username: string,
	password: string,
	timeoutMs?: number,
) {
	return {
		BASE: base,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Values arrive encoded (encodeWordpressPathValue), some with their `/` kept.
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(timeoutMs ?? WORDPRESS_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: basic(username, password),
		},
	} satisfies OpenAPIConfig;
}

/**
 * WordPress itself has no rate limit; a host or security plugin may answer
 * 429, and then core retries three times, honouring Retry-After.
 */
export const WORDPRESS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one WordPress call through core's transport, which retries a 429
 * three times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeWordpressRequest(
	ctx: WordpressCallContext,
	options: WordpressRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('wordpress', 'api_key');
	}
	const { base, username } = await resolveWordpressSite(ctx);
	// Application passwords are shown with spaces (`abcd efgh ...`); WordPress
	// accepts them with or without.
	const password = ctx.key.replace(/\s+/g, '');
	const config = configFor(base, username, password, options.timeoutMs);
	const isBlob = typeof Blob !== 'undefined' && options.body instanceof Blob;
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		body: options.body,
		headers: options.headers,
		mediaType:
			options.body === undefined
				? undefined
				: isBlob
					? (options.body as Blob).type || 'application/octet-stream'
					: 'application/json',
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WORDPRESS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, [ctx.key, password, username]);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A WordPress body can hold
 * unpublished posts, user emails and passwords (users.create), comments and
 * uploads, so the error is rebuilt without it (and without request headers,
 * which carry the application password), keeping the status and rate-limit
 * fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides WordPress's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	secrets: readonly string[] = [],
): ApiError {
	// The password and login travel in the transport config, not on
	// error.request: add them, so a body that echoes one loses it too.
	const sent = [
		...secrets
			.filter((text) => text.length >= 2)
			.map((text) => ({ text, wholeWord: text.length < WHOLE_WORD_BELOW })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = wordpressErrorMessage(error.status, error.statusText, body);
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
 * WordPress error bodies (WP_Error as JSON):
 * `{ "code": "rest_post_invalid_id", "message": "Invalid post ID.", "data": { "status": 404 } }`,
 * and for a validation error `data.params` (the field and why) and
 * `data.details`. The code says what happened in a stable way, so it is kept
 * in front of the message. A host error page or a blocked request (a firewall,
 * a login redirect) comes back as HTML, which says nothing useful.
 */
export function wordpressErrorMessage(
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
	const text = `WordPress ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a WordPress message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a user name like "ada", a post title), so
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
	// The path values were sent encoded (`a%2Fb`); WordPress quotes them back
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
 * Fields an error body may use to echo back what was sent. WordPress's own
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
