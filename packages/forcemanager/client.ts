import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type ForceManagerRequestInput = Omit<ApiRequestOptions, 'url'>;

export type ForceManagerEnvironment = 'production' | 'sandbox';

const FORCE_MANAGER_BASES: Record<ForceManagerEnvironment, string> = {
	production: 'https://api.forcemanager.com/api/v4',
	sandbox: 'https://sandbox-api.forcemanager.com/api/v4',
};

// Retries happen in the plugin's RATE_LIMIT_ERROR handler, which core runs around the whole endpoint call.
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

// ForceManager does not document how long a session token lives (integrators treat it as about an hour)
// and answers 401 `expired token.` once it lapses, so a cached token is reused for 30 minutes at most and
// a 401 triggers one fresh login.
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_CACHED_SESSIONS = 200;
const MAX_PROVIDER_MESSAGE_LENGTH = 300;

export class ForceManagerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ForceManagerAPIError';
	}
}

export type ForceManagerCredentials = {
	publicKey: string;
	privateKey: string;
};

/**
 * One Corsair key slot carries both halves of the ForceManager API key pair, so the keyBuilder packs them
 * as `<publicKey>\n<privateKey>`. Every request logs in with the pair and sends the returned session token.
 */
export function packForceManagerCredentials({
	publicKey,
	privateKey,
}: ForceManagerCredentials): string {
	return `${publicKey}\n${privateKey}`;
}

/** The pair from a packed key, or undefined when the key is a bare session token. */
export function parseForceManagerCredentials(
	key: string,
): ForceManagerCredentials | undefined {
	const parts = key.split('\n');
	if (parts.length !== 2) return undefined;
	const publicKey = parts[0]?.trim();
	const privateKey = parts[1]?.trim();
	if (!publicKey || !privateKey) return undefined;
	return { publicKey, privateKey };
}

// `unknown` because error bodies are untrusted provider JSON (or text) until narrowed here.
function providerMessage(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const record = body as Record<string, unknown>;
	for (const field of ['message', 'error']) {
		const value = record[field];
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim().slice(0, MAX_PROVIDER_MESSAGE_LENGTH);
		}
	}
	return undefined;
}

// `unknown` because transport failures may be non-Error values; only status, Retry-After and the
// provider's own short error text are kept (never the request, its headers or the full body).
function toForceManagerError(error: unknown, label: string): Error {
	if (error instanceof ForceManagerAPIError) return error;
	if (error instanceof ApiError) {
		const detail = providerMessage(error.body);
		return new ForceManagerAPIError(
			`${label} failed with HTTP ${error.status}${detail ? `: ${detail}` : ''}`,
			error.status,
			error.retryAfter,
		);
	}
	return new ForceManagerAPIError(`${label} failed`);
}

function configFor(
	environment: ForceManagerEnvironment,
	headers: Record<string, string>,
): OpenAPIConfig {
	return {
		BASE: FORCE_MANAGER_BASES[environment],
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'Content-Type': 'application/json', ...headers },
	};
}

/** Exchanges the public/private API key pair for a session token (`POST /login`). */
export async function loginForceManager(
	credentials: ForceManagerCredentials,
	environment: ForceManagerEnvironment = 'production',
): Promise<string> {
	let response: unknown;
	try {
		// `unknown` because the login body is untrusted until the token is checked below.
		response = await request<unknown>(
			configFor(environment, {}),
			{
				method: 'POST',
				url: '/login',
				body: {
					username: credentials.publicKey,
					password: credentials.privateKey,
				},
				mediaType: 'application/json; charset=utf-8',
			},
			{ rateLimitConfig: RATE_LIMIT_CONFIG },
		);
	} catch (error: unknown) {
		throw toForceManagerError(error, 'ForceManager login');
	}
	const token =
		typeof response === 'object' && response !== null
			? (response as Record<string, unknown>).token
			: undefined;
	if (typeof token !== 'string' || token.length === 0) {
		throw new ForceManagerAPIError(
			'ForceManager login succeeded but returned no session token',
		);
	}
	return token;
}

