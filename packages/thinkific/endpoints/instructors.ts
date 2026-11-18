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
	input: ThinkificOperationInputs['instructors_list'],
): Promise<ThinkificOperationOutputs['instructors_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.instructors_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'instructors.list',
		method: 'GET',
		path: `instructors`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.instructors_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['instructors_create'],
): Promise<ThinkificOperationOutputs['instructors_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.instructors_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'instructors.create',
		method: 'POST',
		path: `instructors`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.instructors_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['instructors_get'],
): Promise<ThinkificOperationOutputs['instructors_get']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.instructors_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'instructors.get',
		method: 'GET',
		path: `instructors/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.instructors_get,
	});
};

export const update = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['instructors_update'],
): Promise<ThinkificOperationOutputs['instructors_update']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.instructors_update.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'instructors.update',
		method: 'PUT',
		path: `instructors/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.instructors_update,
	});
};

export const remove = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['instructors_remove'],
): Promise<ThinkificOperationOutputs['instructors_remove']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.instructors_remove.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'instructors.remove',
		method: 'DELETE',
		path: `instructors/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.instructors_remove,
	});
};
