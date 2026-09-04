import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['bucketList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketList']
	>('buckets', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['bucketCreate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketCreate']
	>('buckets', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['bucketGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketGet']
	>(`buckets/${input.bucket_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['bucketUpdate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketUpdate']
	>(`buckets/${input.bucket_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['bucketDelete'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketDelete']
	>(`buckets/${input.bucket_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const listAssets: GriptapeEndpoints['bucketListAssets'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketListAssets']
	>(`buckets/${input.bucket_id}/assets`, ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
			prefix: input.prefix,
			postfix: input.postfix,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.listAssets',
		{ ...input },
		'completed',
	);

	return response;
};

export const getAsset: GriptapeEndpoints['bucketGetAsset'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketGetAsset']
	>(`buckets/${input.bucket_id}/assets/${input.name}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.getAsset',
		{ ...input },
		'completed',
	);

	return response;
};

export const createAsset: GriptapeEndpoints['bucketCreateAsset'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketCreateAsset']
	>(`buckets/${input.bucket_id}/assets`, ctx.key, {
		method: 'PUT',
		body: { name: input.name, ...(input.body ?? {}) },
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.createAsset',
		{ ...input },
		'completed',
	);

	return response;
};

export const deleteAsset: GriptapeEndpoints['bucketDeleteAsset'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketDeleteAsset']
	>(`buckets/${input.bucket_id}/assets/${input.name}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.deleteAsset',
		{ ...input },
		'completed',
	);

	return response;
};

export const assetUrl: GriptapeEndpoints['bucketAssetUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['bucketAssetUrl']
	>(`buckets/${input.bucket_id}/asset-urls/${input.name}`, ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.bucket.assetUrl',
		{ ...input },
		'completed',
	);

	return response;
};
