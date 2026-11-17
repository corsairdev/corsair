import type { SimpleroEndpoints } from '..';
import { segment } from '../client';
import { call, compact, dataId, without } from './shared';
import {
	SimpleroEndpointInputSchemas as Inputs,
	SimpleroEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimpleroEndpoints['productsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/api/v2/products', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: SimpleroEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/api/v2/products/${segment(id)}` }),
		{ log: ({ id }) => ({ productId: id }) },
	);

export const create: SimpleroEndpoints['productsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.create',
			input: Inputs.productsCreate,
			output: Outputs.productsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v2/products', body }),
		{ log: (_, result) => ({ productId: dataId(result) }) },
	);

export const update: SimpleroEndpoints['productsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.update',
			input: Inputs.productsUpdate,
			output: Outputs.productsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/v2/products/${segment(parsed.id)}`,
			body: compact(without(parsed)),
		}),
		{ log: ({ id }) => ({ productId: id }) },
	);
