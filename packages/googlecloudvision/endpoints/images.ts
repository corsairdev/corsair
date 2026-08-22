import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const annotate: GoogleCloudVisionEndpoints['imagesAnnotate'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['imagesAnnotate']
	>('images:annotate', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'googlecloudvision.images.annotate',
		{ ...input },
		'completed',
	);
	return response;
};

export const asyncBatchAnnotate: GoogleCloudVisionEndpoints['imagesAsyncBatchAnnotate'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['imagesAsyncBatchAnnotate']
		>('images:asyncBatchAnnotate', ctx.key, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'googlecloudvision.images.asyncBatchAnnotate',
			{ ...input },
			'completed',
		);
		return response;
	};

export const locationAnnotate: GoogleCloudVisionEndpoints['imagesLocationAnnotate'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['imagesLocationAnnotate']
		>(`${input.parent}/images:annotate`, ctx.key, {
			method: 'POST',
			body: { requests: input.requests },
		});
		await logEventFromContext(
			ctx,
			'googlecloudvision.images.locationAnnotate',
			{ ...input },
			'completed',
		);
		return response;
	};
