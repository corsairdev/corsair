import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const takeScreenshotRoute = getRoute('takeScreenshot');
export const takeScreenshot: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, takeScreenshotRoute);
};

export const ScreenshotsEndpoints = {
	takeScreenshot,
} as const;
