import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const getAllDocumentSplittersRoute = getRoute('getAllDocumentSplitters');
export const getAllDocumentSplitters: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getAllDocumentSplittersRoute);
};

const getDocumentSplitterRoute = getRoute('getDocumentSplitter');
export const getDocumentSplitter: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getDocumentSplitterRoute);
};

export const DocumentSplittersEndpoints = {
	getAllDocumentSplitters,
	getDocumentSplitter,
} as const;
