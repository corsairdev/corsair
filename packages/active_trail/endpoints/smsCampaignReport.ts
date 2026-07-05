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

const getAutomationReportsSmsCampaignSummaryRoute = getRoute('getAutomationReportsSmsCampaignSummary');
export const getAutomationReportsSmsCampaignSummary: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationReportsSmsCampaignSummaryRoute);
	await logActiveTrailOperation(ctx, input, getAutomationReportsSmsCampaignSummaryRoute);
	return result;
};

const getAutomationReportsSummaryReportRoute = getRoute('getAutomationReportsSummaryReport');
export const getAutomationReportsSummaryReport: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationReportsSummaryReportRoute);
	await logActiveTrailOperation(ctx, input, getAutomationReportsSummaryReportRoute);
	return result;
};

const getCampaignDomainsReportRoute = getRoute('getCampaignDomainsReport');
export const getCampaignDomainsReport: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignDomainsReportRoute);
	await logActiveTrailOperation(ctx, input, getCampaignDomainsReportRoute);
	return result;
};

const getCampaignReportRoute = getRoute('getCampaignReport');
export const getCampaignReport: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCampaignReportRoute);
	await logActiveTrailOperation(ctx, input, getCampaignReportRoute);
	return result;
};

const getPushCampaignReportSummaryRoute = getRoute('getPushCampaignReportSummary');
export const getPushCampaignReportSummary: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignReportSummaryRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignReportSummaryRoute);
	return result;
};

const getSmsCampaignDeliveredRoute = getRoute('getSmsCampaignDelivered');
export const getSmsCampaignDelivered: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignDeliveredRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignDeliveredRoute);
	return result;
};

const getSmsCampaignReportRoute = getRoute('getSmsCampaignReport');
export const getSmsCampaignReport: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportRoute);
	return result;
};

const getSmsCampaignReportClicksRoute = getRoute('getSmsCampaignReportClicks');
export const getSmsCampaignReportClicks: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportClicksRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportClicksRoute);
	return result;
};

const getSmsCampaignReportFailedRoute = getRoute('getSmsCampaignReportFailed');
export const getSmsCampaignReportFailed: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportFailedRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportFailedRoute);
	return result;
};

const getSmsCampaignReportSentRoute = getRoute('getSmsCampaignReportSent');
export const getSmsCampaignReportSent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportSentRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportSentRoute);
	return result;
};

const getSmsCampaignReportSummaryRoute = getRoute('getSmsCampaignReportSummary');
export const getSmsCampaignReportSummary: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportSummaryRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportSummaryRoute);
	return result;
};

const getSmsCampaignReportUnsubscribedRoute = getRoute('getSmsCampaignReportUnsubscribed');
export const getSmsCampaignReportUnsubscribed: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getSmsCampaignReportUnsubscribedRoute);
	await logActiveTrailOperation(ctx, input, getSmsCampaignReportUnsubscribedRoute);
	return result;
};

export const SmsCampaignReportEndpoints = {
	getAutomationReportsSmsCampaignSummary,
	getAutomationReportsSummaryReport,
	getCampaignDomainsReport,
	getCampaignReport,
	getPushCampaignReportSummary,
	getSmsCampaignDelivered,
	getSmsCampaignReport,
	getSmsCampaignReportClicks,
	getSmsCampaignReportFailed,
	getSmsCampaignReportSent,
	getSmsCampaignReportSummary,
	getSmsCampaignReportUnsubscribed
} as const;
