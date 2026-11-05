import { logEventFromContext } from 'corsair/core';
import { downloadKaggleOutputFile, makeKaggleRequest } from '../client';
import type { KaggleEndpoints } from '../index';
import { cacheKernels } from './persist';
import type { KaggleEndpointOutputs } from './types';

export const list: KaggleEndpoints['kernelsList'] = async (ctx, input) => {
	const result = await makeKaggleRequest<KaggleEndpointOutputs['kernelsList']>(
		'/kernels/list',
		ctx.key,
		{
			method: 'GET',
			query: {
				page: input.page,
				pageSize: input.pageSize,
				search: input.search,
				group: input.group,
				user: input.user,
				language: input.language,
				kernelType: input.kernelType,
				outputType: input.outputType,
				sortBy: input.sortBy,
				dataset: input.dataset,
				competition: input.competition,
				parentKernel: input.parentKernel,
			},
			username: ctx.options.username,
		},
	);

	await cacheKernels(ctx, result);
	await logEventFromContext(ctx, 'kaggle.kernels.list', {}, 'completed');
	return result;
};

export const pull: KaggleEndpoints['kernelsPull'] = async (ctx, input) => {
	const result = await makeKaggleRequest<KaggleEndpointOutputs['kernelsPull']>(
		'/kernels/pull',
		ctx.key,
		{
			method: 'GET',
			query: {
				userName: input.userName,
				kernelSlug: input.kernelSlug,
				metadata: input.metadata,
			},
			username: ctx.options.username,
		},
	);

	await cacheKernels(ctx, result, `${input.userName}/${input.kernelSlug}`);
	await logEventFromContext(
		ctx,
		'kaggle.kernels.pull',
		{ userName: input.userName, kernelSlug: input.kernelSlug },
		'completed',
	);
	return result;
};

export const getStatus: KaggleEndpoints['kernelsGetStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeKaggleRequest<
		KaggleEndpointOutputs['kernelsGetStatus']
	>('/kernels/status', ctx.key, {
		method: 'GET',
		query: {
			userName: input.userName,
			kernelSlug: input.kernelSlug,
		},
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.kernels.getStatus',
		{ userName: input.userName, kernelSlug: input.kernelSlug },
		'completed',
	);
	return result;
};

export const downloadOutput: KaggleEndpoints['kernelsDownloadOutput'] = async (
	ctx,
	input,
) => {
	const listing = await makeKaggleRequest<{
		files?: Array<{ url?: string; fileName?: string; name?: string }>;
		log?: string;
		nextPageToken?: string;
	}>('/kernels/output', ctx.key, {
		method: 'GET',
		query: {
			userName: input.userName,
			kernelSlug: input.kernelSlug,
		},
		username: ctx.options.username,
	});

	const files = [];
	for (const item of listing.files ?? []) {
		if (!item?.url) continue;
		files.push(
			await downloadKaggleOutputFile(item.url, item.fileName ?? item.name),
		);
	}

	const result = {
		files,
		log: listing.log,
		nextPageToken: listing.nextPageToken,
	};

	await logEventFromContext(
		ctx,
		'kaggle.kernels.downloadOutput',
		{
			userName: input.userName,
			kernelSlug: input.kernelSlug,
			fileCount: files.length,
			size: files.reduce((sum, file) => sum + file.size, 0),
		},
		'completed',
	);
	return result;
};

export const listOutputFiles: KaggleEndpoints['kernelsListOutputFiles'] =
	async (ctx, input) => {
		// Kaggle /kernels/output returns the run-output artefacts (files array
		// with GCS URLs + log). /kernels/files is a different endpoint that lists
		// the kernel's source/input files, not its run output.
		const result = await makeKaggleRequest<
			KaggleEndpointOutputs['kernelsListOutputFiles']
		>('/kernels/output', ctx.key, {
			method: 'GET',
			query: {
				userName: input.userName,
				kernelSlug: input.kernelSlug,
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
			username: ctx.options.username,
		});

		await logEventFromContext(
			ctx,
			'kaggle.kernels.listOutputFiles',
			{ userName: input.userName, kernelSlug: input.kernelSlug },
			'completed',
		);
		return result;
	};
