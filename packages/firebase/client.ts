import { createHash, createSign } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Firebase's REST APIs, each on its own Google host (firestore.googleapis.com,
 * identitytoolkit.googleapis.com, firebasehosting.googleapis.com ...), plus
 * the Realtime Database at its own URL. Calls take an OAuth 2.0 access token
 * for a service account: the plugin signs a JWT with the account's private
 * key and trades it at oauth2.googleapis.com for a token (cached until a
 * minute before it expires).
 */
export const FIREBASE_DEFAULT_TIMEOUT_MS = 30_000;
/** The key the plugin uses when only emulators are configured and no key is stored. */
export const FIREBASE_EMULATOR_KEY = 'emulator';
export const FIREBASE_UPLOAD_TIMEOUT_MS = 120_000;
export const FIREBASE_UPLOAD_MAX_BYTES = 500 * 1024 * 1024;

/** Google's token endpoint; the signed JWT is only ever sent here. */
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/**
 * Scopes asked for: cloud-platform covers every Firebase admin API; the
 * Realtime Database also wants firebase.database + userinfo.email, and FCM
 * firebase.messaging.
 */
export const FIREBASE_SCOPES = [
	'https://www.googleapis.com/auth/cloud-platform',
	'https://www.googleapis.com/auth/firebase',
	'https://www.googleapis.com/auth/firebase.database',
	'https://www.googleapis.com/auth/firebase.messaging',
	'https://www.googleapis.com/auth/userinfo.email',
];

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

export type FirebaseServiceAccount = {
	client_email: string;
	private_key: string;
	project_id?: string;
};

/**
 * The key is a service account's JSON key file (what the Firebase console's
 * "Generate new private key" downloads) or, for short jobs, an OAuth access
 * token (`ya29...`).
 */
export function parseFirebaseKey(
	key: string,
):
	| { kind: 'serviceAccount'; account: FirebaseServiceAccount }
	| { kind: 'token'; token: string } {
	const trimmed = key.trim();
	if (!trimmed.startsWith('{')) return { kind: 'token', token: trimmed };
	// `unknown` because the key file is untrusted JSON until its fields are checked.
	let parsed: unknown;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		throw new Error('[firebase] the key looks like JSON but does not parse');
	}
	const record =
		typeof parsed === 'object' && parsed !== null
			? (parsed as Record<string, unknown>)
			: {};
	if (
		typeof record.client_email !== 'string' ||
		typeof record.private_key !== 'string'
	) {
		throw new Error(
			'[firebase] the key must be a service account JSON key with client_email and private_key',
		);
	}
	return {
		kind: 'serviceAccount',
		account: {
			client_email: record.client_email,
			private_key: record.private_key,
			...(typeof record.project_id === 'string'
				? { project_id: record.project_id }
				: {}),
		},
	};
}

const b64url = (value: string | Buffer) =>
	Buffer.from(value).toString('base64url');

/** The signed JWT a service account trades for an access token (RS256). */
export function serviceAccountAssertion(
	account: FirebaseServiceAccount,
	nowSeconds = Math.floor(Date.now() / 1000),
): string {
	const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
	const claims = b64url(
		JSON.stringify({
			iss: account.client_email,
			scope: FIREBASE_SCOPES.join(' '),
			aud: GOOGLE_TOKEN_URL,
			iat: nowSeconds,
			exp: nowSeconds + 3600,
		}),
	);
	const signer = createSign('RSA-SHA256');
	signer.update(`${head}.${claims}`);
	return `${head}.${claims}.${signer.sign(account.private_key, 'base64url')}`;
}

type CachedToken = { token: string; expiresAt: number };
/** Tokens by service account email and a hash of its private key. */
const tokenCache = new Map<string, CachedToken>();
/** Bumped by every clear, so an exchange already in flight doesn't refill the cache. */
let cacheGeneration = 0;
/** How long the token exchange may take, body included. */
const TOKEN_EXCHANGE_TIMEOUT_MS = 15_000;
/** OAuth error codes that are safe to show (RFC 6749 5.2); anything else is left out. */
const OAUTH_ERRORS = new Set([
	'invalid_request',
	'invalid_client',
	'invalid_grant',
	'unauthorized_client',
	'unsupported_grant_type',
	'invalid_scope',
]);

/** Clears cached access tokens (tests, or after rotating a key). */
export function clearFirebaseTokenCache(): void {
	tokenCache.clear();
	cacheGeneration++;
}

/**
 * An access token for the key: the token itself, or one traded for the
 * service account's signed JWT (cached per account until a minute before
 * it expires).
 */
