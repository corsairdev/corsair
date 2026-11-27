import type { DubEndpoints } from '..';
import { call } from './call';
import {
	DUB_CUSTOMERS_PAGE_SIZE,
	DubEndpointInputSchemas as Inputs,
	nextCursorFrom,
	DubEndpointOutputSchemas as Outputs,
} from './types';

export const list: DubEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		({
			email,
			externalId,
			search,
			country,
			linkId,
			programId,
			partnerId,
			includeExpandedFields,
			sortBy,
			sortOrder,
			startingAfter,
			endingBefore,
			pageSize,
		}) => ({
			method: 'GET',
			path: '/customers',
			query: {
				email,
				externalId,
				search,
				country,
				linkId,
				programId,
				partnerId,
				includeExpandedFields,
				sortBy,
				sortOrder,
				startingAfter,
				endingBefore,
				pageSize,
			},
		}),
		{
			// Bare array with no cursor field: the next cursor is the last
			// customer's id, and a short page means the list is over.
			shape: (raw, { pageSize }) => {
				const items = Array.isArray(raw) ? raw : [];
				return {
					items,
					nextCursor: nextCursorFrom(
						items,
						pageSize ?? DUB_CUSTOMERS_PAGE_SIZE,
					),
				};
			},
			log: (_, result) => ({ count: result.items.length }),
		},
	);

export const get: DubEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/customers/${id}` }),
	);

export const update: DubEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/customers/${id}`,
			body,
		}),
	);

export const remove: DubEndpoints['customersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.delete',
			input: Inputs.customersDelete,
			output: Outputs.customersDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/customers/${id}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
