import type { FreshBooksEndpoints } from '..';
import { segment } from '../client';
import { FreshBooksEndpointInputSchemas as Inputs, FreshBooksEndpointOutputSchemas as Outputs } from './types';
import { call } from './call';

const base = (accountId: string) =>
	`/accounting/account/${segment(accountId)}/users/clients`;

export const list: FreshBooksEndpoints['clientsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clients.list',
			input: Inputs.clientsList,
			output: Outputs.clientsList,
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

export const get: FreshBooksEndpoints['clientsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clients.get',
			input: Inputs.clientsGet,
			output: Outputs.clientsGet,
			envelope: 'accounting',
		},
		input,
		({ accountId, customerId }) => ({
			method: 'GET',
			path: `${base(accountId)}/${segment(customerId)}`,
		}),
		{ log: ({ accountId, customerId }) => ({ accountId, customerId }) },
	);

export const create: FreshBooksEndpoints['clientsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clients.create',
			input: Inputs.clientsCreate,
			output: Outputs.clientsCreate,
			envelope: 'accounting',
		},
		input,
		({ accountId, client }) => ({
			method: 'POST',
			path: base(accountId),
			body: { client },
		}),
		{ log: ({ accountId }) => ({ accountId }) },
	);

export const update: FreshBooksEndpoints['clientsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clients.update',
			input: Inputs.clientsUpdate,
			output: Outputs.clientsUpdate,
			envelope: 'accounting',
		},
		input,
		({ accountId, customerId, client }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(customerId)}`,
			body: { client },
		}),
		{ log: ({ accountId, customerId }) => ({ accountId, customerId }) },
	);

// Soft delete: the record stays and vis_state 1 marks it deleted. Setting
// vis_state back to 0 is widely reported to restore but undocumented, so the
// op is treated as irreversible.
export const remove: FreshBooksEndpoints['clientsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'clients.delete',
			input: Inputs.clientsDelete,
			output: Outputs.clientsDelete,
			envelope: 'accounting',
		},
		input,
		({ accountId, customerId }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(customerId)}`,
			body: { client: { vis_state: 1 } },
		}),
		{ log: ({ accountId, customerId }) => ({ accountId, customerId }) },
	);
