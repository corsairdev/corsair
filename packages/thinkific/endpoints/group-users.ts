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

export const addUsers = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groupUsers_addUsers'],
): Promise<ThinkificOperationOutputs['groupUsers_addUsers']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.groupUsers_addUsers.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groupUsers.addUsers',
		method: 'POST',
		path: `group_users`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.groupUsers_addUsers,
	});
};
