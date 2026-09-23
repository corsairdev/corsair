import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listStockItemPlanningsRoute = getRoute('listStockItemPlannings');
export const listStockItemPlannings: BooqableEndpoint = async (
	ctx,
	input = {},
) => {
	return executeBooqableOperation(ctx, input, listStockItemPlanningsRoute);
};

export const StockItemPlanningsEndpoints = {
	listStockItemPlannings,
};
