import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * ZohoCrm's HTTP API (https://www.zoho.com/crm/developer/docs/api/v8/, OpenAPI at https://github.com/zoho/crm-oas). Every route takes an OAuth access token in
 * the `Authorization` header (`Zoho-oauthtoken <access token>`).
 */
export const ZOHOCRM_API_BASE = 'https://www.zohoapis.com';

/** A Zoho data center. Each org lives in one; tokens work only in their own. */
export type ZohoCrmRegion =
	| 'us'
	| 'eu'
	| 'in'
	| 'au'
	| 'jp'
	| 'ca'
	| 'cn'
	| 'sa';

export const ZOHOCRM_REGIONS: readonly ZohoCrmRegion[] = [
	'us',
	'eu',
	'in',
	'au',
	'jp',
	'ca',
	'cn',
	'sa',
];

/** Each data center's top-level domain (Zoho's multi-DC table). */
const REGION_TLD: Record<ZohoCrmRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	ca: 'ca',
	cn: 'com.cn',
	sa: 'sa',
};

function regionOf(region: string | undefined): ZohoCrmRegion {
	if (region === undefined) return 'us';
	if ((ZOHOCRM_REGIONS as readonly string[]).includes(region)) {
		return region as ZohoCrmRegion;
	}
	throw new Error(
		`Unknown ZohoCrm region "${region}": use one of ${ZOHOCRM_REGIONS.join(', ')}`,
	);
}

/** The API host for a data center, e.g. https://www.zohoapis.eu. */
export function zohocrmApiBase(region?: string): string {
	return `https://www.zohoapis.${REGION_TLD[regionOf(region)]}`;
}

/** Zoho's file-upload host for bulk write (upload.zoho.<tld>; zohocloud.ca for Canada). */
export function zohocrmUploadBase(region?: string): string {
	const resolved = regionOf(region);
	return resolved === 'ca'
		? 'https://upload.zohocloud.ca'
		: `https://upload.zoho.${REGION_TLD[resolved]}`;
}

/** Zoho's accounts (OAuth) host: accounts.zoho.<tld>, accounts.zohocloud.ca for Canada. */
export function zohocrmAccountsBase(region?: string): string {
	const resolved = regionOf(region);
	return resolved === 'ca'
		? 'https://accounts.zohocloud.ca'
		: `https://accounts.zoho.${REGION_TLD[resolved]}`;
}

export function zohocrmOAuthAuthUrl(region?: string): string {
	return `${zohocrmAccountsBase(region)}/oauth/v2/auth`;
}

export function zohocrmOAuthTokenUrl(region?: string): string {
	return `${zohocrmAccountsBase(region)}/oauth/v2/token`;
}

export const ZOHOCRM_DEFAULT_TIMEOUT_MS = 60_000;

/** Largest file the upload routes send. */
export const ZOHOCRM_UPLOAD_MAX_BYTES = 50 * 1024 * 1024;

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else thrown is a real failure
 * and propagates.
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
export type ZohoCrmCallContext = {
	key: string;
	options: { baseUrl?: string; region?: string };
};

/**
 * Path values are ids and names. Core's default encodeURI keeps `/` and `..`,
 * so a value like `../keys` would reach a different route than the one whose
 * permission was checked.
 */
export function encodeZohoCrmPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid ZohoCrm path value');
	}
	return encodeURIComponent(value);
}

export type ZohoCrmHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ZohoCrmRequest = {
	method: ZohoCrmHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	pathParameters?: Record<string, string>;
	// `unknown` because query values are validated scalars or lists.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** A JSON value, a multipart or URL-encoded form, or raw bytes. */
	// `unknown` because a JSON body is any validated value (an object or a list).
	body?: unknown;
	/** The content type of a raw body. */
	mediaType?: string;
	/**
	 * Path values the operation already encoded itself (a file path whose
	 * slashes stay): sent as they are, while the route keeps its placeholder,
	 * so error URLs never show them.
	 */
	rawPathValues?: Set<string>;
	/** `upload`: the route lives on Zoho's upload host, not the API host. */
	host?: 'upload';
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
	/**
	 * One attempt only, even on a 429: a route whose 429 means a daily quota
	 * is spent (R8), where waiting out Retry-After would hold the call for hours.
	 */
	singleAttempt?: boolean;
	/**
	 * Caller strings that aren't values the transport can see: map keys
	 * (metadata keys) and file names. Scrubbed from error bodies like the
	 * values sent.
	 */
	sensitive?: string[];
};

