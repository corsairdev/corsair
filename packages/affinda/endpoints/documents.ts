import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const addTagToDocumentsRoute = getRoute('addTagToDocuments');
export const addTagToDocuments: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, addTagToDocumentsRoute);
};

const createDocumentRoute = getRoute('createDocument');
export const createDocument: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createDocumentRoute);
};

const createFromDataDocumentsRoute = getRoute('createFromDataDocuments');
export const createFromDataDocuments: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createFromDataDocumentsRoute);
};

const deleteDocumentRoute = getRoute('deleteDocument');
export const deleteDocument: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteDocumentRoute);
};

const getDocumentRoute = getRoute('getDocument');
export const getDocument: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDocumentRoute);
};

const getDocumentRedactedRoute = getRoute('getDocumentRedacted');
export const getDocumentRedacted: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDocumentRedactedRoute);
};

const getDocumentsRoute = getRoute('getDocuments');
export const getDocuments: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDocumentsRoute);
};

const removeTagFromDocumentsRoute = getRoute('removeTagFromDocuments');
export const removeTagFromDocuments: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, removeTagFromDocumentsRoute);
};

const updateDocumentRoute = getRoute('updateDocument');
export const updateDocument: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateDocumentRoute);
};

const updateDocumentDataRoute = getRoute('updateDocumentData');
export const updateDocumentData: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateDocumentDataRoute);
};

export const DocumentsEndpoints = {
	addTagToDocuments,
	createDocument,
	createFromDataDocuments,
	deleteDocument,
	getDocument,
	getDocumentRedacted,
	getDocuments,
	removeTagFromDocuments,
	updateDocument,
	updateDocumentData,
} as const;
