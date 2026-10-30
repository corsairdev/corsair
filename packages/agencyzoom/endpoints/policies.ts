import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const updateAPolicyRoute = getRoute('updateAPolicy');
export const updateAPolicy: AgencyZoomEndpoint = async (ctx, input = {}) => {
	return executeAgencyZoomOperation(ctx, input, updateAPolicyRoute);
};

const updateTagsForAPolicyRoute = getRoute('updateTagsForAPolicy');
export const updateTagsForAPolicy: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, updateTagsForAPolicyRoute);
};

export const PoliciesEndpoints = {
	updateAPolicy,
	updateTagsForAPolicy,
} as const;
