import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPriceRulesetsRoute = getRoute('listPriceRulesets');
export const listPriceRulesets: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listPriceRulesetsRoute);
};

export const PriceRulesetsEndpoints = {
	listPriceRulesets,
};
