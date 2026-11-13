import type { z } from 'zod';
import type { RepairshoprEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RepairshoprEndpointInputSchemas as Inputs,
	RepairshoprEndpointOutputSchemas as Outputs,
} from './types';

export const list: RepairshoprEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/customers',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				query: parsed.query,
				firstname: parsed.firstname,
				lastname: parsed.lastname,
				business_name: parsed.business_name,
				email: parsed.email,
				id: parsed.id,
				id_not: parsed.id_not,
				include_disabled: parsed.include_disabled,
				sort: parsed.sort,
			}),
		}),
		{
			shape: pagedShape('customers'),
			log: (_, result) => ({
				count: result.customers.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const get: RepairshoprEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/customers/${segment(parsed.customer_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('customer'),
			log: (_, result) => ({ customerId: result.customer.id ?? 0 }),
		},
	);

/**
 * The customer fields, already in the wire spelling. `customer_id` is stripped
 * on an update because it travels in the path.
 */
function customerBody(
	input: Partial<z.output<(typeof Inputs)['customersCreate']>> & {
		customer_id?: number;
	},
	// unknown: the body is assembled from the parsed input under wire names,
	// so its values are the provider's own shapes rather than one declared type.
): Record<string, unknown> {
	const { customer_id: _id, ...rest } = input;
	return Object.fromEntries(
		Object.entries(rest).filter(([, value]) => value !== undefined),
	);
}

export const create: RepairshoprEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/customers',
			replayable: false,
			body: customerBody(parsed),
		}),
		{
			shape: singleShape('customer'),
			log: (_, result) => ({ customerId: result.customer.id ?? 0 }),
		},
	);

export const update: RepairshoprEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		(parsed) => {
			const { customer_id: customerId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/customers/${segment(customerId)}`,
				replayable: false,
				body: customerBody(rest),
			};
		},
		{
			shape: singleShape('customer'),
			log: (parsed) => ({ customerId: parsed.customer_id }),
		},
	);

export const remove: RepairshoprEndpoints['customersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.delete',
			input: Inputs.customersDelete,
			output: Outputs.customersDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/customers/${segment(parsed.customer_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('customer_id'),
			log: (parsed) => ({ customerId: parsed.customer_id }),
		},
	);
