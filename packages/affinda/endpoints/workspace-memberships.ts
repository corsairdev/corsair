import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createWorkspaceMembershipRoute = getRoute('createWorkspaceMembership');
export const createWorkspaceMembership: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, createWorkspaceMembershipRoute);
};

const deleteWorkspaceMembershipRoute = getRoute('deleteWorkspaceMembership');
export const deleteWorkspaceMembership: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, deleteWorkspaceMembershipRoute);
};

const getAllWorkspaceMembershipsRoute = getRoute('getAllWorkspaceMemberships');
export const getAllWorkspaceMemberships: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getAllWorkspaceMembershipsRoute);
};

const getWorkspaceMembershipRoute = getRoute('getWorkspaceMembership');
export const getWorkspaceMembership: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, getWorkspaceMembershipRoute);
};

export const WorkspaceMembershipsEndpoints = {
	createWorkspaceMembership,
	deleteWorkspaceMembership,
	getAllWorkspaceMemberships,
	getWorkspaceMembership,
} as const;
