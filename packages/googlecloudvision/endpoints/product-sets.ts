import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const create: GoogleCloudVisionEndpoints['productSetsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productSetsCreate']
	>(`${input.parent}/productSets`, ctx.key, {
		method: 'POST',
		body: input,
		query: { productSetId: input.productSetId },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: GoogleCloudVisionEndpoints['productSetsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productSetsGet']
	>(input.name, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: GoogleCloudVisionEndpoints['productSetsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productSetsUpdate']
	>(input.name, ctx.key, {
		method: 'PATCH',
		body: input.productSet,
		query: { updateMask: input.updateMask },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteSet: GoogleCloudVisionEndpoints['productSetsDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsDelete']
		>(input.name, ctx.key, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.delete',
			{ ...input },
			'completed',
		);
		return response;
	};

export const importSets: GoogleCloudVisionEndpoints['productSetsImport'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsImport']
		>(`${input.parent}/productSets:import`, ctx.key, {
			method: 'POST',
			body: { inputConfig: input.inputConfig },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.import',
			{ ...input },
			'completed',
		);
		return response;
	};

export const addProduct: GoogleCloudVisionEndpoints['productSetsAddProduct'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsAddProduct']
		>(`${input.name}:addProduct`, ctx.key, {
			method: 'POST',
			body: { product: input.product },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.addProduct',
			{ ...input },
			'completed',
		);
		return response;
	};

export const removeProduct: GoogleCloudVisionEndpoints['productSetsRemoveProduct'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsRemoveProduct']
		>(`${input.name}:removeProduct`, ctx.key, {
			method: 'POST',
			body: { product: input.product },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.removeProduct',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listProducts: GoogleCloudVisionEndpoints['productSetsListProducts'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsListProducts']
		>(`${input.name}/products`, ctx.key, {
			method: 'GET',
			query: { pageSize: input.pageSize, pageToken: input.pageToken },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.listProducts',
			{ ...input },
			'completed',
		);
		return response;
	};