export async function firebaseAccessToken(key: string): Promise<string> {
	const parsed = parseFirebaseKey(key);
	if (parsed.kind === 'token') return parsed.token;
	// A changed private key for the same account gets its own token.
	const cacheKey = `${parsed.account.client_email}:${createHash('sha256')
		.update(parsed.account.private_key, 'utf8')
		.digest('hex')
		.slice(0, 16)}`;
	const cached = tokenCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
	const generation = cacheGeneration;
	let status = 0;
	// `unknown` because the token response is untrusted JSON until checked.
	let parsedBody: unknown;
	try {
		const signal = AbortSignal.timeout(TOKEN_EXCHANGE_TIMEOUT_MS);
		const response = await fetch(GOOGLE_TOKEN_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
				assertion: serviceAccountAssertion(parsed.account),
			}).toString(),
			signal,
		});
		status = response.status;
		// The same signal bounds the body read.
		parsedBody = response.ok
			? await response.json()
			: await response.json().catch(() => null);
	} catch (error) {
		if (status === 0) {
			throw new Error(
				`[firebase] the token exchange with Google failed or timed out (${error instanceof Error ? error.name : 'error'})`,
			);
		}
		parsedBody = null;
	}
	// `unknown` because the token response is untrusted JSON until checked.
	const body: Record<string, unknown> =
		typeof parsedBody === 'object' &&
		parsedBody !== null &&
		!Array.isArray(parsedBody)
			? (parsedBody as Record<string, unknown>)
			: {};
	if (status < 200 || status >= 300 || typeof body.access_token !== 'string') {
		// error_description can name the account (its email): only a known
		// OAuth error code goes in the message.
		const code =
			typeof body.error === 'string' && OAUTH_ERRORS.has(body.error)
				? body.error
				: `HTTP ${status}`;
		throw new AuthMissingError(
			'firebase',
			'api_key',
			`[firebase] Google refused the service account (${code})`,
		);
	}
	const lifetime = typeof body.expires_in === 'number' ? body.expires_in : 3600;
	if (generation === cacheGeneration) {
		tokenCache.set(cacheKey, {
			token: body.access_token,
			expiresAt: Date.now() + lifetime * 1000,
		});
	}
	return body.access_token;
}

/**
 * The Realtime Database URL for a call: https only, on Google's database
 * hosts (`<name>.firebaseio.com`, `<name>.<region>.firebasedatabase.app`).
 * The token is never sent to another host.
 */
export function realtimeDatabaseUrl(raw: string): URL {
	let url: URL;
	try {
		url = new URL(raw.trim());
	} catch {
		throw new Error('[firebase] databaseUrl must be an absolute URL');
	}
	const host = url.hostname.toLowerCase();
	if (
		url.protocol !== 'https:' ||
		!(
			host.endsWith('.firebaseio.com') || host.endsWith('.firebasedatabase.app')
		) ||
		url.username ||
		url.password
	) {
		throw new Error(
			'[firebase] databaseUrl must be https://<name>.firebaseio.com or https://<name>.<region>.firebasedatabase.app',
		);
	}
	return url;
}

/** What a call needs from the endpoint context. */
export type FirebaseCallContext = {
	key: string;
	options: {
		/**
		 * Base URLs per API group, for the Firebase emulators
		 * (`{ firestore: 'http://127.0.0.1:8080/v1/', database: 'http://127.0.0.1:9000' }`).
		 * With any set, calls to those groups send `Bearer owner` instead of a
		 * Google token.
		 */
		emulatorUrls?: Partial<Record<string, string>>;
	};
};

/**
 * One path value, encoded. `slashes` keeps `/` between segments for Google's
 * full resource names (`projects/p/databases/(default)/documents/users/ada`)
 * and database paths; each segment is still encoded on its own. A `.` or `..`
 * segment would reach another resource than the one asked for, so it is
 * refused.
 */
export function encodeFirebasePathValue(
	value: string,
	slashes = false,
): string {
	const parts = slashes ? value.replace(/^\/+|\/+$/g, '').split('/') : [value];
	if (parts.some((part) => part === '.' || part === '..')) {
		throw new Error('Invalid Firebase path value');
	}
	if (!slashes && value === '') throw new Error('Invalid Firebase path value');
	return parts
		.map((part) =>
			encodeURIComponent(part).replace(/%3A/gi, ':').replace(/%40/g, '@'),
		)
		.join('/');
}

export type FirebaseHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type FirebaseRequest = {
	/** Absolute base, ending without a slash: the API's root plus service path. */
	base: string;
	method: FirebaseHttpMethod;
	/** The route with `{name}` placeholders, filled from `pathParameters`. */
	path: string;
	/** Already encoded (see encodeFirebasePathValue). */
	pathParameters?: Record<string, string>;
	// `unknown` because query values are validated scalars and lists.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	// `unknown` because a JSON body is validated per operation.
	body?: unknown;
	/** `binary`: the success comes back as `{ bytes, contentType }`. */
	responseType?: 'binary';
	/** Return this response header's value instead of the body. */
	responseHeader?: string;
	timeoutMs?: number;
	/** Use the emulators' `Bearer owner` instead of a Google token. */
	emulator?: boolean;
};

/**
 * Google answers 429 RESOURCE_EXHAUSTED (and the Realtime Database 429) with
 * Retry-After when it gives one; core retries three times.
 */
export const FIREBASE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function mediaTypeFor(body: unknown): string | undefined {
	if (body === undefined) return undefined;
	if (typeof Blob !== 'undefined' && body instanceof Blob) {
		return body.type || 'application/octet-stream';
	}
	return 'application/json';
}

