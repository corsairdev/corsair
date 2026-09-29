import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listUsersRoute = getRoute('listUsers');
export const listUsers: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listUsersRoute);
};

export const UsersEndpoints = {
	listUsers,
};
