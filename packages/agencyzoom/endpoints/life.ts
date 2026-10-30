import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const searchLifeAndHealthLeadsRoute = getRoute('searchLifeAndHealthLeads');
export const searchLifeAndHealthLeads: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, searchLifeAndHealthLeadsRoute);
};

export const LifeEndpoints = {
	searchLifeAndHealthLeads,
} as const;
