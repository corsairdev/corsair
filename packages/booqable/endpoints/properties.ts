import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPropertiesRoute = getRoute('listProperties');
export const listProperties: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listPropertiesRoute);
};

export const PropertiesEndpoints = {
	listProperties,
};
