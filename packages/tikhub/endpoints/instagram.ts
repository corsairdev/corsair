import type { TikHubEndpoints } from '..';
import { call } from './call';

export const getUserByUsername: TikHubEndpoints['instagramGetUserByUsername'] =
	(ctx, input) =>
		call(
			ctx,
			'instagramGetUserByUsername',
			'instagram.getUserByUsername',
			'/api/v1/instagram/v1/fetch_user_info_by_username',
			input,
		);

export const getUserPosts: TikHubEndpoints['instagramGetUserPosts'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'instagramGetUserPosts',
		'instagram.getUserPosts',
		'/api/v1/instagram/v1/fetch_user_posts',
		input,
	);

export const getUserReels: TikHubEndpoints['instagramGetUserReels'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'instagramGetUserReels',
		'instagram.getUserReels',
		'/api/v1/instagram/v1/fetch_user_reels',
		input,
	);

export const getPostByUrl: TikHubEndpoints['instagramGetPostByUrl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'instagramGetPostByUrl',
		'instagram.getPostByUrl',
		'/api/v1/instagram/v1/fetch_post_by_url',
		input,
	);

export const getPostComments: TikHubEndpoints['instagramGetPostComments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'instagramGetPostComments',
		'instagram.getPostComments',
		'/api/v1/instagram/v2/fetch_post_comments',
		input,
	);
