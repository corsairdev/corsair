import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const createProductGroupRoute = getRoute('createProductGroup');
export const createProductGroup: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, createProductGroupRoute);
};

const deleteProductGroupRoute = getRoute('deleteProductGroup');
export const deleteProductGroup: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, deleteProductGroupRoute);
};

const getProductGroupRoute = getRoute('getProductGroup');
export const getProductGroup: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getProductGroupRoute);
};

const listProductGroupsRoute = getRoute('listProductGroups');
export const listProductGroups: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listProductGroupsRoute);
};

export const ProductGroupsEndpoints = {
	createProductGroup,
	deleteProductGroup,
	getProductGroup,
	listProductGroups,
};
