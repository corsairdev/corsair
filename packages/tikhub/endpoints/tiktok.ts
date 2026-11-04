import type { TikHubEndpoints } from '..';
import { call } from './call';

export const searchVideos: TikHubEndpoints['tiktokSearchVideos'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'tiktokSearchVideos',
		'tiktok.searchVideos',
		'/api/v1/tiktok/app/v3/fetch_video_search_result',
		input,
	);

export const getUserProfile: TikHubEndpoints['tiktokGetUserProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'tiktokGetUserProfile',
		'tiktok.getUserProfile',
		'/api/v1/tiktok/web/fetch_user_profile',
		input,
	);

export const getVideo: TikHubEndpoints['tiktokGetVideo'] = (ctx, input) =>
	call(
		ctx,
		'tiktokGetVideo',
		'tiktok.getVideo',
		'/api/v1/tiktok/app/v3/fetch_one_video',
		input,
	);

export const getUserVideos: TikHubEndpoints['tiktokGetUserVideos'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'tiktokGetUserVideos',
		'tiktok.getUserVideos',
		'/api/v1/tiktok/app/v3/fetch_user_post_videos',
		input,
	);

export const getVideoComments: TikHubEndpoints['tiktokGetVideoComments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'tiktokGetVideoComments',
		'tiktok.getVideoComments',
		'/api/v1/tiktok/app/v3/fetch_video_comments',
		input,
	);

export const getHashtag: TikHubEndpoints['tiktokGetHashtag'] = (ctx, input) =>
	call(
		ctx,
		'tiktokGetHashtag',
		'tiktok.getHashtag',
		'/api/v1/tiktok/web/fetch_tag_detail',
		input,
	);

export const getHashtagVideos: TikHubEndpoints['tiktokGetHashtagVideos'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'tiktokGetHashtagVideos',
		'tiktok.getHashtagVideos',
		'/api/v1/tiktok/app/v3/fetch_hashtag_video_list',
		input,
	);
