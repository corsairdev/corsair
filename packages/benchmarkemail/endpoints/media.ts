/**
 * Benchmark Email media endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Image Gallery, Video Gallery, Inbox Checker)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const deleteImage: BenchmarkEmailEndpoints['mediaDeleteImage'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaDeleteImage']
	>(`Images/${encodeURIComponent(input.imageID)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.deleteImage',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteVideo: BenchmarkEmailEndpoints['mediaDeleteVideo'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaDeleteVideo']
	>(`Video/${encodeURIComponent(input.videoID)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.deleteVideo',
		{ ...input },
		'completed',
	);
	return response;
};

export const getVideoDetails: BenchmarkEmailEndpoints['mediaGetVideoDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['mediaGetVideoDetails']
		>(`Video/${encodeURIComponent(input.videoID)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.media.getVideoDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getImages: BenchmarkEmailEndpoints['mediaGetImages'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaGetImages']
	>(`Images/`, ctx.key, {
		method: 'GET',
		query: compactQuery({ page: input.page, pageSize: input.pageSize }),
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.getImages',
		{ ...input },
		'completed',
	);
	return response;
};

export const getImageDetails: BenchmarkEmailEndpoints['mediaGetImageDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['mediaGetImageDetails']
		>(`Images/${encodeURIComponent(input.imageID)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.media.getImageDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getGiphyImages: BenchmarkEmailEndpoints['mediaGetGiphyImages'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['mediaGetGiphyImages']
		>(`Images/Giphy/Images/List`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.media.getGiphyImages',
			{ ...input },
			'completed',
		);
		return response;
	};

export const shareVideo: BenchmarkEmailEndpoints['mediaShareVideo'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaShareVideo']
	>(`Video/${encodeURIComponent(input.videoID)}/Copy`, ctx.key, {
		method: 'POST',
		body: input.data,
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.shareVideo',
		{ ...input },
		'completed',
	);
	return response;
};

export const uploadVideo: BenchmarkEmailEndpoints['mediaUploadVideo'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaUploadVideo']
	>(`Video`, ctx.key, { method: 'POST', body: input.data });

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.uploadVideo',
		{ ...input },
		'completed',
	);
	return response;
};

export const createInbox: BenchmarkEmailEndpoints['mediaCreateInbox'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaCreateInbox']
	>(`Inbox/`, ctx.key, { method: 'POST', body: input.data });

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.createInbox',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteInbox: BenchmarkEmailEndpoints['mediaDeleteInbox'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['mediaDeleteInbox']
	>(`Inbox/${encodeURIComponent(input.id)}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'benchmarkemail.media.deleteInbox',
		{ ...input },
		'completed',
	);
	return response;
};

export const getInboxList: BenchmarkEmailEndpoints['mediaGetInboxList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['mediaGetInboxList']
		>(`Inbox/`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.media.getInboxList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getInboxMasterResult: BenchmarkEmailEndpoints['mediaGetInboxMasterResult'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['mediaGetInboxMasterResult']
		>(`Inbox/${encodeURIComponent(input.id)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.media.getInboxMasterResult',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getInboxDetailResult: BenchmarkEmailEndpoints['mediaGetInboxDetailResult'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['mediaGetInboxDetailResult']
		>(`Inbox/Tests`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.media.getInboxDetailResult',
			{ ...input },
			'completed',
		);
		return response;
	};
