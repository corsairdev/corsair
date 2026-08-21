import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createApiUserRoute = getRoute('createApiUser');
export const createApiUser: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createApiUserRoute);
};

const getAllApiUsersRoute = getRoute('getAllApiUsers');
export const getAllApiUsers: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getAllApiUsersRoute);
};

export const ApiUsersEndpoints = {
	createApiUser,
	getAllApiUsers,
} as const;
