import type { ActiveTrailEndpoint } from './factory';
import { executeActiveTrailOperation } from './factory';
import { activeTrailRoutes } from './routes';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[activetrail] missing route: ${name}`);
	}
	return route;
}

const getTransactionalMessagesClassificationRoute = getRoute(
	'getTransactionalMessagesClassification',
);
export const getTransactionalMessagesClassification: ActiveTrailEndpoint =
	async (ctx, input = {}) => {
		return executeActiveTrailOperation(
			ctx,
			input,
			getTransactionalMessagesClassificationRoute,
		);
	};

export const OperationalMessageEndpoints = {
	getTransactionalMessagesClassification,
} as const;
