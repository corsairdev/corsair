import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPlanningsRoute = getRoute('listPlannings');
export const listPlannings: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listPlanningsRoute);
};

const searchPlanningsRoute = getRoute('searchPlannings');
export const searchPlannings: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, searchPlanningsRoute);
};

export const PlanningsEndpoints = {
	listPlannings,
	searchPlannings,
};
