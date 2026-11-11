import type { QuadernoEndpoints } from '..';
import { segment } from '../client';
import { call, requireArray, wrap } from './call';
import {
	QuadernoEndpointInputSchemas as Inputs,
	nextCreatedBefore,
	QuadernoEndpointOutputSchemas as Outputs,
} from './types';

export const list: QuadernoEndpoints['productsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
			toRequest: ({ q, limit, created_before }) => ({
				method: 'GET',
				path: '/items',
				query: { q, limit, created_before },
			}),
		},
		input,
		{
			// The route is `/items` and answers a bare array; the plugin calls the
			// domain object a product, which is what the docs and schemas call it.
			shape: (raw, { limit }) => {
				const products = requireArray(raw, 'products');
				return {
					products,
					next_created_before: nextCreatedBefore(
						products as { id?: number | null }[],
						limit,
					),
				};
			},
			log: (_, result) => ({
				count: result.products.length,
				hasNext: result.next_created_before !== null,
			}),
		},
	);

export const create: QuadernoEndpoints['productsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.create',
			input: Inputs.productsCreate,
			output: Outputs.productsCreate,
			toRequest: (body) => ({ method: 'POST', path: '/items', body }),
		},
		input,
		{
			shape: (raw) => wrap('product', raw),
			log: ({ code }, result) => ({
				productId: result.product.id,
				code,
			}),
		},
	);

export const get: QuadernoEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
			toRequest: ({ id }) => ({
				method: 'GET',
				path: `/items/${segment(id)}`,
			}),
		},
		input,
		{
			shape: (raw) => wrap('product', raw),
			log: ({ id }) => ({ productId: id }),
		},
	);

export const update: QuadernoEndpoints['productsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.update',
			input: Inputs.productsUpdate,
			output: Outputs.productsUpdate,
			toRequest: ({ id, ...body }) => ({
				method: 'PUT',
				path: `/items/${segment(id)}`,
				body,
			}),
		},
		input,
		{
			shape: (raw) => wrap('product', raw),
			log: ({ id }) => ({ productId: id }),
		},
	);

export const remove: QuadernoEndpoints['productsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.delete',
			input: Inputs.productsDelete,
			output: Outputs.productsDelete,
			toRequest: ({ id }) => ({
				method: 'DELETE',
				path: `/items/${segment(id)}`,
			}),
		},
		input,
		{
			shape: () => ({ deleted: true }),
			log: ({ id }) => ({ productId: id }),
		},
	);
