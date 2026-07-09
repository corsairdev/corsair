import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const listAgentResourcesRoute = getRoute('listAgentResources');
export const listAgentResources: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listAgentResourcesRoute);
};

const pauseAgentRoute = getRoute('pauseAgent');
export const pauseAgent: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, pauseAgentRoute);
};

const resumeAgentRoute = getRoute('resumeAgent');
export const resumeAgent: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, resumeAgentRoute);
};

const uploadFileRoute = getRoute('uploadFile');
export const uploadFile: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, uploadFileRoute);
};

export const AgentEndpoints = {
	listAgentResources,
	pauseAgent,
	resumeAgent,
	uploadFile,
} as const;
