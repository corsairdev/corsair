import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listProvincesRoute = getRoute('listProvinces');
export const listProvinces: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listProvincesRoute);
};

export const ProvincesEndpoints = {
	listProvinces,
};
