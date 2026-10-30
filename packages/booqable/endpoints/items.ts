import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listItemsRoute = getRoute('listItems');
export const listItems: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listItemsRoute);
};

const searchItemsRoute = getRoute('searchItems');
export const searchItems: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, searchItemsRoute);
};

export const ItemsEndpoints = {
	listItems,
	searchItems,
};
