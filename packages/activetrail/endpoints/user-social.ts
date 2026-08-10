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

const getUserSocialAccountsGetRoute = getRoute('getUserSocialAccountsGet');
export const getUserSocialAccountsGet: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getUserSocialAccountsGetRoute);
};

export const UserSocialEndpoints = {
	getUserSocialAccountsGet,
} as const;
