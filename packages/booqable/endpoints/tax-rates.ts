import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listTaxRatesRoute = getRoute('listTaxRates');
export const listTaxRates: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listTaxRatesRoute);
};

export const TaxRatesEndpoints = {
	listTaxRates,
};
