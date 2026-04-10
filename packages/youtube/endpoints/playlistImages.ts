import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const list: YoutubeEndpoints['playlistImagesList'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistImagesList']
	>('/playlistImages', ctx.key, {
		method: 'GET',
		query: {
			part: input.part ?? 'snippet',
			...(input.id && { id: input.id }),
			...(input.parent && { parent: input.parent }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.onBehalfOfContentOwner && {
				onBehalfOfContentOwner: input.onBehalfOfContentOwner,
			}),
			...(input.onBehalfOfContentOwnerChannel && {
				onBehalfOfContentOwnerChannel: input.onBehalfOfContentOwnerChannel,
			}),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.playlistImages.list',
		{ parent: input.parent },
		'completed',
	);
	return response;
};
