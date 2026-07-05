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

const createWebhookRoute = getRoute('createWebhook');
export const createWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createWebhookRoute);
	await logActiveTrailOperation(ctx, input, createWebhookRoute);
	return result;
};

const deleteWebhookRoute = getRoute('deleteWebhook');
export const deleteWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteWebhookRoute);
	await logActiveTrailOperation(ctx, input, deleteWebhookRoute);
	return result;
};

const deleteWebhooksParametersRoute = getRoute('deleteWebhooksParameters');
export const deleteWebhooksParameters: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, deleteWebhooksParametersRoute);
	await logActiveTrailOperation(ctx, input, deleteWebhooksParametersRoute);
	return result;
};

const getWebhookRoute = getRoute('getWebhook');
export const getWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getWebhookRoute);
	await logActiveTrailOperation(ctx, input, getWebhookRoute);
	return result;
};

const getWebhooksRoute = getRoute('getWebhooks');
export const getWebhooks: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getWebhooksRoute);
	await logActiveTrailOperation(ctx, input, getWebhooksRoute);
	return result;
};

const getWebhooksParametersRoute = getRoute('getWebhooksParameters');
export const getWebhooksParameters: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getWebhooksParametersRoute);
	await logActiveTrailOperation(ctx, input, getWebhooksParametersRoute);
	return result;
};

const postWebhooksParametersRoute = getRoute('postWebhooksParameters');
export const postWebhooksParameters: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, postWebhooksParametersRoute);
	await logActiveTrailOperation(ctx, input, postWebhooksParametersRoute);
	return result;
};

const postWebhooksTest2Route = getRoute('postWebhooksTest2');
export const postWebhooksTest2: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, postWebhooksTest2Route);
	await logActiveTrailOperation(ctx, input, postWebhooksTest2Route);
	return result;
};

const testWebhookRoute = getRoute('testWebhook');
export const testWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, testWebhookRoute);
	await logActiveTrailOperation(ctx, input, testWebhookRoute);
	return result;
};

const updateWebhookRoute = getRoute('updateWebhook');
export const updateWebhook: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateWebhookRoute);
	await logActiveTrailOperation(ctx, input, updateWebhookRoute);
	return result;
};

const updateWebhookParameterRoute = getRoute('updateWebhookParameter');
export const updateWebhookParameter: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateWebhookParameterRoute);
	await logActiveTrailOperation(ctx, input, updateWebhookParameterRoute);
	return result;
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
	updateWebhookParameter
} as const;
