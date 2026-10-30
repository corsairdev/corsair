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
		throw new Error(
			`OAuth token refresh failed (${response.status}): ${await response.text()}`,
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
