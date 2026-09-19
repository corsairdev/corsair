import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const deleteExtensionRoute = getRoute('deleteExtension');
export const deleteExtension: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, deleteExtensionRoute);
};

const listExtensionsRoute = getRoute('listExtensions');
export const listExtensions: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listExtensionsRoute);
};

const uploadExtensionRoute = getRoute('uploadExtension');
export const uploadExtension: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, uploadExtensionRoute);
};

export const ExtensionsEndpoints = {
	deleteExtension,
	listExtensions,
	uploadExtension,
} as const;
