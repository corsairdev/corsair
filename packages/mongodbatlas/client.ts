import { createHash, randomBytes } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * MongoDB Atlas Administration API v2 (https://cloud.mongodb.com/api/atlas/v2).
 * Two kinds of credentials work:
 * - a service account (`clientId:clientSecret`, or the JSON
 *   `{ "clientId": "...", "clientSecret": "..." }`): the plugin trades it at
 *   /api/oauth/token for a bearer token (cached until a minute before it
 *   expires);
 * - a programmatic API key (`publicKey:privateKey`), sent with HTTP Digest
 *   authentication, as Atlas requires for API keys.
 * Every route is versioned by media type; the operation picks the version.
 */
export const MONGODBATLAS_API_BASE = 'https://cloud.mongodb.com';
export const MONGODBATLAS_TOKEN_URL = `${MONGODBATLAS_API_BASE}/api/oauth/token`;
export const MONGODBATLAS_DEFAULT_TIMEOUT_MS = 60_000;

/** The page size asked for when a paged list's `itemsPerPage` is left out (Atlas's maximum is 500). */
export const MONGODBATLAS_PAGE_SIZE = 100;

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

export type MongoDBAtlasCredential =
	| { kind: 'serviceAccount'; clientId: string; clientSecret: string }
	| { kind: 'apiKey'; publicKey: string; privateKey: string }
	| { kind: 'token'; token: string };

/** What the stored key is: a service account, an API key pair or a bearer token. */
export function parseAtlasKey(key: string): MongoDBAtlasCredential {
	const trimmed = key.trim();
	if (trimmed.startsWith('{')) {
		// `unknown` because the key is untrusted JSON until its fields are checked.
		let parsed: unknown;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			throw new Error(
				'[mongodbatlas] the key looks like JSON but does not parse',
			);
		}
		const record = (parsed ?? {}) as Record<string, unknown>;
		const id = record.clientId ?? record.client_id;
		const secret = record.clientSecret ?? record.client_secret;
		if (typeof id !== 'string' || typeof secret !== 'string') {
			throw new Error(
				'[mongodbatlas] a JSON key needs clientId and clientSecret (a service account)',
			);
		}
		return { kind: 'serviceAccount', clientId: id, clientSecret: secret };
	}
	const colon = trimmed.indexOf(':');
	if (colon === -1) return { kind: 'token', token: trimmed };
	const left = trimmed.slice(0, colon);
	const right = trimmed.slice(colon + 1);
	return left.startsWith('mdb_sa_id_')
		? { kind: 'serviceAccount', clientId: left, clientSecret: right }
		: { kind: 'apiKey', publicKey: left, privateKey: right };
}

type CachedToken = { token: string; expiresAt: number };
/** Tokens by client id and a hash of the secret (never the secret itself). */
const tokenCache = new Map<string, CachedToken>();
/** Bumped by every clear, so an exchange already in flight doesn't refill the cache. */
let tokenCacheGeneration = 0;
/** How long the token exchange or the Digest probe may take, body included. */
const AUTH_TIMEOUT_MS = 15_000;
/** OAuth error codes that are safe to show (RFC 6749 5.2). */
const OAUTH_ERRORS = new Set([
	'invalid_request',
	'invalid_client',
	'invalid_grant',
	'unauthorized_client',
	'unsupported_grant_type',
	'invalid_scope',
]);

/** Clears cached tokens and digest challenges (tests, or after rotating a key). */
export function clearMongoDBAtlasAuthCache(): void {
	tokenCache.clear();
	inflightTokens.clear();
	tokenCacheGeneration += 1;
	digestCache.clear();
}

/** The cache key for a service account: its id and a hash of the secret. */
function serviceAccountCacheKey(
	clientId: string,
	clientSecret: string,
): string {
	return `${clientId}:${createHash('sha256')
		.update(clientSecret, 'utf8')
		.digest('hex')
		.slice(0, 16)}`;
}

/** Exchanges in flight, so calls that miss the cache together share one. */
const inflightTokens = new Map<string, Promise<string>>();

