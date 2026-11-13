import { makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiDeleteResponse,
	FinmeiPaginationMeta,
	FinmeiProduct,
} from './types';
import {
	FinmeiCreateProductInputSchema,
	FinmeiDeleteProductInputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiGetProductInputSchema,
	FinmeiListProductsInputSchema,
	FinmeiListProductsOutputSchema,
	FinmeiProductOutputSchema,
	FinmeiUpdateProductInputSchema,
} from './types';

export const list: FinmeiEndpoints['productsList'] = async (ctx, input) => {
	const parsedInput = FinmeiListProductsInputSchema.parse(input);
	const query = compactQuery({
		page: parsedInput.page,
		per_page: parsedInput.per_page,
		search: parsedInput.search,
		name: parsedInput.name,
		status: parsedInput.status,
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
		page: parsedInput.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['productsCreate'] = async (ctx, input) => {
	const parsedInput = FinmeiCreateProductInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProduct;
	}>('/products', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = FinmeiProductOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'products.create', {
		id: parsed.data.id,
		name: parsed.data.name,
	});
	return parsed;
};

export const get: FinmeiEndpoints['productsGet'] = async (ctx, input) => {
	const parsedInput = FinmeiGetProductInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiProduct;
	}>(`/products/${seg(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiProductOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'products.get', {
		id: parsedInput.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['productsUpdate'] = async (ctx, input) => {
	const parsedInput = FinmeiUpdateProductInputSchema.parse(input);
	const { id, ...bodyFields } = parsedInput;

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
	const parsedInput = FinmeiDeleteProductInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/products/${seg(parsedInput.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'products.delete', {
		id: parsedInput.id,
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
