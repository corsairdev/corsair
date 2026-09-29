import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listLocationsRoute = getRoute('listLocations');
export const listLocations: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listLocationsRoute);
};

export const LocationsEndpoints = {
	listLocations,
};
