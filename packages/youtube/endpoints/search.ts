import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const youtube: YoutubeEndpoints['searchYouTube'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['searchYouTube']
	>('/search', ctx.key, {
		method: 'GET',
		query: {
			q: input.q,
			part: input.part ?? 'snippet',
			...(input.type && { type: input.type }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
		},
	});

	// Persist video-type search results to the videos store for later retrieval
	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id?.videoId) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id.videoId, {
					...item.snippet,
					id: item.id.videoId,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save search result video to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.search.youtube',
		{ q: input.q },
		'completed',
	);
	return response;
};
