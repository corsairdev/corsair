import type { AgencyZoomEndpoint } from './factory';
import { executeAgencyZoomOperation, getRoute } from './factory';

const serviceTicketListRoute = getRoute('serviceTicketList');
export const serviceTicketList: AgencyZoomEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgencyZoomOperation(ctx, input, serviceTicketListRoute);
};

export const ServiceTicketsEndpoints = {
	serviceTicketList,
} as const;
