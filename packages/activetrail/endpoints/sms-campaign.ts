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

const createSmsCampaignRoute = getRoute('createSmsCampaign');
export const createSmsCampaign: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, createSmsCampaignRoute);
};

const getCampaignClicksRoute = getRoute('getCampaignClicks');
export const getCampaignClicks: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignClicksRoute);
};

const getCampaignOpensRoute = getRoute('getCampaignOpens');
export const getCampaignOpens: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignOpensRoute);
};

const getCampaignSDetailsRoute = getRoute('getCampaignSDetails');
export const getCampaignSDetails: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignSDetailsRoute);
};

const getPushCampaignOpensRoute = getRoute('getPushCampaignOpens');
export const getPushCampaignOpens: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getPushCampaignOpensRoute);
};

const getSmsCampaignRoute = getRoute('getSmsCampaign');
export const getSmsCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignRoute);
};

const getSmsCampaignClickersRoute = getRoute('getSmsCampaignClickers');
export const getSmsCampaignClickers: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignClickersRoute);
};

const getSmsCampaignEstimateRoute = getRoute('getSmsCampaignEstimate');
export const getSmsCampaignEstimate: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignEstimateRoute);
};

const getSmsCampaignReportsRoute = getRoute('getSmsCampaignReports');
export const getSmsCampaignReports: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignReportsRoute);
};

const getTransactionalSmsMessageRoute = getRoute('getTransactionalSmsMessage');
export const getTransactionalSmsMessage: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getTransactionalSmsMessageRoute,
	);
};

const updateCampaignRoute = getRoute('updateCampaign');
export const updateCampaign: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, updateCampaignRoute);
};

const updateSmsOperationalMessageRoute = getRoute(
	'updateSmsOperationalMessage',
);
export const updateSmsOperationalMessage: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		updateSmsOperationalMessageRoute,
	);
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
	updateSmsOperationalMessage,
} as const;