/**
 * The API base: the plugin's `baseUrl` option (a proxy), else the region's
 * Zoho host. Upload routes go to the region's upload host.
 */
export function baseUrlOf(ctx: ZohoCrmCallContext, host?: 'upload'): string {
	if (host === 'upload') return zohocrmUploadBase(ctx.options.region);
	const configured = ctx.options.baseUrl?.trim();
	if (!configured) return zohocrmApiBase(ctx.options.region);
	const url = new URL(configured);
	// The token travels in a header: plain http only to this machine (a local proxy).
	const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
	if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
		throw new Error(
			'ZohoCrm baseUrl must be an https URL (plain http only for localhost)',
		);
	}
	return configured.replace(/\/+$/, '');
}

function configFor(
	base: string,
	key: string,
	timeoutMs?: number,
	rawPathValues?: Set<string>,
) {
	return {
		BASE: base,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: (value: string) =>
			rawPathValues?.has(value) ? value : encodeZohoCrmPathValue(value),
		TIMEOUT: Math.ceil(timeoutMs ?? ZOHOCRM_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Zoho-oauthtoken ${key}`,
		},
	} satisfies OpenAPIConfig;
}

/**
 * Core retries a 429 three times, honouring `Retry-After` (seconds or an
 * HTTP date), with a backoff of 1, 2 and 4 seconds when the header is missing.
 */
export const ZOHOCRM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
		resetTime: 'x-ratelimit-reset',
	},
};

function mediaTypeFor(options: ZohoCrmRequest): string | undefined {
	if (options.mediaType) return options.mediaType;
	const body = options.body;
	if (body === undefined) return undefined;
	if (typeof FormData !== 'undefined' && body instanceof FormData) {
		return undefined;
	}
	if (
		typeof URLSearchParams !== 'undefined' &&
		body instanceof URLSearchParams
	) {
		return 'application/x-www-form-urlencoded';
	}
	return 'application/json';
}

/**
 * Sends one ZohoCrm call through core's transport, which retries a 429 three
 * times (honouring Retry-After) and raises `ApiError` with the status.
 */
export async function makeZohoCrmRequest(
	ctx: ZohoCrmCallContext,
	options: ZohoCrmRequest,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('zohocrm', 'oauth_2');
	}
	const base = baseUrlOf(ctx, options.host);
	const config = configFor(
		base,
		ctx.key,
		options.timeoutMs,
		options.rawPathValues,
	);
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
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: options.singleAttempt
				? { ...ZOHOCRM_RATE_LIMIT_CONFIG, maxRetries: 0 }
				: ZOHOCRM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, ctx.key, base, options.sensitive);
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Zoho CRM body can hold customer records (names, emails, phone numbers, deal values), notes, emails and attachments, so the error
 * is rebuilt without it (and without request headers, which carry the API
 * key), keeping the status and rate-limit fields the error handlers and
 * core's retries read. Strings the call sent are also scrubbed from the error
 * body, in case ZohoCrm quotes them back.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides ZohoCrm's reason. The message is rebuilt from the error body.
 */
export function withoutRequestData(
	error: ApiError,
	key?: string,
	base: string = ZOHOCRM_API_BASE,
	sensitive: readonly string[] = [],
): ApiError {
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sensitive
			.filter((text) => text.length >= 2)
			.map((text) => ({ text, wholeWord: text.length < WHOLE_WORD_BELOW })),
		...sentStrings(error.request),
	].sort((a, b) => b.text.length - a.text.length);
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = zohocrmErrorMessage(error.status, error.statusText, body);
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			path: redactedValues(error.request.path),
			query: redactedValues(error.request.query),
		},
		{
			url: routeUrl(error.url, error.request.url, base),
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

// `unknown` because error bodies are untrusted provider JSON, narrowed below.
function textOf(value: unknown): string | undefined {
	if (typeof value === 'string' && value.trim().length > 0) return value.trim();
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		// `unknown` because the nested error object's fields are narrowed one by one.
		const inner = value as Record<string, unknown>;
		return textOf(inner.message) ?? textOf(inner.msg) ?? textOf(inner.detail);
	}
	if (Array.isArray(value)) {
		const parts = value
			.map((item) => {
				if (typeof item === 'string') return item;
				if (typeof item !== 'object' || item === null) return undefined;
				// `unknown` because a validation entry's fields are narrowed one by one.
				const entry = item as Record<string, unknown>;
				const said = textOf(entry.msg) ?? textOf(entry.message);
				// Zoho names the code (INVALID_DATA) and the field (details.api_name).
				const code = typeof entry.code === 'string' ? entry.code : undefined;
				const text = code && said ? `${code}: ${said}` : said;
				const details =
					typeof entry.details === 'object' && entry.details !== null
						? // `unknown` because the details object's fields are narrowed one by one.
							(entry.details as Record<string, unknown>)
						: {};
				const where =
					typeof details.api_name === 'string'
						? details.api_name
						: Array.isArray(entry.loc)
							? entry.loc.filter((part) => part !== 'body').join('.')
							: typeof entry.path === 'string'
								? entry.path
								: Array.isArray(entry.path)
									? entry.path.join('.')
									: undefined;
				return text && where ? `${where}: ${text}` : text;
			})
			.filter((part): part is string => typeof part === 'string')
			.slice(0, 5);
		return parts.length > 0 ? parts.join('; ') : undefined;
	}
	return undefined;
}

/**
 * The reason in a ZohoCrm error body: `message`, `error` (a string or an object
 * with a message), `detail` (a string or a list of validation entries) or
 * `errors`. A bare text body counts unless it is an HTML page.
 */
// `unknown` because the body is untrusted provider JSON or text.
export function zohocrmErrorMessage(
	status: number,
	statusText: string,
	body: unknown,
): string {
	const fields =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	let reason =
		// Zoho's per-record answers: { data: [{ code, message, details, status }] }.
		textOf(fields.data) ??
		textOf(fields.message) ??
		textOf(fields.error) ??
		textOf(fields.detail) ??
		textOf(fields.errors) ??
		textOf(fields.details);
	// Per-item answers sit under the resource's own key ({ contact_roles: [...] }, { watch: [...] }).
	if (!reason) {
		for (const value of Object.values(fields)) {
			if (
				Array.isArray(value) &&
				value.some(
					(item) =>
						typeof item === 'object' && item !== null && 'message' in item,
				)
			) {
				reason = textOf(value);
				if (reason) break;
			}
		}
	}
	// Zoho's top-level errors: { code: 'INVALID_TOKEN', message, details, status }.
	if (
		reason &&
		typeof fields.code === 'string' &&
		!reason.startsWith(fields.code)
	) {
		reason = `${fields.code}: ${reason}`;
	}
	if (!reason && typeof body === 'string') {
		const text = body.trim();
		if (text.length > 0 && !text.startsWith('<')) reason = text;
	}
	const text = `ZohoCrm ${status}: ${reason || statusText || 'request failed'}`;
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

/** Body fields that carry env-file text (`envContents`, a secret file's `contents`). */
const ENV_TEXT_KEY = /^(envContents|contents)$/;

/** The non-empty lines of env-file text and the value after each `KEY=`. */
export function envTextParts(text: string): string[] {
	const parts: string[] = [];
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		parts.push(line);
		const equals = line.indexOf('=');
		if (equals > 0) {
			const value = line
				.slice(equals + 1)
				.trim()
				.replace(/^(['"])(.*)\1$/, '$2');
			if (value) parts.push(value);
		}
	}
	return parts;
}

/**
 * Every string this call sent (JSON body, query values, path values), longest
 * first, so a message that quotes one back loses it while keeping its reason.
 * Any of them can be user data (a memory, a name), so length doesn't exempt
 * one; short ones are matched as whole words, so they can't take out letters
 * or digits inside other words.
 */
function sentStrings(request: ApiError['request']): SentString[] {
	const found = new Map<string, boolean>();
	// `unknown` because the sent values are any validated JSON.
	const visit = (value: unknown, depth: number, secret: boolean) => {
		// Deep enough for any request body a route takes; still bounded.
		if (depth > 64 || value === undefined || value === null) return;
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
		if (typeof FormData !== 'undefined' && value instanceof FormData) {
			// Text fields and file names; file contents are never read.
			value.forEach((entry) => {
				if (typeof entry === 'string') visit(entry, depth + 1, secret);
				else if (typeof File !== 'undefined' && entry instanceof File) {
					visit(entry.name, depth + 1, secret);
				}
			});
			return;
		}
		if (value instanceof Uint8Array || value instanceof ArrayBuffer) return;
		if (typeof value === 'object') {
			for (const [key, inner] of Object.entries(value)) {
				visit(inner, depth + 1, secret || SECRET_KEY.test(key));
				// Env-file text (`KEY=value` lines): an error can quote one value
				// back, so each line and each value counts as sent on its own.
				if (ENV_TEXT_KEY.test(key) && typeof inner === 'string') {
					for (const part of envTextParts(inner)) visit(part, depth + 1, true);
				}
			}
		}
	};
	visit(request.body, 0, false);
	visit(request.query, 0, false);
	visit(request.path, 0, true);
	return [...found]
		.map(([text, wholeWord]) => ({ text, wholeWord }))
		.sort((a, b) => b.text.length - a.text.length);
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces every sent string inside an error body with [REDACTED]. */
// `unknown` because the error body is untrusted provider JSON.
function scrubSent(value: unknown, sent: SentString[], depth = 0): unknown {
	if (sent.length === 0) return value;
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
		// `unknown` because each field is scrubbed by its own type.
		const result: Record<string, unknown> = {};
		for (const [key, inner] of Object.entries(value)) {
			// A key can be caller data too (a field error keyed by an email).
			const name = scrubSent(key, sent, depth + 1) as string;
			result[name === key ? key : `${REDACTED}#${Object.keys(result).length}`] =
				scrubSent(inner, sent, depth + 1);
		}
		return result;
	}
	return value;
}

