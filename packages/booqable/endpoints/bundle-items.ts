import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listBundleItemsRoute = getRoute('listBundleItems');
export const listBundleItems: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listBundleItemsRoute);
};

export const BundleItemsEndpoints = {
	listBundleItems,
};
