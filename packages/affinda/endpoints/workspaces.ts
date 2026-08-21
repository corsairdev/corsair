import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createWorkspaceRoute = getRoute('createWorkspace');
export const createWorkspace: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createWorkspaceRoute);
};

const deleteWorkspaceRoute = getRoute('deleteWorkspace');
export const deleteWorkspace: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteWorkspaceRoute);
};

const getUsageByWorkspaceRoute = getRoute('getUsageByWorkspace');
export const getUsageByWorkspace: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getUsageByWorkspaceRoute);
};

const getWorkspaceRoute = getRoute('getWorkspace');
export const getWorkspace: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getWorkspaceRoute);
};

const getWorkspacesRoute = getRoute('getWorkspaces');
export const getWorkspaces: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getWorkspacesRoute);
};

const updateWorkspaceRoute = getRoute('updateWorkspace');
export const updateWorkspace: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateWorkspaceRoute);
};

export const WorkspacesEndpoints = {
	createWorkspace,
	deleteWorkspace,
	getUsageByWorkspace,
	getWorkspace,
	getWorkspaces,
	updateWorkspace,
} as const;
