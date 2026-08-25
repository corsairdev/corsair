import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramBoundEndpoints, InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const publish: InstagramEndpoints['PublishInstagramMedia'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['PublishInstagramMedia']
	>(`/${input.ig_id}/media_publish`, ctx, {
		method: 'POST',
		body: {
			creation_id: input.creation_id,
		},
	});

	if (result.id) {
		const endpoints = ctx.endpoints as InstagramBoundEndpoints;
		await endpoints.media.get({
			media_id: result.id,
		});
	}

	await logEventFromContext(
		ctx,
		'instagram.publish.publish_content',
		{ ...input },
		'completed',
	);

	return result;
};

export const createPost: InstagramEndpoints['CreatePost'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['CreatePost']
	>(`/${input.ig_id}/media_publish`, ctx, {
		method: 'POST',
		body: {
			creation_id: input.creation_id,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.publish.createPost',
		{ ...input },
		'completed',
	);

	return result;
};

export const publishIgUserMedia: InstagramEndpoints['PublishIgUserMedia'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['PublishIgUserMedia']
		>(`/${input.ig_id}/media_publish`, ctx, {
			method: 'POST',
			body: {
				creation_id: input.creation_id,
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.publish.publishIgUserMedia',
			{ ...input },
			'completed',
		);

		return result;
	};
