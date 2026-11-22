import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

// The best-practices page names invoices as the other documented example for
// updatedAfter incremental sync and ids batch fetch.
export const list: StoreganiseEndpoints['invoicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
		},
		input,
		({ updatedAfter, ids }, base) => ({
			method: 'GET',
			base,
			path: '/admin/invoices',
			query: { updatedAfter, ids: ids?.join(',') },
		}),
		{
			log: (_, invoices) => ({ count: invoices.length }),
		},
	);
