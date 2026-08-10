import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createValidationResultRoute = getRoute('createValidationResult');
export const createValidationResult: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createValidationResultRoute);
};

const createValidationResultsBatchRoute = getRoute(
	'createValidationResultsBatch',
);
export const createValidationResultsBatch: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createValidationResultsBatchRoute);
};

const deleteValidationResultsRoute = getRoute('deleteValidationResults');
export const deleteValidationResults: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, deleteValidationResultsRoute);
};

const getAllValidationResultsRoute = getRoute('getAllValidationResults');
export const getAllValidationResults: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getAllValidationResultsRoute);
};

export const ValidationResultsEndpoints = {
	createValidationResult,
	createValidationResultsBatch,
	deleteValidationResults,
	getAllValidationResults,
} as const;
