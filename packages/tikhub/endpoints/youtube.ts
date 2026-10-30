import type { TikHubEndpoints } from '..';
import { call } from './call';

export const getVideo: TikHubEndpoints['youtubeGetVideo'] = (ctx, input) =>
	call(
		ctx,
		'youtubeGetVideo',
		'youtube.getVideo',
		'/api/v1/youtube/web_v2/get_video_info_v2',
		input,
	);

export const search: TikHubEndpoints['youtubeSearch'] = (ctx, input) =>
	call(
		ctx,
		'youtubeSearch',
		'youtube.search',
		'/api/v1/youtube/web_v2/get_general_search_v2',
		input,
	);

export const getChannelVideos: TikHubEndpoints['youtubeGetChannelVideos'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'youtubeGetChannelVideos',
		'youtube.getChannelVideos',
		'/api/v1/youtube/web_v2/get_channel_videos',
		input,
	);
