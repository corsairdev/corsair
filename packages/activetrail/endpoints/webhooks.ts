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

const createWebhookRoute = getRoute('createWebhook');
export const createWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, createWebhookRoute);
};

const deleteWebhookRoute = getRoute('deleteWebhook');
export const deleteWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, deleteWebhookRoute);
};

const deleteWebhooksParametersRoute = getRoute('deleteWebhooksParameters');
export const deleteWebhooksParameters: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, deleteWebhooksParametersRoute);
};

const getWebhookRoute = getRoute('getWebhook');
export const getWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getWebhookRoute);
};

const getWebhooksRoute = getRoute('getWebhooks');
export const getWebhooks: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getWebhooksRoute);
};

const getWebhooksParametersRoute = getRoute('getWebhooksParameters');
export const getWebhooksParameters: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, getWebhooksParametersRoute);
};

const postWebhooksParametersRoute = getRoute('postWebhooksParameters');
export const postWebhooksParameters: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, postWebhooksParametersRoute);
};

const postWebhooksTest2Route = getRoute('postWebhooksTest2');
export const postWebhooksTest2: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, postWebhooksTest2Route);
};

const testWebhookRoute = getRoute('testWebhook');
export const testWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, testWebhookRoute);
};

const updateWebhookRoute = getRoute('updateWebhook');
export const updateWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, updateWebhookRoute);
};

const updateWebhookParameterRoute = getRoute('updateWebhookParameter');
export const updateWebhookParameter: ActiveTrailEndpoint = async (
	ctx,
	input = {},
) => {
	return executeActiveTrailOperation(ctx, input, updateWebhookParameterRoute);
};

export const WebhooksEndpoints = {
	createWebhook,
	deleteWebhook,
	deleteWebhooksParameters,
	getWebhook,
	getWebhooks,
	getWebhooksParameters,
	postWebhooksParameters,
	postWebhooksTest2,
	testWebhook,
	updateWebhook,
	updateWebhookParameter,
} as const;
