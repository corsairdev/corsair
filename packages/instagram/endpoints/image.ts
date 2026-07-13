import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const post: InstagramEndpoints['CreateImageContainer'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['CreateImageContainer']
	>(`/${input.ig_id}/media`, ctx, {
		method: 'POST',
		body: {
			image_url: input.image_url,
			is_carousel_item: input.is_carousel_item,
			alt_text: input.alt_text,
			caption: input.caption,
			location_id: input.location_id,
			user_tags: input.user_tags ? JSON.stringify(input.user_tags) : undefined,
			product_tags: input.product_tags
				? JSON.stringify(input.product_tags)
				: undefined,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.image.post',
		{ ...input },
		'completed',
	);

	return result;
};

export const story: InstagramEndpoints['CreateImageStoryContainer'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['CreateImageStoryContainer']
	>(`/${input.ig_id}/media`, ctx, {
		method: 'POST',
		body: {
			image_url: input.image_url,
			media_type: 'STORIES',
			user_tags: input.user_tags?.length
				? JSON.stringify(input.user_tags)
				: undefined,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.image.story',
		{ ...input },
		'completed',
	);

	return result;
};
