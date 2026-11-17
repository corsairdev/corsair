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

export const addGroup = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groupAnalysts_addGroup'],
): Promise<ThinkificOperationOutputs['groupAnalysts_addGroup']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.groupAnalysts_addGroup.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groupAnalysts.addGroup',
		method: 'POST',
		path: `group_analysts/${encodeURIComponent(String(parsedInput.path['user_id']))}/groups`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.groupAnalysts_addGroup,
	});
};

export const removeGroup = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groupAnalysts_removeGroup'],
): Promise<ThinkificOperationOutputs['groupAnalysts_removeGroup']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.groupAnalysts_removeGroup.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groupAnalysts.removeGroup',
		method: 'DELETE',
		path: `group_analysts/${encodeURIComponent(String(parsedInput.path['user_id']))}/groups/${encodeURIComponent(String(parsedInput.path['group_id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.groupAnalysts_removeGroup,
	});
};
