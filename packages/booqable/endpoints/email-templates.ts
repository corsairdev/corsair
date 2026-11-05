import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listEmailTemplatesRoute = getRoute('listEmailTemplates');
export const listEmailTemplates: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listEmailTemplatesRoute);
};

export const EmailTemplatesEndpoints = {
	listEmailTemplates,
};
