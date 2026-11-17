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
	input: ThinkificOperationInputs['courseReviews_list'],
): Promise<ThinkificOperationOutputs['courseReviews_list']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.courseReviews_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'courseReviews.list',
		method: 'GET',
		path: `course_reviews`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.courseReviews_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['courseReviews_create'],
): Promise<ThinkificOperationOutputs['courseReviews_create']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.courseReviews_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'courseReviews.create',
		method: 'POST',
		path: `course_reviews`,
		query: parsedInput.query,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.courseReviews_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['courseReviews_get'],
): Promise<ThinkificOperationOutputs['courseReviews_get']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.courseReviews_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'courseReviews.get',
		method: 'GET',
		path: `course_reviews/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.courseReviews_get,
	});
};
