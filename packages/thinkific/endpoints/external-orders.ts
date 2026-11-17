import type { ThinkificOperationContext } from './request';
import { runThinkificOperation } from './request';
import {
	ThinkificOperationInputSchemas,
	ThinkificOperationOutputSchemas,
} from './schemas';
import type {
	ThinkificOperationInputs,
	ThinkificOperationOutputs,
} from './types';

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['externalOrders_create'],
): Promise<ThinkificOperationOutputs['externalOrders_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.externalOrders_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'externalOrders.create',
		method: 'POST',
		path: `external_orders`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.externalOrders_create,
	});
};

export const refund = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['externalOrders_refund'],
): Promise<ThinkificOperationOutputs['externalOrders_refund']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.externalOrders_refund.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'externalOrders.refund',
		method: 'POST',
		path: `external_orders/${encodeURIComponent(String(parsedInput.path['id']))}/transactions/refund`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.externalOrders_refund,
	});
};

export const purchase = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['externalOrders_purchase'],
): Promise<ThinkificOperationOutputs['externalOrders_purchase']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.externalOrders_purchase.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'externalOrders.purchase',
		method: 'POST',
		path: `external_orders/${encodeURIComponent(String(parsedInput.path['id']))}/transactions/purchase`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.externalOrders_purchase,
	});
};
