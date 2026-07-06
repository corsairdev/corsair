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

const deleteAutomationsRoute = getRoute('deleteAutomations');
export const deleteAutomations: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteAutomationsRoute);
};

const getAutomationLogRoute = getRoute('getAutomationLog');
export const getAutomationLog: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationLogRoute);
};

const getAutomationReportsLogAutomationQueueRoute = getRoute('getAutomationReportsLogAutomationQueue');
export const getAutomationReportsLogAutomationQueue: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationReportsLogAutomationQueueRoute);
};

const getAutomationsRoute = getRoute('getAutomations');
export const getAutomations: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationsRoute);
};

const getAutomationsDetailsRoute = getRoute('getAutomationsDetails');
export const getAutomationsDetails: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationsDetailsRoute);
};

const getAutomationsEmailCampaignStepsRoute = getRoute('getAutomationsEmailCampaignSteps');
export const getAutomationsEmailCampaignSteps: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationsEmailCampaignStepsRoute);
};

const getAutomationsSmsCampaignStepsRoute = getRoute('getAutomationsSmsCampaignSteps');
export const getAutomationsSmsCampaignSteps: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationsSmsCampaignStepsRoute);
};

const getAutomationTriggerTypesRoute = getRoute('getAutomationTriggerTypes');
export const getAutomationTriggerTypes: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getAutomationTriggerTypesRoute);
};

const getUpdateActionsRoute = getRoute('getUpdateActions');
export const getUpdateActions: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getUpdateActionsRoute);
};

export const AutomationsEndpoints = {
	deleteAutomations,
	getAutomationLog,
	getAutomationReportsLogAutomationQueue,
	getAutomations,
	getAutomationsDetails,
	getAutomationsEmailCampaignSteps,
	getAutomationsSmsCampaignSteps,
	getAutomationTriggerTypes,
	getUpdateActions
} as const;
