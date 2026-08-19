import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const authenticateForJwtviaV4SsoRoute = getRoute('authenticateForJwtviaV4Sso');
export const authenticateForJwtviaV4Sso: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(
		ctx,
		input,
		authenticateForJwtviaV4SsoRoute,
	);
};

const getAuthUrlForV4SsoRoute = getRoute('getAuthUrlForV4Sso');
export const getAuthUrlForV4Sso: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, getAuthUrlForV4SsoRoute);
};

export const V4ssoEndpoints = {
	authenticateForJwtviaV4Sso,
	getAuthUrlForV4Sso,
} as const;
