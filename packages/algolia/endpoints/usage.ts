import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const getUsageRoute = getRoute('getUsage');
export const getUsage: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getUsageRoute);
};

const getUsageForIndexRoute = getRoute('getUsageForIndex');
export const getUsageForIndex: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getUsageForIndexRoute);
};

export const UsageEndpoints = {
	getUsage,
	getUsageForIndex,
} as const;