/** A bearer token for a service account (client credentials), cached. */
export async function serviceAccountToken(
	clientId: string,
	clientSecret: string,
): Promise<string> {
	// A changed secret for the same client id gets its own token.
	const cacheKey = serviceAccountCacheKey(clientId, clientSecret);
	const cached = tokenCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
	let pending = inflightTokens.get(cacheKey);
	if (!pending) {
		pending = exchangeServiceAccountToken(clientId, clientSecret, cacheKey);
		inflightTokens.set(cacheKey, pending);
		pending.then(
			() => inflightTokens.delete(cacheKey),
			() => inflightTokens.delete(cacheKey),
		);
	}
	return pending;
}

async function exchangeServiceAccountToken(
	clientId: string,
	clientSecret: string,
	cacheKey: string,
): Promise<string> {
	const generation = tokenCacheGeneration;
	let status = 0;
	// `unknown` because the token response is untrusted JSON until checked.
	let parsed: unknown;
	try {
		const response = await fetch(MONGODBATLAS_TOKEN_URL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
			},
			body: 'grant_type=client_credentials',
			// Covers the body read below too.
			signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
		});
		status = response.status;
		parsed = response.ok
			? await response.json()
			: await response.json().catch(() => null);
	} catch (error) {
		if (status === 0) {
			throw new Error(
				`[mongodbatlas] the token exchange with Atlas failed or timed out (${error instanceof Error ? error.name : 'error'})`,
			);
		}
		parsed = null;
	}
	const body: Record<string, unknown> =
		typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
			? (parsed as Record<string, unknown>)
			: {};
	if (status < 200 || status >= 300 || typeof body.access_token !== 'string') {
		// error_description is free text that can echo the credential: only a
		// known OAuth error code goes in the message.
		const code =
			typeof body.error === 'string' && OAUTH_ERRORS.has(body.error)
				? body.error
				: `HTTP ${status}`;
		throw new AuthMissingError(
			'mongodbatlas',
			'api_key',
			`[mongodbatlas] Atlas refused the service account (${code})`,
		);
	}
	const lifetime = typeof body.expires_in === 'number' ? body.expires_in : 3600;
	if (generation === tokenCacheGeneration) {
		tokenCache.set(cacheKey, {
			token: body.access_token,
			expiresAt: Date.now() + lifetime * 1000,
		});
	}
	return body.access_token;
}

type DigestChallenge = {
	realm: string;
	nonce: string;
	qop?: string;
	opaque?: string;
	algorithm?: string;
	count: number;
};
const digestCache = new Map<string, DigestChallenge>();

/** Longest challenge read; Atlas's is about 150 characters. */
const MAX_CHALLENGE_LENGTH = 4096;

/**
 * `realm="MMS Public API", nonce="...", qop="auth"` as name -> value, in one
 * pass (a regex over the header backtracks on long runs of word characters).
 */
function digestFields(text: string): Record<string, string> {
	const fields: Record<string, string> = {};
	const input = text.slice(0, MAX_CHALLENGE_LENGTH);
	let i = 0;
	while (i < input.length) {
		while (i < input.length && (input[i] === ',' || input[i] === ' ')) i++;
		const eq = input.indexOf('=', i);
		if (eq === -1) break;
		const name = input.slice(i, eq).trim().toLowerCase();
		let value: string;
		if (input[eq + 1] === '"') {
			const close = input.indexOf('"', eq + 2);
			const end = close === -1 ? input.length : close;
			value = input.slice(eq + 2, end);
			i = end + 1;
		} else {
			const comma = input.indexOf(',', eq + 1);
			const end = comma === -1 ? input.length : comma;
			value = input.slice(eq + 1, end).trim();
			i = end;
		}
		if (/^\w+$/.test(name)) fields[name] = value;
	}
	return fields;
}

/**
 * The signer only does `qop=auth` (it never hashes the body), so `auth` is
 * picked wherever it is in the list; an offer without it is refused rather
 * than signed wrongly. No offer at all is the legacy RFC 2069 form.
 */
function qopOf(offer: string | undefined): { qop?: string } {
	const options = (offer ?? '')
		.split(',')
		.map((option) => option.trim().toLowerCase())
		.filter(Boolean);
	if (options.length === 0) return {};
	if (options.includes('auth')) return { qop: 'auth' };
	throw new AuthMissingError(
		'mongodbatlas',
		'api_key',
		'[mongodbatlas] Atlas offered Digest without qop=auth',
	);
}

