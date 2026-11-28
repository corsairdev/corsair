import type { DubEndpoints } from '..';
import { segment } from '../client';
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
				// A non-array 2xx body is spec drift or an error envelope on 200;
				// hand it to the output schema so it fails loudly instead of
				// masquerading as an empty page.
				if (!Array.isArray(raw)) return raw;
				return {
					items: raw,
					nextCursor: nextCursorFrom(raw, pageSize ?? DUB_CUSTOMERS_PAGE_SIZE),
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
		({ id, includeExpandedFields }) => ({
			method: 'GET',
			path: `/customers/${segment(id)}`,
			query: { includeExpandedFields },
		}),
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
		({ id, includeExpandedFields, ...body }) => ({
			method: 'PATCH',
			path: `/customers/${segment(id)}`,
			// A query flag, not a customer field.
			query: { includeExpandedFields },
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
			path: `/customers/${segment(id)}`,
		}),
		{},
	);
