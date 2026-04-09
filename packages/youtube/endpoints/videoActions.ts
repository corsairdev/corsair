import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const rate: YoutubeEndpoints['videoActionsRate'] = async (
	ctx,
	input,
) => {
	await makeYoutubeRequest<void>('/videos/rate', ctx.key, {
		method: 'POST',
		query: { id: input.id, rating: input.rating },
	});

	await logEventFromContext(
		ctx,
		'youtube.videoActions.rate',
		{ id: input.id, rating: input.rating },
		'completed',
	);
	return {
		rating: input.rating,
		success: true,
		video_id: input.id,
		http_status: 204,
	};
};

export const getRating: YoutubeEndpoints['videoActionsGetRating'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['videoActionsGetRating']
	>('/videos/getRating', ctx.key, {
		method: 'GET',
		query: {
			id: input.id,
			...(input.onBehalfOfContentOwner && {
				onBehalfOfContentOwner: input.onBehalfOfContentOwner,
			}),
		},
	});

	// Persist rating info per video in the videos store
	if (response.items && ctx.db.videos) {
		for (const item of response.items) {
			if (!item.videoId) continue;
			try {
				await ctx.db.videos.upsertByEntityId(item.videoId, {
					...item,
					id: item.videoId,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save video rating to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.videoActions.getRating',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const reportAbuse: YoutubeEndpoints['videoActionsReportAbuse'] = async (
	ctx,
	input,
) => {
	await makeYoutubeRequest<void>('/videos/reportAbuse', ctx.key, {
		method: 'POST',
		query: { videoId: input.videoId },
		body: {
			reasonId: input.reasonId,
			...(input.secondaryReasonId && {
				secondaryReasonId: input.secondaryReasonId,
			}),
			...(input.comments && { comments: input.comments }),
			...(input.language && { language: input.language }),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.videoActions.reportAbuse',
		{ videoId: input.videoId },
		'completed',
	);
	return {
		success: true,
		message: `Video ${input.videoId} reported for abuse`,
		http_status: 204,
	};
};

export const listAbuseReasons: YoutubeEndpoints['videoActionsListAbuseReasons'] =
	async (ctx, input) => {
		const response = await makeYoutubeRequest<
			YoutubeEndpointOutputs['videoActionsListAbuseReasons']
		>('/videoAbuseReportReasons', ctx.key, {
			method: 'GET',
			query: {
				part: input.part ?? 'snippet',
				...(input.hl && { hl: input.hl }),
			},
		});

		await logEventFromContext(
			ctx,
			'youtube.videoActions.listAbuseReasons',
			{},
			'completed',
		);
		return response;
	};

export const updateThumbnail: YoutubeEndpoints['videoActionsUpdateThumbnail'] =
	async (ctx, input) => {
		const thumbnailResponse = await fetch(input.thumbnailUrl);
		if (!thumbnailResponse.ok) {
			throw new Error(
				`Failed to download thumbnail image: ${thumbnailResponse.status} ${thumbnailResponse.statusText}`,
			);
		}
		const thumbnailBytes = await thumbnailResponse.arrayBuffer();
		const thumbnailContentType =
			thumbnailResponse.headers.get('content-type') ||
			'application/octet-stream';

		const response = await makeYoutubeRequest<
			YoutubeEndpointOutputs['videoActionsUpdateThumbnail']
		>('/thumbnails/set', ctx.key, {
			method: 'POST',
			query: { videoId: input.videoId },
			body: new Blob([thumbnailBytes], { type: thumbnailContentType }),
			mediaType: thumbnailContentType,
			upload: true,
		});

		// Reflect the updated thumbnail URL in the videos store
		if (ctx.db.videos) {
			try {
				await ctx.db.videos.upsertByEntityId(input.videoId, {
					...response,
					id: input.videoId,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to update video thumbnail in database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'youtube.videoActions.updateThumbnail',
			{ videoId: input.videoId },
			'completed',
		);
		return response;
	};
