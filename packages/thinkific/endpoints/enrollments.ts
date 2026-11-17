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
	input: ThinkificOperationInputs['enrollments_list'],
): Promise<ThinkificOperationOutputs['enrollments_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.enrollments_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'enrollments.list',
		method: 'GET',
		path: `enrollments`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.enrollments_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['enrollments_create'],
): Promise<ThinkificOperationOutputs['enrollments_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.enrollments_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'enrollments.create',
		method: 'POST',
		path: `enrollments`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.enrollments_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['enrollments_get'],
): Promise<ThinkificOperationOutputs['enrollments_get']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.enrollments_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'enrollments.get',
		method: 'GET',
		path: `enrollments/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.enrollments_get,
	});
};

export const update = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['enrollments_update'],
): Promise<ThinkificOperationOutputs['enrollments_update']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.enrollments_update.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'enrollments.update',
		method: 'PUT',
		path: `enrollments/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.enrollments_update,
	});
};
