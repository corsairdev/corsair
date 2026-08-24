import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const batchUpdateAnnotationsRoute = getRoute('batchUpdateAnnotations');
export const batchUpdateAnnotations: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, batchUpdateAnnotationsRoute);
};

const createBatchAnnotationsRoute = getRoute('createBatchAnnotations');
export const createBatchAnnotations: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createBatchAnnotationsRoute);
};

const deleteAnnotationsBatchRoute = getRoute('deleteAnnotationsBatch');
export const deleteAnnotationsBatch: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, deleteAnnotationsBatchRoute);
};

const getAnnotationsRoute = getRoute('getAnnotations');
export const getAnnotations: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getAnnotationsRoute);
};

const updateAnnotationRoute = getRoute('updateAnnotation');
export const updateAnnotation: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateAnnotationRoute);
};

export const AnnotationsEndpoints = {
	batchUpdateAnnotations,
	createBatchAnnotations,
	deleteAnnotationsBatch,
	getAnnotations,
	updateAnnotation,
} as const;
