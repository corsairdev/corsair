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
	input: ThinkificOperationInputs['products_list'],
): Promise<ThinkificOperationOutputs['products_list']> => {
	const parsedInput = ThinkificOperationInputSchemas.products_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'products.list',
		method: 'GET',
		path: `products`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.products_list,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['products_get'],
): Promise<ThinkificOperationOutputs['products_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.products_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'products.get',
		method: 'GET',
		path: `products/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.products_get,
	});
};

export const listRelated = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['products_listRelated'],
): Promise<ThinkificOperationOutputs['products_listRelated']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.products_listRelated.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'products.listRelated',
		method: 'GET',
		path: `products/${encodeURIComponent(String(parsedInput.path['id']))}/related`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.products_listRelated,
	});
};
