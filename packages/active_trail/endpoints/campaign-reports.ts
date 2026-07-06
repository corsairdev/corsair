import { activeTrailRoutes } from './routes';
import type { ActiveTrailEndpoint } from './factory';
import { executeActiveTrailOperation } from './factory';

function getRoute(name: string) {
	const route = activeTrailRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[active_trail] missing route: ${name}`);
	}
	return route;
}

const getAllCampaignReportsRoute = getRoute('getAllCampaignReports');
export const getAllCampaignReports: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAllCampaignReportsRoute);
};

const getAllSentCampaignsRoute = getRoute('getAllSentCampaigns');
export const getAllSentCampaigns: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAllSentCampaignsRoute);
};

const getCampaignBouncesRoute = getRoute('getCampaignBounces');
export const getCampaignBounces: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCampaignBouncesRoute);
};

const getCampaignReportsBouncedRoute = getRoute('getCampaignReportsBounced');
export const getCampaignReportsBounced: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCampaignReportsBouncedRoute);
};

const getCampaignReportsComplaintsRoute = getRoute('getCampaignReportsComplaints');
export const getCampaignReportsComplaints: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCampaignReportsComplaintsRoute);
};

const getCampaignReportsSentRoute = getRoute('getCampaignReportsSent');
export const getCampaignReportsSent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCampaignReportsSentRoute);
};

const getCampaignReportsUnopenedRoute = getRoute('getCampaignReportsUnopened');
export const getCampaignReportsUnopened: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCampaignReportsUnopenedRoute);
};

const getCampaignUnsubscribedRoute = getRoute('getCampaignUnsubscribed');
export const getCampaignUnsubscribed: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCampaignUnsubscribedRoute);
};

const getPushCampaignReportsRoute = getRoute('getPushCampaignReports');
export const getPushCampaignReports: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getPushCampaignReportsRoute);
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
