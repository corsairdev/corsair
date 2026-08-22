import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const create: GoogleCloudVisionEndpoints['referenceImagesCreate'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['referenceImagesCreate']
		>(`${input.parent}/referenceImages`, ctx.key, {
			method: 'POST',
			body: input.referenceImage,
			query: { referenceImageId: input.referenceImageId },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.referenceImages.create',
			{ ...input },
			'completed',
		);
		return response;
	};

export const get: GoogleCloudVisionEndpoints['referenceImagesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['referenceImagesGet']
	>(input.name, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.referenceImages.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteImage: GoogleCloudVisionEndpoints['referenceImagesDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['referenceImagesDelete']
		>(input.name, ctx.key, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.referenceImages.delete',
			{ ...input },
			'completed',
		);
		return response;
	};

export const list: GoogleCloudVisionEndpoints['referenceImagesList'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['referenceImagesList']
	>(`${input.parent}/referenceImages`, ctx.key, {
		method: 'GET',
		query: { pageSize: input.pageSize, pageToken: input.pageToken },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.referenceImages.list',
		{ ...input },
		'completed',
	);
	return response;
};
