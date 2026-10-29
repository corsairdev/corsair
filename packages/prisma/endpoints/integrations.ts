import { integrationsOperations } from '../operations/integrations';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

const listWorkspaceIntegrationsDefinition = findOperation(
	integrationsOperations,
	'list',
);
export const listWorkspaceIntegrations: PrismaEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listWorkspaceIntegrationsDefinition,
	);
	await syncPrismaOperationResult(
		ctx,
		listWorkspaceIntegrationsDefinition,
		input,
		result,
	);
	await logPrismaOperation(ctx, input, listWorkspaceIntegrationsDefinition);
	return result;
};

export const IntegrationsEndpoints = {
	list: listWorkspaceIntegrations,
} as const;
