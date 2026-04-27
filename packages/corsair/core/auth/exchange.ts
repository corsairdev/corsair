import * as https from 'node:https';
import * as querystring from 'node:querystring';
import type { OAuthConfig } from '../plugins';

export type TokenResponse = {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
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
			'Content-Length': Buffer.byteLength(postData).toString(),
		};

		if (useBasicAuth) {
			headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
		}

		const req = https.request(
			{
				hostname: tokenUrl.hostname,
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
						reject(new Error(`Token exchange failed (${res.statusCode}): ${data}`));
						return;
					}
					resolve(JSON.parse(data) as TokenResponse);
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
