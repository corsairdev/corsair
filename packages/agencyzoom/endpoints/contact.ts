import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const batchCreateContactRoute = getRoute('batchCreateContact');
export const batchCreateContact: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, batchCreateContactRoute);
};

export const ContactEndpoints = {
	batchCreateContact,
} as const;
