import type { GumroadEndpoints } from '..';
import { call } from './call';

export const list: GumroadEndpoints['productsList'] = (ctx, input) =>
	call(ctx, 'productsList', 'products.list', '/products', input);

export const get: GumroadEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		'productsGet',
		'products.get',
		`/products/${encodeURIComponent(input.id)}`,
		input,
	);
