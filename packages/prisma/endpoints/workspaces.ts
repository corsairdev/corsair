import { workspacesOperations } from '../operations/workspaces';
import type { PrismaEndpoint } from './factory';
import {
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

function getOperation(name: (typeof workspacesOperations)[number]['name']) {
	const operation = workspacesOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

const listWorkspacesDefinition = getOperation('list');
export const listWorkspaces: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listWorkspacesDefinition,
	);
	await syncPrismaOperationResult(ctx, listWorkspacesDefinition, input, result);
	await logPrismaOperation(ctx, input, listWorkspacesDefinition);
	return result;
};

export const WorkspacesEndpoints = {
	list: listWorkspaces,
} as const;
