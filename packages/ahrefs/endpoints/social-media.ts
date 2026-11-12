import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type {
	SocialMediaActivityHistoryResponse,
	SocialMediaAuthorsResponse,
	SocialMediaChannelMetricsResponse,
	SocialMediaChannelsResponse,
	SocialMediaCreatePostResponse,
	SocialMediaDeletePostResponse,
	SocialMediaPostMetricsResponse,
	SocialMediaPostsResponse,
	SocialMediaUpdatePostResponse,
} from './types';

export const channels: AhrefsEndpoints['socialMediaChannels'] = (ctx, input) =>
	callAhrefs<SocialMediaChannelsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/social-media/channels',
			event: 'ahrefs.socialMedia.channels',
		},
		input,
	);

export const authors: AhrefsEndpoints['socialMediaAuthors'] = (ctx, input) =>
	callAhrefs<SocialMediaAuthorsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/social-media/authors',
			event: 'ahrefs.socialMedia.authors',
		},
		input,
	);

export const posts: AhrefsEndpoints['socialMediaPosts'] = (ctx, input) =>
	callAhrefs<SocialMediaPostsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/social-media/posts',
			event: 'ahrefs.socialMedia.posts',
			logKeys: ['date_from', 'date_to'],
		},
		input,
	);

export const channelMetrics: AhrefsEndpoints['socialMediaChannelMetrics'] = (
	ctx,
	input,
) =>
	callAhrefs<SocialMediaChannelMetricsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/social-media/channel-metrics',
			event: 'ahrefs.socialMedia.channelMetrics',
			logKeys: ['date_from', 'date_to', 'channel_id'],
		},
		input,
	);

export const postMetrics: AhrefsEndpoints['socialMediaPostMetrics'] = (
	ctx,
	input,
) =>
	callAhrefs<SocialMediaPostMetricsResponse>(
		ctx,
		{
			method: 'GET',
			path: '/social-media/post-metrics',
			event: 'ahrefs.socialMedia.postMetrics',
			logKeys: ['date_from', 'date_to', 'channel_id'],
		},
		input,
	);

export const activityHistory: AhrefsEndpoints['socialMediaActivityHistory'] = (
	ctx,
	input,
) =>
	callAhrefs<SocialMediaActivityHistoryResponse>(
		ctx,
		{
			method: 'GET',
			path: '/social-media/activity-history',
			event: 'ahrefs.socialMedia.activityHistory',
			logKeys: ['post_id'],
		},
		input,
	);

export const createPost: AhrefsEndpoints['socialMediaCreatePost'] = (
	ctx,
	input,
) =>
	callAhrefs<SocialMediaCreatePostResponse>(
		ctx,
		{
			method: 'POST',
			path: '/social-media/post',
			event: 'ahrefs.socialMedia.createPost',
			bodyKeys: [
				'channel_ids',
				'text_content',
				'timing',
				'scheduled_at',
				'auto_comment',
			],
		},
		input,
	);

export const updatePost: AhrefsEndpoints['socialMediaUpdatePost'] = (
	ctx,
	input,
) =>
	callAhrefs<SocialMediaUpdatePostResponse>(
		ctx,
		{
			method: 'PATCH',
			path: '/social-media/post',
			event: 'ahrefs.socialMedia.updatePost',
			bodyKeys: [
				'post_id',
				'channel_ids',
				'text_content',
				'timing',
				'scheduled_at',
				'auto_comment',
			],
			logKeys: ['post_id'],
		},
		input,
	);

export const deletePost: AhrefsEndpoints['socialMediaDeletePost'] = (
	ctx,
	input,
) =>
	callAhrefs<SocialMediaDeletePostResponse>(
		ctx,
		{
			method: 'DELETE',
			path: '/social-media/post',
			event: 'ahrefs.socialMedia.deletePost',
			bodyKeys: ['post_id'],
			logKeys: ['post_id'],
		},
		input,
	);
