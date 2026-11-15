import { logEventFromContext } from 'corsair/core';
import { makePipedriveRequest } from '../client';
import type { PipedriveEndpoints } from '../index';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './types';

type QueryScalar = string | number | boolean | undefined;

function toQuery(
	input: Record<string, QueryScalar | string[] | number[]>,
): Record<string, QueryScalar> {
	return Object.fromEntries(
		Object.entries(input).map(([key, value]) => [
			key,
			Array.isArray(value) ? value.join(',') : value,
		]),
	);
}

function authType(ctx: Parameters<PipedriveEndpoints['productList']>[0]) {
	return ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key';
}

export const listProducts: PipedriveEndpoints['productList'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.productList.parse(input);
	const response = await makePipedriveRequest(
		'/products',
		ctx.key,
		authType(ctx),
		{
			method: 'GET',
			query: toQuery(parsedInput),
		},
	);
	const parsed = PipedriveEndpointOutputSchemas.productList.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.products.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const createProduct: PipedriveEndpoints['productCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.productCreate.parse(input);
	const response = await makePipedriveRequest(
		'/products',
		ctx.key,
		authType(ctx),
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = PipedriveEndpointOutputSchemas.productCreate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.products.create', {}, 'completed');
	return parsed;
};

export const searchProducts: PipedriveEndpoints['productSearch'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.productSearch.parse(input);
	const response = await makePipedriveRequest(
		'/products/search',
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(parsedInput) },
	);
	const parsed = PipedriveEndpointOutputSchemas.productSearch.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.products.search',
		{ count: parsed.data?.items?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getProduct: PipedriveEndpoints['productGet'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.productGet.parse(input);
	const response = await makePipedriveRequest(
		`/products/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'GET' },
	);
	const parsed = PipedriveEndpointOutputSchemas.productGet.parse(response);
	await logEventFromContext(ctx, 'pipedrive.products.get', {}, 'completed');
	return parsed;
};

export const updateProduct: PipedriveEndpoints['productUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.productUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makePipedriveRequest(
		`/products/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'PATCH', body },
	);
	const parsed = PipedriveEndpointOutputSchemas.productUpdate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.products.update', {}, 'completed');
	return parsed;
};

export const deleteProduct: PipedriveEndpoints['productDelete'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.productDelete.parse(input);
	const response = await makePipedriveRequest(
		`/products/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'DELETE' },
	);
	const parsed = PipedriveEndpointOutputSchemas.productDelete.parse(response);
	await logEventFromContext(ctx, 'pipedrive.products.delete', {}, 'completed');
	return parsed;
};

export const duplicateProduct: PipedriveEndpoints['productDuplicate'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.productDuplicate.parse(input);
	const response = await makePipedriveRequest(
		`/products/${id}/duplicate`,
		ctx.key,
		authType(ctx),
		{ method: 'POST' },
	);
	const parsed =
		PipedriveEndpointOutputSchemas.productDuplicate.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.products.duplicate',
		{},
		'completed',
	);
	return parsed;
};

export const listProductVariations: PipedriveEndpoints['productVariationList'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.productVariationList.parse(input);
		const { id, ...query } = parsedInput;
		const response = await makePipedriveRequest(
			`/products/${id}/variations`,
			ctx.key,
			authType(ctx),
			{ method: 'GET', query: toQuery(query) },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productVariationList.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.variations.list',
			{ count: parsed.data?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const createProductVariation: PipedriveEndpoints['productVariationCreate'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.productVariationCreate.parse(input);
		const { id, ...body } = parsedInput;
		const response = await makePipedriveRequest(
			`/products/${id}/variations`,
			ctx.key,
			authType(ctx),
			{ method: 'POST', body },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productVariationCreate.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.variations.create',
			{},
			'completed',
		);
		return parsed;
	};

export const updateProductVariation: PipedriveEndpoints['productVariationUpdate'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.productVariationUpdate.parse(input);
		const { id, product_variation_id, ...body } = parsedInput;
		const response = await makePipedriveRequest(
			`/products/${id}/variations/${product_variation_id}`,
			ctx.key,
			authType(ctx),
			{ method: 'PATCH', body },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productVariationUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.variations.update',
			{},
			'completed',
		);
		return parsed;
	};

export const deleteProductVariation: PipedriveEndpoints['productVariationDelete'] =
	async (ctx, input) => {
		const { id, product_variation_id } =
			PipedriveEndpointInputSchemas.productVariationDelete.parse(input);
		const response = await makePipedriveRequest(
			`/products/${id}/variations/${product_variation_id}`,
			ctx.key,
			authType(ctx),
			{ method: 'DELETE' },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productVariationDelete.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.variations.delete',
			{},
			'completed',
		);
		return parsed;
	};

export const getProductImage: PipedriveEndpoints['productImageGet'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.productImageGet.parse(input);
	const response = await makePipedriveRequest(
		`/products/${id}/images`,
		ctx.key,
		authType(ctx),
		{ method: 'GET' },
	);
	const parsed = PipedriveEndpointOutputSchemas.productImageGet.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.products.images.get',
		{},
		'completed',
	);
	return parsed;
};

async function sendProductImage(
	ctx: Parameters<PipedriveEndpoints['productImageUpload']>[0],
	input: Parameters<PipedriveEndpoints['productImageUpload']>[1],
	method: 'POST' | 'PUT',
) {
	const parsedInput =
		PipedriveEndpointInputSchemas.productImageUpload.parse(input);
	const formData = new FormData();
	formData.append('data', parsedInput.data);
	const response = await makePipedriveRequest(
		`/products/${parsedInput.id}/images`,
		ctx.key,
		authType(ctx),
		{ method, body: formData },
	);
	return method === 'POST'
		? PipedriveEndpointOutputSchemas.productImageUpload.parse(response)
		: PipedriveEndpointOutputSchemas.productImageUpdate.parse(response);
}

export const uploadProductImage: PipedriveEndpoints['productImageUpload'] =
	async (ctx, input) => {
		const parsed = await sendProductImage(ctx, input, 'POST');
		await logEventFromContext(
			ctx,
			'pipedrive.products.images.upload',
			{},
			'completed',
		);
		return parsed;
	};

export const updateProductImage: PipedriveEndpoints['productImageUpdate'] =
	async (ctx, input) => {
		const parsed = await sendProductImage(ctx, input, 'PUT');
		await logEventFromContext(
			ctx,
			'pipedrive.products.images.update',
			{},
			'completed',
		);
		return parsed;
	};

export const deleteProductImage: PipedriveEndpoints['productImageDelete'] =
	async (ctx, input) => {
		const { id } =
			PipedriveEndpointInputSchemas.productImageDelete.parse(input);
		const response = await makePipedriveRequest(
			`/products/${id}/images`,
			ctx.key,
			authType(ctx),
			{ method: 'DELETE' },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productImageDelete.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.images.delete',
			{},
			'completed',
		);
		return parsed;
	};

export const listProductFollowers: PipedriveEndpoints['productFollowerList'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.productFollowerList.parse(input);
		const { id, ...query } = parsedInput;
		const response = await makePipedriveRequest(
			`/products/${id}/followers`,
			ctx.key,
			authType(ctx),
			{ method: 'GET', query: toQuery(query) },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productFollowerList.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.followers.list',
			{ count: parsed.data?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const addProductFollower: PipedriveEndpoints['productFollowerCreate'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.productFollowerCreate.parse(input);
		const { id, user_id } = parsedInput;
		const response = await makePipedriveRequest(
			`/products/${id}/followers`,
			ctx.key,
			authType(ctx),
			{ method: 'POST', body: { user_id } },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productFollowerCreate.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.followers.create',
			{},
			'completed',
		);
		return parsed;
	};

export const listProductFollowerChangelog: PipedriveEndpoints['productFollowerChangelog'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.productFollowerChangelog.parse(input);
		const { id, ...query } = parsedInput;
		const response = await makePipedriveRequest(
			`/products/${id}/followers/changelog`,
			ctx.key,
			authType(ctx),
			{ method: 'GET', query: toQuery(query) },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productFollowerChangelog.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.followers.changelog',
			{ count: parsed.data?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const deleteProductFollower: PipedriveEndpoints['productFollowerDelete'] =
	async (ctx, input) => {
		const { id, follower_id } =
			PipedriveEndpointInputSchemas.productFollowerDelete.parse(input);
		const response = await makePipedriveRequest(
			`/products/${id}/followers/${follower_id}`,
			ctx.key,
			authType(ctx),
			{ method: 'DELETE' },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.productFollowerDelete.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.products.followers.delete',
			{},
			'completed',
		);
		return parsed;
	};
