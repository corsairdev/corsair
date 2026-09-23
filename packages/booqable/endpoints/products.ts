import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const getProductRoute = getRoute('getProduct');
export const getProduct: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, getProductRoute);
};

const listProductsRoute = getRoute('listProducts');
export const listProducts: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listProductsRoute);
};

export const ProductsEndpoints = {
	getProduct,
	listProducts,
};
