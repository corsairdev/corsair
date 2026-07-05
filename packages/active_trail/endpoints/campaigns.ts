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

const createCampaignForContactsRoute = getRoute('createCampaignForContacts');
export const createCampaignForContacts: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createCampaignForContactsRoute);
	await logActiveTrailOperation(ctx, input, createCampaignForContactsRoute);
	return result;
};

const deleteCampaignRoute = getRoute('deleteCampaign');
export const deleteCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteCampaignRoute);
	await logActiveTrailOperation(ctx, input, deleteCampaignRoute);
	return result;
};

const getCampaignDesignRoute = getRoute('getCampaignDesign');
export const getCampaignDesign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignDesignRoute);
	await logActiveTrailOperation(ctx, input, getCampaignDesignRoute);
	return result;
};

const getCampaignSchedulingRoute = getRoute('getCampaignScheduling');
export const getCampaignScheduling: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignSchedulingRoute);
	await logActiveTrailOperation(ctx, input, getCampaignSchedulingRoute);
	return result;
};

const getCampaignsDetailsRoute = getRoute('getCampaignsDetails');
export const getCampaignsDetails: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignsDetailsRoute);
	await logActiveTrailOperation(ctx, input, getCampaignsDetailsRoute);
	return result;
};

const getCampaignsSegmentRoute = getRoute('getCampaignsSegment');
export const getCampaignsSegment: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignsSegmentRoute);
	await logActiveTrailOperation(ctx, input, getCampaignsSegmentRoute);
	return result;
};

const getCampaignsSentCampaignsRoute = getRoute('getCampaignsSentCampaigns');
export const getCampaignsSentCampaigns: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignsSentCampaignsRoute);
	await logActiveTrailOperation(ctx, input, getCampaignsSentCampaignsRoute);
	return result;
};

const getCampaignTemplateRoute = getRoute('getCampaignTemplate');
export const getCampaignTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignTemplateRoute);
	await logActiveTrailOperation(ctx, input, getCampaignTemplateRoute);
	return result;
};

const getPushCampaignsRoute = getRoute('getPushCampaigns');
export const getPushCampaigns: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignsRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignsRoute);
	return result;
};

const getTemplateRoute = getRoute('getTemplate');
export const getTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getTemplateRoute);
	await logActiveTrailOperation(ctx, input, getTemplateRoute);
	return result;
};

const listSmsCampaignsRoute = getRoute('listSmsCampaigns');
export const listSmsCampaigns: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, listSmsCampaignsRoute);
	await logActiveTrailOperation(ctx, input, listSmsCampaignsRoute);
	return result;
};

const putCampaignsSegmentRoute = getRoute('putCampaignsSegment');
export const putCampaignsSegment: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, putCampaignsSegmentRoute);
	await logActiveTrailOperation(ctx, input, putCampaignsSegmentRoute);
	return result;
};

const updateCampaignDesignRoute = getRoute('updateCampaignDesign');
export const updateCampaignDesign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateCampaignDesignRoute);
	await logActiveTrailOperation(ctx, input, updateCampaignDesignRoute);
	return result;
};

const updateCampaignSchedulingRoute = getRoute('updateCampaignScheduling');
export const updateCampaignScheduling: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateCampaignSchedulingRoute);
	await logActiveTrailOperation(ctx, input, updateCampaignSchedulingRoute);
	return result;
};

const updateCampaignSDetailsRoute = getRoute('updateCampaignSDetails');
export const updateCampaignSDetails: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateCampaignSDetailsRoute);
	await logActiveTrailOperation(ctx, input, updateCampaignSDetailsRoute);
	return result;
};

const updateCampaignTemplateRoute = getRoute('updateCampaignTemplate');
export const updateCampaignTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateCampaignTemplateRoute);
	await logActiveTrailOperation(ctx, input, updateCampaignTemplateRoute);
	return result;
};

export const CampaignsEndpoints = {
	createCampaignForContacts,
	deleteCampaign,
	getCampaignDesign,
	getCampaignScheduling,
	getCampaignsDetails,
	getCampaignsSegment,
	getCampaignsSentCampaigns,
	getCampaignTemplate,
	getPushCampaigns,
	getTemplate,
	listSmsCampaigns,
	putCampaignsSegment,
	updateCampaignDesign,
	updateCampaignScheduling,
	updateCampaignSDetails,
	updateCampaignTemplate
} as const;
