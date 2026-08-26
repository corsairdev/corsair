import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const getBatchSessionStatusRoute = getRoute('getBatchSessionStatus');
export const getBatchSessionStatus: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getBatchSessionStatusRoute);
};

export const BatchSessionsEndpoints = {
	getBatchSessionStatus,
} as const;
