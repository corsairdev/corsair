import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createExtractorRoute = getRoute('createExtractor');
export const createExtractor: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createExtractorRoute);
};

const deleteExtractorRoute = getRoute('deleteExtractor');
export const deleteExtractor: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteExtractorRoute);
};

const getExtractorRoute = getRoute('getExtractor');
export const getExtractor: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getExtractorRoute);
};

const getExtractorsRoute = getRoute('getExtractors');
export const getExtractors: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getExtractorsRoute);
};

const updateExtractorRoute = getRoute('updateExtractor');
export const updateExtractor: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateExtractorRoute);
};

export const ExtractorsEndpoints = {
	createExtractor,
	deleteExtractor,
	getExtractor,
	getExtractors,
	updateExtractor,
} as const;
