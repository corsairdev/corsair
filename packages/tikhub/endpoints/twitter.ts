import type { TikHubEndpoints } from '..';
import { call } from './call';

export const getUserProfile: TikHubEndpoints['twitterGetUserProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'twitterGetUserProfile',
		'twitter.getUserProfile',
		'/api/v1/twitter/web/fetch_user_profile',
		input,
	);

export const getUserTweets: TikHubEndpoints['twitterGetUserTweets'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'twitterGetUserTweets',
		'twitter.getUserTweets',
		'/api/v1/twitter/web/fetch_user_post_tweet',
		input,
	);

export const searchTweets: TikHubEndpoints['twitterSearchTweets'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'twitterSearchTweets',
		'twitter.searchTweets',
		'/api/v1/twitter/web/fetch_search_timeline',
		input,
	);

export const getTweet: TikHubEndpoints['twitterGetTweet'] = (ctx, input) =>
	call(
		ctx,
		'twitterGetTweet',
		'twitter.getTweet',
		'/api/v1/twitter/web/fetch_tweet_detail',
		input,
	);
