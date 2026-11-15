import { AuthMissingError } from 'corsair/core';
import { normaliseShopDomain } from './client';

/**
 * Apps made in Shopify's Dev Dashboard (every new app since 2026-01-01) get
 * their Admin API token from the client credentials grant, and that token
 * lasts 24 hours (`expires_in` is always 86399). The plugin mints one from the
 * stored client id and secret, keeps it in the account's `api_key` slot with
 * its expiry in `expires_at`, and mints again this long before it runs out.
 */
export const TOKEN_RENEW_BEFORE_SECONDS = 5 * 60;

/**
 * How long one token request may take, headers and body together. A stalled
 * mint would otherwise hold every call for the account, since concurrent calls
 * share it.
 */
export const TOKEN_REQUEST_TIMEOUT_MS = 15_000;

/** Shopify documents `expires_in` as always 86399; used if it is missing. */
const DEFAULT_EXPIRES_IN_SECONDS = 86_399;

/** OAuth error codes Shopify answers a refused token request with. */
const KNOWN_TOKEN_ERRORS = [
	'shop_not_permitted',
	'app_not_installed',
	'invalid_client',
	'invalid_request',
	'invalid_grant',
	'unauthorized_client',
	'unsupported_grant_type',
] as const;

export type ShopifyMintedToken = {
	accessToken: string;
	/** Unix seconds when Shopify stops accepting the token. */
	expiresAt: number;
};

/**
 * Picks the OAuth error code out of a refused token response, and nothing
 * else. The body is never copied into an error: it is provider text, and the
 * request that produced it carried the client secret.
 */
function tokenErrorCode(body: string): string | undefined {
	try {
		// unknown: the error body is provider JSON of no fixed shape; only a
		// code-like `error` string is read from it.
		const parsed = JSON.parse(body) as unknown;
		if (parsed && typeof parsed === 'object') {
			const code = (parsed as { error?: unknown }).error;
			if (typeof code === 'string' && /^[a-z_]{1,64}$/.test(code)) {
				return code;
			}
		}
	} catch {
		// Not JSON: Shopify answers some refusals as plain text.
	}
	return KNOWN_TOKEN_ERRORS.find((code) => body.includes(code));
}

/**
 * `POST https://{shop}.myshopify.com/admin/oauth/access_token` with
 * `grant_type=client_credentials`, form-encoded, as Shopify's
 * client-credentials guide describes. Shopify ignores `scope` here: the token
 * gets the scopes the app was installed with.
 *
 * A refusal (wrong id or secret, an app that is not installed on the shop, a
 * shop outside the app's organization) raises `AuthMissingError`, so Corsair
 * offers a connect link instead of retrying a request that cannot succeed.
 * A 429 is not a refusal: it is retried once after `Retry-After` (at most
 * 10 s) and then reported as a `ShopifyTokenError` with status 429.
 * No error message carries the secret, the id or a token.
 */
export async function requestShopifyClientCredentialsToken(input: {
	shopDomain: string;
	clientId: string;
	clientSecret: string;
	/** Injected by tests; defaults to the wall clock. */
	now?: () => number;
	/** Per attempt. Defaults to TOKEN_REQUEST_TIMEOUT_MS. */
	timeoutMs?: number;
	/** Cap on the wait before retrying a 429. Defaults to 10 s. */
	maxRetryWaitMs?: number;
}): Promise<ShopifyMintedToken> {
	const host = normaliseShopDomain(input.shopDomain);
	const nowSeconds = () =>
		Math.floor((input.now ? input.now() : Date.now()) / 1000);

	const timeoutMs = input.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	let attempt = await postTokenRequest(host, input, timeoutMs);
	if (attempt.status === 429) {
		// Throttled is not refused: the credentials may be fine. Wait what
		// Shopify asks (bounded), try once more, then report the throttle.
		await new Promise((resolve) =>
			setTimeout(
				resolve,
				retryWaitMs(attempt.retryAfter, input.maxRetryWaitMs),
			),
		);
		attempt = await postTokenRequest(host, input, timeoutMs);
	}
	const { status, text } = attempt;
	if (status < 200 || status >= 300) {
		const code = tokenErrorCode(text);
		const detail = `HTTP ${status}${code ? `, ${code}` : ''}`;
		if (status === 429) {
			throw new ShopifyTokenError(
				`Shopify is rate limiting token requests for ${host} (${detail}); try again shortly`,
				status,
				retryWaitMs(attempt.retryAfter, Number.POSITIVE_INFINITY),
			);
		}
		const message = `Shopify refused the client credentials token request for ${host} (${detail}). Check the app's client ID and secret, and that the app is installed on this store.`;
		if (status >= 400 && status < 500) {
			throw new AuthMissingError('shopify', 'api_key', message);
		}
		throw new ShopifyTokenError(message, status);
	}

	let accessToken: unknown;
	let expiresIn: unknown;
	try {
		// unknown: parsed provider JSON; the two fields used are checked below.
		const parsed = JSON.parse(text) as Record<string, unknown>;
		accessToken = parsed.access_token;
		expiresIn = parsed.expires_in;
	} catch {
		throw new ShopifyTokenError(
			`Shopify answered the token request for ${host} with a body that is not JSON`,
			status,
		);
	}
	if (typeof accessToken !== 'string' || accessToken.length === 0) {
		throw new ShopifyTokenError(
			`Shopify answered the token request for ${host} without an access token`,
			status,
		);
	}
	// Shopify documents `expires_in` as always present and always 86399. If it
	// is ever left out, the documented lifetime is used (a 401 still renews
	// early); a value that is there but not a positive number is refused, so a
	// dead token is never cached as fresh.
	if (
		expiresIn !== undefined &&
		(typeof expiresIn !== 'number' ||
			!Number.isFinite(expiresIn) ||
			expiresIn <= 0)
	) {
		throw new ShopifyTokenError(
			`Shopify answered the token request for ${host} with an invalid expires_in`,
			status,
		);
	}
	const lifetime =
		typeof expiresIn === 'number' ? expiresIn : DEFAULT_EXPIRES_IN_SECONDS;
	return { accessToken, expiresAt: nowSeconds() + lifetime };
}

