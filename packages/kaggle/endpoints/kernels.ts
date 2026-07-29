import { logEventFromContext } from 'corsair/core';
import { makeKaggleBinaryRequest, makeKaggleRequest } from '../client';
import type { KaggleEndpoints } from '../index';
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
	const result = await makeKaggleBinaryRequest('/kernels/output', ctx.key, {
		method: 'GET',
		query: {
			userName: input.userName,
			kernelSlug: input.kernelSlug,
		},
		username: ctx.options.username,
	});

	await logEventFromContext(
		ctx,
		'kaggle.kernels.downloadOutput',
		{
			userName: input.userName,
			kernelSlug: input.kernelSlug,
			size: result.size,
		},
		'completed',
	);
	return result;
};

export const listOutputFiles: KaggleEndpoints['kernelsListOutputFiles'] =
	async (ctx, input) => {
		const result = await makeKaggleRequest<
			KaggleEndpointOutputs['kernelsListOutputFiles']
		>('/kernels/files', ctx.key, {
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
