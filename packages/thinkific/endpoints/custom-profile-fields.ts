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
	input: ThinkificOperationInputs['customProfileFields_list'],
): Promise<ThinkificOperationOutputs['customProfileFields_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.customProfileFields_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'customProfileFields.list',
		method: 'GET',
		path: `custom_profile_field_definitions`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.customProfileFields_list,
	});
};
