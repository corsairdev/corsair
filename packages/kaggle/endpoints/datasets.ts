import { logEventFromContext } from 'corsair/core';
import { makeKaggleBinaryRequest, makeKaggleRequest } from '../client';
import type { KaggleEndpoints } from '../index';
import type { KaggleEndpointOutputs } from './types';

export const list: KaggleEndpoints['datasetsList'] = async (ctx, input) => {
	const result = await makeKaggleRequest<KaggleEndpointOutputs['datasetsList']>(
		'/datasets/list',
		ctx.key,
		{
			method: 'GET',
			query: {
				search: input.search,
				user: input.user,
				sortBy: input.sortBy,
				size: input.size,
				fileType: input.fileType,
				licenseName: input.licenseName,
				tagIds: input.tagIds,
				page: input.page,
				maxSize: input.maxSize,
				minSize: input.minSize,
			},
			username: ctx.options.username,
		},
	);

	await logEventFromContext(ctx, 'kaggle.datasets.list', {}, 'completed');
	return result;
};

export const create: KaggleEndpoints['datasetsCreate'] = async (ctx, input) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsCreate']
	>('/datasets/create/new', ctx.key, {
		method: 'POST',
		body: input,
		username: ctx.options.username,
	});

	await logEventFromContext(ctx, 'kaggle.datasets.create', {}, 'completed');
	return result;
};

export const createVersion: KaggleEndpoints['datasetsCreateVersion'] = async (
	ctx,
	input,
) => {
	const { ownerSlug, datasetSlug, ...body } = input;
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsCreateVersion']
	>(`/datasets/create/version/${ownerSlug}/${datasetSlug}`, ctx.key, {
		method: 'POST',
		body,
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.datasets.createVersion',
		{ ownerSlug, datasetSlug },
		'completed',
	);
	return result;
};

export const getMetadata: KaggleEndpoints['datasetsGetMetadata'] = async (
	ctx,
	input,
) => {
	// Kaggle v1: GET /datasets/{ownerSlug}/{datasetSlug} (no /view infix)
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsGetMetadata']
	>(`/datasets/${input.ownerSlug}/${input.datasetSlug}`, ctx.key, {
		method: 'GET',
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.datasets.getMetadata',
		{ ownerSlug: input.ownerSlug, datasetSlug: input.datasetSlug },
		'completed',
	);
	return result;
};

export const getStatus: KaggleEndpoints['datasetsGetStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsGetStatus']
	>(`/datasets/status/${input.ownerSlug}/${input.datasetSlug}`, ctx.key, {
		method: 'GET',
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.datasets.getStatus',
		{ ownerSlug: input.ownerSlug, datasetSlug: input.datasetSlug },
		'completed',
	);
	return result;
};

export const listFiles: KaggleEndpoints['datasetsListFiles'] = async (
	ctx,
	input,
) => {
	// Kaggle v1: GET /datasets/{ownerSlug}/{datasetSlug}/files
	// (not /datasets/list/{owner}/{slug}, which collides with the bulk list route)
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsListFiles']
	>(`/datasets/${input.ownerSlug}/${input.datasetSlug}/files`, ctx.key, {
		method: 'GET',
		query: {
			datasetVersionNumber: input.datasetVersionNumber,
			pageSize: input.pageSize,
			pageToken: input.pageToken,
		},
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.datasets.listFiles',
		{ ownerSlug: input.ownerSlug, datasetSlug: input.datasetSlug },
		'completed',
	);
	return result;
};

export const download: KaggleEndpoints['datasetsDownload'] = async (
	ctx,
	input,
) => {
	const path = `/datasets/download/${input.ownerSlug}/${input.datasetSlug}`;
	const result = await makeKaggleBinaryRequest(path, ctx.key, {
		method: 'GET',
		query: { datasetVersionNumber: input.datasetVersionNumber },
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.datasets.download',
		{
			ownerSlug: input.ownerSlug,
			datasetSlug: input.datasetSlug,
			size: result.size,
		},
		'completed',
	);
	return result;
};

export const downloadFile: KaggleEndpoints['datasetsDownloadFile'] = async (
	ctx,
	input,
) => {
	const path = `/datasets/download/${input.ownerSlug}/${input.datasetSlug}/${encodeURIComponent(input.fileName)}`;
	const result = await makeKaggleBinaryRequest(path, ctx.key, {
		method: 'GET',
		query: { datasetVersionNumber: input.datasetVersionNumber },
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.datasets.downloadFile',
		{
			ownerSlug: input.ownerSlug,
			datasetSlug: input.datasetSlug,
			size: result.size,
		},
		'completed',
	);
	return result;
};
