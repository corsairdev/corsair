import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

/** This route is `/refunds/` with a trailing slash; `/refunds` 404s. */
export const list: ShippoEndpoints['refundsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.list',
			input: Inputs.refundsList,
			output: Outputs.refundsList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/refunds/',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['refundsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.get',
			input: Inputs.refundsGet,
			output: Outputs.refundsGet,
		},
		input,
		({ refund_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/refunds/${segment(refund_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ refund_id }, result) => ({
				refundId: refund_id,
				status: result.status ?? undefined,
			}),
		},
	);

/** Asks the carrier to void a bought label and return the money. */
export const create: ShippoEndpoints['refundsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'refunds.create',
			input: Inputs.refundsCreate,
			output: Outputs.refundsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/refunds',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				refundId: result.object_id ?? undefined,
				status: result.status ?? undefined,
				transaction: parsed.transaction,
			}),
		},
	);
