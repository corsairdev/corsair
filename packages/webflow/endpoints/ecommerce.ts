import { ecommerceOperations } from '../operations/ecommerce';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof ecommerceOperations)[number]['name']) {
	const operation = ecommerceOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listOrdersDefinition = getOperation('listOrders');
export const listOrders: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listOrdersDefinition,
	);
	await syncWebflowOperationResult(ctx, listOrdersDefinition, input, result);
	await logWebflowOperation(ctx, input, listOrdersDefinition);
	return result;
};

const getOrderDefinition = getOperation('getOrder');
export const getOrder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(ctx, input, getOrderDefinition);
	await syncWebflowOperationResult(ctx, getOrderDefinition, input, result);
	await logWebflowOperation(ctx, input, getOrderDefinition);
	return result;
};

const updateOrderDefinition = getOperation('updateOrder');
export const updateOrder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateOrderDefinition,
	);
	await syncWebflowOperationResult(ctx, updateOrderDefinition, input, result);
	await logWebflowOperation(ctx, input, updateOrderDefinition);
	return result;
};

const fulfillOrderDefinition = getOperation('fulfillOrder');
export const fulfillOrder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		fulfillOrderDefinition,
	);
	await syncWebflowOperationResult(ctx, fulfillOrderDefinition, input, result);
	await logWebflowOperation(ctx, input, fulfillOrderDefinition);
	return result;
};

const unfulfillOrderDefinition = getOperation('unfulfillOrder');
export const unfulfillOrder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		unfulfillOrderDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		unfulfillOrderDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, unfulfillOrderDefinition);
	return result;
};

const refundOrderDefinition = getOperation('refundOrder');
export const refundOrder: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		refundOrderDefinition,
	);
	await syncWebflowOperationResult(ctx, refundOrderDefinition, input, result);
	await logWebflowOperation(ctx, input, refundOrderDefinition);
	return result;
};

const getItemInventoryDefinition = getOperation('getItemInventory');
export const getItemInventory: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		getItemInventoryDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		getItemInventoryDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, getItemInventoryDefinition);
	return result;
};

const updateItemInventoryDefinition = getOperation('updateItemInventory');
export const updateItemInventory: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		updateItemInventoryDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		updateItemInventoryDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, updateItemInventoryDefinition);
	return result;
};

export const EcommerceEndpoints = {
	listOrders,
	getOrder,
	updateOrder,
	fulfillOrder,
	unfulfillOrder,
	refundOrder,
	getItemInventory,
	updateItemInventory,
} as const;
