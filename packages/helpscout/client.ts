import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HelpScoutAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HelpScoutAPIError';
	}
}

export const HELPSCOUT_API_BASE = 'https://api.helpscout.net/v2';
export const HELPSCOUT_AUTH_URL =
	'https://secure.helpscout.net/authentication/authorizeClientApplication';
export const HELPSCOUT_TOKEN_URL = 'https://api.helpscout.net/v2/oauth2/token';

export class HelpScoutOAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'HelpScoutOAuthError';
	}
}

export type HelpScoutTokenResult = {
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	refreshed: boolean;
};

async function requestHelpScoutToken(params: {
	clientId: string;
	clientSecret: string;
	grantType: 'client_credentials' | 'refresh_token';
	refreshToken?: string;
}): Promise<{
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}> {
	const body = new URLSearchParams({
		grant_type: params.grantType,
		client_id: params.clientId,
		client_secret: params.clientSecret,
	});
	if (params.grantType === 'refresh_token' && params.refreshToken) {
		body.set('refresh_token', params.refreshToken);
	}
	let response: Response;
	try {
		response = await fetch(HELPSCOUT_TOKEN_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body,
			signal: AbortSignal.timeout(20_000),
		});
	} catch (error) {
		throw new HelpScoutOAuthError(
			error instanceof Error
				? error.message
				: 'Failed to obtain Help Scout access token',
		);
	}
	let json: {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
		error?: string;
		error_description?: string;
	} = {};
	try {
		const text = await response.text();
		if (text) json = JSON.parse(text) as typeof json;
	} catch {
		// non-JSON error page; handled below
	}
	if (
		!response.ok ||
		!json.access_token ||
		typeof json.expires_in !== 'number'
	) {
		throw new HelpScoutOAuthError(
			json.error_description ||
				json.error ||
				`Failed to obtain Help Scout access token (${response.status})`,
		);
	}
	return {
		access_token: json.access_token,
		refresh_token: json.refresh_token,
		expires_in: json.expires_in,
	};
}

/**
 * Help Scout access tokens last 2 days. Refreshes with the refresh token
 * (authorization-code apps) or the client-credentials grant (private apps).
 * https://developer.helpscout.com/mailbox-api/overview/authentication/
 */
export async function getValidHelpScoutAccessToken({
	accessToken,
	expiresAt,
	refreshToken,
	clientId,
	clientSecret,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken?: string | null;
	clientId?: string | null;
	clientSecret?: string | null;
	forceRefresh?: boolean;
}): Promise<HelpScoutTokenResult> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;
	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return {
			accessToken,
			refreshToken: refreshToken ?? undefined,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}
	if (!clientId || !clientSecret) {
		throw new HelpScoutOAuthError(
			'Help Scout client_id and client_secret are required',
		);
	}
	const token = refreshToken
		? await requestHelpScoutToken({
				clientId,
				clientSecret,
				grantType: 'refresh_token',
				refreshToken,
			})
		: await requestHelpScoutToken({
				clientId,
				clientSecret,
				grantType: 'client_credentials',
			});
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? refreshToken ?? undefined,
		expiresAt: now + token.expires_in,
		refreshed: true,
	};
}

// Help Scout validation errors echo the rejected input (names, emails, text).
const ECHOED_INPUT_KEYS = new Set(['rejectedvalue']);

const SENSITIVE_KEY_NAMES = new Set([
	'authorization',
	'apikey',
	'token',
	'accesstoken',
	'secret',
	'clientsecret',
	'password',
	'auth',
]);

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[-_]/g, '');
	for (const sensitive of SENSITIVE_KEY_NAMES) {
		if (normalized.includes(sensitive)) return true;
	}
	return false;
}

function redactString(text: string, secrets: string[]): string {
	let result = text;
	for (const secret of secrets) {
		if (secret && secret.length > 0) {
			result = result.split(secret).join('[redacted]');
		}
	}
	result = result.replace(
		/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
		'Bearer [redacted]',
	);
	return result;
}

// `unknown` because payload bodies and provider error payloads have arbitrary JSON structures.
export function redactValue(value: unknown, secrets: string[]): unknown {
	if (typeof value === 'string') {
		return redactString(value, secrets);
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactValue(item, secrets));
	}
	if (value && typeof value === 'object') {
		// `unknown` because object values are untrusted JSON until traversed.
		const obj = value as Record<string, unknown>;
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			if (isSensitiveKey(k) || ECHOED_INPUT_KEYS.has(k.toLowerCase())) {
				sanitized[k] = '[redacted]';
			} else {
				sanitized[k] = redactValue(v, secrets);
			}
		}
		return sanitized;
	}
	return value;
}

/**
 * Redacts credentials in-place on the caught `ApiError` without replacing the instance,
 * ensuring `error instanceof ApiError` and its status/retryAfter properties survive.
 */
export function redactApiErrorInPlace(error: ApiError, apiKey?: string): void {
	const secrets = apiKey ? [apiKey] : [];
	if (error.message) {
		error.message = redactString(error.message, secrets);
	}
	if (error.body !== undefined) {
		// `unknown` because provider response bodies are untrusted JSON.
		const redactedBody: unknown = redactValue(error.body, secrets);
		// Mutate in-place so status/retryAfter and identity are preserved.
		(error as { body: unknown }).body = redactedBody;
	}
	if (error.request) {
		const mutableRequest = error.request as {
			headers?: Record<string, string>;
			// `unknown` because request bodies can be arbitrary JSON.
			body?: unknown;
		};
		if (error.request.headers) {
			const headers = { ...error.request.headers };
			for (const h of Object.keys(headers)) {
				if (isSensitiveKey(h)) {
					headers[h] = '[redacted]';
				}
			}
			mutableRequest.headers = headers;
		}
		// Request bodies and query strings carry customer names, emails and
		// message text; the status, path and provider message are enough to debug.
		mutableRequest.body = undefined;
		(mutableRequest as { query?: unknown }).query = undefined;
	}
	if (typeof error.url === 'string' && error.url.includes('?')) {
		(error as { url: string }).url = error.url.split('?')[0] ?? error.url;
	}
}

export async function makeHelpscoutRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic.
		// `unknown` because request bodies can be arbitrary JSON objects or arrays.
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		// Create calls answer 201 with the new id in the Resource-ID header;
		// true returns `{ id }` read from that header.
		resourceId?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, resourceId = false } = options;

	// Fail fast on an explicitly empty key; public or keyless callers pass undefined.
	if (apiKey !== undefined && apiKey.trim().length === 0) {
		throw new AuthMissingError('helpscout', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: HELPSCOUT_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
		...(resourceId ? { responseHeader: 'Resource-ID' } : {}),
	};

	try {
		const res = await request<T>(config, requestOptions);
		if (resourceId) {
			// The header replaces the body on success; a missing header leaves the body.
			const id =
				typeof res === 'string' && /^\d+$/.test(res.trim())
					? Number(res.trim())
					: undefined;
			return (id === undefined ? {} : { id }) as T;
		}
		if (typeof res === 'string') {
			try {
				return JSON.parse(res) as T;
			} catch {
				return res as T;
			}
		}
		return res;
	} catch (error) {
		if (error instanceof ApiError) {
			redactApiErrorInPlace(error, apiKey);
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new HelpScoutAPIError('Unknown Help Scout error');
	}
}
