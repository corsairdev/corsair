import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const listSessionDownloadsRoute = getRoute('listSessionDownloads');
export const listSessionDownloads: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listSessionDownloadsRoute);
};

export const DownloadsEndpoints = {
	listSessionDownloads,
} as const;
