import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { logActiveTrailOperation, requestActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[active_trail] missing route: ${name}`);
	}
	return route;
}

const getAllCampaignReportsRoute = getRoute('getAllCampaignReports');
export const getAllCampaignReports: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAllCampaignReportsRoute);
	await logActiveTrailOperation(ctx, input, getAllCampaignReportsRoute);
	return result;
};

const getAllSentCampaignsRoute = getRoute('getAllSentCampaigns');
export const getAllSentCampaigns: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAllSentCampaignsRoute);
	await logActiveTrailOperation(ctx, input, getAllSentCampaignsRoute);
	return result;
};

const getCampaignBouncesRoute = getRoute('getCampaignBounces');
export const getCampaignBounces: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignBouncesRoute);
	await logActiveTrailOperation(ctx, input, getCampaignBouncesRoute);
	return result;
};

const getCampaignReportsBouncedRoute = getRoute('getCampaignReportsBounced');
export const getCampaignReportsBounced: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignReportsBouncedRoute);
	await logActiveTrailOperation(ctx, input, getCampaignReportsBouncedRoute);
	return result;
};

const getCampaignReportsComplaintsRoute = getRoute('getCampaignReportsComplaints');
export const getCampaignReportsComplaints: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignReportsComplaintsRoute);
	await logActiveTrailOperation(ctx, input, getCampaignReportsComplaintsRoute);
	return result;
};

const getCampaignReportsSentRoute = getRoute('getCampaignReportsSent');
export const getCampaignReportsSent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignReportsSentRoute);
	await logActiveTrailOperation(ctx, input, getCampaignReportsSentRoute);
	return result;
};

const getCampaignReportsUnopenedRoute = getRoute('getCampaignReportsUnopened');
export const getCampaignReportsUnopened: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignReportsUnopenedRoute);
	await logActiveTrailOperation(ctx, input, getCampaignReportsUnopenedRoute);
	return result;
};

const getCampaignUnsubscribedRoute = getRoute('getCampaignUnsubscribed');
export const getCampaignUnsubscribed: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignUnsubscribedRoute);
	await logActiveTrailOperation(ctx, input, getCampaignUnsubscribedRoute);
	return result;
};

const getPushCampaignReportsRoute = getRoute('getPushCampaignReports');
export const getPushCampaignReports: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignReportsRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignReportsRoute);
	return result;
};

export const CampaignReportsEndpoints = {
	getAllCampaignReports,
	getAllSentCampaigns,
	getCampaignBounces,
	getCampaignReportsBounced,
	getCampaignReportsComplaints,
	getCampaignReportsSent,
	getCampaignReportsUnopened,
	getCampaignUnsubscribed,
	getPushCampaignReports
} as const;
