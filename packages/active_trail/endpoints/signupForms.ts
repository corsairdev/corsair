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

const getSignupFormsRoute = getRoute('getSignupForms');
export const getSignupForms: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSignupFormsRoute);
	await logActiveTrailOperation(ctx, input, getSignupFormsRoute);
	return result;
};

export const SignupFormsEndpoints = {
	getSignupForms
} as const;
