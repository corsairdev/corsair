import type { FreshBooksEndpoints } from '..';
import { segment } from '../client';
import { FreshBooksEndpointInputSchemas as Inputs, FreshBooksEndpointOutputSchemas as Outputs } from './types';
import { call } from './call';

const base = (accountId: string) =>
	`/accounting/account/${segment(accountId)}/estimates/estimates`;

export const list: FreshBooksEndpoints['estimatesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'estimates.list',
			input: Inputs.estimatesList,
			output: Outputs.estimatesList,
			envelope: 'accounting',
		},
		input,
		({ accountId, page, per_page }) => ({
			method: 'GET',
			path: base(accountId),
			query: { page, per_page },
		}),
		{ log: ({ accountId }) => ({ accountId }) },
	);

export const get: FreshBooksEndpoints['estimatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'estimates.get',
			input: Inputs.estimatesGet,
			output: Outputs.estimatesGet,
			envelope: 'accounting',
		},
		input,
		({ accountId, estimateId }) => ({
			method: 'GET',
			path: `${base(accountId)}/${segment(estimateId)}`,
		}),
		{ log: ({ accountId, estimateId }) => ({ accountId, estimateId }) },
	);

export const create: FreshBooksEndpoints['estimatesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'estimates.create',
			input: Inputs.estimatesCreate,
			output: Outputs.estimatesCreate,
			envelope: 'accounting',
		},
		input,
		({ accountId, estimate }) => ({
			method: 'POST',
			path: base(accountId),
			body: { estimate },
		}),
		{ log: ({ accountId, estimate }) => ({ accountId, customerId: estimate.customerid }) },
	);

export const update: FreshBooksEndpoints['estimatesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'estimates.update',
			input: Inputs.estimatesUpdate,
			output: Outputs.estimatesUpdate,
			envelope: 'accounting',
		},
		input,
		({ accountId, estimateId, estimate }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(estimateId)}`,
			body: { estimate },
		}),
		{ log: ({ accountId, estimateId }) => ({ accountId, estimateId }) },
	);

// Soft delete via vis_state, like the other accounting resources. The docs
// example for this call omits the body entirely, which reads as an update;
// the vis_state form is what the delete actually is, pending live
// verification once a key exists.
export const remove: FreshBooksEndpoints['estimatesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'estimates.delete',
			input: Inputs.estimatesDelete,
			output: Outputs.estimatesDelete,
			envelope: 'accounting',
		},
		input,
		({ accountId, estimateId }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(estimateId)}`,
			body: { estimate: { vis_state: 1 } },
		}),
		{ log: ({ accountId, estimateId }) => ({ accountId, estimateId }) },
	);
