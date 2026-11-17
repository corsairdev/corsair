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
	input: ThinkificOperationInputs['courses_list'],
): Promise<ThinkificOperationOutputs['courses_list']> => {
	const parsedInput = ThinkificOperationInputSchemas.courses_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'courses.list',
		method: 'GET',
		path: `courses`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.courses_list,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['courses_get'],
): Promise<ThinkificOperationOutputs['courses_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.courses_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'courses.get',
		method: 'GET',
		path: `courses/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.courses_get,
	});
};

export const listChapters = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['courses_listChapters'],
): Promise<ThinkificOperationOutputs['courses_listChapters']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.courses_listChapters.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'courses.listChapters',
		method: 'GET',
		path: `courses/${encodeURIComponent(String(parsedInput.path['id']))}/chapters`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.courses_listChapters,
	});
};
