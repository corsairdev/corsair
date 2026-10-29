import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const createCustomerRoute = getRoute('createCustomer');
export const createCustomer: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, createCustomerRoute);
};

const deleteCustomerRoute = getRoute('deleteCustomer');
export const deleteCustomer: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, deleteCustomerRoute);
};

const getCustomerRoute = getRoute('getCustomer');
export const getCustomer: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getCustomerRoute);
};

const getCustomersRoute = getRoute('getCustomers');
export const getCustomers: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getCustomersRoute);
};

const searchCustomersRoute = getRoute('searchCustomers');
export const searchCustomers: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, searchCustomersRoute);
};

export const CustomersEndpoints = {
	createCustomer,
	deleteCustomer,
	getCustomer,
	getCustomers,
	searchCustomers,
};
