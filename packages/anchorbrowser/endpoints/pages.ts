import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const getSessionPagesRoute = getRoute('getSessionPages');
export const getSessionPages: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getSessionPagesRoute);
};

export const PagesEndpoints = {
	getSessionPages,
} as const;