/** Longest wait before the one retry of a throttled token request. */
const MAX_RETRY_WAIT_MS = 10_000;
const DEFAULT_RETRY_WAIT_MS = 2_000;

/** `Retry-After` in seconds, as milliseconds, capped. */
function retryWaitMs(
	retryAfter: string | null,
	capMs: number = MAX_RETRY_WAIT_MS,
): number {
	const seconds = Number(retryAfter);
	const ms =
		retryAfter !== null && Number.isFinite(seconds) && seconds >= 0
			? seconds * 1000
			: DEFAULT_RETRY_WAIT_MS;
	return Math.min(ms, capMs);
}

/**
 * One token request, with a deadline over the headers and the body together:
 * a response that stalls mid-body would otherwise leave the mint, and every
 * call waiting on it, pending forever.
 */
async function postTokenRequest(
	host: string,
	input: { clientId: string; clientSecret: string },
	timeoutMs: number,
): Promise<{ status: number; text: string; retryAfter: string | null }> {
	const controller = new AbortController();
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timedOut = new Promise<never>((_, reject) => {
		timer = setTimeout(() => {
			controller.abort();
			reject(
				new ShopifyTokenError(
					`Shopify did not answer the token request for ${host} within ${timeoutMs} ms`,
				),
			);
		}, timeoutMs);
	});
	const send = async () => {
		let res: Response;
		try {
			res = await fetch(`https://${host}/admin/oauth/access_token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
				},
				body: new URLSearchParams({
					grant_type: 'client_credentials',
					client_id: input.clientId,
					client_secret: input.clientSecret,
				}).toString(),
				signal: controller.signal,
			});
		} catch {
			// The transport error is dropped on purpose: it is not needed to act
			// on the failure, and nothing from the request should leak through it.
			throw new ShopifyTokenError(
				`Could not reach ${host} to get a Shopify access token`,
			);
		}
		return {
			status: res.status,
			text: await res.text(),
			retryAfter: res.headers.get('retry-after'),
		};
	};
	try {
		return await Promise.race([send(), timedOut]);
	} finally {
		clearTimeout(timer);
	}
}

/** A token request that failed for a reason other than refused credentials. */
export class ShopifyTokenError extends Error {
	public readonly status?: number;
	/** Milliseconds Shopify asked to wait, for a throttled request. */
	public readonly retryAfter?: number;
	constructor(message: string, status?: number, retryAfter?: number) {
		super(message);
		this.name = 'ShopifyTokenError';
		this.status = status;
		this.retryAfter = retryAfter;
	}
}

/** True when a cached token still has more than the renewal margin left. */
export function isTokenFresh(
	expiresAt: string | null | undefined,
	nowMs: number = Date.now(),
): boolean {
	const seconds = Number(expiresAt);
	if (!expiresAt || !Number.isFinite(seconds)) return false;
	return seconds > Math.floor(nowMs / 1000) + TOKEN_RENEW_BEFORE_SECONDS;
}

/**
 * Concurrent calls that all find the token stale share one mint. Keyed by the
 * account's key manager, so two tenants or two Corsair instances never share a
 * token, and a forced renewal (after a 401) is a separate flight from a
 * routine one.
 */
const flights = new WeakMap<object, Map<string, Promise<string>>>();

export function shareMint(
	store: object,
	kind: 'routine' | 'forced',
	run: () => Promise<string>,
): Promise<string> {
	let byKind = flights.get(store);
	if (!byKind) {
		byKind = new Map();
		flights.set(store, byKind);
	}
	const existing = byKind.get(kind);
	if (existing) return existing;
	const pending = run().finally(() => {
		byKind.delete(kind);
	});
	byKind.set(kind, pending);
	return pending;
}
