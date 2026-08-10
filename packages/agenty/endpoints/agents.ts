import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const agentsControllerCreateAgentRoute = getRoute(
	'agentsControllerCreateAgent',
);
export const agentsControllerCreateAgent: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, agentsControllerCreateAgentRoute);
};

const agentsControllerGetTemplatesRoute = getRoute(
	'agentsControllerGetTemplates',
);
export const agentsControllerGetTemplates: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, agentsControllerGetTemplatesRoute);
};

const agentsDeleteByIdRoute = getRoute('agentsDeleteById');
export const agentsDeleteById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, agentsDeleteByIdRoute);
};

const agentsGetAllRoute = getRoute('agentsGetAll');
export const agentsGetAll: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, agentsGetAllRoute);
};

const agentsGetByIdRoute = getRoute('agentsGetById');
export const agentsGetById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, agentsGetByIdRoute);
};

const agentsUpdateByIdRoute = getRoute('agentsUpdateById');
export const agentsUpdateById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, agentsUpdateByIdRoute);
};

const copyAgentRoute = getRoute('copyAgent');
export const copyAgent: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, copyAgentRoute);
};

const transferAgentOwnershipRoute = getRoute('transferAgentOwnership');
export const transferAgentOwnership: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, transferAgentOwnershipRoute);
};

export const AgentsEndpoints = {
	agentsControllerCreateAgent,
	agentsControllerGetTemplates,
	agentsDeleteById,
	agentsGetAll,
	agentsGetById,
	agentsUpdateById,
	copyAgent,
	transferAgentOwnership,
} as const;
