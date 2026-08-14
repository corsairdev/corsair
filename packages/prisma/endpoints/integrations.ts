import { integrationsOperations } from '../operations/integrations';
import type { PrismaEndpoint } from './factory';
import {
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

function getOperation(name: (typeof integrationsOperations)[number]['name']) {
	const operation = integrationsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

const listWorkspaceIntegrationsDefinition = getOperation('list');
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
