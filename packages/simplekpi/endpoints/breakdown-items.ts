import type { SimplekpiEndpoints } from '..';
import { segment } from '../client';
import { call, deletion } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplekpiEndpoints['breakdownItemsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'breakdownItems.list',
			input: Inputs.breakdownItemsList,
			output: Outputs.breakdownItemsList,
		},
		input,
		// The route takes only page and rows. It has no breakdown filter (live,
		// 11-16: a breakdown_id query was ignored), and filtering a page here
		// would break the short-page paging rule, so callers filter the items.
		({ page, rows }) => ({
			method: 'GET',
			path: '/v1/breakdownitems',
			query: { page, rows },
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const create: SimplekpiEndpoints['breakdownItemsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'breakdownItems.create',
			input: Inputs.breakdownItemsCreate,
			output: Outputs.breakdownItemsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/breakdownitems', body }),
		{ log: (_, result) => ({ itemId: result.id }) },
	);

export const get: SimplekpiEndpoints['breakdownItemsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'breakdownItems.get',
			input: Inputs.breakdownItemsGet,
			output: Outputs.breakdownItemsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/breakdownitems/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ itemId: id }) },
	);

export const update: SimplekpiEndpoints['breakdownItemsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'breakdownItems.update',
			input: Inputs.breakdownItemsUpdate,
			output: Outputs.breakdownItemsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/v1/breakdownitems/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ itemId: id }) },
	);

export const remove: SimplekpiEndpoints['breakdownItemsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'breakdownItems.delete',
			input: Inputs.breakdownItemsDelete,
			output: Outputs.breakdownItemsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/v1/breakdownitems/${segment(id)}`,
		}),
		{
			shape: (raw, { id }) => deletion(raw, 'breakdownItems.delete', id),
			log: ({ id }) => ({ itemId: id }),
		},
	);
