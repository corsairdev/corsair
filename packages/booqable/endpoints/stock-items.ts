import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listStockItemsRoute = getRoute('listStockItems');
export const listStockItems: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listStockItemsRoute);
};

export const StockItemsEndpoints = {
	listStockItems,
};
