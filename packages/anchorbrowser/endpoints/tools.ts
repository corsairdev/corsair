import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const getWebpageContentRoute = getRoute('getWebpageContent');
export const getWebpageContent: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getWebpageContentRoute);
};

const performWebTaskRoute = getRoute('performWebTask');
export const performWebTask: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, performWebTaskRoute);
};

const screenshotWebpageRoute = getRoute('screenshotWebpage');
export const screenshotWebpage: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, screenshotWebpageRoute);
};

export const ToolsEndpoints = {
	getWebpageContent,
	performWebTask,
	screenshotWebpage,
} as const;
