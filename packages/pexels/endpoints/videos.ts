import type { PexelsEndpoints } from '..';
import { call } from './call';
import {
	PexelsEndpointInputSchemas as Inputs,
	PexelsEndpointOutputSchemas as Outputs,
} from './types';

export const search: PexelsEndpoints['videosSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.search',
			input: Inputs.videosSearch,
			output: Outputs.videosSearch,
		},
		input,
		({ query, orientation, ...paging }) => ({
			method: 'GET',
			path: '/videos/search',
			query: { query, orientation, ...paging },
		}),
		{ log: (_, page) => ({ count: page.videos.length }) },
	);

export const get: PexelsEndpoints['videosGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.get',
			input: Inputs.videosGet,
			output: Outputs.videosGet,
		},
		input,
		({ videoId }) => ({ method: 'GET', path: `/videos/videos/${videoId}` }),
		{ log: (_, video) => ({ videoId: video.id ?? undefined }) },
	);

export const popular: PexelsEndpoints['videosPopular'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.popular',
			input: Inputs.videosPopular,
			output: Outputs.videosPopular,
		},
		input,
		({ min_width, min_height, min_duration, max_duration, ...paging }) => ({
			method: 'GET',
			path: '/videos/popular',
			query: { min_width, min_height, min_duration, max_duration, ...paging },
		}),
		{ log: (_, page) => ({ count: page.videos.length }) },
	);
