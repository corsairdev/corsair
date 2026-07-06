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

const getPushCampaignReportDeliveredRoute = getRoute('getPushCampaignReportDelivered');
export const getPushCampaignReportDelivered: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getPushCampaignReportDeliveredRoute);
};

const getPushCampaignReportFailedRoute = getRoute('getPushCampaignReportFailed');
export const getPushCampaignReportFailed: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getPushCampaignReportFailedRoute);
};

const getPushCampaignReportSentRoute = getRoute('getPushCampaignReportSent');
export const getPushCampaignReportSent: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getPushCampaignReportSentRoute);
};

export const PushCampaignReportEndpoints = {
	getPushCampaignReportDelivered,
	getPushCampaignReportFailed,
	getPushCampaignReportSent
} as const;
