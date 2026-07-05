import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error('[active_trail] missing route: ${name}');
	}
	return route;
}

const getLandingPagesRoute = getRoute('getLandingPages');
export const getLandingPages: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getLandingPagesRoute);
	await logActiveTrailOperation(ctx, input, getLandingPagesRoute);
	return result;
};

export const LandingpageEndpoints = {
	getLandingPages
} as const;
