import type { HotspotSystemEndpoints } from '..';
import { readPage } from './call';
import {
	fieldsQuery,
	HotspotSystemEndpointInputSchemas as Inputs,
	HotspotSystemEndpointOutputSchemas as Outputs,
} from './types';

/** The four query parameters every list shares, in the form the API expects. */
function listQuery(parsed: {
	fields?: string[];
	sort?: string;
	limit?: number;
	offset?: number;
}) {
	return {
		fields: fieldsQuery(parsed.fields),
		sort: parsed.sort,
		limit: parsed.limit,
		offset: parsed.offset,
	};
}

/**
 * The four owner-wide transaction reads differ only in their path. Each is a
 * documented operation, so each is its own endpoint rather than a parameter.
 */
function ownerTransactions(
	suffix: 'paid' | 'voucher' | 'social' | 'mac',
	operation:
		| 'transactions.paid'
		| 'transactions.voucher'
		| 'transactions.social'
		| 'transactions.mac',
) {
	return (ctx: Parameters<typeof readPage>[0], input: never) =>
		readPage(
			ctx,
			{
				event: operation,
				input: Inputs[operation],
				output: Outputs[operation],
			},
			input,
			(parsed: Parameters<typeof listQuery>[0]) => ({
				path: `/transactions/${suffix}`,
				query: listQuery(parsed),
			}),
			{
				// The page shape varies by operation, so only the count is read.
				log: (result) => ({ count: result.items.length }),
			},
		);
}

export const customersList: HotspotSystemEndpoints['customersList'] = (
	ctx,
	input,
) =>
	readPage(
		ctx,
		{
			event: 'customers.list',
			input: Inputs['customers.list'],
			output: Outputs['customers.list'],
		},
		input,
		(parsed) => ({ path: '/customers', query: listQuery(parsed) }),
		{ log: (result) => ({ count: result.items.length }) },
	);

export const subscribersList: HotspotSystemEndpoints['subscribersList'] = (
	ctx,
	input,
) =>
	readPage(
		ctx,
		{
			event: 'subscribers.list',
			input: Inputs['subscribers.list'],
			output: Outputs['subscribers.list'],
		},
		input,
		(parsed) => ({ path: '/subscribers', query: listQuery(parsed) }),
		{ log: (result) => ({ count: result.items.length }) },
	);

export const vouchersList: HotspotSystemEndpoints['vouchersList'] = (
	ctx,
	input,
) =>
	readPage(
		ctx,
		{
			event: 'vouchers.list',
			input: Inputs['vouchers.list'],
			output: Outputs['vouchers.list'],
		},
		input,
		(parsed) => ({ path: '/vouchers', query: listQuery(parsed) }),
		{ log: (result) => ({ count: result.items.length }) },
	);

export const transactionsPaid: HotspotSystemEndpoints['transactionsPaid'] =
	ownerTransactions('paid', 'transactions.paid');
export const transactionsVoucher: HotspotSystemEndpoints['transactionsVoucher'] =
	ownerTransactions('voucher', 'transactions.voucher');
export const transactionsSocial: HotspotSystemEndpoints['transactionsSocial'] =
	ownerTransactions('social', 'transactions.social');
export const transactionsMac: HotspotSystemEndpoints['transactionsMac'] =
	ownerTransactions('mac', 'transactions.mac');
