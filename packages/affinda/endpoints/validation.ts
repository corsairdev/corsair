import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const splitDocumentPagesRoute = getRoute('splitDocumentPages');
export const splitDocumentPages: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, splitDocumentPagesRoute);
};

export const ValidationEndpoints = {
	splitDocumentPages,
} as const;
