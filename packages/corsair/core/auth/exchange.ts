import * as https from 'node:https';
import * as querystring from 'node:querystring';
import type { OAuthConfig } from '../plugins';

const TOKEN_NUMERIC_FIELDS = ['expires_in', 'refresh_token_expires_in'];

/**
 * Parses a token endpoint response as JSON, falling back to form-urlencoded
 * (GitHub's default). Returns null if neither yields an access_token or error.
 */
export function parseTokenResponse(data: string): TokenResponse | null {
	try {
		return JSON.parse(data) as TokenResponse;
	} catch {
		// not JSON — try form-urlencoded
	}
	if (!data.includes('=')) return null;
	const form = querystring.parse(data) as Record<string, string>;
	if (!form.access_token && !form.error) return null;
	const out: TokenResponse = { ...form };
	for (const key of TOKEN_NUMERIC_FIELDS) {
		if (typeof form[key] === 'string') out[key] = Number(form[key]);
	}
	return out;
}

export type TokenResponse = {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
	// Providers return extra fields (team_id, installation, hub_id, etc.) used by
	// oauthWebhookTenantLinkResolver to populate webhook tenant routing keys.
	[key: string]: unknown;
};

/**
 * Exchanges an OAuth authorization code for access/refresh tokens.
 * Supports both 'body' (default) and 'basic' token auth methods.
 */
export function exchangeCodeForTokens(
	code: string,
	clientId: string,
	clientSecret: string,
	oauthConfig: OAuthConfig,
	redirectUri: string,
): Promise<TokenResponse> {
	const tokenUrl = new URL(oauthConfig.tokenUrl);
	const useBasicAuth = oauthConfig.tokenAuthMethod === 'basic';

	return new Promise((resolve, reject) => {
		const postDataParams: Record<string, string> = {
			code: code.trim(),
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
		};

		if (!useBasicAuth) {
			postDataParams.client_id = clientId;
			postDataParams.client_secret = clientSecret;
		}

		const postData = querystring.stringify(postDataParams);
		const headers: Record<string, string> = {
			'Content-Type': 'application/x-www-form-urlencoded',
			// GitHub (and some others) default to a form-urlencoded token response;
			// ask for JSON explicitly so parsing is predictable.
			Accept: 'application/json',
			'Content-Length': Buffer.byteLength(postData).toString(),
		};

		if (useBasicAuth) {
			headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
		}

		const req = https.request(
			{
				hostname: tokenUrl.hostname,
				...(tokenUrl.port ? { port: Number(tokenUrl.port) } : {}),
				path: tokenUrl.pathname + tokenUrl.search,
				method: 'POST',
				headers,
			},
			(res) => {
				let data = '';
				res.on('data', (chunk) => {
					data += chunk;
				});
				res.on('end', () => {
					if (res.statusCode !== 200) {
						reject(
							new Error(`Token exchange failed (${res.statusCode}): ${data}`),
						);
						return;
					}
					const parsed = parseTokenResponse(data);
					if (parsed) {
						resolve(parsed);
					} else {
						reject(
							new Error(`Token endpoint returned non-JSON response: ${data}`),
						);
					}
				});
			},
		);
		req.on('error', (error) =>
			reject(new Error(`Request failed: ${error.message}`)),
		);
		req.write(postData);
		req.end();
	});
}
