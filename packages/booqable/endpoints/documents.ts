import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listDocumentsRoute = getRoute('listDocuments');
export const listDocuments: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listDocumentsRoute);
};

const searchDocumentsRoute = getRoute('searchDocuments');
export const searchDocuments: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, searchDocumentsRoute);
};

export const DocumentsEndpoints = {
	listDocuments,
	searchDocuments,
};
