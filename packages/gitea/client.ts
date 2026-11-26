import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Gitea's REST API v1 (the same API Forgejo and Codeberg serve). Gitea is
 * self-hosted, so the base URL is per account: `<instance>/api/v1`, where the
 * instance is the site root (`https://gitea.com`, `https://codeberg.org`,
 * `https://git.example.com`, a subpath install such as
 * `https://example.com/git`). Calls take `Authorization: token <access token>`.
 */
export const GITEA_DEFAULT_TIMEOUT_MS = 30_000;

/**
 * The page size the plugin asks for when a paged list's `limit` is left out.
 * Gitea's own default is DEFAULT_PAGING_NUM (30) and it clamps any `limit`
 * to MAX_RESPONSE_ITEMS (50 by default, lower if an admin set it), so 50 gets
 * the largest page a default instance gives.
 */
export const GITEA_PAGE_SIZE = 50;

/** Largest file the attachment upload routes send (Gitea's default is 2 MB for issues, configurable). */
export const GITEA_UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key and instance URL in plugin options. Anything else thrown is
 * a real failure and propagates.
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
 * The API root for an instance URL. The account may store the site root
 * (`https://git.example.com`) or the API root
 * (`https://git.example.com/api/v1`); both land on `<site>/api/v1`.
 */
export function normalizeInstanceUrl(raw: string | undefined): string {
	const trimmed = (raw ?? '').trim();
	if (!trimmed) {
		throw new Error('[gitea] instance URL is required');
	}
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error(
			'[gitea] instance URL must be an absolute http(s) URL, for example https://gitea.com',
		);
	}
	if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
		throw new Error('[gitea] instance URL must use http or https');
	}
	if (!parsed.hostname) {
		throw new Error('[gitea] instance URL must include a host');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[gitea] instance URL must not include credentials');
	}
	if (parsed.search || parsed.hash) {
		throw new Error(
			'[gitea] instance URL must not include a query or fragment',
		);
	}
	let path = parsed.pathname;
	// A loop rather than /\/+$/, which CodeQL flags as ReDoS on long slash runs.
	while (path.endsWith('/')) {
		path = path.slice(0, -1);
	}
	// Subpath installs are supported (ROOT_URL), so the path is kept and only a
	// repeated API root is collapsed.
	if (path.endsWith('/api/v1')) {
		path = path.slice(0, -'/api/v1'.length);
	}
	return `${parsed.origin}${path}/api/v1`;
}

/** What a call needs from the endpoint context. */
export type GiteaCallContext = {
	key: string;
	options: { instanceUrl?: string };
	keys?: {
		get_instance_url?: () => Promise<string | null | undefined>;
	};
};

/**
 * The instance API root for one call: the `instanceUrl` plugin option when
 * set, otherwise the connected account's stored `instance_url`. Without
 * either the call has nowhere to go, so it asks the tenant to connect.
 */
export async function resolveGiteaInstance(
	ctx: Pick<GiteaCallContext, 'options' | 'keys'>,
): Promise<string> {
	const fromOptions = ctx.options?.instanceUrl?.trim();
	if (fromOptions) return normalizeInstanceUrl(fromOptions);
	const getter = ctx.keys?.get_instance_url;
	const fromAccount = getter ? (await tryGetStoredKey(getter))?.trim() : '';
	if (fromAccount) return normalizeInstanceUrl(fromAccount);
	throw new AuthMissingError(
		'gitea',
		'api_key',
		'[gitea] instance URL is not set: connect the account with its Gitea site URL (for example https://gitea.com)',
	);
}

/**
 * One path value, encoded. `slashes` keeps `/` between segments for values
 * Gitea routes with a wildcard (a branch `feature/login`, a file path
 * `docs/a.md`); each segment is still encoded on its own. A `.` or `..`
 * segment would reach another route than the one whose permission was
 * checked, so it is refused.
 */
export function encodeGiteaPathValue(value: string, slashes = false): string {
	const parts = slashes ? value.split('/') : [value];
	if (parts.some((part) => part === '' || part === '.' || part === '..')) {
		throw new Error('Invalid Gitea path value');
	}
	return parts.map((part) => encodeURIComponent(part)).join('/');
}

