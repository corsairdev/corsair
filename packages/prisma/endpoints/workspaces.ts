import { workspacesOperations } from '../operations/workspaces';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

const listWorkspacesDefinition = findOperation(workspacesOperations, 'list');
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
