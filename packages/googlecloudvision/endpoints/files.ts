import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const annotate: GoogleCloudVisionEndpoints['filesAnnotate'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['filesAnnotate']
	>('files:annotate', ctx, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'googlecloudvision.files.annotate',
		{ requestCount: input.requests.length },
		'completed',
	);
	return response;
};

export const asyncBatchAnnotate: GoogleCloudVisionEndpoints['filesAsyncBatchAnnotate'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['filesAsyncBatchAnnotate']
		>('files:asyncBatchAnnotate', ctx, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'googlecloudvision.files.asyncBatchAnnotate',
			{ requestCount: input.requests.length },
			'completed',
		);
		return response;
	};
