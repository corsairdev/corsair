import type { SimpleroEndpoints } from '..';
import { segment } from '../client';
import { call, compact, without } from './shared';
import {
	SimpleroEndpointInputSchemas as Inputs,
	SimpleroEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleroEndpoints['purchasesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'purchases.list',
			input: Inputs.purchasesList,
			output: Outputs.purchasesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v2/purchases', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SimpleroEndpoints['purchasesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'purchases.get',
			input: Inputs.purchasesGet,
			output: Outputs.purchasesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/api/v2/purchases/${segment(id)}` }),
		{ log: ({ id }) => ({ purchaseId: id }) },
	);

/**
 * PATCH is limited to the buyer's own details. Money-related changes (refund,
 * cancel, capture, change the price) are separate actions, and none of them is
 * wrapped here: they move funds, so they belong in a deliberate follow-up.
 */
export const update: SimpleroEndpoints['purchasesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'purchases.update',
			input: Inputs.purchasesUpdate,
			output: Outputs.purchasesUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/v2/purchases/${segment(parsed.id)}`,
			body: compact(without(parsed)),
		}),
		{ log: ({ id }) => ({ purchaseId: id }) },
	);