/** The fields of a `WWW-Authenticate: Digest ...` header. */
export function parseDigestChallenge(
	header: string,
): DigestChallenge | undefined {
	if (!/^\s*digest\s/i.test(header)) return undefined;
	const fields = digestFields(header.replace(/^\s*digest\s+/i, ''));
	if (!fields.realm || !fields.nonce) return undefined;
	return {
		realm: fields.realm,
		nonce: fields.nonce,
		...qopOf(fields.qop),
		...(fields.opaque ? { opaque: fields.opaque } : {}),
		...(fields.algorithm ? { algorithm: fields.algorithm } : {}),
		count: 0,
	};
}

const md5 = (text: string) => createHash('md5').update(text).digest('hex');

/** The `Authorization: Digest ...` header for one request (RFC 7616, MD5). */
export function digestAuthorization(
	challenge: DigestChallenge,
	username: string,
	password: string,
	method: string,
	uri: string,
	cnonce = randomBytes(8).toString('hex'),
): string {
	challenge.count += 1;
	const nc = challenge.count.toString(16).padStart(8, '0');
	const ha1 = md5(`${username}:${challenge.realm}:${password}`);
	const ha2 = md5(`${method}:${uri}`);
	const response = challenge.qop
		? md5(`${ha1}:${challenge.nonce}:${nc}:${cnonce}:${challenge.qop}:${ha2}`)
		: md5(`${ha1}:${challenge.nonce}:${ha2}`);
	const parts = [
		`username="${username}"`,
		`realm="${challenge.realm}"`,
		`nonce="${challenge.nonce}"`,
		`uri="${uri}"`,
		`response="${response}"`,
		...(challenge.opaque ? [`opaque="${challenge.opaque}"`] : []),
		...(challenge.algorithm ? [`algorithm=${challenge.algorithm}`] : []),
		...(challenge.qop
			? [`qop=${challenge.qop}`, `nc=${nc}`, `cnonce="${cnonce}"`]
			: []),
	];
	return `Digest ${parts.join(', ')}`;
}

/** An unauthenticated probe of the URL, for the server's Digest challenge. */
async function fetchDigestChallenge(url: string): Promise<DigestChallenge> {
	const response = await fetch(url, {
		method: 'GET',
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
	});
	// The body isn't needed; drop it so the connection is freed.
	await response.body?.cancel().catch(() => {});
	const header = response.headers.get('www-authenticate') ?? '';
	const challenge = parseDigestChallenge(header);
	if (!challenge) {
		throw new AuthMissingError(
			'mongodbatlas',
			'api_key',
			'[mongodbatlas] Atlas did not offer Digest authentication for the API key',
		);
	}
	return challenge;
}

/** What a call needs from the endpoint context. */
export type MongoDBAtlasCallContext = {
	key: string;
};

/**
 * One path value, encoded. A `.` or `..` segment would reach another route
 * than the one whose permission was checked, so it is refused.
 */
export function encodeMongoDBAtlasPathValue(
	value: string,
	slashes = false,
): string {
	const parts = slashes ? value.split('/') : [value];
	if (parts.some((part) => part === '' || part === '.' || part === '..')) {
		throw new Error('Invalid MongoDB Atlas path value');
	}
	return parts.map((part) => encodeURIComponent(part)).join('/');
}

export type MongoDBAtlasHttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE';

export type MongoDBAtlasRequest = {
	method: MongoDBAtlasHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeMongoDBAtlasPathValue). */
	pathParameters?: Record<string, string>;
	// `unknown` because query values are validated scalars and lists.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	// `unknown` because a JSON body is validated per operation.
	body?: unknown;
	/** The body's versioned media type. */
	mediaType?: string;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	timeoutMs?: number;
};

/** The path and query string a call goes to, built once so Digest signs exactly it. */
export function atlasRequestTarget(options: MongoDBAtlasRequest): string {
	const path = options.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
		const value = options.pathParameters?.[name];
		if (value === undefined) throw new Error(`Missing path parameter ${name}`);
		return value;
	});
	const search = new URLSearchParams();
	for (const [name, value] of Object.entries(options.query ?? {})) {
		if (value === undefined || value === null) continue;
		for (const item of Array.isArray(value) ? value : [value]) {
			search.append(
				name,
				typeof item === 'object' ? JSON.stringify(item) : String(item),
			);
		}
	}
	const query = search.toString();
	return query ? `${path}?${query}` : path;
}

