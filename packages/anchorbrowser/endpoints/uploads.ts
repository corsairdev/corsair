import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const uploadFilesToSessionRoute = getRoute('uploadFilesToSession');
export const uploadFilesToSession: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, uploadFilesToSessionRoute);
};

export const UploadsEndpoints = {
	uploadFilesToSession,
} as const;
