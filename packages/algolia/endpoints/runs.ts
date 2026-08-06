import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const listRunsRoute = getRoute('listRuns');
export const listRuns: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listRunsRoute);
};

export const RunsEndpoints = {
	listRuns,
} as const;
