import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPriceStructuresRoute = getRoute('listPriceStructures');
export const listPriceStructures: BooqableEndpoint = async (
	ctx,
	input = {},
) => {
	return executeBooqableOperation(ctx, input, listPriceStructuresRoute);
};

export const PriceStructuresEndpoints = {
	listPriceStructures,
};