/**
 * Atlas answers 429 when a key passes its rate limit (per endpoint group),
 * with Retry-After; core retries three times.
 */
export const MONGODBATLAS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Sends one call through core's transport, which retries a 429 three times
 * and raises `ApiError` with the status. With an API key, a 401 from a stale
 * Digest nonce is retried once with a fresh challenge.
 */
export async function makeMongoDBAtlasRequest(
	ctx: MongoDBAtlasCallContext,
	options: MongoDBAtlasRequest,
	retried = false,
): Promise<unknown> {
	if (!ctx.key) {
		throw new AuthMissingError('mongodbatlas', 'api_key');
	}
	const credential = parseAtlasKey(ctx.key);
	const target = atlasRequestTarget(options);
	const headers: Record<string, string> = { ...(options.headers ?? {}) };
	if (credential.kind === 'serviceAccount') {
		headers.Authorization = `Bearer ${await serviceAccountToken(credential.clientId, credential.clientSecret)}`;
	} else if (credential.kind === 'token') {
		headers.Authorization = `Bearer ${credential.token}`;
	} else {
		let challenge = digestCache.get(credential.publicKey);
		if (!challenge) {
			challenge = await fetchDigestChallenge(
				`${MONGODBATLAS_API_BASE}${target}`,
			);
			digestCache.set(credential.publicKey, challenge);
		}
		headers.Authorization = digestAuthorization(
			challenge,
			credential.publicKey,
			credential.privateKey,
			options.method,
			target,
		);
	}
	const config = {
		BASE: MONGODBATLAS_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: Math.ceil(options.timeoutMs ?? MONGODBATLAS_DEFAULT_TIMEOUT_MS),
		HEADERS: { Accept: 'application/json' },
	} satisfies OpenAPIConfig;
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		// Path and query already built (and, with Digest, signed).
		url: target,
		headers,
		body: options.body,
		mediaType: options.body === undefined ? undefined : options.mediaType,
		...(options.responseType ? { responseType: options.responseType } : {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: MONGODBATLAS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 401 && credential.kind === 'apiKey' && !retried) {
				// The nonce may have gone stale: one more try with a fresh one.
				digestCache.delete(credential.publicKey);
				return makeMongoDBAtlasRequest(ctx, options, true);
			}
			if (error.status === 401 && credential.kind === 'serviceAccount') {
				tokenCache.delete(
					serviceAccountCacheKey(credential.clientId, credential.clientSecret),
				);
			}
			throw withoutRequestData(error, ctx.key, {
				route: `${MONGODBATLAS_API_BASE}${options.path}`,
				routePath: options.path,
				query: options.query,
				path: options.pathParameters,
				body: options.body,
			});
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. An Atlas body can hold
 * database user passwords, cloud provider secrets, IP lists and emails, so
 * the error is rebuilt without it (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides MongoDBAtlas's reason. The message is rebuilt from MongoDBAtlas's error body.
 */
export function withoutRequestData(
	error: ApiError,
	key?: string,
	// `unknown` because the original values are whatever the call validated.
	original?: {
		/** The route template the call took (`https://.../v1/{name}`). */
		route?: string;
		/** The path template, kept on the request in place of the filled-in path. */
		routePath?: string;
		query?: unknown;
		path?: unknown;
		body?: unknown;
	},
): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...sentStrings(error.request),
		...(original
			? sentStrings({
					...error.request,
					query: original.query as Record<string, unknown> | undefined,
					path: original.path as Record<string, unknown> | undefined,
					body: original.body,
				})
			: []),
	].sort((a, b) => b.text.length - a.text.length);
	// Atlas sends some errors as `application/vnd.atlas.<version>+json`, which
	// core keeps as text: read it as the JSON it is.
	const body = scrubSent(withoutEchoedValues(jsonOrText(error.body)), sent);
	const message = mongodbatlasErrorMessage(
		error.status,
		error.statusText,
		body,
	).replace(/^MongoDBAtlas /, 'MongoDB Atlas ');
	return new ApiError(
		{
			...error.request,
			url: original?.routePath ?? error.request.url,
			body: error.request.body === undefined ? undefined : REDACTED,
			formData: undefined,
			headers: undefined,
			// Path and query values are ids, names and search terms: keep the keys only.
			path: redactedValues(error.request.path),
			query: redactedValues(error.request.query),
		},
		{
			// The route, not the call's URL: a resource name can hold a person's
			// id or email (`.../documents/users/ada@example.com`).
			url: original?.route
				? `${original.route}${error.url.includes('?') ? '?[REDACTED]' : ''}`
				: withoutQuery(error.url),
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
 * Atlas's error body: `{ "error": 404, "errorCode": "CLUSTER_NOT_FOUND",
 * "detail": "No cluster named ...", "reason": "Not Found", "parameters": [...] }`.
 * `parameters` echoes values from the request, so it is dropped before
 * anything else reads the body. A plain-text body is kept as it is.
 */
export function mongodbatlasErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) MongoDBAtlas sent.
	body: unknown,
): string {
	const outer =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	// A few routes wrap the error once more: `{ "content": { "errorCode": ... }, "status": 500 }`.
	const inner = outer.content;
	const fields =
		typeof inner === 'object' &&
		inner !== null &&
		!Array.isArray(inner) &&
		('errorCode' in inner || 'detail' in inner)
			? // `unknown` because the wrapped body's fields are narrowed one by one below.
				(inner as Record<string, unknown>)
			: outer;
	const parts: string[] = [];
	if (typeof fields.errorCode === 'string' && fields.errorCode.length > 0) {
		parts.push(fields.errorCode);
	}
	if (typeof fields.detail === 'string' && fields.detail.length > 0) {
		parts.push(fields.detail);
	} else if (typeof fields.message === 'string' && fields.message.length > 0) {
		parts.push(fields.message);
	}
	const errors = Array.isArray(fields.errors)
		? fields.errors
		: typeof fields.errors === 'object' && fields.errors !== null
			? Object.entries(fields.errors).flatMap(([field, messages]) =>
					(Array.isArray(messages) ? messages : [messages]).map((message) =>
						typeof message === 'string'
							? // A key that isn't a field name (an email, a value) stays out.
								FIELD_NAME.test(field)
								? `${field} ${message}`
								: message
							: undefined,
					),
				)
			: [];
	if (errors.length > 0) {
		for (const item of errors.slice(0, 5)) {
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
	const text = `MongoDBAtlas ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
	return text.length > 500 ? `${text.slice(0, 497)}...` : text;
}

/** A field path such as `notifications.0.emailAddress` or `roles[1]`. */
const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_.[\]-]{0,80}$/;

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
 * first, so a MongoDBAtlas message that quotes one back loses it while keeping its
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
	// The path values were sent encoded (`a%40b.md`); MongoDBAtlas quotes them back
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
// `unknown` because an error body is whatever JSON (or text) MongoDBAtlas sent.
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
		let index = 0;
		for (const [rawKey, inner] of Object.entries(value)) {
			// A key can echo a value (an email keying an `errors` map): only
			// field-name keys are kept as they are.
			// A field-shaped key that echoes a sent value (a cluster name) is masked too.
			const key =
				FIELD_NAME.test(rawKey) && scrubSent(rawKey, sent, depth + 1) === rawKey
					? rawKey
					: `${REDACTED}${index++}`;
			// Atlas's error code is one of its own constants
			// (`EMAIL_OR_SMS_REQUIRED_FOR_GROUP_NOTIFICATION`), never a sent value.
			result[key] =
				key === 'errorCode' &&
				typeof inner === 'string' &&
				/^[A-Z0-9_]+$/.test(inner)
					? inner
					: scrubSent(inner, sent, depth + 1);
		}
		return result;
	}
	return value;
}

/** A text body that holds JSON, parsed; anything else as it came. */
// `unknown` because an error body is whatever JSON (or text) Atlas sent.
function jsonOrText(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	const text = body.trim();
	if (!text.startsWith('{') && !text.startsWith('[')) return body;
	try {
		return JSON.parse(text);
	} catch {
		return body;
	}
}

// `unknown` because query and path values are scalars.
function redactedValues(
	values: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
	if (values === undefined) return undefined;
	return Object.fromEntries(Object.keys(values).map((key) => [key, REDACTED]));
}

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set([
	'value',
	'values',
	'input',
	'received',
	'params',
	'parameters',
]);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) MongoDBAtlas sent.
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
