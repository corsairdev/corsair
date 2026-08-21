import { logEventFromContext } from 'corsair/core';
import {
	kagglePath,
	makeKaggleBinaryRequest,
	makeKaggleRequest,
} from '../client';
import type { KaggleEndpoints } from '../index';
import { cacheDatasets } from './persist';
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

	await cacheDatasets(ctx, result);
	await logEventFromContext(ctx, 'kaggle.datasets.list', {}, 'completed');
	return result;
};

export const create: KaggleEndpoints['datasetsCreate'] = async (ctx, input) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsCreate']
	>('/datasets/create/new', ctx.key, {
		method: 'POST',
		// Map the internal metadata shape to the Kaggle wire fields expected by
		// POST /datasets/create/new: ownerSlug, slug, title, licenseName, files.
		body: {
			ownerSlug: input.ownerSlug,
			slug: input.slug,
			title: input.title,
			subtitle: input.subtitle,
			description: input.description,
			isPrivate: input.isPrivate,
			licenseName: input.licenseName,
			files: input.files,
		},
		username: ctx.options.username,
	});

	await cacheDatasets(ctx, result);
	await logEventFromContext(ctx, 'kaggle.datasets.create', {}, 'completed');
	return result;
};

export const createVersion: KaggleEndpoints['datasetsCreateVersion'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsCreateVersion']
	>(
		kagglePath(
			'datasets',
			'create',
			'version',
			input.ownerSlug,
			input.datasetSlug,
		),
		ctx.key,
		{
			method: 'POST',
			body: {
				versionNotes: input.versionNotes,
				files: input.files,
			},
			username: ctx.options.username,
		},
	);

	await logEventFromContext(
		ctx,
		'kaggle.datasets.createVersion',
		{ ownerSlug: input.ownerSlug, datasetSlug: input.datasetSlug },
		'completed',
	);
	return result;
};

export const getMetadata: KaggleEndpoints['datasetsGetMetadata'] = async (
	ctx,
	input,
) => {
	// Kaggle v1: GET /datasets/metadata/{ownerSlug}/{datasetSlug} (verified live — 403 with invalid creds, route exists)
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsGetMetadata']
	>(
		kagglePath('datasets', 'metadata', input.ownerSlug, input.datasetSlug),
		ctx.key,
		{
			method: 'GET',
			username: ctx.options.username,
		},
	);

	await cacheDatasets(ctx, result, `${input.ownerSlug}/${input.datasetSlug}`);
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
	>(
		kagglePath('datasets', 'status', input.ownerSlug, input.datasetSlug),
		ctx.key,
		{
			method: 'GET',
			username: ctx.options.username,
		},
	);

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
	// Kaggle v1: GET /datasets/list/{ownerSlug}/{datasetSlug} (verified live — 403 with invalid creds, route exists)
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['datasetsListFiles']
	>(
		kagglePath('datasets', 'list', input.ownerSlug, input.datasetSlug),
		ctx.key,
		{
			method: 'GET',
			query: {
				datasetVersionNumber: input.datasetVersionNumber,
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
			username: ctx.options.username,
		},
	);

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
	const path = kagglePath(
		'datasets',
		'download',
		input.ownerSlug,
		input.datasetSlug,
	);
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
	const path = kagglePath(
		'datasets',
		'download',
		input.ownerSlug,
		input.datasetSlug,
		input.fileName,
	);
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
