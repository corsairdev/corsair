import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const searchBundlesRoute = getRoute('searchBundles');
export const searchBundles: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, searchBundlesRoute);
};

export const BundlesEndpoints = {
	searchBundles,
};
