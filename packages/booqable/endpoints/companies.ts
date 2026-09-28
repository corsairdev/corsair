import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const updateCompanyRoute = getRoute('updateCompany');
export const updateCompany: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, updateCompanyRoute);
};

export const CompaniesEndpoints = {
	updateCompany,
};
