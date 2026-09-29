import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listTaxValuesRoute = getRoute('listTaxValues');
export const listTaxValues: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listTaxValuesRoute);
};

export const TaxValuesEndpoints = {
	listTaxValues,
};
