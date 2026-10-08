import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const getInventoryLevelsRoute = getRoute('getInventoryLevels');
export const getInventoryLevels: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getInventoryLevelsRoute);
};

export const InventoryLevelsEndpoints = {
	getInventoryLevels,
};
