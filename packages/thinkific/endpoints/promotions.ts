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
	input: ThinkificOperationInputs['promotions_list'],
): Promise<ThinkificOperationOutputs['promotions_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.promotions_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'promotions.list',
		method: 'GET',
		path: `promotions`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.promotions_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['promotions_create'],
): Promise<ThinkificOperationOutputs['promotions_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.promotions_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'promotions.create',
		method: 'POST',
		path: `promotions`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.promotions_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['promotions_get'],
): Promise<ThinkificOperationOutputs['promotions_get']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.promotions_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'promotions.get',
		method: 'GET',
		path: `promotions/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.promotions_get,
	});
};

export const update = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['promotions_update'],
): Promise<ThinkificOperationOutputs['promotions_update']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.promotions_update.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'promotions.update',
		method: 'PUT',
		path: `promotions/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.promotions_update,
	});
};

export const remove = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['promotions_remove'],
): Promise<ThinkificOperationOutputs['promotions_remove']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.promotions_remove.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'promotions.remove',
		method: 'DELETE',
		path: `promotions/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.promotions_remove,
	});
};

export const getByCoupon = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['promotions_getByCoupon'],
): Promise<ThinkificOperationOutputs['promotions_getByCoupon']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.promotions_getByCoupon.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'promotions.getByCoupon',
		method: 'GET',
		path: `promotions/by_coupon`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.promotions_getByCoupon,
	});
};
