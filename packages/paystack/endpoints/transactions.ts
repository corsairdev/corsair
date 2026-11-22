import type { PaystackEndpoints } from '..';
import { call } from './call';
import {
	PaystackEndpointInputSchemas as Inputs,
	PaystackEndpointOutputSchemas as Outputs,
} from './types';

export const initialize: PaystackEndpoints['transactionsInitialize'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transactions.initialize',
			input: Inputs.transactionsInitialize,
			output: Outputs.transactionsInitialize,
		},
		input,
		(body) => ({ method: 'POST', path: '/transaction/initialize', body }),
		{
			log: (_, result) => ({
				reference: result.data.reference,
			}),
		},
	);

export const verify: PaystackEndpoints['transactionsVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.verify',
			input: Inputs.transactionsVerify,
			output: Outputs.transactionsVerify,
		},
		input,
		({ reference }) => ({
			method: 'GET',
			path: `/transaction/verify/${encodeURIComponent(reference)}`,
		}),
		{
			log: (_, result) => ({
				reference: result.data.reference ?? undefined,
				status: result.data.status ?? undefined,
			}),
		},
	);

export const list: PaystackEndpoints['transactionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.list',
			input: Inputs.transactionsList,
			output: Outputs.transactionsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/transaction', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PaystackEndpoints['transactionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.get',
			input: Inputs.transactionsGet,
			output: Outputs.transactionsGet,
		},
		input,
		({ transactionId }) => ({
			method: 'GET',
			path: `/transaction/${transactionId}`,
		}),
		{ log: (_, result) => ({ reference: result.data.reference ?? undefined }) },
	);
