import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listEmployeesRoute = getRoute('listEmployees');
export const listEmployees: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listEmployeesRoute);
};

export const EmployeesEndpoints = {
	listEmployees,
};
