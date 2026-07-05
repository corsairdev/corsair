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

const createOrderRoute = getRoute('createOrder');
export const createOrder: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, createOrderRoute);
	await logActiveTrailOperation(ctx, input, createOrderRoute);
	return result;
};

const getCommerceSchemaRoute = getRoute('getCommerceSchema');
export const getCommerceSchema: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getCommerceSchemaRoute);
	await logActiveTrailOperation(ctx, input, getCommerceSchemaRoute);
	return result;
};

const getOrderRoute = getRoute('getOrder');
export const getOrder: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, getOrderRoute);
	await logActiveTrailOperation(ctx, input, getOrderRoute);
	return result;
};

const updateOrderRoute = getRoute('updateOrder');
export const updateOrder: ActiveTrailEndpoint = async (ctx, input = {}) => {
	const result = await requestActiveTrailOperation(ctx, input, updateOrderRoute);
	await logActiveTrailOperation(ctx, input, updateOrderRoute);
	return result;
};

export const CommerceEndpoints = {
	createOrder,
	getCommerceSchema,
	getOrder,
	updateOrder
} as const;
