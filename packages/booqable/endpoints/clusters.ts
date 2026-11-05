import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listClustersRoute = getRoute('listClusters');
export const listClusters: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listClustersRoute);
};

export const ClustersEndpoints = {
	listClusters,
};
