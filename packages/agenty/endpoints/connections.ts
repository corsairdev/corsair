import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const connectionsGetAllRoute = getRoute('connectionsGetAll');
export const connectionsGetAll: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, connectionsGetAllRoute);
};

export const ConnectionsEndpoints = {
	connectionsGetAll,
} as const;
