import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { loyverseMetadataCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * OpenID Connect metadata.
 *
 * These two operations are unlike every other one here: they are served without
 * authentication and sit outside the versioned `/v1.0` base, on the bare host.
 * They exist so a caller building the OAuth flow can discover Loyverse's
 * endpoints and verify an id token's signature without hard-coding either.
 *
 * Neither is mirrored - both are public, cacheable documents belonging to
 * Loyverse rather than to the account.
 */

/**
 * Reads the discovery document, which advertises the authorization, token,
 * userinfo and JWKS endpoints along with the supported scopes.
 */
export const discovery: LoyverseEndpoints['oidcDiscovery'] = async (
	ctx,
	input,
) => {
	const result = await loyverseMetadataCall<
		LoyverseEndpointOutputs['oidcDiscovery']
	>('.well-known/openid-configuration');

	await logEventFromContext(ctx, 'loyverse.oidc.discovery', {}, 'completed');
	return result;
};

/**
 * Reads the JSON Web Key Set used to verify id token signatures.
 *
 * The published spec documents this at `/oidc/jwks`, which returns 404
 * NOT_FOUND. The working location is the `jwks_uri` the discovery document
 * advertises - `/.well-known/jwks.json` - confirmed live on 2026-08-13.
 * Following the spec here would have shipped an operation that never worked.
 */
export const jwks: LoyverseEndpoints['oidcJwks'] = async (ctx, input) => {
	const result = await loyverseMetadataCall<
		LoyverseEndpointOutputs['oidcJwks']
	>('.well-known/jwks.json');

	await logEventFromContext(ctx, 'loyverse.oidc.jwks', {}, 'completed');
	return result;
};
