import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourInvoice } from '../schema/database';

export const listInvoices: EverhourEndpoints['listInvoices'] = async (
	ctx,
	options = {},
) => {
	return makeEverhourRequest<EverhourInvoice[]>('/invoices', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};