/**
 * Sends one call through core's transport, which retries a 429 three times
 * and raises `ApiError` with the status.
 */
export async function makeFirebaseRequest(
	ctx: FirebaseCallContext,
	options: FirebaseRequest,
): Promise<unknown> {
	// The emulator placeholder key never goes to a Google host: a group without
	// an emulator URL still needs a real credential.
	if ((!ctx.key || ctx.key === FIREBASE_EMULATOR_KEY) && !options.emulator) {
		throw new AuthMissingError('firebase', 'api_key');
	}
	const token = options.emulator ? 'owner' : await firebaseAccessToken(ctx.key);
	const config = {
		BASE: options.base.replace(/\/+$/, ''),
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Values arrive encoded (encodeFirebasePathValue).
		ENCODE_PATH: (value: string) => value,
		TIMEOUT: Math.ceil(options.timeoutMs ?? FIREBASE_DEFAULT_TIMEOUT_MS),
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
		},
	} satisfies OpenAPIConfig;
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		headers: options.headers,
		body: options.body,
		mediaType: mediaTypeFor(options.body),
		...(options.responseType ? { responseType: options.responseType } : {}),
		...(options.responseHeader
			? { responseHeader: options.responseHeader }
			: {}),
	};
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: FIREBASE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw withoutRequestData(error, ctx.key, {
				token: options.emulator ? undefined : token,
				route: `${config.BASE}/${options.path.replace(/^\/+/, '')}`,
				query: options.query,
				path: options.pathParameters,
				body: options.body instanceof Blob ? undefined : options.body,
			});
		}
		throw error;
	}
}

const REDACTED = '[REDACTED]';

/** How deep into an error body values are checked; anything deeper is replaced. */
const MAX_ERROR_DEPTH = 6;

/**
 * Core keeps the sent body on `ApiError.request`. A Firebase body can hold
 * documents, user records and passwords, message payloads and uploaded
 * files, so the error is rebuilt without it (and without
 * request headers, which carry the API key), keeping the status and
 * rate-limit fields the error handlers and core's retries read.
 *
 * Core also writes a bare status text ("Not Found") for the common statuses,
 * which hides Firebase's reason. The message is rebuilt from Firebase's error body.
 */
export function withoutRequestData(
	error: ApiError,
	key?: string,
	// `unknown` because the original values are whatever the call validated.
	original?: {
		/** The route template the call took (`https://.../v1/{name}`). */
		route?: string;
		/** The bearer token the call sent (minted from the key, so not the key itself). */
		token?: string;
		query?: unknown;
		path?: unknown;
		body?: unknown;
	},
): ApiError {
	// The key travels in the transport config, not on error.request: add it,
	// so a body that echoes it loses it too.
	const sent = [
		...(key ? [{ text: key, wholeWord: false }] : []),
		...(original?.token ? [{ text: original.token, wholeWord: false }] : []),
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
	const body = scrubSent(withoutEchoedValues(error.body), sent);
	const message = firebaseErrorMessage(error.status, error.statusText, body);
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

/** A field path such as `user.email` or `fields[0].name`. */
const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_.[\]-]{0,80}$/;

/**
 * Google's error body: `{ "error": { "code": 404, "message": "...", "status":
 * "NOT_FOUND" } }` (the Identity Toolkit puts a code like EMAIL_EXISTS in
 * `message`); the Realtime Database answers `{ "error": "Permission denied" }`.
 * A plain-text body is kept as it is.
 */
export function firebaseErrorMessage(
	status: number,
	statusText: string,
	// `unknown` because an error body is whatever JSON (or text) Firebase sent.
	body: unknown,
): string {
	const outer =
		typeof body === 'object' && body !== null && !Array.isArray(body)
			? // `unknown` because an error body's fields are narrowed one by one below.
				(body as Record<string, unknown>)
			: {};
	const fields =
		typeof outer.error === 'object' && outer.error !== null
			? (outer.error as Record<string, unknown>)
			: typeof outer.error === 'string'
				? { message: outer.error }
				: outer;
	const parts: string[] = [];
	if (typeof fields.message === 'string' && fields.message.length > 0) {
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
	const text = `Firebase ${status}: ${parts.join('; ') || statusText || 'request failed'}`;
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
 * first, so a Firebase message that quotes one back loses it while keeping its
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
	// The path values were sent encoded (`a%40b.md`); Firebase quotes them back
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
// `unknown` because an error body is whatever JSON (or text) Firebase sent.
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

/** `https://…/contacts.json?query=…` → `https://…/contacts.json?[REDACTED]`. */
export function withoutQuery(url: string): string {
	const mark = url.indexOf('?');
	return mark === -1 ? url : `${url.slice(0, mark)}?${REDACTED}`;
}

/** Fields an error body may use to echo back what was sent. */
const ECHO_KEYS = new Set(['value', 'values', 'input', 'received', 'params']);

/** Drops fields a validation error may use to echo back what was sent. */
// `unknown` because an error body is whatever JSON (or text) Firebase sent.
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
