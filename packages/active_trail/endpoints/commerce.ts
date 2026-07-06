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

const createOrderRoute = getRoute('createOrder');
export const createOrder: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, createOrderRoute);
};

const getCommerceSchemaRoute = getRoute('getCommerceSchema');
export const getCommerceSchema: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getCommerceSchemaRoute);
};

const getOrderRoute = getRoute('getOrder');
export const getOrder: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, getOrderRoute);
};

const updateOrderRoute = getRoute('updateOrder');
export const updateOrder: ActiveTrailEndpoint = async (ctx, input = {}) => {
	return executeActiveTrailOperation(ctx, input, updateOrderRoute);
};

export const CommerceEndpoints = {
	createOrder,
	getCommerceSchema,
	getOrder,
	updateOrder
} as const;
