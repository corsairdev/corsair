import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const channels: AhrefsEndpoints['socialMediaChannels'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaChannels',
			method: 'GET',
			path: '/social-media/channels',
			event: 'ahrefs.socialMedia.channels',
		},
		input,
	);

export const authors: AhrefsEndpoints['socialMediaAuthors'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaAuthors',
			method: 'GET',
			path: '/social-media/authors',
			event: 'ahrefs.socialMedia.authors',
		},
		input,
	);

export const posts: AhrefsEndpoints['socialMediaPosts'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaPosts',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaChannelMetrics',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaPostMetrics',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaActivityHistory',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaCreatePost',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaUpdatePost',
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
	callAhrefs(
		ctx,
		{
			endpoint: 'socialMediaDeletePost',
			method: 'DELETE',
			path: '/social-media/post',
			event: 'ahrefs.socialMedia.deletePost',
			bodyKeys: ['post_id'],
			logKeys: ['post_id'],
		},
		input,
	);
