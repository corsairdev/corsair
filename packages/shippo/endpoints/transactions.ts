import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['transactionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.list',
			input: Inputs.transactionsList,
			output: Outputs.transactionsList,
		},
		input,
		({
			page,
			results,
			rate,
			object_status,
			tracking_status,
			object_created_gt,
			object_created_gte,
			object_created_lt,
			object_created_lte,
			shippo_account_id,
		}) => ({
			method: 'GET',
			path: '/transactions',
			query: {
				page,
				results,
				rate,
				object_status,
				tracking_status,
				object_created_gt,
				object_created_gte,
				object_created_lt,
				object_created_lte,
			},
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['transactionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.get',
			input: Inputs.transactionsGet,
			output: Outputs.transactionsGet,
		},
		input,
		({ transaction_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/transactions/${segment(transaction_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ transaction_id }, result) => ({
				transactionId: transaction_id,
				status: result.status ?? undefined,
				trackingNumber: result.tracking_number ?? undefined,
			}),
		},
	);

/**
 * Buying a label. This spends money on the account's carrier: `rate` must be a
 * rate the caller chose from a shipment.
 */
export const create: ShippoEndpoints['transactionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'transactions.create',
			input: Inputs.transactionsCreate,
			output: Outputs.transactionsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/transactions',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				transactionId: result.object_id ?? undefined,
				status: result.status ?? undefined,
				// The rate id is safe; the label URL is a signed capability.
				rate: parsed.rate,
			}),
		},
	);
