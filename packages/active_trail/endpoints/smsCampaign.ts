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

const createSmsCampaignRoute = getRoute('createSmsCampaign');
export const createSmsCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createSmsCampaignRoute);
	await logActiveTrailOperation(ctx, input, createSmsCampaignRoute);
	return result;
};

const getCampaignClicksRoute = getRoute('getCampaignClicks');
export const getCampaignClicks: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignClicksRoute);
	await logActiveTrailOperation(ctx, input, getCampaignClicksRoute);
	return result;
};

const getCampaignOpensRoute = getRoute('getCampaignOpens');
export const getCampaignOpens: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignOpensRoute);
	await logActiveTrailOperation(ctx, input, getCampaignOpensRoute);
	return result;
};

const getCampaignSDetailsRoute = getRoute('getCampaignSDetails');
export const getCampaignSDetails: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignSDetailsRoute);
	await logActiveTrailOperation(ctx, input, getCampaignSDetailsRoute);
	return result;
};

const getPushCampaignOpensRoute = getRoute('getPushCampaignOpens');
export const getPushCampaignOpens: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignOpensRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignOpensRoute);
	return result;
};

const getSmsCampaignRoute = getRoute('getSmsCampaign');
export const getSmsCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignRoute);
	return result;
};

const getSmsCampaignClickersRoute = getRoute('getSmsCampaignClickers');
export const getSmsCampaignClickers: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignClickersRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignClickersRoute);
	return result;
};

const getSmsCampaignEstimateRoute = getRoute('getSmsCampaignEstimate');
export const getSmsCampaignEstimate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignEstimateRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignEstimateRoute);
	return result;
};

const getSmsCampaignReportsRoute = getRoute('getSmsCampaignReports');
export const getSmsCampaignReports: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportsRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportsRoute);
	return result;
};

const getTransactionalSmsMessageRoute = getRoute('getTransactionalSmsMessage');
export const getTransactionalSmsMessage: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTransactionalSmsMessageRoute);
	await logActiveTrailOperation(ctx, input, getTransactionalSmsMessageRoute);
	return result;
};

const updateCampaignRoute = getRoute('updateCampaign');
export const updateCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateCampaignRoute);
	await logActiveTrailOperation(ctx, input, updateCampaignRoute);
	return result;
};

const updateSmsOperationalMessageRoute = getRoute('updateSmsOperationalMessage');
export const updateSmsOperationalMessage: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateSmsOperationalMessageRoute);
	await logActiveTrailOperation(ctx, input, updateSmsOperationalMessageRoute);
	return result;
};

export const SmsCampaignEndpoints = {
	createSmsCampaign,
	getCampaignClicks,
	getCampaignOpens,
	getCampaignSDetails,
	getPushCampaignOpens,
	getSmsCampaign,
	getSmsCampaignClickers,
	getSmsCampaignEstimate,
	getSmsCampaignReports,
	getTransactionalSmsMessage,
	updateCampaign,
	updateSmsOperationalMessage
} as const;
