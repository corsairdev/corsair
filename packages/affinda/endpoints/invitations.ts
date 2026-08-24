import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createInvitationRoute = getRoute('createInvitation');
export const createInvitation: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createInvitationRoute);
};

const deleteInvitationRoute = getRoute('deleteInvitation');
export const deleteInvitation: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteInvitationRoute);
};

const getAllInvitationsRoute = getRoute('getAllInvitations');
export const getAllInvitations: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getAllInvitationsRoute);
};

const getInvitationRoute = getRoute('getInvitation');
export const getInvitation: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getInvitationRoute);
};

const updateInvitationRoute = getRoute('updateInvitation');
export const updateInvitation: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateInvitationRoute);
};

export const InvitationsEndpoints = {
	createInvitation,
	deleteInvitation,
	getAllInvitations,
	getInvitation,
	updateInvitation,
} as const;
