import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const downloadUsersRoute = getRoute('downloadUsers');
export const downloadUsers: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, downloadUsersRoute);
};

const getAllTeamMembersRoute = getRoute('getAllTeamMembers');
export const getAllTeamMembers: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getAllTeamMembersRoute);
};

const getUserByIdRoute = getRoute('getUserById');
export const getUserById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getUserByIdRoute);
};

const updateUserByIdRoute = getRoute('updateUserById');
export const updateUserById: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, updateUserByIdRoute);
};

export const UsersEndpoints = {
	downloadUsers,
	getAllTeamMembers,
	getUserById,
	updateUserById,
} as const;
