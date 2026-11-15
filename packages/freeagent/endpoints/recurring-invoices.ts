import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentPaginatedRequest, makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['recurringInvoicesList'] = async (
	ctx,
	input,
) => {
	const parsed =
		FreeAgentEndpointInputSchemas.recurringInvoicesList.parse(input);
	const response = await makeFreeAgentPaginatedRequest(
		'/v2/recurring_invoices',
		ctx.key,
		parsed.query ?? {},
		FreeAgentEndpointOutputSchemas.recurringInvoicesList.omit({
			pagination: true,
		}),
	);
	return FreeAgentEndpointOutputSchemas.recurringInvoicesList.parse({
		...response.data,
		pagination: response.pagination,
	});
};

export const get: FreeAgentEndpoints['recurringInvoicesGet'] = async (
	ctx,
	input,
) => {
	const parsed =
		FreeAgentEndpointInputSchemas.recurringInvoicesGet.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/recurring_invoices/${encodeURIComponent(parsed.id)}`,
		ctx.key,
	);
	return FreeAgentEndpointOutputSchemas.recurringInvoicesGet.parse(response);
};
