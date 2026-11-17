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

export const list = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['orders_list'],
): Promise<ThinkificOperationOutputs['orders_list']> => {
	const parsedInput = ThinkificOperationInputSchemas.orders_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'orders.list',
		method: 'GET',
		path: `orders`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.orders_list,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['orders_get'],
): Promise<ThinkificOperationOutputs['orders_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.orders_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'orders.get',
		method: 'GET',
		path: `orders/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.orders_get,
	});
};
