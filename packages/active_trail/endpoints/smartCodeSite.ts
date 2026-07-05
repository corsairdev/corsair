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

const createSmartCodeSiteRoute = getRoute('createSmartCodeSite');
export const createSmartCodeSite: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createSmartCodeSiteRoute);
	await logActiveTrailOperation(ctx, input, createSmartCodeSiteRoute);
	return result;
};

const deleteSmartCodeSiteRoute = getRoute('deleteSmartCodeSite');
export const deleteSmartCodeSite: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteSmartCodeSiteRoute);
	await logActiveTrailOperation(ctx, input, deleteSmartCodeSiteRoute);
	return result;
};

const getSmartCodeSitesRoute = getRoute('getSmartCodeSites');
export const getSmartCodeSites: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmartCodeSitesRoute);
	await logActiveTrailOperation(ctx, input, getSmartCodeSitesRoute);
	return result;
};

const updateSmartCodeSiteRoute = getRoute('updateSmartCodeSite');
export const updateSmartCodeSite: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateSmartCodeSiteRoute);
	await logActiveTrailOperation(ctx, input, updateSmartCodeSiteRoute);
	return result;
};

export const SmartCodeSiteEndpoints = {
	createSmartCodeSite,
	deleteSmartCodeSite,
	getSmartCodeSites,
	updateSmartCodeSite
} as const;
