import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const createIntegrationRoute = getRoute('createIntegration');
export const createIntegration: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, createIntegrationRoute);
};

const deleteIntegrationRoute = getRoute('deleteIntegration');
export const deleteIntegration: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, deleteIntegrationRoute);
};

const listIntegrationsRoute = getRoute('listIntegrations');
export const listIntegrations: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listIntegrationsRoute);
};

export const IntegrationsEndpoints = {
	createIntegration,
	deleteIntegration,
	listIntegrations,
} as const;
