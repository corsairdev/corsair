import { makeEverhourRequest } from '../client';
import type { EverhourInvoice } from '../schema/database';

export const listInvoices = async (
	ctx: any,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourInvoice[]>('/invoices', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};
