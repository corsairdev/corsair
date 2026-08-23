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
	>(`${input.parent}/productSets`, ctx, {
		method: 'POST',
		body: input.productSet,
		query: { productSetId: input.productSetId },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.create',
		{ parent: input.parent, productSetId: input.productSetId },
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
	>(input.name, ctx, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.get',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const list: GoogleCloudVisionEndpoints['productSetsList'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['productSetsList']
	>(`${input.parent}/productSets`, ctx, {
		method: 'GET',
		query: { pageSize: input.pageSize, pageToken: input.pageToken },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.list',
		{ parent: input.parent },
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
	>(input.name, ctx, {
		method: 'PATCH',
		body: input.productSet,
		query: { updateMask: input.updateMask },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.productSets.update',
		{ name: input.name, updateMask: input.updateMask },
		'completed',
	);
	return response;
};

export const deleteSet: GoogleCloudVisionEndpoints['productSetsDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsDelete']
		>(input.name, ctx, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.delete',
			{ name: input.name },
			'completed',
		);
		return response;
	};

export const importSets: GoogleCloudVisionEndpoints['productSetsImport'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsImport']
		>(`${input.parent}/productSets:import`, ctx, {
			method: 'POST',
			body: { inputConfig: input.inputConfig },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.import',
			{
				parent: input.parent,
				csvFileUri: input.inputConfig.gcsSource.csvFileUri,
			},
			'completed',
		);
		return response;
	};

export const addProduct: GoogleCloudVisionEndpoints['productSetsAddProduct'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsAddProduct']
		>(`${input.name}:addProduct`, ctx, {
			method: 'POST',
			body: { product: input.product },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.addProduct',
			{ name: input.name, product: input.product },
			'completed',
		);
		return response;
	};

export const removeProduct: GoogleCloudVisionEndpoints['productSetsRemoveProduct'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsRemoveProduct']
		>(`${input.name}:removeProduct`, ctx, {
			method: 'POST',
			body: { product: input.product },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.removeProduct',
			{ name: input.name, product: input.product },
			'completed',
		);
		return response;
	};

export const listProducts: GoogleCloudVisionEndpoints['productSetsListProducts'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['productSetsListProducts']
		>(`${input.name}/products`, ctx, {
			method: 'GET',
			query: { pageSize: input.pageSize, pageToken: input.pageToken },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.productSets.listProducts',
			{ name: input.name },
			'completed',
		);
		return response;
	};
