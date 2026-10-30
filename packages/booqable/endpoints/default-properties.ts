import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listDefaultPropertiesRoute = getRoute('listDefaultProperties');
export const listDefaultProperties: BooqableEndpoint = async (
	ctx,
	input = {},
) => {
	return executeBooqableOperation(ctx, input, listDefaultPropertiesRoute);
};

export const DefaultPropertiesEndpoints = {
	listDefaultProperties,
};
