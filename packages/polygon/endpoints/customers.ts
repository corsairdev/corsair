import type { PolygonEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonEndpoints['customersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		({
			status,
			email,
			externalId,
			createdAfter,
			createdBefore,
			limit,
			cursor,
		}) => ({
			method: 'GET',
			path: '/customers',
			query: {
				status,
				email,
				externalId,
				createdAfter,
				createdBefore,
				limit,
				cursor,
			},
		}),
		{
			// Customer records carry personal data, so the count is the safe log.
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const get: PolygonEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ customerId }) => ({
			method: 'GET',
			path: `/customers/${segment(customerId)}`,
		}),
		{ log: ({ customerId }) => ({ customerId }) },
	);

export const create: PolygonEndpoints['customersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
			requiresIdempotencyKey: true,
		},
		input,
		({ idempotencyKey: _ignored, ...body }) => ({
			method: 'POST',
			path: '/customers',
			body,
		}),
		{ log: (_, result) => ({ customerId: result.id ?? undefined }) },
	);

export const update: PolygonEndpoints['customersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		({ customerId, ...body }) => ({
			method: 'PATCH',
			path: `/customers/${segment(customerId)}`,
			body,
		}),
		{ log: ({ customerId }) => ({ customerId }) },
	);

export const remove: PolygonEndpoints['customersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.delete',
			input: Inputs.customersDelete,
			output: Outputs.customersDelete,
		},
		input,
		({ customerId }) => ({
			method: 'DELETE',
			path: `/customers/${segment(customerId)}`,
		}),
		{ log: ({ customerId }) => ({ customerId }) },
	);
