import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listLinesRoute = getRoute('listLines');
export const listLines: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listLinesRoute);
};

export const LinesEndpoints = {
	listLines,
};