function redactedValues(
	// `unknown` because path and query values are validated scalars or lists.
	values: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (values === undefined) return undefined;
	return Object.fromEntries(Object.keys(values).map((key) => [key, REDACTED]));
}

/**
 * The route the call took, without the caller's values:
 * `<base>/things/abc?limit=5` → `<base>/things/{id}?[REDACTED]`.
 */
export function routeUrl(
	url: string,
	route: string | undefined,
	base: string = ZOHOCRM_API_BASE,
): string {
	if (typeof route !== 'string' || !route.startsWith('/')) {
		return withoutQuery(url);
	}
	return `${base}${route}${url.includes('?') ? `?${REDACTED}` : ''}`;
}

/** `https://…/things?query=…` → `https://…/things?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because the error body is untrusted provider JSON.
function withoutEchoedValues(body: unknown, depth = 0): unknown {
	if (typeof body !== 'object' || body === null) return body;
	if (depth > MAX_ERROR_DEPTH) return REDACTED;
	if (Array.isArray(body)) {
		return body.map((item) => withoutEchoedValues(item, depth + 1));
	}
	// `unknown` because each field keeps its own type.
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (ECHO_KEYS.has(key)) continue;
		result[key] = withoutEchoedValues(value, depth + 1);
	}
	return result;
}

/** A page from a route that sends its next-page token in a response header. */
export type ZohoCrmHeaderPage = {
	// `unknown` because the page body is validated by the operation's output schema.
	body: unknown;
	/** The header's value as sent, or null when the response had none. */
	header: string | null;
};

