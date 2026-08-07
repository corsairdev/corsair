import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const updateMyProfileRoute = getRoute('updateMyProfile');
export const updateMyProfile: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, updateMyProfileRoute);
};

export const ProfileEndpoints = {
	updateMyProfile,
} as const;
