import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[active_trail] missing route: ${name}`);
	}
	return route;
}

const getTransactionalMessagesClassificationRoute = getRoute('getTransactionalMessagesClassification');
export const getTransactionalMessagesClassification: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTransactionalMessagesClassificationRoute);
	await logActiveTrailOperation(ctx, input, getTransactionalMessagesClassificationRoute);
	return result;
};

export const OperationalMessageEndpoints = {
	getTransactionalMessagesClassification
} as const;
