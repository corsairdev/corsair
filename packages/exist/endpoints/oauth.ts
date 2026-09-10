import type { AccountKeyManagerFor } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { EXIST_OAUTH_AUTHORIZE_URL } from '../client';
import type { ExistEndpoints } from '../index';
import { parseExistInput } from './validate';

/**
 * Builds the Exist authorisation URL the user must visit to grant access.
 *
 * This operation makes no API call — it only constructs the URL. Exist returns
 * the user to `redirect_url` with a `code` (or an `error`) in the query string;
 * Corsair's OAuth2 machinery exchanges that code at the token endpoint.
 *
 * Parameters follow the official flow: `response_type=code`, `client_id`,
 * `redirect_uri` and a space-separated `scope` list.
 * @see https://developer.exist.io/reference/authentication/oauth2/
 */
export const authorize: ExistEndpoints['oauthAuthorize'] = async (
	ctx,
	rawInput,
) => {
	const input = parseExistInput('oauthAuthorize', rawInput);
	if (ctx.options.authType === 'managed') {
		throw new Error(
			'oauthAuthorize is only available for oauth_2 (BYO) auth; managed connections are authorised through the Hub.',
		);
	}
	const credentials = await (
		ctx.keys as AccountKeyManagerFor<'oauth_2'>
	).get_integration_credentials();

	if (!credentials.client_id) {
		throw new Error(
			'Exist client_id is not configured; set it on the integration before building an authorisation URL',
		);
	}
	if (!credentials.redirect_url) {
		throw new Error(
			'Exist redirect_url is not configured; set it to the redirect URI registered with your Exist OAuth2 client',
		);
	}
	// Exist rejects non-HTTPS redirect URIs, so fail here with a clear message
	// rather than sending the user to an authorisation page that will error.
	if (!credentials.redirect_url.startsWith('https://')) {
		throw new Error(
			'Exist requires an HTTPS redirect_url; update the integration credentials to use https://',
		);
	}

	const scopes = input.scopes ?? ctx.options.scopes ?? [];
	if (scopes.length === 0) {
		throw new Error(
			'At least one Exist scope is required to build an authorisation URL',
		);
	}

	// `state` is not required by Exist but is standard OAuth2 CSRF protection:
	// a per-call unguessable value the caller stores and compares against the
	// `state` Exist echoes back, so a replayed redirect cannot be accepted.
	const state = crypto.randomUUID();

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: credentials.client_id,
		redirect_uri: credentials.redirect_url,
		scope: scopes.join(' '),
		state,
	});

	const url = `${EXIST_OAUTH_AUTHORIZE_URL}?${params.toString()}`;

	// Only the scope count is recorded: the URL embeds the client id and the
	// redirect target, neither of which belongs in a persistent event log.
	await logEventFromContext(
		ctx,
		'exist.oauth.authorize',
		{ scopeCount: scopes.length },
		'completed',
	);

	return { url, state, scopes };
};
