// Generic OAuth refresh_token exchange for connections whose client_secret is
// held locally (inline / no-Hub). Data-driven by the plugin's oauthConfig so a
// single implementation covers every provider that speaks standard OAuth 2.0,
// replacing the per-plugin refresh<X>AccessToken helpers.

export type OAuthTokenAuthMethod =
	| 'body' // client_id + client_secret in the request body (most providers)
	| 'basic' // HTTP Basic base64(client_id:client_secret) (Bitbucket)
	| 'basic_secret_only'; // HTTP Basic base64(client_secret:) (Stripe)

export type OAuthBodyFormat = 'form' | 'json';

export type LocalOAuthRefreshInput = {
	tokenUrl: string;
	refreshToken: string;
	clientSecret: string;
	clientId?: string | null;
	tokenAuthMethod?: OAuthTokenAuthMethod;
	bodyFormat?: OAuthBodyFormat;
	extraParams?: Record<string, string>;
};

export type LocalOAuthRefreshResult = {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string;
};

/**
 * How a refused refresh should be handled:
 * - 'revoked': the provider refused the refresh token (the user removed
 *   access, or the grant expired). Only reconnecting fixes it.
 * - 'client': the provider refused our OAuth app's own credentials (wrong or
 *   deleted client id/secret). The app's owner must fix it; reconnecting won't.
 * - 'transient': a 5xx, 408 or 429, or a refusal that says nothing about the
 *   grant (a 403, a 404 from a wrong token URL, a malformed request).
 *   Reconnecting won't fix it, so it is rethrown as is.
 */
export type OAuthRefreshFailureKind = 'revoked' | 'client' | 'transient';

const CLIENT_ERRORS = new Set([
	'invalid_client',
	'unauthorized_client',
	'incorrect_client_credentials',
]);

const REQUEST_ERRORS = new Set([
	'invalid_request',
	'unsupported_grant_type',
	'invalid_scope',
]);

/** Classifies a token-endpoint failure by its HTTP status and RFC 6749
 * `error` code. A 400 or 401 with any other code, or none, counts as revoked:
 * providers answer a dead grant in their own dialects. */
export function classifyOAuthRefreshFailure(
	status: number,
	errorCode: string | undefined,
): OAuthRefreshFailureKind {
	if (errorCode && CLIENT_ERRORS.has(errorCode)) return 'client';
	if (errorCode && REQUEST_ERRORS.has(errorCode)) return 'transient';
	return status === 400 || status === 401 ? 'revoked' : 'transient';
}

/** A refresh the token endpoint refused. The provider's body is kept off the
 * message, which reaches agents and logs; only its `error` code is shown. */
export class OAuthRefreshError extends Error {
	readonly status: number;
	readonly errorCode: string | undefined;
	readonly kind: OAuthRefreshFailureKind;

	constructor(status: number, errorCode: string | undefined) {
		const kind = classifyOAuthRefreshFailure(status, errorCode);
		super(
			`OAuth token refresh failed (${status}${errorCode ? ` ${errorCode}` : ''})${
				kind === 'client'
					? ': the provider rejected the OAuth app credentials (client id/secret). Reconnecting will not help; fix the app configuration.'
					: ''
			}`,
		);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'OAuthRefreshError';
		this.status = status;
		this.errorCode = errorCode;
		this.kind = kind;
	}
}

function readErrorCode(body: string): string | undefined {
	try {
		// unknown: the token endpoint's body is the provider's, unvalidated;
		// the typeof check below is what narrows it.
		const parsed = JSON.parse(body) as { error?: unknown };
		return typeof parsed.error === 'string' ? parsed.error : undefined;
	} catch {
		const match = /(?:^|[?&])error=([a-z_]+)/i.exec(body);
		return match?.[1];
	}
}

export async function refreshOAuthTokensLocal(
	input: LocalOAuthRefreshInput,
): Promise<LocalOAuthRefreshResult> {
	const {
		tokenUrl,
		refreshToken,
		clientSecret,
		clientId,
		tokenAuthMethod = 'body',
		bodyFormat = 'form',
		extraParams,
	} = input;

	const params: Record<string, string> = {
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
		...extraParams,
	};

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (tokenAuthMethod === 'basic') {
		headers.Authorization = `Basic ${Buffer.from(`${clientId ?? ''}:${clientSecret}`).toString('base64')}`;
	} else if (tokenAuthMethod === 'basic_secret_only') {
		headers.Authorization = `Basic ${Buffer.from(`${clientSecret}:`).toString('base64')}`;
	} else {
		if (clientId) params.client_id = clientId;
		params.client_secret = clientSecret;
	}

	if (bodyFormat === 'json') {
		headers['Content-Type'] = 'application/json';
	} else {
		headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}

	const response = await fetch(tokenUrl, {
		method: 'POST',
		headers,
		body:
			bodyFormat === 'json'
				? JSON.stringify(params)
				: new URLSearchParams(params),
	});

	if (!response.ok) {
		throw new OAuthRefreshError(
			response.status,
			readErrorCode(await response.text()),
		);
	}

	const json = JSON.parse(await response.text()) as Record<string, unknown>;
	if (typeof json.access_token !== 'string' || json.access_token.length === 0) {
		throw new Error('OAuth token refresh returned no access_token');
	}

	return {
		access_token: json.access_token,
		...(typeof json.refresh_token === 'string' && json.refresh_token.length > 0
			? { refresh_token: json.refresh_token }
			: {}),
		...(typeof json.expires_in === 'number'
			? { expires_in: json.expires_in }
			: {}),
		...(typeof json.scope === 'string' && json.scope.length > 0
			? { scope: json.scope }
			: {}),
	};
}
