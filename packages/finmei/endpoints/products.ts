import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiDeleteResponse,
	FinmeiPaginationMeta,
	FinmeiProduct,
} from './types';
import {
	FinmeiDeleteResponseSchema,
	FinmeiListProductsOutputSchema,
	FinmeiProductOutputSchema,
} from './types';

export const list: FinmeiEndpoints['productsList'] = async (ctx, input) => {
	const query = compactQuery({
		page: input.page,
		per_page: input.per_page,
		search: input.search,
		name: input.name,
		status: input.status,
	});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProduct[];
		meta?: FinmeiPaginationMeta;
	}>('/products', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = FinmeiListProductsOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'products.list', {
		count: parsed.data.length,
		page: input.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['productsCreate'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProduct;
	}>('/products', ctx.key, {
		method: 'POST',
		body: input,
	});

	const parsed = FinmeiProductOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'products.create', {
		id: parsed.data.id,
		name: parsed.data.name,
	});
	return parsed;
};

export const get: FinmeiEndpoints['productsGet'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProduct;
	}>(`/products/${seg(input.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiProductOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'products.get', {
		id: input.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['productsUpdate'] = async (ctx, input) => {
	const { id, ...bodyFields } = input;

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProduct;
	}>(`/products/${seg(id)}`, ctx.key, {
		method: 'PUT',
		body: bodyFields,
	});

	const parsed = FinmeiProductOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'products.update', {
		id,
	});
	return parsed;
};

export const del: FinmeiEndpoints['productsDelete'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/products/${seg(input.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'products.delete', {
		id: input.id,
	});
	return parsed;
};

export const Products = {
	list,
	create,
	get,
	update,
	delete: del,
};
