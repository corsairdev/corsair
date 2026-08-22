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
	>(`${input.parent}/products`, ctx.key, {
		method: 'POST',
		body: input.product,
		query: { productId: input.productId },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.create',
		{ ...input },
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
	>(input.name, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.get',
		{ ...input },
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
	>(input.name, ctx.key, {
		method: 'PATCH',
		body: input.product,
		query: { updateMask: input.updateMask },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.products.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteProduct: GoogleCloudVisionEndpoints['productsDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productsDelete']
		>(input.name, ctx.key, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.products.delete',
			{ ...input },
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
	>(`${input.parent}/products:purge`, ctx.key, {
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
		{ ...input },
		'completed',
	);
	return response;
};
