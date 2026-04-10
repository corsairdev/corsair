import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const get: YoutubeEndpoints['videosGet'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['videosGet']
	>('/videos', ctx.key, {
		method: 'GET',
		query: {
			id: input.video_id,
			part: input.part ?? 'snippet,status,statistics,contentDetails',
		},
	});

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					...item.snippet,
					...item.statistics,
					...item.status,
					...item.contentDetails,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.videos.get',
		{ video_id: input.video_id },
		'completed',
	);
	return response;
};

export const getBatch: YoutubeEndpoints['videosGetBatch'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['videosGetBatch']
	>('/videos', ctx.key, {
		method: 'GET',
		query: {
			id: input.id.join(','),
			part: (
				input.parts ?? ['snippet', 'status', 'statistics', 'contentDetails']
			).join(','),
			...(input.hl && { hl: input.hl }),
		},
	});

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					...item.snippet,
					...item.statistics,
					...item.status,
					...item.contentDetails,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.videos.getBatch',
		{ count: input.id.length },
		'completed',
	);
	return response;
};

export const list: YoutubeEndpoints['videosList'] = async (ctx, input) => {
	const part = input.part ?? 'snippet';
	let nextPageToken: string | undefined;
	let prevPageToken: string | undefined;
	let pageInfo: YoutubeEndpointOutputs['videosList']['pageInfo'] | undefined;
	const searchResponse = await makeYoutubeRequest<{
		items?: Array<{ id?: { videoId?: string } }>;
		nextPageToken?: string;
		prevPageToken?: string;
		pageInfo?: YoutubeEndpointOutputs['videosList']['pageInfo'];
	}>('/search', ctx.key, {
		method: 'GET',
		query: {
			type: 'video',
			part: 'id',
			...(input.mine && { forMine: true }),
			...(input.channelId && { channelId: input.channelId }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
		},
	});

	const videoIds = (searchResponse.items ?? [])
		.map((item) => item.id?.videoId)
		.filter((id): id is string => Boolean(id));
	nextPageToken = searchResponse.nextPageToken;
	prevPageToken = searchResponse.prevPageToken;
	pageInfo = searchResponse.pageInfo;

	const response =
		videoIds.length === 0
			? {
					items: [],
					nextPageToken,
					prevPageToken,
					pageInfo,
				}
			: await makeYoutubeRequest<YoutubeEndpointOutputs['videosList']>(
					'/videos',
					ctx.key,
					{
						method: 'GET',
						query: {
							part,
							id: videoIds.join(','),
						},
					},
				);

	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.id, {
					...item.snippet,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save video to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.videos.list',
		{ channelId: input.channelId },
		'completed',
	);
	return response;
};

export const listMostPopular: YoutubeEndpoints['videosListMostPopular'] =
	async (ctx, input) => {
		const response = await makeYoutubeRequest<
			YoutubeEndpointOutputs['videosListMostPopular']
		>('/videos', ctx.key, {
			method: 'GET',
			query: {
				chart: input.chart ?? 'mostPopular',
				part: input.part ?? 'snippet,statistics',
				...(input.pageToken && { pageToken: input.pageToken }),
				...(input.maxResults && { maxResults: input.maxResults }),
				...(input.regionCode && { regionCode: input.regionCode }),
				...(input.videoCategoryId && {
					videoCategoryId: input.videoCategoryId,
				}),
			},
		});

		if (response.items && ctx.db.videos) {
			for (const item of response.items) {
				if (!item.id) continue;
				try {
					await ctx.db.videos.upsertByEntityId(item.id, {
						...item.snippet,
						...item.statistics,
						id: item.id,
					});
				} catch (error) {
					console.warn('[youtube] Failed to save video to database:', error);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'youtube.videos.listMostPopular',
			{},
			'completed',
		);
		return response;
	};

export const update: YoutubeEndpoints['videosUpdate'] = async (ctx, input) => {
	const snippet = {
		...(input.title !== undefined && { title: input.title }),
		...(input.description !== undefined && { description: input.description }),
		...(input.tags !== undefined && { tags: input.tags }),
		...(input.categoryId !== undefined && { categoryId: input.categoryId }),
	};

	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['videosUpdate']
	>('/videos', ctx.key, {
		method: 'PUT',
		query: { part: 'snippet,status' },
		body: {
			id: input.video_id,
			...(Object.keys(snippet).length > 0 && { snippet }),
			...(input.privacy_status !== undefined && {
				status: { privacyStatus: input.privacy_status },
			}),
		},
	});

	if (response.id && ctx.db.videos) {
		try {
			await ctx.db.videos.upsertByEntityId(response.id, {
				...response.snippet,
				...response.status,
				id: response.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to update video in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.videos.update',
		{ video_id: input.video_id },
		'completed',
	);
	return response;
};

export const upload: YoutubeEndpoints['videosUpload'] = async (ctx, input) => {
	// YouTube resumable upload requires multipart/form-data with the actual video bytes.
	// This endpoint passes the file reference to the API which handles the upload flow.
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['videosUpload']
	>('/videos', ctx.key, {
		method: 'POST',
		query: { part: 'snippet,status', uploadType: 'resumable' },
		upload: true,
		body: {
			snippet: {
				title: input.title,
				description: input.description,
				...(input.tags && { tags: input.tags }),
				...(input.categoryId && { categoryId: input.categoryId }),
			},
			status: { privacyStatus: input.privacyStatus },
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.videos.upload',
		{ title: input.title },
		'completed',
	);
	return response;
};

export const uploadMultipart: YoutubeEndpoints['videosUploadMultipart'] =
	async (ctx, input) => {
		// YouTube multipart upload passes video metadata; the actual file upload is handled separately.
		const response = await makeYoutubeRequest<
			YoutubeEndpointOutputs['videosUploadMultipart']
		>('/videos', ctx.key, {
			method: 'POST',
			query: { part: 'snippet,status', uploadType: 'multipart' },
			upload: true,
			body: {
				snippet: {
					title: input.title,
					description: input.description,
					...(input.tags && { tags: input.tags }),
					...(input.categoryId && { categoryId: input.categoryId }),
				},
				status: { privacyStatus: input.privacyStatus },
			},
		});

		if (response.video?.id && ctx.db.videos) {
			try {
				await ctx.db.videos.upsertByEntityId(response.video.id, {
					...response.video.snippet,
					...response.video.status,
					id: response.video.id,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save uploaded video to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'youtube.videos.uploadMultipart',
			{ title: input.title },
			'completed',
		);
		return response;
	};

export const del: YoutubeEndpoints['videosDelete'] = async (ctx, input) => {
	await makeYoutubeRequest<void>('/videos', ctx.key, {
		method: 'DELETE',
		query: { id: input.videoId },
	});

	await logEventFromContext(
		ctx,
		'youtube.videos.delete',
		{ videoId: input.videoId },
		'completed',
	);
	return { deleted: true, video_id: input.videoId, http_status: 204 };
};