/** The longest backoff when a 429 has no Retry-After, as in core. */
const MAX_RETRY_DELAY_MS = 60_000;

/**
 * The URL core's `request()` builds for the same options: path values through
 * the same encoder, lists as repeated keys, maps as `name[key]=value`.
 */
export function zohocrmRequestUrl(
	base: string,
	options: ZohoCrmRequest,
): string {
	const path = options.path.replace(/\{([^}]+)\}/g, (match, name: string) => {
		const value = options.pathParameters?.[name];
		if (value === undefined) return match;
		return options.rawPathValues?.has(value)
			? value
			: encodeZohoCrmPathValue(value);
	});
	const parts: string[] = [];
	// `unknown` because query values are validated scalars, lists or maps.
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
	return `${base}/${path.replace(/^\/+/, '')}${parts.length > 0 ? `?${parts.join('&')}` : ''}`;
}

function retryAfterMs(value: string | null): number | undefined {
	if (!value) return undefined;
	const seconds = Number.parseInt(value, 10);
	// An explicit wait is kept as sent, as core does; only the fallback is capped.
	return Number.isNaN(seconds) ? undefined : Math.max(seconds, 0) * 1000;
}

/**
 * A GET whose next-page token comes back in a response header (the
 * `headerCursor` routes, such as a `Next-Cursor` header). Core's `request()` returns the body or
 * one header, never both, so this sends the call with `fetch` and keeps the
 * header. Everything else matches `makeZohoCrmRequest`: the same URL, API key
 * header and timeout, a 429 retried three times (Retry-After in seconds, else
 * 1, 2 and 4 s), and failures raised as the same scrubbed `ApiError`.
 */
