import { makePageFacebookRequest } from '../client';
import type { FacebookEndpoints } from '../index';
import {
	buildPaginationQuery,
	logFacebookEvent,
	omitUndefined,
} from './shared';
import type { FacebookEndpointOutputs } from './types';

export const createPost: FacebookEndpoints['createVideoPost'] = async (
	ctx,
	input,
) => {
	const {
		page_id,
		file_url,
		title,
		description,
		published,
		scheduled_publish_time,
	} = input;
	const shouldSchedule = scheduled_publish_time !== undefined;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['createVideoPost']
	>(`/${page_id}/videos`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({
			file_url,
			title,
			description,
			published: published ?? (shouldSchedule ? false : true),
			scheduled_publish_time,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.videos.createPost', { ...input });
	return result;
};

export const list: FacebookEndpoints['getPageVideos'] = async (ctx, input) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPageVideos']
	>(`/${input.page_id}/videos`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields:
				input.fields ??
				'id,title,description,created_time,source,length,permalink_url,status',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const video of result.data) {
			if (!video.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(video.id, {
					videoId: video.id,
					pageId: input.page_id,
					title: video.title,
					description: video.description,
					source: video.source,
					permalinkUrl: video.permalink_url,
					createdTime: video.created_time,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.videos.list', { ...input });
	return result;
};

/** @deprecated Prefer resumable upload via the Graph API for large video files. */
export const upload: FacebookEndpoints['uploadVideo'] = async (ctx, input) => {
	const { page_id, file_url, title, description, published } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['uploadVideo']
	>(`/${page_id}/videos`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({ file_url, title, description, published }),
	});

	await logFacebookEvent(ctx, 'facebook.videos.upload', { ...input });
	return result;
};
