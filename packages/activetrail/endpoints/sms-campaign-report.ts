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

const getAutomationReportsSmsCampaignSummaryRoute = getRoute(
	'getAutomationReportsSmsCampaignSummary',
);
export const getAutomationReportsSmsCampaignSummary: ActiveTrailEndpoint =
	async (ctx, input = {}) => {
		return executeActiveTrailOperation(
			ctx,
			input,
			getAutomationReportsSmsCampaignSummaryRoute,
		);
	};

const getAutomationReportsSummaryReportRoute = getRoute(
	'getAutomationReportsSummaryReport',
);
export const getAutomationReportsSummaryReport: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getAutomationReportsSummaryReportRoute,
	);
};

const getCampaignDomainsReportRoute = getRoute('getCampaignDomainsReport');
export const getCampaignDomainsReport: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignDomainsReportRoute);
};

const getCampaignReportRoute = getRoute('getCampaignReport');
export const getCampaignReport: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getCampaignReportRoute);
};

const getPushCampaignReportSummaryRoute = getRoute(
	'getPushCampaignReportSummary',
);
export const getPushCampaignReportSummary: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getPushCampaignReportSummaryRoute,
	);
};

const getSmsCampaignDeliveredRoute = getRoute('getSmsCampaignDelivered');
export const getSmsCampaignDelivered: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignDeliveredRoute);
};

const getSmsCampaignReportRoute = getRoute('getSmsCampaignReport');
export const getSmsCampaignReport: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignReportRoute);
};

const getSmsCampaignReportClicksRoute = getRoute('getSmsCampaignReportClicks');
export const getSmsCampaignReportClicks: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSmsCampaignReportClicksRoute,
	);
};

const getSmsCampaignReportFailedRoute = getRoute('getSmsCampaignReportFailed');
export const getSmsCampaignReportFailed: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSmsCampaignReportFailedRoute,
	);
};

const getSmsCampaignReportSentRoute = getRoute('getSmsCampaignReportSent');
export const getSmsCampaignReportSent: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getSmsCampaignReportSentRoute);
};

const getSmsCampaignReportSummaryRoute = getRoute(
	'getSmsCampaignReportSummary',
);
export const getSmsCampaignReportSummary: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSmsCampaignReportSummaryRoute,
	);
};

const getSmsCampaignReportUnsubscribedRoute = getRoute(
	'getSmsCampaignReportUnsubscribed',
);
export const getSmsCampaignReportUnsubscribed: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(
		ctx,
		input,
		getSmsCampaignReportUnsubscribedRoute,
	);
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
	getSmsCampaignReportUnsubscribed,
} as const;
