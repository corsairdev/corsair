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

const getPushCampaignReportDeliveredRoute = getRoute('getPushCampaignReportDelivered');
export const getPushCampaignReportDelivered: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignReportDeliveredRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignReportDeliveredRoute);
	return result;
};

const getPushCampaignReportFailedRoute = getRoute('getPushCampaignReportFailed');
export const getPushCampaignReportFailed: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignReportFailedRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignReportFailedRoute);
	return result;
};

const getPushCampaignReportSentRoute = getRoute('getPushCampaignReportSent');
export const getPushCampaignReportSent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getPushCampaignReportSentRoute);
	await logActiveTrailOperation(ctx, input, getPushCampaignReportSentRoute);
	return result;
};

export const PushCampaignReportEndpoints = {
	getPushCampaignReportDelivered,
	getPushCampaignReportFailed,
	getPushCampaignReportSent
} as const;
