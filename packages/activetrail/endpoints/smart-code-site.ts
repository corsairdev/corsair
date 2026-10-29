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

const createSmartCodeSiteRoute = getRoute('createSmartCodeSite');
export const createSmartCodeSite: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, createSmartCodeSiteRoute);
};

const deleteSmartCodeSiteRoute = getRoute('deleteSmartCodeSite');
export const deleteSmartCodeSite: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, deleteSmartCodeSiteRoute);
};

const getSmartCodeSitesRoute = getRoute('getSmartCodeSites');
export const getSmartCodeSites: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmartCodeSitesRoute);
};

const updateSmartCodeSiteRoute = getRoute('updateSmartCodeSite');
export const updateSmartCodeSite: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateSmartCodeSiteRoute);
};

export const SmartCodeSiteEndpoints = {
	createSmartCodeSite,
	deleteSmartCodeSite,
	getSmartCodeSites,
	updateSmartCodeSite,
} as const;
