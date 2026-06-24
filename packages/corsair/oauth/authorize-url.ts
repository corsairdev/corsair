import * as querystring from 'node:querystring';

import type { OAuthConfig } from '../core/plugins';

export type BuildOAuthAuthorizeUrlInput = {
	oauthConfig: OAuthConfig;
	clientId: string;
	redirectUri: string;
	state: string;
};

export function buildOAuthAuthorizeUrl(
	input: BuildOAuthAuthorizeUrlInput,
): string {
	const { oauthConfig, clientId, redirectUri, state } = input;

	const params = {
		...oauthConfig.authParams,
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: oauthConfig.scopes.join(' '),
		state,
	};

	return `${oauthConfig.authUrl}?${querystring.stringify(params)}`;
}
