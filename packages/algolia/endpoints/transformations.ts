import type { AlgoliaEndpoint } from './factory';
import { executeAlgoliaOperation, getRoute } from './factory';

const createTransformationRoute = getRoute('createTransformation');
export const createTransformation: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, createTransformationRoute);
};

const deleteTransformationRoute = getRoute('deleteTransformation');
export const deleteTransformation: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, deleteTransformationRoute);
};

const getTransformationRoute = getRoute('getTransformation');
export const getTransformation: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, getTransformationRoute);
};

const listTransformationsRoute = getRoute('listTransformations');
export const listTransformations: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, listTransformationsRoute);
};

const searchTransformationsRoute = getRoute('searchTransformations');
export const searchTransformations: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, searchTransformationsRoute);
};

const tryTransformationRoute = getRoute('tryTransformation');
export const tryTransformation: AlgoliaEndpoint = async (ctx, input = {}) => {
	return executeAlgoliaOperation(ctx, input, tryTransformationRoute);
};

const tryTransformationBeforeUpdateRoute = getRoute(
	'tryTransformationBeforeUpdate',
);
export const tryTransformationBeforeUpdate: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(
		ctx,
		input,
		tryTransformationBeforeUpdateRoute,
	);
};

const updateTransformationRoute = getRoute('updateTransformation');
export const updateTransformation: AlgoliaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAlgoliaOperation(ctx, input, updateTransformationRoute);
};

export const TransformationsEndpoints = {
	createTransformation,
	deleteTransformation,
	getTransformation,
	listTransformations,
	searchTransformations,
	tryTransformation,
	tryTransformationBeforeUpdate,
	updateTransformation,
} as const;
