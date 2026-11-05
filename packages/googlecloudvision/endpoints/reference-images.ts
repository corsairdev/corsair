import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const create: GoogleCloudVisionEndpoints['referenceImagesCreate'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['referenceImagesCreate']
		>(`${input.parent}/referenceImages`, ctx, {
			method: 'POST',
			body: input.referenceImage,
			query: { referenceImageId: input.referenceImageId },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.referenceImages.create',
			{ parent: input.parent, referenceImageId: input.referenceImageId },
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
	>(input.name, ctx, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.referenceImages.get',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const deleteImage: GoogleCloudVisionEndpoints['referenceImagesDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['referenceImagesDelete']
		>(input.name, ctx, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.referenceImages.delete',
			{ name: input.name },
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
	>(`${input.parent}/referenceImages`, ctx, {
		method: 'GET',
		query: { pageSize: input.pageSize, pageToken: input.pageToken },
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.referenceImages.list',
		{ parent: input.parent },
		'completed',
	);
	return response;
};
