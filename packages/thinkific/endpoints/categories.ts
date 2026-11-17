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
	input: ThinkificOperationInputs['categories_list'],
): Promise<ThinkificOperationOutputs['categories_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categories_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categories.list',
		method: 'GET',
		path: `collections`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.categories_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categories_create'],
): Promise<ThinkificOperationOutputs['categories_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categories_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categories.create',
		method: 'POST',
		path: `collections`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.categories_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categories_get'],
): Promise<ThinkificOperationOutputs['categories_get']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categories_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categories.get',
		method: 'GET',
		path: `collections/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.categories_get,
	});
};

export const update = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categories_update'],
): Promise<ThinkificOperationOutputs['categories_update']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categories_update.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categories.update',
		method: 'PUT',
		path: `collections/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.categories_update,
	});
};

export const remove = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categories_remove'],
): Promise<ThinkificOperationOutputs['categories_remove']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categories_remove.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categories.remove',
		method: 'DELETE',
		path: `collections/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.categories_remove,
	});
};

export const listProducts = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categories_listProducts'],
): Promise<ThinkificOperationOutputs['categories_listProducts']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categories_listProducts.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categories.listProducts',
		method: 'GET',
		path: `collections/${encodeURIComponent(String(parsedInput.path['id']))}/products`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.categories_listProducts,
	});
};
