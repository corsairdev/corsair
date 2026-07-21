import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const getLogsRoute = getRoute('getLogs');
export const getLogs: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getLogsRoute);
};

export const LogsEndpoints = {
	getLogs,
} as const;
