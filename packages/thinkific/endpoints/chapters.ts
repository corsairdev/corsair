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

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['chapters_get'],
): Promise<ThinkificOperationOutputs['chapters_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.chapters_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'chapters.get',
		method: 'GET',
		path: `chapters/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.chapters_get,
	});
};

export const listContents = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['chapters_listContents'],
): Promise<ThinkificOperationOutputs['chapters_listContents']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.chapters_listContents.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'chapters.listContents',
		method: 'GET',
		path: `chapters/${encodeURIComponent(String(parsedInput.path['id']))}/contents`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.chapters_listContents,
	});
};
