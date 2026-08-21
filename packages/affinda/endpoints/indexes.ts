import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createIndexRoute = getRoute('createIndex');
export const createIndex: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createIndexRoute);
};

const deleteIndexRoute = getRoute('deleteIndex');
export const deleteIndex: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteIndexRoute);
};

const getIndexDocumentsRoute = getRoute('getIndexDocuments');
export const getIndexDocuments: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getIndexDocumentsRoute);
};

const listIndexesRoute = getRoute('listIndexes');
export const listIndexes: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, listIndexesRoute);
};

const updateIndexRoute = getRoute('updateIndex');
export const updateIndex: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateIndexRoute);
};

export const IndexesEndpoints = {
	createIndex,
	deleteIndex,
	getIndexDocuments,
	listIndexes,
	updateIndex,
} as const;
