import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const create: GoogleCloudVisionEndpoints['productsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productsCreate']
	>(`${input.parent}/products`, ctx, {
		method: 'POST',
		body: input.product,
		query: { productId: input.productId },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.create',
		{ parent: input.parent, productId: input.productId },
		'completed',
	);
	return response;
};

export const get: GoogleCloudVisionEndpoints['productsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productsGet']
	>(input.name, ctx, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.get',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const list: GoogleCloudVisionEndpoints['productsList'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productsList']
	>(`${input.parent}/products`, ctx, {
		method: 'GET',
		query: { pageSize: input.pageSize, pageToken: input.pageToken },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.list',
		{ parent: input.parent },
		'completed',
	);
	return response;
};

export const update: GoogleCloudVisionEndpoints['productsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productsUpdate']
	>(input.name, ctx, {
		method: 'PATCH',
		body: input.product,
		query: { updateMask: input.updateMask },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.update',
		{ name: input.name, updateMask: input.updateMask },
		'completed',
	);
	return response;
};

export const deleteProduct: GoogleCloudVisionEndpoints['productsDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productsDelete']
		>(input.name, ctx, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.products.delete',
			{ name: input.name },
			'completed',
		);
		return response;
	};

export const purge: GoogleCloudVisionEndpoints['productsPurge'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productsPurge']
	>(`${input.parent}/products:purge`, ctx, {
		method: 'POST',
		body: {
			productSetPurgeConfig: input.productSetPurgeConfig,
			deleteOrphanProducts: input.deleteOrphanProducts,
			force: input.force,
		},
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.purge',
		{
			parent: input.parent,
			productSetId: input.productSetPurgeConfig?.productSetId,
			deleteOrphanProducts: input.deleteOrphanProducts,
		},
		'completed',
	);
	return response;
};
