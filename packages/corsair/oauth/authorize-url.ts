import * as querystring from 'node:querystring';

import type { OAuthConfig } from '../core/plugins';
import { pkceAuthParams } from './pkce';

export type BuildOAuthAuthorizeUrlInput = {
	oauthConfig: OAuthConfig;
	clientId: string;
	redirectUri: string;
	state: string;
	/**
	 * For a provider with `pkce`, the verifier whose challenge goes on the link
	 * (see oauth/pkce). Left out, the link carries no challenge.
	 */
	codeVerifier?: string;
};

export function buildOAuthAuthorizeUrl(
	input: BuildOAuthAuthorizeUrlInput,
): string {
	const { oauthConfig, clientId, redirectUri, state, codeVerifier } = input;

	const params = {
		...oauthConfig.authParams,
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthConfig.scopes.join(' '),
		state,
		...(oauthConfig.pkce && codeVerifier
			? pkceAuthParams(codeVerifier, oauthConfig.authParams)
			: {}),
	};

	return `${oauthConfig.authUrl}?${querystring.stringify(params)}`;
}
