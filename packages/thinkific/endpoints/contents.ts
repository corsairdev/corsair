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
	input: ThinkificOperationInputs['contents_get'],
): Promise<ThinkificOperationOutputs['contents_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.contents_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'contents.get',
		method: 'GET',
		path: `contents/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.contents_get,
	});
};
