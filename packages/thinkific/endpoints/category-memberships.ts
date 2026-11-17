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

export const addProducts = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categoryMemberships_addProducts'],
): Promise<ThinkificOperationOutputs['categoryMemberships_addProducts']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categoryMemberships_addProducts.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'categoryMemberships.addProducts',
		method: 'POST',
		path: `collection_memberships/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema:
			ThinkificOperationOutputSchemas.categoryMemberships_addProducts,
	});
};

export const removeProducts = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['categoryMemberships_removeProducts'],
): Promise<ThinkificOperationOutputs['categoryMemberships_removeProducts']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.categoryMemberships_removeProducts.parse(
			input,
		);
	return runThinkificOperation(ctx, {
		operation: 'categoryMemberships.removeProducts',
		method: 'DELETE',
		path: `collection_memberships/${encodeURIComponent(String(parsedInput.path['id']))}`,
		body: parsedInput.body,
		outputSchema:
			ThinkificOperationOutputSchemas.categoryMemberships_removeProducts,
	});
};
