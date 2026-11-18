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
	input: ThinkificOperationInputs['coupons_list'],
): Promise<ThinkificOperationOutputs['coupons_list']> => {
	const parsedInput = ThinkificOperationInputSchemas.coupons_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'coupons.list',
		method: 'GET',
		path: `coupons`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.coupons_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['coupons_create'],
): Promise<ThinkificOperationOutputs['coupons_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.coupons_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'coupons.create',
		method: 'POST',
		path: `coupons`,
		query: parsedInput.query,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.coupons_create,
	});
};

export const bulkCreate = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['coupons_bulkCreate'],
): Promise<ThinkificOperationOutputs['coupons_bulkCreate']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.coupons_bulkCreate.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'coupons.bulkCreate',
		method: 'POST',
		path: `coupons/bulk_create`,
		query: parsedInput.query,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.coupons_bulkCreate,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['coupons_get'],
): Promise<ThinkificOperationOutputs['coupons_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.coupons_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'coupons.get',
		method: 'GET',
		path: `coupons/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.coupons_get,
	});
};

export const update = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['coupons_update'],
): Promise<ThinkificOperationOutputs['coupons_update']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.coupons_update.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'coupons.update',
		method: 'PUT',
		path: `coupons/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.coupons_update,
	});
};

export const remove = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['coupons_remove'],
): Promise<ThinkificOperationOutputs['coupons_remove']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.coupons_remove.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'coupons.remove',
		method: 'DELETE',
		path: `coupons/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.coupons_remove,
	});
};
