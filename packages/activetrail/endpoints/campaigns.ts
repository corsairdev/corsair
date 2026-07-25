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

const createCampaignRoute = getRoute('createCampaign');
export const createCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, createCampaignRoute);
};

const createCampaignForContactsRoute = getRoute('createCampaignForContacts');
export const createCampaignForContacts: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		createCampaignForContactsRoute,
	);
};

const deleteCampaignRoute = getRoute('deleteCampaign');
export const deleteCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteCampaignRoute);
};

const getCampaignDesignRoute = getRoute('getCampaignDesign');
export const getCampaignDesign: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignDesignRoute);
};

const getCampaignSchedulingRoute = getRoute('getCampaignScheduling');
export const getCampaignScheduling: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignSchedulingRoute);
};

const getCampaignsDetailsRoute = getRoute('getCampaignsDetails');
export const getCampaignsDetails: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignsDetailsRoute);
};

const getCampaignsSegmentRoute = getRoute('getCampaignsSegment');
export const getCampaignsSegment: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignsSegmentRoute);
};

const getCampaignsSentCampaignsRoute = getRoute('getCampaignsSentCampaigns');
export const getCampaignsSentCampaigns: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getCampaignsSentCampaignsRoute,
	);
};

const getCampaignTemplateRoute = getRoute('getCampaignTemplate');
export const getCampaignTemplate: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignTemplateRoute);
};

const getPushCampaignsRoute = getRoute('getPushCampaigns');
export const getPushCampaigns: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getPushCampaignsRoute);
};

const getTemplateRoute = getRoute('getTemplate');
export const getTemplate: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getTemplateRoute);
};

const listSmsCampaignsRoute = getRoute('listSmsCampaigns');
export const listSmsCampaigns: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, listSmsCampaignsRoute);
};

const putCampaignsSegmentRoute = getRoute('putCampaignsSegment');
export const putCampaignsSegment: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, putCampaignsSegmentRoute);
};

const updateCampaignDesignRoute = getRoute('updateCampaignDesign');
export const updateCampaignDesign: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateCampaignDesignRoute);
};

const updateCampaignSchedulingRoute = getRoute('updateCampaignScheduling');
export const updateCampaignScheduling: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateCampaignSchedulingRoute);
};

const updateCampaignSDetailsRoute = getRoute('updateCampaignSDetails');
export const updateCampaignSDetails: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateCampaignSDetailsRoute);
};

const updateCampaignTemplateRoute = getRoute('updateCampaignTemplate');
export const updateCampaignTemplate: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateCampaignTemplateRoute);
};

export const CampaignsEndpoints = {
	createCampaign,
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
	updateCampaignTemplate,
} as const;
