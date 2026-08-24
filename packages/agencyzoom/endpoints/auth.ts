import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const logTheUserInRoute = getRoute('logTheUserIn');
export const logTheUserIn: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, logTheUserInRoute);
};

const logTheUserOutRoute = getRoute('logTheUserOut');
export const logTheUserOut: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, logTheUserOutRoute);
};

const v4SsoLogTheUserInRoute = getRoute('v4SsoLogTheUserIn');
export const v4SsoLogTheUserIn: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, v4SsoLogTheUserInRoute);
};

export const AuthEndpoints = {
	logTheUserIn,
	logTheUserOut,
	v4SsoLogTheUserIn,
} as const;
