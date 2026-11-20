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
	input: ThinkificOperationInputs['bundles_get'],
): Promise<ThinkificOperationOutputs['bundles_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.bundles_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'bundles.get',
		method: 'GET',
		path: `bundles/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.bundles_get,
	});
};

export const listCourses = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['bundles_listCourses'],
): Promise<ThinkificOperationOutputs['bundles_listCourses']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.bundles_listCourses.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'bundles.listCourses',
		method: 'GET',
		path: `bundles/${encodeURIComponent(String(parsedInput.path['id']))}/courses`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.bundles_listCourses,
	});
};

export const listEnrollments = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['bundles_listEnrollments'],
): Promise<ThinkificOperationOutputs['bundles_listEnrollments']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.bundles_listEnrollments.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'bundles.listEnrollments',
		method: 'GET',
		path: `bundles/${encodeURIComponent(String(parsedInput.path['id']))}/enrollments`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.bundles_listEnrollments,
	});
};

export const createEnrollment = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['bundles_createEnrollment'],
): Promise<ThinkificOperationOutputs['bundles_createEnrollment']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.bundles_createEnrollment.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'bundles.createEnrollment',
		method: 'POST',
		path: `bundles/${encodeURIComponent(String(parsedInput.path['id']))}/enrollments`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.bundles_createEnrollment,
	});
};

export const updateEnrollments = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['bundles_updateEnrollments'],
): Promise<ThinkificOperationOutputs['bundles_updateEnrollments']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.bundles_updateEnrollments.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'bundles.updateEnrollments',
		method: 'PUT',
		path: `bundles/${encodeURIComponent(String(parsedInput.path['id']))}/enrollments`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.bundles_updateEnrollments,
	});
};
