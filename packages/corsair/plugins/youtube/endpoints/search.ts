import { logEventFromContext } from '../../utils/events';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const youtube: YoutubeEndpoints['searchYouTube'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['searchYouTube']>(
		'/search',
		ctx.key,
		{
			method: 'GET',
			query: {
				q: input.q,
				part: input.part ?? 'snippet',
				...(input.type ? { type: input.type } : {}),
				...(input.pageToken ? { pageToken: input.pageToken } : {}),
				...(input.maxResults ? { maxResults: input.maxResults } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'youtube.search.youtube', { q: input.q }, 'completed');
	return response;
};