const sessionCache = new Map<string, { token: string; expiresAt: number }>();
const inFlightLogins = new Map<string, Promise<string>>();

function cacheKey(
	credentials: ForceManagerCredentials,
	environment: ForceManagerEnvironment,
): string {
	return `${environment}\n${credentials.publicKey}\n${credentials.privateKey}`;
}

function pruneSessions(nowMs: number): void {
	for (const [key, entry] of sessionCache) {
		if (entry.expiresAt <= nowMs) sessionCache.delete(key);
	}
	while (sessionCache.size > MAX_CACHED_SESSIONS) {
		const oldest = sessionCache.keys().next().value;
		if (oldest === undefined) break;
		sessionCache.delete(oldest);
	}
}

async function sessionTokenFor(
	credentials: ForceManagerCredentials,
	environment: ForceManagerEnvironment,
	now: () => number,
): Promise<string> {
	const key = cacheKey(credentials, environment);
	const cached = sessionCache.get(key);
	if (cached && cached.expiresAt > now()) return cached.token;

	const pending = inFlightLogins.get(key);
	if (pending) return pending;

	const loginOnce = (async () => {
		try {
			const token = await loginForceManager(credentials, environment);
			pruneSessions(now());
			sessionCache.set(key, { token, expiresAt: now() + SESSION_TTL_MS });
			return token;
		} finally {
			inFlightLogins.delete(key);
		}
	})();
	inFlightLogins.set(key, loginOnce);
	return loginOnce;
}

/** Clears cached session tokens, so a test starts from a clean login. */
export function clearForceManagerSessionCache(): void {
	sessionCache.clear();
	inFlightLogins.clear();
}

async function send<T>(
	path: string,
	sessionKey: string,
	input: ForceManagerRequestInput,
	environment: ForceManagerEnvironment,
): Promise<T> {
	const options: ApiRequestOptions = {
		...input,
		url: path,
		mediaType: 'application/json; charset=utf-8',
	};
	try {
		return await request<T>(
			configFor(environment, { 'X-Session-Key': sessionKey }),
			options,
			{ rateLimitConfig: RATE_LIMIT_CONFIG },
		);
	} catch (error: unknown) {
		throw toForceManagerError(error, 'ForceManager request');
	}
}

/**
 * Sends one v4 request. `key` is either the packed public/private key pair (the normal case: the plugin
 * logs in, caches the session token and logs in again once on a 401) or a session token passed directly.
 */
// `unknown` is the safe default because the provider payload is untrusted until an operation schema parses it.
export async function makeForceManagerRequest<T = unknown>(
	path: string,
	key: string | undefined,
	input: ForceManagerRequestInput,
	environment: ForceManagerEnvironment = 'production',
	now: () => number = Date.now,
): Promise<T> {
	if (!key) {
		throw new AuthMissingError('forcemanager', 'api_key');
	}
	const credentials = parseForceManagerCredentials(key);
	if (!credentials) return send<T>(path, key, input, environment);

	const token = await sessionTokenFor(credentials, environment, now);
	try {
		return await send<T>(path, token, input, environment);
	} catch (error: unknown) {
		if (!(error instanceof ForceManagerAPIError) || error.status !== 401) {
			throw error;
		}
		// The token lapsed before the cache expected it to: forget it and retry once with a fresh login.
		const entry = sessionCache.get(cacheKey(credentials, environment));
		if (entry?.token === token) {
			sessionCache.delete(cacheKey(credentials, environment));
		}
		const fresh = await sessionTokenFor(credentials, environment, now);
		return send<T>(path, fresh, input, environment);
	}
}

export function forceManagerBaseUrl(
	environment: ForceManagerEnvironment,
): string {
	return FORCE_MANAGER_BASES[environment];
}
