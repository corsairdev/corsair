import type { SimplesatEndpoints } from '..';
import { segment } from '../client';
import { call, pageShape, parseNextLink } from './shared';
import type { SimplesatCustomer, SimplesatPage } from './types';
import {
	SimplesatEndpointInputSchemas as Inputs,
	SimplesatEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplesatEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(parsed) => {
			// A `next` path already carries the filters and page number, so it
			// replaces them rather than being combined with them.
			const path = parsed.next ? parseNextLink(parsed.next) : null;
			if (parsed.next && !path) {
				throw new Error(
					'customers.list needs the `next` path Simplesat returned, such as /api/v1/customers?page=2.',
				);
			}
			return {
				method: 'GET',
				path: path ?? '/api/v1/customers',
				query: path
					? undefined
					: {
							page: parsed.page,
							page_size: parsed.page_size,
							created_after: parsed.created_after,
							created_before: parsed.created_before,
							modified_after: parsed.modified_after,
							modified_before: parsed.modified_before,
							subscribed: parsed.subscribed,
						},
			};
		},
		{
			// The output schema validates each item and the page envelope.
			shape: (raw) =>
				pageShape<SimplesatPage<SimplesatCustomer>>(raw, 'customers'),
			log: (_, result) => ({
				count: result.results.length,
				total: result.count ?? undefined,
			}),
		},
	);

export const get: SimplesatEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ customer_id }) => ({
			method: 'GET',
			path: `/api/v1/customers/${segment(customer_id)}`,
		}),
		{ log: ({ customer_id }) => ({ customerId: customer_id }) },
	);

export const create: SimplesatEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v1/customers', body }),
		{ log: (_, result) => ({ customerId: result.id ?? undefined }) },
	);

export const update: SimplesatEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		({ customer_id, ...body }) => ({
			method: 'PUT',
			path: `/api/v1/customers/${segment(customer_id)}`,
			body,
		}),
		{ log: ({ customer_id }) => ({ customerId: customer_id }) },
	);

/**
 * A bulk write is queued rather than applied, so the answer carries a
 * `request_id` and a message instead of the stored records.
 */
export const bulk: SimplesatEndpoints['customersBulk'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.bulk',
			input: Inputs.customersBulk,
			output: Outputs.customersBulk,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v1/customers/bulk', body }),
		{
			log: (parsed, result) => ({
				submitted: parsed.customers.length,
				requestId: result.request_id ?? undefined,
			}),
		},
	);
