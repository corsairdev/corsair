import { logEventFromContext } from '../../utils/events';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const get: YoutubeEndpoints['videosGet'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosGet']>(
		'/videos',
		ctx.key,
		{
			method: 'GET',
			query: {
				id: input.video_id,
				part: input.part ?? 'snippet,status,statistics,contentDetails',
			},
		},
	);

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					id: item.id,
					title: item.snippet?.title,
					description: item.snippet?.description,
					channelId: item.snippet?.channelId,
					publishedAt: item.snippet?.publishedAt,
					privacyStatus: item.status?.privacyStatus,
					duration: item.contentDetails?.duration,
					viewCount: item.statistics?.viewCount,
					likeCount: item.statistics?.likeCount,
					commentCount: item.statistics?.commentCount,
					categoryId: item.snippet?.categoryId,
					tags: item.snippet?.tags,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.videos.get', { video_id: input.video_id }, 'completed');
	return response;
};

export const getBatch: YoutubeEndpoints['videosGetBatch'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosGetBatch']>(
		'/videos',
		ctx.key,
		{
			method: 'GET',
			query: {
				id: input.id.join(','),
				part: (input.parts ?? ['snippet', 'status', 'statistics', 'contentDetails']).join(','),
				...(input.hl ? { hl: input.hl } : {}),
			},
		},
	);

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					id: item.id,
					title: item.snippet?.title,
					description: item.snippet?.description,
					channelId: item.snippet?.channelId,
					publishedAt: item.snippet?.publishedAt,
					privacyStatus: item.status?.privacyStatus,
					duration: item.contentDetails?.duration,
					viewCount: item.statistics?.viewCount,
					likeCount: item.statistics?.likeCount,
					categoryId: item.snippet?.categoryId,
					tags: item.snippet?.tags,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.videos.getBatch', { count: input.id.length }, 'completed');
	return response;
};

export const list: YoutubeEndpoints['videosList'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosList']>(
		'/search',
		ctx.key,
		{
			method: 'GET',
			query: {
				type: 'video',
				part: input.part ?? 'snippet',
				...(input.mine ? { forMine: 'true' } : {}),
				...(input.channelId ? { channelId: input.channelId } : {}),
				...(input.pageToken ? { pageToken: input.pageToken } : {}),
				...(input.maxResults ? { maxResults: input.maxResults } : {}),
			},
		},
	);

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					id: item.id,
					title: item.snippet?.title,
					description: item.snippet?.description,
					channelId: item.snippet?.channelId,
					publishedAt: item.snippet?.publishedAt,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.videos.list', { channelId: input.channelId }, 'completed');
	return response;
};

export const listMostPopular: YoutubeEndpoints['videosListMostPopular'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosListMostPopular']>(
		'/videos',
		ctx.key,
		{
			method: 'GET',
			query: {
				chart: input.chart ?? 'mostPopular',
				part: input.part ?? 'snippet,statistics',
				...(input.pageToken ? { pageToken: input.pageToken } : {}),
				...(input.maxResults ? { maxResults: input.maxResults } : {}),
				...(input.regionCode ? { regionCode: input.regionCode } : {}),
				...(input.videoCategoryId ? { videoCategoryId: input.videoCategoryId } : {}),
			},
		},
	);

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					id: item.id,
					title: item.snippet?.title,
					description: item.snippet?.description,
					channelId: item.snippet?.channelId,
					publishedAt: item.snippet?.publishedAt,
					viewCount: item.statistics?.viewCount,
					likeCount: item.statistics?.likeCount,
					categoryId: item.snippet?.categoryId,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.videos.listMostPopular', {}, 'completed');
	return response;
};

export const update: YoutubeEndpoints['videosUpdate'] = async (ctx, input) => {
	const body: Record<string, unknown> = { id: input.video_id };
	const snippetUpdate: Record<string, unknown> = {};
	if (input.title !== undefined) snippetUpdate.title = input.title;
	if (input.description !== undefined) snippetUpdate.description = input.description;
	if (input.tags !== undefined) snippetUpdate.tags = input.tags;
	if (input.categoryId !== undefined) snippetUpdate.categoryId = input.categoryId;
	if (Object.keys(snippetUpdate).length > 0) body.snippet = snippetUpdate;
	if (input.privacy_status !== undefined) body.status = { privacyStatus: input.privacy_status };

	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosUpdate']>(
		'/videos',
		ctx.key,
		{
			method: 'PUT',
			query: { part: 'snippet,status' },
			body,
		},
	);

	if (response.id && ctx.db.videos) {
		try {
			await ctx.db.videos.upsertByEntityId(response.id, {
				id: response.id,
				title: response.snippet?.title,
				description: response.snippet?.description,
				channelId: response.snippet?.channelId,
				privacyStatus: response.status?.privacyStatus,
				tags: response.snippet?.tags,
				categoryId: response.snippet?.categoryId,
			});
		} catch (error) {
			console.warn('[youtube] Failed to update video in database:', error);
		}
	}

	await logEventFromContext(ctx, 'youtube.videos.update', { video_id: input.video_id }, 'completed');
	return response;
};

export const upload: YoutubeEndpoints['videosUpload'] = async (ctx, input) => {
	// YouTube resumable upload requires multipart/form-data with the actual video bytes.
	// This endpoint passes the file reference to the API which handles the upload flow.
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosUpload']>(
		'/upload/youtube/v3/videos',
		ctx.key,
		{
			method: 'POST',
			query: { part: 'snippet,status', uploadType: 'resumable' },
			body: {
				snippet: {
					title: input.title,
					description: input.description,
					tags: input.tags,
					categoryId: input.categoryId,
				},
				status: { privacyStatus: input.privacyStatus },
			},
		},
	);

	await logEventFromContext(ctx, 'youtube.videos.upload', { title: input.title }, 'completed');
	return response;
};

export const uploadMultipart: YoutubeEndpoints['videosUploadMultipart'] = async (ctx, input) => {
	// YouTube multipart upload passes video metadata; the actual file upload is handled separately.
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videosUploadMultipart']>(
		'/upload/youtube/v3/videos',
		ctx.key,
		{
			method: 'POST',
			query: { part: 'snippet,status', uploadType: 'multipart' },
			body: {
				snippet: {
					title: input.title,
					description: input.description,
					tags: input.tags,
					categoryId: input.categoryId,
				},
				status: { privacyStatus: input.privacyStatus },
			},
		},
	);

	if (response.video?.id && ctx.db.videos) {
		try {
			await ctx.db.videos.upsertByEntityId(response.video.id, {
				id: response.video.id,
				title: response.video.snippet?.title,
				description: response.video.snippet?.description,
				channelId: response.video.snippet?.channelId,
				privacyStatus: response.video.status?.privacyStatus,
			});
		} catch (error) {
			console.warn('[youtube] Failed to save uploaded video to database:', error);
		}
	}

	await logEventFromContext(ctx, 'youtube.videos.uploadMultipart', { title: input.title }, 'completed');
	return response;
};

export const del: YoutubeEndpoints['videosDelete'] = async (ctx, input) => {
	await makeYoutubeRequest<void>('/videos', ctx.key, {
		method: 'DELETE',
		query: { id: input.videoId },
	});

	await logEventFromContext(ctx, 'youtube.videos.delete', { videoId: input.videoId }, 'completed');
	return {
		deleted: true,
		video_id: input.videoId,
		http_status: 204,
	};
};
