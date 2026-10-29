import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const createOrderRoute = getRoute('createOrder');
export const createOrder: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, createOrderRoute);
};

const deleteOrderRoute = getRoute('deleteOrder');
export const deleteOrder: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, deleteOrderRoute);
};

const getNewOrderRoute = getRoute('getNewOrder');
export const getNewOrder: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getNewOrderRoute);
};

const getOrderRoute = getRoute('getOrder');
export const getOrder: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getOrderRoute);
};

const listOrdersRoute = getRoute('listOrders');
export const listOrders: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listOrdersRoute);
};

const searchOrdersRoute = getRoute('searchOrders');
export const searchOrders: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, searchOrdersRoute);
};

export const OrdersEndpoints = {
	createOrder,
	deleteOrder,
	getNewOrder,
	getOrder,
	listOrders,
	searchOrders,
};