export type GiteaHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type GiteaRequest = {
	method: GiteaHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeGiteaPathValue). */
	pathParameters?: Record<string, string>;
	query?: Record<string, unknown>;
	/** JSON object, multipart form, or raw text (POST /markdown/raw). */
	body?: Record<string, unknown> | FormData | string;
	/** `text/plain` for a raw text body; JSON otherwise. */
	bodyMediaType?: string;
	/** `binary`: the success comes back as `{ bytes, contentType }` (a file, a diff, an empty body). */
	responseType?: 'binary';
	timeoutMs?: number;
};

function configFor(base: string, key: string, timeoutMs?: number) {
	return {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Values arrive encoded (encodeGiteaPathValue), some with their `/` kept.
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(timeoutMs ?? GITEA_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			// Gitea reads `token <t>` (and `Bearer <t>`); `token` works on every
			// Gitea and Forgejo version.
			Authorization: `token ${key}`,
		},
	} satisfies OpenAPIConfig;
}

/**
 * Gitea only answers 429 when the instance turns on rate limiting; then core
 * retries three times, honouring Retry-After.
 */
export const GITEA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function mediaTypeFor(request: GiteaRequest): string | undefined {
	const body = request.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		return undefined;
	}
	return request.bodyMediaType ?? 'application/json';
}

/**
 * Sends one Gitea call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeGiteaRequest(
	ctx: GiteaCallContext,
	options: GiteaRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('gitea', 'api_key');
	}
	const base = await resolveGiteaInstance(ctx);
	const config = configFor(base, ctx.key, options.timeoutMs);
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		body: options.body,
		mediaType: mediaTypeFor(options),
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GITEA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, ctx.key);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Gitea body can hold
 * private code and file contents, issue text, Actions secrets, deploy keys,
 * passwords (admin.users.create) and uploads, so the error is rebuilt without it (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Gitea's reason. The message is rebuilt from Gitea's error body.
 */
export function withoutRequestData(error: ApiError, key?: string): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = giteaErrorMessage(error.status, error.statusText, body);
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
 * Gitea's error bodies (APIError, APIValidationError, APIForbiddenError in
 * the swagger): `{ "message": "repository does not exist", "url": "..." }`,
 * and for a 422 sometimes `{ "message": "...", "errors": ["..."] }`. A route
 * the instance doesn't have answers 404 with a plain-text `404 page not
 * found`, which is kept so the caller can tell a missing route (an older
 * Gitea or Forgejo) from a missing record.
 */
export function giteaErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Gitea sent.
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const parts: string[] = [];
	if (typeof fields.message === 'string' && fields.message.length > 0) {
		parts.push(fields.message);
	}
	if (Array.isArray(fields.errors)) {
		for (const item of fields.errors.slice(0, 5)) {
			if (
				typeof item === 'string' &&
				item.length > 0 &&
				!parts.includes(item)
			) {
				parts.push(item);
			}
		}
	}
	if (
		parts.length === 0 &&
		typeof body === 'string' &&
		body.trim().length > 0
	) {
		// An HTML error page (a proxy, a login page) says nothing useful.
		const text = body.trim();
		if (!text.startsWith('<')) parts.push(text);
	}
	const text = `Gitea ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a Gitea message that quotes one back loses it while keeping its
 * reason. Any of them can be private (a user name like "ada", an issue title), so
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
// `unknown` because an error body is whatever JSON (or text) Gitea sent.
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
 * `https://git.example.com/api/v1/repos/ada/site/issues/4?state=open` →
 * `https://git.example.com/api/v1/repos/{owner}/{repo}/issues/{index}?[REDACTED]`.
 */
export function routeUrl(url: string, route: string | undefined): string {
	const mark = url.indexOf('/api/v1/');
	if (typeof route !== 'string' || !route.startsWith('/') || mark === -1) {
		return withoutQuery(url);
	}
	const base = url.slice(0, mark + '/api/v1'.length);
	return `${base}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Gitea sent.
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
