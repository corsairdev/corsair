import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listInventoryBreakdownsRoute = getRoute('listInventoryBreakdowns');
export const listInventoryBreakdowns: BooqableEndpoint = async (
	ctx,
	input = {},
) => {
	return executeBooqableOperation(ctx, input, listInventoryBreakdownsRoute);
};

export const InventoryBreakdownsEndpoints = {
	listInventoryBreakdowns,
};
