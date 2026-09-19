import { createSign } from 'node:crypto';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ZoominfoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ZoominfoAPIError';
	}
}

export const ZOOMINFO_API_BASE = 'https://api.zoominfo.com';

/**
 * ZoomInfo issues a JWT good for 60 minutes with no refresh token. The docs ask
 * callers to reuse it and refresh at 55 minutes rather than authenticating per
 * request, so anything inside the last 5 minutes counts as expired.
 */
const TOKEN_TTL_MS = 60 * 60 * 1000;
const REFRESH_SKEW_MS = 5 * 60 * 1000;

export type ZoominfoToken = {
	accessToken: string;
	/** Epoch millis at which the JWT stops being usable. */
	expiresAt: number;
};

export function isTokenUsable(
	accessToken: string | null | undefined,
	expiresAt: string | number | null | undefined,
	now: number = Date.now(),
): boolean {
	if (!accessToken) return false;
	const expiry =
		typeof expiresAt === 'number' ? expiresAt : Number(expiresAt ?? Number.NaN);
	if (!Number.isFinite(expiry)) return false;
	return expiry - REFRESH_SKEW_MS > now;
}

/**
 * Linear trim. `/\/+$/` backtracks quadratically on a long run of slashes,
 * which CodeQL flags as a polynomial regular expression.
 */
function trimTrailingSlashes(url: string): string {
	let end = url.length;
	while (end > 0 && url.charCodeAt(end - 1) === 47) end--;
	return url.slice(0, end);
}

function base64url(value: string | Buffer): string {
	return Buffer.from(value)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

/**
 * Builds the short-lived RS256 assertion that the PKI flow presents to
 * /authenticate. Claims and the 5-minute lifetime follow ZoomInfo's reference
 * client (Zoominfo/api-auth-nodejs-client).
 */
export function buildZoominfoClientAssertion({
	username,
	clientId,
	privateKey,
	now = Date.now(),
}: {
	username: string;
	clientId: string;
	privateKey: string;
	now?: number;
}): string {
	const seconds = Math.floor(now / 1000);
	const header = { typ: 'JWT', alg: 'RS256' };
	const payload = {
		aud: 'enterprise_api',
		iss: 'zoominfo-api-auth-client-nodejs',
		username,
		client_id: clientId,
		iat: seconds - 60,
		exp: seconds + 5 * 60 - 60,
	};

	const signingInput = `${base64url(JSON.stringify(header))}.${base64url(
		JSON.stringify(payload),
	)}`;
	const signer = createSign('RSA-SHA256');
	signer.update(signingInput);
	signer.end();

	return `${signingInput}.${base64url(signer.sign(privateKey))}`;
}

export type ZoominfoCredentials =
	| { kind: 'basic'; username: string; password: string }
	| { kind: 'pki'; username: string; clientId: string; privateKey: string };

/**
 * Exchanges ZoomInfo credentials for a JWT.
 *
 * Uses fetch rather than the shared `request` helper because this is the one
 * call with no bearer token of its own to send.
 */
export async function authenticateZoominfo(
	credentials: ZoominfoCredentials,
	{
		baseUrl = ZOOMINFO_API_BASE,
		now = Date.now(),
	}: { baseUrl?: string; now?: number } = {},
): Promise<ZoominfoToken> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	let body = '{}';

	if (credentials.kind === 'basic') {
		body = JSON.stringify({
			username: credentials.username,
			password: credentials.password,
		});
	} else {
		headers.Authorization = `Bearer ${buildZoominfoClientAssertion({
			username: credentials.username,
			clientId: credentials.clientId,
			privateKey: credentials.privateKey,
			now,
		})}`;
	}

	const response = await fetch(`${trimTrailingSlashes(baseUrl)}/authenticate`, {
		method: 'POST',
		headers,
		body,
	});

	const raw = await response.text();
	if (!response.ok) {
		throw new ZoominfoAPIError(
			`ZoomInfo authentication failed: ${raw || response.statusText}`,
			String(response.status),
		);
	}

	let jwt: string | undefined;
	try {
		jwt = (JSON.parse(raw) as { jwt?: string }).jwt;
	} catch {
		jwt = undefined;
	}

	if (!jwt) {
		throw new ZoominfoAPIError(
			'ZoomInfo authentication returned no JWT in the response body',
		);
	}

	return { accessToken: jwt, expiresAt: now + TOKEN_TTL_MS };
}

export async function makeZoominfoRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl = ZOOMINFO_API_BASE } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// request.ts derives `Authorization: Bearer <token>` from TOKEN and applies
		// it after HEADERS, so setting the header here too would be dead weight.
		TOKEN: accessToken,
		HEADERS: { 'Content-Type': 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// ApiError carries status and retryAfter, which error-handlers.ts needs in
		// order to classify rate limits. Rewrapping it here would strip both.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) throw new ZoominfoAPIError(error.message);
		throw new ZoominfoAPIError('Unknown error');
	}
}
