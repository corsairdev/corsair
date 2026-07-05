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

const deleteAutomationsRoute = getRoute('deleteAutomations');
export const deleteAutomations: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteAutomationsRoute);
	await logActiveTrailOperation(ctx, input, deleteAutomationsRoute);
	return result;
};

const getAutomationLogRoute = getRoute('getAutomationLog');
export const getAutomationLog: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationLogRoute);
	await logActiveTrailOperation(ctx, input, getAutomationLogRoute);
	return result;
};

const getAutomationReportsLogAutomationQueueRoute = getRoute('getAutomationReportsLogAutomationQueue');
export const getAutomationReportsLogAutomationQueue: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationReportsLogAutomationQueueRoute);
	await logActiveTrailOperation(ctx, input, getAutomationReportsLogAutomationQueueRoute);
	return result;
};

const getAutomationsRoute = getRoute('getAutomations');
export const getAutomations: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationsRoute);
	await logActiveTrailOperation(ctx, input, getAutomationsRoute);
	return result;
};

const getAutomationsDetailsRoute = getRoute('getAutomationsDetails');
export const getAutomationsDetails: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationsDetailsRoute);
	await logActiveTrailOperation(ctx, input, getAutomationsDetailsRoute);
	return result;
};

const getAutomationsEmailCampaignStepsRoute = getRoute('getAutomationsEmailCampaignSteps');
export const getAutomationsEmailCampaignSteps: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationsEmailCampaignStepsRoute);
	await logActiveTrailOperation(ctx, input, getAutomationsEmailCampaignStepsRoute);
	return result;
};

const getAutomationsSmsCampaignStepsRoute = getRoute('getAutomationsSmsCampaignSteps');
export const getAutomationsSmsCampaignSteps: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationsSmsCampaignStepsRoute);
	await logActiveTrailOperation(ctx, input, getAutomationsSmsCampaignStepsRoute);
	return result;
};

const getAutomationTriggerTypesRoute = getRoute('getAutomationTriggerTypes');
export const getAutomationTriggerTypes: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getAutomationTriggerTypesRoute);
	await logActiveTrailOperation(ctx, input, getAutomationTriggerTypesRoute);
	return result;
};

const getUpdateActionsRoute = getRoute('getUpdateActions');
export const getUpdateActions: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getUpdateActionsRoute);
	await logActiveTrailOperation(ctx, input, getUpdateActionsRoute);
	return result;
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