export async function makeZohoCrmHeaderPagedRequest(
	ctx: ZohoCrmCallContext,
	options: ZohoCrmRequest,
	header: string,
): Promise<ZohoCrmHeaderPage> {
	if (!ctx.key) {
		throw new AuthMissingError('zohocrm', 'oauth_2');
	}
	if (options.method !== 'GET' || options.body !== undefined) {
		throw new Error('ZohoCrm header paging is for GET routes only');
	}
	const base = baseUrlOf(ctx, options.host);
	const config = configFor(
		base,
		ctx.key,
		options.timeoutMs,
		options.rawPathValues,
	);
	const url = zohocrmRequestUrl(base, options);
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
	};
	const maxRetries = options.singleAttempt
		? 0
		: ZOHOCRM_RATE_LIMIT_CONFIG.maxRetries;
	for (let attempt = 1; ; attempt++) {
		const response = await fetch(url, {
			method: 'GET',
			headers: { ...config.HEADERS, ...options.headers },
			signal: AbortSignal.timeout(config.TIMEOUT),
		});
		const retryAfter = retryAfterMs(response.headers.get('retry-after'));
		if (response.status === 429 && attempt <= maxRetries) {
			await response.body?.cancel().catch(() => undefined);
			await new Promise((done) =>
				setTimeout(
					done,
					retryAfter ??
						Math.min(
							ZOHOCRM_RATE_LIMIT_CONFIG.initialRetryDelay *
								ZOHOCRM_RATE_LIMIT_CONFIG.backoffMultiplier ** (attempt - 1),
							MAX_RETRY_DELAY_MS,
						),
				),
			);
			continue;
		}
		const text = await response.text();
		if (!response.ok) {
			// `unknown` because an error body is untrusted provider JSON or text.
			let errorBody: unknown = text.length === 0 ? undefined : text;
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
				ctx.key,
				base,
				options.sensitive,
			);
		}
		// `unknown` because the page body is validated by the operation's output schema.
		let body: unknown;
		if (text.trim().length > 0) {
			try {
				body = JSON.parse(text);
			} catch {
				// The body itself stays out of the message: it can hold page content.
				throw new Error('ZohoCrm answered with a body that is not JSON');
			}
		}
		return { body, header: response.headers.get(header) };
	}
}
