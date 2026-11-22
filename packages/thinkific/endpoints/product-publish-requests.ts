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
	input: ThinkificOperationInputs['productPublishRequests_list'],
): Promise<ThinkificOperationOutputs['productPublishRequests_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.productPublishRequests_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'productPublishRequests.list',
		method: 'GET',
		path: `product_publish_requests`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.productPublishRequests_list,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['productPublishRequests_get'],
): Promise<ThinkificOperationOutputs['productPublishRequests_get']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.productPublishRequests_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'productPublishRequests.get',
		method: 'GET',
		path: `product_publish_requests/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.productPublishRequests_get,
	});
};

export const approve = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['productPublishRequests_approve'],
): Promise<ThinkificOperationOutputs['productPublishRequests_approve']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.productPublishRequests_approve.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'productPublishRequests.approve',
		method: 'POST',
		path: `product_publish_requests/${encodeURIComponent(String(parsedInput.path['id']))}/approve`,
		body: parsedInput.body,
		outputSchema:
			ThinkificOperationOutputSchemas.productPublishRequests_approve,
	});
};

export const deny = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['productPublishRequests_deny'],
): Promise<ThinkificOperationOutputs['productPublishRequests_deny']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.productPublishRequests_deny.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'productPublishRequests.deny',
		method: 'POST',
		path: `product_publish_requests/${encodeURIComponent(String(parsedInput.path['id']))}/deny`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.productPublishRequests_deny,
	});
};
